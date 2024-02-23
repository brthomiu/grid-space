package database

import (
	"database/sql"
	"encoding/hex"
	"fmt"
	"math/rand"
	"server/types"

	_ "github.com/mattn/go-sqlite3"
)

func CreateCharacter(dbName string, name string) (*types.Unit, error) {
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

	// Generate a random id
	idBytes := make([]byte, 16)
	_, err = rand.Read(idBytes)
	if err != nil {
		return nil, fmt.Errorf("error generating id: %v", err)
	}
	id := hex.EncodeToString(idBytes)

	// Default values
	charType := "player"
	statsHealth := 10
	statsAttack := 3
	statsDefense := 3

	// Generate random locationX and locationY values between 1 and 20
	locationX := rand.Intn(20) + 1
	locationY := rand.Intn(20) + 1

	// Check the coordinates generated against the Tiles table
	var unit string
	err = tx.QueryRow("SELECT unit FROM tiles WHERE locationX = ? AND locationY = ?", locationX, locationY).Scan(&unit)
	if err != nil && err != sql.ErrNoRows {
		tx.Rollback()
		return nil, fmt.Errorf("error checking tiles: %v", err)
	}

	// If there is already a unit there, generate new coordinates and try again
	for unit != "" {
		locationX = rand.Intn(20) + 1
		locationY = rand.Intn(20) + 1
		err = tx.QueryRow("SELECT unit FROM tiles WHERE locationX = ? AND locationY = ?", locationX, locationY).Scan(&unit)
		if err != nil && err != sql.ErrNoRows {
			tx.Rollback()
			return nil, fmt.Errorf("error checking tiles: %v", err)
		}
	}

	fmt.Println("character name on server-----------", name)

	// Insert the new character into the database
	_, err = tx.Exec(`
		INSERT INTO characters (id, type, name, statsHealth, statsAttack, statsDefense, locationX, locationY)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
		Location: types.Location{
			X: locationX,
			Y: locationY,
		},
	}

	return unitObj, nil
}

func CreateCharactersTable(dbName string) error {

	db, err := OpenDatabase(dbName)
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS characters (
		id TEXT PRIMARY KEY,
		type TEXT,
		name TEXT UNIQUE,
		statsHealth INTEGER,
		statsAttack INTEGER,
		statsDefense INTEGER,
		locationX INTEGER,
		locationY INTEGER
	)
	`)

	if err != nil {
		return fmt.Errorf("error creating table: %v", err)
	}
	return nil
}

func UpdatePlayerLocation(dbName string, Id string, nextLocation types.Location) error {
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
	err = tx.QueryRow("SELECT locationX, locationY FROM characters WHERE id = ?", Id).Scan(&oldLocation.X, &oldLocation.Y)
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

	// Update the player's location in the characters table
	_, err = tx.Exec(`
        UPDATE characters
        SET locationX = ?, locationY = ?
        WHERE id = ?;
    `, nextLocation.X, nextLocation.Y, Id)
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("error updating player location in characters table: %v", err)
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
