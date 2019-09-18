import React from 'react'
import { useRouter } from 'next/router'
import useAxios from 'axios-hooks'
import PageHeader from '../../../components/PageHeader'
import BlockButton from '../../../components/BlockButton'

const Progress = () => {
  const router = useRouter()
  const { taskId } = router.query

  if (!taskId) return null
  const [{ data, loading, error }] = useAxios(`/api/progress/${taskId}/video`)

  const title = `Task #${taskId}`
  const subtitle = 'Video'

  if (loading)
    return (
      <div className="text-center py-3">
        <i className="fas fa-circle-notch fa-spin" />
      </div>
    )
  if (error)
    return (
      <div className="container py-3">
        <div className="alert alert-danger" role="alert">
          No task with id {taskId} found!
        </div>
      </div>
    )

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="border-bottom">
        <div className="container pt-3 pb-4">
          <Results data={data} />
        </div>
      </div>
      <div className="container py-4">
        <Download taskId={taskId} data={data} />
      </div>
    </div>
  )
}

const Results = props => {
  const { status } = props.data
  const done = status === 'Parsed'
  const icon = done ? 'check' : 'times'
  const msg = done ? 'Processed' : 'Processing'
  return (
    <>
      <span className="fa-stack">
        <i className="fas fa-square-full fa-stack-2x"></i>
        <i className={`fas fa-${icon} fa-stack-1x fa-inverse`}></i>
      </span>
      <h5 className="mt-2 mb-0">{msg}</h5>
    </>
  )
}

const Download = props => {
  const { taskId } = props
  const url = `/api/video/get_csv/${taskId}`
  return (
    <>
      <h5 className="mb-2">Results</h5>
      <div className="row">
        <div className="col-6">
          <a href={url} rel="noopener noreferrer" target="_blank">
            <BlockButton
              title="Objects"
              subtitle="objects.csv"
              icon="download"
            />
          </a>
        </div>
      </div>
    </>
  )
}

export default Progress
