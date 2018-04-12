import React from 'react'
import PropTypes from 'prop-types'
import './style.scss'
import {Icon, Toast} from 'antd-mobile'
import {trainPlan} from '../../api'
import {Link, withRouter} from 'react-router-dom'
import {HeadComp} from '../../components'

const personList = [
  {className: 'achievement', value: '个人成就'},
  {className: 'info', value: '个人简介'},
  {className: 'course', value: '我的课程'},
  {className: 'lecturer', value: '我关注的讲师'},
  {className: 'order', value: '我的订单'},
  {className: 'favorite', value: '我的收藏'},
]
const footerList = [
  {className: 'home', value: '首页'},
  {className: 'address-book', value: '通讯录'},
  {className: 'store', value: '商城'},
  {className: 'person', value: '个人'},
]

class PersonHomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.getMine()
  }

  // 个人主页，获取我的
  getMine() {
    trainPlan.getMine().then(res => {
      if (!res) return
      if (res.Ret === 0) {
        this.setState({...res.Data})
      }
    })
  }

  //跳转
  handlePush = (pathname, count) => {
    if (!count && count !== undefined) return Toast.info('暂无统计数据', 0.8);
    if (pathname == "/personList-order") {
      let url = 'http://shoptest.ucuxin.com/my/order.html?status=0&widget=4&shop_id=112&token=' + sessionStorage.getItem("UCUX_OCS_AccessToken");
      window.location.href = `ucux://weburl?href=${encodeURIComponent(url)}`;
      return;
    }
     //this.props.history.push(pathname) //在pc端开发预览用
   window.location.href = `ucux://weburl?href=${window.location.origin}/InLeSpa${pathname}` //在native app中使用
  }

  //根据情况跳转
  conditionPush = (pathname, count) => {
    if (count) this.handlePush(pathname)
  };
//window.location.href = `ucux://weburl?href=${window.location.origin}/InLeSpa/person-homePageDetail`
  //this.props.history.push(`/person-homePageDetail`)
  render() {
    const {UID, HeadPic, Name, AreaName, TrainCredit, YoungCredit, YoungCoin, QtyFollow} = this.state
    return (
      <div className='person-homepage'>
        <div onClick={() => window.location.href = `ucux://weburl?href=${window.location.origin}/InLeSpa/person-homePageDetail`}>
          <HeadComp {...this.state} />
        </div>
        <div className='data'>
          <a onClick={() => this.handlePush('/train-score/0', TrainCredit)}
             href="javascript:void(0);"
             className="activeClass">
            <span className='value'>{TrainCredit}</span>
            <span className='name'>培训学分</span>
          </a>
          <a onClick={() => this.handlePush('/young-score', YoungCredit)} href="javascript:void(0);"
             className="activeClass">
            <span className='value'>{YoungCredit}</span>
            <span className='name'>幼学学分</span>
          </a>
          <a onClick={() => this.handlePush('/young-coin/' + YoungCoin)} href="javascript:void(0);"
             className="activeClass">
            <span className='value'>{YoungCoin}</span>
            <span className='name'>幼学币</span>
          </a>
        </div>
        <div className='blank'/>
        <div className='person-list'>
          {personList.map(({className, value}, index) => (
            <a key={index} className={`personList-${className} activeClass`}
               onClick={() => this.handlePush(`/personList-${className}`)} href="javascript:void(0);">
              <div>{value}</div>
              <Icon type='right'/>
            </a>
          ))}
        </div>
        {/* <ul className='footer-list'>
                    {
                        footerList.map(({ className, value }, index) => (
                            <li key={index}>{value}</li>
                        ))
                    }
                </ul> */}
      </div>
    )
  }
}

//限定控件传入的属性类型
PersonHomePage.propTypes = {};

//设置默认属性
PersonHomePage.defaultProps = {};

export default withRouter(PersonHomePage)
