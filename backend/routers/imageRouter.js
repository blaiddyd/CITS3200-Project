'use strict'

const router = require('express').Router()
const multer = require('../middleware/multer')
const GCSUpload = require('../middleware/gcsUpload')

const fs = require('fs')
const fsPromises = require('fs').promises
const archiver = require('archiver')

const { Storage } = require('@google-cloud/storage')
const storage = new Storage()

const uuid = require('uuid/v4')

const Image = require('mongoose').model('image')

/**
 * @function ensureDirectory
 * @description this ensures that the directory and all parent directories are created.
 * @param {*} dirPath the directory you wish to ensure
 */
async function ensureDirectory(dirPath) {
  try {
    await fsPromises.mkdir(dirPath, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

/**
 * @function downloadFromGCP
 * @description this function downloads a list of items from a GCP bucket name, given a
 *              destination directory.
 * @param {*} items a list of filenames in an array. eg. ['img1.jpg', 'img2.png'...]
 * @param {*} bucket the bucket id that you wish to download from
 * @param {*} destination the local directory that you wish to download to
 */
async function downloadFromGCP(items, bucket, destination) {
  try {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      await storage
        .bucket(bucket)
        .file(item)
        .download({
          destination: `${destination}/${item}`
        })
    }
  } catch (err) {
    if (err) throw err
  }
}

/**
 * @function dirToZip
 * @description This function takes all the items in a directory and puts them into a zip file.
 * @param {*} source the source directory
 * @param {*} out the output zup file
 * @returns
 */
async function dirToZip(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 } })
  const stream = fs.createWriteStream(out)

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream)

    stream.on('close', () => resolve())
    archive.finalize()
  })
}

router.post('/', multer.single('image'), GCSUpload, (req, res) => {
  const title = req.file.originalname
  const filename = req.file.gcsName
  const url = req.file.gcsUrl

  const newImage = Image({
    title: title,
    filename: filename,
    url: url
  })

  newImage
    .save()
    .then(() => {
      console.log(`Image ${newImage._id} saved to database`)
      res.status(200).json(newImage)
    })
    .catch(err => {
      res.status(400).json({ err })
    })
})

router.get('/', (req, res) => {
  Image.find()
    .then(imgs => {
      res.status(200).json(imgs)
    })
    .catch(err => {
      res.status(400).json({ err })
    })
})

router.get('/download/:filename', async (req, res) => {
  try {
    if (!req.body.imageFilenames) {
      res.status(400).json({ msg: 'Requires files to be downloaded.' })
    }

    const genUUID = uuid()
    const destImages = `./temp/${genUUID}`
    const destZip = `./temp/zips/${genUUID}.zip`

    await ensureDirectory(destImages)
    await downloadFromGCP(
      req.body.imageFilenames,
      'cits3200-team24-images',
      destImages
    )
    await dirToZip(destImages, destZip)
    await res.download(
      destZip,
      `${req.params.filename ? req.params.filename : 'images'}.zip`
    )
  } catch (err) {
    if (err) {
      console.log(err)
      res.status(400).json({ err })
    }
  }
})

router.get('/:id', (req, res) => {
  Image.findOne({ _id: req.params.id })
    .then(img => {
      if (!img) {
        res.status(400).json({ msg: 'No project exists with the given id.' })
        return
      }
      res.status(200).json(img)
    })
    .catch(err => {
      res.status(400).json({ err })
    })
})

router.delete('/:id', (req, res) => {
  Image.findOne({ _id: req.params.id }).then(img => {
    if (!img) {
      res.status(400).json({ msg: 'No image exists with the given id.' })
      return
    }
    storage
      .bucket('cits3200-team24-images')
      .file(img.filename)
      .delete()
      .catch(err => {
        res.status(200).json({ err })
      })
    img
      .remove()
      .then(() => {
        console.log(`Image ${req.params.id} deleted.`)
        res.status(200).json({ mgs: `Image ${req.params.id} deleted.` })
      })
      .catch(err => {
        res.status(400).json({ err })
      })
  })
})

module.exports = router
