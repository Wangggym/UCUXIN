//学校报表页

import React from 'react'
import {Tabs} from '../../components'
// import './SchoolChartsPage.less'
import RankingCharts from './components/RankingCharts' //柱状图表
import PieChart from './components/PieChart' //饼状图表
import Api from '../../api'
import {Toast} from 'antd-mobile';
import moment from 'moment'

class SchoolChartsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            active: 1,
            schoolChartsData: {
                AVGScore: 0,
                CakeScores: null,
                JoinCount: 0,
                Rank: 0,
                SchoolTotalCount: 0,
                Top10Schools: null,
            },
            classList: [],
            schoolChartsDataLoading: true,
            classListLoading: true,
        }
    }

    componentDidMount() {
        Api.GetSchoolJoinReport().then(res => {
            this.setState({schoolChartsDataLoading: false})
            if (!res) return
            if (res.Ret === 0) {
                this.setState({schoolChartsData: res.Data})
            } else {
                Toast.fail(res.Msg)
                setTimeout(() => {
                    Toast.hide()
                }, 1500)
            }
            if (!res.Data) return
        })
        Api.GetClassJoinCountRankReport().then(res => {
            this.setState({classListLoading: false})
            if (!res) return
            if (res.Ret === 0) {
                this.setState({classList: res.Data})
            } else {
                Toast.fail(res.Msg)
                setTimeout(() => {
                    Toast.hide()
                }, 1500)
            }
            if (!res.Data) return
        })

    }

    //tabs选项卡切换
    handleTabsChange = (active) => {
        this.setState({active})
    }

    render() {
        const {active, schoolChartsData: {AVGScore, CakeScores, JoinCount, Rank, SchoolTotalCount, Top10Schools, LastUDate}, classList, schoolChartsDataLoading, classListLoading} = this.state
        return (
            <div className="SchoolChartsPage">
                <Tabs onClick={this.handleTabsChange} groupType={[
                    {key: 1, value: '参赛概况'},
                    {key: 2, value: '班级排名'},
                ]} active={active}/>
                {
                    active === 1 && !schoolChartsDataLoading && <div className="ranking_top10_wrap">
                        <div className="ranking_top10">
                            <div className="right">
                                <h3>知识竞赛参与情况排名前十(全省)</h3>
                                <p>更新日期：{LastUDate}</p>
                            </div>
                             <div className="ranking">
                                 {Rank < 4 ? <div className="count pic">{Rank}</div>:<div className="count">{Rank}</div>}
                                <div className="text">我校排名</div>
                            </div>

                        </div>
                        {Top10Schools && <RankingCharts Top10Schools={Top10Schools}/>}
                        <div className="blank"></div>
                        <div className="statistics">
                            <div className="top">
                                <span className="name">全校总人数</span>
                                <span className="count">{SchoolTotalCount}人</span>
                            </div>
                            <div className="bottom">
                        <span>
                            <div>{JoinCount}</div>
                            <p>参与人数</p>
                        </span>
                                <span>
                            <div>{AVGScore}</div>
                            <p>竞赛平均分</p>
                        </span>
                            </div>
                        </div>
                        <div className="blank"></div>
                        {CakeScores && <PieChart CakeScores={CakeScores}/>}
                    </div>
                }

                {
                    active === 2 && !classListLoading && <div className="class_ranking">
                        <div className="title">
                            我校各班排名情况
                        </div>
                        <div className="table-wrap">
                            <div className="table_th">
                                <span>排名</span>
                                <span className="class">班级</span>
                                <span>参与人数</span>
                                <span>平均分</span>
                            </div>
                            {classList && classList.length ? classList.map(({AVGScore, ClassName, JoinCount}, index) =>
                                <div className="table_td" key={index}>
                                <span>
                                    <span className={`circle ${'rank_0' + (index + 1)}`}>
                                        {index > 2 && index + 1}
                                    </span>
                                </span>
                                    <span className="class">{ClassName}</span>
                                    <span>{JoinCount}</span>
                                    <span>{AVGScore.toFixed(2)}</span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default SchoolChartsPage
