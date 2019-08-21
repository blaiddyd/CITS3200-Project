import React from 'react'
import Router from 'next/router'
import UploadBox from './UploadBox'
import createProject from '../../helpers/createProject'
import readFile from '../../helpers/readFile'
import plimit from 'p-limit'
import config from '../../config'
import uploadImage from '../../helpers/uploadImage'

class UploadForm extends React.Component {
  constructor() {
    super()
    this.state = {
      images: [],
      progress: 0,
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
      const { apiKey, images } = this.state
      const apiKeyData = await readFile(apiKey)

      // create a project
      const project = await createProject(apiKeyData)
      const projectId = project._id

      // upload each image and link to project
      // only upload x amount of images at a time
      const limit = plimit(config.uploadLimit)
      const tasks = images.map(image =>
        limit(async () => {
          await uploadImage(projectId, image)
          this.setState(old => ({ progress: old.progress + 1 }))
        })
      )

      // wait for all images to be uploaded
      await Promise.all(tasks)

      // route to confirmation page
      await this.toggleLoading()
      Router.push(`/eco-vision/${projectId}/confirmation`)
    } catch (error) {
      console.error(error)
      alert('Oh no something went wrong')
      await this.toggleLoading()
    }
  }

  render() {
    const { apiKey, images, loading, progress } = this.state
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
        {loading && !!progress && (
          <p className="mb-0 text-right mt-2">
            {progress} / {images.length} uploaded
          </p>
        )}
      </>
    )
  }
}

export default UploadForm
