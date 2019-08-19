'use strict'

const { Storage } = require('@google-cloud/storage')
const config = require('../../config')

const storage = new Storage({
  projectId: config.storage.projectId
})
const bucket = storage.bucket(config.storage.bucket)

/**
 * @function GCSUpload
 * @description This function takes the sent file and uploads it to GCP.
 */
function GCSUpload(req, res, next) {
  if (!req.file) {
    return next()
  }

  req.file.originalname = req.file.originalname.replace(/[\s]/gi, '_')

  const gcsname = Date.now() + '-' + req.file.originalname
  const file = bucket.file(gcsname)
  const url = `${config.storage.url}${gcsname}`

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    },
    resumable: false
  })

  stream.on('error', err => {
    console.log(err)
    res.status(400).json({ err })
  })

  stream.on('finish', () => {
    req.file.gcsName = gcsname
    req.file.gcsUrl = url
    next()
  })

  stream.end(req.file.buffer)
}

module.exports = GCSUpload
