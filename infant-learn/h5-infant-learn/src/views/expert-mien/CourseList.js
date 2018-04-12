import React from 'react'
import {CourseItem} from '../../components'
import {withRouter} from 'react-router-dom'

class CourseList extends React.Component {
  handleClick = (courseType, ID) => {
    let pathname = null
    if (courseType == '0' || courseType == undefined) pathname = `/train-course/${ID}`
    else if (courseType == '4') pathname = `/course-ware/${ID}`
    else pathname = `/course-detail/${ID}`
    this.props.history.push({pathname})
  }

  render() {
    const {ID, CourseType} = this.props
    return (
      <CourseItem {...this.props} blankTotalFee onClick={()=>this.handleClick(CourseType, ID)}/>
    )
  }
}

export default withRouter(CourseList)

