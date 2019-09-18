'use strict'

const router = require('express').Router()
const multer = require('../middleware/multer')
const GCSUpload = require('../middleware/gcsUpload')

const annotateVideo = require('../../helpers/annotateVideo')
const videoGetTxt = require('../../helpers/videoGetTxt')
const videoGetCsv = require('../../helpers/videoGetCsv')

const videoModel = require('../models/videoModel')
const Video = require('mongoose').model(videoModel.modelName)
const projectModel = require('../models/projectModel')
const Project = require('mongoose').model(projectModel.modelName)

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

router.get('/get_text/:id', async (req, res) => {
  const { id } = req.params
  const project = await Project.findOne({ _id: id })

  if (!project)
    return res.status(400).json({ error: `No project with id ${id} found` })
  if (!project.videoID)
    return res
      .status(400)
      .json({ error: `Project ${id} is not a video project` })

  const video = await Video.findOne({ _id: project.videoID })

  if (!video) {
    console.log(`No video with ID ${video._id} exists`)
    res.status(400).json({ msg: `No video with ID ${video._id} exists` })
    return
  }

  try {
    const labels = await annotateVideo(project.apiKey, video._id)
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

router.get('/get_csv/:id', async (req, res) => {
  const { id } = req.params
  const project = await Project.findOne({ _id: id })

  if (!project)
    return res.status(400).json({ error: `No project with id ${id} found` })
  if (!project.videoID)
    return res
      .status(400)
      .json({ error: `Project ${id} is not a video project` })

  const video = await Video.findOne({ _id: project.videoID })

  if (!video) {
    console.log(`No video with ID ${video._id} exists`)
    res.status(400).json({ msg: `No video with ID ${video._id} exists` })
    return
  }

  try {
    const labels = await annotateVideo(project.apiKey, video._id)
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
