import { useState } from "react";
import { Location } from "./types/types";
import WebSocketConnection from "./components/WebSocketConnection";

function App() {
  const [currentLocation, setCurrentLocation] = useState<Location>({
    X: 3,
    Y: 3,
  });

  return (
    <>
      <WebSocketConnection
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
      />
    </>
  );
}

export default App;
