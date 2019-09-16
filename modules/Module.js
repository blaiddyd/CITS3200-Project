const slugify = require('slugify')

class Module {
  validate(name, options) {
    if (!name) throw new Error('A module name must be specified')
    const { task, progress, download } = options
    if (!task) throw new Error('A module processing method must be specified')
    if (!progress) throw new Error('A module progress method must be specified')
    if (!download) throw new Error('A module download method must be specified')
  }

  constructor(name, options) {
    const { type = '', task, progress, download, multi = true } = options

    this.validate(name, options)

    this.name = name
    this.slug = slugify(name, { lower: true })
    this.type = type
    this.multi = multi
    this.process = task
    this.progress = progress
    this.download = download
  }
}

module.exports = Module
