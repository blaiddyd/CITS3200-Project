const video = require('@google-cloud/video-intelligence').v1
const Video = require('../backend/models/videoModel')
const fs = require('fs')
const path = require('path')
const ensureDir = require('../helpers/ensureDirectory')
const getVideoCsv = require('../helpers/videoGetCsv')
const uuid = require('uuid/v4')

/**
 * @function annotateVideo
 * @description This function annotates a video
 * @param {object} apiKey the GCP API key object
 * @param {string} videoID id of the video on the database
 * @returns
 */
async function annotateVideo(apiKey, videoID) {
  const directory = path.join(__dirname, '/temp/')
  const filename = `${uuid()}.json`
  await ensureDir(directory)
  const keyFilename = path.join(directory, filename)
  fs.writeFileSync(keyFilename, apiKey)

  try {
    const record = await Video.findOne({ _id: videoID })
    // Creates a client
    const client = new video.VideoIntelligenceServiceClient({ keyFilename })
    console.log('client created')
    // optional authentication parameters

    const uri = record.url.replace('https://storage.googleapis.com/', 'gs://')

    const request = {
      inputUri: uri,
      features: ['LABEL_DETECTION']
      // can also specify outputUri here. result will be stored as a .json
    }

    // Detects labels in a video
    client.annotateVideo(request)
    const [operation] = await client.annotateVideo(request)
    console.log('Waiting for operation to complete...')
    const [operationResult] = await operation.promise()
    console.log('operation completed')

    // Gets annotations for video
    const annotations = operationResult.annotationResults[0]
    console.log('annotation completed')

    const labels = annotations.shotLabelAnnotations

    record.status = 'Parsed'
    record.result = getVideoCsv(labels)
    console.log(record.result)

    await record.save()

    console.log('video annotation completed for video id', record._id)

    return labels
  } catch (e) {
    console.error(e)
    if (e) throw e
  }
}
module.exports = annotateVideo
