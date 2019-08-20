import React from 'react'
import UploadBox from './UploadBox'

class UploadForm extends React.Component {
  constructor() {
    super()
    this.state = {
      images: [],
      apiKey: '',
      imageNames: [],
      apiFileName: []
    }
    this.addImage = this.addImage.bind(this)
    this.addApiKey = this.addApiKey.bind(this)
  }

  addImage(event) {
    event.persist()
    let newImages = this.state.images
    newImages.push(event.target.value)
    let imgNames = this.state.imageNames
    for (let i = 0; i < event.target.files.length; i++) {
      if (!this.state.imageNames.includes(event.target.files[i].name)) {
        imgNames.push(event.target.files[i].name)
      }
    }
    this.setState({
      images: newImages,
      imageNames: imgNames
    }) 
  }

  addApiKey(event) {
    event.persist()
    this.setState({
      apiKey: event.target.value,
      apiFileName: [event.target.files[0].name]
    })
  }

  render() {
    return (
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-6">
            <UploadBox 
              keyUpload={true} 
              imgUpload={false} 
              handleInput={this.addApiKey} 
              fileNames={this.state.apiFileName}
            />
          </div>
          <div className="col-6">
            <UploadBox 
              keyUpload={false} 
              imgUpload={true} 
              handleInput={this.addImage} 
              fileNames={this.state.imageNames} 
            />
          </div>
        </div>
        <div className="d-flex flex-row-reverse mt-3">
          <button 
            type="button" 
            className="btn btn-dark btn-sm" 
            disabled={this.state.images.length == 0 ? true : false}
          >
            <div className="d-flex justify-content-center align-items-center">
              <span>
                Process {this.state.images.length > 0 ? this.state.images.length : null} Images
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
