import React from 'react'
import PropTypes from 'prop-types'
import { Progress } from '../../../components'
import { Button } from 'antd-mobile'
import './study-st.scss'
const StudyStatus = ({ onClick, StudySTDesc, StudyST, Point, Score }) => {
    const showProgress = (StudyST != 2 && StudyST != 4)
    const style = { display: 'flex', justifyContent: 'space-between' }
    const showScore = () => {
        if (Score == null) return
        if (StudyST == 4) return <span>考试得分：<span className='orange-color'>{Score}【不合格】</span></span>
        return <span>考试得分：<span className='green-color'>{Score}</span></span>
    }
    return (
        <div className='study-st' style={!showProgress ? { ...style } : null}>
            <div className='top'>
                <div className='status'>
                    {StudyST != 3 && <span>培训状态：{StudySTDesc}</span>}
                    {showScore()}
                </div>
                {showProgress && <span className='percent'>{Point}%</span>}
            </div>
            {showProgress ? <Progress percent={Point} /> : <Button inline className='default-button'>{StudySTDesc}</Button>}
        </div>
    )
}
//限定控件传入的属性类型
StudyStatus.propTypes = {

}

//设置默认属性
StudyStatus.defaultProps = {
    onClick: f => f,
    active: 0
}
export default StudyStatus