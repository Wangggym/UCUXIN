import React from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd-mobile';
import { trainPlan } from '../../../api'
import PlanCourse from './PlanCourse'
import OwnCourse from './OwnCourse'
import { ButtonGroup } from '../../../components'
const TabPane = Tabs.TabPane;

export default class MyCourse extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            plan: 0,
            learn: 0,
            planForceUpdata: false,
            learnForceUpdata: false,
        }

    }

    handleStudySTClick(fields, value) {
        this.setState({ [fields]: value, [`${fields}ForceUpdata`]: !this.state[`${fields}ForceUpdata`] })
    }

    render() {
        const { plan, learn, planForceUpdata, learnForceUpdata } = this.state
        return (
            <Tabs
                defaultActiveKey="1"
                swipeable={false}
                className='app-tabs'
            >
                <TabPane tab={'培训学习课程'} key="1">
                    <ButtonGroup onClick={(value) => this.handleStudySTClick('plan', value)} active={plan} />
                    <PlanCourse api={trainPlan.getMyPlanCoursePage} forceUpdata={planForceUpdata} fields={{ StudyST: this.state.plan }} height={'85vh'}/>
                </TabPane>
                <TabPane tab={'自主学习课程'} key="2">
                    <ButtonGroup onClick={(value) => this.handleStudySTClick('learn', value)} active={learn} />
                    <OwnCourse api={trainPlan.getAutonoMyCoursePage} forceUpdata={learnForceUpdata} fields={{ StudyST: this.state.learn }} height={'85vh'}/>
                </TabPane>

            </Tabs>
        )
    }
}


//限定控件传入的属性类型
MyCourse.propTypes = {

}

//设置默认属性
MyCourse.defaultProps = {

}


