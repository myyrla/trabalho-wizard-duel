/* exported fetchPack, fetchSpells, fetchCpuDeck */

async function fetchPack() {
  const response = await fetch('/api/pack');
  const data = await response.json();
  return data.cards;
}

async function fetchSpells() {
  const response = await fetch('/api/spells');
  const data = await response.json();
  return data.spells;
}

async function fetchCpuDeck() {
  const response = await fetch('/api/cpu-deck', { method: 'POST' });
  const data = await response.json();
  return data.deck;
}
