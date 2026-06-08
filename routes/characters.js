const express = require('express')
const { fetchRandomCharacterPage } = require('../services/potterApi')
const { buildCharacterCard, shuffleArray } = require('../services/statsCalculator')
const { DRAFT_PACK_CARDS } = require('../constants')

const router = express.Router()

function filterValidCharacters(rawCharacters) {
  return rawCharacters.filter(function(character) {
    const { name, image } = character.attributes
    return name && name !== '' && image
  })
}

router.get('/pack', async (req, res) => {
  try {
    const rawCharacters   = await fetchRandomCharacterPage()
    const validCharacters = filterValidCharacters(rawCharacters)
    const characterCards  = validCharacters.map(buildCharacterCard)
    const shuffledCards   = shuffleArray(characterCards)

    res.json({ cards: shuffledCards.slice(0, DRAFT_PACK_CARDS) })
  } catch(error) {
    console.log(error)
    res.status(500).json({ error: 'erro ao buscar personagens' })
  }
})

module.exports = router