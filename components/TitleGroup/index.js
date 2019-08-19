import React from 'react'

const TitleGroup = props => {
  const { title = '', subtitle } = props
  return (
    <>
      {subtitle && <small>{subtitle}</small>}
      <h4 className="mb-0">{title}</h4>
    </>
  )
}

export default TitleGroup
