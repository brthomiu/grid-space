import { SendMessage } from "react-use-websocket";
import {
  handleMoveUp,
  handleMoveDown,
  handleMoveLeft,
  handleMoveRight,
} from "../../features/controls";

type Props = {
  sendMessage: SendMessage;
};

export default function Controls({ sendMessage }: Props) {
  return (
    <>
      <h1 className="text-white">GRID-SPACE v0.1</h1>
      <p className="text-white">Press a direction to begin.</p>
      <div className="text-red-100 flex gap-4">
        <button onClick={() => handleMoveUp(sendMessage)}>Up</button>
        <button onClick={() => handleMoveDown(sendMessage)}>Down</button>
        <button onClick={() => handleMoveLeft(sendMessage)}>Left</button>
        <button onClick={() => handleMoveRight(sendMessage)}>Right</button>
      </div>
    </>
  );
}
