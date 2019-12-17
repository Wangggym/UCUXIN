import React from 'react'
import {withRouter} from 'react-router-dom'

class LinkTo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    handleLinkTo() {
        const {state, search} = this.props
        this.props.history.push({pathname: this.props.to, state, search})
    }

    render() {
        return (
            <div onClick={this.handleLinkTo.bind(this)} className={this.props.className}>
                {this.props.children}
            </div>
        )
    }
}

export default withRouter(LinkTo)
