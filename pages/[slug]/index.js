import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import UploadForm from '../../components/UploadForm'
import Router, { useRouter } from 'next/router'
import createProject from '../../helpers/createProject'
import plimit from 'p-limit'
import config from '../../config'
import uploadImage from '../../helpers/uploadImage'
import startAnnotation from '../../helpers/startAnnotation'
import useAxios from 'axios-hooks'
import '../../static/css/submit.css'

const Submit = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [{ data: modules, loading: modulesLoading }] = useAxios(`/api/modules`)

  const { slug } = router.query
  const data = modules && modules.find(m => m.slug === slug)
  console.log(slug, data)

  const handleSubmit = async (apiKey, images) => {
    setLoading(true)
    try {
      // create a project
      const project = await createProject(apiKey)
      const projectId = project._id

      // // upload each image and link to project
      // // only upload x amount of images at a time
      // const limit = plimit(config.uploadLimit)
      // const tasks = images.map(image =>
      //   limit(async () => {
      //     await uploadImage(projectId, image)
      //     setProgress(progress + 1)
      //   })
      // )

      // // wait for all images to be uploaded
      // await Promise.all(tasks)

      // // start annotating
      // await startAnnotation(projectId)

      // route to confirmation page
      Router.push(`/${data.slug}/${projectId}/confirmation`)
    } catch (error) {
      console.error(error)
      setProgress(0)
      alert('Oh no something went wrong')
    }
    setLoading(false)
  }

  if (modulesLoading) return <i className="fas fa-circle-notch fa-spin" />
  if (!data) return <p>something went wrong loading this module</p>
  return (
    <>
      <PageHeader title={data.name} subtitle="Module" />
      <div className="container py-3">
        <UploadForm
          accept={data.extensions}
          onSubmit={handleSubmit}
          loading={loading}
          progress={progress}
          multiFile={data.allowMultiple}
        />
      </div>
    </>
  )
}

export default Submit
