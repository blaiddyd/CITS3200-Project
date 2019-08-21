import React from 'react'

const BlockButton = props => {
  const { title, subtitle, icon, ...rest } = props
  return (
    <button
      className="btn btn-block btn-outline-dark rounded-0 d-flex justify-content-between align-items-center"
      {...rest}>
      <div>
        <strong className="d-block mb-3 text-left">{title}</strong>
        <span className="text-muted d-block">{subtitle}</span>
      </div>
      <i className={`fas fa-${icon}`} />
    </button>
  )
}

export default BlockButton
