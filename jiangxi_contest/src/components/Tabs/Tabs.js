import React from 'react'
import PropTypes from 'prop-types'
import './Tabs.less'

const Tabs = ({onClick, groupType, active = groupType[0].key, className = 'custom_tabs'}) => {
    return (
        <div className={className}>
            {groupType.map(({key, value}) => <div onClick={() => onClick(key)} key={key}
                                                  className={active == key ? 'active' : null}>{value}</div>)}
        </div>
    )
}
//限定控件传入的属性类型
Tabs.PropTypes = {
    groupType: PropTypes.array.isRequired,
}

//设置默认属性
Tabs.defaultProps = {
    onClick: f => f,
    groupType: [
        {key: 1, value: '初赛成绩'},
        {key: 2, value: '复赛成绩'},
    ],
}
export default Tabs