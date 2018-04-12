import React from 'react'
import PropTypes from 'prop-types'
import { CourseItem, StudyStatus, LongListWrappedComp } from '../../../components'
import { Link } from 'react-router-dom'

class PlanCourse extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    
    render() {
        return (
            <div>
                <Link to={`/course-detail/${this.props.ID}`}>
                    <CourseItem {...this.props} blankTotalFee />
                </Link>
                <StudyStatus {...this.props} />
            </div>
        )
    }
}

//限定控件传入的属性类型
PlanCourse.propTypes = {

}

//设置默认属性
PlanCourse.defaultProps = {

}

export default LongListWrappedComp()(PlanCourse)
