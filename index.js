/** Project entry point */
import { startServer } from './backend/server'

startServer()
  .then(() => {
    console.log(`App serving on port ${port}`)
  })
  .catch(yikes => {
    console.error(yikes)
    process.exit(1)
  })
