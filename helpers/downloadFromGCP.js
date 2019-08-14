const { Storage } = require('@google-cloud/storage')
const storage = new Storage()

/**
 * @function downloadFromGCP
 * @description this function downloads a list of items from a GCP bucket name, given a
 *              destination directory.
 * @param {*} items a list of filenames in an array. eg. ['img1.jpg', 'img2.png'...]
 * @param {*} bucket the bucket id that you wish to download from
 * @param {*} destination the local directory that you wish to download to
 */
async function downloadFromGCP(items, bucket, destination) {
  try {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      await storage
        .bucket(bucket)
        .file(item)
        .download({
          destination: `${destination}/${item}`
        })
    }
  } catch (err) {
    if (err) throw err
  }
}

module.exports = downloadFromGCP
