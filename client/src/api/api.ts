// import axios from "axios";
import { SendMessage } from "react-use-websocket";
import {
  Location,
  MoveMessage,
  CharacterCreationMessage,
  // GuestLoginMessage,
} from "../types/types";

export const playerMapMessage = (playerId: string, location: Location) => {
  const message = {
    Type: "GetPlayerMap",
    Payload: {
      playerId,
      location,
    },
  };
  return message;
};

export const createMoveMessage = (
  Id: string,
  Direction: string,
): MoveMessage | Error => {
  if (!Id) {
    throw Error("Movement failed: No player ID!");
  }

  if (!Direction) {
    throw Error("Movement failed: No move direction!");
  }

  const moveMessage: MoveMessage = {
    Type: "MoveMessage",
    Payload: {
      Id,
      Direction,
    },
  };
  console.log("Sending movement message to server---->", moveMessage);
  return moveMessage;
};

export const sendMoveMessage = (
  id: string,
  direction: string,
  sendMessage: SendMessage,
) => {
  sendMessage(JSON.stringify(createMoveMessage(id, direction)));
};

export const createCharacterCreationMessage = (Id: string, Name: string) => {
  const characterCreationMessage: CharacterCreationMessage = {
    Type: "CharacterCreationMessage",
    Payload: {
      Id,
      Name,
    },
  };
  return characterCreationMessage;
};

export const sendCharacterCreationMessage = (
  id: string,
  name: string,
  sendMessage: SendMessage,
  setNewCharacterId: React.Dispatch<React.SetStateAction<string>>,
) => {
  setNewCharacterId(id);
  const messageObject = createCharacterCreationMessage(id, name);
  const message = JSON.stringify(messageObject);
  sendMessage(message);
};
