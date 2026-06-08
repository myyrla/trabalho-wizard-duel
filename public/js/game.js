const PLAYER_SPELL_COUNT = 5;
const PLAYER_DECK_SIZE = 2;
const STAT_MAX = 100;
const DAMAGE_VARIANCE = 0.4;
const DAMAGE_BASE = 0.8;
const TIMEOUT_CPU_TURN = 800;
const TIMEOUT_ROUND_END = 700;
const TIMEOUT_LOADING_FADE = 400;
const TIMEOUT_SCREEN_TRANSITION = 600;
const TIMEOUT_ANIMATION = 500;
const TIMEOUT_HIT_ANIMATION = 600;

// ── ESTADO GLOBAL ──────────────────────────────────────
const state = {
  phase: 'loading',
  pack: [],
  selectedCards: [],
  playerDeck: [],
  cpuDeck: [],
  spells: [],
  playerSpells: [],
  round: 1,
  scorePlayer: 0,
  scoreCpu: 0,
  waiting: false,
};

// ── UTILS ──────────────────────────────────────────────
function shuffleArray(array) {
  const shuffled = array.slice();
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temp = shuffled[index];
    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }
  return shuffled;
}

function getFirstAliveIndex(deck) {
  for (let i = 0; i < deck.length; i += 1) {
    if (deck[i].hp > 0) return i;
  }
  return -1;
}

// ── LOADING ────────────────────────────────────────────
async function loadGame() {
  const loadBar = document.getElementById('loadBar');
  const loadMsg = document.getElementById('loadMsg');

  loadMsg.textContent = 'Invocando personagens...';
  loadBar.style.width = '20%';
  state.pack = await fetchPack();

  loadBar.style.width = '55%';
  loadMsg.textContent = 'Consultando o livro de feitiços...';
  state.spells = await fetchSpells();

  loadBar.style.width = '85%';
  loadMsg.textContent = 'Preparando o adversário...';
  state.cpuDeck = await fetchCpuDeck();

  const shuffledSpells = shuffleArray(state.spells);
  state.playerSpells = shuffledSpells.slice(0, PLAYER_SPELL_COUNT);

  loadBar.style.width = '100%';
  loadMsg.textContent = 'Pronto!';

  setTimeout(() => {
    document.getElementById('screen-loading').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('screen-loading').style.display = 'none';
      showScreen('screen-draft');
      renderPack(state.pack, state.selectedCards);
    }, TIMEOUT_SCREEN_TRANSITION);
  }, TIMEOUT_LOADING_FADE);
}

// ── DRAFT ──────────────────────────────────────────────
function toggleDraftCard(cardIndex) {
  const position = state.selectedCards.indexOf(cardIndex);
  if (position >= 0) {
    state.selectedCards.splice(position, 1);
  } else {
    if (state.selectedCards.length >= PLAYER_DECK_SIZE) return;
    state.selectedCards.push(cardIndex);
  }
  renderPack(state.pack, state.selectedCards);
}

async function rerollPack() {
  state.selectedCards = [];
  document.getElementById('packGrid').innerHTML = renderLoadingMessage('Invocando novos bruxos...');
  state.pack = await fetchPack();
  renderPack(state.pack, state.selectedCards);
}

function confirmDraft() {
  if (state.selectedCards.length < PLAYER_DECK_SIZE) return;
  state.playerDeck = [
    state.pack[state.selectedCards[0]],
    state.pack[state.selectedCards[1]],
  ];
  startBattle();
}

// ── BATTLE ─────────────────────────────────────────────
function startBattle() {
  state.round = 1;
  state.scorePlayer = 0;
  state.scoreCpu = 0;
  state.waiting = false;

  document.getElementById('scoreP').textContent = '0';
  document.getElementById('scoreC').textContent = '0';
  document.getElementById('roundNum').textContent = '1';
  document.getElementById('battleLog').innerHTML = '';
  document.getElementById('btnNext').style.display = 'none';

  showScreen('screen-battle');
  renderBattleState();
  logBattleMessage('⚔ O duelo começou! Escolha um feitiço para atacar.', 'info');
  setStatusMessage('Escolha um feitiço para atacar!');
}

