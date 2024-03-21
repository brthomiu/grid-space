/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GiNextButton, GiPlayButton, GiPauseButton } from "react-icons/gi";
import { useState, useRef, useEffect } from "react";
import loop from "../../../assets/terminal.mp3";
import loop2 from "../../../assets/pushStart.mp3";
import loop3 from "../../../assets/switchboard.mp3";
import loop4 from "../../../assets/gravityDrop.mp3";
import loop5 from "../../../assets/dropSchema.mp3";

function AudioPlayer() {
  // Type definition for song object
  type Song = {
    title: string;
    file: any;
  };

  // Playlist Object
  const playlist: Song[] = [
    { title: "Terminal", file: loop },
    { title: "Push Start", file: loop2 },
    { title: "Switchboard", file: loop3 },
    { title: "Gravity", file: loop4 },
    { title: "Drop Schema", file: loop5 },
  ];

  // Length of playlist
  const length = playlist.length - 1;

  // Reference to audio player element
  const audioRef = useRef<HTMLAudioElement>(null);

  // State to track if audio is playing
  const [isPlaying, setIsPlaying] = useState(false);

  // State for current track number
  const [trackNumber, setTrackNumber] = useState(0);

  // State to hold current song
  const [currentSong, setCurrentSong] = useState<Song | null>(playlist[0]);

  // State to turn on autoplay once user cycles through tracks
  const [auto] = useState<boolean>(false);

  // State to track current time of audio playback
  const [currentTime, setCurrentTime] = useState(0);

  // State to store duration of current audio file
  const [duration, setDuration] = useState(0);

  // State with a toggle to trigger useEffect that starts player when track changes
  const [togglePlayNewTrack, setTogglePlayNewTrack] = useState<boolean>(false);

  // State to store volume of player
  const [volume, setVolume] = useState(0.5); // Volume is between 0 and 1

  // Function to cycle through tracks
  const nextSong = () => {
    if (trackNumber < length) {
      const newTrackNumber = trackNumber + 1;
      setTrackNumber(newTrackNumber);
      setCurrentSong(playlist[newTrackNumber]);
    } else if (trackNumber === length) {
      setTrackNumber(0);
      setCurrentSong(playlist[0]);
    }
    setCurrentTime(0); // Reset the currentTime state to 0
    if (togglePlayNewTrack) {
      setTogglePlayNewTrack(false);
    } else {
      setTogglePlayNewTrack(true);
    }
  };

  // Function to toggle audio play/pause
  const togglePlay = () => {
    const audioElement = audioRef.current;
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // useEffect to listen for timeupdate event from audio element
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", () => {
        setCurrentTime(audioElement.currentTime);
      });
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", () => {});
      }
    };
  }, [togglePlayNewTrack]);

  // useEffect to update the player with the duration of the new audio file
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("loadedmetadata", () => {
        setDuration(audioElement.duration);
      });
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener("loadedmetadata", () => {});
      }
    };
  }, [togglePlayNewTrack]);

  // useEffect to play the audio when the current song changes
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.volume = volume; // Set the volume
      audioElement.load();
      audioElement
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.log(error));
    }
  }, [currentSong]);

  // useEffect to go to the next track when the song ends
  useEffect(() => {
    document
      .getElementById("Player")!
      .addEventListener("ended", () => nextSong());
  });

  return (
    <>
      {currentSong && (
        <div className="flex flex-row">
          <div className="flex flex-col mr-2">
            <div className="flex flex-row justify-start ml-2 mb-1">
              <h3 className="text-purple-500 font-semibold">Current Song:</h3>
              <h3 className="text-violet-300 ml-1">
                &nbsp;{currentSong.title}
              </h3>
            </div>

            <audio
              className="hidden"
              ref={audioRef}
              id="Player"
              key={currentSong.title}
              controls
              loop={false}
              autoPlay={auto}
            >
              <source src={currentSong.file} />
            </audio>

            <div className="flex flex-row gap-4">
              <input
                className="appearance-none bg-indigo-500 h-2 m-2 w-56"
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => {
                  const audioElement = audioRef.current;
                  if (audioElement) {
                    audioElement.currentTime = Number(e.target.value);
                    setCurrentTime(audioElement.currentTime);
                  }
                }}
              />

              <button onClick={togglePlay}>
                {isPlaying ? <GiPauseButton /> : <GiPlayButton />}
              </button>
              <button className="" onClick={nextSong}>
                <GiNextButton />
              </button>
            </div>
          </div>
          <input
            className="appearance-none bg-lime-400 w-16 h-1 mt-6 -rotate-90 scale-75"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const newVolume = Number(e.target.value);
              setVolume(newVolume);
              if (audioRef.current) {
                audioRef.current.volume = newVolume;
              }
            }}
          />
        </div>
      )}
    </>
  );
}

export default AudioPlayer;
