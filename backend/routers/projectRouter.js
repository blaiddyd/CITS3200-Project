'use strict'

const router = require('express').Router()
router.use(require('express').json())

const multer = require('../middleware/multer')
const GCSUpload = require('../middleware/gcsUpload')
const Project = require('mongoose').model('project')
const Resource = require('mongoose').model('resource')
const { modulesMap } = require('../../modules')
const fs = require('fs')

router.use(require('express').json())

/* 
    This route adds a single project to MongoDB
    inp => A POST request with req.body.title
    out => The saved Project on MongoDB
*/
router.post('/', async (req, res) => {
  try {
    const { apiKey } = req.body
    const project = await new Project({ apiKey }).save()
    console.log(`Project ${project._id} created.`)
    res.status(200).json(project)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error })
  }
})

/* 
    This route uploads a single image to GCS and adds it to a project ID
    inp => A request, with an image item connected to the body key of "image"
    out => The saved Image model on MongoDB
*/
router.post('/:id', multer.single('resource'), GCSUpload, async (req, res) => {
  const { originalname: title, gcsName: filename, gcsUrl: url } = req.file
  try {
    const { id } = req.params
    const project = await Project.findOne({ _id: id })
    if (!project) return res.status(400).json({ msg: 'Invalid project ID.' })

    const resource = await new Resource({ title, filename, url }).save()
    project.resourceIDs.push(resource._id)
    await project.save()
    console.log(`Resource ${resource._id} saved to project ${id}`)
    res.status(200).json(resource)
  } catch (error) {
    res.status(400).json({ error })
  }
})

/* 
    This route annotates a single project.
    inp => A GET request to this route with param = ID
    out => The updated image model
*/
router.get('/annotate/:id/:slug', async (req, res) => {
  try {
    const { id, slug } = req.params
    const project = await Project.findOne({ _id: id })
    if (!project) {
      return res
        .status(400)
        .json({ msg: 'No project exists with the given id.' })
    }

    // NOTE: not await to run in background
    const processor = modulesMap.get(slug)
    processor.process(project)

    res.json({ msg: `Annotating project ${id} in the background.` })
  } catch (error) {
    console.error(error)
    res.status(400).json({ error })
  }
})

/* 
    This route downloads all the images from a project which match the param.
    inp => A GET request to this route with param = match type
    out => A zip file of matches
*/
router.get('/download/:id/:slug/:type', async (req, res) => {
  try {
    const { id, slug, type } = req.params
    const project = await Project.findOne({ _id: id })
    if (!project) return res.status(400).json({ msg: 'Project ID not found.' })

    const processor = modulesMap.get(slug)
    const filename = await processor.download(project, type)

    console.log('downloading', filename)

    res.download(filename, () => {
      fs.unlinkSync(filename)
    })
  } catch (error) {
    console.error(error)
    res.status(400).json({ error })
  }
})

module.exports = router