function renderBattleState() {
  const playerIndex = getFirstAliveIndex(state.playerDeck);
  const cpuIndex = getFirstAliveIndex(state.cpuDeck);

  if (playerIndex < 0 || cpuIndex < 0) { endGame(); return; }

  const playerCharacter = state.playerDeck[playerIndex];
  const cpuCharacter = state.cpuDeck[cpuIndex];

  document.getElementById('playerActiveName').textContent = playerCharacter.name;
  document.getElementById('cpuActiveName').textContent = cpuCharacter.name;

  const playerSlot = document.getElementById('playerCardSlot');
  const cpuSlot = document.getElementById('cpuCardSlot');

  const playerCardEl = document.createElement('div');
  playerCardEl.className = 'card battle-card';
  playerCardEl.id = 'battleCardP';
  playerCardEl.innerHTML = renderCard(playerCharacter);
  playerSlot.innerHTML = '';
  playerSlot.appendChild(playerCardEl);

  const cpuCardEl = document.createElement('div');
  cpuCardEl.className = 'card battle-card';
  cpuCardEl.id = 'battleCardC';
  cpuCardEl.innerHTML = renderCard(cpuCharacter);
  cpuSlot.innerHTML = '';
  cpuSlot.appendChild(cpuCardEl);

  renderDeckBadges(state.playerDeck, playerIndex, 'playerDeckBadges');
  renderDeckBadges(state.cpuDeck, cpuIndex, 'cpuDeckBadges');
  renderSpells(state.playerSpells, !state.waiting);
}

function castSpell(spellIndex) {
  if (state.waiting) return;
  state.waiting = true;
  renderSpells(state.playerSpells, false);

  const chosenSpell = state.playerSpells[spellIndex];
  const playerIndex = getFirstAliveIndex(state.playerDeck);
  const cpuIndex = getFirstAliveIndex(state.cpuDeck);
  const playerCharacter = state.playerDeck[playerIndex];
  const cpuCharacter = state.cpuDeck[cpuIndex];

  const playerDamage = Math.floor(
    chosenSpell.damage * (playerCharacter.magic / STAT_MAX)
  * (Math.random() * DAMAGE_VARIANCE + DAMAGE_BASE),
  );
  if (chosenSpell.damage < 0) {
    const healAmount = Math.abs(playerDamage);
    playerCharacter.hp = Math.min(playerCharacter.maxHp, playerCharacter.hp + healAmount);
    logBattleMessage(`✨ ${chosenSpell.name} — você curou ${healAmount} HP! (${playerCharacter.name}: ${playerCharacter.hp} HP)`, 'heal');
    document.getElementById('battleCardP').classList.add('battling');
    setTimeout(() => {
      const card = document.getElementById('battleCardP');
      if (card) card.classList.remove('battling');
    }, TIMEOUT_ANIMATION);
  } else {
    cpuCharacter.hp -= playerDamage;
    logBattleMessage(`⚡ ${chosenSpell.name} → ${cpuCharacter.name} perdeu ${playerDamage} HP! (${cpuCharacter.name}: ${Math.max(0, cpuCharacter.hp)} HP)`, 'win');
    document.getElementById('battleCardC').classList.add('hit');
    setTimeout(() => {
      const card = document.getElementById('battleCardC');
      if (card) card.classList.remove('hit');
    }, TIMEOUT_HIT_ANIMATION);
  }

  setTimeout(() => {
    const cpuSpellIndex = Math.floor(Math.random() * state.spells.length);
    const cpuSpell = state.spells[cpuSpellIndex];
    const cpuDamage = Math.floor(
      cpuSpell.damage * (cpuCharacter.magic / STAT_MAX)
  * (Math.random() * DAMAGE_VARIANCE + DAMAGE_BASE),
    );
    if (cpuSpell.damage < 0) {
      const cpuHeal = Math.abs(cpuDamage);
      cpuCharacter.hp = Math.min(cpuCharacter.maxHp, cpuCharacter.hp + cpuHeal);
      logBattleMessage(`🧙 CPU: ${cpuSpell.name} — CPU curou ${cpuHeal} HP! (${cpuCharacter.name}: ${cpuCharacter.hp} HP)`, 'heal');
      const cpuCard = document.getElementById('battleCardC');
      if (cpuCard) cpuCard.classList.add('battling');
      setTimeout(() => {
        const card = document.getElementById('battleCardC');
        if (card) card.classList.remove('battling');
      }, TIMEOUT_ANIMATION);
    } else {
      playerCharacter.hp -= cpuDamage;
      logBattleMessage(`💀 CPU: ${cpuSpell.name} → ${playerCharacter.name} perdeu ${cpuDamage} HP! (${playerCharacter.name}: ${Math.max(0, playerCharacter.hp)} HP)`, 'lose');
      const playerCard = document.getElementById('battleCardP');
      if (playerCard) playerCard.classList.add('hit');
      setTimeout(() => {
        const card = document.getElementById('battleCardP');
        if (card) card.classList.remove('hit');
      }, TIMEOUT_HIT_ANIMATION);
    }

    setTimeout(() => {
      let roundOver = false;

      if (playerIndex >= 0 && state.playerDeck[playerIndex].hp <= 0) {
        logBattleMessage(`💀 ${state.playerDeck[playerIndex].name} foi derrotado!`, 'lose');
        state.scoreCpu += 1;
        document.getElementById('scoreC').textContent = state.scoreCpu;
        roundOver = true;
      }
      if (cpuIndex >= 0 && state.cpuDeck[cpuIndex].hp <= 0) {
        logBattleMessage(`🏆 ${state.cpuDeck[cpuIndex].name} foi derrotado!`, 'win');
        state.scorePlayer += 1;
        document.getElementById('scoreP').textContent = state.scorePlayer;
        roundOver = true;
      }

      renderBattleState();

      const nextPlayerAlive = getFirstAliveIndex(state.playerDeck);
      const nextCpuAlive = getFirstAliveIndex(state.cpuDeck);

      if (nextPlayerAlive < 0 || nextCpuAlive < 0) {
        setTimeout(endGame, TIMEOUT_CPU_TURN);
        return;
      }

      state.waiting = false;

      if (roundOver) {
        state.round += 1;
        document.getElementById('roundNum').textContent = state.round;
        logBattleMessage(`— Rodada ${state.round} —`, 'info');
      }

      setStatusMessage('Escolha um feitiço para atacar!');
      renderSpells(state.playerSpells, true);
    }, TIMEOUT_ROUND_END);
  }, TIMEOUT_CPU_TURN);
}

