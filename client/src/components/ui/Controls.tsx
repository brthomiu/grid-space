import React, { useEffect } from 'react';
import { SendMessage } from 'react-use-websocket';
import {
  handleMoveUp,
  handleMoveDown,
  handleMoveLeft,
  handleMoveRight,
} from '../../features/controls';
import { Unit } from '../../types/types';

type Props = {
  sendMessage: SendMessage;
  characterObject: Unit | null | undefined;
};

export default function Controls({ sendMessage, characterObject }: Props) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!characterObject) return;

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          handleMoveUp(characterObject, sendMessage);
          break;
        case 'ArrowDown':
        case 's':
          handleMoveDown(characterObject, sendMessage);
          break;
        case 'ArrowLeft':
        case 'a':
          handleMoveLeft(characterObject, sendMessage);
          break;
        case 'ArrowRight':
        case 'd':
          handleMoveRight(characterObject, sendMessage);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [characterObject, sendMessage]);

  return (
    characterObject && (
      <>
        <div className="text-red-100 flex gap-8 mt-6">
          <button className="scale-x-150 font-bold text-2xl text-lime-300" onClick={() => handleMoveLeft(characterObject, sendMessage)}>
            {`<`}
          </button>
          <div className="flex flex-col gap-8">
            <button className="scale-125 font-bold text-2xl text-lime-300" onClick={() => handleMoveUp(characterObject, sendMessage)}>
              {`^`}
            </button>
            <button
              className="rotate-180 scale-125 font-bold text-2xl text-lime-300"
              onClick={() => handleMoveDown(characterObject, sendMessage)}
            >
              {`^`}
            </button>
          </div>
          <button className="scale-x-150 font-bold text-2xl text-lime-300" onClick={() => handleMoveRight(characterObject, sendMessage)}>
            {`>`}
          </button>
        </div>
      </>
    )
  );
}
