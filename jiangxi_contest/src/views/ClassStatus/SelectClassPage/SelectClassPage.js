import React from 'react'
// import './SelectClassPage.less'
import {LinkTo} from '../../../components'
import Api from '../../../api'
import {Toast} from 'antd-mobile';

class SelectClassPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            viewModalList: []
        }
    }

    componentDidMount() {
        Api.GetClassList().then(res => {
            if (!res) return;
            if (res.Ret === 0) {
                this.setState({viewModalList: res.Data})
                console.log(res)
            } else {
                Toast.fail(res.Msg)
                setTimeout(() => {
                    Toast.hide()
                }, 1500)
            }
            if (!res.Data) return
        })
    }

    render() {
        const {viewModalList} = this.state
        return (
            <div className="SelectClassPage">
                {viewModalList && viewModalList.length ? viewModalList.map(({AVGScore, ClassID, ClassName, ClassTotalCount, GID, GName, JoinCount}) =>
                    <LinkTo className="item" to={`/ClassConditionPage/${GID}/${ClassID}`} key={ClassID}>
                        <div className="top">
                            <div>{ClassName}</div>
                            <span>{GName}</span>
                            <span className="icon"></span>
                        </div>
                        <div className="bottom">
                            <div className="title">班级总人数：{ClassTotalCount}</div>
                            <div className="content">
                                <div className="count">
                            <span>
                                {JoinCount}
                            </span>
                                    <p>参与人数</p>
                                </div>
                                <div className="count">
                            <span>
                                {AVGScore}
                            </span>
                                    <p>竞赛平均分</p>
                                </div>
                            </div>
                        </div>
                    </LinkTo>
                ) : null}
            </div>
        )
    }
}

export default SelectClassPage