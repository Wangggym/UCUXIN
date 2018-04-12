import React from 'react'
import PropTypes from 'prop-types'
import { PullRefreshWrappedComp, NoAccordionCourse } from '../../../components'
class NoAccordionCourseList extends React.Component {
    render() {
        const { ViewModelList } = this.props
        return (
            <div>
                {ViewModelList.map((item,i) => <NoAccordionCourse key={i} {...item} />)}
            </div>
        )
    }
}

//限定控件传入的属性类型
NoAccordionCourseList.propTypes = {

}

//设置默认属性
NoAccordionCourseList.defaultProps = {

}

export default PullRefreshWrappedComp()(NoAccordionCourseList)
