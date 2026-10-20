import React from 'react';
import { Trophy } from '../types/game';
import { CheckCircle2, Lock, Award, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TrophiesModalProps {
  trophies: Trophy[];
  onResetProgress: () => void;
}

export const TrophiesModal: React.FC<TrophiesModalProps> = ({ trophies, onResetProgress }) => {
  const unlockedCount = trophies.filter(t => t.unlocked).length;
  const progressPct = Math.round((unlockedCount / trophies.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>PRESTASI & GELAR</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide">
          RUANG PIALA SUPER HERO
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Kumpulkan seluruh medali keberanian pahlawan dengan menyelesaikan berbagai misi pertarungan!
        </p>

        {/* Progress bar */}
        <div className="mt-6 max-w-md mx-auto bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-white">Kemajuan Koleksi</span>
            <span className="text-amber-400 font-mono">{unlockedCount} / {trophies.length} Medali ({progressPct}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Trophy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {trophies.map(trophy => (
          <div
            key={trophy.id}
            className={`rounded-2xl border p-5 flex items-center gap-4 transition-all ${
              trophy.unlocked
                ? 'bg-slate-900/90 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : 'bg-slate-950/60 border-slate-800/80 opacity-60'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${
              trophy.unlocked 
                ? 'bg-amber-400/20 border-2 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                : 'bg-slate-800/40 border border-slate-700 text-slate-600'
            }`}>
              {trophy.unlocked ? trophy.icon : <Lock className="w-6 h-6 text-slate-600" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-display font-black text-base text-white truncate">
                  {trophy.title}
                </h3>
                {trophy.unlocked ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-500 shrink-0">
                    Terkunci
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {trophy.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Reset progress button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => {
            soundEngine.playClick();
            if (confirm('Apakah kamu ingin mereset progres piala dan kembali dari awal?')) {
              onResetProgress();
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Progres Piala</span>
        </button>
      </div>
    </div>
  );
};
