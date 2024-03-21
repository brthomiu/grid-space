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
    lastMessage,
  );

  usePingServer(readyState, sendMessage);

  return (
    <div className="min-h-96 rounded-2xl border-2 border-lime-300 border-opacity-80 bg-black bg-opacity-75 lg:px-24 lg:py-8">
      {ReadyState[readyState] == "CLOSED" && (
        <p className="mb-4 text-red-600">No response from server.</p>
      )}
      {ReadyState[readyState] == "CONNECTING" && (
        <p className="mb-4 text-yellow-300">
          The server is starting - please wait.
        </p>
      )}
      {ReadyState[readyState] == "OPEN" && (
        <p className="mb-4 text-green-500">Connected to server.</p>
      )}
      <div className="flex flex-col justify-center">
        {currentMap && characterObject && (
          <Grid grid={currentMap} currentLocation={currentLocation} />
        )}
        <div className="m-auto">
          <Controls
            sendMessage={sendMessage}
            characterObject={characterObject}
          />
          <Login characterObject={characterObject} sendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default WebSocketConnection;
