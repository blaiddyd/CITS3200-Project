const fsPromises = require('fs').promises

/**
 * @function ensureDirectory
 * @description this ensures that the directory and all parent directories are created.
 * @param {*} dirPath the directory you wish to ensure
 */
async function ensureDirectory(dirPath) {
  try {
    await fsPromises.mkdir(dirPath, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

module.exports = ensureDirectory
