import { ReadyState } from "react-use-websocket";
import { Unit } from "../../types/types";
import RotateCube from "./RotateCube";

type Props = {
  sideStyles: string;
  contentStyles: string;
  characterObject: Unit | null | undefined;
  readyState: ReadyState;
};

const LeftBar = (props: Props) => {
  const { sideStyles, contentStyles, characterObject, readyState } = props;

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

        {characterObject && (
          <div>
            <h3 className="m-auto mb-1">Name</h3>
            <div className="text-lime-300">{`${characterObject.Name}`} </div>
            <h3 className="m-auto mt-6 mb-1">Health</h3>
            <div className="text-red-500">{`${characterObject.Stats.Health}`} </div>
            <h3 className="m-auto mt-6 mb-1">Attack</h3>
            <div className="text-indigo-400">{`${characterObject.Stats.Attack}`} </div>
            <h3 className="m-auto mt-6 mb-1">Defense</h3>
            <div className="text-indigo-400">{`${characterObject.Stats.Defense}`} </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftBar;
