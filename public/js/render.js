const FALLBACK_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image-available.svg.png';

const HOUSE_COLORS = {
  Gryffindor: '#6b1010',
  Slytherin: '#0a3018',
  Hufflepuff: '#3a2800',
  Ravenclaw: '#0a1a3a',
  default: '#1e1040',
};

const HOUSE_EMOJIS = {
  Gryffindor: '🦁',
  Slytherin: '🐍',
  Hufflepuff: '🦡',
  Ravenclaw: '🦅',
  default: '✦',
};

const HP_COLOR_HIGH = 'linear-gradient(90deg,#0a4a2a,#22cc77)';
const HP_COLOR_MID = 'linear-gradient(90deg,#4a3a00,#ccaa22)';
const HP_COLOR_LOW = 'linear-gradient(90deg,#4a0a0a,#cc2222)';
const HP_THRESHOLD_HIGH = 0.6;
const HP_THRESHOLD_MID = 0.3;

function getHouseColor(house) {
  return HOUSE_COLORS[house] || HOUSE_COLORS.default;
}

function getHouseEmoji(house) {
  return HOUSE_EMOJIS[house] || HOUSE_EMOJIS.default;
}

function hpColor(hpPercent) {
  if (hpPercent > HP_THRESHOLD_HIGH) return HP_COLOR_HIGH;
  if (hpPercent > HP_THRESHOLD_MID) return HP_COLOR_MID;
  return HP_COLOR_LOW;
}

function renderCard(char) {
  const hpPercent = char.hp / char.maxHp;
  const houseColor = getHouseColor(char.house);
  const houseEmoji = getHouseEmoji(char.house);
  const hpWidth = Math.max(0, hpPercent * 100);
  const hpDisplay = Math.max(0, char.hp);

  return `
    <div class="card-img">
      <img src="${char.image}" alt="${char.name}" onerror="this.src='${FALLBACK_IMAGE}'">
      <div class="house-badge" style="background:${houseColor}">${houseEmoji}</div>
    </div>
    <div class="card-body">
      <div class="card-name">${char.name}</div>
      <div class="card-meta">${char.species} · ${char.house}</div>
      <div class="hp-bar-wrap">
        <span class="hp-label">HP</span>
        <div class="hp-track">
          <div class="hp-fill" style="width:${hpWidth}%;background:${hpColor(hpPercent)}"></div>
        </div>
        <span class="hp-val">${hpDisplay}/${char.maxHp}</span>
      </div>
      <div class="mini-stats">
        <div class="mini-stat">
          <span class="mini-stat-icon">⚡</span>
          <span class="mini-stat-val">${char.power}</span>
          <span class="mini-stat-lbl">Poder</span>
        </div>
        <div class="mini-stat">
          <span class="mini-stat-icon">🔮</span>
          <span class="mini-stat-val">${char.magic}</span>
          <span class="mini-stat-lbl">Magia</span>
        </div>
        <div class="mini-stat">
          <span class="mini-stat-icon">🛡</span>
          <span class="mini-stat-val">${char.defense}</span>
          <span class="mini-stat-lbl">Defesa</span>
        </div>
      </div>
    </div>
  `;
}

function renderDeckBadges(deck, activeIdx, elId) {
  const container = document.getElementById(elId);
  container.innerHTML = deck.map((character, index) => {
    let modifier = '';
    if (character.hp <= 0) modifier = ' dead';
    else if (index === activeIdx) modifier = ' active';
    const cssClass = `deck-thumb${modifier}`;
    return `<div class="${cssClass}"><img src="${character.image}" onerror="this.src='${FALLBACK_IMAGE}'"></div>`;
  }).join('');
}

function renderSpells(playerSpells, enabled) {
  const container = document.getElementById('spellList');
  const disabledAttr = enabled ? '' : 'disabled';
  container.innerHTML = playerSpells.map((spell, index) => {
    const isHeal = spell.damage < 0;
    const dmgLabel = isHeal ? `💚 +${Math.abs(spell.damage)} HP` : `💀 ${spell.damage} dmg`;
    const dmgClass = isHeal ? 'spell-dmg heal' : 'spell-dmg attack';
    return `<button class="spell-btn" ${disabledAttr} onclick="castSpell(${index})">
      <div>
        <span class="spell-name">${spell.name}</span>
        <span class="spell-effect">${spell.effect}</span>
      </div>
      <span class="${dmgClass}">${dmgLabel}</span>
    </button>`;
  }).join('');
}

function renderPack(pack, selectedCards) {
  const grid = document.getElementById('packGrid');
  grid.innerHTML = '';
  pack.forEach((char, index) => {
    const isSelected = selectedCards.indexOf(index) >= 0;
    const cardEl = document.createElement('div');
    cardEl.className = `card${isSelected ? ' selected' : ''}`;
    cardEl.innerHTML = renderCard(char);
    cardEl.setAttribute('data-idx', index);
    cardEl.onclick = () => toggleDraftCard(index);
    grid.appendChild(cardEl);
  });
  document.getElementById('draftCount').textContent = selectedCards.length;
  document.getElementById('btnConfirmDraft').disabled = selectedCards.length < PLAYER_DECK_SIZE;
}

function logBattleMessage(msg, type = 'info') {
  const container = document.getElementById('battleLog');
  const entry = document.createElement('span');
  entry.className = `log-entry ${type}`;
  entry.textContent = msg;
  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;
}

function setStatusMessage(msg) {
  document.getElementById('battleStatus').textContent = msg;
}

function renderLoadingMessage(message) {
  return `<div class="loading-message">${message}</div>`;
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((screen) => screen.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}
