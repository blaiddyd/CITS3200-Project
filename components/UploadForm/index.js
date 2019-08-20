import React from 'react'
import UploadBox from './UploadBox'

const UploadForm = () => {
  return (
    <div className="container">
      <div className="row">
        <UploadBox keyUpload={true} imgUpload={false} />
        <UploadBox keyUpload={false} imgUpload={true} />
      </div>
    </div>
  )
}

export default UploadForm