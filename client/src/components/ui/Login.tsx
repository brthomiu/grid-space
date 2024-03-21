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
      <div className="flex flex-col justify-start max-w-72 gap-2 mt-4">
        <h2 className="text-white">New Character</h2>
        <div className="flex flex-col justify-start gap-4">
          <input
            maxLength={16}
            type="text"
            id="name"
            value={nameInput}
            placeholder="Pick a Name"
            onChange={onChange}
            className="text-black bg-indigo-600 border-2 border-lime-300 rounded p-1"
          />
          <button
            onClick={() => submitForm()}
            className="px-2 py-1 rounded-lg text-lime-300 border border-lime-500 bg-lime-950 hover:border-lime-400 hover:text-lime-200"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
};
