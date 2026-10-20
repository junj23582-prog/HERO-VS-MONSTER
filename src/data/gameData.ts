import { Hero, Monster, Trophy } from '../types/game';

export const HEROES: Hero[] = [
  {
    id: 'hero_volt',
    name: 'Garuda Petir',
    title: 'Pahlawan Kilat Angkasa',
    element: 'lightning',
    image: '/src/assets/images/hero_thunder_kid_1792482057177.jpg',
    maxHp: 1000,
    baseAtk: 95,
    baseDef: 75,
    speed: 90,
    battleCry: 'DENGAN KEKUATAN PETIR, AKU AKAN MELINDUNGI DUNIA!',
    description: 'Pahlawan muda berkekuatan petir murni. Gerakannya secepat kilat dengan pukulan bermuatan listrik bertegangan tinggi!',
    colorTheme: {
      badge: 'bg-amber-400 text-slate-950',
      glow: 'shadow-yellow-400/50',
      border: 'border-yellow-400',
      gradient: 'from-amber-400 via-yellow-300 to-sky-400'
    },
    skills: [
      {
        id: 'volt_punch',
        name: 'Tinju Listrik',
        nameId: 'Pukulan Cepat Petir',
        description: 'Pukulan kilat beruntun menghantam musuh dengan cepat.',
        damageMultiplier: 1.0,
        cooldownMs: 400,
        spGain: 12,
        type: 'light',
        icon: '⚡',
        comicWord: 'BZZT!',
        animationClass: 'animate-hero-attack'
      },
      {
        id: 'volt_kick',
        name: 'Tendangan Halilintar',
        nameId: 'Tendangan Berat',
        description: 'Tendangan berdaya ledak tinggi yang mengguncang pertahanan monster.',
        damageMultiplier: 1.8,
        cooldownMs: 1400,
        spGain: 22,
        type: 'heavy',
        icon: '💥',
        comicWord: 'KAPOW!',
        animationClass: 'animate-hero-attack'
      },
      {
        id: 'volt_storm',
        name: 'Sambaran Guntur',
        nameId: 'Jurus Spesial',
        description: 'Memanggil petir langit dahsyat yang menyengat musuh seketika!',
        damageMultiplier: 2.6,
        cooldownMs: 4500,
        spGain: 25,
        type: 'special',
        icon: '🌩️',
        comicWord: 'ZAPPP!',
        animationClass: 'animate-hero-attack'
      },
      {
        id: 'volt_ultimate',
        name: 'BADAI HALILINTAR MAHA DAHSYAT',
        nameId: 'JURUS PAMUNGKAS',
        description: 'Melepaskan jutaan volt energi petir dalam ledakan super epik!',
        damageMultiplier: 4.8,
        cooldownMs: 1000,
        spGain: 0,
        spCost: 100,
        type: 'ultimate',
        icon: '⚡👑⚡',
        comicWord: 'KABOOM!!',
        animationClass: 'animate-hero-attack'
      }
    ]
  },
  {
    id: 'hero_blaze',
    name: 'Ksatria Api',
    title: 'Pelindung Api Abadi',
    element: 'fire',
    image: '/src/assets/images/hero_blaze_flame_1792482076135.jpg',
    maxHp: 1150,
    baseAtk: 110,
    baseDef: 80,
    speed: 75,
    battleCry: 'APILAH SEMANGATKU! KEBENARAN TAKKAN PERNAH PADAM!',
    description: 'Kesatria berzirah merah membara dengan kobaran api Phoenix yang menghanguskan monster jahat!',
    colorTheme: {
      badge: 'bg-red-500 text-white',
      glow: 'shadow-red-500/50',
      border: 'border-red-500',
      gradient: 'from-red-600 via-orange-500 to-amber-400'
    },
    skills: [
      {
        id: 'blaze_jab',
        name: 'Pukulan Bara',
        nameId: 'Tinju Api Cepat',
        description: 'Pukulan cepat berselimut bara api yang membakar lawan.',
        damageMultiplier: 1.1,
        cooldownMs: 450,
        spGain: 12,
        type: 'light',
        icon: '🔥',
        comicWord: 'WHAM!',
        animationClass: 'animate-hero-attack'
      },
      {
        id: 'blaze_smash',
        name: 'Hantaman Meteor',
        nameId: 'Pukulan Berat',
        description: 'Hantaman dua tangan seberat batu meteor api.',
        damageMultiplier: 1.9,
        cooldownMs: 1500,
        spGain: 22,
        type: 'heavy',
        icon: '☄️',
        comicWord: 'CRASH!',
        animationClass: 'animate-hero-attack'
      },
      {
        id: 'blaze_dragon',
        name: 'Semburan Phoenix Api',
        nameId: 'Jurus Spesial',
        description: 'Menciptakan semburan tornado api yang melalap monster.',
        damageMultiplier: 2.7,
        cooldownMs: 4500,
        spGain: 25,
        type: 'special',
        icon: '🌪️',
        comicWord: 'BURN!!',
        animationClass: 'animate-hero-attack'
      },
      {
        id: 'blaze_ultimate',
        name: 'SUPERNOVA PHOENIX PENGHANCUR',
        nameId: 'JURUS PAMUNGKAS',
        description: 'Membakar seluruh arena dalam ledakan api supernova kosmik!',
        damageMultiplier: 5.0,
        cooldownMs: 1000,
        spGain: 0,
        spCost: 100,
        type: 'ultimate',
        icon: '🔥👑🔥',
        comicWord: 'SUPERNOVA!!',
        animationClass: 'animate-hero-attack'
      }
    ]
  }
];

