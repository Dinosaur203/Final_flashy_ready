
import React, { useState, useRef, useEffect } from 'react';
import { FiPlay, FiPause } from 'react-icons/fi';

type Props = {
  src?: string;
  className?: string;
};

const BackgroundMusic: React.FC<Props> = ({ src = '/lofi-sample.mp3', className = '' }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Audio element created lazily when user clicks play (to respect browser autoplay policies)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggle = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.18;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch (e) {
        // play blocked
        console.warn('Playback failed', e);
      }
    }
  };

  return (
    <button
      onClick={toggle}
      className={"flex items-center gap-2 px-3 py-2 rounded-full shadow-md transform hover:scale-105 transition bg-white/6 backdrop-blur text-white " + className}
      aria-label={playing ? 'Pause music' : 'Play music'}
    >
      {playing ? <FiPause className="w-4 h-4"/> : <FiPlay className="w-4 h-4"/>}
      <span className="text-sm font-medium">{playing ? 'Pause' : 'Play'}</span>
    </button>
  );
};

export default BackgroundMusic;
