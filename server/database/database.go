// database.go
package database

import (
	"database/sql"
	"fmt"

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
