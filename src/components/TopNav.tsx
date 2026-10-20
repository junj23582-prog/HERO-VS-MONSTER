import React from 'react';
import { Volume2, VolumeX, Music, ShieldAlert } from 'lucide-react';
import { GameMode } from '../types/game';
import { soundEngine } from '../utils/audio';

interface TopNavProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  sfxOn: boolean;
  onToggleSfx: () => void;
  bgmOn: boolean;
  onToggleBgm: () => void;
  inBattle: boolean;
  onQuitBattle?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentMode,
  onSelectMode,
  sfxOn,
  onToggleSfx,
  bgmOn,
  onToggleBgm,
  inBattle,
  onQuitBattle
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="font-display font-black text-xl sm:text-2xl tracking-wider text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
            HERO VS MONSTER
          </span>
          <span className="hidden sm:inline-block text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
            ARENA
          </span>
        </div>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav className="flex items-center gap-1 sm:gap-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => onSelectMode('STORY')}
            className={`px-2.5 py-1.5 transition-colors whitespace-nowrap shrink-0 rounded ${
              currentMode === 'STORY'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Petualangan
          </button>
          <button
            onClick={() => onSelectMode('QUICK_BATTLE')}
            className={`px-2.5 py-1.5 transition-colors whitespace-nowrap shrink-0 rounded ${
              currentMode === 'QUICK_BATTLE'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Duel Cepat
          </button>
          <button
            onClick={() => onSelectMode('BESTIARY')}
            className={`px-2.5 py-1.5 transition-colors whitespace-nowrap shrink-0 rounded ${
              currentMode === 'BESTIARY'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Koleksi Monster
          </button>
          <button
            onClick={() => onSelectMode('TROPHIES')}
            className={`px-2.5 py-1.5 transition-colors whitespace-nowrap shrink-0 rounded ${
              currentMode === 'TROPHIES'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Piala
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-2 shrink-0">
          {inBattle && onQuitBattle && (
            <button
              onClick={onQuitBattle}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-300 bg-red-950/60 border border-red-800/80 rounded-lg hover:bg-red-900/80 transition-colors whitespace-nowrap shrink-0"
              title="Keluar dari pertarungan"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Keluar Arena</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleBgm();
            }}
            className={`p-2 rounded-lg border transition-colors ${
              bgmOn
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title={bgmOn ? 'Musik Aktif (Klik untuk Matikan)' : 'Musik Mati (Klik untuk Nyalakan)'}
            aria-label="Toggle Musik"
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleSfx();
            }}
            className={`p-2 rounded-lg border transition-colors ${
              sfxOn
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title={sfxOn ? 'Suara SFX Aktif' : 'Suara SFX Mati'}
            aria-label="Toggle Suara SFX"
          >
            {sfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
