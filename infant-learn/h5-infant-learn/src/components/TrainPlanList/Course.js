import React from 'react'
import PropTypes from 'prop-types'
import './Course.scss'
const Course = ({CourseName,QtyLearnedCourse,Credit,Score ,ExamTime,onlyYongScorePadding}) => (
    <div className={'course '+onlyYongScorePadding}>
        <div className='title'>
            <span>{CourseName}</span>
            <span>+{Credit}学分</span>
        </div>
        <div className='content grey-color'>
            <span>已完成{QtyLearnedCourse}节课</span>
            <span>考试得分：<span className='status green-color'>{Score?Score+"[合格]":"[合格]"}</span></span>
        </div>
        <div className='time grey-color'>完成时间：{ExamTime}</div>
    </div>
)

//限定控件传入的属性类型
Course.propTypes = {

}

//设置默认属性
Course.defaultProps = {

}
export default Course
