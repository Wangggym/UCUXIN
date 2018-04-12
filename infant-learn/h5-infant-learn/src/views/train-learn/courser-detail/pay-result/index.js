/**
 * Created by wangbin on 2017/9/20.
 */
import React, {Component} from 'react';
import {Tabs, Badge, Toast, Radio, Modal, List} from 'antd-mobile';
import {withRouter} from 'react-router-dom';

import Config from '../../../../config';
import './index.scss'
import {CourseDetail} from '../../../../api'
import {CourseItem} from "../../../../components"


class PayCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId:this.props.match.params.OrderNo,
      courseInfo:undefined,
    };
  }
  componentDidMount() {
    this.getOrderDetail();
  }
  /**
   *获取url参数
   */
  GetQueryString(name){
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
  }
  /**
   *获取订单详情
   */
  getOrderDetail(){
    let courseId = this.GetQueryString('OrderNo');
    let obj = {
      orderID:courseId
    };
    CourseDetail.GetOrderDetailByID(obj).then((res=>{
      this.setState({
        courseInfo:res.Data
      })
    }));
  }
  /**
   *去支付
   */
  go(){
    let url = this.GetQueryString('Extra');
    window.location.href = decodeURIComponent(url);
  }
  render() {
    let {courseInfo} = this.state;
    return (
      <div className="pay-result">
        <div className="pay-result-contain">
          <CourseItem style={{borderBottom:'1PX solid #ececec'}} {...courseInfo}/>
          <div className="info">
            <img src={require('./../../../../assets/images/yx_success.png')} alt=""/>
            <p>报名成功！</p>
            {
              courseInfo?<p>恭喜，你获得了{courseInfo.TotalFee}个优学币</p>:''
            }
          </div>
          <div className="big-btn" onClick={()=>this.go()}>去学习</div>
        </div>
      </div>
    )
  }
}

export default withRouter(PayCourse)
