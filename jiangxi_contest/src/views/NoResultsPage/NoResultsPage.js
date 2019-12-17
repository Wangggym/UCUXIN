import React from 'react'
import {NoContent} from '../../components'

class NoResultsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return <div className="NoResultsPage">
            <NoContent>
                <div className="no_content">
                    <p>感谢您的关注，网络复赛已结束</p>
                    <p>决赛晋级名单将于<span>2017.12.31</span>前公布</p>
                    <div className="button" onClick={() => this.props.history.goBack()}>返回</div>
                </div>
            </NoContent>
        </div>
    }
}


export default NoResultsPage