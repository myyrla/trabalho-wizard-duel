const fetch = require('node-fetch')
const { POTTER_API_BASE, PACK_SIZE, TOTAL_API_PAGES } = require('../constants')

async function fetchRandomCharacterPage() {
  const randomPage = Math.floor(Math.random() * TOTAL_API_PAGES) + 1
  const response = await fetch(`${POTTER_API_BASE}/characters?page[size]=${PACK_SIZE}&page[number]=${randomPage}`)
  const data = await response.json()
  return data.data
}

async function fetchSpells() {
  const response = await fetch(`${POTTER_API_BASE}/spells?page[size]=${PACK_SIZE}`)
  const data = await response.json()
  return data.data
}

module.exports = { fetchRandomCharacterPage, fetchSpells }