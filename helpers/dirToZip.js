const fs = require('fs')
const archiver = require('archiver')

/**
 * @function dirToZip
 * @description This function takes all the items in a directory and puts them into a zip file.
 * @param {*} source the source directory
 * @param {*} out the output zup file
 * @returns
 */
async function dirToZip(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 } })
  const stream = fs.createWriteStream(out)

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream)

    stream.on('close', () => resolve())
    archive.finalize()
  })
}

module.exports = dirToZip
