// Game Data - Jalur Takdir

export const RACES = {
  human: {
    id: 'human',
    name: 'Human',
    description: 'Serba bisa dan ambisius',
    icon: 'fa-user',
    bonus: { stat: 'all', value: 1 },
    hp: 10,
    mp: 5
  },
  elf: {
    id: 'elf',
    name: 'Elf',
    description: 'Ahli sihir alam yang anggun',
    icon: 'fa-feather-pointed',
    bonus: { stat: 'INT', value: 2 },
    hp: 8,
    mp: 10
  },
  dwarf: {
    id: 'dwarf',
    name: 'Dwarf',
    description: 'Prajurit tangguh dari pegunungan',
    icon: 'fa-helmet-safety',
    bonus: { stat: 'STR', value: 2 },
    hp: 12,
    mp: 3
  },
  halfling: {
    id: 'halfling',
    name: 'Halfling',
    description: 'Lincah dan beruntung',
    icon: 'fa-shoe-prints',
    bonus: { stat: 'DEX', value: 2 },
    hp: 9,
    mp: 6
  }
};

export const CLASSES = {
  warrior: {
    id: 'warrior',
    name: 'Warrior',
    description: 'Pejuang近战 yang kuat',
    icon: 'fa-khanda',
    baseStats: { STR: 4, DEX: 2, INT: 1, WIS: 2 },
    startingItems: ['Iron Sword', 'Leather Armor', 'Health Potion'],
    ability: 'Battle Cry: +2 STR untuk 3 turn'
  },
  rogue: {
    id: 'rogue',
    name: 'Rogue',
    description: 'Master stealth dan kecepatan',
    icon: 'fa-mask',
    baseStats: { STR: 2, DEX: 4, INT: 2, WIS: 1 },
    startingItems: ['Dagger', 'Shadow Cloak', 'Lockpick'],
    ability: 'Backstab: Double damage jika DEX > musuh'
  },
  mage: {
    id: 'mage',
    name: 'Mage',
    description: 'Penyihir arcane yang powerful',
    icon: 'fa-hat-wizard',
    baseStats: { STR: 1, DEX: 2, INT: 4, WIS: 2 },
    startingItems: ['Wooden Staff', 'Spell Book', 'Mana Potion'],
    ability: 'Fireball: Deal 3 damage ke semua musuh di tile'
  },
  cleric: {
    id: 'cleric',
    name: 'Cleric',
    description: 'Healer suci yang bijaksana',
    icon: 'fa-cross',
    baseStats: { STR: 2, DEX: 1, INT: 2, WIS: 4 },
    startingItems: ['Mace', 'Holy Symbol', 'Healing Scroll'],
    ability: 'Divine Heal: Restore 5 HP'
  }
};

export const REGIONS = [
  { id: 1, name: 'Enchanted Forest', startTile: 0, endTile: 23, color: '#2d5016', icon: 'fa-tree' },
  { id: 2, name: 'Dragon Mountains', startTile: 24, endTile: 47, color: '#4a4a4a', icon: 'fa-mountain' },
  { id: 3, name: 'Crystal City', startTile: 48, endTile: 71, color: '#1e3a5f', icon: 'fa-city' },
  { id: 4, name: 'Shadow Dungeon', startTile: 72, endTile: 95, color: '#2d1b4e', icon: 'fa-dungeon' },
  { id: 5, name: 'Desolate Wasteland', startTile: 96, endTile: 119, color: '#5c4033', icon: 'fa-skull' }
];

export const TILE_TYPES = {
  NORMAL: { id: 'normal', name: 'Normal', icon: 'fa-road', chance: 0.4 },
  EVENT: { id: 'event', name: 'Event', icon: 'fa-scroll', chance: 0.2 },
  MERCHANT: { id: 'merchant', name: 'Merchant', icon: 'fa-store', chance: 0.1 },
  PORTAL: { id: 'portal', name: 'Portal Takdir', icon: 'fa-circle-nodes', chance: 0.08 },
  TREASURE: { id: 'treasure', name: 'Treasure', icon: 'fa-chest', chance: 0.1 },
  ENEMY: { id: 'enemy', name: 'Enemy', icon: 'fa-dragon', chance: 0.08 },
  SHRINE: { id: 'shrine', name: 'Shrine', icon: 'fa-hands-praying', chance: 0.04 },
  BOSS: { id: 'boss', name: 'Boss', icon: 'fa-crown', chance: 0.02 },
  FINISH: { id: 'finish', name: 'Finish', icon: 'fa-flag-checkered', chance: 0 }
};

