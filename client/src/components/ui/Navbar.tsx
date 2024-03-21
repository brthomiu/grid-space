import gridSpaceTitle from "../../../assets/gridSpaceTitle.svg";
import AudioPlayer from "./AudioPlayer";

const Navbar = () => {
  return (
    <div className="fixed top-0 z-50 flex h-16 w-full flex-col bg-black lg:h-24">
      <img
        className="my-4 h-8 justify-center lg:h-16"
        src={gridSpaceTitle}
        alt="Grid-Space"
      />
      <div className="absolute right-0 top-0 m-4 flex flex-row gap-4">
        <AudioPlayer />
      </div>
    </div>
  );
};

export default Navbar;
