import React from 'react'
import Api from '../../api'
// import './StatementPage.less'
import {Toast} from 'antd-mobile';
import moment from 'moment'
// const tableType = ['日期', '学校数', '学生数', '平均分', '及格人数', '及格率', '满分人数', '满分率'];
const tableType = ['学校数', '学生数', '平均分', '及格人数', '及格率', '满分人数',];

class StatementPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            StatementList: [],
            scrollStatus: false,
        }
    }

    componentDidMount() {
        Api.GetSumInfoReport().then(res => {
            if (!res) return;
            if (res.Ret === 0) {
                this.setState({StatementList: res.Data})
            } else {
                Toast.fail(res.Msg)
                setTimeout(() => {
                    Toast.hide()
                }, 1500)
            }
            if (!res.Data) return
        })
    }


    //滚动条滚动时
    handleScroll = (e) => {
        this.setState({scrollStatus: true})
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.setState({scrollStatus: false})
        }, 500)
    }


    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    render() {
        const {StatementList, scrollStatus} = this.state

        return (
            <div className="StatementPage">
                <h3>江西省禁毒知识竞赛开展情况统计</h3>
                <div className="time">每日6:00统计前一日数据</div>
                <div className="content">
                    <table className={scrollStatus ? "date scroll_active" : 'date'}>
                        <tr>
                            <th>日期</th>
                        </tr>
                        <tr>
                            {StatementList && StatementList.length ? StatementList.map(({AvgScore, MaxScoreCount, MaxScoreRate, PassScoreCount, PassScoreRate, SDate, SchoolJoinCount, StudentJoinCount}, index) => (
                                <tr key={index}>
                                    <td>{moment(SDate).format('YYYY-MM-DD')}</td>
                                </tr>
                            )) : null}
                        </tr>
                    </table>
                    <div className={'table'} onScroll={this.handleScroll}>
                        <table>
                            <tr>
                                {tableType.map((item, index) => <th key={index}>{item}</th>)}
                            </tr>
                            {StatementList && StatementList.length ? StatementList.map(({AvgScore, MaxScoreCount, MaxScoreRate, PassScoreCount, PassScoreRate, SDate, SchoolJoinCount, StudentJoinCount}, index) => (
                                <tr key={index}>
                                    <td>{SchoolJoinCount}</td>
                                    <td>{StudentJoinCount}</td>
                                    <td>{AvgScore}</td>
                                    <td>{PassScoreCount}</td>
                                    <td>{PassScoreRate * 100}%</td>
                                    <td>{MaxScoreCount}</td>
                                    {/*<td>{MaxScoreRate}</td>*/}
                                </tr>
                            )) : null}
                        </table>
                    </div>

                </div>
                {/*<div className="test"></div>*/}
            </div>
        )
    }
}

export default StatementPage