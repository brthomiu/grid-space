package game

import (
	"math/rand"
	"server/types"
	"time"
)

// CreateGrid generates a grid of tiles based on the given size.
func CreateGrid(size int) [][]types.Tile {
	rand.Seed(time.Now().UnixNano())

	// Create a 2D slice representing the grid
	grid := make([][]types.Tile, size)
	for i := range grid {
		grid[i] = make([]types.Tile, size)
	}

	// Populate the grid with tiles
	for x := 0; x < size; x++ {
		for y := 0; y < size; y++ {
			grid[x][y] = types.Tile{
				Location: types.Location{X: x, Y: y},
				Resource: GenerateRandomResource(),
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
