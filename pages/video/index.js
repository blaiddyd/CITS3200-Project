import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import UploadForm from '../../components/UploadFormVid'
import Router from 'next/router'
import createProject from '../../helpers/createProject'
import readFile from '../../helpers/readFile'
import uploadVideo from '../../helpers/uploadVideo'
import startAnnotation from '../../helpers/startAnnotation'
import '../../static/css/submit.css'

const Submit = () => {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(false)
  const handleSubmit = async (apiKey, file) => {
    console.log(apiKey, file)
    setLoading(true)
    try {
      // TODO: upload video and start classifying
      const apiKeyData = await readFile(apiKey)

      // create a project
      const project = await createProject(apiKeyData)
      const projectId = project._id

      const videoUpload = await uploadVideo(projectId, file)

      // wait for video to be uploaded
      await Promise(videoUpload)

      // start annotating
      await startAnnotation(projectId)

      // route to confirmation page
      Router.push(`/video/${projectId}/confirmation`)
    } catch (error) {
      console.error(error)
      setProgress(0)
      alert('Oh no, something went wrong')
    }
    setLoading(false)
  }
  return (
    <>
      <PageHeader title="Video Intelligence" subtitle="Module" />
      <div className="container py-3">
        <UploadForm
          accept=".MP4, .MOV, .MPEG4, .AVI"
          onSubmit={handleSubmit}
          loading={loading}
          progress={progress}
        />
      </div>
    </>
  )
}

export default Submit
