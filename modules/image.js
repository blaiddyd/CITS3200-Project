const { Module, ProgressReport } = require('./base')
const annotateImages = require('../helpers/annotateImages')
const uuid = require('uuid/v4')
const path = require('path')
const ensureDirectory = require('../helpers/ensureDirectory')
const downloadFromGCP = require('../helpers/downloadFromGCP')
const dirToZip = require('../helpers/dirToZip')
const config = require('../config')
const resourceModel = require('../backend/models/resourceModel')
const Resource = require('mongoose').model(resourceModel.modelName)
var rimraf = require('rimraf')
const decrypt = require('../helpers/decrypt')

const resourceModule = new Module('Ecological resource Classification', {
  type: 'Vision',
  allowMultiple: true,
  extensions: '.jpeg,.png,.gif,.bmp,.webp,.raw,.ico,.pdf,.tiff,.jpg',
  downloadTypes: ['Animal', 'Blank'],
  task,
  progress,
  download
})

async function task(project) {
  const { apiKey, resourceIDs } = project
  const key = decrypt(apiKey)
  await annotateImages(key, resourceIDs)
}

async function progress(project) {
  const pendingURLs = []
  const animalURLs = []
  const blankURLs = []

  const { resourceIDs } = project
  for (const id of resourceIDs) {
    const resource = await Resource.findOne({ _id: id })
    if (resource.status === 'Pending') {
      pendingURLs.push(resource.url)
    } else if (resource.status === 'Parsed') {
      const { matched } = resource.result
      if (matched.indexOf('Animal') > -1) {
        animalURLs.push(resource.url)
      } else {
        blankURLs.push(resource.url)
      }
    }
  }

  const done = !pendingURLs.length
  const data = {
    pending: pendingURLs,
    animal: animalURLs,
    blank: blankURLs
  }
  return new ProgressReport({ done, data })
}

async function download(project, type) {
  const genUUID = uuid()
  const directory = path.join(__dirname, `./temp/${genUUID}`)
  const zipName = path.resolve(__dirname, `./temp/${genUUID}.zip`)
  await ensureDirectory(directory)

  const { resourceIDs } = project
  const resources = []
  await Promise.all(
    resourceIDs.map(async id => {
      const resource = await Resource.findOne({ _id: id })
      if (!resource) return

      const { matched } = resource.result
      if (type === 'Blank') {
        if (matched.length === 0) {
          resources.push(resource.filename)
        }
        return
      }
      if (matched.includes(type)) {
        resources.push(resource.filename)
      }
    })
  )

  await downloadFromGCP(resources, config.storage.bucket, directory)
  await dirToZip(directory, zipName)
  rimraf.sync(directory)
  return zipName
}

module.exports = resourceModule
