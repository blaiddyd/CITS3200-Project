const Module = require('./Module')
const annotateImages = require('../helpers/annotateImages')
const ObjectId = require('mongodb').ObjectId
const uuid = require('uuid/v4')
const path = require('path')
const ensureDirectory = require('../helpers/ensureDirectory')
const downloadFromGCP = require('../helpers/downloadFromGCP')
const dirToZip = require('../helpers/dirToZip')
const config = require('../config')
const imageModel = require('../backend/models/imageModel')
const Image = require('mongoose').model(imageModel.modelName)

const ImageModule = new Module('Ecological Image Classification', {
  type: 'Vision',
  task: async project => {
    const { apiKey, imageIDs } = project
    await annotateImages(apiKey, imageIDs)
  },
  progress: async project => {
    var pendingURLs = []
    var animalURLs = []
    var blankURLs = []

    const { imageIDs } = project
    for (const val of imageIDs) {
      var img = new ObjectId(val)
      const currentImage = await Image.findOne({ _id: img })
      if (currentImage.status === 'Pending') {
        pendingURLs.push(currentImage.url)
      } else if (currentImage.status === 'Parsed') {
        var matched = currentImage.matched
        if (matched.indexOf('Animal') > -1) {
          animalURLs.push(currentImage.url)
        } else {
          blankURLs.push(currentImage.url)
        }
      }
    }

    return {
      pending: pendingURLs,
      animal: animalURLs,
      blank: blankURLs
    }
  },
  download: async (project, type) => {
    const genUUID = uuid()
    // absolute path to root/temp/uuid
    const directory = path.join(__dirname, '../../', `temp/${genUUID}`)
    // absolute path to root/temp/zips/uuid.zip
    const zipName = path.join(__dirname, '../../', `temp/${genUUID}.zip`)
    await ensureDirectory(directory)

    const { imageIDs } = project
    const images = []
    await Promise.all(
      imageIDs.map(async id => {
        const image = await Image.findOne({ _id: id })
        if (!image) {
          return
        }
        if (type === 'Blank') {
          if (image.matched.length === 0) {
            images.push(image.filename)
          }
          return
        }
        if (image.matched.includes(type)) {
          images.push(image.filename)
        }
      })
    )

    await downloadFromGCP(images, config.storage.bucket, directory)
    await dirToZip(directory, zipName)
    return zipName
  }
})

module.exports = ImageModule
