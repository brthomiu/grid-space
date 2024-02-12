// WebSocketConnection.tsx
import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

interface Message {
  value: number;
}

const WebSocketConnection: React.FC = () => {
  const socketUrl = 'ws://localhost:8080/ws';
  const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl);

  const [subscribedValue, setSubscribedValue] = useState<number | null>(null);

useEffect(() => {
  console.log('Entering useEffect');  // Check if the effect is being triggered
  console.log('lastMessage:', lastMessage);  // Check the value of lastMessage
  console.log('subscribedValue:', subscribedValue);  // Check the value of subscribedValue

  // Update UI whenever the subscribed value changes
  if (lastMessage && lastMessage.data) {
    const messageData: Message = JSON.parse(lastMessage.data);
    setSubscribedValue(messageData.value);
  }

  console.log('Exiting useEffect');
}, [lastMessage, subscribedValue]);

  useEffect(() => {
    // Log the subscribed value for debugging
    console.log('Subscribed Value:', subscribedValue);
  }, [subscribedValue]);

  const handleClick = () => {
    // Example: Send a message to the server when a button is clicked
    sendMessage(JSON.stringify({ action: 'someAction', data: 'Hello, server!' }));
  };

  return (
    <div className="text-green-400">
      <p>WebSocket Ready State: {ReadyState[readyState]}</p>
      <p>Subscribed Value: {subscribedValue}</p>
      <button onClick={handleClick}>Send Message</button>
    </div>
  );
};

export default WebSocketConnection;
