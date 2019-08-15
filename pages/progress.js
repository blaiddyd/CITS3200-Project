import React from 'react'
import PageHeader from '../components/PageHeader'
import TitleGroup from '../components/TitleGroup'

const Progress = () => {
  const title = 'Task #182'
  const subtitle = 'Ecological Image Classification'
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        extra={
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
        }
      />
    </div>
  )
}

export default Progress
