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
    characterObject && (
      <>
        <p className="text-white mb-4">Press a direction to move.</p>
        <div className="text-red-100 flex gap-8">
          <button onClick={() => handleMoveLeft(characterObject, sendMessage)}>
            Left
          </button>
          <div className="flex flex-col gap-8">
            <button onClick={() => handleMoveUp(characterObject, sendMessage)}>
              Up
            </button>
            <button
              onClick={() => handleMoveDown(characterObject, sendMessage)}
            >
              Down
            </button>
          </div>
          <button onClick={() => handleMoveRight(characterObject, sendMessage)}>
            Right
          </button>
        </div>
      </>
    )
  );
}
