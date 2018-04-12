import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames';
import { Icon } from 'antd-mobile'
import './ParkItem.scss'

//园所item

const  ParkItem= ({ onClick, ID, Name, ImgUrl, GardenName, GardenLevelDesc, GardenLevel, History }) => (
    <div className='park-item activeClass' onClick={()=>setTimeout(onClick,200)}>
        <div className='pic'>
            <img src={ImgUrl}/>
        </div>
        <div className='content'>
            <div className='name'>
                {Name}
            </div>
            <div className='history overflow-hidden'>
                {History}
            </div>
        </div>
        <div className='icon'>
            <span>
                <Icon type={'right'} />
            </span>
        </div>
    </div>

)

//限定控件传入的属性类型
ParkItem.PropTypes = {

}

//设置默认属性
ParkItem.defaultProps = {
    onClick: f => f
}

export default ParkItem
