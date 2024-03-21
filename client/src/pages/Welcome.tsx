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
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (nameInput.length == 0) {
      throw Error("Please enter a name!");
    } else {
      console.log(`${nameInput}`);
      setIsAuthenticated(true);
    }
  };

  return (
    <div className="bg-black border-lime-300 border-2 border-opacity-80 p-8 rounded-2xl bg-opacity-75">
      <h2 className="text-lime-300 font-bold">WELCOME TO GRID-SPACE</h2>
      <div className="my-4 w-56 flex flex-col gap-4 text-black">
        <input
          className="p-1 rounded"
          maxLength={16}
          type="text"
          id="name"
          value={nameInput}
          placeholder="Username"
          onChange={onChangeName}
        />
        <input
          className="p-1 rounded"
          maxLength={16}
          type="text"
          id="password"
          value={passwordInput}
          placeholder="Password"
          onChange={onChangePassword}
        />
      </div>
      <div className="flex flex-row gap-4 justify-around">
      <button
        onClick={() => submitForm(setIsAuthenticated)}
        className="px-2 py-1 rounded-lg text-cyan-300 border border-cyan-500 bg-cyan-950 hover:border-cyan-400 hover:text-cyan-200"
      >
        Login
      </button>
      <button
        onClick={() => submitForm(setIsAuthenticated)}
        className="px-2 py-1 rounded-lg text-purple-300 border border-purple-500 bg-purple-950 hover:border-purple-400 hover:text-purple-200"
      >
        Register
      </button>
      <button
        onClick={() => submitForm(setIsAuthenticated)}
        className="px-2 py-1 rounded-lg text-rose-300 border border-rose-500 bg-rose-950 hover:rose-purple-400 hover:text-rose-200"
      >
        Reset
      </button>
      </div>
    </div>
  );
};

export default Welcome;
