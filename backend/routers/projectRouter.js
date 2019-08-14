'use strict'

const router = require('express').Router()

const projectModel = require('../models/projectModel')
const Project = require('mongoose').model(projectModel.modelName)

router.use(require('express').json())

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
    res.status(200).json(projects)
  } catch (error) {
    res.status(400).json({ error })
  }
})

/* DELETE ALL PROJECTS ROUTE
router.delete("/", (req, res) => {
  Project.find()
    .then((projects) => {
      projects.forEach((project) => {
        project.remove().then(() => {
          console.log(`Project ${project._id} deleted.`);
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ err });
    });
});
*/

router.post('/', async (req, res) => {
  try {
    const { title } = req.body

    if (!title) return res.status(400).json({ msg: 'Missing project title.' })
    const project = await new Project({ title }).save()

    console.log(`Project ${project._id} created.`)
    res.status(200).json(project)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const project = await Project.findOne({ _id: id })
    res.status(200).json({ project })
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, imageIDs } = req.body

    const project = await Project.findOne({ _id: id })
    if (!project) {
      return res
        .status(400)
        .json({ msg: 'No project exists with the given id.' })
    }

    if (title) project.title = title
    if (imageIDs) project.imageIDs = imageIDs

    const newProject = project.save()
    console.log(`Project ${id} updated.`)
    res.status(200).json(newProject)
  } catch (error) {
    res.status(400).json({ error })
  }
})

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

module.exports = router
