// WebSocketConnection.tsx
import { useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Grid from "./grid/Grid";
import { Tile, Unit } from "../types/types";
import Controls from "./ui/Controls";
import { usePingServer, useUpdatePlayerLocation } from "../hooks/webSocket";
// import { useCreateCharacter } from "../hooks/character";
import { Login } from "./ui/Login";

const WebSocketConnection = () => {
  const [characterObject, setCharacterObject] = useState<
    Unit | null | undefined
  >();

  // Change from localhost to heroku before deploying
  // const socketUrl = "ws://localhost:8080/ws";
  const socketUrl = "wss://grid-server-live-d5aba022ae2f.herokuapp.com/ws";

  const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl);

  const [currentMap, setCurrentMap] = useState<Tile[]>();

  // useCreateCharacter(characterObject, setCharacterObject);

  useUpdatePlayerLocation(
    characterObject,
    setCharacterObject,
    setCurrentMap,
    lastMessage
  );

  usePingServer(readyState, sendMessage);

  return (
    <div>
      {currentMap && characterObject?.Location && (
        <Grid grid={currentMap} currentLocation={characterObject.Location} />
      )}
      <div className="text-green-400">
        <p>WebSocket Ready State: {ReadyState[readyState]}</p>
        <Controls sendMessage={sendMessage} characterObject={characterObject} />
      </div>
      <Login characterObject={characterObject} sendMessage={sendMessage} />
    </div>
  );
};

export default WebSocketConnection;
