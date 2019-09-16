const ImageModule = require('./image')

const modules = [ImageModule]

const modulesMap = new Map()
modules.forEach(m => modulesMap.set(m.name, m))

module.exports = modules
module.exports.modulesMap = modulesMap
