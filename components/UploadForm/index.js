import React from 'react'
import UploadBox from './UploadBox'

class UploadForm extends React.Component {
  constructor() {
    super()
    this.state = {
      images: [],
      apiKey: undefined
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

  /** TODO: implement backend linking */
  handleSubmit = () => {
    // create a project
    // upload each image and link to project
    // route to confirmation page
  }

  render() {
    const { apiKey, images } = this.state
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
            disabled={!canSubmit}
            onClick={this.handleSubmit}>
            <div className="d-flex justify-content-center align-items-center">
              <span>Process {images.length || ''} images</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </div>
          </button>
        </div>
      </>
    )
  }
}

export default UploadForm
