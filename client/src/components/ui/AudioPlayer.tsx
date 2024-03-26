/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

// AudioPlayer.tsx - Custom audio player component
import { GiNextButton, GiPlayButton, GiPauseButton } from "react-icons/gi";
import { useState, useRef, useEffect } from "react";
import loop from "../../../assets/terminal.mp3";
import loop2 from "../../../assets/switchboard.mp3";
import loop3 from "../../../assets/gravityDrop.mp3";

function AudioPlayer() {
  // Type definition for song object
  type Song = {
    title: string;
    file: any;
    bpm: number;
  };

  // Playlist Object
  const playlist: Song[] = [
    { title: "Terminal", file: loop, bpm: 136 },
    { title: "Switchboard", file: loop2, bpm: 120 },
    { title: "Gravity", file: loop3, bpm: 90 },
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
  const [volume, setVolume] = useState(0.3); // Volume is between 0 and 1

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
      {/* Audio Player only renders if currentSong exists */}
      {currentSong && (
        // Song title
        <div className="flex flex-row">
          <div className="mr-2 flex flex-col">
            <div className="mb-1 ml-2 flex flex-row justify-start">
              <h3 className="font-semibold text-purple-500">Current Song:</h3>
              <h3 className="ml-1 text-violet-300">
                &nbsp;{currentSong.title}
              </h3>
            </div>

            {/* Hidden audio player element manipulated with custom buttons */}
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

            {/* Range input for audio tracking */}
            <div className="flex flex-row gap-4">
              <input
                className="m-2 h-2 w-56 appearance-none bg-indigo-500"
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

              {/* Play/Pause/Next buttons */}
              <button onClick={togglePlay}>
                {isPlaying ? <GiPauseButton /> : <GiPlayButton />}
              </button>
              <button className="" onClick={nextSong}>
                <GiNextButton />
              </button>
            </div>
          </div>

          {/* Range input for volume control */}
          <input
            className="mt-6 h-1 w-16 -rotate-90 scale-75 appearance-none bg-lime-400"
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
