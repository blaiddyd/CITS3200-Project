'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ResourceStatus = {
  pending: 'Pending',
  parsed: 'Parsed'
}

const ResourceSchema = new Schema(
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
    result: {
      type: Object,
      required: true,
      default: {}
    },
    status: {
      type: String,
      enum: Object.values(ResourceStatus),
      required: true,
      default: ResourceStatus.pending
    }
  },
  {
    timestamps: true
  }
)

const Resource = mongoose.model('resource', ResourceSchema)

module.exports = Resource
exports.ResourceStatus = ResourceStatus
