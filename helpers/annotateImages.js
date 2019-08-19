const annotateImage = require('./annotateImage')
// const Image = require("mongoose").model("image");
const Image = require('../backend/models/imageModel')
const config = require('../config')

/**
 * @function annotateImages
 * @description This function annotates a list of image IDs
 * @param {Array<string>} imageIDs an array of image IDs to be parsed
 * @param {number} minScore the minimum score for matches to be found
 * @returns void
 */
async function annotateImages(imageIDs, minScore = 0.65) {
  try {
    await imageIDs.map(async ID => {
      const img = await Image.findOne({ _id: ID })
      if (!img) {
        console.log(`Image ${ID} could not be parsed.`)
        return
      }
      const matched = await annotateImage(
        `gs://${config.storage.bucket}/${img.filename}`,
        minScore
      )
      img.matched = matched.map(match => match.name)
      img.status = 'Parsed'
      await img.save()
    })
  } catch (e) {
    if (e) throw e
  }
}

module.exports = annotateImages
