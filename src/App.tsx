import { AudioPlayer } from './components/AudioPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden relative selection:bg-[#ff00ff] selection:text-[#00ffff]">
      
      {/* Glitch Overlay Layers */}
      <div className="scanlines mix-blend-overlay"></div>
      <div className="noise mix-blend-screen"></div>

      {/* Header */}
      <header className='h-20 border-b-8 border-[#00ffff] flex items-center justify-between px-8 bg-black relative z-10 glitch-border-magenta m-4 animate-glitch'>
        <div className='flex items-center gap-6'>
          <div className='w-8 h-8 bg-[#ff00ff] border-4 border-white animate-ping'></div>
          <h1 className='text-2xl md:text-3xl font-pixel text-cyan-glitch tracking-tighter uppercase'>SYS.CORRUPT</h1>
        </div>
        <div className='hidden md:flex flex-col items-end uppercase tracking-widest font-bold'>
          <span className='font-pixel text-[10px] text-magenta-glitch'>LINK.STATUS</span>
          <span className='font-vt text-4xl animate-pulse bg-white text-black px-2'>ERR_0x999</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col xl:flex-row p-4 md:p-6 gap-8 overflow-hidden relative z-10 w-full max-w-[1400px] mx-auto pb-12">
        <section className="xl:w-96 flex-shrink-0 flex flex-col gap-6">
          <AudioPlayer />
        </section>
        
        <section className="flex-1 min-h-0 flex items-center justify-center relative overflow-hidden">
          <SnakeGame />
        </section>
      </main>
      
    </div>
  );
}
