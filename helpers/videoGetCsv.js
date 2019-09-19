const timeToString = time => {
  const { seconds = 0, nanos = 0 } = time
  return `${seconds}.${(nanos / 1e6).toFixed(0)}`
}

const videoGetCsv = labels => {
  const headers = 'Categories,Entity,Start (s),End (s),Confidence'
  const rows = []
  labels.forEach(label => {
    const { entity, segments, categoryEntities } = label
    const categoryEntity = categoryEntities.length && categoryEntities[0]
    const category = categoryEntity ? categoryEntity.description : ''
    segments.forEach(data => {
      const { segment, confidence } = data
      const { startTimeOffset, endTimeOffset } = segment

      const confidenceData = (confidence * 100).toFixed(2) + '%'
      const start = timeToString(startTimeOffset)
      const end = timeToString(endTimeOffset)
      const entityName = entity.description

      const content = [category, entityName, start, end, confidenceData]
      rows.push(content.join(','))
    })
  })
  return `${headers}\n${rows.join('\n')}`
}

module.exports = videoGetCsv
