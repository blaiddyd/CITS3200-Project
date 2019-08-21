import React from 'react'
import PageHeader from '../../components/PageHeader'
import UploadForm from '../../components/UploadForm'
import '../../static/css/submit.css'

const Submit = () => {
  return (
    <>
      <PageHeader title="Ecological Image Classification" subtitle="Module" />
      <div className="container py-3">
        <UploadForm />
      </div>
    </>
  )
}

export default Submit
