/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import {
  CharacterCreationResponse,
  Tile,
  Unit,
  Location,
} from "../types/types";
import { ReadyState } from "react-use-websocket";

export const useUpdatePlayerLocation = (
  characterObject: Unit | null | undefined,
  setCharacterObject: React.Dispatch<
    React.SetStateAction<Unit | null | undefined>
  >,
  setCurrentLocation: React.Dispatch<
    React.SetStateAction<Location | null | undefined>
  >,
  setCurrentMap: React.Dispatch<React.SetStateAction<Tile[] | undefined>>,
  lastMessage: MessageEvent<any> | null
) => {
  useEffect(() => {
    console.log("Entering useEffect"); // Check if the effect is being triggered

    // Update UI whenever the subscribed value changes
    if (lastMessage && lastMessage.data) {
      const messageData = JSON.parse(lastMessage.data);

      console.log("messageData--------------", messageData);

      if (messageData.Type === "SyncPlayer") {
        if (!characterObject || typeof characterObject == "undefined") {
          throw Error(
            "SyncPlayer hook characterObject is either null or undefined"
          );
        }

        setCurrentMap(messageData.Payload.Tiles); // Update the state with the received tiles
      }

      if (messageData.Type === "MovePlayer") {
        if (!characterObject || typeof characterObject == "undefined") {
          throw Error(
            "useUpdatePlayerLocation hook characterObject is either null or undefined"
          );
        }

        const newCharacterObject = {
          Id: characterObject.Id,
          Name: characterObject.Name,
          Stats: characterObject.Stats,
          Type: characterObject.Type,
        };

        setCharacterObject(newCharacterObject);
        console.log(
          "newCharacterObject location updated websocket hook, -----",
          newCharacterObject
        );
        setCurrentLocation(messageData.Payload.NextLocation); // Update player location on client
        setCurrentMap(messageData.Payload.Tiles); // Update the state with the received tiles
      }

      if (messageData.Type === "CharacterCreationResponse") {
        const newCharacterResponse: CharacterCreationResponse = messageData;

        const newCharacterObject = {
          Id: newCharacterResponse.Payload.CharacterObject.Id,
          Name: newCharacterResponse.Payload.CharacterObject.Name,
          Stats: newCharacterResponse.Payload.CharacterObject.Stats,
          Type: newCharacterResponse.Payload.CharacterObject.Type,
        };

        setCharacterObject(newCharacterObject);
        console.log(
          "newCharacterObject new character websocket hook, -----",
          newCharacterObject
        );
        if (!newCharacterResponse.Payload.Location) {
          throw Error(
            "Could not update client location with new character starting position."
          );
        } else {
          console.log(
            "new character location on client---->",
            newCharacterResponse.Payload.Location
          );
          setCurrentLocation(newCharacterResponse.Payload.Location);
        }
      }
    }

    console.log("Exiting useEffect");
  }, [lastMessage]);
};

export const usePingServer = (readyState: ReadyState, sendMessage: any) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (readyState === ReadyState.OPEN) {
        // Send a JSON string instead of 'ping'
        sendMessage(JSON.stringify({ type: "ping" }));
      }
    }, 10000); // send ping every 10 seconds

    return () => {
      clearInterval(interval);
    };
  }, [readyState, sendMessage]);
};
