import React from 'react'
import Link from 'next/link'

const DownloadCard = (props) => {
  return (
    <div className="card download-card">
      <div className="card-body">
        <div className="row">
          <div className="col">
            <h5>
              {props.imageType}
            </h5>

            <div className="d-flex justify-content-between align-items-start">
              <p>{props.imageAmount}</p>
              <p>{props.fileName}</p>
            </div>

            <div className="col">
              <Link href={props.downloadLink}>
                <i className="fas fa-download"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DownloadCard