const { Module, ProgressReport } = require('./base')
const path = require('path')
const fs = require('fs')

const VideoModule = new Module('Audio Transcription', {
  type: 'Audio',
  allowMultiple: false,
  extensions: '.mp3,.flac,.ogg,.wav',
  downloadTypes: ['Transcription'],
  task,
  progress,
  download
})

/** @stub Implement processing functionality */
async function task(project) {}

/** @stub Implements progress report */
async function progress(project) {
  const done = false
  return new ProgressReport({ done })
}

/** @stub Implements download function */
async function download(project) {
  const filePath = path.resolve(`./temp/stub.txt`)
  fs.writeFileSync(filePath, 'Not yet implemented')
  return filePath
}

module.exports = VideoModule
