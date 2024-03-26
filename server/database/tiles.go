package database

import (
	"database/sql"
	"fmt"
	"os"
	"runtime"
	"server/types"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

// Generate grid size
func GetGridSize() int {
	// Get the grid size from the GRID_SIZE environment variable
	gridSizeStr := os.Getenv("GRID_SIZE")
	gridSize, err := strconv.Atoi(gridSizeStr)
	if err != nil {
		// Use a default value if GRID_SIZE is not set or is not a valid integer
		gridSize = 50
	}
	return gridSize
}

// CreateTilesTable creates the table for storing tile data if it doesn't exist.
func CreateTilesTable(db *sql.DB) error {
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS tiles (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			locationX INTEGER,
			locationY INTEGER,
			resourceType TEXT,
			resourceQuantity INTEGER,
			resourceQuality INTEGER,
			unit TEXT
		);
	`)
	if err != nil {
		return fmt.Errorf("error creating table: %v", err)
	}
	return nil
}

// InsertTile inserts a single tile into the database.
func InsertTile(tx *sql.Tx, tile types.Tile) error {
	_, err := tx.Exec(`
		INSERT INTO tiles (
			locationX, locationY,
			resourceType, resourceQuantity, resourceQuality,
			unit
		) VALUES (?, ?, ?, ?, ?, ?);
	`,
		tile.Location.X, tile.Location.Y,
		tile.Resource.Type, tile.Resource.Quantity, tile.Resource.Quality,
		tile.Unit,
	)
	if err != nil {
		return fmt.Errorf("error inserting row into the table: %v", err)
	}
	return nil
}

// SaveGridToDatabase saves the grid to an SQLite database.
func SaveGridToDatabase(grid [][]types.Tile, dbName string) error {
	// Open a connection to the SQLite database
	db, err := OpenDatabase(dbName)
	if err != nil {
		return err
	}
	defer db.Close()

	// Drop the table if it exists
	_, err = db.Exec(`DROP TABLE IF EXISTS tiles;`)
	if err != nil {
		return fmt.Errorf("error dropping table: %v", err)
	}

	// Create the table
	if err := CreateTilesTable(db); err != nil {
		return err
	}

	// Start a new transaction
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	// Insert each row into the database
	for i := 0; i < len(grid); i++ {
		for _, tile := range grid[i] {
			if err := InsertTile(tx, tile); err != nil {
				return err
			}
		}
		// Free up the memory used by the row
		grid[i] = nil
		runtime.GC()
	}

	// Commit the transaction
	if err := tx.Commit(); err != nil {
		return err
	}

	fmt.Println("Grid saved to the database successfully.")
	return nil
}

// GetTilesInRange retrieves all tiles within an absolute range of a root coordinate.
func GetTilesInRange(dbName string, rootX, rootY, rangeX, rangeY int) ([]types.Tile, error) {
	// Open a connection to the SQLite database
	db, err := OpenDatabase(dbName)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	query := `
	SELECT locationX, locationY, resourceType, resourceQuantity, resourceQuality, unit
	FROM tiles
	WHERE locationX >= ? AND locationX <= ? AND
		  locationY >= ? AND locationY <= ?
`

	rows, err := db.Query(query, rootX-rangeX, rootX+rangeX, rootY-rangeY, rootY+rangeY)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %v", err)
	}
	defer rows.Close()

	var tiles []types.Tile
	for rows.Next() {
		var tile types.Tile
		var unit sql.NullString // Change this line

		err := rows.Scan(
			&tile.Location.X, &tile.Location.Y,
			&tile.Resource.Type, &tile.Resource.Quantity, &tile.Resource.Quality,
			&unit, // And this line
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}

		if unit.Valid {
			tile.Unit = unit.String // Use unit.String if unit is not NULL
		} else {
			tile.Unit = "" // Use an empty string or another default value if unit is NULL
		}

		tiles = append(tiles, tile)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over rows: %v", err)
	}

	return tiles, nil
}
