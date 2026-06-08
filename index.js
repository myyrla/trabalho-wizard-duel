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

// pega pack de cartas aleatorias
app.get('/api/pack', async (req, res) => {
  try {
    var randomPage = Math.floor(Math.random() * TOTAL_API_PAGES) + 1
    var response = await fetch(`${POTTER_API_BASE}/characters?page[size]=${PACK_SIZE}&page[number]=${randomPage}`)
    var data = await response.json()

    var characters = []
    for (var i = 0; i < data.data.length; i++) {
      var rawCharacter = data.data[i]
      var attributes = rawCharacter.attributes
      if (!attributes.name || attributes.name == '' || !attributes.image) continue

      var power = HOUSE_POWER[attributes.house] !== undefined ? HOUSE_POWER[attributes.house] : HOUSE_POWER.default
      var magic = SPECIES_MAGIC[attributes.species] !== undefined ? SPECIES_MAGIC[attributes.species] : SPECIES_MAGIC.default
      var defense = ANCESTRY_DEFENSE[attributes.ancestry] !== undefined ? ANCESTRY_DEFENSE[attributes.ancestry] : ANCESTRY_DEFENSE.default
      var hp = defense + Math.floor(Math.random() * HP_RANDOM_BONUS) + HP_BASE_BONUS

      var character = {}
      character.id = rawCharacter.id
      character.name = attributes.name
      character.house = attributes.house || 'Unknown'
      character.species = attributes.species || 'Unknown'
      character.ancestry = attributes.ancestry || 'Unknown'
      character.image = attributes.image
      character.power = power
      character.magic = magic
      character.defense = defense
      character.hp = hp
      character.maxHp = hp

      characters.push(character)
    }

    for (var index = characters.length - 1; index > 0; index--) {
      var randomIndex = Math.floor(Math.random() * (index + 1))
      var temp = characters[index]; characters[index] = characters[randomIndex]; characters[randomIndex] = temp
    }

    res.json({ cards: characters.slice(0, DRAFT_PACK_CARDS) })
  } catch(error) {
    console.log(error)
    res.status(500).json({ error: 'erro ao buscar personagens' })
  }
})

// pega feiticos disponiveis
app.get('/api/spells', async (req, res) => {
  try {
    var response = await fetch(`${POTTER_API_BASE}/spells?page[size]=${PACK_SIZE}`)
    var data = await response.json()

    var spells = []
    for (var i = 0; i < data.data.length; i++) {
      var rawSpell = data.data[i]
      var attributes = rawSpell.attributes
      if (!attributes.name || attributes.name == '') continue

      var damage = SPELL_DAMAGE[attributes.category] !== undefined ? SPELL_DAMAGE[attributes.category] : SPELL_DAMAGE.default

      var spell = {}
      spell.id = rawSpell.id
      spell.name = attributes.name
      spell.effect = attributes.effect || 'Efeito desconhecido'
      spell.category = attributes.category || 'Spell'
      spell.light = attributes.light || 'Unknown'
      spell.damage = damage

      spells.push(spell)
    }

    for (var index = spells.length - 1; index > 0; index--) {
      var randomIndex = Math.floor(Math.random() * (index + 1))
      var temp = spells[index]; spells[index] = spells[randomIndex]; spells[randomIndex] = temp
    }

    res.json({ spells: spells.slice(0, SPELL_POOL_SIZE) })
  } catch(error) {
    console.log(error)
    res.status(500).json({ error: 'erro ao buscar feiticos' })
  }
})

// monta deck cpu com personagens aleatorios
app.post('/api/cpu-deck', async (req, res) => {
  try {
    var randomPage = Math.floor(Math.random() * TOTAL_API_PAGES) + 1
    var response = await fetch(`${POTTER_API_BASE}/characters?page[size]=${PACK_SIZE}&page[number]=${randomPage}`)
    var data = await response.json()

    var characters = []
    for (var i = 0; i < data.data.length; i++) {
      var rawCharacter = data.data[i]
      var attributes = rawCharacter.attributes
      if (!attributes.name || attributes.name == '' || !attributes.image) continue

      var power = HOUSE_POWER[attributes.house] !== undefined ? HOUSE_POWER[attributes.house] : HOUSE_POWER.default
      var magic = SPECIES_MAGIC[attributes.species] !== undefined ? SPECIES_MAGIC[attributes.species] : SPECIES_MAGIC.default
      var defense = ANCESTRY_DEFENSE[attributes.ancestry] !== undefined ? ANCESTRY_DEFENSE[attributes.ancestry] : ANCESTRY_DEFENSE.default
      var hp = defense + Math.floor(Math.random() * HP_RANDOM_BONUS) + HP_BASE_BONUS

      var character = {}
      character.id = rawCharacter.id
      character.name = attributes.name
      character.house = attributes.house || 'Unknown'
      character.species = attributes.species || 'Unknown'
      character.ancestry = attributes.ancestry || 'Unknown'
      character.image = attributes.image
      character.power = power
      character.magic = magic
      character.defense = defense
      character.hp = hp
      character.maxHp = hp

      characters.push(character)
    }

    for (var index = characters.length - 1; index > 0; index--) {
      var randomIndex = Math.floor(Math.random() * (index + 1))
      var temp = characters[index]; characters[index] = characters[randomIndex]; characters[randomIndex] = temp
    }

    res.json({ deck: characters.slice(0, CPU_DECK_SIZE) })
  } catch(error) {
    console.log(error)
    res.status(500).json({ error: 'erro ao montar deck cpu' })
  }
})

app.listen(3000, () => {
  console.log('rodando na porta 3000')
})