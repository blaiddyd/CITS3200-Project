const video = require('@google-cloud/video-intelligence').v1
const Video = require('../backend/models/videoModel')

/**
 * @function annotateVideo
 * @description This function annotates a video
 * @param {object} apiKey the GCP API key object
 * @param {string} videoID id of the video on the database
 * @returns
 */
async function annotateVideo(apiKey, videoID) {
  try {
    const record = await Video.findOne({ _id: videoID })
    // Creates a client
    const client = new video.VideoIntelligenceServiceClient({ apiKey })
    // optional authentication parameters

    const request = {
      inputUri: record.url,
      features: ['LABEL_DETECTION']
      // can also specify outputUri here. result will be stored as a .json
    }

    // Detects labels in a video
    const [operation] = await client.annotateVideo(request)
    console.log('Waiting for operation to complete...')
    const [operationResult] = await operation.promise()

    // Gets annotations for video
    const annotations = operationResult.annotationResults[0]

    const labels = annotations.segmentLabelAnnotations

    record.status = 'Parsed'
    record.result = labels

    await record.save()

    return labels
  } catch (e) {
    if (e) throw e
  }
}
module.exports = annotateVideo