export const MONSTERS: Monster[] = [
  {
    id: 'monster_magma',
    name: 'Golem Lahar Purba',
    title: 'Raksasa Batu Magma Api',
    element: 'magma',
    stageNumber: 1,
    image: '/src/assets/images/monster_magma_golem_1792482058355.jpg',
    maxHp: 950,
    baseAtk: 65,
    baseDef: 50,
    weakness: 'Serangan Petir dan Serangan Cepat bertubi-tubi',
    roarType: 'growl',
    description: 'Monster batu lahar raksasa yang bangkit dari kawah gunung berapi. Tubuhnya terbuat dari batu hitam berurat lava panas membara!',
    colorTheme: {
      badge: 'bg-orange-600 text-white',
      glow: 'shadow-orange-500/50',
      border: 'border-orange-500',
      gradient: 'from-orange-600 to-amber-500'
    },
    attacks: [
      {
        id: 'magma_punch',
        name: 'Hantaman Tinju Batu',
        damage: 60,
        cooldownMs: 2500,
        telegraphTimeMs: 700,
        telegraphMsg: 'Golem mengangkat tinju batu raksasanya!',
        comicWord: 'BOOM!'
      },
      {
        id: 'lava_eruption',
        name: 'Letusan Lahar Panas',
        damage: 110,
        cooldownMs: 5500,
        telegraphTimeMs: 1100,
        telegraphMsg: 'PERINGATAN: Kawah dada Golem bersiap meledak!',
        comicWord: 'KRAKATOA!'
      }
    ]
  },
  {
    id: 'monster_slime',
    name: 'Ratu Lumpur Beracun',
    title: 'Monster Lendir Hutan Misteri',
    element: 'toxic',
    stageNumber: 2,
    image: '/src/assets/images/monster_toxic_slime_1792482076039.jpg',
    maxHp: 1200,
    baseAtk: 78,
    baseDef: 60,
    weakness: 'Elemen Api dan Serangan Meteor',
    roarType: 'growl',
    description: 'Gumpalan lendir beracun berwajah nakal dengan banyak mata bercahaya dan tentakel lengket yang suka melilit!',
    colorTheme: {
      badge: 'bg-emerald-500 text-slate-950',
      glow: 'shadow-emerald-500/50',
      border: 'border-emerald-500',
      gradient: 'from-emerald-500 to-lime-400'
    },
    attacks: [
      {
        id: 'slime_whip',
        name: 'Cambukan Tentakel Lendir',
        damage: 75,
        cooldownMs: 2300,
        telegraphTimeMs: 650,
        telegraphMsg: 'Tentakel berlendir meliuk siap menyabet!',
        comicWord: 'SPLAT!'
      },
      {
        id: 'acid_spray',
        name: 'Semprotan Asam Beracun',
        damage: 135,
        cooldownMs: 5000,
        telegraphTimeMs: 1050,
        telegraphMsg: 'PERINGATAN: Semburan cairan racun hijau datang!',
        comicWord: 'GLOOP!!'
      }
    ]
  },
  {
    id: 'monster_kaiju',
    name: 'Cyber Kaiju Mecha-Rex',
    title: 'Raja Dinosaurus Robot Kota',
    element: 'cyber',
    stageNumber: 3,
    image: '/src/assets/images/monster_cyber_kaiju_1792482058697.jpg',
    maxHp: 1600,
    baseAtk: 95,
    baseDef: 85,
    weakness: 'Jurus Pamungkas dan Tangkisan Tepat Waktu',
    roarType: 'boss',
    description: 'Dinosaurus cyber raksasa dengan pelindung baja titanium dan duri laser neon. Monster terkuat yang menyerang kota masa depan!',
    colorTheme: {
      badge: 'bg-indigo-600 text-white',
      glow: 'shadow-cyan-500/50',
      border: 'border-cyan-400',
      gradient: 'from-blue-600 via-indigo-600 to-purple-600'
    },
    attacks: [
      {
        id: 'kaiju_claw',
        name: 'Cakaran Baja Cyber',
        damage: 90,
        cooldownMs: 2100,
        telegraphTimeMs: 650,
        telegraphMsg: 'Cakar tajam Kaiju bersiap mencabik!',
        comicWord: 'SLASH!'
      },
      {
        id: 'atomic_laser',
        name: 'Meriam Laser Atom Neon',
        damage: 165,
        cooldownMs: 4800,
        telegraphTimeMs: 1200,
        telegraphMsg: 'BAHAYA TINGGI: Mulut Mecha-Rex memancarkan laser energi!',
        comicWord: 'PEW-BOOM!'
      }
    ]
  }
];

export const INITIAL_TROPHIES: Trophy[] = [
  {
    id: 'first_blood',
    title: 'Pahlawan Pemula',
    description: 'Kalahkan monster pertama dan selamatkan kota.',
    icon: '🎖️',
    unlocked: false
  },
  {
    id: 'combo_master',
    title: 'Raja Kombo',
    description: 'Capai kombo 6x berturut-turut tanpa terkena serangan.',
    icon: '⚡',
    unlocked: false
  },
  {
    id: 'shield_pro',
    title: 'Dinding Baja',
    description: 'Berhasil menangkis serangan musuh dengan tepat waktu 3 kali.',
    icon: '🛡️',
    unlocked: false
  },
  {
    id: 'ultimate_finisher',
    title: 'Kekuatan Tak Terbatas',
    description: 'Kalahkan monster dengan Jurus Pamungkas (Ultimate).',
    icon: '👑',
    unlocked: false
  },
  {
    id: 'monster_champion',
    title: 'Juara Penakluk Monster',
    description: 'Selesaikan semua 3 stage petualangan monster.',
    icon: '🏆',
    unlocked: false
  }
];

export const ARENA_BACKGROUND = '/src/assets/images/arena_city_battle_1792482059164.jpg';
