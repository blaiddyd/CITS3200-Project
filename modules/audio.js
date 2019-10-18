const { Module, ProgressReport } = require('./base')
const resourceModel = require('../backend/models/resourceModel')
const Resource = require('mongoose').model(resourceModel.modelName)
const path = require('path')
const fs = require('fs')
const analyseAudio = require('../helpers/analyseAudio')
const decrypt = require('../helpers/decrypt')

const AudioModule = new Module('Audio Transcription', {
  type: 'Audio',
  allowMultiple: false,
  extensions: '.flac,.ogg,.wav',
  downloadTypes: ['Transcription'],
  task,
  progress,
  download
})

/** @stub Implement processing functionality */
async function task(project) {
  const { apiKey, resourceIDs } = project
  const key = decrypt(apiKey)
  await analyseAudio(key, resourceIDs[0])
}

/** @stub Implements progress report */
async function progress(project) {
  const id = project.resourceIDs[0]
  const resource = await Resource.findOne({ _id: id })
  const done = resource.status === 'Parsed'

  return new ProgressReport({ done })
}

/** @stub Implements download function */
async function download(project) {
  const id = project.resourceIDs[0]
  const resource = await Resource.findOne({ _id: id })
  const filePath = path.resolve(`./temp/${resource._id}.txt`)
  fs.writeFileSync(filePath, resource.result.transcription)
  return filePath
}

module.exports = AudioModule
