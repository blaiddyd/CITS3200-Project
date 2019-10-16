const path = require('path')
const fs = require('fs')
const { Module, ProgressReport } = require('./base')
const resourceModel = require('../backend/models/resourceModel')
const Resource = require('mongoose').model(resourceModel.modelName)
const makeAudioText = require('../helpers/makeAudioText')



const AudioModule = new Module('Audio Transcription', {
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
  const id = project.resourceIDs[0]
  const resource = await Resource.findOne({ _id: id })
  const transcript = makeAudioText(resource.result);
  const filePath = path.resolve(`./temp/${resource._id}.txt`)
  

  /*
  const filePath = path.resolve(`./temp/stub.txt`)
  fs.writeFileSync(filePath, 'Not yet implemented')
  return filePath
  */
}

module.exports = AudioModule
