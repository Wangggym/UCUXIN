import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Button} from 'antd-mobile'
// import './ConfirmPage.less'
import {LinkTo} from '../../components'
import Api from '../../api'
import {Toast} from 'antd-mobile'
import CareImg from '../../assets/images/read2x.png'
import Config from '../../api/config/index'

class ConfirmPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            IsTesting: false,
            LeftChanceCount: 0,
            canTest: false,
        }
    }

    componentDidMount() {
        Toast.loading('加载中...', 999)
        sessionStorage.removeItem("Score")
        const umid = this.props.match.params.umid;
        Api.CheckSemFinalTicket({umid}).then(res => {
            setTimeout(() => Toast.hide(), 200)
            if (!res) return;
            if (!res.Data) return;
            if (res.Ret === 0) {
                this.setState({canTest: res.Data})
                if (res.Data) {
                    this.GetTestTimes()
                } else {
                    setTimeout(() => Toast.hide(), 200)
                }
            } else {
                Toast.fail(res.Msg)
                setTimeout(() => {
                    Toast.hide()
                }, 1500)
            }
        })
    }

    //获得试卷机会
    GetTestTimes = () => {
        const umid = this.props.match.params.umid;
        Api.GetTestTimes({umid, testType: JSON.parse(sessionStorage.getItem("testType"))}).then(res => {
            setTimeout(() => Toast.hide(), 200)
            if (!res) return;
            if (!res.Data) return;
            if (res.Ret === 0) {
                this.setState({...res.Data})
            } else {
                Toast.fail(res.Msg)
                setTimeout(() => {
                    Toast.hide()
                }, 1500)
            }
        })
    }

    //进入答题页面
    handleAnswer = () => {
        if (Config.InRelease) {
            Toast.info('版本发布中请稍后答题~')
            return setTimeout(() => {
                Toast.hide()
            }, 2000)
        }
        if (!this.state.LeftChanceCount) {
            Toast.info('已经没有考试机会了！')
            return setTimeout(() => {
                Toast.hide()
            }, 1000)
        }
        this.props.history.push({pathname: "/AnswerPage/" + this.props.match.params.umid})
    }

    //没有答题资格
    handleNotAnswer = () => {
        Toast.info('您没有复赛资格！')
        return setTimeout(() => {
            Toast.hide()
        }, 1000)
    }

    render() {
        const {IsTesting, LeftChanceCount, canTest} = this.state
        return (
            <div className="ConfirmPage">
                <div className="title">欢迎参加江西省青少毒品预防教育网上知识竞赛
                </div>
                <img src={CareImg}/>
                <div className="content mar_10">
                    <div className="read">
                        注意事项:
                    </div>
                    <div className="content_list">
                        <span className="content_list_icon">1</span>共计20题，限时6分钟内完成，且6分钟内不可重复答题；
                    </div>
                    <div className="content_list">
                        <span className="content_list_icon">2</span>答题一旦开始，系统自动扣去一次答题机会；
                    </div>
                    <div className="content_list">
                        <span className="content_list_icon">3</span>答题过程中不要切换到考试窗口之外的区域，此时系统继续计时到自动交卷；
                    </div>
                </div>
                {
                    canTest ?
                        <div className="btn" onClick={this.handleAnswer}>{IsTesting ? '继续答题' : '我已知晓，立即答题'}</div> :
                        <div className="btn" onClick={this.handleNotAnswer}>您没有复赛资格</div>
                }
                {
                    canTest ? <div className="tishi">剩余答题机会<span>{LeftChanceCount}</span>次</div> :
                        <div className="tishi">剩余答题机会<span>0</span>次</div>
                }
            </div>
        )
    }
}

export default withRouter(ConfirmPage)