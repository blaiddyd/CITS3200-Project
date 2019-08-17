import React from 'react'
import { useRouter } from 'next/router'
import useAxios from 'axios-hooks'
import PageHeader from '../../components/PageHeader'
import TitleGroup from '../../components/TitleGroup'
import ResultCollapse from '../../components/ResultCollapse'

const Progress = () => {
  const router = useRouter()
  const { taskId } = router.query

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
      <PageHeader title={title} subtitle={subtitle} extra={<Stats />} />
      <div className="container">
        <div className="py-3 border-bottom">
          <Results data={data} />
        </div>
      </div>
    </div>
  )
}

const Stats = () => {
  return (
    <div className="row">
      <div className="col-6">
        <TitleGroup title="80%" subtitle="Progress" />
      </div>
      <div className="col-2">
        <TitleGroup title="3" subtitle="Pending" />
      </div>
      <div className="col-2">
        <TitleGroup title="1" subtitle="Animal" />
      </div>
      <div className="col-2">
        <TitleGroup title="2" subtitle="Blank" />
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

export default Progress
