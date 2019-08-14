import React from 'react'
import DownloadCard from './DownloadCard'

class Download extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      animalZip: '',
      blankZip: '',
    } 
  }

  render () {
    return (
      <div className="card">
        <div className="card-title">
          <h4>
            Results
          </h4>

          <div className="container">
            <DownloadCard 
              imageType="Animal"
              imageAmount="6"
              fileName="animal.zip"
              downloadLink="www.hella.com"
            />
          </div>
        </div>
        
      </div>
    )
  }
}

export default Download