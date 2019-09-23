const router = require('express').Router()
const modules = require('../../modules')

router.get('/', (req, res) => {
  const sanitised = modules.map(m => {
    const copy = Object.assign({}, m)
    delete copy.validate
    delete copy.progress
    delete copy.process
    delete copy.download
    return copy
  })
  res.status(200).json(sanitised)
})

module.exports = router
