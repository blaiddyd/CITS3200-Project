'use strict'

const imageRouter = require('./imageRouter')
const projectRouter = require('./projectRouter')
const progressRouter = require('./progressRouter')
const testRouter = require('./testRouter')
const router = require('express').Router()

router.use('/images', imageRouter)
router.use('/projects', projectRouter)
router.use('/progress', progressRouter)
router.use('/test', testRouter)

module.exports = router
