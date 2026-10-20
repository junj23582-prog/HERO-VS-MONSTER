import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Hero, Monster, BattleFloatingText, HeroSkill } from '../types/game';
import { soundEngine } from '../utils/audio';
import { ARENA_BACKGROUND } from '../data/gameData';
import { UltimateCutscene } from './UltimateCutscene';
import { Shield, Zap, Sparkles, RefreshCw, ArrowRight, Swords, AlertTriangle } from 'lucide-react';

interface BattleArenaProps {
  hero: Hero;
  monster: Monster;
  onVictory: (stars: number, maxCombo: number, usedUltimate: boolean) => void;
  onDefeat: () => void;
  onNextStage?: () => void;
  isStoryMode: boolean;
  hasNextStage: boolean;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  hero,
  monster,
  onVictory,
  onDefeat,
  onNextStage,
  isStoryMode,
  hasNextStage
}) => {
  // Combat stats
  const [heroHp, setHeroHp] = useState<number>(hero.maxHp);
  const [monsterHp, setMonsterHp] = useState<number>(monster.maxHp);
  const [heroSp, setHeroSp] = useState<number>(30); // Start with 30% SP
  const [isBlocking, setIsBlocking] = useState<boolean>(false);
  const [battleState, setBattleState] = useState<'FIGHTING' | 'VICTORY' | 'DEFEAT'>('FIGHTING');
  
  // Animation states
  const [heroAction, setHeroAction] = useState<string>('animate-idle');
  const [monsterAction, setMonsterAction] = useState<string>('animate-monster');
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [showUltimateCutscene, setShowUltimateCutscene] = useState<boolean>(false);
  const [usedUltimateInBattle, setUsedUltimateInBattle] = useState<boolean>(false);

  // Telegraph warning for incoming monster attack
  const [telegraphNotice, setTelegraphNotice] = useState<{
    active: boolean;
    text: string;
    timeLeftMs: number;
    totalMs: number;
  }>({ active: false, text: '', timeLeftMs: 0, totalMs: 0 });

  // Floating text popups
  const [floatingTexts, setFloatingTexts] = useState<BattleFloatingText[]>([]);
  
  // Combo tracker
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const comboTimerRef = useRef<number | null>(null);

  // Skill cooldowns in ms remaining
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const lastSkillPressRef = useRef<Record<string, number>>({});

  // Block counter for shield achievement
  const successfulBlocksRef = useRef<number>(0);

  // Spawn floating combat text
  const addFloatingText = useCallback((text: string, type: BattleFloatingText['type'], x: number, y: number) => {
    const id = `${Date.now()}-${Math.random()}`;
    setFloatingTexts(prev => [...prev, { id, text, type, x, y }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 1100);
  }, []);

  // Trigger screen shake
  const triggerShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 320);
  }, []);

  // Update combo
  const registerHit = useCallback(() => {
    setCombo(prev => {
      const next = prev + 1;
      setMaxCombo(currMax => Math.max(currMax, next));
      return next;
    });

    if (comboTimerRef.current) {
      clearTimeout(comboTimerRef.current);
    }
    comboTimerRef.current = window.setTimeout(() => {
      setCombo(0);
    }, 2800);
  }, []);

  // Break combo on being hit
  const breakCombo = useCallback(() => {
    if (comboTimerRef.current) {
      clearTimeout(comboTimerRef.current);
    }
    setCombo(0);
  }, []);

  // Cooldown ticker loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const updated: Record<string, number> = {};
        let hasActive = false;
        for (const [key, val] of Object.entries(prev)) {
          if (val > 50) {
            updated[key] = val - 100;
            hasActive = true;
          }
        }
        return hasActive ? updated : {};
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Monster AI Battle Loop
  useEffect(() => {
    if (battleState !== 'FIGHTING') return;

    let timeoutId: number;

    const scheduleMonsterAttack = () => {
      if (battleState !== 'FIGHTING') return;
      // Random delay between attacks: 2.2s to 3.5s
      const delay = 2200 + Math.random() * 1400;

      timeoutId = window.setTimeout(() => {
        if (battleState !== 'FIGHTING') return;

        // Choose random monster attack
        const attack = monster.attacks[Math.floor(Math.random() * monster.attacks.length)];
        
        // Start telegraph warning
        soundEngine.playMonsterRoar(monster.roarType);
        setTelegraphNotice({
          active: true,
          text: attack.telegraphMsg,
          timeLeftMs: attack.telegraphTimeMs,
          totalMs: attack.telegraphTimeMs
        });

        // Telegraph countdown
        const intervalId = window.setInterval(() => {
          setTelegraphNotice(curr => {
            if (curr.timeLeftMs <= 100) {
              clearInterval(intervalId);
              return { ...curr, active: false, timeLeftMs: 0 };
            }
            return { ...curr, timeLeftMs: curr.timeLeftMs - 100 };
          });
        }, 100);

        // Attack lands after telegraphTimeMs
        const attackTimeout = window.setTimeout(() => {
          if (battleState !== 'FIGHTING') return;

          // Monster lunge animation
          setMonsterAction('animate-monster-attack');
          setTimeout(() => setMonsterAction('animate-monster'), 400);

          // Calculate damage
          let rawDmg = attack.damage + Math.floor(Math.random() * 15) - 7;
          let actualDmg = rawDmg;

          if (isBlocking) {
            // Hero successfully blocked!
            actualDmg = Math.max(5, Math.floor(rawDmg * 0.25));
            soundEngine.playBlock();
            successfulBlocksRef.current += 1;
            addFloatingText(`TERTANGKIS! -${actualDmg}`, 'block', 25, 45);
            setHeroSp(sp => Math.min(100, sp + 8));
          } else {
            // Full hit taken
            soundEngine.playHeavyHit();
            triggerShake();
            breakCombo();
            setHeroAction('animate-hurt');
            setTimeout(() => setHeroAction('animate-idle'), 350);
            addFloatingText(`-${actualDmg}`, 'playerDamage', 25, 45);
            addFloatingText(attack.comicWord, 'comic', 30, 30);
            setHeroSp(sp => Math.min(100, sp + 10));
          }

          setHeroHp(prevHp => {
            const nextHp = Math.max(0, prevHp - actualDmg);
            if (nextHp <= 0) {
              setBattleState('DEFEAT');
              soundEngine.playDefeat();
              onDefeat();
            }
            return nextHp;
          });

          // Schedule next attack if battle continues
          scheduleMonsterAttack();
        }, attack.telegraphTimeMs);

      }, delay);
    };

    scheduleMonsterAttack();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [battleState, monster, isBlocking, addFloatingText, triggerShake, breakCombo, onDefeat]);

  // Execute Hero Skill
  const executeSkill = useCallback((skill: HeroSkill) => {
    if (battleState !== 'FIGHTING') return;

    // Check cooldown
    const remainingCd = cooldowns[skill.id] || 0;
    if (remainingCd > 0) return;

    // Check ultimate SP requirement
    if (skill.type === 'ultimate') {
      if (heroSp < 100) return;
      // Launch ultimate cutscene
      setShowUltimateCutscene(true);
      setUsedUltimateInBattle(true);
      soundEngine.playUltimateCharge();
      return;
    }

    // Set skill cooldown
    setCooldowns(prev => ({ ...prev, [skill.id]: skill.cooldownMs }));
    lastSkillPressRef.current[skill.id] = Date.now();

    // Hero lunge animation
    setHeroAction('animate-hero-attack');
    setTimeout(() => setHeroAction('animate-idle'), 350);

    // Audio SFX
    if (skill.type === 'light') {
      soundEngine.playPunch();
    } else if (skill.type === 'heavy') {
      soundEngine.playHeavyHit();
      triggerShake();
    } else if (skill.type === 'special') {
      if (hero.element === 'lightning') {
        soundEngine.playLightning();
      } else {
        soundEngine.playFireball();
      }
      triggerShake();
    }

    // Calculate Hero Damage
    const isCrit = Math.random() < 0.22;
    let baseDmg = Math.floor(hero.baseAtk * skill.damageMultiplier);
    if (isCrit) baseDmg = Math.floor(baseDmg * 1.5);
    const finalDmg = baseDmg + Math.floor(Math.random() * 10);

    // Monster hurt animation
    setMonsterAction('animate-hurt');
    setTimeout(() => setMonsterAction('animate-monster'), 350);

    // Register combo & SP
    registerHit();
    setHeroSp(prev => Math.min(100, prev + skill.spGain));

    // Floating text
    if (isCrit) {
      addFloatingText(`KRITIKAL! -${finalDmg}`, 'critical', 70, 40);
    } else {
      addFloatingText(`-${finalDmg}`, 'damage', 70, 40);
    }
    addFloatingText(skill.comicWord, 'comic', 65, 30);

    // Update monster HP
    setMonsterHp(prevHp => {
      const nextHp = Math.max(0, prevHp - finalDmg);
      if (nextHp <= 0) {
        setBattleState('VICTORY');
        soundEngine.playVictoryFanfare();
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        // Calculate stars
        const hpPercent = (heroHp / hero.maxHp) * 100;
        let stars = 1;
        if (hpPercent >= 70) stars = 3;
        else if (hpPercent >= 40) stars = 2;

        onVictory(stars, Math.max(maxCombo, combo + 1), usedUltimateInBattle);
      }
      return nextHp;
    });
  }, [battleState, cooldowns, heroSp, hero, heroHp, combo, maxCombo, usedUltimateInBattle, registerHit, addFloatingText, triggerShake, onVictory]);

  // Execute Ultimate after cutscene completes
  const handleUltimateComplete = useCallback(() => {
    setShowUltimateCutscene(false);
    setHeroSp(0);
    triggerShake();

    const ultSkill = hero.skills.find(s => s.type === 'ultimate') || hero.skills[hero.skills.length - 1];
    const ultDamage = Math.floor(hero.baseAtk * ultSkill.damageMultiplier) + 120;

    soundEngine.playHeavyHit();
    setMonsterAction('animate-hurt');

    addFloatingText(`JURUS PAMUNGKAS! -${ultDamage}`, 'critical', 65, 35);
    addFloatingText(ultSkill.comicWord, 'comic', 60, 25);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x: 0.7, y: 0.5 }
    });

    setMonsterHp(prev => {
      const next = Math.max(0, prev - ultDamage);
      if (next <= 0) {
        setBattleState('VICTORY');
        soundEngine.playVictoryFanfare();
        const hpPercent = (heroHp / hero.maxHp) * 100;
        let stars = hpPercent >= 70 ? 3 : hpPercent >= 40 ? 2 : 1;
        onVictory(stars, maxCombo, true);
      }
      return next;
    });
  }, [hero, heroHp, maxCombo, triggerShake, addFloatingText, onVictory]);

  // Handle Shield Block button
  const handleBlockPress = () => {
    if (battleState !== 'FIGHTING') return;
    setIsBlocking(true);
    soundEngine.playClick();
  };

  const handleBlockRelease = () => {
    setIsBlocking(false);
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();

      if (key === 'z' || key === 'j' || key === '1') {
        const lightSkill = hero.skills.find(s => s.type === 'light');
        if (lightSkill) executeSkill(lightSkill);
      } else if (key === 'x' || key === 'k' || key === '2') {
        const heavySkill = hero.skills.find(s => s.type === 'heavy');
        if (heavySkill) executeSkill(heavySkill);
      } else if (key === 'c' || key === 'l' || key === '3') {
        const specSkill = hero.skills.find(s => s.type === 'special');
        if (specSkill) executeSkill(specSkill);
      } else if (key === 'v' || key === 'u' || key === '4') {
        handleBlockPress();
      } else if (key === ' ' || key === 'spacebar') {
        e.preventDefault();
        const ultSkill = hero.skills.find(s => s.type === 'ultimate');
        if (ultSkill && heroSp >= 100) executeSkill(ultSkill);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'v' || key === 'u' || key === '4') {
        handleBlockRelease();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [hero, executeSkill, heroSp]);

  // Health bar color calculator
  const getHpColor = (current: number, max: number) => {
    const pct = (current / max) * 100;
    if (pct > 50) return 'bg-emerald-500';
    if (pct > 25) return 'bg-amber-500';
    return 'bg-red-500 animate-pulse';
  };

  return (
    <div className={`relative w-full min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-hidden bg-slate-950 ${screenShake ? 'animate-shake' : ''}`}>
      {/* Ultimate Cutscene Overlay */}
      {showUltimateCutscene && (
        <UltimateCutscene hero={hero} onFinish={handleUltimateComplete} />
      )}

      {/* Arena Stage Background with Scrim */}
      <div className="absolute inset-0 z-0">
        <img 
          src={ARENA_BACKGROUND} 
          alt="Battle Arena" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-65 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/80" />
        <div className="comic-dots absolute inset-0 opacity-20 pointer-events-none" />
      </div>

      {/* Top HUD: Health Bars & Super Meter */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-3 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 items-center">
          {/* Hero HUD */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm sm:text-base text-amber-400">
                  {hero.name}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  LV.5
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-white tabular-nums">
                {heroHp} / {hero.maxHp} HP
              </span>
            </div>

            {/* Hero HP Bar */}
            <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${getHpColor(heroHp, hero.maxHp)}`}
                style={{ width: `${Math.max(0, (heroHp / hero.maxHp) * 100)}%` }}
              />
            </div>

            {/* Hero SP Power Bar */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-black text-amber-300 flex items-center gap-0.5 shrink-0">
                <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                SP
              </span>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    heroSp >= 100 
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-200 animate-pulse shadow-[0_0_12px_rgba(250,204,21,0.8)]' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                  }`}
                  style={{ width: `${heroSp}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-300 tabular-nums shrink-0">
                {heroSp}%
              </span>
            </div>
          </div>

          {/* Monster HUD */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm sm:text-base text-red-400">
                  {monster.name}
                </span>
                <span className="text-[11px] font-bold text-red-300/80">
                  STAGE {monster.stageNumber}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-white tabular-nums">
                {monsterHp} / {monster.maxHp} HP
              </span>
            </div>

            {/* Monster HP Bar */}
            <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${getHpColor(monsterHp, monster.maxHp)}`}
                style={{ width: `${Math.max(0, (monsterHp / monster.maxHp) * 100)}%` }}
              />
            </div>

            {/* Weakness hint */}
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">Kelemahan: {monster.weakness}</span>
              <span className="text-red-400 font-bold ml-2 shrink-0">{monster.element.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Monster Telegraph Alert Banner */}
        {telegraphNotice.active && (
          <div className="mt-2 bg-red-600/90 border-2 border-yellow-300 rounded-xl px-4 py-2 text-white flex items-center justify-between shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-bounce">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-300 animate-spin" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">
                {telegraphNotice.text}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-yellow-400 text-slate-950 px-2 py-0.5 rounded">
                TEKAN TANGKIS! [V]
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Center Combat Stage: Hero vs Monster */}
      <div className="relative z-10 flex-1 flex items-center justify-center max-w-6xl w-full mx-auto px-4 py-4">
        <div className="w-full flex items-center justify-around gap-4 relative">
          
          {/* Floating Combat Popups */}
          {floatingTexts.map(item => (
            <div
              key={item.id}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              className={`absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all font-display font-black text-lg sm:text-2xl animate-comic ${
                item.type === 'damage'
                  ? 'text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
                  : item.type === 'playerDamage'
                  ? 'text-red-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'
                  : item.type === 'critical'
                  ? 'text-orange-400 text-2xl sm:text-3xl drop-shadow-[0_0_12px_rgba(249,115,22,0.9)]'
                  : item.type === 'block'
                  ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                  : 'text-amber-300 text-2xl sm:text-4xl drop-shadow-[0_4px_8px_rgba(0,0,0,1)]'
              }`}
            >
              {item.text}
            </div>
          ))}

          {/* Combo Counter on screen */}
          {combo >= 2 && (
            <div className="absolute left-6 top-0 z-20 bg-amber-500 text-slate-950 font-display font-black text-base sm:text-xl px-4 py-1.5 rounded-xl border-2 border-yellow-200 shadow-2xl animate-comic">
              🔥 {combo}x COMBO! {combo >= 5 ? 'DAHSYAT!' : ''}
            </div>
          )}

          {/* HERO COMBATANT (Left) */}
          <div className="relative flex flex-col items-center">
            {/* Blocking Shield Barrier effect */}
            {isBlocking && (
              <div className="absolute -inset-4 rounded-full border-4 border-cyan-400 bg-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.8)] z-20 animate-pulse pointer-events-none flex items-center justify-center">
                <span className="text-cyan-200 font-display font-black text-xs tracking-wider bg-slate-900/80 px-2 py-0.5 rounded-full border border-cyan-400">
                  TAMENG AKTIF
                </span>
              </div>
            )}

            {/* Hero Character Card */}
            <div className={`relative w-44 h-44 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-4 ${hero.colorTheme.border} shadow-2xl transition-transform ${heroAction}`}>
              <img 
                src={hero.image} 
                alt={hero.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Element badge */}
              <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-amber-300 border border-slate-700">
                {hero.title}
              </div>
            </div>

            <div className="mt-2 text-center">
              <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-full">
                {hero.name}
              </span>
            </div>
          </div>

          {/* Center VS Clash Icon */}
          <div className="hidden sm:flex flex-col items-center justify-center z-10">
            <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-xl">
              <Swords className="w-6 h-6 animate-pulse" />
            </div>
            <span className="font-display font-black text-xs text-amber-400 mt-1 tracking-wider">
              VS
            </span>
          </div>

          {/* MONSTER COMBATANT (Right) */}
          <div className="relative flex flex-col items-center">
            {/* Monster Character Card */}
            <div className={`relative w-44 h-44 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-4 ${monster.colorTheme.border} shadow-2xl transition-transform ${monsterAction}`}>
              <img 
                src={monster.image} 
                alt={monster.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Monster Title */}
              <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-red-300 border border-slate-700">
                {monster.title}
              </div>
            </div>

            <div className="mt-2 text-center">
              <span className="text-xs font-bold text-red-400 bg-red-950/60 border border-red-800/80 px-3 py-1 rounded-full">
                {monster.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls Deck: Buttons & Keypad */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 pb-4 pt-1">
        
        {/* Keyboard hints banner */}
        <div className="hidden md:flex items-center justify-center gap-6 mb-2 text-[11px] text-slate-400">
          <span>Tekan <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">[Z]</kbd> Serangan Cepat</span>
          <span>·</span>
          <span>Tekan <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">[X]</kbd> Hantaman Berat</span>
          <span>·</span>
          <span>Tekan <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-amber-300 font-mono">[C]</kbd> Jurus Spesial</span>
          <span>·</span>
          <span>Tahan <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-cyan-300 font-mono">[V]</kbd> Tangkis / Tameng</span>
          <span>·</span>
          <span>Tekan <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-yellow-300 font-mono">[SPASI]</kbd> Ultimate</span>
        </div>

        {/* Action Button Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {/* Light Attack Button */}
          {hero.skills.filter(s => s.type === 'light').map(skill => {
            const cd = cooldowns[skill.id] || 0;
            return (
              <button
                key={skill.id}
                onClick={() => executeSkill(skill)}
                disabled={cd > 0 || battleState !== 'FIGHTING'}
                className="relative flex flex-col items-center justify-center py-3 px-2 bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 active:scale-95 text-white rounded-xl border border-blue-400/50 shadow-lg transition-transform disabled:opacity-50 select-none"
              >
                <span className="text-xl mb-0.5">{skill.icon}</span>
                <span className="font-display font-black text-xs sm:text-sm tracking-wide">
                  {skill.name}
                </span>
                <span className="text-[10px] text-blue-200">
                  Cepat (+12 SP) [Z]
                </span>
                {cd > 0 && (
                  <div className="absolute inset-0 bg-slate-950/70 rounded-xl flex items-center justify-center font-mono font-bold text-xs text-blue-300">
                    {(cd / 1000).toFixed(1)}s
                  </div>
                )}
              </button>
            );
          })}

          {/* Heavy Attack Button */}
          {hero.skills.filter(s => s.type === 'heavy').map(skill => {
            const cd = cooldowns[skill.id] || 0;
            return (
              <button
                key={skill.id}
                onClick={() => executeSkill(skill)}
                disabled={cd > 0 || battleState !== 'FIGHTING'}
                className="relative flex flex-col items-center justify-center py-3 px-2 bg-gradient-to-b from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 active:scale-95 text-white rounded-xl border border-amber-400/50 shadow-lg transition-transform disabled:opacity-50 select-none"
              >
                <span className="text-xl mb-0.5">{skill.icon}</span>
                <span className="font-display font-black text-xs sm:text-sm tracking-wide">
                  {skill.name}
                </span>
                <span className="text-[10px] text-amber-200">
                  Dahsyat (+22 SP) [X]
                </span>
                {cd > 0 && (
                  <div className="absolute inset-0 bg-slate-950/70 rounded-xl flex items-center justify-center font-mono font-bold text-xs text-amber-300">
                    {(cd / 1000).toFixed(1)}s
                  </div>
                )}
              </button>
            );
          })}

          {/* Special Skill Button */}
          {hero.skills.filter(s => s.type === 'special').map(skill => {
            const cd = cooldowns[skill.id] || 0;
            return (
              <button
                key={skill.id}
                onClick={() => executeSkill(skill)}
                disabled={cd > 0 || battleState !== 'FIGHTING'}
                className="relative flex flex-col items-center justify-center py-3 px-2 bg-gradient-to-b from-purple-600 to-indigo-800 hover:from-purple-500 hover:to-indigo-700 active:scale-95 text-white rounded-xl border border-purple-400/50 shadow-lg transition-transform disabled:opacity-50 select-none"
              >
                <span className="text-xl mb-0.5">{skill.icon}</span>
                <span className="font-display font-black text-xs sm:text-sm tracking-wide">
                  {skill.name}
                </span>
                <span className="text-[10px] text-purple-200">
                  Spesial (+25 SP) [C]
                </span>
                {cd > 0 && (
                  <div className="absolute inset-0 bg-slate-950/70 rounded-xl flex items-center justify-center font-mono font-bold text-xs text-purple-300">
                    {(cd / 1000).toFixed(1)}s
                  </div>
                )}
              </button>
            );
          })}

          {/* Block / Shield Button */}
          <button
            onMouseDown={handleBlockPress}
            onMouseUp={handleBlockRelease}
            onMouseLeave={handleBlockRelease}
            onTouchStart={handleBlockPress}
            onTouchEnd={handleBlockRelease}
            disabled={battleState !== 'FIGHTING'}
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border shadow-lg transition-all select-none ${
              isBlocking 
                ? 'bg-cyan-500 text-slate-950 border-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.9)] scale-95' 
                : 'bg-gradient-to-b from-slate-700 to-slate-900 text-white border-cyan-500/50 hover:border-cyan-400'
            }`}
          >
            <Shield className="w-5 h-5 mb-0.5 text-cyan-300" />
            <span className="font-display font-black text-xs sm:text-sm tracking-wide">
              {isBlocking ? 'MENAHAN!' : 'Tangkis / Tameng'}
            </span>
            <span className="text-[10px] text-cyan-300">
              Tahan tombol [V]
            </span>
          </button>

          {/* Super Ultimate Finisher Button */}
          {hero.skills.filter(s => s.type === 'ultimate').map(skill => {
            const isReady = heroSp >= 100 && battleState === 'FIGHTING';
            return (
              <button
                key={skill.id}
                onClick={() => executeSkill(skill)}
                disabled={!isReady}
                className={`col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-slate-950 font-display font-black transition-all select-none ${
                  isReady 
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border-white shadow-[0_0_25px_rgba(250,204,21,0.9)] animate-pulse hover:scale-105 active:scale-95' 
                    : 'bg-slate-800 text-slate-500 border-slate-700 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Sparkles className={`w-4 h-4 ${isReady ? 'animate-spin' : ''}`} />
                  <span className="text-xs sm:text-sm tracking-wide">
                    {isReady ? 'JURUS PAMUNGKAS!' : 'SP 100%'}
                  </span>
                </div>
                <span className="text-[10px] font-sans font-bold">
                  {isReady ? 'SIAP! [SPASI]' : `Kumpulkan ${100 - heroSp}% SP`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VICTORY MODAL OVERLAY */}
      {battleState === 'VICTORY' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative animate-comic">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.6)]">
              <span className="text-4xl">🏆</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-amber-400 uppercase tracking-wider">
              KEMENANGAN SUPER HERO!
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Kamu berhasil mengalahkan <span className="text-red-400 font-bold">{monster.name}</span> dan menyelamatkan arena!
            </p>

            {/* Stars rating */}
            <div className="flex justify-center gap-2 my-4">
              <span className="text-3xl animate-bounce">⭐</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.15s' }}>⭐</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.3s' }}>
                {(heroHp / hero.maxHp) >= 0.7 ? '⭐' : '☆'}
              </span>
            </div>

            <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 text-xs text-slate-300 mb-6 flex justify-around">
              <div>
                <span className="block text-slate-500">Sisa HP</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{heroHp}</span>
              </div>
              <div>
                <span className="block text-slate-500">Max Kombo</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{maxCombo}x</span>
              </div>
              <div>
                <span className="block text-slate-500">Jurus Pamungkas</span>
                <span className="font-bold text-purple-400 text-sm">{usedUltimateInBattle ? 'Ya' : 'Tidak'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {isStoryMode && hasNextStage && onNextStage ? (
                <button
                  onClick={onNextStage}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-black text-sm rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  <span>Stage Berikutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}

              <button
                onClick={() => {
                  setBattleState('FIGHTING');
                  setHeroHp(hero.maxHp);
                  setMonsterHp(monster.maxHp);
                  setHeroSp(30);
                  setCombo(0);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-display font-black text-sm rounded-xl border border-slate-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tarung Lagi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEFEAT MODAL OVERLAY */}
      {battleState === 'DEFEAT' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border-2 border-red-500 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative animate-comic">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 mb-4 shadow-[0_0_30px_rgba(239,68,68,0.6)]">
              <span className="text-4xl">💥</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-red-500 uppercase tracking-wider">
              PAHLAWAN TERJATUH!
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Jangan putus asa! Gunakan tameng <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-300">[V]</kbd> saat peringatan monster muncul untuk menahan serangannya.
            </p>

            <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 text-xs text-amber-300 my-4 text-left">
              <span className="font-bold block mb-1">💡 Tips Pahlawan:</span>
              <span>Perhatikan lampu tanda seru monster. Ketika monster bersiap meluncurkan jurus, segera tahan tombol Tangkis agar hanya terkena sedikit luka!</span>
            </div>

            <button
              onClick={() => {
                setBattleState('FIGHTING');
                setHeroHp(hero.maxHp);
                setMonsterHp(monster.maxHp);
                setHeroSp(30);
                setCombo(0);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-display font-black text-sm rounded-xl shadow-lg transition-transform active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Bangkit & Coba Lagi!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
