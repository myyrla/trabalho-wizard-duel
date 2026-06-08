const express = require('express')
const charactersRouter = require('./routes/characters')
const spellsRouter     = require('./routes/spells')
const gameRouter       = require('./routes/game')

const app = express()

app.use(express.static('public'))
app.use(express.json())

app.use('/api', charactersRouter)
app.use('/api', spellsRouter)
app.use('/api', gameRouter)

app.listen(3000, () => {
  console.log('rodando na porta 3000')
})