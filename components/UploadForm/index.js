import React from 'react'
import UploadBox from './UploadBox'

class UploadForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      apiKey: ''
    }
    this.addImage = this.addImage.bind(this)
    this.addApiKey = this.addApiKey.bind(this)
  }

  addImage(image) {
    let newImages = this.state.images
    newImages.push(image)
    this.setState({
      images: newImages
    })
  }

  addApiKey(key) {
    this.setState({
      apiKey: key
    })
  }

  render() {
    return (
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-6">
            <UploadBox keyUpload={true} imgUpload={false} />
          </div>
          <div className="col-6">
            <UploadBox keyUpload={false} imgUpload={true} />
          </div>
        </div>
        <div className="d-flex flex-row-reverse mt-3">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            disabled={this.state.images.length == 0 ? true : false}
          >
            <div className="d-flex justify-content-center align-items-center">
              <span>
                Process Images
              </span>
              <i className="fas fa-arrow-right ml-2"></i>
            </div>
          </button>
        </div>
      </div>
    )
  }
}

export default UploadForm
