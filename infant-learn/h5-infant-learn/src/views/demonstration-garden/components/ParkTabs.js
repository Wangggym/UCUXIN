import React from 'react'
import PropTypes from 'prop-types'
import './ParkTabs.scss'
const parkTabsType = [
    { className: 'park-info', name: '园所介绍' },
    { className: 'teacher-info', name: '老师风采' },
    { className: 'honor-info', name: '荣誉成果' },
]
const ParkTabs = ({ onClick, active }) => (
    <div className='park-tabs'>
        {
            parkTabsType.map(({ className, name }, index) => (
                <div onClick={() => onClick(index)} className={active === index ? `${className}-active` : className} key={index}>
                    <i />
                    <span>{name}</span>
                </div>
            ))
        }
    </div>
)

//限定控件传入的属性类型
ParkTabs.PropTypes = {

}

//设置默认属性
ParkTabs.defaultProps = {
    onClick: f => f,
    active: 0
}

export default ParkTabs
