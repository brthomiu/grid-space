import React from "react";
import Tile from "../tiles/Tile";
import { Tile as TTile, Location } from "../../types/types";
import { config } from "../../config/config";

type Props = {
  grid: TTile[];
  currentLocation: Location;
};

// Functional component representing a grid of tiles.
const Grid: React.FC<Props> = ({ grid, currentLocation }) => {
  // Generate a grid of tiles based on the specified size
  const tiles = grid;

  // Render the grid component with CSS Grid layout
  return (
    <div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${7}, ${config.tileSize * 4}px)`,
        }}
      >
        {/* Map through the generated tiles and render each Tile component */}
        {tiles.map((tile) => (
          <Tile
            currentLocation={currentLocation}
            key={`${tile.Location.X}-${tile.Location.Y}`}
            tile={tile}
          />
        ))}
      </div>
    </div>
  );
};

export default Grid;
