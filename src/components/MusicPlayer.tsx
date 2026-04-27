import { Play, Pause, SkipForward, SkipBack, Volume2, MonitorPlay } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "0x0A: NEON_DRIVER",
    artist: "SYS.SND",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "cyan"
  },
  {
    id: 2,
    title: "0x0B: NULL_PTR",
    artist: "CRASH.OVERRIDE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    color: "magenta"
  },
  {
    id: 3,
    title: "0x0C: SEGFAULT",
    artist: "MEM_DUMP",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    color: "magenta"
  }
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const activeTrack = TRACKS[currentTrack];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play error:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setIsPlaying(true);
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  };

  const playPrev = () => {
    setIsPlaying(true);
    setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setVolume(value);
  };

  return (
    <div className="w-full jarring-box p-6 flex flex-col gap-4 relative font-mono overflow-hidden">
      
      <div className="absolute top-0 right-0 p-1 bg-[#ff00ff] text-black text-xs font-black">
        [AUDIO_THREAD]
      </div>

      <h2 className="text-xl font-black uppercase tracking-widest mb-2 border-b-2 border-[#00ffff] pb-2 raw-text-cyan text-left">
        {'>'} EXEC PLAYBACK UI
      </h2>

      <div className="flex items-center gap-4 mt-2">
        <div 
          className={`w-16 h-16 flex items-center justify-center flex-shrink-0 bg-black border-4
          ${activeTrack.color === 'cyan' ? 'border-[#00ffff] shadow-[4px_4px_0_#ff00ff]' : 
            'border-[#ff00ff] shadow-[4px_4px_0_#00ffff]'}`}
        >
          <MonitorPlay size={32} className={activeTrack.color === 'cyan' ? 'text-[#00ffff]' : 'text-[#ff00ff]'} />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <h3 
            className={`text-xl font-bold truncate tracking-wider uppercase
            ${activeTrack.color === 'cyan' ? 'raw-text-cyan' : 'raw-text-magenta'}`}
          >
            {activeTrack.title}
          </h3>
          <p className="bg-black text-[#fff] border-[1px] border-[#fff] inline-block px-1 mt-1 text-xs truncate uppercase max-w-fit">{activeTrack.artist}</p>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={activeTrack.url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={playNext}
      />

      <div className="flex flex-col gap-2 mt-4">
        <input 
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleSeek}
          className={`w-full h-4 bg-black border-2 border-[#fff] appearance-none cursor-pointer rounded-none
            ${activeTrack.color === 'cyan' ? 'accent-[#00ffff]' : 'accent-[#ff00ff]'}`}
        />
        <div className="flex justify-between text-sm text-[#fff] font-bold">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-4 border-t-2 border-[#fff] pt-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-4">
          <button onClick={playPrev} className="bg-black border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-none cursor-pointer p-2">
             <SkipBack size={24} />
          </button>
          
          <button 
            onClick={togglePlay} 
            className={`w-14 h-14 flex items-center justify-center bg-black border-4 text-[#fff] hover:scale-105 transition-none cursor-pointer 
              ${activeTrack.color === 'cyan' ? 'border-[#00ffff] shadow-[4px_4px_0_#ff00ff]' : 'border-[#ff00ff] shadow-[4px_4px_0_#00ffff]'}`}
          >
            {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="translate-x-[2px] fill-current" />}
          </button>
          
          <button onClick={playNext} className="bg-black border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-none cursor-pointer p-2">
             <SkipForward size={24} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex flex-col items-end gap-1 flex-1">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-[#fff]" />
            <input 
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolume}
              className={`w-20 h-3 bg-black border border-[#fff] appearance-none cursor-pointer rounded-none
                ${activeTrack.color === 'cyan' ? 'accent-[#00ffff]' : 'accent-[#ff00ff]'}`}
            />
          </div>
          <span className="text-xs uppercase font-bold tracking-wider">VOL_{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
