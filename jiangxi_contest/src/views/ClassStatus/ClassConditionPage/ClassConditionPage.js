import React from 'react'
import {Tabs, NoContent} from '../../../components'
// import './ClassConditionPage.less'
import {Accordion, List} from 'antd-mobile';
import Api from '../../../api'
import {Toast} from 'antd-mobile';

//时间显示转换
const getTime = (time) => {
    const millisecond = time % 1000 //毫秒数  单位ms
    const remainSecond = (time - millisecond) / 1000 //余下的秒数  单位s
    const second = remainSecond % 60//秒数 单位s
    const minute = (remainSecond - second) / 60 //分数 单位m
    const newTime = minute ? minute + '分' + second + '秒' + Math.round(millisecond / 10) : second + '秒' + Math.round(millisecond / 10)
    return newTime
}

class ClassConditionPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            active: 1,
            testData: {},
        }
    }

    componentDidMount() {
        this.GetClassJoinReport()
    }


    //获取班级参与情况报表
    GetClassJoinReport = () => {
        const {gid, classID} = this.props.match.params
        const {active} = this.state
        Api.GetClassJoinReport({gid, classID, testType: active}).then(res => {
            if (!res) return;
            if (res.Ret === 0) {
                this.setState({testData: {[active]: res.Data}})
            } else {
                Toast.fail(res.Msg)
                setTimeout(() => {
                    Toast.hide()
                }, 1500)
            }
            if (!res.Data) return
        })
    }

    handleTabsChange = (active) => {
        this.setState({active, testData: {}}, () => this.GetClassJoinReport())
    }


    //tab切换后获得内容
    getContent = () => {
        const {active, testData} = this.state
        if (active === 1 && testData[1]) return <PersonGrade data={testData[1]}/>
        if (active === 2 && testData[2] && testData[2].JoinCount) {
            return <PersonGrade data={testData[2]}/>
        } else {
            return <NoContent>很遗憾，您所在的班级参赛学生成绩<br/>不符合复赛资格</NoContent>
        }
    }

    render() {
        const {active, testData} = this.state
        return (
            <div className="ClassConditionPage">
                <Tabs onClick={this.handleTabsChange} active={active}/>
                <div className="content">
                    {this.getContent()}
                </div>
            </div>
        )
    }
}

export default ClassConditionPage

const AccordionHeader = ({BestScore, BestUsingTime, MName}) => {
    return <div className="AccordionHeader">
        <div>{MName}</div>
        <p>最高成绩：<span className="blue">{BestScore}</span></p>
        <span>用时：{getTime(BestUsingTime)}</span>
    </div>
}


class PersonGrade extends React.Component {
    onChange = (key) => {
        console.log(key);
    }

    render() {
        const {ClassTotalCount, JoinCount, StudentScores} = this.props.data
        return (
            <div className="preliminary_contest">
                <div className="title">
                    <p>班级总人数：<span className="blue">{ClassTotalCount}</span></p>
                    <p>参赛人数：<span className="blue">{JoinCount}</span></p>
                </div>
                <Accordion accordion openAnimation={{}} className="my-accordion" onChange={this.onChange}>
                    {StudentScores && StudentScores.length ? StudentScores.map((item, index) => {
                            let element = null
                            if (item.TestRecords && item.TestRecords.length) {
                                element = <Accordion.Panel header={<AccordionHeader {...item}/>}
                                                           key={index}>
                                    <List className="my-list">
                                        <List.Item>
                                            <span>轮次</span>
                                            <span>分数</span>
                                            <span>用时</span>
                                        </List.Item>
                                        {item.TestRecords.map(({UsingTime, Score, Round}, index) =>
                                            <List.Item key={index}>
                                                <span>第一轮</span>
                                                <span>{Score}</span>
                                                <span>{getTime(UsingTime)}</span>
                                            </List.Item>
                                        )}
                                    </List>
                                </Accordion.Panel>
                            } else {
                                element = <div className="no_score">
                                    <div>{item.MName}</div>
                                    <p>未参赛</p><span></span></div>
                            }
                            return element
                        }
                    ) : null}
                </Accordion>
            </div>
        );
    }
}

