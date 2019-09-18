const videoGetTxt = labels => {
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

module.exports = videoGetTxt
