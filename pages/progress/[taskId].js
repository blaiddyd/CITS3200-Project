import React from 'react'
import { useRouter } from 'next/router'
import useAxios from 'axios-hooks'
import PageHeader from '../../components/PageHeader'
import TitleGroup from '../../components/TitleGroup'
import ResultCollapse from '../../components/ResultCollapse'

const Progress = () => {
  const router = useRouter()
  const { taskId } = router.query

  const [{ data, loading }] = useAxios(`/api/progress/${taskId}`)

  const title = `Task #${taskId}`
  const subtitle = 'Ecological Image Classification'

  console.log(data)
  return loading ? (
    <i className="fas fa-circle-notch fa-spin" />
  ) : (
    <div>
      <PageHeader title={title} subtitle={subtitle} extra={<Stats />} />
      <div className="container">
        <div className="py-3 border-bottom">
          <Results />
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

const Results = () => {
  const pending = ['image 1.png']
  const animal = ['image 2.png', 'image 4.png']
  const blank = ['image 3.png', 'image 5.png', 'image 6.png']

  return (
    <>
      <ResultCollapse name="Pending" data={pending} className="mb-3" />
      <ResultCollapse name="Animal" data={animal} className="mb-3" />
      <ResultCollapse name="Blank" data={blank} />
    </>
  )
}

export default Progress
