'use strict'

const router = require('express').Router()
router.use(require('express').json())

const config = require('../../config')
const multer = require('../middleware/multer')
const GCSUpload = require('../middleware/gcsUpload')
const uuid = require('uuid/v4')
const path = require('path')

const Project = require('mongoose').model('project')
const Image = require('mongoose').model('image')
const videoModel = require('../models/videoModel')
const Video = require('mongoose').model(videoModel.modelName)

const ensureDirectory = require('../../helpers/ensureDirectory')
const downloadFromGCP = require('../../helpers/downloadFromGCP')
const dirToZip = require('../../helpers/dirToZip')

const annotateImages = require('../../helpers/annotateImages')
const annotateVideo = require('../../helpers/annotateVideo')

router.use(require('express').json())

/* 
    This route gets all projects from MongoDB
    inp => A GET request to the route
    out => All saved projects on MongoDB
*/
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
    res.status(200).json(projects)
  } catch (error) {
    res.status(400).json({ error })
  }
})

/* 
    This route adds a single project to MongoDB
    inp => A POST request with req.body.title
    out => The saved Project on MongoDB
*/
router.post('/', async (req, res) => {
  try {
    const { title, apiKey } = req.body

    if (!title) return res.status(400).json({ msg: 'Missing project title.' })
    const project = await new Project({ title, apiKey }).save()

    console.log(`Project ${project._id} created.`)
    res.status(200).json(project)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

/* 
    This route uploads a single image to GCS and adds it to a project ID
    inp => A request, with an image item connected to the body key of "image"
    out => The saved Image model on MongoDB
*/
router.post('/:id', multer.single('image'), GCSUpload, async (req, res) => {
  const { originalname: title, gcsName: filename, gcsUrl: url } = req.file
  try {
    const currentProj = await Project.findOne({ _id: req.params.id })
    if (!currentProj) {
      res.status(400).json({ msg: 'Invalid project ID.' })
      return
    }
    const newImage = await new Image({ title, filename, url }).save()
    currentProj.imageIDs.push(newImage._id)
    await currentProj.save()
    console.log(`Image ${newImage._id} saved to project ${req.params.id}`)
    res.status(200).json(newImage)
  } catch (error) {
    res.status(400).json({ error })
  }
})

/**
 * This router uploads a single video to GCS and adds it with the project key
 */
router.post(
  '/:id/video',
  multer.single('video'),
  GCSUpload,
  async (req, res) => {
    const { originalname: title, gcsName: filename, gcsUrl: url } = req.file
    try {
      const project = await Project.findOne({ _id: req.params.id })
      if (!project) {
        res.status(400).json({ msg: 'Invalid project ID. ' })
        return
      }

      const newVid = await new Video({ title, filename, url }).save()
      project.videoID = newVid._id
      const newP = await project.save()
      console.log(url, newVid._id, newP.videoID)
      console.log(`Video ${newVid._id} saved to project ${req.params.id}`)
      res.status(200).json(newVid)
    } catch (err) {
      res.status(400).json({ err })
    }
  }
)

/* 
    This route gets a single project from MongoDB
    inp => A GET request, with the id as parameter
    out => The saved project on MongoDB with the id
*/
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const project = await Project.findOne({ _id: id })
    res.status(200).json({ project })
  } catch (error) {
    res.status(400).json({ error })
  }
})

/* 
    This route updates an image model on MongoDB
    inp => A request, with body {title, ImageIDs} and parameters { id }
    out => The saved Image model on MongoDB
*/
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, imageIDs, apiKey } = req.body

    console.log(imageIDs)

    const project = await Project.findOne({ _id: id })
    if (!project) {
      return res
        .status(400)
        .json({ msg: 'No project exists with the given id.' })
    }

    if (title) project.title = title
    if (imageIDs) project.imageIDs = imageIDs
    if (apiKey) project.apiKey = apiKey

    const newProject = project.save()
    console.log(`Project ${id} updated.`)
    res.status(200).json(newProject)
  } catch (error) {
    res.status(400).json({ error })
  }
})
/* 
    This route deletes a project from MongoDB
    inp => A DELETE request to this route with id as param
    out => A success or error message
*/
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const project = Project.findOne({ _id: id })
    if (!project) {
      return res
        .status(400)
        .json({ msg: 'No project exists with the given id.' })
    }
    await project.remove()
    console.log(`Project ${id} deleted.`)
    res.status(200).json({ mgs: `Project ${id} deleted.` })
  } catch (error) {
    res.status(400).json({ error })
  }
})

/* 
    This route annotates a single project.
    inp => A GET request to this route with param = ID
    out => The updated image model
*/
router.get('/annotate/:id', async (req, res) => {
  try {
    const proj = await Project.findOne({ _id: req.params.id })
    if (!proj) {
      return res
        .status(400)
        .json({ msg: 'No project exists with the given id.' })
    }

    const { apiKey, imageIDs, videoID } = proj

    // NOTE: not await to run in background
    if (imageIDs) annotateImages(apiKey, imageIDs)
    if (videoID) annotateVideo(apiKey, videoID)

    res.json({ msg: `Annotating project ${req.params.id} in the background.` })
  } catch (error) {
    res.status(400).json({ error })
  }
})

/* 
    This route downloads all the images from a project which match the param.
    inp => A GET request to this route with param = match type
    out => A zip file of matches
*/
router.get('/download/:id/:match', async (req, res) => {
  try {
    const proj = await Project.findOne({ _id: req.params.id })
    if (!proj) {
      res.status(400).json({ msg: 'Project ID not found.' })
    }

    const genUUID = uuid()
    // absolute path to root/temp/uuid
    const directory = path.join(__dirname, '../../', `temp/${genUUID}`)
    // absolute path to root/temp/zips/uuid.zip
    const zipName = path.join(__dirname, '../../', `temp/${genUUID}.zip`)
    await ensureDirectory(directory)

    const imageIDs = proj.imageIDs
    const imageFilenames = []
    await Promise.all(
      imageIDs.map(async id => {
        const image = await Image.findOne({ _id: id })
        if (!image) {
          return
        }
        if (req.params.match === 'Blank') {
          if (image.matched.length === 0) {
            imageFilenames.push(image.filename)
          }
          return
        }
        if (image.matched.includes(req.params.match)) {
          imageFilenames.push(image.filename)
        }
      })
    )

    await downloadFromGCP(imageFilenames, config.storage.bucket, directory)
    await dirToZip(directory, zipName)
    await res.download(zipName, `${req.params.match}.zip`)
  } catch (error) {
    res.status(400).json({ error })
  }
})

module.exports = router
