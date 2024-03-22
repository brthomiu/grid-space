import { ReadyState } from "react-use-websocket";
import { Unit } from "../../types/types";
import RotateCube from "./RotateCube";

type Props = {
  sideStyles: string;
  contentStyles: string;
  characterObject: Unit | null | undefined;
  readyState: ReadyState;
};

const RightBar = (props: Props) => {
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
            <RotateCube />
          </div>
        )}

        {characterObject && (
          <div>
            <h3>One</h3>
            <h3>Two</h3>
            <h3>Three</h3>
            <h3>Four</h3>
            <h3>Five</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightBar;
