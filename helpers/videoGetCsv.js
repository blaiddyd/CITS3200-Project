const videoGetCsv = labels => {
  let outCsv = ''
  outCsv = 'Categories,Entity,Start (s),End (s),Confidence\n'
  labels.forEach(label => {
    outCsv += `${label.categoryEntities.map(x => x.description).join(', ')}`
    outCsv += `,${label.entity.description}`
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

module.exports = videoGetCsv
