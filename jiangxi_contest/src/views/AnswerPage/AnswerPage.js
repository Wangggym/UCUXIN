import React from 'react'
import {withRouter} from 'react-router-dom'
// import './AnswerPage.less'
import Api from '../../api'
import md5 from 'blueimp-md5';
import {Toast} from 'antd-mobile'
import Config from '../../api/config'
//初始化总时长
const initAllUseTime = 6 * 60
//格式化答案
const format = (Answers) => {
    let newAnswers = ''
    Answers.forEach(item => {
        newAnswers += item
    })
    return newAnswers
}
// const testAnswers = () => {
//     let arr = []
//     for (let i = 0; i < 20; i++) {
//         arr.push('A')
//     }
//     return arr
// }


class AnswerPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Questions: [],
            step: 0,
            Answers: [],
            completedAnswer: false,
            endTest: false,
            getAnswersLoading: true,
            completedLoading: true,
            Score: 0,
            UsingTime: initAllUseTime,
            LeftSecond: 360
        }
        this.UsingTime = initAllUseTime
        // this.timestamp = null
        this.timer = null
        this.getPaperTime = null
    }

    //获得随机试卷 开始答题并计时
    componentDidMount() {
        if (sessionStorage.getItem("Score")) {
            const Score = JSON.parse(sessionStorage.getItem("Score"))
            return this.setState({completedAnswer: true, ...Score})
        }
        Toast.loading('加载中...')
        const umid = this.props.match.params.umid
        Api.GetRandomPaparInfo({umid, testType: JSON.parse(sessionStorage.getItem("testType"))}).then(res => {
            if (!res) return
            if (res.Ret === 0) {
                const {RandomPaperID} = res.Data
                const umidData = JSON.parse(localStorage.getItem(umid)) || {Answers: [], RandomPaperID: null}
                const Answers = umidData.RandomPaperID === RandomPaperID ? umidData.Answers : []
                localStorage.setItem(umid, JSON.stringify({RandomPaperID, Answers}))
                const step = Answers.length ? Answers.length - 1 : 0
                this.setState({...res.Data, Answers, step})
                this.getPaperTime = setTimeout(() => fetch(`./ADEContestPaperJson/${RandomPaperID}.json`, {headers: {'Connection': 'Keep-Alive',}})
                    .then(res => res.json())
                    .then(d => {
                        this.setState({Questions: d.Questions}, () => this.endLoading())
                    }), 2000)
                fetch(Config.getPaperCDN(RandomPaperID), {headers: {'Connection': 'Keep-Alive',}})
                    .then(res => res.json())
                    .then(d => {
                        this.setState({Questions: d.Questions}, () => {
                            clearTimeout(this.getPaperTime)
                            this.endLoading()
                        })
                    })
            } else {
                Toast.fail(res.Msg)
                setTimeout(() => {
                    Toast.hide()
                    this.handleLinkTo("/ConfirmPage/" + this.props.match.params.umid)
                }, 1500)
            }
            if (!res.Data) return;
        })
    }

    //结束loading效果
    endLoading() {
        setTimeout(() => {
            Toast.hide()
            this.setState({getAnswersLoading: false})
        }, 500)
    }

    //选着答案
    handleSelect = (Sign) => {
        const umid = this.props.match.params.umid
        const {Answers, step} = this.state
        const newAnswers = [...Answers]
        newAnswers[step] = Sign
        this.setState({Answers: newAnswers})
        const umidData = JSON.parse(localStorage.getItem(umid))
        localStorage.setItem(umid, JSON.stringify({...umidData, Answers: newAnswers}))
    }

    //跳转
    handleLinkTo = (pathname) => {
        sessionStorage.removeItem("Score");
        this.props.history.replace({pathname})
    }

    //提交试卷
    handleSumbit = () => {
        const {TestRecordID, RandomPaperID, Answers, SDate} = this.state
        const UMID = this.props.match.params.umid
        const formatAnswers = format(Answers)
        // const UsingTime = this.UsingTime * 50
        const date = SDate ? SDate.replace(/\-/g, "/") : ''
        const Sign = md5(RandomPaperID + formatAnswers + new Date(date) / 1000)
        // const min = RandomPaperID + formatAnswers + new Date(date) / 1000
        const body = {
            UMID,
            // UsingTime,
            Answers: formatAnswers,
            RandomPaperID,
            TestRecordID,
            Sign,
            // min,
        }
        // console.log(body)
        // alert(JSON.stringify(body))
        Toast.loading('正在提交试卷...')
        // alert(RandomPaperID + formatAnswers + new Date(date) / 1000 + '::' + md5(RandomPaperID + formatAnswers + new Date(date) / 1000))
        Api.SubmitAnswer({body}).then(res => {
            setTimeout(() => {
                Toast.hide()
                if (!res) return;
                if (res.Ret === 0) {
                    this.setState({completedAnswer: true, ...res.Data})
                    const umid = this.props.match.params.umid
                    localStorage.removeItem(umid)
                    sessionStorage.setItem("Score", JSON.stringify(res.Data))

                } else {
                    Toast.fail(res.Msg)
                    setTimeout(() => {
                        Toast.hide()
                        this.handleLinkTo("/ConfirmPage/" + this.props.match.params.umid)
                    }, 1500)
                }
                if (!res.Data) return;
            }, 500)
        })
    }
    //step
    handleGetNewStep = (step) => {
        this.setState({step})
    }

    //计算百分比
    getPercent = () => {
        const {Answers, Questions} = this.state
        const percent = Math.ceil(Answers.length / Questions.length * 100)
        return percent + '%'
    }

    //获得当前用时
    handleGetTime = (UsingTime) => {
        this.UsingTime = UsingTime
        this.handleSumbit()
    }

    //停止计时
    stopTime = () => {
        this.setState({endTest: !this.state.endTest})
    }

    render() {
        const {Questions, step, Answers, completedAnswer, endTest, Score, UsingTime, getAnswersLoading, LeftSecond} = this.state
        const percent = this.getPercent()
        const getUsingTime = (UsingTime) => {
            const second = UsingTime % 60
            const minute = (UsingTime - second) / 60
            if (!minute) return <div className="time">耗时 <span className="blue">{second}</span>秒</div>
            return <div className="time">耗时 <span className="blue">{minute}</span>分<span
                className="blue">{second}</span>秒</div>
        }
        return (
            <div className="AnswerPage">
                {!completedAnswer ? <div className="inner">
                        {!getAnswersLoading && <div className="start-answer">
                            <div className="status">
                                <div className="progress-bar">
                                    <div className="progress-bar_title">已完成/总题：{Answers.length}/{Questions.length}</div>
                                    <div className="progress_line">
                                        <div className="progress-bar_line">
                                            <div className="progress-bar_line_show"
                                                 style={{width: percent}}>
                                                {/*<div className="progress-bar_icon"></div>*/}
                                            </div>
                                        </div>
                                        <div className="progress-bar_text">{percent}</div>
                                    </div>
                                </div>
                                <Timer
                                    getTime={this.handleGetTime}
                                    endTest={endTest}
                                    allTime={LeftSecond}
                                />
                            </div>
                            <AnswerItem
                                {...Questions[step]}
                                step={step}
                                length={Questions.length}
                                Answers={Answers[step]}
                                onClick={this.handleSelect}
                            />
                            {Answers.length === Questions.length && Questions.length !== 0 &&
                            <div className='submit' onClick={this.stopTime}>
                                <div>交卷</div>
                            </div>}
                            <Footer
                                step={step}
                                length={Questions.length}
                                onClick={this.handleGetNewStep}
                                Answers={Answers[step]}
                            />
                        </div>}
                    </div>
                    : <div className="complete-answer">
                        <div className="title">
                            答题结束，感谢您的参与
                        </div>
                        <div className="exam-data">
                            <div>
                                <div className="exam-data-title">本次考试成绩</div>
                                <div className="score">{Score}分</div>
                                {getUsingTime(UsingTime)}
                            </div>
                        </div>
                        <div className="link-to">
                            <div onClick={() => this.handleLinkTo("/ConfirmPage/" + this.props.match.params.umid)}
                                 className='blue botton'>再答一次
                            </div>
                            <div onClick={() => this.handleLinkTo("/")}
                                 className='green botton'>返回首页
                            </div>
                        </div>
                    </div>}
            </div>
        )
    }
}


