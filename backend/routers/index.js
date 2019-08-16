'use strict'

const imageRouter = require('./imageRouter')
const projectRouter = require('./projectRouter')
const progressRouter = require('./progressRouter')
const router = require('express').Router()

router.use('/images', imageRouter)
router.use('/projects', projectRouter)
router.use('/progress', progressRouter)

module.exports = router
