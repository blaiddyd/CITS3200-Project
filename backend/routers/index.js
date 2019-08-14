'use strict'

const imageRouter = require('./imageRouter')
const projectRouter = require('./projectRouter')
const router = require('express').Router()

router.use('/images', imageRouter)
router.use('/projects', projectRouter)

module.exports = router
