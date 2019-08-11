const express = require('express')
const next = require('next')
const helmet = require('helmet')
const cors = require('cors')

const port = process.env.PORT || 5000
const dev = process.env.NODE_ENV !== 'production'

const nextApp = next({ dev })
const handler = nextApp.getRequestHandler()

nextApp.prepare().then(() => {
  const app = express()
  app.use(express.json())
  app.use(helmet())
  app.use(cors({ origin: true }))

  app.get('*', (req, res) => {
    return handler(req, res)
  })

  app.listen(port, err => {
    if (err) {
      throw err
    }
    console.log(`App serving at port ${port}`)
  })
})
.catch((yikes) => {
  console.error(yikes)
  process.exit(1)
})
