import React from 'react'
import PropTypes from 'prop-types'
import './style.scss'

//进度条

const Progress = ({ backgroundColor = 'rgb(104 ,201 ,76)', percent = 0, style }) => {
    return <div className='progress' style={style}>
        <div style={{ width:`${percent}%`, backgroundColor }}></div>
    </div>
}

//限定控件传入的属性类型
Progress.propTypes = {
    percent: PropTypes.number.isRequired
}

//设置默认属性
Progress.defaultProps = {

}

export default Progress