class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            allTime: props.allTime,
            limitSubmitBool: true
        }
        this.timer = null
        this.millisecondTimer = null
        this.useTime = 0
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.endTest !== this.props.endTest) {
            const limitTime = 15 - (360 - this.props.allTime)
            if (this.props.allTime - this.state.allTime <= limitTime) {
                Toast.info('超过15秒才能提交哦')
                return setTimeout(() => {
                    Toast.hide()
                }, 1500)
            }
            clearInterval(this.timer)
            clearInterval(this.millisecondTimer)
            if (this.limitSubmit()) this.props.getTime(this.useTime)

        }
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            const newAllTime = this.state.allTime - 1
            this.setState({allTime: newAllTime})
            if (!newAllTime) {
                clearInterval(this.timer)
                clearInterval(this.millisecondTimer)
                if (this.limitSubmit()) this.props.getTime(this.useTime)
            }
        }, 1000)
        // 后台所需要得时间
        this.millisecondTimer = setInterval(() => {
            const newUseTime = this.useTime + 1
            this.useTime = newUseTime
        }, 50)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
        clearInterval(this.millisecondTimer)
    }

    //只提交一次限制
    limitSubmit() {
        const {limitSubmitBool} = this.state
        if (limitSubmitBool) {
            this.setState({limitSubmitBool: false})
            return true
        }
        return false
    }

    getCurrentTime = () => {
        const {allTime} = this.state
        const second = allTime % 60
        const minute = (allTime - second) / 60
        return <div className="count-down_time"><span>{minute}</span>分<span>{second}</span>秒</div>
    }

    render() {
        return <div className="count-down">
            {this.getCurrentTime()}
            <div className="count-down_name">倒计时</div>
        </div>
    }
}

