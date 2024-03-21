// WebSocketConnection.tsx
import { useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Grid from "./grid/Grid";
import { Tile, Unit, Location } from "../types/types";
import Controls from "./ui/Controls";
import { usePingServer, useUpdatePlayerLocation } from "../hooks/webSocket";
import { Login } from "./ui/Login";

const WebSocketConnection = () => {
  const [characterObject, setCharacterObject] = useState<
    Unit | null | undefined
  >();

  // Change from localhost to heroku before deploying
  const socketUrl = "ws://localhost:8080/ws";
  // const socketUrl = "wss://grid-server-live-d5aba022ae2f.herokuapp.com/ws";

  const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl);

  const [currentMap, setCurrentMap] = useState<Tile[]>();
  const [currentLocation, setCurrentLocation] = useState<
    Location | null | undefined
  >();

  // useCreateCharacter(characterObject, setCharacterObject);

  useUpdatePlayerLocation(
    characterObject,
    setCharacterObject,
    setCurrentLocation,
    setCurrentMap,
    lastMessage
  );

  usePingServer(readyState, sendMessage);

  return (
    <div className="bg-black lg:px-24 lg:py-8 min-h-96 rounded-2xl border-2 bg-opacity-75 border-lime-300 border-opacity-80">
      {ReadyState[readyState] == "CLOSED" && (
        <p className="text-red-600 mb-4">No response from server.</p>
      )}
      {ReadyState[readyState] == "CONNECTING" && (
        <p className="text-yellow-300 mb-4">
          The server is starting - please wait.
        </p>
      )}
      {ReadyState[readyState] == "OPEN" && (
        <p className="text-green-500 mb-4">Connected to server.</p>
      )}
      <div className="flex flex-col justify-center">
        {currentMap && characterObject && (
          <Grid grid={currentMap} currentLocation={currentLocation} />
        )}
<div className="m-auto">
        <Controls sendMessage={sendMessage} characterObject={characterObject} />
        <Login characterObject={characterObject} sendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default WebSocketConnection;
