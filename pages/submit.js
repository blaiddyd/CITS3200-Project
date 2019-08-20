import React from 'react'
import PageHeader from '../components/PageHeader'
import UploadForm from '../components/UploadForm'
import '../static/css/submit.css'

const Submit = () => {
  return (
    <div className="py-3">
      <PageHeader title="Ecological Image Classification" />
      <div className="container">
        <UploadForm />
      </div>
    </div>
  )
}

export default Submit
