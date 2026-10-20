import React, { useState } from 'react';
import { Hero, Monster } from '../types/game';
import { HEROES, MONSTERS } from '../data/gameData';
import { Swords, Flame, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface QuickBattleSelectProps {
  onStartBattle: (hero: Hero, monster: Monster, difficulty: 'NORMAL' | 'HARD') => void;
}

export const QuickBattleSelect: React.FC<QuickBattleSelectProps> = ({ onStartBattle }) => {
  const [selectedHero, setSelectedHero] = useState<Hero>(HEROES[0]);
  const [selectedMonster, setSelectedMonster] = useState<Monster>(MONSTERS[0]);
  const [difficulty, setDifficulty] = useState<'NORMAL' | 'HARD'>('NORMAL');

  const handleStart = () => {
    soundEngine.playClick();
    onStartBattle(selectedHero, selectedMonster, difficulty);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold mb-3">
          <Flame className="w-3.5 h-3.5" />
          <span>DUEL BEBAS</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide">
          PERTARUNGAN CEPAT
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Pilih pahlawan dan monster kesukaanmu untuk langsung bertarung di arena!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
        {/* HERO PICKER */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            01. Pilih Super Hero
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {HEROES.map(hero => {
              const active = hero.id === selectedHero.id;
              return (
                <button
                  key={hero.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedHero(hero);
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    active
                      ? `bg-slate-800 border-amber-400 ring-2 ring-amber-400/50 shadow-lg`
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-700">
                    <img 
                      src={hero.image} 
                      alt={hero.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-display font-bold text-xs sm:text-sm text-white text-center">
                    {hero.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Hero Preview */}
          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-display font-black text-amber-400 text-sm">{selectedHero.name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedHero.colorTheme.badge}`}>
                {selectedHero.element.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-300 italic mb-2">"{selectedHero.battleCry}"</p>
            <div className="flex justify-around font-mono text-[11px] pt-2 border-t border-slate-800">
              <span className="text-emerald-400">HP: {selectedHero.maxHp}</span>
              <span className="text-red-400">ATK: {selectedHero.baseAtk}</span>
              <span className="text-yellow-400">SPD: {selectedHero.speed}</span>
            </div>
          </div>
        </div>

        {/* MONSTER PICKER */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            02. Pilih Musuh Monster
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {MONSTERS.map(monster => {
              const active = monster.id === selectedMonster.id;
              return (
                <button
                  key={monster.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedMonster(monster);
                  }}
                  className={`p-2 sm:p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    active
                      ? `bg-slate-800 border-red-500 ring-2 ring-red-500/50 shadow-lg`
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-slate-700">
                    <img 
                      src={monster.image} 
                      alt={monster.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-display font-bold text-[11px] sm:text-xs text-white text-center line-clamp-1">
                    {monster.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Monster Preview */}
          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-display font-black text-red-400 text-sm">{selectedMonster.name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedMonster.colorTheme.badge}`}>
                {selectedMonster.element.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-400 mb-2">{selectedMonster.description}</p>
            <div className="flex justify-around font-mono text-[11px] pt-2 border-t border-slate-800">
              <span className="text-red-400">HP: {selectedMonster.maxHp}</span>
              <span className="text-amber-400">ATK: {selectedMonster.baseAtk}</span>
              <span className="text-blue-400">DEF: {selectedMonster.baseDef}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Setting */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-8">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Tingkat Kesulitan:
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setDifficulty('NORMAL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              difficulty === 'NORMAL'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Normal (Santai & Seru)
          </button>
          <button
            onClick={() => setDifficulty('HARD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              difficulty === 'HARD'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Tantangan Ekstrem (Monster Lebih Kuat!)
          </button>
        </div>
      </div>

      {/* Big Start Fight CTA */}
      <div className="flex justify-center">
        <button
          onClick={handleStart}
          className="w-full sm:w-80 py-4 px-6 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 active:scale-95 text-slate-950 font-display font-black text-lg rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-all flex items-center justify-center gap-3"
        >
          <Swords className="w-6 h-6 animate-pulse" />
          <span>MULAI PERTARUNGAN!</span>
        </button>
      </div>
    </div>
  );
};
