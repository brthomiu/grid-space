package game

import (
	"fmt"
	"server/database"
	// "strings"
)

func StartGameServer() {

	// Check if the NEW_GRID environment variable is set
	// newGridStr := os.Getenv("NEW_GRID")
	// newGrid := strings.ToUpper(newGridStr) == "Y"

	newGrid := true

	if newGrid {
		fmt.Println("Generating a new grid...")

		gridSize := database.GetGridSize()

		// Validate the grid size
		if gridSize < 10 || gridSize > 1000 {
			fmt.Println("Invalid grid size. Must be between 10 and 1000.")
			return
		}

		// Generate the grid with the specified size
		grid := CreateGrid(gridSize)

		// Create the character table in the specified database
		database.CreateCharactersTable("gameGrid.db")

		// Save the grid to the SQLite database
		dbName := "gameGrid.db" // Replace with your desired database name
		if err := database.SaveGridToDatabase(grid, dbName); err != nil {
			fmt.Println("Error saving grid to database:", err)

			return
		}

	} else {
		fmt.Println("Exiting without generating a new grid.")
	}
}
