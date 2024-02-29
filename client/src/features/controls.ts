import { SendMessage } from "react-use-websocket";
import { sendMoveMessage } from "../api/api";
import { Unit } from "../types/types";


export const handleMoveLeft = (characterObject: Unit, sendMessage: SendMessage) => {
  sendMoveMessage(characterObject.Id, "left", sendMessage);
};

export const handleMoveRight = (characterObject: Unit, sendMessage: SendMessage) => {
  sendMoveMessage(characterObject.Id, "right",  sendMessage);
};

export const handleMoveUp = (characterObject: Unit, sendMessage: SendMessage) => {
  sendMoveMessage(characterObject.Id, "up",  sendMessage);
};

export const handleMoveDown = (characterObject: Unit, sendMessage: SendMessage) => {
  sendMoveMessage(characterObject.Id, "down",  sendMessage);
};
