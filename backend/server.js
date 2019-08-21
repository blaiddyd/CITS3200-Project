'use strict'

const express = require('express')
const next = require('next')
const helmet = require('helmet')
const cors = require('cors')

const config = require('../config')
const { port, dev } = config
const connectToDatabase = require('../helpers/connectToDatabase')

const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()
const app = express()

const setup = async () => {
  // init mongoose
  await connectToDatabase()

  // Routers are imported after the model to avoid issues with mongoose
  const apiRouter = require('./routers')
  app.use(express.json())
  app.use(helmet())
  app.use(cors({ origin: true }))

  app.use('/api', apiRouter)
  app.get('*', (req, res) => nextHandler(req, res))
}

exports.startServer = async () => {
  await setup()
  await nextApp.prepare()

  app.listen(port, error => {
    if (error) throw error
    console.log(`Server listening on port ${port}`)
  })
}

exports.app = app
