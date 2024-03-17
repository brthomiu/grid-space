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
    <div className="m-12">
      <h1 className="text-white">GRID-SPACE v0.2</h1>
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
        {currentMap && characterObject && (
          <Grid grid={currentMap} currentLocation={currentLocation} />
        )}
      <Controls sendMessage={sendMessage} characterObject={characterObject} />
      <Login characterObject={characterObject} sendMessage={sendMessage} />
    </div>
  );
};

export default WebSocketConnection;
