import React from "react";
import { Tile as TileType, Location } from "../../types/types";

type Props = {
  // The tile object containing location information.
  tile: TileType;
  currentLocation: Location;
  unitId: string;
};

// Functional component representing an individual tile in the grid.
const Tile: React.FC<Props> = ({ tile, currentLocation, unitId }) => {
  // Extract the location from the tile object
  const { Location, Resource } = tile;

  const tileBg = (ResourceType: string) => {
    if (Location.X == currentLocation.X && Location.Y == currentLocation.Y) {
      return "bg-green-600";
    } else {
      switch (ResourceType) {
        case "Wood": {
          return "bg-orange-800";
        }
        case "Stone": {
          return "bg-gray-400";
        }
        case "Ore": {
          return "bg-slate-500";
        }
        default: {
          // Return a default value for unknown ResourceType
          return "bg-black";
        }
      }
    }
  };

  // Render the tile component with a fixed size and a border
  return (
    <div
      className={`text-[0.6rem] w-12 h-12 m-0 border ${tileBg(
        Resource.Type
      )} border-gray-300 text-black`}
    >
      {/* Display the coordinates of the tile */}
      {`(${Location.X + 1}, ${Location.Y + 1})`}
      <div className="flex flex-row">
      {unitId && (
        <h1 className="text-[1rem]">🙂</h1>
      )}
      </div>
    </div>
  );
};

export default Tile;
