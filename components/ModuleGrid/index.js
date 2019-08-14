import React from 'react'
import modules from './data.json'
import Link from 'next/link'

/**
 * Component that show a grid of module cards
 */
const ModuleGrid = () => {
  return (
    <div className="container">
      <div className="row">
        {modules.map(item => (
          <div className="col-4" key={item.name}>
            <ModuleCard data={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Component that displays information about a module
 */
const ModuleCard = ({ data }) => (
  <div className="card">
    <div className="card-body">
      <h6 className="text-uppercase">{data.name}</h6>
      <div className="d-flex justify-content-between align-items-center mt-5">
        <p className="mb-0">{data.description}</p>
        <Link href={data.path}>
          <i className="fas fa-arrow-right" />
        </Link>
      </div>
    </div>
  </div>
)

export default ModuleGrid
