import React from 'react'

class UploadBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fileNames: this.props.fileNames
    }
    this.fileUpload = React.createRef()
  }

  uploadFile = () => this.fileUpload.current.click()

  render() {
    const { accept, multiple = false, onChange, value = [] } = this.props
    const count = Array.from(value).length
    return (
      <div className="card rounded-0" onClick={this.uploadFile}>
        <div className="card-body">
          <input
            type="file"
            name="fileUpload"
            className="d-none"
            ref={this.fileUpload}
            accept={accept}
            multiple={multiple}
            onChange={onChange}
            required
          />
          <div className="d-flex justify-content-center align-items-center">
            <label htmlFor="fileUpload" className="text-center">
              <i className="fas fa-upload mr-3" />
              Upload your {multiple ? 'files' : 'file'}
            </label>
          </div>
          {!!count && (
            <p className="mb-0 mt-3 small text-center">
              {count} {count > 1 ? 'files' : 'file'} selected
            </p>
          )}
        </div>
      </div>
    )
  }
}

export default UploadBox
