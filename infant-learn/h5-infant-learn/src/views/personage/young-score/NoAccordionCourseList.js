import React from 'react'
import PropTypes from 'prop-types'
import Course from './../../../components/TrainPlanList/Course';

import { PullRefreshWrappedComp,LongListWrappedComp } from '../../../components'
class NoAccordionCourseList extends React.Component {
    render() {
        return (
          <Course onlyYongScorePadding="onlyYongScorePadding" {...this.props}/> //onlyYongScorePadding只有幼学学分的列表才需要padding
        )
    }
}

//限定控件传入的属性类型
NoAccordionCourseList.propTypes = {

}

//设置默认属性
NoAccordionCourseList.defaultProps = {

}

export default LongListWrappedComp()(NoAccordionCourseList)
