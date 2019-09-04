import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import UploadForm from '../../components/UploadForm'
// import readFile from '../../helpers/readFile'
import '../../static/css/submit.css'

const Submit = () => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(false)
  const handleSubmit = async (apiKey, files) => {
    setLoading(true)
    try {
      // const apiKeyData = await readFile(apiKey)
      // TODO: upload video and start classifying
    } catch (error) {
      console.error(error)
      setProgress(0)
      alert('Oh no something went wrong')
    }
    setLoading(false)
  }
  return (
    <>
      <PageHeader title="Video Intelligence" subtitle="Module" />
      <div className="container py-3">
        <UploadForm
          accept=".mp4"
          onSubmit={handleSubmit}
          loading={loading}
          progress={progress}
        />
      </div>
    </>
  )
}

export default Submit
