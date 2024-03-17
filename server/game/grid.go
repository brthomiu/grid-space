package game

import (
	"math/rand"
	"server/types"
	"time"
)

// CreateGrid generates a grid of tiles based on the given size.
func CreateGrid(size int) [][]types.Tile {
	rand.Seed(time.Now().UnixNano())

	// Adjust the size to account for the negative coordinates
	size += 5

	// Create a 2D slice representing the grid
	grid := make([][]types.Tile, size)
	for i := range grid {
		grid[i] = make([]types.Tile, size)
	}

	// Populate the grid with tiles
	for x := -5; x < size-5; x++ {
		for y := -5; y < size-5; y++ {
			// If the coordinates are negative, assign a "None" resource
			if x < 0 || y < 0 {
				grid[x+5][y+5] = types.Tile{
					Location: types.Location{X: x, Y: y},
					Resource: types.Resource{Type: "None", Quantity: 0, Quality: 0},
				}
			} else {
				grid[x+5][y+5] = types.Tile{
					Location: types.Location{X: x, Y: y},
					Resource: GenerateRandomResource(),
				}
			}
		}
	}

	return grid
}

// GenerateRandomResource generates a random resource for a tile.
func GenerateRandomResource() types.Resource {
	resources := []types.Resource{
		{Type: "Wood", Quantity: rand.Intn(10) + 1, Quality: rand.Intn(5) + 1},
		{Type: "Stone", Quantity: rand.Intn(5) + 1, Quality: rand.Intn(5) + 1},
		{Type: "Ore", Quantity: rand.Intn(3) + 1, Quality: rand.Intn(5) + 1},
		// Add more resource types as needed
	}

	return resources[rand.Intn(len(resources))]
}
