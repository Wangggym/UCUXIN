/**
 * Created by xj on 2017/9/14.
 */
import React, {Component} from 'react';
import {createForm} from 'rc-form';
import {DatePicker, List} from 'antd-mobile';
import moment from 'moment';
import 'moment/locale/zh-cn';

import "./PurchaseRecord.scss";
import {CourseDetail} from '../../../../src/api';
import {NoContent} from '../../../components';
import {hideMenu} from '../../../utils'

// 如果不是使用 List.Item 作为 children
const CustomChildren = props => (
  <div onClick={props.onClick}>
    {props.children}
    <span >{props.extra}年</span>
  </div>
);

class PurchaseRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recordData: {},//购买记录
      Year: moment(new Date()).format("YYYY"),//默认今年年份查询购买记录
      dpValue: null,
      visible: false,
    }
  }

  componentDidMount() {
     hideMenu()
    //获取购买记录
    let getData = {
      Year: this.state.Year
    }
    this.getBuyRecordData(getData)
  }


  //获取购买记录
  getBuyRecordData(getData) {
    CourseDetail.GetBuyRecord(getData).then(res => {
      if (res.Ret === 0) {
        this.setState({recordData: res.Data})
      }
    })
  }

//日期改变
  dateChange(v){
    let getData = {
      Year: moment(v).format("YYYY")
    }
    this.setState({dpValue: v,Year: moment(v).format("YYYY")},()=>this.getBuyRecordData(getData))
  }
  render() {
    const {getFieldProps} = this.props.form;
    const {recordData, Year} = this.state;
    let minDate = moment(this.state.Year-5, 'YYYY');
    let maxDate = moment(this.state.Year, 'YYYY');
    return (
      <div className="purchase-record">
        <div className="select-data">
          <DatePicker
            mode="year"
            //title="选择年份"
             extra={this.state.Year}
            value={this.state.dpValue}
            onChange={v => this.dateChange(v)}
            format={val => val.format('YYYY')}
            maxDate = {maxDate}
            minDate  = {minDate}
          >
            <CustomChildren />
          </DatePicker>
        </div>
        <div className="total-charge">
          <h2>{recordData.YearTotalMoney}</h2>
          <span>{Year}年累计支付</span>
        </div>
        {
          recordData.MonthBuyRecordList&&recordData.MonthBuyRecordList.length!==0 ? recordData.MonthBuyRecordList.map((item, key) => {
            return (
              <MonthList monthList={item} key={key}/>
            )
          }): <NoContent/>

        }
      </div>
    )
  }
}

class MonthList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isArrowDpwn: true,
    }
  }

  //切换箭头
  arrowSwitch() {
    this.setState({isArrowDpwn: !this.state.isArrowDpwn})
  }

  render() {
    const {isArrowDpwn} = this.state;
    const {monthList} = this.props;
    return (
      <div className="month-list">
        <div className="month-title">
          <span className="month-name">{monthList.Month}</span>
          <div className="price">
            <span>{monthList.MonthTotalMoney}</span>
            <a className={!isArrowDpwn ? "" : "arrow-up"} onClick={() => this.arrowSwitch()}/>
          </div>
        </div>
        <div className={!isArrowDpwn ? "current-none" : "current-block"}>
          {
            monthList.BuyDetailList.map((item, key) => {
              return (
                <div className="record-content" key={key}>
                  <div className="content-name-date">
                    <span>{item.OrderType}</span>
                    <span>{item.CDate}</span>
                  </div>
                  <div className="detail-price">
                    {item.Money}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default createForm()(PurchaseRecord);
