/**
 * Created by xj on 2017/8/22.
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import "./BottomStudy.scss"


const Footer = ({onClick, onFavorClick, onTranspondClick,signInClick, IsFavor, isTranspond, TotalFee, QtyLimit, QtySignUp, children, IsBuy,TeachWay}) => {
  const buttonStatus = () => {
    if(IsBuy) return <div className={"goto-study"} onClick={() => onClick(false)}> 已购买</div>;
    if(QtyLimit && QtyLimit === QtySignUp) return <div className={"grey-background goto-study"} onClick={() => onClick(false)}> 名额已满</div>;
    return <div className={"goto-study"} onClick={() => onClick(true)}> 我要学习</div>
  }
  return (
    <div className="fiexd-bottom">
      <div className="bottom-operation">
        <div className="left-btn">
          <div className="collect" onClick={onFavorClick}>
            <i className={IsFavor ? "icon-collect-action" : "icon-collect"}/>
            <span>{IsFavor ? "已收藏" : "收藏"}</span>
          </div>
          {/*<div className="transpond" onClick={onTranspondClick}>*/}
            {/*<i className={isTranspond ? "icon-transpond-action" : "icon-transpond"}/>*/}
            {/*<span>转发</span>*/}
          {/*</div>*/}
        </div>
        <div className="right-btn">
          {!children && <div className='price orange-font'>{!TotalFee ? '免费' : `￥${TotalFee}`}</div>}
          {/*{*/}
            {/*TeachWay===3?<div className="sign-in" onClick={() => this.signIn()}>一键签到</div>:<div className='price orange-font'>{!TotalFee ? '免费' : `￥${TotalFee}`}</div>*/}
          {/*}*/}
          {!children && buttonStatus()}
          {children}
        </div>
      </div>
    </div>
  )
}

//限定控件传入的属性类型
Footer.propTypes = {
  onClick: PropTypes.func.isRequired,
  onFavorClick: PropTypes.func.isRequired,
  onTranspondClick: PropTypes.func.isRequired,
}

//设置默认属性
Footer.defaultProps = {
  onClick: f => f,
  onFavorClick: f => f,
  onTranspondClick: f => f,
}
export default Footer

