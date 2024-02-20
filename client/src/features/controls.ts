import { SendMessage } from "react-use-websocket";
import { sendMoveMessage } from "../api/api";
import { Unit } from "../types/types";


export const handleMoveLeft = (characterObject: Unit, sendMessage: SendMessage) => {
  const currentLocation = characterObject.Location;
  const newLocation = { X: currentLocation.X, Y: currentLocation.Y - 1 };
  console.log("new location ----> ", newLocation);
  sendMoveMessage(characterObject, newLocation, sendMessage);
};

export const handleMoveRight = (characterObject: Unit, sendMessage: SendMessage) => {
  const currentLocation = characterObject.Location;
  const newLocation = { X: currentLocation.X, Y: currentLocation.Y + 1 };
  console.log("new location ----> ", newLocation);
  sendMoveMessage(characterObject, newLocation, sendMessage);
};

export const handleMoveUp = (characterObject: Unit, sendMessage: SendMessage) => {
  const currentLocation = characterObject.Location;
  const newLocation = { X: currentLocation.X - 1, Y: currentLocation.Y };
  console.log("new location ----> ", newLocation);
  sendMoveMessage(characterObject, newLocation, sendMessage);
};

export const handleMoveDown = (characterObject: Unit, sendMessage: SendMessage) => {
  const currentLocation = characterObject.Location;
  const newLocation = { X: currentLocation.X + 1, Y: currentLocation.Y };
  console.log("new location ----> ", newLocation);
  sendMoveMessage(characterObject, newLocation, sendMessage);
};
