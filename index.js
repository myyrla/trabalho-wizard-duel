const express = require('express')
const charactersRouter = require('./routes/characters')
const spellsRouter     = require('./routes/spells')
const gameRouter       = require('./routes/game')

const app = express()
const PORT = 3000

app.use(express.static('public'))
app.use(express.json())

app.use('/api', charactersRouter)
app.use('/api', spellsRouter)
app.use('/api', gameRouter)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})