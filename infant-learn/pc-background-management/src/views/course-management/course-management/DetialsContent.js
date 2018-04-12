import React from 'react'
import {Icon} from 'antd'
import {getSuffix, CourseResourceDetail} from '../../../components/index.js'
// 格式化视频时间
const formatTimeLong = (text) => {
  let h = Number.parseInt(text / 3600).toString();
  if (h < 10) h = h.padStart(2, '0');
  let m = Number.parseInt((text % 3600) / 60).toString().padStart(2, '0');
  let s = ((text % 3600) % 60).toString().padStart(2, '0');
  return [h, m, s].join(':');
};
export default function (props) {
  const {
    checkVisible,
    ID,
    Name,
    TeachWayDesc,
    TeachWay,
    TrainPlanID,
    TrainPlanName,
    LecturerID,
    LecturerName,
    AuditSTDesc,
    AuditST,
    RejectCnt,
    CoverImg,
    Instro,
    Credit,
    SDate,
    EDate,
    CDate,
    CourseCatalogs,
    handlePreview,
    handleDownload
  } = props
  return (
    <div className='details'>
      <div className='header-small clearfix'>
        <div className='icon'>
          <img src={CoverImg}/>
        </div>
        <dl className='top-contant'>
          <dt>{Name}</dt>
          <dd>授课方式:{TeachWayDesc}<span className='blank'>共{CourseCatalogs ? CourseCatalogs.length : 0}节课</span></dd>
          <dd>授课讲师:{LecturerName}<span className='blank'>学分：{Credit}</span></dd>
          <dd>培训项目：{TrainPlanName}</dd>
          <dd>课程有效期：{SDate}至{EDate}</dd>
        </dl>
      </div>
      <div className='main'>
        {CourseCatalogs && CourseCatalogs.length ? <h6>包含的{CourseCatalogs.length}节课：</h6> : null}
        {CourseCatalogs && CourseCatalogs.length && CourseCatalogs.map(({ID, CourseID, PID, Name, Level, Sort, CourseResourceDetails}, index) => {
          return (
            <dl className='contant' key={index}>
              <dt><span className='order'>第{index + 1}讲</span>{Name}</dt>
              {CourseResourceDetails && CourseResourceDetails.length && CourseResourceDetails.map((item, index) => {
                return <dd key={index}><CourseResourceDetail data={item}/></dd>
              })}
            </dl>
          )
        })}
      </div>
      <div className='status'>
        <p>课程提交时间：{CDate}</p>
        <p>审核状态：{AuditSTDesc}</p>
      </div>
    </div>
  )
}
