import React, { useState } from 'react'

const ResultCollapse = props => {
  const { name, data, ...rest } = props
  const [showData, changeShowData] = useState(true)
  const handleClick = () => changeShowData(!showData)
  const direction = showData ? 'up' : 'down'

  return (
    <div {...rest}>
      <div
        className="py-2 mb-2 d-flex justify-content-between align-items-center"
        onClick={handleClick}>
        <h6 className="mb-0">{name}</h6>
        <i className={`fas fa-chevron-${direction}`} />
      </div>
      {showData && (
        <ul className="list-group">
          {data.map(item => (
            <ResultItem key={item} data={item} />
          ))}
        </ul>
      )}
    </div>
  )
}

const ResultItem = props => {
  const { data } = props
  const name = data.substring(data.lastIndexOf('/') + 1)
  return (
    <li className="list-group-item">
      <a href={data} rel="noopener noreferrer" target="_blank">
        {name}
      </a>
    </li>
  )
}

export default ResultCollapse
