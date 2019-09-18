const config = require('../../config')
const router = require('express').Router()
const multer = require('../middleware/multer')
const GCSUpload = require('../middleware/gcsUpload')
const path = require('path')
const uuid = require('uuid/v4')

const { Storage } = require('@google-cloud/storage')
const storage = new Storage()

const videoModel = require('../models/videoModel')
const Video = require('mongoose').model(videoModel.modelName)

/**
 * Uploads a single image onto the Google Cloud Bucket 
 * and then uploads the video to the database
 */

router.post('/', multer.single('video'), GCSUpload, async (req, res) => {
    const { originalname: title, gcsName: filename, gcsUrl: url } = req.file
    try {
        const newVid = await new Video({ title, filename, url }).save()
        console.log(`Video ${newVid._id} has been saved to the database`)
        res.status(200).json(newVid)
    }
    catch (error) {
        res.status(400).json({ error })
    }
})

module.exports = router