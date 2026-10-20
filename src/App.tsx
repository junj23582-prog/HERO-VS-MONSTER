/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Hero, Monster, GameMode, Trophy } from './types/game';
import { HEROES, MONSTERS, INITIAL_TROPHIES } from './data/gameData';
import { TopNav } from './components/TopNav';
import { BattleArena } from './components/BattleArena';
import { StoryModeSelect } from './components/StoryModeSelect';
import { QuickBattleSelect } from './components/QuickBattleSelect';
import { BestiaryModal } from './components/BestiaryModal';
import { TrophiesModal } from './components/TrophiesModal';
import { soundEngine } from './utils/audio';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('STORY');
  const [inBattle, setInBattle] = useState<boolean>(false);
  const [isStoryMode, setIsStoryMode] = useState<boolean>(true);

  // Selected Hero and Monster for current battle
  const [selectedHero, setSelectedHero] = useState<Hero>(HEROES[0]);
  const [selectedMonster, setSelectedMonster] = useState<Monster>(MONSTERS[0]);

  // Audio states
  const [sfxOn, setSfxOn] = useState<boolean>(true);
  const [bgmOn, setBgmOn] = useState<boolean>(false);

  // Persistence: Progression & Trophies
  const [unlockedStage, setUnlockedStage] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('hero_game_unlocked_stage');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [stageStars, setStageStars] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('hero_game_stage_stars');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [trophies, setTrophies] = useState<Trophy[]>(() => {
    try {
      const saved = localStorage.getItem('hero_game_trophies');
      return saved ? JSON.parse(saved) : INITIAL_TROPHIES;
    } catch {
      return INITIAL_TROPHIES;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hero_game_unlocked_stage', unlockedStage.toString());
      localStorage.setItem('hero_game_stage_stars', JSON.stringify(stageStars));
      localStorage.setItem('hero_game_trophies', JSON.stringify(trophies));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [unlockedStage, stageStars, trophies]);

  // Audio handlers
  const handleToggleSfx = () => {
    const next = soundEngine.toggleSfx();
    setSfxOn(next);
  };

  const handleToggleBgm = () => {
    const next = soundEngine.toggleBgm();
    setBgmOn(next);
  };

  // Start Battle in Story Mode
  const handleStartStoryBattle = (monster: Monster) => {
    soundEngine.playClick();
    setSelectedMonster(monster);
    setIsStoryMode(true);
    setInBattle(true);
  };

  // Start Battle in Quick Duel Mode
  const handleStartQuickBattle = (hero: Hero, monster: Monster, difficulty: 'NORMAL' | 'HARD') => {
    soundEngine.playClick();
    setSelectedHero(hero);
    // If HARD, clone monster with 30% more HP & ATK
    if (difficulty === 'HARD') {
      const hardMonster: Monster = {
        ...monster,
        maxHp: Math.floor(monster.maxHp * 1.35),
        baseAtk: Math.floor(monster.baseAtk * 1.25),
        title: `${monster.title} [EKSTREM]`
      };
      setSelectedMonster(hardMonster);
    } else {
      setSelectedMonster(monster);
    }
    setIsStoryMode(false);
    setInBattle(true);
  };

  // Victory Handler
  const handleVictory = (stars: number, maxCombo: number, usedUltimate: boolean) => {
    // 1. Update stars
    setStageStars(prev => ({
      ...prev,
      [selectedMonster.stageNumber]: Math.max(prev[selectedMonster.stageNumber] || 0, stars)
    }));

    // 2. Unlock next stage if in story mode
    if (isStoryMode) {
      if (selectedMonster.stageNumber >= unlockedStage && unlockedStage < MONSTERS.length) {
        setUnlockedStage(selectedMonster.stageNumber + 1);
      }
    }

    // 3. Unlock trophies
    setTrophies(prev =>
      prev.map(t => {
        if (t.id === 'first_blood') return { ...t, unlocked: true };
        if (t.id === 'combo_master' && maxCombo >= 6) return { ...t, unlocked: true };
        if (t.id === 'ultimate_finisher' && usedUltimate) return { ...t, unlocked: true };
        if (t.id === 'monster_champion' && selectedMonster.stageNumber === 3) return { ...t, unlocked: true };
        return t;
      })
    );
  };

  // Defeat Handler
  const handleDefeat = () => {
    // Handled in BattleArena
  };

  // Next Stage Handler
  const handleNextStage = () => {
    const nextStageNum = selectedMonster.stageNumber + 1;
    const nextMonster = MONSTERS.find(m => m.stageNumber === nextStageNum);
    if (nextMonster) {
      setSelectedMonster(nextMonster);
    } else {
      setInBattle(false);
      setCurrentMode('STORY');
    }
  };

  // Quit Battle
  const handleQuitBattle = () => {
    soundEngine.playClick();
    setInBattle(false);
  };

  // Reset progress
  const handleResetProgress = () => {
    setUnlockedStage(1);
    setStageStars({});
    setTrophies(INITIAL_TROPHIES);
    localStorage.removeItem('hero_game_unlocked_stage');
    localStorage.removeItem('hero_game_stage_stars');
    localStorage.removeItem('hero_game_trophies');
  };

  const hasNextStage = isStoryMode && selectedMonster.stageNumber < MONSTERS.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header */}
      <TopNav
        currentMode={currentMode}
        onSelectMode={(mode) => {
          soundEngine.playClick();
          setCurrentMode(mode);
          setInBattle(false);
        }}
        sfxOn={sfxOn}
        onToggleSfx={handleToggleSfx}
        bgmOn={bgmOn}
        onToggleBgm={handleToggleBgm}
        inBattle={inBattle}
        onQuitBattle={handleQuitBattle}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {inBattle ? (
          <BattleArena
            hero={selectedHero}
            monster={selectedMonster}
            onVictory={handleVictory}
            onDefeat={handleDefeat}
            onNextStage={handleNextStage}
            isStoryMode={isStoryMode}
            hasNextStage={hasNextStage}
          />
        ) : (
          <div className="flex-1">
            {currentMode === 'STORY' && (
              <StoryModeSelect
                selectedHero={selectedHero}
                onSelectHero={setSelectedHero}
                unlockedStage={unlockedStage}
                stageStars={stageStars}
                onStartBattle={handleStartStoryBattle}
              />
            )}

            {currentMode === 'QUICK_BATTLE' && (
              <QuickBattleSelect
                onStartBattle={handleStartQuickBattle}
              />
            )}

            {currentMode === 'BESTIARY' && (
              <BestiaryModal />
            )}

            {currentMode === 'TROPHIES' && (
              <TrophiesModal
                trophies={trophies}
                onResetProgress={handleResetProgress}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      {!inBattle && (
        <footer className="border-t border-slate-900 bg-slate-950/80 text-center py-4 px-4 text-xs text-slate-500">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 Super Hero vs Monster Battle Arena · Game Aksi untuk Anak Laki-Laki</span>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Kontrol Keyboard: [Z] Cepat, [X] Berat, [C] Spesial, [V] Tangkis, [SPASI] Ultimate</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
