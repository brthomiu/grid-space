import React from "react";
import { Tile as TileType } from "../../types/types";

type Props = {
  // The tile object containing location information.
  tile: TileType;
};

// Functional component representing an individual tile in the grid.
const Tile: React.FC<Props> = ({ tile }) => {
  // Extract the location from the tile object
  const { location } = tile;

  // Render the tile component with a fixed size and a border
  return (
    <div className="w-12 h-12 m-0 border border-gray-300 text-red-500">
      {/* Display the coordinates of the tile */}
      {`(${location.x + 1}, ${location.y + 1})`}
    </div>
  );
};

export default Tile;
