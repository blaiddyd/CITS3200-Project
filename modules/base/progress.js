class ProgressReport {
  validate(options) {
    const { done, data } = options
    if (typeof done !== 'boolean')
      throw new Error('property done of progress report must be a boolean')
    if (!data) return true
    if (typeof data !== 'object')
      throw new Error('property data of progress report must be an object')
    if (
      !Object.values(data).every(
        values =>
          Array.isArray(values) &&
          values.every(value => typeof value === 'string')
      )
    )
      throw new Error(
        'property data of progress report must be an object that maps keys to array of strings'
      )
    return true
  }

  constructor(options) {
    this.validate(options)

    const { done, data = {} } = options

    this.done = done
    this.data = data
  }
}

module.exports = ProgressReport
