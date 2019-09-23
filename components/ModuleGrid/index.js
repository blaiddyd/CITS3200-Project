import React from 'react'
import Link from 'next/link'
import useModules from '../../helpers/useModules'

/**
 * Component that show a grid of module cards
 */
const ModuleGrid = () => {
  const [data, loading] = useModules()
  return (
    <div className="container">
      <div className="row">
        {loading && <i className="fas fa-circle-notch fa-spin" />}
        {data &&
          data.map(item => (
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
  <Link href={`/${data.slug}`}>
    <div className="card">
      <div className="card-body">
        <h6 className="text-uppercase">{data.name}</h6>
        <div className="d-flex justify-content-between align-items-center mt-5">
          <p className="mb-0">{data.type}</p>
          <i className="fas fa-arrow-right" />
        </div>
      </div>
    </div>
  </Link>
)

export default ModuleGrid
