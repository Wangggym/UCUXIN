import React from 'react'
import PropTypes from 'prop-types'
import './button-group.scss'
// 学习状态 -1 全部 0-未开始 1-学习中 2-待考试 3-考试合格 4-待补考
const studyST = [
    { key: -1, value: '全部' },
    { key: 0, value: '未开始' },
    { key: 1, value: '学习中' },
    { key: 2, value: '待考试' },
    { key: 3, value: '考试合格' },
    { key: 4, value: '待补考' },
]

const ButtonGroup = ({ onClick, active }) => {
    return (
        <div className='button-group'>
            {studyST.map(({ key, value }) => <div onClick={() => onClick(key)} key={key} className={active == key ? 'active' : null}>{value}</div>)}
        </div>
    )
}
//限定控件传入的属性类型
ButtonGroup.propTypes = {

}

//设置默认属性
ButtonGroup.defaultProps = {
    onClick: f => f,
    active: 0
}
export default ButtonGroup
