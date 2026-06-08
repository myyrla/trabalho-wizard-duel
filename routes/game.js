const express = require('express');
const { fetchRandomCharacterPage } = require('../services/potterApi');
const { buildCharacterCard, shuffleArray, filterValidCharacters } = require('../services/statsCalculator');
const { CPU_DECK_SIZE } = require('../constants');

const router = express.Router();

router.post('/cpu-deck', async (req, res) => {
  try {
    const rawCharacters = await fetchRandomCharacterPage();
    const validCharacters = filterValidCharacters(rawCharacters);
    const characterCards = validCharacters.map(buildCharacterCard);
    const shuffledCards = shuffleArray(characterCards);

    res.json({ deck: shuffledCards.slice(0, CPU_DECK_SIZE) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'erro ao montar deck cpu' });
  }
});

module.exports = router;
