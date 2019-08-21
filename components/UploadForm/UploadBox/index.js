import React from 'react'
import Filenames from '../Filenames'

class UploadBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fileNames: this.props.fileNames
    }
    this.fileUpload = React.createRef()
    this.uploadFile = this.uploadFile.bind(this)
  }

  uploadFile() {
    this.fileUpload.current.click()
  }

  render() {
    return (      
      <div>
        {
          this.props.keyUpload ?
          <h6>
            <strong>1. </strong>Upload your key
          </h6> :
          this.props.imgUpload ?
          <h6>
            <strong>2. </strong> Upload your images
          </h6> :
          null
        }
        <div className="card">
          {this.state.fileNames}
          <div className="card-body">
            <div className="d-flex justify-content-center align-items-center">
              <input 
                type="file" 
                name="fileUpload" 
                className="file-upload" 
                ref={this.fileUpload} 
                accept={
                  this.props.keyUpload ?
                  ".json" :
                  this.props.imgUpload ?
                  ".jpeg,.png,.gif,.bmp,.webp,.raw,.ico,.pdf,.tiff" :
                  null
                }
                multiple={
                  this.props.keyUpload ? 
                  false : this.props.imgUpload ? 
                  true : null
                }
                onChange={this.props.handleInput}
                required
              />
              <label htmlFor="fileUpload" onClick={this.uploadFile}>
                <div className="d-flex justify-content-center align-items-center">
                  <i className="fas fa-upload mr-3"></i>
                    Upload your {
                      this.props.keyUpload ?
                      'file' :
                      this.props.imgUpload ?
                      'files' :
                      null
                    }
                </div>
              </label>
            </div>
            <Filenames 
              names={this.state.fileNames} 
              input={this.props.keyUpload ? 'key' : this.props.imgUpload ? 'img' : null }
            />
          </div>
        </div>
      </div>
    )
  }
}

export default UploadBox
