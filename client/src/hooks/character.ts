import { Unit } from "../types/types";

export const useCreateCharacter = (
  characterObject: Unit | null | undefined,
  setCharacterObject: React.Dispatch<
    React.SetStateAction<Unit | null | undefined>
  >
) => {
  const getCharacter = () => {
    if (characterObject) {
      return;
    } else {
      const id = new Date().getTime().toString();

      const newCharacter: Unit = {
        Id: id,
        Type: "Player",
        Name: "Host",
        Stats: {
          Health: 10,
          Attack: 3,
          Defense: 1,
        },
        Location: {
          X: 5,
          Y: 5,
        },
      };
      console.log("newCharacter", newCharacter)
      setCharacterObject(newCharacter);
    }
  };

  getCharacter();
};
