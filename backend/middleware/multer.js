'use strict'

const Multer = require('multer')
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 4 * 1024 * 1024
  }
})

module.exports = multer
