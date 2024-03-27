package database

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"server/types"
	"sync"

	"github.com/gorilla/websocket"
	_ "github.com/mattn/go-sqlite3"
)

func CreateCharacter(dbName string, id string, name string) (*types.CharacterCreationObject, error) {
	// Open a connection to the SQLite database
	db, err := OpenDatabase(dbName)
	if err != nil {
		return nil, err
	}
	defer db.Close()

	// Start a new transaction
	tx, err := db.Begin()
	if err != nil {
		return nil, err
	}

	// Default values
	charType := "player"
	statsHealth := 10
	statsAttack := 3
	statsDefense := 3

	// Generate random locationX and locationY values between 5 and 15
	locationX := rand.Intn(10) + 6
	locationY := rand.Intn(10) + 6

	// Check the coordinates generated against the Tiles table
	var unit any
	err = tx.QueryRow("SELECT unit FROM tiles WHERE locationX = ? AND locationY = ?", locationX, locationY).Scan(&unit)
	if err != nil && err != sql.ErrNoRows {
		tx.Rollback()
		return nil, fmt.Errorf("error checking tiles: %v", err)
	}

	// If there is already a unit there, generate new coordinates and try again
	for unit != "" {
		locationX := rand.Intn(10) + 6
		locationY := rand.Intn(10) + 6
		err = tx.QueryRow("SELECT unit FROM tiles WHERE locationX = ? AND locationY = ?", locationX, locationY).Scan(&unit)
		if err != nil && err != sql.ErrNoRows {
			tx.Rollback()
			return nil, fmt.Errorf("error checking tiles: %v", err)
		}
	}

	// Insert the new character into the database
	_, err = tx.Exec(`
		INSERT INTO characters (id, type, name, statsHealth, statsAttack, statsDefense)
		VALUES (?, ?, ?, ?, ?, ?)
	`, id, charType, name, statsHealth, statsAttack, statsDefense, locationX, locationY)
	if err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("error inserting character: %v", err)
	}

	// Update the tiles table to add the new character
	_, err = tx.Exec(`
		UPDATE tiles
		SET unit = ?
		WHERE locationX = ? AND locationY = ?
	`, id, locationX, locationY)
	if err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("error updating tiles: %v", err)
	}

	// Commit the transaction
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("error committing transaction: %v", err)
	}

	// Create and return a Unit object
	unitObj := &types.Unit{
		Id:   id,
		Type: charType,
		Name: name,
		Stats: types.UnitStats{
			Health:  statsHealth,
			Attack:  statsAttack,
			Defense: statsDefense,
		},
	}

	newCharacterObj := &types.CharacterCreationObject{
		UnitObj: *unitObj,
		Location: types.Location{
			X: locationX,
			Y: locationY,
		},
	}

	return newCharacterObj, nil
}

func CreateCharactersTable(dbName string) error {

	db, err := OpenDatabase(dbName)
	if err != nil {
		return err
	}
	defer db.Close()

	// Drop the table if it exists
	_, err = db.Exec(`DROP TABLE IF EXISTS characters;`)
	if err != nil {
		return fmt.Errorf("error dropping table: %v", err)
	}

	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS characters (
		id TEXT PRIMARY KEY,
		type TEXT,
		name TEXT,
		statsHealth INTEGER,
		statsAttack INTEGER,
		statsDefense INTEGER
	)
	`)

	if err != nil {
		return fmt.Errorf("error creating table: %v", err)
	}
	return nil
}

func GetPlayerLocation(dbName string, Id string) (types.Location, error) {
	// Open a connection to the SQLite database
	db, err := OpenDatabase(dbName)
	if err != nil {
		return types.Location{}, err
	}
	defer db.Close()

	// Start a new transaction
	tx, err := db.Begin()
	if err != nil {
		return types.Location{}, err
	}

	// Get the old location of the player from the characters table
	var oldLocation types.Location
	err = tx.QueryRow("SELECT locationX, locationY FROM tiles WHERE unit = ?", Id).Scan(&oldLocation.X, &oldLocation.Y)
	if err != nil {
		tx.Rollback()
		return types.Location{}, fmt.Errorf("error getting old location: %v", err)
	}

	// Commit the transaction
	err = tx.Commit()
	if err != nil {
		return types.Location{}, fmt.Errorf("error committing transaction: %v", err)
	}
	return oldLocation, nil

}

func UpdatePlayerLocation(dbName string, Id string, nextLocation types.Location) error {
	// Checks for if the new location is out of bounds
	gridSize := GetGridSize()
	if nextLocation.X < 0 || nextLocation.Y < 0 {
		return nil
	}
	if nextLocation.X > (gridSize-6) || nextLocation.Y > (gridSize-6) {
		return nil
	}

	// Open a connection to the SQLite database
	db, err := OpenDatabase(dbName)
	if err != nil {
		return err
	}
	defer db.Close()

	// Start a new transaction
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	// Get the old location of the player from the characters table
	var oldLocation types.Location
	err = tx.QueryRow("SELECT locationX, locationY FROM tiles WHERE unit = ?", Id).Scan(&oldLocation.X, &oldLocation.Y)
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("error getting old location: %v", err)
	}

	// Set the unit field at the old location to NULL in the tiles table
	_, err = tx.Exec(`
        UPDATE tiles
        SET unit = NULL
        WHERE locationX = ? AND locationY = ?;
    `, oldLocation.X, oldLocation.Y)
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("error nulling unit at old location: %v", err)
	}

	// Update the unit field at the new location in the tiles table
	_, err = tx.Exec(`
        UPDATE tiles
        SET unit = ?
        WHERE locationX = ? AND locationY = ?;
    `, Id, nextLocation.X, nextLocation.Y)
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("error updating unit at new location: %v", err)
	}

	// Commit the transaction
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %v", err)
	}

	return nil
}

func SyncPlayers(connectedPlayers map[string]*websocket.Conn, mutex *sync.Mutex) {
	// Iterate over the connected players
	for playerID, conn := range connectedPlayers {

		// log.Println("playerIDs from connectedPlayers map------->", playerID)

		// Open the database
		db, err := sql.Open("sqlite3", "gameGrid.db")
		if err != nil {
			log.Fatal(err)
		}
		defer db.Close()

		// Prepare the SQL statement
		stmt, err := db.Prepare("SELECT locationX, locationY FROM tiles WHERE unit = ?")
		if err != nil {
			log.Fatal(err)
		}
		defer stmt.Close()

		// Execute the SQL statement
		row := stmt.QueryRow(playerID)

		// Get the player's location
		var locationX, locationY int
		err = row.Scan(&locationX, &locationY)
		if err != nil {
			if err == sql.ErrNoRows {
				log.Printf("Player %s not found in the database", playerID)
			} else {
				log.Printf("Error getting location for player %s: %v", playerID, err)
			}
			continue
		}

		// Run the GetTilesInRange function
		tiles, err := GetTilesInRange("gameGrid.db", locationX, locationY, 5, 5)

		// Create the response payload
		payload := types.SyncMessagePayload{
			PlayerId: playerID,
			Tiles:    tiles,
		}

		if err != nil {
			log.Printf("Error sending results: %v", err)
		}

		// Use a mutex to ensure that only one goroutine writes to the WebSocket connection at a time
		mutex.Lock()

		err = conn.WriteJSON(types.SyncMessage{
			Type:    "SyncPlayers",
			Payload: payload,
		})

		mutex.Unlock()

		if err != nil {
			log.Printf("No connected players")
			continue
		}
	}
}
