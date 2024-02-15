import React from "react";
import { Location } from "../../types/types";

type Props = {
  currentLocation: Location;
  setCurrentLocation: React.Dispatch<React.SetStateAction<Location>>;
  updateMap: () => void;
};

export default function Controls({
  currentLocation,
  setCurrentLocation,
  updateMap,
}: Props) {
  const handleMoveLeft = () => {
    const newLocation = { X: currentLocation.X, Y: currentLocation.Y - 1 };
    setCurrentLocation(newLocation);
    console.log("new location ----> ", newLocation);
    updateMap();
  };
  const handleMoveRight = () => {
    const newLocation = { X: currentLocation.X, Y: currentLocation.Y + 1 };
    setCurrentLocation(newLocation);
    console.log("new location ----> ", newLocation);
    updateMap();
  };
  const handleMoveUp = () => {
    const newLocation = { X: currentLocation.X - 1, Y: currentLocation.Y };
    setCurrentLocation(newLocation);
    console.log("new location ----> ", newLocation);
    updateMap();
  };
  const handleMoveDown = () => {
    const newLocation = { X: currentLocation.X + 1, Y: currentLocation.Y };
    setCurrentLocation(newLocation);
    console.log("new location ----> ", newLocation);
    updateMap();
  };

  return (
    <>
      <h1 className="text-white">GRID-SPACE v0.1</h1>
      <p className="text-white">
        Press a direction to begin.
      </p>
      <div className="text-red-100 flex gap-4">
        <button onClick={() => handleMoveUp()}>Up</button>
        <button onClick={() => handleMoveDown()}>Down</button>
        <button onClick={() => handleMoveLeft()}>Left</button>
        <button onClick={() => handleMoveRight()}>Right</button>
      </div>
    </>
  );
}
