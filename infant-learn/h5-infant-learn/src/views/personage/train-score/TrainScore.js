/**
 * Created by xj on 2017/9/5.
 */
import React, {Component} from 'react';
import {PieEcharts, NoContent, TrainPlanList} from '../../../components'
import LoginPersonInfo from './LoginPersonInfo';
import {createForm} from 'rc-form';
import {DatePicker, Icon, Menu, ActivityIndicator, NavBar} from 'antd-mobile';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './TrainScore.scss';
import {CourseDetail, trainPlan} from '../../../../src/api'
import NoAccordionCourseList from './NoAccordionCourseList'
// 如果不是使用 List.Item 作为 children
const CustomChildren = props => (
  <div onClick={props.onClick} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
    {props.children}
    <span style={{color: '#000', marginRight: "0.2rem"}}>{props.extra}</span>
    <Icon type="down" color="#a7a7a7"/>
  </div>
);



class TrainScore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ScoreUpperData: "",//培训学分页面上部分
      ScoreDownData: {},//培训学分页面下部分
      // LoginPerson: {},//当前登录人的信息
      Year: moment(new Date()).format("YYYY"),//默认今年年份查询购买记录
      dpValue: null,
      visible: false,
      //刷新列表
      forceUpdata: false,
      yearIndex:0,//默认显示今年（根据后台返回字段UserYearCreditH5ModelList数组的顺序 ）
    }
  }

  componentWillMount() {
    const {isView} = this.props.match.params;
    if (isView === "1") {
      this.getLoginInfo()
    }
  }

  componentDidMount() {
    this.getTrainScoreCount();
  }

//根据token获取当前登录人的基本人员信息
  getLoginInfo() {
    trainPlan.getYouLSUser().then(res => {
      if (res.Ret === 0) {
        this.setState({
          LoginPerson: res.Data
        })
      }
    })
  }
//子组件改变基本人员信息的名字
  changUserName(name){
    this.setState({
      LoginPerson:Object.assign({},this.state.LoginPerson,{UName:name})
    })
  }
  //获取个人用户培训学分统计
  getTrainScoreCount(uid) {
    //设置uid用于更新列表子组件的uid值
    this.setState({uid:uid});
    let sendData = {
      type: 1,//1培训学分  2 幼学学分
      uid: uid||0
    };
    CourseDetail.GetUserCreditOfYear(sendData).then(res => {
      if (res.Ret === 0) {
        this.setState({
          ScoreUpperData: res.Data,
          forceUpdata:!this.state.forceUpdata
        })
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
    });

    //更新当前年份的值（方法一）
    let obj ;
    this.state.ScoreUpperData.UserYearCreditH5ModelList.map((item,index)=>{
      if(item.Year==getData.Year){
        //this.setState({yearIndex:index})
        obj=index;
      }
    })
    this.setState({yearIndex:obj})

    //更新当前年份的值（方法二）
    // let yearIndex = this.state.ScoreUpperData.UserYearCreditH5ModelList.findIndex(item=>item.Year==getData.Year)
    // this.setState({yearIndex})

  }


  render() {
    const {ScoreUpperData, Year, forceUpdata,yearIndex} = this.state;
    const {isView} = this.props.match.params;
    //取出默认的时间
    let minDate = moment((moment(new Date()).format("YYYY"))-5, 'YYYY');
    let maxDate = moment(moment(new Date()).format("YYYY"), 'YYYY');
    return (
      <div className="train-score">

        <div className="fiexd-box">
          <div className={"select-role " + (isView === "1" ? "current-block" : "current-none")}>
            <LoginPersonInfo LoginPerson={this.state.LoginPerson} changUserName={(name)=>this.changUserName(name)} getNewCredit={(uid)=>this.getTrainScoreCount(uid)}/>
          </div>
          <div className="circle-score">
            {
               //ScoreUpperData&&ScoreUpperData.UserYearCreditH5ModelList.length!==0?<PieEcharts ScoreUpperData={ScoreUpperData} tipName="培训学分"/>:<NoContent/>
             <PieEcharts ScoreUpperData={ScoreUpperData} tipName="培训学分"/>

            }
            <div className="score-year">
              {
                ScoreUpperData&&ScoreUpperData.UserYearCreditH5ModelList.length!==0 && ScoreUpperData.UserYearCreditH5ModelList.map((item, key) => {
                  return (
                    <div key={key}>
                      <span>{item.Credit}分</span>
                      <span>{item.Year}年</span>
                    </div>
                  )
                }) //: <NoContent/>
              }

            </div>
            {
              ScoreUpperData&&ScoreUpperData.UserYearCreditH5ModelList.length!==0&&<div className="total-score">需修满{ScoreUpperData.NeedCredit}总学分</div>

            }
          </div>
          {
            ScoreUpperData&&ScoreUpperData.UserYearCreditH5ModelList.length!==0&&<div className="select-date">
              <div className="year-score">
              <span style={{color: "#000"}} className="errow-down">
                <DatePicker
                  mode="year"
                  //title="选择年份"
                  extra={this.state.Year}
                  value={this.state.dpValue}
                  onChange={v => this.dateChange(v)}
                  format={val => val.format('YYYY')}
                  minDate={minDate}
                  maxDate={maxDate}
                >
                  <CustomChildren/>
                </DatePicker>
              </span>
                <span style={{color: 'rgb(253, 99 ,15)'}}>{ScoreUpperData.UserYearCreditH5ModelList&& ScoreUpperData.UserYearCreditH5ModelList[yearIndex]?ScoreUpperData.UserYearCreditH5ModelList[yearIndex].Credit:"0"}学分</span>
              </div>
              <div className="course-count">
                <span>学习课程:{ScoreUpperData.UserYearCreditH5ModelList&&ScoreUpperData.UserYearCreditH5ModelList[yearIndex]?ScoreUpperData.UserYearCreditH5ModelList[yearIndex].QtyLearnCourse:"0"}个</span>
                <span>合格课程:{ScoreUpperData.UserYearCreditH5ModelList&&ScoreUpperData.UserYearCreditH5ModelList[yearIndex]?ScoreUpperData.UserYearCreditH5ModelList[yearIndex].QtyPassLearnCourse : "0"}个</span>
                {/*<span>合格课程:{ScoreUpperData.UserYearCreditH5ModelList&&ScoreUpperData.UserYearCreditH5ModelList.length!==0 ? ScoreUpperData.UserYearCreditH5ModelList[yearIndex].QtyPassLearnCourse : "0"}个</span>*/}
              </div>
            </div>
          }

        </div>
        <div className={"page-top "+(isView==="1"?"isView":"")}>
          <NoAccordionCourseList fields={{uid: this.state.uid||0, year: Year}} api={CourseDetail.GetUserTrainCreditDetail} pSize={10}
                                 forceUpdata={forceUpdata} height="45vh"/>
        </div>
      </div>
    )
  }
}


export default createForm()(TrainScore);
