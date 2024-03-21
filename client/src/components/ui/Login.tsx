/* eslint-disable @typescript-eslint/ban-types */
import { useState } from "react";
import { Unit } from "../../types/types";
import { sendCharacterCreationMessage } from "../../api/api";
import { SendMessage } from "react-use-websocket";

type Props = {
  characterObject: Unit | null | undefined;
  sendMessage: SendMessage;
};

export const Login = ({ characterObject, sendMessage }: Props) => {
  const [nameInput, setNameInput] = useState("");

  // Function to handle form string input
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };

  // Function to handle form submission
  const submitForm = () => {
    if (nameInput.length == 0) {
      throw Error("Please enter a name!");
    } else {
      sendCharacterCreationMessage(nameInput, sendMessage);
    }
  };

  if (characterObject && characterObject.Name) {
    return null;
  } else {
    return (
      <div className="mt-4 flex max-w-72 flex-col justify-start gap-2">
        <h2 className="text-white">New Character</h2>
        <div className="flex flex-col justify-start gap-4">
          <input
            maxLength={16}
            type="text"
            id="name"
            value={nameInput}
            placeholder="Pick a Name"
            onChange={onChange}
            className="rounded border-2 border-lime-300 bg-indigo-600 p-1 text-black"
          />
          <button
            onClick={() => submitForm()}
            className="rounded-lg border border-lime-500 bg-lime-950 px-2 py-1 text-lime-300 hover:border-lime-400 hover:text-lime-200"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
};
