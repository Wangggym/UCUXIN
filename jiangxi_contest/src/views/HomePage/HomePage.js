import React from 'react'
import {withRouter} from 'react-router-dom'
// import './HomePage.less'
import {LinkTo, ModalContent} from '../../components'
import Api from '../../api'
import {Toast} from 'antd-mobile';
import banner from '../../assets/images/zhishi.jpg'

const contestType = [
    {
        color: true,
        isEnd: 'is_end',
        time: '2017.11.01-2017.11.30'
    },
    {
        color: true,
        isEnd: 'is_end',
        time: '2017.12.01-2017.12.10'
    },
    {
        color: false,
        time: '2017.12上旬'
    },
]


class HomePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            info: [
                {
                    "GID": 0,
                    "GName": 0,
                    "MType": 0,
                    "UMID": 0,
                    "MName": 0,
                },
            ],
            CurRanks: [],
            JoinCounts: [
                {
                    Count: 999,
                    TestType: 1
                },
                {
                    Count: 100,
                    TestType: 2
                }
            ],
            loading: true,
            data: null,
            visibleModal: false,
        }
    }

    componentWillMount() {
        document.title = '禁毒知识竞赛'
    }

    componentDidMount() {
        Toast.loading('加载中...', 999)
        fetch('./manifest.json')
            .then(res => res.json())
            .then(d => {
                window.console.log(d)
            })
        if (!sessionStorage.getItem("userinfo")) {
            Api.GetUserMembers().then(res => {
                if (!res) return;
                if (res.Ret === 0) {
                    const info = res.Data
                    sessionStorage.setItem("userinfo", JSON.stringify(info))
                    this.setState({info})
                    this.checkStatus()
                } else {
                    Toast.fail(res.Msg)
                    setTimeout(() => {
                        Toast.hide()
                    }, 1500)
                }
                if (!res.Data) return
            })
        } else {
            this.setState({info: JSON.parse(sessionStorage.getItem("userinfo"))}, () => this.checkStatus())
        }
        Api.GetJoinSumInfo().then(res => {
            if (!res) return;
            if (res.Ret === 0) {
                this.setState({...res.Data})
                this.checkStatus()
            } else {
                Toast.fail(res.Msg)
                setTimeout(() => {
                    Toast.hide()
                }, 1500)
            }
            if (!res.Data) return;
        })
    }

    //检查获取状态关闭loading效果
    checkStatus = () => {
        if (sessionStorage.getItem("userinfo")) {
            this.setState({loading: false}, () => Toast.hide())
            if (!JSON.parse(sessionStorage.getItem("userinfo")).length) {
                Toast.info('“此竞赛仅限江西学校学生参与”')
                setTimeout(() => {
                    Toast.hide()
                }, 2000)
            }
        }
    }

    //跳转到
    handleLinkTo = (pathname) => {
        const {info} = this.state
        if (info.length === 1) {
            this.props.history.push({pathname: '/' + pathname + '/' + info[0].UMID})
        } else {
            this.props.history.push({pathname: '/IdentityChoose/' + pathname})
        }
    }

    //检查跳转状态
    handleCheckStatus = (pathname, status, testType) => {
        if (!status) {
            Toast.info('别太心急啦，开赛时间还没到哦～')
            return setTimeout(() => Toast.hide(), 2000)
        }
        if (!sessionStorage.getItem("UCUX_OCS_AccessToken")) {
            Toast.fail('请重新登陆身份')
            return setTimeout(() => {
                Toast.hide()
            }, 1500)
        }
        if (!JSON.parse(sessionStorage.getItem("userinfo")).length) {
            Toast.info('“此竞赛仅限江西学校学生参与”')
            return setTimeout(() => {
                Toast.hide()
            }, 2000)
        }
        if (testType === 2) return  this.props.history.push({pathname: '/NoResultsPage'})
        // if (testType === 2) return  this.props.history.push({pathname: '/SecondContestResultPage'})
        if (testType) sessionStorage.setItem("testType", testType)
        this.handleLinkTo(pathname)
    }

    handleChangeVisible = (visibleModal) => {
        this.setState({visibleModal})
    }

    render() {
        const {JoinCounts} = this.state
        const getCount = (index) => {
            let count = 0
            JoinCounts.forEach(item => {
                if (item.TestType === index) {
                    count = item.Count
                }
            })
            return count
        }
        return (
            <div className="HomePage">
                <img src={banner} alt=""/>
                <div className="top-entrance">

                    <LinkTo to="/CompetitionRule" className="CompetitionRule">
                        竞赛规则
                    </LinkTo>
                    <div className="MyGrade" onClick={() => this.handleLinkTo("MyGrade")}>
                        我的成绩
                    </div>
                    <div className="knowledge"
                         onClick={() => window.location.href = '//mp.weixin.qqcom/mp/homepage?__biz=MzA4NzkxNTc4Mg==&hid=9'}>
                        竞赛学习
                    </div>
                </div>
                <div className='main'>
                    <LinkTo className='top10' to="/RankingList">
                        <div className="left"></div>
                        <div className='center'>
                            <div className='sm'>参与排名TOP10</div>
                            {/*<div>*/}
                            {/*(我校全省{CurRanks.length ? '排名第' + CurRanks[0].Rank : '暂无排名'}{CurRanks.length > 1 && '……'})</div>*/}
                        </div>
                        <div className='right'></div>
                    </LinkTo>
                    {
                        contestType.map(({color, time, isEnd}, index) => {
                            return <div className={`game contest_${index + 1}_${color ? 'show' : 'hide'} ${isEnd}`}
                                        onClick={() => this.handleCheckStatus(index + 1 === 1 ? "FirstContestResultPage" : "ConfirmPage", color, index + 1)}
                                        key={index}>
                                {index + 1 === 3 ? null : <div className="ba_line"></div>}
                                <div className='left'></div>
                                <div className='center'>
                                    <div className="center_pic"></div>
                                    <div className="center_pic_text" style={!color ? {color: "#ccc"} : null}>
                                        {time}
                                    </div>
                                    <div className="center_pic_text" style={!color ? {color: "#ccc"} : null}>
                                        最新参与人次:<span
                                        style={!color ? {color: "#ccc"} : null}>{getCount(index + 1)}</span>
                                    </div>
                                    <div className="center_position"></div>
                                </div>
                                <div className='right'></div>
                            </div>
                        })
                    }
                    <ModalContent
                        onChangeVisible={this.handleChangeVisible}
                        visible={this.state.visibleModal}
                    >
                        网络初赛已经结束，复赛资格名单正在统计中，请稍后访问……
                    </ModalContent>
                </div>
                <div className="footer">
                    <div className="title"> 主办单位</div>
                    <div>江西省禁毒委员会办公室</div>
                    <div>江西省教育厅</div>
                    <div>共青团江西省委员会</div>
                    <div className="title top">协办单位</div>
                    <div>江西新华发行集团有限公司</div>
                </div>
            </div>
        )
    }
}

export default withRouter(HomePage)