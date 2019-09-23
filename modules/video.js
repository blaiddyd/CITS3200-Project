const Module = require('./base')
const videoModel = require('../backend/models/videoModel')
const Video = require('mongoose').model(videoModel.modelName)
const annotateVideo = require('../helpers/annotateVideo')

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
  const { apiKey, videoID } = project
  await annotateVideo(apiKey, videoID)
}
async function progress(project) {
  const videoId = project.videoID
  const currentVideo = await Video.findOne({ _id: videoId })
  const done = currentVideo.status === 'Parsed'
  return { done }
}
async function download(project) {
  const video = await Video.findOne({ _id: project.videoID })
  return video.result
}

module.exports = VideoModule
