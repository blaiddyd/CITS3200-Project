const slugify = require('slugify')

class Module {
  validate(name, options) {
    if (!name) throw new Error('A module name must be specified')
    const { task, progress, download, extensions, downloadTypes } = options
    if (!extensions)
      throw new Error('An array of allowed file extensions must be provided')
    if (!task) throw new Error('A module processing method must be specified')
    if (!progress) throw new Error('A module progress method must be specified')
    if (!download) throw new Error('A module download method must be specified')
    if (!downloadTypes)
      throw new Error('A list of download types must be provided')
    return true
  }

  constructor(name, options) {
    this.validate(name, options)

    const {
      type = '',
      task,
      progress,
      download,
      allowMultiple = true,
      extensions,
      downloadTypes
    } = options

    this.name = name
    this.slug = slugify(name, { lower: true })
    this.type = type
    this.allowMultiple = allowMultiple
    this.extensions = extensions
    this.downloadTypes = downloadTypes
    this.process = task
    this.progress = progress
    this.download = download
  }
}

module.exports = Module
