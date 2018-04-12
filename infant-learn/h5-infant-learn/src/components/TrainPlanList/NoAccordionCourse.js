import React, { Component } from 'react'
import Course from './Course'
import './NoAccordionCourse.scss'
import { Icon } from 'antd-mobile'
import { NoContent } from '../index'

// const NoAccordionCourse = ({ TrainPlanName, Credit, UserTrainCreditCourseDetailH5Model }) => (
//   <div className='plan'>
//     <div className='title'>
//       <span>培训项目：{TrainPlanName}</span>
//       <span>{Credit}学分</span>
//     </div>
//     {
//
//
//       UserTrainCreditCourseDetailH5Model && UserTrainCreditCourseDetailH5Model.length!==0&&UserTrainCreditCourseDetailH5Model.map((e, i) => {
//         return (
//           <div key={i}>
//             <Course {...e} />
//             <div className='border-bottom1PX' />
//           </div>
//         )
//       })
//     }
//
//   </div>
// )
class NoAccordionCourse extends Component{
  constructor(props){
    super(props)
  }
  render(){
    const {TrainPlanName,Credit,UserTrainCreditCourseDetailH5Model}=this.props;
    return(
      <div className='plan'>
        <div className='title'>
          <span>培训项目：{TrainPlanName}</span>
          <span>{Credit}学分</span>
        </div>
        {
          UserTrainCreditCourseDetailH5Model && UserTrainCreditCourseDetailH5Model.length!==0&&UserTrainCreditCourseDetailH5Model.map((e, i) => {
            return (
              <div key={i}>
                <Course {...e} />
                <div className='border-bottom1PX' />
              </div>
            )
          })
        }

      </div>
    )
  }
}

export default NoAccordionCourse;
