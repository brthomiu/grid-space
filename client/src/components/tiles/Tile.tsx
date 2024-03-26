import React from "react";
import { Tile as TileType, Location } from "../../types/types";
import wood from "../../../assets/tree.svg";
import stone from "../../../assets/rock.svg";
import ore from "../../../assets/metal.svg";
// import city from "../../../assets/city.svg";

type Props = {
  // The tile object containing location information.
  tile: TileType;
  currentLocation: Location;
  unitId: string;
};

// Functional component representing an individual tile in the grid.
const Tile: React.FC<Props> = ({ tile, unitId }) => {
  // Extract the location from the tile object
  const { Resource } = tile;

  const tileBg = (ResourceType: string) => {
    switch (ResourceType) {
      case "Wood": {
        return "bg-green-950";
      }
      case "Stone": {
        return "bg-orange-950";
      }
      case "Ore": {
        return "bg-slate-600";
      }
      default: {
        // Return a default value for unknown ResourceType
        return "bg-transparent";
      }
    }
  };

  const tileImg = (ResourceType: string) => {
    switch (ResourceType) {
      case "Wood": {
        return wood;
      }
      case "Stone": {
        return stone;
      }
      case "Ore": {
        return ore;
      }
      default: {
        // Return a default value for unknown ResourceType
        return;
      }
    }
  };

  // Render the tile component with a fixed size and a border
  return (
    <div
      className={`m-0 h-12 w-12 border text-[0.6rem] ${tileBg(
        Resource.Type,
      )} border-gray-300 text-black`}
    >
      <div className="absolute m-auto">
        {unitId && <h1 className="text-[2rem]">🙂</h1>}
      </div>

      <img src={tileImg(Resource.Type)} alt={Resource.Type} />
    </div>
  );
};

export default Tile;
