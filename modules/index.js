const ImageModule = require('./image')
const VideoModule = require('./video')
const AudioModule = require('./audio')

const modules = [ImageModule, VideoModule, AudioModule]

const modulesMap = new Map()
modules.forEach(m => modulesMap.set(m.slug, m))

module.exports = modules
module.exports.modulesMap = modulesMap
