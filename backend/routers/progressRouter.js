const ObjectId = require('mongodb').ObjectId
const router = require('express').Router()

const projectModel = require('../models/projectModel')
const imageModel = require('../models/imageModel')
const videoModel = require('../models/videoModel')
const Project = require('mongoose').model(projectModel.modelName)
const Image = require('mongoose').model(imageModel.modelName)
const Video = require('mongoose').model(videoModel.modelName)

router.use(require('express').json())

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const currentProject = await Project.findOne({ _id: id })

    if (!currentProject) {
      return res
        .status(400)
        .json({ msg: 'No project exists with the given id.' })
    }

    var pendingURLs = []
    var animalURLs = []
    var blankURLs = []

    const imgIds = currentProject.imageIDs
    for (const val of imgIds) {
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

    var returnProgress = {
      pending: pendingURLs,
      animal: animalURLs,
      blank: blankURLs
    }
    res.status(200).json(returnProgress)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error })
  }
})

router.get('/:id/video', async (req, res) => {
  const { id } = req.params
  const project = await Project.findOne({ _id: id })
  if (!project) {
    return res.status(400).json({ msg: 'No project exists with the given id.' })
  }
  try {
    const videoId = project.videoID
    const currentVideo = await Video.findOne({ _id: videoId })
    res.status(200).json({ video: currentVideo, status: currentVideo.status })
  } catch (error) {
    console.error(error)
    res.status(400).json({ error })
  }
})

module.exports = router
