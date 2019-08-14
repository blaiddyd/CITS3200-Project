/** Project entry point */
const { startServer } = require('./backend/server')

startServer().catch(yikes => {
  console.error(yikes)
  process.exit(1)
})
