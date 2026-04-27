import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#fff] flex flex-col p-8 relative font-mono selection:bg-[#00ffff] selection:text-black">
      
      {/* Background Atmosphere */}
      <div className="scanlines"></div>
      <div className="static-noise"></div>
      
      {/* Header Container */}
      <header className="z-10 flex justify-between items-center mb-10 w-full tear-effect py-2">
        <div>
          <h1 className="text-5xl font-black tracking-widest flex items-center gap-2 glitch-text" data-text="CYBER.SNAKE">
            CYBER.SNAKE
          </h1>
          <p className="text-sm uppercase tracking-widest mt-2 raw-text-cyan bg-black py-1 px-2 inline-block border-[1px] border-cyan-500">SYS.KERNEL_PANIC :: v9.9.9</p>
        </div>
        
        <div className="flex gap-12">
          <div className="text-right p-2 border-r-4 border-b-4 border-[#ff00ff] bg-black">
            <p className="text-xs uppercase mb-1 font-bold raw-text-magenta">Current Score</p>
            <p className="text-3xl font-mono raw-text-cyan tracking-widest w-20 text-right font-black">
              {score.toString().padStart(3, '0')}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full min-h-0">
        
        {/* Game Container (Center) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col mt-4">
          <div className="flex-1 jarring-box p-4 flex items-center justify-center relative group overflow-hidden">
            <SnakeGame onScoreUpdate={setScore} />
          </div>
          
          <div className="mt-4 flex justify-between items-center text-xs uppercase font-bold tracking-widest px-2 font-mono raw-text-cyan bg-black p-2 border border-[#00ffff]">
            <span>Input: Keyboard</span>
            <span>Use W A S D or Arrows</span>
            <span className="raw-text-magenta animate-pulse">System: Online</span>
          </div>
        </div>

        {/* Music Player Container (Right Sidebar) */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-8 mt-4">
          <MusicPlayer />
          
          <div className="jarring-box p-4 text-left border-2 mt-4">
            <p className="text-sm uppercase font-bold mb-2 raw-text-magenta underline">ERR_INSTRUCTION_NOT_FOUND</p>
            <p className="text-sm leading-relaxed raw-text-cyan uppercase">
              // WARNING <br/>
              MANEUVER VIA [WASD] OR [ARROWS]. <br/>
              CONSUME DATA PACKETS TO AVOID SYSTEM HALT.
            </p>
          </div>
        </div>

      </main>

    </div>
  );
}
