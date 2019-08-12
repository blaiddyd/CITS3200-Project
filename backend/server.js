const express = require('express')
const next = require('next')
const helmet = require('helmet')
const cors = require('cors')

const port = process.env.PORT || 5000
const dev = process.env.NODE_ENV !== 'production'

export const startServer = async () => {
  const nextApp = await next({ dev }).prepare()
  const nextHandler = nextApp.getRequestHandler()

  const app = express()
  app.use(express.json())
  app.use(helmet())
  app.use(cors({ origin: true }))

  app.get('*', (req, res) => nextHandler(req, res))

  app.listen(port, error => {
    if (error) throw error
  })
}
