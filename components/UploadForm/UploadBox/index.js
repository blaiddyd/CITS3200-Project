import React from 'react'

class UploadBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      apiKey: '',
      images: [],
    }
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
          <div className="card-body">
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
          </div>
        </div>
      </div>
    )
  }
}

export default UploadBox
