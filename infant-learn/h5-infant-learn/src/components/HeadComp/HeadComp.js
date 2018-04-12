import React from 'react'
import PropTypes from 'prop-types'
import './HeadComp.scss'

const HeadComp = ({ HeadPic, Name, AreaName, QtyFollow, FName,noInfo, RateFavorable }) => (
    <div className='person-bg'>
        <div className='head-img'>
            <img src={HeadPic} />
        </div>
        <div className='name'>{Name}</div>
        <div className='address'>{AreaName} {FName}</div>
        <ul className={noInfo ? 'info no-info' : 'info'}>
            <li>{RateFavorable?`好评率:${RateFavorable}`:null}</li>
            <li>粉丝：{QtyFollow}</li>
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
