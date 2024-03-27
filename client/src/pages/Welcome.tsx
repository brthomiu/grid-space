// import { useState } from "react";
// import { sendGuestLoginRequest } from "../api/api";

type Props = {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const Welcome = (props: Props) => {
  const { setIsAuthenticated } = props;

  // const [nameInput, setNameInput] = useState("");
  // const [passwordInput, setPasswordInput] = useState("");

  // const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setNameInput(event.target.value);
  // };

  // const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPasswordInput(event.target.value);
  // };

  // const submitForm = (
  //   setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  // ) => {
  //   if (nameInput.length == 0) {
  //     throw Error("Please enter a name!");
  //   } else {
  //     sendGuestLoginRequest(nameInput, setIsAuthenticated);
  //     setIsAuthenticated(false);
  //   }
  // };

  const loginAsGuest = (
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setIsAuthenticated(true);
  };

  return (
    <div className="rounded-2xl border-2 border-lime-300 border-opacity-80 bg-black bg-opacity-75 p-8 lg:mt-16">
      <h2 className="font-bold text-lime-300">WELCOME TO GRID-SPACE</h2>
      <div className="flex w-56 flex-col gap-4 text-black">
        ?
        {/* <input
          className="rounded border-2 border-lime-300 bg-indigo-600 p-1 text-black"
          maxLength={16}
          type="text"
          id="password"
          value={passwordInput}
          placeholder="Password"
          onChange={onChangePassword}
        /> */}
      </div>
      <div className="flex flex-row justify-around gap-4">
        {/* <button
          onClick={() => submitForm(setIsAuthenticated)}
          className="rounded-lg border border-cyan-500 bg-cyan-950 px-2 py-1 text-cyan-300 hover:border-cyan-400 hover:text-cyan-200"
        >
          Login
        </button>
        <button
          onClick={() => submitForm(setIsAuthenticated)}
          className="rounded-lg border border-purple-500 bg-purple-950 px-2 py-1 text-purple-300 hover:border-purple-400 hover:text-purple-200"
        >
          Register
        </button> */}
        <button
          onClick={() => loginAsGuest(setIsAuthenticated)}
          className="rounded-lg border border-cyan-500 bg-cyan-950 px-4 py-2 text-cyan-300 hover:border-cyan-400 hover:text-cyan-200"
        >
          Play as Guest
        </button>
      </div>
    </div>
  );
};

export default Welcome;
