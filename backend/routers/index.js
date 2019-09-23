'use strict'

const projectRouter = require('./projectRouter')
const progressRouter = require('./progressRouter')
const moduleRouter = require('./moduleRouter')
const router = require('express').Router()

router.use('/modules', moduleRouter)
router.use('/projects', projectRouter)
router.use('/progress', progressRouter)

module.exports = router
