const video = require('@google-cloud/video-intelligence').v1
const Project = require('mongoose').model('project')

/**
 * @function annotateVideo
 * @description This function annotates a video
 * @param {string} uri This is a URI string linking to the image to be parsed
 * @returns
 */
async function annotateVideo(gcsUri) {
  try {
    const proj = await Project.findOne({ _id: '5d5cfc79f8f447106713d6e3' })
    const apiKey = proj.apiKey
    // Creates a client
    const client = new video.VideoIntelligenceServiceClient({ apiKey })
    // optional authentication parameters

    const request = {
      inputUri: gcsUri,
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

    return labels
  } catch (e) {
    if (e) throw e
  }
}
module.exports = annotateVideo
