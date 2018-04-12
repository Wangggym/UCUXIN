/**
 * Created by wangbin on 2017/9/20.
 */
import React, {Component} from 'react';
import {Tabs, Badge, Toast, Radio, Modal, List} from 'antd-mobile';
import {withRouter} from 'react-router-dom';
import $ from 'jquery';
import Config from '../../../../config';
import Pay_Party_Payment from '../../../../utils/thirdPay/payModel';
import './index.scss'
import {CourseDetail} from '../../../../api'
import {CourseItem} from "../../../../components"
import {searchParamName} from "../../../../utils/param/search-param"


class PayCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props.match.params.orderId,
      url: this.props.match.params.url,
      courseInfo: undefined,
      payType: undefined,
    };
    this.countDownTime = 0
  }

  componentWillMount() {
    document.title = decodeURIComponent(sessionStorage.getItem("title"))
  }

  componentDidMount() {
    this.getOrderDetail();
    Pay_Party_Payment.init();
  }

  /**
   *获取订单详情
   */
  getOrderDetail() {
    let {courseId} = this.state;
    let obj = {
      orderID: courseId
    };
    CourseDetail.GetOrderDetailByID(obj).then((res => {
      this.setState({
        courseInfo: res.Data
      })
    }));
  }

  /**
   *去支付
   */
  nowPay() {
    let {courseId, url, payType} = this.state;
    let obj, type;
    if (!payType) {
      Toast.info('请选择支付方式！');
      return;
    }
    if (payType === 1) {
      if (Pay_Party_Payment.judgeAppVersion()) {
        type = 11
      } else {
        type = 10
      }
    } else if (payType === 2) {
      type = 1
    } else {
      type = 7
    }
    obj = {
      orderID: courseId,
      UserToken: Config.token,
      Channel: type,
      Extra: url,
      timeStamp: parseInt(new Date().getTime() / 1000),
    };
    CourseDetail.GetPaySign(obj).then((res => {
      if (res.Ret === 0) {
        Pay_Party_Payment.directPay(res.Data);
      } else {
        Toast.info(res.Msg);
      }
    }));
  }

  render() {
    let {courseInfo, payType} = this.state;
    return (
      <div className="pay-course">
        <div className="pay-course-contain">
          <CourseItem style={{borderBottom: '1PX solid #ececec'}}  {...courseInfo}/>
          <p className="pay-type-title">选择支付方式</p>
          <div className="pay-type-contain">
            {/*<section onClick={()=>{this.setState({payType:1})}}>*/}
            {/*<img src={require('./../../../../assets/images/pay-weixin.png')} alt=""/>*/}
            {/*<span>微信支付</span>*/}
            {/*{*/}
            {/*payType === 1?<img src={require('./../../../../assets/images/yx_checkbox.png')} alt=""/>:''*/}
            {/*}*/}
            {/*</section>*/}
            <section onClick={() => {
              this.setState({payType: 2})
            }}>
              <img src={require('./../../../../assets/images/pay-zhifubao.png')} alt=""/>
              <span>支付宝</span>
              {
                payType === 2 ? <img src={require('./../../../../assets/images/yx_checkbox.png')} alt=""/> : ''
              }
            </section>
            <section onClick={() => {
              this.setState({payType: 3})
            }}>
              <img src={require('./../../../../assets/images/pay-yinglian.png')} alt=""/>
              <span>银联支付</span>
              {
                payType === 3 ? <img src={require('./../../../../assets/images/yx_checkbox.png')} alt=""/> : ''
              }
            </section>
          </div>
          <div className="big-btn" onClick={() => this.nowPay()}>去支付</div>
        </div>
      </div>
    )
  }
}

export default withRouter(PayCourse)
