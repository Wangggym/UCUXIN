import React from 'react'
import PropTypes from 'prop-types'
import {trainPlan} from '../../api'
import {CourseItem, StudyStatus, LongListWrappedComp} from '../../components'
import {Link, withRouter} from 'react-router-dom'

class MyCourse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleClick = (courseType, ID) => {
    let pathname = null
    if (courseType == '0' || courseType === undefined) pathname = `/train-course/${ID}`
    else if (courseType == '4'){
      pathname = `/course-ware/${ID}`
    }
    else pathname = `/course-detail/${ID}`
    this.props.history.push({pathname})
  }

  render() {
    const {ID, CourseType} = this.props
    return (
      <div className='my-course-list'>
        <CourseItem {...this.props} blankTotalFee
                    onClick={() => this.handleClick(CourseType, ID)}/>
        <StudyStatus {...this.props} />
      </div>
    )
  }
}

//限定控件传入的属性类型
MyCourse.propTypes = {}

//设置默认属性
MyCourse.defaultProps = {}

export default LongListWrappedComp()(withRouter(MyCourse))



