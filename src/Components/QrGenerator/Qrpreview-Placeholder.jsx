import { useState, useEffect } from 'react';
import { Palette, Sparkles, MoveUpRight, QrCode, Zap, Eye } from 'lucide-react';

const PARTICLES = [
  { top: "15%", left: "33%" },
  { top: "48%", left: "72%" },
  { top: "78%", left: "12%" }
];

function Qrpreview_Placeholder() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div 
      className="w-68 h-68 bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 rounded-2xl flex flex-col items-center justify-center relative group cursor-pointer transition-all duration-500 hover:shadow-xl hover:scale-[1.02] hover:shadow-indigo-500/10 border border-slate-200/50 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient orb background */}
      <div className={`absolute -inset-20 bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl transition-all duration-700 ${
        isHovered ? 'opacity-100 scale-150' : 'opacity-0 scale-100'
      }`} />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
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

      {/* Main content container with backdrop blur effect on hover */}
      <div className={`relative z-10 flex flex-col items-center justify-center transition-all duration-500 ${
        isHovered ? 'backdrop-blur-xs' : ''
      }`}>
        {/* Icon with enhanced animation */}
        <div className={`relative transition-all duration-500 ${isHovered ? 'scale-110 -translate-y-1' : 'scale-100'}`}>
          {/* Background glow for icon */}
          <div className={`absolute inset-0 bg-indigo-400/20 rounded-full blur-xl transition-all duration-500 ${
            isHovered ? 'opacity-100 scale-150' : 'opacity-0 scale-100'
          }`} />
          
          {/* Multiple icons for visual interest */}
          <div className="relative">
            <Palette 
              size={48} 
              className={`text-slate-400 mb-2 transition-all duration-500 ${
                isHovered ? 'text-indigo-500 rotate-3' : ''
              }`} 
            />
            
            {/* Floating mini QR icon */}
            <QrCode 
              size={16} 
              className={`absolute -top-2 -right-2 text-indigo-500 transition-all duration-500 ${
                isHovered ? 'opacity-100 rotate-12 scale-110' : 'opacity-0'
              }`} 
            />
          </div>
        </div>

        {/* Main text with animation */}
        <span className={`text-slate-500 mb-2 font-semibold tracking-wide transition-all duration-500 ${
          isHovered ? 'text-indigo-600 scale-105' : ''
        }`}>
          QR Preview
        </span>
        
        {/* Description with enhanced typography */}
        <p className="text-xs text-slate-500 text-center px-4 leading-relaxed">
          <span className={`transition-all duration-500 inline-block ${
            isHovered ? 'text-slate-600' : ''
          }`}>
            Enter your data and
          </span>
          <br />
          <span className="inline-flex items-center gap-1.5 mt-1">
            <span className={`px-2 py-0.5 bg-indigo-50 rounded-full transition-all duration-500 ${
              isHovered ? 'bg-indigo-100 scale-105' : ''
            }`}>
              <span className="text-indigo-600 font-medium text-xs flex items-center gap-1">
                <Zap size={10} className="text-indigo-500" />
                Generate
              </span>
            </span>
            <span className={`text-slate-400 text-[10px] transition-all duration-500 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}>
              <MoveUpRight size={10} className="inline-block" />
            </span>
          </span>
        </p>
      </div>

      {/* Animated border with gradient */}
      <div className={`absolute inset-0 rounded-2xl bg-linear-to-r from-indigo-500 to-purple-500 p-px transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 rounded-2xl bg-white/90" />
      </div>

      {/* Subtle corner accents */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-indigo-200/50 rounded-tl-lg transition-all duration-500 group-hover:border-indigo-400 group-hover:scale-110" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-indigo-200/50 rounded-br-lg transition-all duration-500 group-hover:border-indigo-400 group-hover:scale-110" />

      {/* Pulsing effect for attention */}
      <div className={`absolute inset-0 rounded-2xl ring-2 ring-indigo-400/20 transition-all duration-1000 ${
        isPulsing ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
      }`} />
    </div>
  );
}

export default Qrpreview_Placeholder;
