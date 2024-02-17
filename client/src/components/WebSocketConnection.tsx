// WebSocketConnection.tsx
import { useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Grid from "./grid/Grid";
import { playerMapMessage } from "../api/api";
import { Location, Tile } from "../types/types";
import Controls from "./ui/Controls";
import { usePingServer, useUpdatePlayerLocation } from "../hooks/webSocket";

type Props = {
  currentLocation: Location;
  setCurrentLocation: React.Dispatch<React.SetStateAction<Location>>;
};

const WebSocketConnection: React.FC<Props> = ({
  currentLocation,
  setCurrentLocation,
}) => {
  // Change from localhost to heroku before deploying
  const socketUrl = "ws://localhost:8080/ws";
  // const socketUrl = "wss://grid-server-live-d5aba022ae2f.herokuapp.com/ws";

  const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl);

  const [currentMap, setCurrentMap] = useState<Tile[]>();

  useUpdatePlayerLocation(setCurrentMap, lastMessage);

  usePingServer(readyState, sendMessage);

  const updateMap = () => {
    // Example: Send a message to the server when a button is clicked
    sendMessage(JSON.stringify(playerMapMessage("player1", currentLocation)));
  };

  return (
    <div>
      {currentMap && (
        <Grid grid={currentMap} currentLocation={currentLocation} />
      )}
      <div className="text-green-400">
        <p>WebSocket Ready State: {ReadyState[readyState]}</p>
        {/* <p>Subscribed Value: {JSON.stringify(currentMap)}</p> */}
        <Controls
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          updateMap={updateMap}
        />
      </div>
    </div>
  );
};

export default WebSocketConnection;
