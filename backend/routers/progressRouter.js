const router = require('express').Router()

const { ProgressReport } = require('../../modules/base')
const projectModel = require('../models/projectModel')
const Project = require('mongoose').model(projectModel.modelName)
const { modulesMap } = require('../../modules')

router.use(require('express').json())

router.get('/:id/:slug', async (req, res) => {
  try {
    const { id, slug } = req.params
    const project = await Project.findOne({ _id: id })

    if (!project) {
      return res
        .status(400)
        .json({ msg: 'No project exists with the given id.' })
    }

    const processor = modulesMap.get(slug)
    const data = await processor.progress(project)

    if (!(data instanceof ProgressReport))
      throw new Error(
        'You must return a ProgressReport object from the progress function'
      )

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error })
  }
})

module.exports = router
