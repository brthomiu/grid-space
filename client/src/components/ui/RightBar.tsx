import { ReadyState } from "react-use-websocket";
import { Unit, Tile } from "../../types/types";
import RotateCube from "./RotateCube";
import wood from "../../../assets/tree.svg";
import stone from "../../../assets/rock.svg";
import ore from "../../../assets/metal.svg";

type Props = {
  sideStyles: string;
  contentStyles: string;
  characterObject: Unit | null | undefined;
  readyState: ReadyState;
  currentMap: Tile[] | undefined;
};

const RightBar = (props: Props) => {
  const { sideStyles, contentStyles, characterObject, readyState, currentMap } =
    props;

  const viewCurrentTile = (
    currentMap: Tile[],
    characterObject: Unit,
  ): Tile | undefined => {
    return currentMap.find((tile) => tile.Unit === characterObject.Id);
  };

  return (
    <div
      style={{ transition: "all 2s" }}
      className={`${sideStyles} flex min-h-96 flex-row justify-center rounded-2xl border-2 border-lime-300 border-opacity-80 bg-black bg-opacity-75 p-4 py-8 lg:mx-16 xl:mx-24`}
    >
      <div
        style={{ transition: "all 2s" }}
        className={`${contentStyles} flex flex-col content-center`}
      >
        {!characterObject && ReadyState[readyState] != "CLOSED" && (
          <div className="my-auto ml-[44px] flex flex-row justify-center">
            <RotateCube propMultiplier={1} />
          </div>
        )}

        {characterObject && currentMap && (
          <div className="flex flex-col justify-center">
            <h3 className="m-auto mb-1">Location</h3>
            <div className="m-auto text-lime-300">{`${viewCurrentTile(currentMap, characterObject)?.Location.Y}, ${viewCurrentTile(currentMap, characterObject)?.Location.X}`}</div>
            <h3 className="m-auto mt-6">Resource</h3>
            {viewCurrentTile(currentMap, characterObject)?.Resource.Type ===
              "Wood" && (
              <div className="flex mt-2 flex-col justify-center m-auto text-lime-300">
                <img className="scale-125 translate-x-3" src={wood} alt={"Wood"} />
               <h3 className="m-auto mt-2">Wood</h3>
              </div>
            )}
            {viewCurrentTile(currentMap, characterObject)?.Resource.Type ===
              "Stone" && (
              <div className="flex flex-col justify-center m-auto text-lime-300">
                <img className="scale-125 translate-x-2" src={stone} alt={"Stone"} />
                <h3 className="m-auto mt-2">Stone</h3>
              </div>
            )}
            {viewCurrentTile(currentMap, characterObject)?.Resource.Type ===
              "Ore" && (
              <div className="flex flex-col justify-center m-auto text-lime-300">
                <img className="scale-125 translate-x-1" src={ore} alt={"Ore"} />
                <h3 className="m-auto mt-2">Ore</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightBar;
