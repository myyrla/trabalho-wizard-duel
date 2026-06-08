# REFATORACAO.md — Wizard Duel

## Lista de Problemas Encontrados

### 1. Números Mágicos
Valores literais sem contexto espalhados no código:

| Valor | Contexto |
|-------|----------|
| `100` | Tamanho de página da API |
| `4` | Número de cartas do draft pack |
| `2` | Tamanho do deck do jogador e CPU |
| `20` | Número de feitiços retornados |
| `5` | Feitiços atribuídos ao jogador |
| `8` | Total de páginas da API |
| `90`, `85`, `80`, `75` | Poder por casa |
| `95`, `91`, `88`... | Magia por espécie |
| `90`, `75`, `70`, `40`, `35` | Defesa por ancestralidade |
| `800`, `700`, `400`, `600`, `500` | Timeouts de animação (ms) |

### 2. Nomes Sem Significado

| Nome original | Nome após refatoração |
|---------------|----------------------|
| `pg` | `randomPage` |
| `d` | `response` |
| `r` | `data` |
| `tmp` | `characterCards` / `spellCards` |
| `c` | `rawCharacter` |
| `a` | `attributes` |
| `pw` | `power` |
| `mg` | `magic` |
| `df` | `defense` |
| `x`, `y`, `z` | `index`, `randomIndex`, `temp` |
| `sp` | `chosenSpell` / `cpuSpell` |
| `pIdx`, `cIdx` | `playerIndex`, `cpuIndex` |
| `pChar`, `cChar` | `playerCharacter`, `cpuCharacter` |

### 3. Funções com Múltiplas Responsabilidades
As rotas `/api/pack` e `/api/cpu-deck` faziam fetch, filtragem, cálculo de atributos e embaralhamento tudo na mesma função.

**Solução:** cada responsabilidade foi extraída para função/módulo próprio.

### 4. Código Duplicado (DRY)
O bloco de cálculo de atributos e o embaralhamento estavam idênticos em `/api/pack` e `/api/cpu-deck`.

**Solução:**
- `buildCharacterCard()` em `services/statsCalculator.js`
- `shuffleArray()` em `services/statsCalculator.js`

### 5. Code Smells Gerais

| Smell | Correção |
|-------|----------|
| `var` em todo o código | Substituído por `const` / `let` |
| Concatenação de strings | Substituído por template literals |
| Construção manual de HTML | Substituído por template literals |
| `console.log` em erros | Substituído por `console.error` |
| `==` em vez de `===` | Substituído por `===` |

---

## Decisões Tomadas

### Lookup objects no lugar de if/else em cadeia
Os blocos `if (a.house == 'Gryffindor') pw = 90` foram substituídos por objetos de lookup em `constants.js`:
```js
const HOUSE_POWER = { Gryffindor: 90, Slytherin: 85, ... }
const power = HOUSE_POWER[attributes.house] !== undefined
  ? HOUSE_POWER[attributes.house]
  : HOUSE_POWER.default
```

### Separação do HTML em múltiplos arquivos
O `index.html` original tinha ~400 linhas de CSS e ~400 linhas de JavaScript embutidos. Após a refatoração:
- `css/style.css` → todos os estilos
- `js/api.js` → chamadas ao back-end
- `js/render.js` → funções de renderização do DOM
- `js/game.js` → estado e lógica do jogo

### Constantes de timeout duplicadas no front-end
As constantes de timeout foram redefinidas no `public/js/game.js` pois o front-end não tem acesso ao `constants.js` do Node.js via `require`.

---

## Estrutura Final

```
wizard-duel/
├── index.js                  ← inicializa o servidor
├── constants.js              ← constantes da aplicação
├── routes/
│   ├── characters.js         ← GET /api/pack
│   ├── spells.js             ← GET /api/spells
│   └── game.js               ← POST /api/cpu-deck
├── services/
│   ├── potterApi.js          ← comunicação com PotterDB API
│   └── statsCalculator.js    ← cálculo de atributos
└── public/
    ├── index.html
    ├── js/
    │   ├── api.js            ← chamadas ao back-end
    │   ├── render.js         ← funções de renderização
    │   └── game.js           ← estado e lógica do jogo
    └── css/
        └── style.css
```