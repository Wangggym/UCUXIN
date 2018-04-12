import React from 'react'
import PropTypes from 'prop-types'
import './CollectButton.scss'
import {trainPlan} from '../../api'
import {Toast} from 'antd-mobile'
import {T_collect, T_Time} from '../index'

export default class CollectButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      IsFavor: true,
    }
  }

  handleClick = () => {
    const {favorType, ID} = this.props
    trainPlan.favorCourse({rid: ID, favorType}).then(res => {
      if (!res) return
      if (res.Ret === 0) {
        Toast.success(T_collect(!this.state.IsFavor), T_Time)
        // this.setState({ IsFavor: !this.state.IsFavor })
        const {onClick} = this.props
        onClick && onClick()
      }
    })
  }

  render() {
    const {IsFavor} = this.state
    return (
      <div className={'collect-button'}>
        <span onClick={this.handleClick} className={IsFavor ? 'isFavor' : null}>{IsFavor ? '取消收藏' : '收藏'}</span>
      </div>
    )
  }
}
//限定控件传入的属性类型
CollectButton.propTypes = {}

//设置默认属性
CollectButton.defaultProps = {}
