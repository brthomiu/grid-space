import WebSocketConnection from "./components/WebSocketConnection";
import { useState, useRef, useEffect } from "react";
import Welcome from "./pages/Welcome";
import Navbar from "./components/ui/Navbar";

function App() {
  // Auth state to determine if player is shown login screen
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Ref for tilt effect on main div
  const tiltRef = useRef(null);

  // useEffect hook to track mouse movement and apply tilt effect to an element
  useEffect(() => {
    if (tiltRef.current) {
      // Reference to element
      const tiltElement = tiltRef.current as HTMLElement;

      // Function to take mouse movement event and applies transformation to tiltElement
      const handleMouseMove = (event: MouseEvent) => {
        const { clientX, clientY } = event;
        const { innerWidth: width, innerHeight: height } = window;
        const tiltKey = 10; // Reduce this to make the tilt less dramatic
        const tiltX = (clientY / height - 0.5) * tiltKey * 2;
        const tiltY = (clientX / width - 0.5) * -tiltKey * 2;
        tiltElement.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      };

      // Listener for mouse movement, triggers handleMouseMove
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        // Remove event listener after hook runs
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  return (
    <div className="overflow-hidden lg:overflow-auto">
      <Navbar />
      <div className="mt-24 h-full w-full">
        <div
          style={{ backgroundSize: "7.5%" }}
          className="relative flex h-full w-full justify-center bg-[url('../assets/gridBG.svg')] bg-fixed bg-repeat"
        >
          <div ref={tiltRef} className="m-8 lg:mx-48 lg:my-4">
            {!isAuthenticated && (
              <div className="h-48 lg:h-96">
                <Welcome setIsAuthenticated={setIsAuthenticated} />
              </div>
            )}
            {isAuthenticated && <WebSocketConnection />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
