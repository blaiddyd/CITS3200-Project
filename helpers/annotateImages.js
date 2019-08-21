const annotateImage = require('./annotateImage')
// const Image = require("mongoose").model("image");
const Image = require('../backend/models/imageModel')
const config = require('../config')
const vision = require('@google-cloud/vision')
const path = require('path')
const uuid = require('uuid/v4')
const fs = require('fs')

/**
 * @function annotateImages
 * @description This function annotates a list of image IDs
 * @param {Array<string>} imageIDs an array of image IDs to be parsed
 * @param {number} minScore the minimum score for matches to be found
 * @returns void
 */
async function annotateImages(apiKey, imageIDs, minScore = 0.6) {
  const keyFilename = path.join(__dirname, '/temp/', uuid(), '.json')
  fs.writeFileSync(keyFilename, apiKey)
  console.log('wrote', apiKey, 'to', keyFilename)

  try {
    const client = new vision.ImageAnnotatorClient({ keyFilename })

    const tasks = imageIDs.map(async ID => {
      const img = await Image.findOne({ _id: ID })

      if (!img) {
        console.log(`Image ${ID} could not be parsed.`)
        return
      }

      const url = `gs://${config.storage.bucket}/${img.filename}`
      const matched = await annotateImage(client, url, minScore)

      img.matched = matched.map(match => match.name)
      img.status = 'Parsed'

      await img.save()
    })

    await Promise.all(tasks)
  } catch (e) {
    if (e) throw e
  }

  fs.unlinkSync(keyFilename)
}

module.exports = annotateImages
