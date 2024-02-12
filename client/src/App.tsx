import Grid from "./components/grid/Grid";
import { config } from "./config/config";

function App() {
  return (
    <>
    <Grid grid={{size: config.gridSize}} />
    </>
  );
}

export default App;
