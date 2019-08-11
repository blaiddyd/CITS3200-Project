'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    imageIDs: {
      type: Array,
      required: true,
      default: []
    }
  },
  {
    timestamps: true
  }
)

const Project = mongoose.model('project', ProjectSchema)

module.exports = Project