export const EVENTS = [
  {
    id: 'mysterious_stranger',
    title: 'Orang Asing Misterius',
    description: 'Seorang asing berjubah menawarkan bantuan...',
    choices: [
      { text: 'Terima bantuannya', effect: { type: 'heal', value: 5 }, dc: null },
      { text: 'Tolak dengan sopan', effect: { type: 'gold', value: 10 }, dc: null },
      { text: 'Serang!', effect: { type: 'combat', enemy: 'bandit' }, dc: { stat: 'STR', value: 12 } }
    ]
  },
  {
    id: 'trapped_chest',
    title: 'Peti Terperangkap',
    description: 'Kamu menemukan peti harta karun yang terlihat mencurigakan...',
    choices: [
      { text: 'Buka dengan hati-hati', effect: { type: 'treasure', value: 20 }, dc: { stat: 'DEX', value: 14 } },
      { text: 'Gunakan lockpick', effect: { type: 'treasure', value: 30 }, dc: { stat: 'DEX', value: 10 } },
      { text: 'Abaikan', effect: { type: 'vp', value: 1 }, dc: null }
    ]
  },
  {
    id: 'ancient_library',
    title: 'Perpustakaan Kuno',
    description: 'Perpustakaan penuh dengan pengetahuan terlarang...',
    choices: [
      { text: 'Pelajari sihir kuno', effect: { type: 'mp', value: 10 }, dc: { stat: 'INT', value: 13 } },
      { text: 'Cari informasi rahasia', effect: { type: 'vp', value: 2 }, dc: { stat: 'WIS', value: 12 } },
      { text: 'Ambil buku berharga', effect: { type: 'gold', value: 25 }, dc: null }
    ]
  },
  {
    id: 'cursed_spring',
    title: 'Mata Air Terkutuk',
    description: 'Air dari mata air ini bersinar dengan cahaya aneh...',
    choices: [
      { text: 'Minum airnya', effect: { type: 'random_stat', value: 2 }, dc: { stat: 'WIS', value: 15 } },
      { text: 'Isi botol air', effect: { type: 'item', item: 'Holy Water' }, dc: null },
      { text: 'Lanjutkan perjalanan', effect: { type: 'none' }, dc: null }
    ]
  },
  {
    id: 'merchant_caravan',
    title: 'Kafilah Pedagang',
    description: 'Sebuah kafilah pedagang sedang beristirahat...',
    choices: [
      { text: 'Beli perlengkapan (+2 HP)', effect: { type: 'heal', value: 2, cost: 15 }, dc: null },
      { text: 'Jual barang curian', effect: { type: 'gold', value: 20 }, dc: { stat: 'DEX', value: 11 } },
      { text: 'Tawarkan jasa perlindungan', effect: { type: 'gold', value: 30 }, dc: { stat: 'STR', value: 13 } }
    ]
  }
];

export const ITEMS = {
  'Iron Sword': { name: 'Iron Sword', type: 'weapon', bonus: { STR: 1 }, value: 10 },
  'Leather Armor': { name: 'Leather Armor', type: 'armor', bonus: { hp: 2 }, value: 15 },
  'Health Potion': { name: 'Health Potion', type: 'consumable', effect: 'heal', value: 5, price: 10 },
  'Dagger': { name: 'Dagger', type: 'weapon', bonus: { DEX: 1 }, value: 8 },
  'Shadow Cloak': { name: 'Shadow Cloak', type: 'armor', bonus: { DEX: 1 }, value: 20 },
  'Lockpick': { name: 'Lockpick', type: 'tool', bonus: { DEX: 1 }, value: 5 },
  'Wooden Staff': { name: 'Wooden Staff', type: 'weapon', bonus: { INT: 1 }, value: 12 },
  'Spell Book': { name: 'Spell Book', type: 'tool', bonus: { INT: 1, mp: 5 }, value: 25 },
  'Mana Potion': { name: 'Mana Potion', type: 'consumable', effect: 'mana', value: 5, price: 10 },
  'Mace': { name: 'Mace', type: 'weapon', bonus: { STR: 1, WIS: 1 }, value: 15 },
  'Holy Symbol': { name: 'Holy Symbol', type: 'tool', bonus: { WIS: 1 }, value: 18 },
  'Healing Scroll': { name: 'Healing Scroll', type: 'consumable', effect: 'heal', value: 8, price: 15 },
  'Holy Water': { name: 'Holy Water', type: 'consumable', effect: 'bless', value: 3, price: 20 }
};

export const ENEMIES = [
  { name: 'Goblin', hp: 8, damage: 2, vp: 3, region: 1 },
  { name: 'Wolf', hp: 10, damage: 3, vp: 4, region: 1 },
  { name: 'Orc', hp: 15, damage: 4, vp: 5, region: 2 },
  { name: 'Stone Golem', hp: 20, damage: 5, vp: 7, region: 2 },
  { name: 'Thief', hp: 12, damage: 4, vp: 4, region: 3 },
  { name: 'Guard', hp: 18, damage: 5, vp: 6, region: 3 },
  { name: 'Skeleton', hp: 14, damage: 4, vp: 5, region: 4 },
  { name: 'Dark Mage', hp: 16, damage: 6, vp: 8, region: 4 },
  { name: 'Demon', hp: 25, damage: 7, vp: 10, region: 5 },
  { name: 'Dragon', hp: 40, damage: 10, vp: 20, region: 5, isBoss: true }
];

export const PORTALS = [
  { from: 15, to: 45 },
  { from: 35, to: 65 },
  { from: 55, to: 85 },
  { from: 75, to: 105 },
  { from: 25, to: 5 },
  { from: 50, to: 30 },
  { from: 80, to: 60 },
  { from: 100, to: 70 }
];

export const generateBoard = () => {
  const board = [];
  for (let i = 0; i < 120; i++) {
    const region = REGIONS.find(r => i >= r.startTile && i <= r.endTile);
    let type = TILE_TYPES.NORMAL;
    
    if (i === 119) {
      type = TILE_TYPES.FINISH;
    } else {
      const rand = Math.random();
      let cumulative = 0;
      
      for (const tileType of Object.values(TILE_TYPES)) {
        if (tileType.id === 'finish') continue;
        cumulative += tileType.chance;
        if (rand < cumulative) {
          type = tileType;
          break;
        }
      }
    }
    
    // Add special tiles
    if (i % 20 === 0 && i !== 0) type = TILE_TYPES.SHRINE;
    if (i % 30 === 0 && i !== 0) type = TILE_TYPES.BOSS;
    
    const portal = PORTALS.find(p => p.from === i);
    
    board.push({
      position: i,
      type: type,
      region: region,
      visited: false,
      portal: portal || null
    });
  }
  return board;
};

export default {
  RACES,
  CLASSES,
  REGIONS,
  TILE_TYPES,
  EVENTS,
  ITEMS,
  ENEMIES,
  PORTALS,
  generateBoard
};
