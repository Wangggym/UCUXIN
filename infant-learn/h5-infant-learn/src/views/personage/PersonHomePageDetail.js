import React from 'react'
import PropTypes from 'prop-types'
import { trainPlan } from '../../api'
import { TrainPlanList, NoContent, HeadComp, ButtonGroup } from '../../components'
import './PersonHomePageDetail.scss'
import { Tabs, Icon, Accordion } from 'antd-mobile'
import PlanList from './PlanList'
import CourseList from './CourseList'
const TabPane = Tabs.TabPane
const PersonType = { 1: 'planList', 2: 'learnList' }
const groupType = [
    { key: 'achievement', value: '个人成就' },
    { key: 'resume', value: '个人简历' },
    { key: 'learn-flie', value: '学习档案' },
]

export default class PersonHomePageDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            planList: [],
            learnList: [],
            anchorName: 'achievement',

        }
    }

    componentDidMount() {
        this.getMineDetail()
    }

    // 个人主页，获取我的
    getMineDetail() {
        trainPlan.getMineDetail().then(res => {
            if (!res) return
            if (res.Ret === 0) {
                const { UID } = res.Data
                this.setState({ ...res.Data })
                this.getUserYearCredit(1, UID)
                this.getUserYearCredit(2, UID)
            }
        })
    }

    getUserYearCredit(type, uid) {
        trainPlan.getUserYearCredit({ uid, type }).then(res => {
            if (!res) return
            if (res.Ret === 0) {
                this.setState({ [PersonType[type]]: res.Data })
            }
        })
    }

    scrollToAnchor = (anchorName) => {
        console.log()
        this.setState({ anchorName })
        if (anchorName) {
            // 找到锚点
            let anchorElement = document.getElementById(anchorName);
            // 如果对应id的锚点存在，就跳转到锚点
            if (anchorElement) { anchorElement.scrollIntoView(); }
        }
    }

    render() {
        const { planList, learnList, anchorName } = this.state
        return (
            <div className='person-detail'>
                <HeadComp {...this.state} noInfo />
                <ButtonGroup groupType={groupType} onClick={this.scrollToAnchor} className={'anchor'} active={anchorName} />
                <div className='content-item' id='achievement'>
                    <span>个人成就</span>
                    <p>{this.state.Achievement}</p>
                </div>
                <div className='content-item' id='resume'>
                    <span>个人简历</span>
                    <p>{this.state.Intro}</p>
                </div>
                <div className='blank-title' id='learn-flie'>
                    学习档案
                </div>
                <Tabs defaultActiveKey="1" animated={true} swipeable={false}>
                    <TabPane tab='培训学习' key="1">
                        <Accordion accordion className="annual" openAnimation={{}}>
                            {planList && planList.length ? planList.map(({ Year, Credit, QtyLearnCourse, QtyPassLearnCourse }, index) => (
                                <Accordion.Panel
                                    key={index}
                                    header={
                                        <div className='annual-title'>
                                            <span>{Year}年度</span>
                                            <span className='orange-color'>获得学分：{Credit}</span>
                                        </div>}
                                >
                                    <PlanList api={trainPlan.getUserTrainCreditDetail} fields={{ uid: 0, year: Year }} />
                                </Accordion.Panel>
                            )) : <NoContent />}
                        </Accordion>
                    </TabPane>
                    <TabPane tab='自主学习' key="2">
                        <Accordion accordion className="annual" openAnimation={{}}>
                            {learnList && learnList.length ? learnList.map(({ Year, Credit, QtyLearnCourse, QtyPassLearnCourse }, index) => (
                                <Accordion.Panel
                                    key={index}
                                    header={
                                        <div className='annual-title'>
                                            <span>{Year}年度</span>
                                            <span className='orange-color'>获得学分：{Credit}</span>
                                        </div>}
                                >
                                    <CourseList api={trainPlan.getUserSelfCreditDetail} fields={{ uid: 0, year: Year }} />
                                </Accordion.Panel>
                            )) : <NoContent />}
                        </Accordion>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

//限定控件传入的属性类型
PersonHomePageDetail.propTypes = {

}

//设置默认属性
PersonHomePageDetail.defaultProps = {

}