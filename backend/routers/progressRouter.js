const ObjectId = require('mongodb').ObjectId
const router = require('express').Router()

const projectModel = require('../models/projectModel')
const imageModel = require('../models/imageModel')
const Project = require('mongoose').model(projectModel.modelName)
const Image = require('mongoose').model(imageModel.modelName)

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
    var imgIds = []
    imgIds = currentProject.imageIDs

    for (const val of imgIds) {
      var img = new ObjectId(val)
      const currentImage = await Image.findOne({ _id: img })
      if (currentImage.status === 'Pending') {
        pendingURLs.push(currentImage.url)
      } else if (currentImage.status === 'Parsed') {
        if (currentImage.matched === 'Animal') {
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
    res.status(400).json({ error })
  }
})

module.exports = router
