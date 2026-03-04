import { useState, useEffect } from 'react';
import { Palette, MoveUpRight, QrCode, Zap } from 'lucide-react';

const PARTICLES = [
  { top: "15%", left: "33%" },
  { top: "48%", left: "72%" },
  { top: "78%", left: "12%" }
];

function Qrpreview_Placeholder() {
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-68 h-68 bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 rounded-2xl flex flex-col items-center justify-center relative transition-all duration-500 border border-slate-200/50 overflow-hidden">
      
      {/* Static gradient orb background */}
      <div className="absolute -inset-20 bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      
      {/* Floating particles (always visible) */}
      <div className="absolute inset-0 opacity-60">
        {PARTICLES.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400/30 rounded-full animate-ping"
            style={{
              top: particle.top,
              left: particle.left,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-400/10 rounded-full blur-xl" />
          
          <div className="relative">
            <Palette size={48} className="text-slate-400 mb-2" />
          </div>
        </div>

        <span className="text-slate-500 mb-2 font-semibold tracking-wide">
          QR Preview
        </span>
        
        <p className="text-xs text-slate-500 text-center px-4 leading-relaxed">
          <span>Enter your data and</span>
          <br />
          <span className="inline-flex items-center gap-1.5 mt-1">
            <span className="px-2 py-0.5 bg-indigo-50 rounded-full">
              <span className="text-indigo-600 font-medium text-xs flex items-center gap-1">
                <Zap size={10} className="text-indigo-500" />
                Generate
              </span>
            </span>
            <span className="text-slate-400 text-[10px]">
              <MoveUpRight size={10} className="inline-block" />
            </span>
          </span>
        </p>
      </div>

      {/* Static border */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-indigo-500/30 to-purple-500/30 p-px">
        <div className="absolute inset-0 rounded-2xl bg-white/90" />
      </div>

      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-indigo-300/60 rounded-tl-lg" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-indigo-300/60 rounded-br-lg" />

      {/* Pulsing attention ring */}
      <div className={`absolute inset-0 rounded-2xl ring-2 ring-indigo-400/20 transition-all duration-1000 ${
        isPulsing ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
      }`} />
    </div>
  );
}

export default Qrpreview_Placeholder;