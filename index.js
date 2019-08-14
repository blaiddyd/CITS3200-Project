/** Project entry point */
require('dotenv').config()
const { startServer } = require('./backend/server')

startServer().catch(yikes => {
  console.error(yikes)
  process.exit(1)
})
