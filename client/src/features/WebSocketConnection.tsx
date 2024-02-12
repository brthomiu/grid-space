// WebSocketConnection.tsx
import React, { useEffect } from "react";
import useWebSocket from "react-use-websocket";

const WebSocketConnection: React.FC = () => {
  const socketUrl = "ws://localhost:8080/ws"; // Replace with your WebSocket server URL
  const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl);

  useEffect(() => {
    // ComponentDidMount
    console.log("WebSocket connection opened");

    // Specify cleanup logic in componentWillUnmount
    return () => {
      console.log("WebSocket connection closed");
    };
  }, []); // empty dependency array to run once on mount

  const handleClick = () => {
    // Example: Send a message to the server when a button is clicked
    sendMessage(
      JSON.stringify({ action: "someAction", data: "Hello, server!" })
    );
  };

  return (
    <div>
      <p>WebSocket Ready State: {readyState}</p>
      <p>Last Message: {lastMessage?.data}</p>
      <button onClick={handleClick}>Send Message</button>
    </div>
  );
};

export default WebSocketConnection;
