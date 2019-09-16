class Module {
  /** The module's name */
  name = ''

  /**
   * The module type
   * @example Vision
   */
  type = ''

  /**
   * Method to process uploaded resources
   * @param project Project
   * @param project.apiKey string
   * @param project.resources string[]
   * @param project.title string
   * @return
   */
  process = project => {}

  /**
   * Method to report on the progress of a task
   * @param project Project
   * @param project.apiKey string
   * @param project.resources string[]
   * @param project.title string
   * @return any
   */
  progress = project => ({})

  /**
   * Method generate download resources for a task
   * @param project Project
   * @param project.apiKey string
   * @param project.resources string[]
   * @param project.title string
   * @param type string | undefined optionally passed from request (e.g. animal, blank)
   * @return any
   */
  download = (project, type) => null

  constructor(name, options) {
    const {
      type = '',
      task = () => {},
      progress = () => ({}),
      download = () => null
    } = options

    this.name = name
    this.type = type
    this.process = task
    this.progress = progress
    this.download = download
  }
}

exports.default = Module
