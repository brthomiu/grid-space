/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { LocationMessage, Tile } from "../types/types";
import { ReadyState } from "react-use-websocket";

export const useUpdatePlayerLocation = (
  setCurrentMap: React.Dispatch<React.SetStateAction<Tile[] | undefined>>,
  lastMessage: MessageEvent<any> | null
) => {
  useEffect(() => {
    console.log("Entering useEffect"); // Check if the effect is being triggered

    // Update UI whenever the subscribed value changes
    if (lastMessage && lastMessage.data) {
      const messageData: LocationMessage = JSON.parse(lastMessage.data);
      if (messageData.Type === "GetPlayerMap") {
        setCurrentMap(messageData.Payload); // Update the state with the received tiles
      }
    }

    console.log("Exiting useEffect");
  }, [lastMessage, setCurrentMap]);
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
