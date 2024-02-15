// WebSocketConnection.tsx
import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Grid from "../components/grid/Grid";
import { playerMapMessage } from "../api/api";
import { Location, Tile } from "../types/types";
import Controls from "../components/ui/Controls";

type Message = {
  Type: string;
  Payload: Tile[];
};

type Props = {
  currentLocation: Location;
  setCurrentLocation: React.Dispatch<React.SetStateAction<Location>>;
};

const WebSocketConnection: React.FC<Props> = ({
  currentLocation,
  setCurrentLocation,
}) => {
  // const socketUrl = "ws://localhost:8080/ws";
  const socketUrl = "wss://grid-server-live-d5aba022ae2f.herokuapp.com/ws";

  const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl);

  const [currentMap, setCurrentMap] = useState<Tile[]>();

  useEffect(() => {
    console.log("Entering useEffect"); // Check if the effect is being triggered

    // Update UI whenever the subscribed value changes
    if (lastMessage && lastMessage.data) {
      const messageData: Message = JSON.parse(lastMessage.data);
      if (messageData.Type === "GetPlayerMap") {
        setCurrentMap(messageData.Payload); // Update the state with the received tiles
      }
    }

    console.log("Exiting useEffect");
  }, [lastMessage]);

  const updateMap = () => {
    // Example: Send a message to the server when a button is clicked
    sendMessage(JSON.stringify(playerMapMessage("player1", currentLocation)));
  };

  return (
    <div>
      {currentMap && <Grid grid={currentMap} currentLocation={currentLocation} />}
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
