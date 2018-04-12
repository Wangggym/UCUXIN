import React from 'react'
import PropTypes from 'prop-types'
import {trainPlan} from '../../../api'
import {CourseItem, timeFormatFunc, LongListWrappedComp} from '../../../components'
import {Link} from 'react-router-dom'
import './LecturerDynamic.scss'

class LecturerDynamic extends React.Component {

  handleClick = (dynamicID, CourseID) => {

    // 读取讲师动态消息
    trainPlan.readLecturerDynamic({dynamicID}).then(res => {
      if (!res) return
      if (res.Ret === 0) return
    })
  }

  render() {
    const {LectureDynamicID, HeadPic, Name, Msg, CDate, CourseDynamicModel, CourseID, LectureID} = this.props;
    return (
      <div className='LecturerDynamic'>
        <div className='header'>
          <span className="lecturer-pic" style={{backgroundImage: `url(${HeadPic})`}}/>
          <div className='right'>
            <div className='title'>
              <span className='name'>{Name}</span>
              <span className='time'>{timeFormatFunc(CDate)}</span>
            </div>
            <div className='content'>{Msg}</div>
          </div>
        </div>
        <Link to={`/course-detail/${CourseID}`} className="lecturer-dynamic" onClick={() => this.handleClick(LectureDynamicID)}>
          <div className="lecturer-cover" style={{backgroundImage: `url(${CourseDynamicModel.CoverImg})`}}/>
          <div className="lecturer-dynamic-intro">
            <h3>{CourseDynamicModel.Name}</h3>
            <ul>
              <li>共{CourseDynamicModel.Count}个课时</li>
              <li>学分：{CourseDynamicModel.Credit}分</li>
              <li>授课方式：{CourseDynamicModel.TeachWayDesc}</li>
            </ul>
          </div>
        </Link>
   {/*     <Link to={} onClick={() => this.handleClick(LectureDynamicID)}>

          <CourseItem {...CourseDynamicModel} blankTotalFee/>
        </Link>*/}
      </div>
    )
  }
}

//限定控件传入的属性类型
LecturerDynamic.propTypes = {}

//设置默认属性
LecturerDynamic.defaultProps = {}

export default LongListWrappedComp(trainPlan.getMyLectureDynamic)(LecturerDynamic)
