import React from 'react'
import PropTypes from 'prop-types'
import { PullRefreshWrappedComp, NoAccordionCourse,LongListWrappedComp } from '../../../components'
class NoAccordionCourseList extends React.Component {
    render() {
        return (
            <NoAccordionCourse  {...this.props} />
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
