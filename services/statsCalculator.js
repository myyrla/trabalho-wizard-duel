const {
  HOUSE_POWER,
  SPECIES_MAGIC,
  ANCESTRY_DEFENSE,
  HP_RANDOM_BONUS,
  HP_BASE_BONUS,
  SPELL_DAMAGE,
} = require('../constants');

function buildCharacterCard(rawCharacter) {
  const { id, attributes } = rawCharacter;

  const power = HOUSE_POWER[attributes.house] !== undefined
    ? HOUSE_POWER[attributes.house]
    : HOUSE_POWER.default;

  const magic = SPECIES_MAGIC[attributes.species] !== undefined
    ? SPECIES_MAGIC[attributes.species]
    : SPECIES_MAGIC.default;

  const defense = ANCESTRY_DEFENSE[attributes.ancestry] !== undefined
    ? ANCESTRY_DEFENSE[attributes.ancestry]
    : ANCESTRY_DEFENSE.default;

  const hp = defense + Math.floor(Math.random() * HP_RANDOM_BONUS) + HP_BASE_BONUS;

  return {
    id,
    name: attributes.name,
    house: attributes.house || 'Unknown',
    species: attributes.species || 'Unknown',
    ancestry: attributes.ancestry || 'Unknown',
    image: attributes.image,
    power,
    magic,
    defense,
    hp,
    maxHp: hp,
  };
}

function buildSpellCard(rawSpell) {
  const { id, attributes } = rawSpell;

  const damage = SPELL_DAMAGE[attributes.category] !== undefined
    ? SPELL_DAMAGE[attributes.category]
    : SPELL_DAMAGE.default;

  return {
    id,
    name: attributes.name,
    effect: attributes.effect || 'Efeito desconhecido',
    category: attributes.category || 'Spell',
    light: attributes.light || 'Unknown',
    damage,
  };
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temp = shuffled[index];
    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }
  return shuffled;
}

module.exports = { buildCharacterCard, buildSpellCard, shuffleArray };
