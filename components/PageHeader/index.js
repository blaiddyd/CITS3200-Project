import React from 'react'

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
            {subtitle && <small>{subtitle}</small>}
            <h4 className="mb-0">{title}</h4>
          </div>
          {extra && <div className="col-6">{extra}</div>}
        </div>
      </div>
    </div>
  )
}

export default PageHeader
