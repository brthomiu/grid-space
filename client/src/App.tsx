import Grid from "./components/grid/Grid";
import { config } from "./config/config";
import WebSocketConnection from "./features/WebSocketConnection";

function App() {
  return (
    <>
    <Grid grid={{size: config.gridSize}} />
    <WebSocketConnection />
    </>
  );
}

export default App;
