import React from 'react'
import { useRouter } from 'next/router'
import useAxios from 'axios-hooks'
import PageHeader from '../../../components/PageHeader'
import TitleGroup from '../../../components/TitleGroup'
import ResultCollapse from '../../../components/ResultCollapse'
import BlockButton from '../../../components/BlockButton'
import useModule from '../../../helpers/useModule'

const Progress = () => {
  const router = useRouter()
  const { taskId, slug } = router.query

  if (!taskId) return null
  const [moduleData = {}, moduleLoading] = useModule(slug)
  const [{ data, loading, error }] = useAxios(`/api/progress/${taskId}/${slug}`)

  const title = `Task #${taskId}`
  const subtitle = moduleData.name

  if (loading || moduleLoading)
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
        <Download taskId={taskId} moduleData={moduleData} />
      </div>
    </div>
  )
}

const Stats = props => {
  const { data: content } = props
  const { done, data } = content

  const doneFlag = done ? (
    <i className="fas fa-check" />
  ) : (
    <i className="fas fa-times" />
  )

  const groups = Object.entries(data)
  const cols = Math.max(groups.length, 1) + 1
  const span = Math.max(1, Math.floor(12 / cols))

  return (
    <div className="row justify-content-end">
      <div className={`col-${span}`}>
        <TitleGroup title={doneFlag} subtitle="Progress" />
      </div>
      {groups.map(group => {
        const [name, values] = group
        return (
          <div
            className={`col-${span} d-flex flex-column align-items-end`}
            key={name}>
            <TitleGroup title={values.length} subtitle={name} />
          </div>
        )
      })}
    </div>
  )
}

const Results = props => {
  const { data, done } = props.data
  const groups = Object.entries(data)

  if (!groups.length)
    return (
      <>
        <span className="fa-stack">
          <i className="fas fa-square-full fa-stack-2x" />
          {done ? (
            <i className="fas fa-check fa-stack-1x fa-inverse" />
          ) : (
            <i className="fas fa-times fa-stack-1x fa-inverse" />
          )}
        </span>
        <h5 className="mt-2 mb-0">{done ? 'Processed' : 'Processing'}</h5>
      </>
    )

  return (
    <>
      {groups.map(group => {
        const [name, values] = group
        return (
          <ResultCollapse
            key={name}
            name={name}
            data={values}
            className="mb-3"
          />
        )
      })}
    </>
  )
}

const Download = props => {
  const { taskId, moduleData } = props
  const { downloadTypes, slug } = moduleData

  const getDownloadUrl = type =>
    `/api/projects/download/${taskId}/${slug}/${type}`
  return (
    <>
      <h5 className="mb-2">Results</h5>
      <div className="row">
        {downloadTypes.map(type => (
          <div className="col-6" key={type}>
            <a
              href={getDownloadUrl(type)}
              rel="noopener noreferrer"
              target="_blank">
              <BlockButton
                title={type}
                subtitle={`${type} results`}
                icon="download"
              />
            </a>
          </div>
        ))}
      </div>
    </>
  )
}

export default Progress
