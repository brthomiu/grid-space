import { SendMessage } from "react-use-websocket";
import { Location, SyncMessage, MoveMessage, Unit } from "../types/types";

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

export const getCharacterObject = () => {
  const currentCharacter = localStorage.getItem("playerCharacter");

  if (!currentCharacter) {
    throw Error("Message to server failed: Character object not found");
  }

  const characterObject: Unit = JSON.parse(currentCharacter);

  // Type guard function to check if the object matches the Unit type
  const isUnit = (obj: unknown): obj is Unit => {
    if (!obj) {
      return false;
    }

    return (
      typeof obj === "object" &&
      "Id" in obj &&
      "Location" in obj &&
      "NextLocation" in obj &&
      "Stats" in obj
    );
  };

  if (!isUnit(characterObject)) {
    throw Error("Message to server failed: Character object malformed");
  }

  return characterObject;
};

export const createSyncMessage = (
  Message: string | null
): SyncMessage | Error => {
  const characterObject = getCharacterObject();

  const { Id, Location, Stats } = characterObject;

  const serverMessage: SyncMessage = {
    Type: "ServerMessage",
    Payload: { Id, Location, Stats, Message },
  };

  return serverMessage;
};

export const createMoveMessage = (
  NextLocation: Location | null
): MoveMessage | Error => {
  const Id = getCharacterObject().Id;

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
  nextLocation: Location,
  sendMessage: SendMessage
) => {
  sendMessage(JSON.stringify(createMoveMessage(nextLocation)));
};
