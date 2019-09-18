'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VideoStatus = {
  pending: 'Pending',
  parsed: 'Parsed'
}

const VideoSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },

    filename: {
      type: String,
      required: true
    },

    url: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: Object.values(VideoStatus),
      required: true,
      default: VideoStatus.pending
    }
  },
  {
    timestamps: true
  }
)

const Video = mongoose.model('video', VideoSchema)

module.exports = Video
module.VideoStatus = VideoStatus
