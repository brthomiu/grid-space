import { Unit } from "../types/types";

export const useCreateCharacter = () => {
  const getCharacter = () => {
    const currentCharacter = localStorage.getItem("playerCharacter");

    if (currentCharacter) {
      const parsedCharacter: Unit = JSON.parse(currentCharacter);

      if (parsedCharacter.Id) return;
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
      localStorage.setItem("playerCharacter", JSON.stringify(newCharacter));
    }
  };

  getCharacter();
};
