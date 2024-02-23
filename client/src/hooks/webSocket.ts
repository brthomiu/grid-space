/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { CharacterCreationResponse, Tile, Unit } from "../types/types";
import { ReadyState } from "react-use-websocket";

export const useUpdatePlayerLocation = (
  characterObject: Unit | null | undefined,
  setCharacterObject: React.Dispatch<
    React.SetStateAction<Unit | null | undefined>
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

      if (messageData.Type === "MovePlayer") {
        if (!characterObject || typeof characterObject == "undefined") {
          throw Error(
            "useUpdatePlayerLocation hook characterObject is either null or undefined"
          );
        }

        const newCharacterObject = {
          Id: characterObject.Id,
          Location: messageData.Payload.NextLocation,
          Name: characterObject.Name,
          Stats: characterObject.Stats,
          Type: characterObject.Type,
        };

        setCharacterObject(newCharacterObject);
        console.log(
          "newCharacterObject location updated websocket hook, -----",
          newCharacterObject
        );

        setCurrentMap(messageData.Payload.Tiles); // Update the state with the received tiles
      }

      if (messageData.Type === "CharacterCreationResponse") {
        const newCharacterResponse: CharacterCreationResponse = messageData;

        const newCharacterObject = {
          Id: newCharacterResponse.Payload.CharacterObject.Id,
          Location: newCharacterResponse.Payload.CharacterObject.Location,
          Name: newCharacterResponse.Payload.CharacterObject.Name,
          Stats: newCharacterResponse.Payload.CharacterObject.Stats,
          Type: newCharacterResponse.Payload.CharacterObject.Type,
        };

        setCharacterObject(newCharacterObject);
        console.log(
          "newCharacterObject new character websocket hook, -----",
          newCharacterObject
        );

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
