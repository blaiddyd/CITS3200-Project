'use strict'

const router = require('express').Router()
const multer = require('../middleware/multer')
const GCSUpload = require('../middleware/gcsUpload')

const annotateVideo = require('../../helpers/annotateVideo')
const videoGetTxt = require('../../helpers/videoGetTxt')
const videoGetCsv = require('../../helpers/videoGetCsv')

const videoModel = require('../models/videoModel')
const Video = require('mongoose').model(videoModel.modelName)

/**
 * Uploads a single image onto the Google Cloud Bucket
 * and then uploads the video to the database
 */

router.post('/', multer.single('video'), GCSUpload, async (req, res) => {
  const { originalname: title, gcsName: filename, gcsUrl: url } = req.file
  try {
    const newVid = await new Video({ title, filename, url }).save()
    console.log(`Video ${newVid._id} has been saved to the database`)
    res.status(200).json(newVid)
  } catch (error) {
    res.status(400).json({ error })
  }
})

/**
 * annotates an image with a given id and api key, and sends a text file with all the labels
 */

router.get('/get_text', async (req, res) => {
  const { id, apiKey } = req.body
  const video = await Video.findOne({ _id: id })

  if (!video) {
    console.log(`No video with ID ${video._id} exists`)
    res.status(400).json({ msg: `No video with ID ${video._id} exists` })
    return
  }

  try {
    const labels = await annotateVideo(video._id, apiKey)
    const text = videoGetTxt(labels)

    res.set({
      'Content-Disposition': 'attachment; filename="out.txt"',
      'Content-Type': 'text/plain'
    })
    res.send(text)
  } catch (error) {
    res.status(400).json({ error })
  }
})


/**
 * annotates an image with a given api key and send back the results as a csv file
 */
router.get('/get_csv', async (req, res) => {
  const { id, apiKey } = req.body
  const video = await Video.findOne({ _id: id })

  if (!video) {
    console.log(`No video with ID ${video._id} exists`)
    res.status(400).json({ msg: `No video with ID ${video._id} exists` })
    return
  }

  try {
    const labels = await annotateVideo(video._id, apiKey)
    const csv = videoGetCsv(labels)
    res.set({
      'Content-Disposition': 'attachment; filename="out.csv"',
      'Content-Type': 'text/csv'
    })
    res.send(csv)
  } catch (error) {
    res.status(400).json({ error })
  }
})

module.exports = router
