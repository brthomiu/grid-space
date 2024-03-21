import WebSocketConnection from "./components/WebSocketConnection";
import { useState, useRef, useEffect } from "react";
import Welcome from "./pages/Welcome";
import Navbar from "./components/ui/Navbar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const tiltRef = useRef(null); // Create a ref for the div

  useEffect(() => {
    if (tiltRef.current) {
      const tiltElement = tiltRef.current as HTMLElement;
  
      const handleMouseMove = (event: MouseEvent) => {
        const { clientX, clientY } = event;
        const { innerWidth: width, innerHeight: height } = window;
        const tiltKey = 20; // Reduce this to make the tilt less dramatic
        const tiltX = ((clientY / height) - 0.5) * tiltKey * 2;
        const tiltY = ((clientX / width) - 0.5) * -tiltKey * 2;
        tiltElement.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      };
  
      window.addEventListener('mousemove', handleMouseMove);
  
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);
  

  return (
    <>
      <Navbar />
      <div className="w-full h-full mt-24">
        <div
          style={{ backgroundSize: "7.5%" }}
          className="relative flex justify-center w-full bg-repeat h-full bg-fixed bg-[url('../assets/gridBG.svg')]"
        >
          <div ref={tiltRef} className="lg:mx-48 lg:my-12 m-8">
            {!isAuthenticated && (
              <div className="h-48 lg:h-96">
                <Welcome setIsAuthenticated={setIsAuthenticated} />
              </div>
            )}
            {isAuthenticated && <WebSocketConnection />}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
