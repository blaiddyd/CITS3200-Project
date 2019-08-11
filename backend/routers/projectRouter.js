'use strict'

const router = require('express').Router()

const Project = require('mongoose').model('project')

router.use(require('express').json())

router.get('/', (req, res) => {
  Project.find()
    .then(projects => {
      res.status(200).json(projects)
    })
    .catch(err => {
      res.status(400).json({ err })
    })
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

router.post('/', (req, res) => {
  const newTitle = req.body.title
    ? req.body.title
    : res.status(400).json({ msg: 'Missing project title.' })

  const newProject = new Project({ title: newTitle })

  newProject
    .save()
    .then(project => {
      console.log(`Project ${project._id} created.`)
      res.status(200).json(project)
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({ err })
    })
})

router.get('/:id', (req, res) => {
  Project.findOne({ _id: req.params.id })
    .then(project => {
      res.status(200).json({ project })
    })
    .catch(err => {
      res.status(400).json({ err })
    })
})

router.put('/:id', (req, res) => {
  Project.findOne({ _id: req.params.id }).then(project => {
    if (!project) {
      res.status(400).json({ msg: 'No project exists with the given id.' })
      return
    }

    project.title = req.body.title ? req.body.title : project.title
    project.imageIDs = req.body.imageIDs ? req.body.imageIDs : project.imageIDs
    project
      .save()
      .then(project => {
        console.log(`Project ${req.params.id} updated.`)
        res.status(200).json(project)
      })
      .catch(err => {
        res.status(400).json({ err })
      })
  })
})

router.delete('/:id', (req, res) => {
  Project.findOne({ _id: req.params.id }).then(project => {
    if (!project) {
      res.status(400).json({ msg: 'No project exists with the given id.' })
      return
    }
    project
      .remove()
      .then(() => {
        console.log(`Project ${req.params.id} deleted.`)
        res.status(200).json({ mgs: `Project ${req.params.id} deleted.` })
      })
      .catch(err => {
        res.status(400).json({ err })
      })
  })
})

module.exports = router
