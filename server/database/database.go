// database.go
package database

import (
	"database/sql"
	"fmt"
	"server/types"

	_ "github.com/mattn/go-sqlite3"
)

// OpenDatabase opens a connection to the SQLite database.
func OpenDatabase(dbName string) (*sql.DB, error) {
	db, err := sql.Open("sqlite3", dbName)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %v", err)
	}
	return db, nil
}

// CreateTilesTable creates the table for storing tile data. If it exists, it drops the table and creates a new one.
func CreateTilesTable(db *sql.DB) error {
	// Drop the table if it exists
	_, err := db.Exec(`DROP TABLE IF EXISTS tiles;`)
	if err != nil {
		return fmt.Errorf("error dropping table: %v", err)
	}

	// Create the new table
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS tiles (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			locationX INTEGER,
			locationY INTEGER,
			resourceType TEXT,
			resourceQuantity INTEGER,
			resourceQuality INTEGER,
			occupied INTEGER
		);
	`)
	if err != nil {
		return fmt.Errorf("error creating table: %v", err)
	}

	return nil
}

// InsertTile inserts a single tile into the database.
func InsertTile(db *sql.DB, tile types.Tile) error {
	_, err := db.Exec(`
		INSERT INTO tiles (
			locationX, locationY,
			resourceType, resourceQuantity, resourceQuality,
			occupied
		) VALUES (?, ?, ?, ?, ?, ?);
	`,
		tile.Location.X, tile.Location.Y,
		tile.Resource.Type, tile.Resource.Quantity, tile.Resource.Quality,
		tile.Occupied,
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

	// Create the table if it doesn't exist
	if err := CreateTilesTable(db); err != nil {
		return err
	}

	// Insert each row into the database
	for _, row := range grid {
		for _, tile := range row {
			if err := InsertTile(db, tile); err != nil {
				return err
			}
		}
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
	SELECT locationX, locationY, resourceType, resourceQuantity, resourceQuality, occupied
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
		var occupiedBool bool // Change this line

		err := rows.Scan(
			&tile.Location.X, &tile.Location.Y,
			&tile.Resource.Type, &tile.Resource.Quantity, &tile.Resource.Quality,
			&occupiedBool, // And this line
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %v", err)
		}

		tile.Occupied = occupiedBool // Remove the conversion

		tiles = append(tiles, tile)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over rows: %v", err)
	}

	// Print the retrieved tiles to the console
	// fmt.Println("Tiles within range:")
	// for _, tile := range tiles {
	// 	fmt.Printf("(%d,%d) %v\n", tile.Location.X, tile.Location.Y, tile)
	// }

	return tiles, nil
}
