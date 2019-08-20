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
        <div className="card">
          {
            this.props.keyUpload ?
            <h6>
              Upload your key
            </h6> :
            this.props.imgUpload ?
            <h6>
              Upload your images
            </h6> :
            null
          }
          <div className="card-body">
            <div className="row">
              <i className="fas fa-upload"></i>
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