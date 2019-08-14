import React from 'react'

const PageHeader = props => {
  const { title = '', subtitle, extra } = props
  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          {subtitle && <small>{subtitle}</small>}
          <h3>{title}</h3>
        </div>
        {extra && <div className="col-6">{extra}</div>}
      </div>
    </div>
  )
}

export default PageHeader
