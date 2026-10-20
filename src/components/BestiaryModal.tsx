import React, { useState } from 'react';
import { MONSTERS } from '../data/gameData';
import { Monster } from '../types/game';
import { Volume2, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const BestiaryModal: React.FC = () => {
  const [activeMonster, setActiveMonster] = useState<Monster>(MONSTERS[0]);

  const handlePlayRoar = (monster: Monster) => {
    soundEngine.playMonsterRoar(monster.roarType);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ARSIP DATABASE MONSTER</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide">
          ENSIKLOPEDIA MONSTER
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Pelajari kekuatan, kelemahan, dan jurus mematikan dari setiap monster untuk memenangkan pertarungan!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Monster List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Daftar Monster ({MONSTERS.length})
          </h2>
          {MONSTERS.map(m => {
            const isSelected = m.id === activeMonster.id;
            return (
              <div
                key={m.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveMonster(m);
                }}
                className={`cursor-pointer rounded-2xl border p-3 flex items-center gap-4 transition-all ${
                  isSelected
                    ? `bg-slate-900 border-red-500 ring-2 ring-red-500/50 shadow-xl`
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                  <img
                    src={m.image}
                    alt={m.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-display font-bold text-sm text-white truncate">
                      {m.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-red-400 font-semibold block truncate">
                    {m.title}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-mono">
                    <span>HP {m.maxHp}</span>
                    <span aria-hidden="true">·</span>
                    <span>ATK {m.baseAtk}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Detailed Dossier */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Monster Large Frame */}
            <div className="w-full md:w-64 h-64 rounded-2xl overflow-hidden border-2 border-red-500/50 shrink-0 shadow-2xl relative">
              <img
                src={activeMonster.image}
                alt={activeMonster.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-bold text-red-400 border border-slate-700">
                STAGE {activeMonster.stageNumber}
              </div>
            </div>

            {/* Monster Lore & Specs */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-display font-black text-2xl text-white">
                  {activeMonster.name}
                </h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${activeMonster.colorTheme.badge}`}>
                  {activeMonster.element.toUpperCase()}
                </span>
              </div>
              <p className="text-sm font-semibold text-red-400 mb-3">
                {activeMonster.title}
              </p>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {activeMonster.description}
              </p>

              {/* Sound button */}
              <button
                onClick={() => handlePlayRoar(activeMonster)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-950/70 border border-red-700/80 hover:bg-red-900/80 text-red-200 text-xs font-bold rounded-xl transition-colors mb-4"
              >
                <Volume2 className="w-4 h-4 text-red-400 animate-pulse" />
                <span>Dengarkan Raungan Monster!</span>
              </button>

              {/* Stats Box */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/70 rounded-xl p-3 border border-slate-800 font-mono text-center text-xs">
                <div>
                  <span className="block text-slate-500 text-[10px]">TOTAL HP</span>
                  <span className="font-bold text-red-400 text-sm">{activeMonster.maxHp}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-[10px]">KEKUATAN ATK</span>
                  <span className="font-bold text-amber-400 text-sm">{activeMonster.baseAtk}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-[10px]">PERTAHANAN DEF</span>
                  <span className="font-bold text-blue-400 text-sm">{activeMonster.baseDef}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Weakness & Tactical Advice */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 mb-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5">
                  Titik Lemah & Taktik Bertarung
                </h4>
                <p className="text-xs text-slate-300">
                  {activeMonster.weakness}. Selalu waspada ketika monster ini bersiap menyerang, segera tekan tombol <strong className="text-cyan-300">Tangkis [V]</strong> untuk meniadakan luka besar.
                </p>
              </div>
            </div>

            {/* Attack move list */}
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Jurus Serangan Monster Ini
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeMonster.attacks.map(atk => (
                <div key={atk.id} className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{atk.name}</span>
                    <span className="text-red-400 font-mono font-bold">Luka ~{atk.damage}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mb-1">{atk.telegraphMsg}</p>
                  <span className="text-[10px] text-amber-300/80">Waktu Reaksi Tangkis: {(atk.telegraphTimeMs / 1000).toFixed(1)} detik</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
