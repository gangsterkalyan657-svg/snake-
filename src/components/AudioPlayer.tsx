import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    title: "ERR_SIG.001",
    artist: "NULL_POINTER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "bg-cyan-raw"
  },
  {
    title: "MEM_LEAK",
    artist: "BUFFER_OVERFLOW",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "bg-magenta-raw"
  },
  {
    title: "SECTOR_FAULT",
    artist: "CORRUPTED_DRIVE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    color: "bg-white"
  }
];

export function AudioPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => {
        console.error("Playback blocked:", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const onEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full glitch-border-cyan bg-black flex flex-col p-6 relative animate-glitch mt-4 shadow-[8px_8px_0_#ff00ff,-8px_-8px_0_#00ffff]">
      <div className="absolute top-0 right-0 p-2 bg-[#ff00ff] text-black font-pixel text-[10px] z-10">v.1.0.4</div>
      <h2 className='text-xl md:text-2xl font-pixel text-magenta-glitch uppercase tracking-widest mb-6 border-b-4 border-[#ff00ff] pb-2'>AUDIO.SYS</h2>
      
      <div className="flex flex-col gap-4">
        <div className="p-4 border-4 border-white flex items-center gap-4 bg-black relative top-[-10px] left-[-10px] shadow-[10px_10px_0_#00ffff]">
          <div className={`w-16 h-16 flex items-center justify-center border-4 border-white ${currentTrack.color}`}>
            <div className={`w-6 h-6 bg-black animate-ping`} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-3xl font-vt text-cyan-glitch truncate">{currentTrack.title}</p>
            <p className="text-xl font-vt text-white uppercase truncate mt-1 bg-[#ff00ff] text-black inline-block px-1">AUTH: {currentTrack.artist}</p>
          </div>
        </div>
      </div>
      
      {/* Visualizer & Progress */}
      <div className='mt-8 pt-4 border-t-4 border-[#00ffff] border-dashed'>
        <div className='flex justify-between items-end mb-2'>
          <div className='text-2xl font-vt text-white uppercase bg-black'>FREQ_BANDS</div>
          <div className='flex gap-2 items-end h-12'>
            {isPlaying ? (
              <>
                <div className='w-6 bg-[#00ffff] animate-[ping_0.2s_ease-in-out_infinite_alternate] h-6'></div>
                <div className='w-6 bg-[#ff00ff] animate-[ping_0.5s_ease-in-out_infinite_alternate] h-12'></div>
                <div className='w-6 bg-white animate-[ping_0.1s_ease-in-out_infinite_alternate] h-4'></div>
                <div className='w-6 bg-[#00ffff] animate-[ping_0.3s_ease-in-out_infinite_alternate] h-10'></div>
              </>
            ) : (
                <div className="flex gap-2 items-end h-12 opacity-50">
                  <div className='w-6 bg-white h-4'></div>
                  <div className='w-6 bg-white h-4'></div>
                  <div className='w-6 bg-white h-4'></div>
                  <div className='w-6 bg-white h-4'></div>
                </div>
            )}
          </div>
        </div>
        
        <div className='w-full mt-4 border-4 border-white p-1 relative bg-black'>
          <div className='h-6 w-full bg-black overflow-hidden relative'>
            <div 
              className={`absolute top-0 left-0 h-full ${currentTrack.color}`} 
              style={{ width: '100%', transform: `translateX(-${100 - progress}%)`, transition: 'transform 0.1s linear' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-8">
        <button onClick={toggleMute} className="w-12 h-12 border-4 border-[#00ffff] flex items-center justify-center text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-none scale-100 hover:scale-110 active:scale-95">
          {isMuted ? <VolumeX size={24} strokeWidth={3} /> : <Volume2 size={24} strokeWidth={3} />}
        </button>
        
        <div className="flex items-center gap-4">
          <button onClick={prevTrack} className="w-14 h-14 border-4 border-white flex items-center justify-center bg-black hover:bg-white hover:text-black transition-none scale-100 hover:scale-110 active:scale-95">
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay} 
            className="w-20 h-20 border-4 border-[#ff00ff] bg-black text-[#ff00ff] flex items-center justify-center hover:bg-[#ff00ff] hover:text-black transition-none shadow-[4px_4px_0_#00ffff] scale-100 hover:scale-110 active:scale-95 z-10"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
          </button>
          
          <button onClick={nextTrack} className="w-14 h-14 border-4 border-white flex items-center justify-center bg-black hover:bg-white hover:text-black transition-none scale-100 hover:scale-110 active:scale-95">
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />
    </div>
  );
}
