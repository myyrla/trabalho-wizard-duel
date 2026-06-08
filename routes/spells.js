const express = require('express')
const { fetchSpells } = require('../services/potterApi')
const { buildSpellCard, shuffleArray } = require('../services/statsCalculator')
const { SPELL_POOL_SIZE } = require('../constants')

const router = express.Router()

router.get('/spells', async (req, res) => {
  try {
    const rawSpells    = await fetchSpells()
    const validSpells  = rawSpells.filter((spell) => spell.attributes.name && spell.attributes.name !== '')
    const spellCards   = validSpells.map(buildSpellCard)
    const shuffled     = shuffleArray(spellCards)

    res.json({ spells: shuffled.slice(0, SPELL_POOL_SIZE) })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'erro ao buscar feiticos' })
  }
})

module.exports = router