function nextRound() {
  document.getElementById('btnNext').style.display = 'none';
  state.round += 1;
  document.getElementById('roundNum').textContent = state.round;
  logBattleMessage(`— Rodada ${state.round} —`, 'info');
  state.waiting = false;
  renderBattleState();
  setStatusMessage('Escolha um feitiço para atacar!');
}

// ── END ────────────────────────────────────────────────
function endGame() {
  const gameOverScreen = document.getElementById('screen-over');
  const glyphElement = document.getElementById('overGlyph');
  const titleElement = document.getElementById('overTitle');
  const subtitleElement = document.getElementById('overSub');
  const scoreElement = document.getElementById('overScore');

  if (state.scorePlayer > state.scoreCpu) {
    glyphElement.textContent = '🏆';
    titleElement.textContent = 'Vitória!';
    subtitleElement.textContent = 'Você dominou o duelo!';
  } else if (state.scoreCpu > state.scorePlayer) {
    glyphElement.textContent = '💀';
    titleElement.textContent = 'Derrota';
    subtitleElement.textContent = 'O CPU foi mais poderoso desta vez.';
  } else {
    glyphElement.textContent = '✦';
    titleElement.textContent = 'Empate';
    subtitleElement.textContent = 'Bruxos igualmente poderosos.';
  }

  scoreElement.textContent = `Você ${state.scorePlayer}  ×  ${state.scoreCpu} CPU`;
  gameOverScreen.classList.add('active');
}

function restartGame() {
  document.getElementById('screen-over').classList.remove('active');
  state.selectedCards = [];
  state.pack = [];
  state.playerDeck = [];

  const loadingScreen = document.getElementById('screen-loading');
  loadingScreen.style.display = 'flex';
  loadingScreen.classList.remove('fade-out');
  document.getElementById('loadBar').style.width = '0%';
  showScreen('');
  loadGame();
}

// ── INIT ───────────────────────────────────────────────
loadGame();
