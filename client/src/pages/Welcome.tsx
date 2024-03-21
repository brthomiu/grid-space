import { useState } from "react";

type Props = {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const Welcome = (props: Props) => {
  const { setIsAuthenticated } = props;

  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // const tiltRef = useRef(null); // Create a ref for the div

  // useEffect(() => {
  //   if (tiltRef.current) {
  //     const tiltElement = tiltRef.current as HTMLElement;

  //     const handleMouseMove = (event: MouseEvent) => {
  //       const { clientX, clientY } = event;
  //       const { offsetWidth, offsetHeight } = tiltElement;
  //       const tiltKey = 30; // Max tilt degree
  //       const tiltX = ((clientY / offsetHeight) - 0.5) * tiltKey * 2;
  //       const tiltY = ((clientX / offsetWidth) - 0.5) * -tiltKey * 2;
  //       tiltElement.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  //     };

  //     tiltElement.addEventListener('mousemove', handleMouseMove);

  //     return () => {
  //       tiltElement.removeEventListener('mousemove', handleMouseMove);
  //     };
  //   }
  // }, []);

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(event.target.value);
  };

  const submitForm = (
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (nameInput.length == 0) {
      throw Error("Please enter a name!");
    } else {
      console.log(`${nameInput}`);
      setIsAuthenticated(true);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-lime-300 border-opacity-80 bg-black bg-opacity-75 p-8">
      <h2 className="font-bold text-lime-300">WELCOME TO GRID-SPACE</h2>
      <div className="my-4 flex w-56 flex-col gap-4 text-black">
        <input
          className="rounded border-2 border-lime-300 bg-indigo-600 p-1 text-black"
          maxLength={16}
          type="text"
          id="name"
          value={nameInput}
          placeholder="Username"
          onChange={onChangeName}
        />
        <input
          className="rounded border-2 border-lime-300 bg-indigo-600 p-1 text-black"
          maxLength={16}
          type="text"
          id="password"
          value={passwordInput}
          placeholder="Password"
          onChange={onChangePassword}
        />
      </div>
      <div className="flex flex-row justify-around gap-4">
        <button
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
        </button>
        <button
          onClick={() => submitForm(setIsAuthenticated)}
          className="hover:rose-purple-400 rounded-lg border border-rose-500 bg-rose-950 px-2 py-1 text-rose-300 hover:text-rose-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Welcome;
