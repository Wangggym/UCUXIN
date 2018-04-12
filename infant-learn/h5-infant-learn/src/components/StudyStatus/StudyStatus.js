import React from 'react'
import {Progress, ToExaminationModal} from '../index'
import {Button} from 'antd-mobile'
import './study-st.scss'

const StudyStatus = ({onClick, StudySTDesc, StudyST, Point, Score, ID}) => {
  const showProgress = (StudyST != 2 && StudyST != 4)
  const style = {display: 'flex', justifyContent: 'space-between'}
  const showScore = () => {
    if (Score == null) return
    if (StudyST == 4) return <span>考试得分：<span className='orange-color'>{Score}【不合格】</span></span>
    if (Score !== 0) return <span>考试得分：<span className='green-color'>{Score}</span></span>
  }
  return (
    <div className='study-st' style={!showProgress ? {...style} : null}>
      <div className='top'>
        <div className='status'>
          {StudyST != 3 && <span>学习状态：{StudySTDesc}</span>}
          {showScore()}
        </div>
        {showProgress && <span className='percent'>{Point}%</span>}
      </div>
      {showProgress ? <Progress percent={Point}/> : <ToExaminationModal courseID={ID}>
        <Button inline className='default-button'>{StudySTDesc}</Button>
      </ToExaminationModal>}
    </div>
  )
}
//限定控件传入的属性类型
StudyStatus.propTypes = {}

//设置默认属性
StudyStatus.defaultProps = {
  onClick: f => f,
  active: 0
}
export default StudyStatus
