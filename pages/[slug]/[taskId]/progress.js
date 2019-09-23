import React from 'react'
import { useRouter } from 'next/router'
import useAxios from 'axios-hooks'
import PageHeader from '../../../components/PageHeader'
import TitleGroup from '../../../components/TitleGroup'
import ResultCollapse from '../../../components/ResultCollapse'
import BlockButton from '../../../components/BlockButton'

const Progress = () => {
  const router = useRouter()
  const { taskId } = router.query

  if (!taskId) return null
  const [{ data, loading, error }] = useAxios(`/api/progress/${taskId}`)

  const title = `Task #${taskId}`
  const subtitle = 'Ecological Image Classification'

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
      <PageHeader
        title={title}
        subtitle={subtitle}
        extra={<Stats data={data} />}
      />
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

const Stats = props => {
  const { data } = props
  const { pending, animal, blank } = data

  const total = pending.length + animal.length + blank.length
  const percentage = Math.trunc((1 - pending.length / total) * 100)
  const progress = `${percentage}%`
  return (
    <div className="row">
      <div className="col-6">
        <TitleGroup title={progress} subtitle="Progress" />
      </div>
      <div className="col-2">
        <TitleGroup title={pending.length} subtitle="Pending" />
      </div>
      <div className="col-2">
        <TitleGroup title={animal.length} subtitle="Animal" />
      </div>
      <div className="col-2">
        <TitleGroup title={blank.length} subtitle="Blank" />
      </div>
    </div>
  )
}

const Results = props => {
  const { pending, blank, animal } = props.data

  return (
    <>
      <ResultCollapse name="Pending" data={pending} className="mb-3" />
      <ResultCollapse name="Animal" data={animal} className="mb-3" />
      <ResultCollapse name="Blank" data={blank} />
    </>
  )
}

const Download = props => {
  const { taskId } = props
  const animalUrl = `/api/projects/download/${taskId}/Animal`
  const blankUrl = `/api/projects/download/${taskId}/Blank`
  return (
    <>
      <h5 className="mb-2">Results</h5>
      <div className="row">
        <div className="col-6">
          <a href={animalUrl} rel="noopener noreferrer" target="_blank">
            <BlockButton title="Animal" subtitle="animal.zip" icon="download" />
          </a>
        </div>
        <div className="col-6">
          <a href={blankUrl} rel="noopener noreferrer" target="_blank">
            <BlockButton title="Blank" subtitle="blank.zip" icon="download" />
          </a>
        </div>
      </div>
    </>
  )
}

export default Progress
