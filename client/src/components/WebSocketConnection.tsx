// WebSocketConnection.tsx - Wrapper component
// Connects to server and passes data down to game components
import { useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Grid from "./grid/Grid";
import { Tile, Unit, Location, LoadingStyles } from "../types/types";
import Controls from "./ui/Controls";
import { usePingServer, useUpdatePlayerLocation } from "../hooks/webSocket";
import { NewCharacter } from "./ui/NewCharacter";
import LeftBar from "./ui/LeftBar";
import RightBar from "./ui/RightBar";
import RotateCube from "./ui/RotateCube";

export const serverUrl = "localhost:8080";
// export const serverUrl = "grid-server-live-d5aba022ae2f.herokuapp.com";

const WebSocketConnection = () => {
  // Server URL - Change from localhost to heroku before deploying
  const socketUrl = `ws://${serverUrl}/ws`;
  // const socketUrl = `wss://${serverUrl}/ws`;

  const [characterObject, setCharacterObject] = useState<
    Unit | null | undefined
  >();

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

  const createLoadingStyles = (readyState: ReadyState): LoadingStyles => {
    switch (ReadyState[readyState]) {
      case "CLOSED":
        return {
          center: "border-red-600",
          sides: "w-24 border-red-600",
          content: "invisible opacity-0",
        };

      case "CONNECTING":
        return {
          center: "border-yellow-400",
          sides: "w-24 border-yellow-400",
          content: "visible opacity-0 scale-x-75",
        };

      case "OPEN":
        return {
          center: "border-lime-300",
          sides: "w-24 px-24 border-lime-300",
          content: "visible opacity-100 scale-x-100",
        };

      default:
        return {
          center: "",
          sides: "",
          content: "",
        };
    }
  };

  return (
    <div className="flex flex-row lg:min-h-[445px]">
      <div className="invisible lg:visible">
        <LeftBar
          sideStyles={createLoadingStyles(readyState).sides}
          contentStyles={createLoadingStyles(readyState).content}
          characterObject={characterObject}
          readyState={readyState}
        />
      </div>
      <div
        style={{ transition: "all 2s" }}
        className={`${createLoadingStyles(readyState).center} min-h-72 w-80 rounded-2xl border-2 border-opacity-80 bg-black bg-opacity-75 p-4 lg:min-h-96 lg:w-auto lg:min-w-[420px] lg:px-24 lg:py-4`}
      >
        <div className="m-auto flex h-12 max-w-[300px] flex-row justify-center self-center">
          {ReadyState[readyState] == "CLOSED" && !characterObject && (
            <p className="my-2 max-w-[300px] text-red-600">No connection.</p>
          )}
          {ReadyState[readyState] == "CONNECTING" && !characterObject && (
            <div className="absolute flex flex-col justify-center">
              <p className="my-2 max-w-[300px] text-yellow-300">
                Connecting to server.
              </p>
              <div className="scale-100">
                <RotateCube propMultiplier={1.75} />
              </div>
            </div>
          )}
          {ReadyState[readyState] == "OPEN" && !characterObject && (
            <p className="my-2 max-w-[300px] text-green-500">
              Connected to server.
            </p>
          )}
        </div>
        <div className="flex flex-col justify-center">
          {currentMap && characterObject && (
            <div className="scale-[.95]">
              <Grid grid={currentMap} currentLocation={currentLocation} />
            </div>
          )}
          <div className="m-auto">
            <Controls
              sendMessage={sendMessage}
              characterObject={characterObject}
            />
            <div
              style={{ transition: "all 2s" }}
              className={`${createLoadingStyles(readyState).content}`}
            >
              <NewCharacter
                characterObject={characterObject}
                sendMessage={sendMessage}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="invisible lg:visible">
        <RightBar
          sideStyles={createLoadingStyles(readyState).sides}
          contentStyles={createLoadingStyles(readyState).content}
          characterObject={characterObject}
          readyState={readyState}
          currentMap={currentMap}
        />
      </div>
    </div>
  );
};

export default WebSocketConnection;
