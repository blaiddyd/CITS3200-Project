const mongoose = require('mongoose')
const config = require('../config')

// models
require('../backend/models/imageModel')
require('../backend/models/projectModel')

const connectToDatabase = () =>
  new Promise((resolve, reject) => {
    // Mongoose connection and imports
    mongoose.connect(config.database.connectionString, {
      useNewUrlParser: true
    })

    const db = mongoose.connection
    db.on('error', error => {
      console.error('MongoDB connection error:', error)
      reject(error)
    })
    db.once('open', () => {
      console.log('MongoDB server connected.')
      resolve(db)
    })
  })

module.exports = connectToDatabase
