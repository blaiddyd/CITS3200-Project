'use strict'

const imageRouter = require('./imageRouter')
const projectRouter = require('./projectRouter')
const progressRouter = require('./progressRouter')
const videoRouter = require('./videoRouter')
const moduleRouter = require('./moduleRouter')
const router = require('express').Router()

router.use('/images', imageRouter)
router.use('/projects', projectRouter)
router.use('/modules', moduleRouter)
router.use('/progress', progressRouter)
router.use('/video', videoRouter)

module.exports = router
