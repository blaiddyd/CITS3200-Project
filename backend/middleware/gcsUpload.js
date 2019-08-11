'use strict'

const { Storage } = require('@google-cloud/storage')

const storage = new Storage({
  projectId: 'cits3200-project'
})
const bucket = storage.bucket('cits3200-team24-images')

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
  const url = `https://storage.googleapis.com/cits3200-team24-images/${gcsname}`

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
