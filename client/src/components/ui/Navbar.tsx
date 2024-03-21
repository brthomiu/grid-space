import gridSpaceTitle from "../../../assets/gridSpaceTitle.svg";
import AudioPlayer from "./AudioPlayer";

const Navbar = () => {
  return (
    <div className="fixed z-50 top-0 h-16 lg:h-24 w-full bg-black flex flex-col">
      <img
        className="h-8 my-4 lg:h-16 justify-center"
        src={gridSpaceTitle}
        alt="Grid-Space"
      />
      <div className="m-4 flex flex-row absolute right-0 top-0 gap-4">
      <AudioPlayer />
      </div>
    </div>
  );
};

export default Navbar;
