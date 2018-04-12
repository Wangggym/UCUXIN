import React from 'react'
import PropTypes from 'prop-types'
import {CareButton} from '../index'
import {Link, withRouter} from 'react-router-dom'
import './LecturerListItem.scss'


class LecturerListItem extends React.Component {
  handleClick = () => {
    setTimeout(() => this.props.history.push({pathname: `/expert-detail/${this.props.ID}`}), 200)
  }

  render() {
    const {ID, Name, Instro, HeadPic, Achieve, IsFollow, RateFavorable, onClick, onRefresh} = this.props;
    return (
      <div className='lecturer-list-item activeClass'>
        <a href='javascript:void(0);' onClick={this.handleClick}>
          <img src={HeadPic}/>
          <div className='center'>
            <div className='title'>
              <span className='name'>{Name}</span>
              {RateFavorable && <span>好评率{RateFavorable}</span>}
            </div>
            <div className='info'>{Instro}</div>
            <div className='info'>{Achieve}</div>
          </div>
        </a>
        <div className='button'>
          <CareButton ID={ID} IsFollow={IsFollow} onRefresh={onRefresh}/>
        </div>
      </div>
    )
  }
}


//限定控件传入的属性类型
LecturerListItem.PropTypes = {}

//设置默认属性
LecturerListItem.defaultProps = {}

export default withRouter(LecturerListItem)
