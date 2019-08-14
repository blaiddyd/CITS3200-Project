const mongoose = require('mongoose')
const config = require('../config')

// models
require('./models/projectModel')
require('./models/imageModel')

const connectToDatabase = () => {
  // Mongoose connection and imports
  mongoose.connect(config.database.connectionString, { useNewUrlParser: true })

  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'MongoDB connection error:'))
  db.once('open', function() {
    console.log('MongoDB server connected.')
  })
}

module.exports = connectToDatabase
