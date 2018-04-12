/**
 * Created by xj on 2017/9/5.
 */
import React, { Component } from 'react';
import { PieEcharts, NoContent, TrainPlanList } from '../../../components'
import { createForm } from 'rc-form';
import { DatePicker, Icon } from 'antd-mobile';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './TrainScore.scss';
import { CourseDetail } from '../../../../src/api'
import NoAccordionCourseList from './NoAccordionCourseList'
// 如果不是使用 List.Item 作为 children
const CustomChildren = props => (
  <div onClick={props.onClick} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    {props.children}
    <span style={{ color: '#000', marginRight: "0.2rem" }}>{props.extra}</span>
    <Icon type="down" color="#a7a7a7" />
  </div>
);

class TrainScore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ScoreUpperData: "",//培训学分页面上部分
      ScoreDownData: {},//培训学分页面下部分

      Year: moment(new Date()).format("YYYY"),//默认今年年份查询购买记录
      dpValue: null,
      visible: false,
      //刷新列表
      forceUpdata: false,
    }
  }

  componentDidMount() {
    this.getTrainScoreCount();

  }

  //获取个人用户培训学分统计
  getTrainScoreCount() {
    let sendData = {
      type: 1,//1培训学分  2 幼学学分
      uid: 0
    }
    CourseDetail.GetUserCreditOfYear(sendData).then(res => {
      if (res.Ret === 0) {
        this.setState({ ScoreUpperData: res.Data })
      }
    })
  }


  //日期改变
  dateChange(v) {
    let getData = {
      Year: moment(v).format("YYYY")
    }
    this.setState({
      dpValue: v,
      Year: getData.Year,
      forceUpdata: !this.state.forceUpdata,
    }, () => console.log(this.state.Year))
  }



  render() {
    const { ScoreUpperData, Year, forceUpdata } = this.state;
    //取出默认的时间
    const maxDate = moment('2017', 'YYYY')
    const minDate = moment('2016', 'YYYY')


    return (
      <div className="train-score">
        <div className="fiexd-box">
          <div className="circle-score">
            <PieEcharts ScoreUpperData={ScoreUpperData ? ScoreUpperData : ""} tipName="培训学分" />
            <div className="score-year">
              {
                ScoreUpperData.UserYearCreditH5ModelList ? ScoreUpperData.UserYearCreditH5ModelList.map((item, key) => {
                  return (
                    <div key={key}>
                      <span>{item.Credit}分</span>
                      <span>{item.Year}年</span>
                    </div>
                  )
                }) : <NoContent />
              }

            </div>
            <div className="total-score">需修满{ScoreUpperData.NeedCredit}总学分</div>
          </div>
          <div className="select-date">
            <div className="year-score">
              <span style={{ color: "#000" }} className="errow-down">
                <DatePicker
                  mode="year"
                  //title="选择年份"
                  extra={this.state.Year}
                  value={this.state.dpValue}
                  onChange={v => this.dateChange(v)}
                  format={val => val.format('YYYY')}
                // minDate={minDate}
                // maxDate={maxDate}
                >
                  <CustomChildren />
                </DatePicker>
              </span>
              <span
                style={{ color: 'rgb(253, 99 ,15)' }}>{ScoreUpperData.UserYearCreditH5ModelList ? ScoreUpperData.UserYearCreditH5ModelList[0].Credit : "无"}学分</span>
            </div>
            <div className="course-count">
              <span>学习课程:{ScoreUpperData.UserYearCreditH5ModelList ? ScoreUpperData.UserYearCreditH5ModelList[0].QtyLearnCourse : "0"}个</span>
              <span>合格课程:{ScoreUpperData.UserYearCreditH5ModelList ? ScoreUpperData.UserYearCreditH5ModelList[0].QtyPassLearnCourse : "0"}个</span>
            </div>
          </div>
        </div>
        <div className="page-top">
          <NoAccordionCourseList fields={{ uid: 0, year: Year }} api={CourseDetail.GetUserTrainCreditDetail} pSize={1} forceUpdata={forceUpdata} />
        </div>
      </div>
    )
  }
}


export default createForm()(TrainScore);
