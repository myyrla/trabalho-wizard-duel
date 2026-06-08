var FALLBACK_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png'

function getHouseColor(house) {
  if (house == 'Gryffindor') return '#6b1010'
  if (house == 'Slytherin')  return '#0a3018'
  if (house == 'Hufflepuff') return '#3a2800'
  if (house == 'Ravenclaw')  return '#0a1a3a'
  return '#1e1040'
}

function getHouseEmoji(house) {
  if (house == 'Gryffindor') return '🦁'
  if (house == 'Slytherin')  return '🐍'
  if (house == 'Hufflepuff') return '🦡'
  if (house == 'Ravenclaw')  return '🦅'
  return '✦'
}

function hpColor(hpPercent) {
  if (hpPercent > 0.6) return 'linear-gradient(90deg,#0a4a2a,#22cc77)'
  if (hpPercent > 0.3) return 'linear-gradient(90deg,#4a3a00,#ccaa22)'
  return 'linear-gradient(90deg,#4a0a0a,#cc2222)'
}

function renderCard(char) {
  var hpPercent  = char.hp / char.maxHp
  var houseColor = getHouseColor(char.house)
  var houseEmoji = getHouseEmoji(char.house)
  var hpWidth    = Math.max(0, hpPercent * 100)
  var hpDisplay  = Math.max(0, char.hp)

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
  `
}

function renderDeckBadges(deck, activeIdx, elId) {
  var container = document.getElementById(elId)
  var html = ''
  for (var i = 0; i < deck.length; i++) {
    var cssClass = deck[i].hp <= 0 ? 'deck-thumb dead' : (i == activeIdx ? 'deck-thumb active' : 'deck-thumb')
    html += `<div class="${cssClass}"><img src="${deck[i].image}" onerror="this.src='${FALLBACK_IMAGE}'"></div>`
  }
  container.innerHTML = html
}

function renderSpells(playerSpells, enabled) {
  var container    = document.getElementById('spellList')
  var disabledAttr = enabled ? '' : 'disabled'
  var html = ''
  for (var i = 0; i < playerSpells.length; i++) {
    var spell      = playerSpells[i]
    var isHeal     = spell.damage < 0
    var dmgLabel   = isHeal ? '💚 +' + Math.abs(spell.damage) + ' HP' : '💀 ' + spell.damage + ' dmg'
    var dmgClass   = isHeal ? 'spell-dmg heal' : 'spell-dmg attack'
    html += `<button class="spell-btn" ${disabledAttr} onclick="castSpell(${i})">
      <div>
        <span class="spell-name">${spell.name}</span>
        <span class="spell-effect">${spell.effect}</span>
      </div>
      <span class="${dmgClass}">${dmgLabel}</span>
    </button>`
  }
  container.innerHTML = html
}

function renderPack(pack, selectedCards) {
  var grid = document.getElementById('packGrid')
  grid.innerHTML = ''
  for (var i = 0; i < pack.length; i++) {
    var char       = pack[i]
    var isSelected = selectedCards.indexOf(i) >= 0
    var cardEl     = document.createElement('div')
    cardEl.className = 'card' + (isSelected ? ' selected' : '')
    cardEl.innerHTML = renderCard(char)
    cardEl.setAttribute('data-idx', i)
    cardEl.onclick = (function(idx) { return function() { toggleDraftCard(idx) } })(i)
    grid.appendChild(cardEl)
  }
  document.getElementById('draftCount').textContent = selectedCards.length
  document.getElementById('btnConfirmDraft').disabled = selectedCards.length < 2
}

function logBattleMessage(msg, type) {
  type = type || 'info'
  var container = document.getElementById('battleLog')
  var entry     = document.createElement('span')
  entry.className = 'log-entry ' + type
  entry.textContent = msg
  container.appendChild(entry)
  container.scrollTop = container.scrollHeight
}

function setStatusMessage(msg) {
  document.getElementById('battleStatus').textContent = msg
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(screen) { screen.classList.remove('active') })
  var target = document.getElementById(id)
  if (target) target.classList.add('active')
}