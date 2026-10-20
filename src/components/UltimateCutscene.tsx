import React, { useEffect } from 'react';
import { Hero } from '../types/game';
import { Zap, Flame, Sparkles } from 'lucide-react';

interface UltimateCutsceneProps {
  hero: Hero;
  onFinish: () => void;
}

export const UltimateCutscene: React.FC<UltimateCutsceneProps> = ({ hero, onFinish }) => {
  const ultimateSkill = hero.skills.find(s => s.type === 'ultimate');

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 overflow-hidden select-none">
      {/* Dynamic speedlines background */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background: 'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.15) 0deg 10deg, transparent 10deg 20deg)'
        }}
      />

      {/* Comic Halftone Overlay */}
      <div className="absolute inset-0 comic-dots opacity-30 pointer-events-none" />

      {/* Color Energy Wave */}
      <div className={`absolute inset-0 bg-gradient-to-r ${hero.colorTheme.gradient} opacity-25 animate-pulse`} />

      <div className="relative z-10 flex flex-col items-center max-w-4xl px-4 text-center">
        {/* Comic Alert Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-400 text-slate-950 font-display font-black text-lg md:text-2xl rounded-full uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.8)] animate-bounce mb-4">
          <Sparkles className="w-6 h-6 animate-spin" />
          <span>JURUS PAMUNGKAS SUPER HERO!</span>
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>

        {/* Hero Portrait in Epic Frame */}
        <div className="relative my-4">
          <div className="w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden border-4 border-amber-300 shadow-[0_0_50px_rgba(245,158,11,0.9)] transform -rotate-2 scale-105">
            <img 
              src={hero.image} 
              alt={hero.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Comic Impact Stars */}
          <div className="absolute -top-6 -left-6 bg-red-600 text-white font-display font-black text-xl px-4 py-1.5 rounded-lg border-2 border-white shadow-lg rotate-[-12deg] animate-comic">
            {hero.element === 'lightning' ? <Zap className="inline w-5 h-5 mr-1" /> : <Flame className="inline w-5 h-5 mr-1" />}
            100% SP!
          </div>

          <div className="absolute -bottom-5 -right-6 bg-yellow-400 text-slate-950 font-display font-black text-2xl px-5 py-2 rounded-xl border-2 border-slate-950 shadow-2xl rotate-[8deg] animate-bounce">
            {ultimateSkill?.comicWord || 'KABOOM!!'}
          </div>
        </div>

        {/* Skill Title Banner */}
        <div className="mt-4 bg-slate-900/90 border-2 border-amber-400/80 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md">
          <h2 className="font-display font-black text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 tracking-wider">
            {ultimateSkill?.name || 'SERANGAN PAMUNGKAS'}
          </h2>
          <p className="text-amber-200 text-sm md:text-base font-semibold mt-1 italic tracking-wide">
            "{hero.battleCry}"
          </p>
        </div>
      </div>
    </div>
  );
};
