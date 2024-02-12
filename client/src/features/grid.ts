import { Resource } from "../types/types";
import { Location, Tile as TileType } from "../types/types";

// randomizeResource()
// Generates a random Resource object with specific constraints.
export const randomizeResource = (): Resource => {
  // Possible resource types
  const types = ["empty", "stone", "wood"];

  // Randomly select a type from the available types
  const randomType = types[Math.floor(Math.random() * types.length)];

  // Generates a random number within the specified range.
  const getRandomNumberInRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate random values for quantity and quality within the specified range
  const quantity = getRandomNumberInRange(1, 5);
  const quality = getRandomNumberInRange(1, 5);

  // Return the randomly generated Resource object
  return {
    type: randomType,
    quantity,
    quality,
  };
};

// generateGrid(number)
// Generates a grid of tiles based on the specified size.
export const generateGrid = (size: number): TileType[] => {
  // Array to store the generated tiles
  const tiles: TileType[] = [];

  // Loop through rows
  for (let x = 0; x < size; x++) {
    // Loop through columns
    for (let y = 0; y < size; y++) {
      // Create a location object with x and y coordinates
      const location: Location = { x, y };

      // Create a Tile object with a random resource, unoccupied by default
      const tile: TileType = {
        location,
        resource: randomizeResource(),
        occupied: false,
      };

      // Add the tile to the array of tiles
      tiles.push(tile);
    }
  }

  // Return the array of generated tiles
  return tiles;
};
