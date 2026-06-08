// Tamanhos de pack e deck
const PACK_SIZE = 100;
const DRAFT_PACK_CARDS = 4;
const PLAYER_DECK_SIZE = 2;
const CPU_DECK_SIZE = 2;
const PLAYER_SPELL_COUNT = 5;
const SPELL_POOL_SIZE = 20;
const TOTAL_API_PAGES = 8;

// Poder por casa
const HOUSE_POWER = {
  Gryffindor: 90,
  Slytherin: 85,
  Ravenclaw: 80,
  Hufflepuff: 75,
  default: 50,
};

// Magia por espécie
const SPECIES_MAGIC = {
  giant: 95,
  werewolf: 91,
  'half-giant': 88,
  vampire: 87,
  'house elf': 82,
  centaur: 78,
  human: 70,
  ghost: 60,
  default: 50,
};

// Defesa por ancestralidade
const ANCESTRY_DEFENSE = {
  'pure-blood': 90,
  'half-blood': 75,
  'muggle-born': 70,
  muggle: 40,
  squib: 35,
  default: 50,
};

// HP: bônus aleatório e base
const HP_RANDOM_BONUS = 20;
const HP_BASE_BONUS = 80;

// Dano por categoria de feitiço
const SPELL_DAMAGE = {
  Curse: 90,
  Hex: 65,
  Jinx: 55,
  Spell: 50,
  Charm: 45,
  Transfiguration: 40,
  'Counter-spell': 35,
  'Healing spell': -40,
  default: 30,
};

// Timeouts de animação (ms)
const TIMEOUT_CPU_TURN = 800;
const TIMEOUT_ROUND_END = 700;
const TIMEOUT_LOADING_FADE = 400;
const TIMEOUT_SCREEN_TRANSITION = 600;
const TIMEOUT_ANIMATION = 500;
const TIMEOUT_HIT_ANIMATION = 600;

// URL base da PotterDB API
const POTTER_API_BASE = 'https://api.potterdb.com/v1';

module.exports = {
  PACK_SIZE,
  DRAFT_PACK_CARDS,
  PLAYER_DECK_SIZE,
  CPU_DECK_SIZE,
  PLAYER_SPELL_COUNT,
  SPELL_POOL_SIZE,
  TOTAL_API_PAGES,
  HOUSE_POWER,
  SPECIES_MAGIC,
  ANCESTRY_DEFENSE,
  HP_RANDOM_BONUS,
  HP_BASE_BONUS,
  SPELL_DAMAGE,
  TIMEOUT_CPU_TURN,
  TIMEOUT_ROUND_END,
  TIMEOUT_LOADING_FADE,
  TIMEOUT_SCREEN_TRANSITION,
  TIMEOUT_ANIMATION,
  TIMEOUT_HIT_ANIMATION,
  POTTER_API_BASE,
};
