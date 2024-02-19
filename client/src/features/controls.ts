import { SendMessage } from "react-use-websocket";
import { getCharacterObject, sendMoveMessage } from "../api/api";

const currentLocation = getCharacterObject().Location;

export const handleMoveLeft = (sendMessage: SendMessage) => {
  const newLocation = { X: currentLocation.X, Y: currentLocation.Y - 1 };
  console.log("new location ----> ", newLocation);
  sendMoveMessage(newLocation, sendMessage);
};

export const handleMoveRight = (sendMessage: SendMessage) => {
  const newLocation = { X: currentLocation.X, Y: currentLocation.Y + 1 };
  console.log("new location ----> ", newLocation);
  sendMoveMessage(newLocation, sendMessage);
};

export const handleMoveUp = (sendMessage: SendMessage) => {
  const newLocation = { X: currentLocation.X - 1, Y: currentLocation.Y };
  console.log("new location ----> ", newLocation);
  sendMoveMessage(newLocation, sendMessage);
};

export const handleMoveDown = (sendMessage: SendMessage) => {
  const newLocation = { X: currentLocation.X + 1, Y: currentLocation.Y };
  console.log("new location ----> ", newLocation);
  sendMoveMessage(newLocation, sendMessage);
};
