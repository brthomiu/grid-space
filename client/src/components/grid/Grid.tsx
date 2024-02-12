import React from "react";
import Tile from "../tiles/Tile";
import { Grid as GridType } from "../../types/types";
import { generateGrid } from "../../features/grid";
import { config } from "../../config/config";

type Props = {
  grid: GridType;
};

// Functional component representing a grid of tiles.
const Grid: React.FC<Props> = ({ grid }) => {
  // Extract the size from the grid configuration
  const { size } = grid;

  // Generate a grid of tiles based on the specified size
  const tiles = generateGrid(size);

  // Render the grid component with CSS Grid layout
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${size}, ${config.tileSize * 4}px)`,
      }}
    >
      {/* Map through the generated tiles and render each Tile component */}
      {tiles.map((tile) => (
        <Tile key={`${tile.location.x}-${tile.location.y}`} tile={tile} />
      ))}
    </div>
  );
};

export default Grid;
