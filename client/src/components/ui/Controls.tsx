import { SendMessage } from "react-use-websocket";
import {
  handleMoveUp,
  handleMoveDown,
  handleMoveLeft,
  handleMoveRight,
} from "../../features/controls";
import { Unit } from "../../types/types";

type Props = {
  sendMessage: SendMessage;
  characterObject: Unit | null | undefined;
};

export default function Controls({ sendMessage, characterObject }: Props) {
  return (
    characterObject?.Location && (
      <>
        <h1 className="text-white">GRID-SPACE v0.1</h1>
        <p className="text-white">Press a direction to begin.</p>
        <div className="text-red-100 flex gap-4">
          <button onClick={() => handleMoveUp(characterObject, sendMessage)}>
            Up
          </button>
          <button onClick={() => handleMoveDown(characterObject, sendMessage)}>
            Down
          </button>
          <button onClick={() => handleMoveLeft(characterObject, sendMessage)}>
            Left
          </button>
          <button onClick={() => handleMoveRight(characterObject, sendMessage)}>
            Right
          </button>
        </div>
      </>
    )
  );
}
