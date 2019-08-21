const { ExifImage } = require('exif')
const { Storage } = require('@google-cloud/storage')
const storage = new Storage()
const config = require('../config')

const getExif = async filename =>
  new Promise((resolve, reject) => {
    storage
      .bucket(config.storage.bucket)
      .file(filename)
      .download()
      .then(files => {
        const file = files[0]
        ExifImage({ image: file }, (error, data) => {
          if (error) reject(error)
          resolve(data)
        })
      })
      .catch(reject)
  })

module.exports = getExif
