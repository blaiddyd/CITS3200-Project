import React from 'react'

class ProgressBar extends React.Component {
  constructor (props) {
    super(props)
    
    this.state = {
      taskNumber: 0,
      percentProgress: 0,
      numberPending: 0,
      numberAnimal: 0,
      numberBlank: 0
    }
  }

  render() {
    return (
      <div className="card">
        <div className="card-body pa-4">
          <div className="task-title ml-3">
            <small className="text-muted">
              Ecological Animal Classification
            </small>
            <h3 className="mt-0">
              Task #{this.state.taskNumber}
            </h3>
          </div>
        </div>
      </div>
    )
  }
}

export default ProgressBar