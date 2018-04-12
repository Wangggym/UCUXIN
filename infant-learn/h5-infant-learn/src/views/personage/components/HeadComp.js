import React from 'react'
import PropTypes from 'prop-types'
import './HeadComp.scss'

const HeadComp = ({ HeadPic, Name, AreaName, QtyFollow, noInfo }) => (
    <div className='person-bg'>
        <div className='head-img'>
            <img src={HeadPic} />
        </div>
        <div className='name'>{Name}</div>
        <div className='address'>{AreaName}</div>
        <ul className={noInfo ? 'info no-info' : 'info'}>
            {/* <li>好评率：85%</li> */}
            <li>关注：{QtyFollow}</li>
            {/* <li>粉丝：2382</li> */}
        </ul>
    </div>
)

//限定控件传入的属性类型
HeadComp.PropTypes = {

}

//设置默认属性
HeadComp.defaultProps = {

}

export default HeadComp
