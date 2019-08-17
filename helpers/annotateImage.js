const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient()

/**
 * @function annotateImage
 * @description This function annotates an image and returns the matches
 * @param {string} uri This is a URI string linking to the image to be parsed
 * @param {number} minScore The minimum score that is considered a match
 * @returns an array of matches consisting of {name, score} match items
 */
async function annotateImage(uri, minScore = 0.65) {
  try {
    const [result] = await client.annotateImage({
      image: { source: { imageUri: uri } },
      features: [{ type: 'OBJECT_LOCALIZATION' }]
    })

    return result.localizedObjectAnnotations
      .filter(match => match.score >= minScore)
      .map(match => ({
        name: match.name,
        score: match.score
      }))
  } catch (e) {
    if (e) throw e
  }
}

module.exports = annotateImage
