import React from "react";
import Tile from "../tiles/Tile";
import { Tile as TTile, Location } from "../../types/types";

type Props = {
  grid: TTile[];
  currentLocation: Location | null | undefined;
};

const tileSize = 12;

// Functional component representing a grid of tiles.
const Grid: React.FC<Props> = ({ grid, currentLocation }) => {
  // Generate a grid of tiles based on the specified size
  const tiles = grid;

  console.log("TILES-----------------", tiles);

  // Render the grid component with CSS Grid layout
  return (
    <div className="self-center -mt-40 lg:mb-0 lg:mt-0 -mb-20">
      <div
        className="grid lg:scale-100 scale-[.625]"
        style={{
          gridTemplateColumns: `repeat(${11}, ${tileSize * 4}px)`,
        }}
      >
        {/* Map through the generated tiles and render each Tile component */}

        {currentLocation &&
          tiles.map((tile) => (
            <Tile
              unitId={tile.Unit}
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
