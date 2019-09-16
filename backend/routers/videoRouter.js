const config = require('../../config')
const router = require('express').Router()
const multer = require('../middleware/multer')
const GCSUpload = require('../middleware/gcsUpload')
const path = require('path')
const uuid = require('uuid/v4')

const { Storage } = require('@google-cloud/storage')
const storage = new Storage()

router.post('/', multer.single('video'), GCSUpload, async (req, res) => {

})

module.exports = router