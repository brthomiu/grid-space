import gridSpaceTitle from "../../../assets/gridSpaceTitle.svg";
import AudioPlayer from "./AudioPlayer";

const Navbar = () => {
  return (
    <div className="fixed top-0 z-50 flex h-24  w-full flex-col bg-black lg:h-24">
      <img
        className="my-3 h-6 justify-center lg:my-6 lg:h-10 xl:my-4 xl:h-16"
        src={gridSpaceTitle}
        alt="Grid-Space"
      />
      <div className="fixed top-0 ml-4 mt-10 flex scale-75 flex-row gap-4 self-center lg:absolute lg:right-0 lg:ml-0 lg:mt-5 lg:scale-100">
        <AudioPlayer />
      </div>
    </div>
  );
};

export default Navbar;
