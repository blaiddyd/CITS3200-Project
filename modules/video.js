const { Module, ProgressReport } = require('./base')
const resourceModel = require('../backend/models/resourceModel')
const Resource = require('mongoose').model(resourceModel.modelName)
const annotateVideo = require('../helpers/annotateVideo')
const path = require('path')
const fs = require('fs')
const decrypt = require('../../helpers/decrypt')

const VideoModule = new Module('Video Intelligence', {
  type: 'Video',
  allowMultiple: false,
  extensions: '.mp4,.mov,.mpeg4,.avi',
  downloadTypes: ['Objects'],
  task,
  progress,
  download
})

async function task(project) {
  const { apiKey, resourceIDs } = project
  const key = decrypt(apiKey)
  await annotateVideo(key, resourceIDs[0])
}
async function progress(project) {
  const id = project.resourceIDs[0]
  const resource = await Resource.findOne({ _id: id })
  const done = resource.status === 'Parsed'
  return new ProgressReport({ done })
}
async function download(project) {
  const id = project.resourceIDs[0]
  const resource = await Resource.findOne({ _id: id })
  const filePath = path.resolve(`./temp/${resource._id}.csv`)
  fs.writeFileSync(filePath, resource.result)
  return filePath
}

module.exports = VideoModule
