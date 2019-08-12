const express = require('express')
const next = require('next')
const helmet = require('helmet')
const cors = require('cors')

const port = process.env.PORT || 5000
const dev = process.env.NODE_ENV !== 'production'

const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()
const app = express()

app.use(express.json())
app.use(helmet())
app.use(cors({ origin: true }))
app.get('*', (req, res) => nextHandler(req, res))

exports.startServer = async () => {
  await nextApp.prepare()

  app.listen(port, error => {
    if (error) throw error
    console.log(`Server listening on port ${port}`)
  })
}

exports.app = app
