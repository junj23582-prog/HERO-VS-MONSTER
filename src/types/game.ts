export type ElementType = 'lightning' | 'fire' | 'tech' | 'magma' | 'cyber' | 'toxic' | 'shadow';

export interface HeroSkill {
  id: string;
  name: string;
  nameId: string; // Indonesian title
  description: string;
  damageMultiplier: number;
  cooldownMs: number;
  spGain: number;
  spCost?: number;
  type: 'light' | 'heavy' | 'special' | 'ultimate';
  icon: string;
  comicWord: string;
  animationClass: string;
}

export interface Hero {
  id: string;
  name: string;
  title: string;
  element: ElementType;
  image: string;
  maxHp: number;
  baseAtk: number;
  baseDef: number;
  speed: number;
  skills: HeroSkill[];
  description: string;
  battleCry: string;
  colorTheme: {
    badge: string;
    glow: string;
    border: string;
    gradient: string;
  };
}

export interface MonsterAttack {
  id: string;
  name: string;
  damage: number;
  cooldownMs: number;
  telegraphTimeMs: number; // Warning time for player to block!
  telegraphMsg: string;
  comicWord: string;
}

export interface Monster {
  id: string;
  name: string;
  title: string;
  element: ElementType;
  image: string;
  stageNumber: number;
  maxHp: number;
  baseAtk: number;
  baseDef: number;
  attacks: MonsterAttack[];
  description: string;
  weakness: string;
  roarType: 'growl' | 'boss';
  colorTheme: {
    badge: string;
    glow: string;
    border: string;
    gradient: string;
  };
}

export interface BattleFloatingText {
  id: string;
  text: string;
  type: 'damage' | 'playerDamage' | 'block' | 'critical' | 'comic' | 'combo';
  x: number;
  y: number;
}

export interface Trophy {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export type GameMode = 'STORY' | 'QUICK_BATTLE' | 'BESTIARY' | 'TROPHIES';
export type BattleState = 'READY' | 'FIGHTING' | 'VICTORY' | 'DEFEAT';
