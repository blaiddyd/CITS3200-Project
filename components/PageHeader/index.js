import React from 'react'
import TitleGroup from '../TitleGroup'

/**
 * Component to the header of a page
 */
const PageHeader = props => {
  const { title = '', subtitle, extra } = props
  return (
    <div className="py-3 border-bottom">
      <div className="container">
        <div className="row">
          <div className="col-6">
            <TitleGroup title={title} subtitle={subtitle} />
          </div>
          {extra && <div className="col-6">{extra}</div>}
        </div>
      </div>
    </div>
  )
}

export default PageHeader
