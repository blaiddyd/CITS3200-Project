const ImageModule = require('./image')
const VideoModule = require('./video')

const modules = [ImageModule, VideoModule]

const modulesMap = new Map()
modules.forEach(m => modulesMap.set(m.name, m))

module.exports = modules
module.exports.modulesMap = modulesMap
