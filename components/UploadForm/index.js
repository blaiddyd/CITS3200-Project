import React from 'react'
import UploadBox from './UploadBox'
import createProject from '../../helpers/createProject'
import readFile from '../../helpers/readFile'

class UploadForm extends React.Component {
  constructor() {
    super()
    this.state = {
      images: [],
      apiKey: undefined,
      loading: false
    }
  }

  handleImageChange = event => {
    event.persist()
    const { files } = event.target
    const images = Array.from(files)
    this.setState({ images })
  }

  handleApiKeyChange = event => {
    event.persist()
    const { files } = event.target
    const apiKey = files.length && files[0]
    this.setState({ apiKey })
  }

  toggleLoading = () =>
    new Promise(resolve =>
      this.setState({ loading: !this.state.loading }, resolve)
    )

  /** TODO: implement backend linking */
  handleSubmit = async () => {
    await this.toggleLoading()
    try {
      const { apiKey } = this.state
      const apiKeyData = await readFile(apiKey)

      // create a project
      const project = await createProject(apiKeyData)
      console.log(project)

      // upload each image and link to project
      // use helpers/uploadImage

      // route to confirmation page
      await this.toggleLoading()
    } catch (error) {
      console.error(error)
      alert('Oh no something went wrong')
      await this.toggleLoading()
    }
  }

  render() {
    const { apiKey, images, loading } = this.state
    const canSubmit = images.length && apiKey
    return (
      <>
        <div className="row">
          <div className="col-6">
            <h5 className="mb-3">1. Upload your key</h5>
            <UploadBox
              onChange={this.handleApiKeyChange}
              value={apiKey && [apiKey]}
              accept=".json"
            />
          </div>
          <div className="col-6">
            <h5 className="mb-3">2. Upload your images</h5>
            <UploadBox
              onChange={this.handleImageChange}
              value={images}
              accept=".jpeg,.png,.gif,.bmp,.webp,.raw,.ico,.pdf,.tiff"
              multiple={true}
            />
          </div>
        </div>
        <div className="d-flex flex-row-reverse mt-3">
          <button
            type="button"
            className="btn btn-dark btn-sm rounded-0"
            disabled={!canSubmit || loading}
            onClick={this.handleSubmit}>
            <div className="d-flex justify-content-center align-items-center">
              <span className="mr-2">Process {images.length || ''} images</span>
              {loading ? (
                <i className="fas fa-spin fa-circle-notch" />
              ) : (
                <i className="fas fa-arrow-right" />
              )}
            </div>
          </button>
        </div>
      </>
    )
  }
}

export default UploadForm
