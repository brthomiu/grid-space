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
      <div>
        <h2>TEST: {nameInput}</h2>
        <input
          maxLength={16}
          type="text"
          id="name"
          value={nameInput}
          placeholder="Pick a Name"
          onChange={onChange}
        />
        <button onClick={() => submitForm()} className="text-blue-300">
          Submit
        </button>
      </div>
    );
  }
};