const AnswerItem = ({step, length, Content, Options, Score, Answers, onClick, QuestionType}) => {
    const getCurrentAnswersLabel = (Sign) => {
        if (Answers === Sign) return <span className='quan active'></span>
        return <span className='quan'></span>
    }
    return <div className="answerItem">
        <div className="title">
            <div>
                <span className="number">{step + 1}/{length}</span>
                <span className="type">[单选题]</span>
                <span className="direction">{QuestionType}</span>
            </div>
            <div className="score">满分: <span>{Score}</span></div>
        </div>
        <div className='answer-content'>
            <p className="name">
                {step + 1}、{Content}
            </p>
            {Options && Options.length ? Options.map(({Sign, Content}) => {
                if (!Content) return
                return <div className='answer_option' key={Sign} onClick={() => onClick(Sign)}>
                    {getCurrentAnswersLabel(Sign)}
                    <span className='text'>{Sign}、{Content}</span>
                </div>
            }) : null}
        </div>
    </div>
}

const Footer = ({step, length, onClick, Answers}) => {
    return <div className='footer'>
        <span className={step !== 0 ? 'prev' : 'prev footer_prev_disable'}
              onClick={() => step !== 0 && onClick(step - 1)}>上一题</span>
        <span className={step + 1 !== length && Answers ? 'next' : 'next footer_next_disable'}
              onClick={() => step + 1 !== length && Answers && onClick(step + 1)}>下一题</span>
    </div>
}

export default withRouter(AnswerPage)

