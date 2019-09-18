import React from 'react'
import UploadBox from '../UploadBox'
import readFile from '../../helpers/readFile'

/**
 * Component to show upload forms
 * @example Upload form that accept PNG images and print the files to console
 * <UploadForm
 *  accept=".png"
 *  onSubmit={(apiKey, files) => console.log(apiKey, files)}
 *  loading={loading}
 *  progress={progressNumber}
 * />
 */

class UploadForm extends React.Component {
  state = {
    files: [],
    apiKey: undefined
  }

  handleFileChange = event => {
    const { files: filesMap } = event.target
    const files = Array.from(filesMap)
    this.setState({ files })
  }

  handleApiKeyChange = event => {
    const { files } = event.target
    const apiKey = files.length && files[0]
    this.setState({ apiKey })
  }

  handleSubmit = async () => {
    const { apiKey, files } = this.state
    const keyData = await readFile(apiKey)
    this.props.onSubmit(keyData, files)
  }

  render() {
    const { apiKey, files } = this.state
    const { loading, progress, accept, multiFile } = this.props
    const canSubmit = files.length && apiKey
    return (
      <>
        <div className="row">
          <div className="col-6">
            <h5 className="mb-3">1. Upload your key</h5>
            <UploadBox
              onChange={this.handleApiKeyChange}
              value={apiKey && [apiKey]}
              accept=".json,.JSON"
            />
          </div>
          <div className="col-6">
            <h5 className="mb-3">2. Upload your files</h5>
            <UploadBox
              onChange={this.handleFileChange}
              value={files}
              accept={accept}
              multiple={multiFile}
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
              <span className="mr-2">Process {files.length || ''} files</span>
              {loading ? (
                <i className="fas fa-spin fa-circle-notch" />
              ) : (
                <i className="fas fa-arrow-right" />
              )}
            </div>
          </button>
        </div>
        {loading && (
          <p className="mb-0 text-right mt-2">
            {progress} / {files.length} uploaded
          </p>
        )}
      </>
    )
  }
}

export default UploadForm
