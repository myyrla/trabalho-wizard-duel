const express = require('express')
const fetch = require('node-fetch')
const {
  PACK_SIZE,
  DRAFT_PACK_CARDS,
  CPU_DECK_SIZE,
  SPELL_POOL_SIZE,
  TOTAL_API_PAGES,
  HOUSE_POWER,
  SPECIES_MAGIC,
  ANCESTRY_DEFENSE,
  HP_RANDOM_BONUS,
  HP_BASE_BONUS,
  SPELL_DAMAGE,
  POTTER_API_BASE,
} = require('./constants')

const app = express()
app.use(express.static('public'))
app.use(express.json())

// ── FUNÇÕES REUTILIZÁVEIS ──────────────────────────────

function buildCharacterCard(rawCharacter) {
  const attributes = rawCharacter.attributes

  const power   = HOUSE_POWER[attributes.house]     !== undefined ? HOUSE_POWER[attributes.house]     : HOUSE_POWER.default
  const magic   = SPECIES_MAGIC[attributes.species] !== undefined ? SPECIES_MAGIC[attributes.species] : SPECIES_MAGIC.default
  const defense = ANCESTRY_DEFENSE[attributes.ancestry] !== undefined ? ANCESTRY_DEFENSE[attributes.ancestry] : ANCESTRY_DEFENSE.default
  const hp      = defense + Math.floor(Math.random() * HP_RANDOM_BONUS) + HP_BASE_BONUS

  return {
    id:       rawCharacter.id,
    name:     attributes.name,
    house:    attributes.house    || 'Unknown',
    species:  attributes.species  || 'Unknown',
    ancestry: attributes.ancestry || 'Unknown',
    image:    attributes.image,
    power,
    magic,
    defense,
    hp,
    maxHp: hp,
  }
}

function buildSpellCard(rawSpell) {
  const attributes = rawSpell.attributes
  const damage = SPELL_DAMAGE[attributes.category] !== undefined ? SPELL_DAMAGE[attributes.category] : SPELL_DAMAGE.default

  return {
    id:       rawSpell.id,
    name:     attributes.name,
    effect:   attributes.effect   || 'Efeito desconhecido',
    category: attributes.category || 'Spell',
    light:    attributes.light    || 'Unknown',
    damage,
  }
}

function shuffleArray(array) {
  const shuffled = [...array]
  for (var index = shuffled.length - 1; index > 0; index--) {
    var randomIndex = Math.floor(Math.random() * (index + 1))
    var temp = shuffled[index]; shuffled[index] = shuffled[randomIndex]; shuffled[randomIndex] = temp
  }
  return shuffled
}

function filterValidCharacters(rawCharacters) {
  return rawCharacters.filter(function(character) {
    var attributes = character.attributes
    return attributes.name && attributes.name != '' && attributes.image
  })
}

// ── ROTAS ─────────────────────────────────────────────

app.get('/api/pack', async (req, res) => {
  try {
    var randomPage = Math.floor(Math.random() * TOTAL_API_PAGES) + 1
    var response = await fetch(`${POTTER_API_BASE}/characters?page[size]=${PACK_SIZE}&page[number]=${randomPage}`)
    var data = await response.json()

    var validCharacters = filterValidCharacters(data.data)
    var characterCards  = validCharacters.map(buildCharacterCard)
    var shuffledCards   = shuffleArray(characterCards)

    res.json({ cards: shuffledCards.slice(0, DRAFT_PACK_CARDS) })
  } catch(error) {
    console.log(error)
    res.status(500).json({ error: 'erro ao buscar personagens' })
  }
})

app.get('/api/spells', async (req, res) => {
  try {
    var response = await fetch(`${POTTER_API_BASE}/spells?page[size]=${PACK_SIZE}`)
    var data = await response.json()

    var validSpells  = data.data.filter(function(spell) { return spell.attributes.name && spell.attributes.name != '' })
    var spellCards   = validSpells.map(buildSpellCard)
    var shuffledSpells = shuffleArray(spellCards)

    res.json({ spells: shuffledSpells.slice(0, SPELL_POOL_SIZE) })
  } catch(error) {
    console.log(error)
    res.status(500).json({ error: 'erro ao buscar feiticos' })
  }
})

app.post('/api/cpu-deck', async (req, res) => {
  try {
    var randomPage = Math.floor(Math.random() * TOTAL_API_PAGES) + 1
    var response = await fetch(`${POTTER_API_BASE}/characters?page[size]=${PACK_SIZE}&page[number]=${randomPage}`)
    var data = await response.json()

    var validCharacters = filterValidCharacters(data.data)
    var characterCards  = validCharacters.map(buildCharacterCard)
    var shuffledCards   = shuffleArray(characterCards)

    res.json({ deck: shuffledCards.slice(0, CPU_DECK_SIZE) })
  } catch(error) {
    console.log(error)
    res.status(500).json({ error: 'erro ao montar deck cpu' })
  }
})

app.listen(3000, () => {
  console.log('rodando na porta 3000')
})