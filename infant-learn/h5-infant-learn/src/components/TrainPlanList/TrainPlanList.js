import React from 'react'
import PropTypes from 'prop-types'
import Course from './Course'
import NoAccordionCourse from './NoAccordionCourse'
import './TrainPlanList.scss'
import { Icon, Accordion } from 'antd-mobile'
import { trainPlan } from '../../api'
import { PullRefreshWrappedComp } from '../index'


const TrainPlanList = ({ Year, Credit, QtyLearnCourse, QtyPassLearnCourse }) => (
    <Accordion accordion className="annual" onChange={this.onChange} >
        <Accordion.Panel header={
            <div className='annual-title'>
                <span>{Year}年度</span>
                <span className='orange-color'>获得学分：{Credit}</span>
            </div>}>
            {/* <PlanList api={trainPlan.getUserTrainCreditDetail} fields={{ uid: 0, year: Year }} pSize={1} /> */}
        </Accordion.Panel>
    </Accordion>
)

//限定控件传入的属性类型
TrainPlanList.propTypes = {

}

//设置默认属性
TrainPlanList.defaultProps = {

}
export default TrainPlanList
