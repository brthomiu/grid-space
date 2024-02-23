import { SendMessage } from "react-use-websocket";
import {
  Location,
  SyncMessage,
  MoveMessage,
  Unit,
  CharacterCreationMessage,
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

export const createSyncMessage = (
  characterObject: Unit,
  Message: string | null
): SyncMessage | Error => {
  const { Id, Location, Stats } = characterObject;

  const serverMessage: SyncMessage = {
    Type: "ServerMessage",
    Payload: { Id, Location, Stats, Message },
  };

  return serverMessage;
};

export const createMoveMessage = (
  characterObject: Unit,
  NextLocation: Location | null
): MoveMessage | Error => {
  const Id = characterObject.Id;

  if (!NextLocation) {
    throw Error("Movement failed: No move message");
  }

  const moveMessage: MoveMessage = {
    Type: "MoveMessage",
    Payload: {
      Id,
      NextLocation,
    },
  };

  return moveMessage;
};

export const sendMoveMessage = (
  characterObject: Unit,
  nextLocation: Location,
  sendMessage: SendMessage
) => {
  sendMessage(JSON.stringify(createMoveMessage(characterObject, nextLocation)));
};

export const createCharacterCreationMessage = (Name: string) => {
  const characterCreationMessage: CharacterCreationMessage = {
    Type: "CharacterCreationMessage",
    Payload: {
      Name,
    },
  };
  return characterCreationMessage
};

export const sendCharacterCreationmessage = (name: string, sendMessage: SendMessage) => {

  const messageObject = createCharacterCreationMessage(name)
  const message = JSON.stringify(messageObject)
  sendMessage(message);
};
