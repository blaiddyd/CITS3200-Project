'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProjectSchema = new Schema(
  {
    resourceIDs: {
      type: Array,
      required: true,
      default: []
    },
    apiKey: {
      type: JSON,
      required: false
    }
  },
  {
    timestamps: true
  }
)

const Project = mongoose.model('project', ProjectSchema)

module.exports = Project
