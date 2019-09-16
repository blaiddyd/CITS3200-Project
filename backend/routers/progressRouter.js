const router = require('express').Router()

const ObjectId = require('mongodb').ObjectId
const projectModel = require('../models/projectModel')
const videoModel = require('../models/videoModel')
const Project = require('mongoose').model(projectModel.modelName)
const Video = require('mongoose').model(videoModel.modelName)
const { modulesMap } = require('../../modules')

router.use(require('express').json())

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const project = await Project.findOne({ _id: id })

    if (!project) {
      return res
        .status(400)
        .json({ msg: 'No project exists with the given id.' })
    }

    // TODO: implement retrieving module base on request param
    const processor = modulesMap.get('Ecological Image Classification')
    const data = await processor.progress(project)

    res.status(200).json(data)
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
