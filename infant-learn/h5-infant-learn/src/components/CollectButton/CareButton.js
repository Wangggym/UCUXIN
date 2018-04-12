import React from 'react'
import PropTypes from 'prop-types'
import {trainPlan} from '../../api'
import {Toast, Button} from 'antd-mobile'
import {T_care, T_Time} from '../index'

export default class CareButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      IsFavor: props.IsFollow,
    }
  }

  handleClick = () => {
    trainPlan.followLecturer({lecturerID: this.props.ID}).then(res => {
      if (!res) return;
      if (res.Ret === 0) {
        Toast.success(T_care(!this.state.IsFavor), T_Time)
        this.setState({IsFavor: !this.state.IsFavor})
        const {onRefresh} = this.props
        onRefresh && onRefresh()
      }
    })
  }

  render() {
    const {IsFavor} = this.state;
    return (
      <Button className='default-button' onClick={this.handleClick}>{IsFavor ? '已关注' : '+ 关注'}</Button>
    )
  }
}
//限定控件传入的属性类型
CareButton.propTypes = {}

//设置默认属性
CareButton.defaultProps = {
  IsFavor: true,
}
