import React from 'react'

class Filenames extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            names: this.props.names
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                {
                    this.props.input === 'key' ?
                    <div className="d-flex justify-content-center align-items-center">
                        <small>
                            {this.state.names}
                        </small>
                    </div> :
                    this.state.names.map((name, idx) => (
                        <div key={idx} className=".col-6 .col-sm-3">
                            <small>
                                {name},&nbsp;
                            </small>
                        </div>
                    ))
                }
                </div>
            </div>
        )
    }
}

export default Filenames
