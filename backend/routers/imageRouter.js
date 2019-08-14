'use strict'

const config = require('../../config')
const router = require('express').Router()
const multer = require('../middleware/multer')
const GCSUpload = require('../middleware/gcsUpload')
const path = require('path')

const { Storage } = require('@google-cloud/storage')
const storage = new Storage()

const ensureDirectory = require('../../helpers/ensureDirectory')
const downloadFromGCP = require('../../helpers/downloadFromGCP')
const dirToZip = require('../../helpers/dirToZip')

const uuid = require('uuid/v4')

const imageModel = require('../models/imageModel')
const Image = require('mongoose').model(imageModel.modelName)

router.post('/', multer.single('image'), GCSUpload, async (req, res) => {
  const { originalname: title, gcsName: filename, gcsUrl: url } = req.file
  try {
    const newImage = await Image({ title, filename, url }).save()
    console.log(`Image ${newImage._id} saved to database`)
    res.status(200).json(newImage)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get('/', async (req, res) => {
  try {
    const images = await Image.find()
    res.status(200).json(images)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get('/download/:filename', async (req, res) => {
  try {
    const { imageFilenames } = req.body
    const { filename = 'images' } = req.params
    if (!imageFilenames) {
      return res.status(400).json({ msg: 'Requires files to be downloaded.' })
    }

    const genUUID = uuid()
    // absolute path to root/temp/uuid
    const directory = path.join(__dirname, '../../', `temp/${genUUID}`)
    // absolute path to root/temp/zips/uuid.zip
    const zipName = path.join(__dirname, '../../', `temp/zips/${genUUID}.zip`)

    await ensureDirectory(directory)
    await downloadFromGCP(imageFilenames, config.storage.bucket, directory)
    await dirToZip(directory, zipName)
    await res.download(zipName, `${filename}.zip`)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const image = await Image.findOne({ _id: req.params.id })
    if (!image) {
      return res.status(400).json({ msg: 'No image exists with the given id.' })
    }
    res.status(200).json(image)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findOne({ _id: req.params.id })
    if (!image) {
      return res.status(400).json({ msg: 'No image exists with the given id.' })
    }

    // remove image from the database and from storage concurrently
    await Promise.all([
      storage
        .bucket(config.storage.bucket)
        .file(image.filename)
        .delete(),
      image.remove()
    ])

    console.log(`Image ${req.params.id} deleted.`)
    res.status(200).json({ mgs: `Image ${req.params.id} deleted.` })
  } catch (error) {
    res.status(400).json({ error })
  }
})

module.exports = router
