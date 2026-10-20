import React from 'react';
import { Hero, Monster } from '../types/game';
import { MONSTERS, HEROES } from '../data/gameData';
import { Swords, Shield, Zap, Sparkles, CheckCircle2, Lock } from 'lucide-react';

interface StoryModeSelectProps {
  selectedHero: Hero;
  onSelectHero: (hero: Hero) => void;
  unlockedStage: number;
  stageStars: Record<number, number>;
  onStartBattle: (monster: Monster) => void;
}

export const StoryModeSelect: React.FC<StoryModeSelectProps> = ({
  selectedHero,
  onSelectHero,
  unlockedStage,
  stageStars,
  onStartBattle,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MISI PENYELAMATAN BUMI</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide">
          PETUALANGAN SUPER HERO
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Pilih jagoan super heromu, taklukkan monster-monster pengacau kota, dan kumpulkan bintang kemenangan!
        </p>
      </div>

      {/* 1. HERO SELECTION SECTION */}
      <div className="mb-10">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span>01. Pilih Pahlawanmu</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HEROES.map(hero => {
            const isSelected = hero.id === selectedHero.id;
            return (
              <div
                key={hero.id}
                onClick={() => onSelectHero(hero)}
                className={`cursor-pointer rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center transition-all ${
                  isSelected
                    ? `bg-slate-900/90 ${hero.colorTheme.border} ring-2 ring-amber-400/60 shadow-xl scale-[1.01]`
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 border-2 border-slate-700 relative">
                  <img
                    src={hero.image}
                    alt={hero.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 bg-amber-400 text-slate-950 p-1 rounded-full shadow">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="font-display font-black text-lg text-white">
                      {hero.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${hero.colorTheme.badge}`}>
                      {hero.element.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-amber-300 font-semibold mb-2">
                    {hero.title}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {hero.description}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-mono">
                    <span className="text-emerald-400">HP: {hero.maxHp}</span>
                    <span className="text-red-400">ATK: {hero.baseAtk}</span>
                    <span className="text-yellow-400">SPD: {hero.speed}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. STAGE PROGRESSION MAP */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>02. Peta Misi & Monster</span>
          </h2>
          <span className="text-xs font-mono font-bold text-amber-400">
            Total Bintang: {Object.values(stageStars).reduce((a, b) => a + b, 0)} / {MONSTERS.length * 3} ⭐
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MONSTERS.map(monster => {
            const isUnlocked = monster.stageNumber <= unlockedStage;
            const stars = stageStars[monster.stageNumber] || 0;

            return (
              <div
                key={monster.id}
                className={`relative rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-slate-900 border-slate-800 shadow-xl hover:border-slate-700'
                    : 'bg-slate-950/60 border-slate-800/50 opacity-60'
                }`}
              >
                {/* Stage Header Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={monster.image}
                    alt={monster.name}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isUnlocked ? 'hover:scale-105' : 'grayscale'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                  {/* Stage Number Badge */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold text-white">
                    STAGE {monster.stageNumber}
                  </div>

                  {/* Stars counter */}
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-700 px-2 py-0.5 rounded-lg text-xs">
                    {isUnlocked ? (
                      <span className="text-amber-400 font-bold">
                        {'★'.repeat(stars) + '☆'.repeat(3 - stars)}
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1 font-sans">
                        <Lock className="w-3 h-3" /> Terkunci
                      </span>
                    )}
                  </div>
                </div>

                {/* Body info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-black text-lg text-white">
                        {monster.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${monster.colorTheme.badge}`}>
                        {monster.element.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-red-300 font-semibold mb-2">
                      {monster.title}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                      {monster.description}
                    </p>
                  </div>

                  {/* Monster Stats Strip */}
                  <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800 text-xs font-mono flex justify-around mb-4">
                    <span className="text-red-400">HP: {monster.maxHp}</span>
                    <span className="text-amber-400">ATK: {monster.baseAtk}</span>
                    <span className="text-blue-400">DEF: {monster.baseDef}</span>
                  </div>

                  {/* Action Button */}
                  {isUnlocked ? (
                    <button
                      onClick={() => onStartBattle(monster)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 active:scale-95 text-slate-950 font-display font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Swords className="w-4 h-4" />
                      <span>SERANG MONSTER!</span>
                    </button>
                  ) : (
                    <div className="w-full py-2.5 px-4 bg-slate-800 text-slate-500 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Selesaikan Stage Sebelumnya</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
