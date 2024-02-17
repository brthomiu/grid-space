package game

import (
	"fmt"
	"os"
	"server/database"
	"strconv"
	// "strings"
)

func StartGameServer() {

	// Check if the NEW_GRID environment variable is set
	// newGridStr := os.Getenv("NEW_GRID")
	// newGrid := strings.ToUpper(newGridStr) == "Y"

	newGrid := false

	if newGrid {
		fmt.Println("Generating a new grid...")

		// Get the grid size from the GRID_SIZE environment variable
		gridSizeStr := os.Getenv("GRID_SIZE")
		gridSize, err := strconv.Atoi(gridSizeStr)
		if err != nil {
			// Use a default value if GRID_SIZE is not set or is not a valid integer
			gridSize = 1000
		}

		// Validate the grid size
		if gridSize < 10 || gridSize > 1000 {
			fmt.Println("Invalid grid size. Must be between 10 and 1000.")
			return
		}

		// Generate the grid with the specified size
		grid := CreateGrid(gridSize)

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
