'use strict'

/*   TEMPORARY ROUTER   */

const router = require('express').Router()
router.use(require('express').json())

const annotateVideo = require('../../helpers/annotateVideo')

router.use(require('express').json())

const testUri = 'gs://cits3200-team24-videos-v2/wildlife.mp4'

const videoGetTxt = async () => {
  const labels = await annotateVideo(testUri)
  let outStr = ''
  labels.forEach(label => {
    outStr += `Label ${label.entity.description} occurs at:\n`
    label.segments.forEach(segment => {
      const time = segment.segment
      if (time.startTimeOffset.seconds === undefined) {
        time.startTimeOffset.seconds = 0
      }
      if (time.startTimeOffset.nanos === undefined) {
        time.startTimeOffset.nanos = 0
      }
      if (time.endTimeOffset.seconds === undefined) {
        time.endTimeOffset.seconds = 0
      }
      if (time.endTimeOffset.nanos === undefined) {
        time.endTimeOffset.nanos = 0
      }
      outStr += `\tStart: ${time.startTimeOffset.seconds}.${(
        time.startTimeOffset.nanos / 1e6
      ).toFixed(0)}s\n`
      outStr += `\tEnd: ${time.endTimeOffset.seconds}.${(
        time.endTimeOffset.nanos / 1e6
      ).toFixed(0)}s\n`
      outStr += `\tConfidence: ${segment.confidence}\n`
    })
  })
  return outStr
}

const videoGetCsv = async () => {
  const labels = await annotateVideo(testUri)
  let outCsv = ''
  outCsv = 'Entity,Start (s),End (s),Confidence\n'
  labels.forEach(label => {
    outCsv += `${label.entity.description}`
    label.segments.forEach(segment => {
      const time = segment.segment
      if (time.startTimeOffset.seconds === undefined) {
        time.startTimeOffset.seconds = 0
      }
      if (time.startTimeOffset.nanos === undefined) {
        time.startTimeOffset.nanos = 0
      }
      if (time.endTimeOffset.seconds === undefined) {
        time.endTimeOffset.seconds = 0
      }
      if (time.endTimeOffset.nanos === undefined) {
        time.endTimeOffset.nanos = 0
      }
      outCsv += `,${time.startTimeOffset.seconds}.${(
        time.startTimeOffset.nanos / 1e6
      ).toFixed(0)}`
      outCsv += `,${time.endTimeOffset.seconds}.${(
        time.endTimeOffset.nanos / 1e6
      ).toFixed(0)}`
      outCsv += `,${segment.confidence}\n`
    })
  })
  return outCsv
}

/* 
    Tests sending a txt file to users based on the GCP video API
*/
router.get('/testtxt', async (req, res) => {
  const outStr = await videoGetTxt()
  res.set({
    'Content-Disposition': 'attachment; filename="out.txt"',
    'Content-Type': 'text/plain'
  })
  res.send(outStr)
})

/* 
    Tests sending a csv file to users based on the GCP video API
*/
router.get('/testcsv', async (req, res) => {
  const outCsv = await videoGetCsv()
  res.set({
    'Content-Disposition': 'attachment; filename="out.csv"',
    'Content-Type': 'text/csv'
  })
  res.send(outCsv)
})

module.exports = router
