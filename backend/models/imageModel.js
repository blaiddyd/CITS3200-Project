'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema(
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
    matched: {
      type: Array,
      required: true,
      default: []
    },
    status: {
      type: String,
      enum: ['Pending', 'Parsed'],
      required: true,
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
)

const Image = mongoose.model('image', ImageSchema)

module.exports = Image
