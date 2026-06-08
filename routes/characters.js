const express = require('express');
const { fetchRandomCharacterPage } = require('../services/potterApi');
const { buildCharacterCard, shuffleArray, filterValidCharacters } = require('../services/statsCalculator');
const { DRAFT_PACK_CARDS } = require('../constants');

const router = express.Router();

router.get('/pack', async (req, res) => {
  try {
    const rawCharacters = await fetchRandomCharacterPage();
    const validCharacters = filterValidCharacters(rawCharacters);
    const characterCards = validCharacters.map(buildCharacterCard);
    const shuffledCards = shuffleArray(characterCards);

    res.json({ cards: shuffledCards.slice(0, DRAFT_PACK_CARDS) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'erro ao buscar personagens' });
  }
});

module.exports = router;
