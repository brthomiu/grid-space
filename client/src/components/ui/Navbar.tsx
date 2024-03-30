import gridSpaceTitle from "../../../assets/gridSpaceGifLoop.gif";
import AudioPlayer from "./AudioPlayer";
import { useState } from "react";

const Navbar = () => {
  const [isPlayerShowing, setIsPlayerShowing] = useState(false);

  const showPlayer = () => {
    isPlayerShowing && setIsPlayerShowing(false);
    !isPlayerShowing && setIsPlayerShowing(true);
  };

  return (
    <>
      <div className="fixed top-0 z-50 flex h-24  w-full flex-col bg-black lg:h-24">
        <img
          className="my-3 h-6 w-[265px] justify-center self-center lg:my-6 lg:h-10 lg:w-[360px] xl:my-4 xl:h-16 xl:w-[520px]"
          src={gridSpaceTitle}
          alt="Grid-Space"
        />

        <div className="fixed top-0 ml-4 mt-10 flex scale-75 flex-row gap-4 self-center lg:absolute lg:right-0 lg:ml-0 lg:mt-5 lg:scale-100">
          {!isPlayerShowing && (
            <button
              className="mr-10 mt-3 scale-[250%] text-violet-500"
              onClick={() => showPlayer()}
            >
              ♪
            </button>
          )}
          {isPlayerShowing && <AudioPlayer />}
        </div>
      </div>
    </>
  );
};

export default Navbar;
