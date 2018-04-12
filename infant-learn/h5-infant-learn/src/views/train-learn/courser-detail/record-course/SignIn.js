/**
 * Created by xj on 2017/10/19.
 * SignIn
 */
import React,{Component} from 'react';
import './SignIn.scss';
import {CourseDetail} from '../../../../api';
import { Toast} from 'antd-mobile';
import {Token} from '../../../../utils/token';

class SignIn extends Component{
  constructor(props){
    super(props)
    this.state={
      courseInfo:{}
    }
  }

  componentDidMount(){
    if(!window.ongetappinfo){
      Token.prototype.registerWinGetApp();
    }
    Token.prototype.getAppInfo((data)=> {
      //Toast.loading("loading...", 0);
      this.getSignInfo(data.AccessToken);
      //存储token
      this.setState({token:data.AccessToken})
    });
  }

  getSignInfo = (token)=> {
    let sendData = {
      token,
      courseID:this.props.match.params.courseID
    };
    CourseDetail.UserSignCourse(sendData).then(res => {
      if (res.Ret === 0) {
        this.setState({
          courseInfo:res.Data
        })
      }else {
        Toast.fail(res.Msg)
      }
    });
  };

  //去签到
  signIn=(IsSign)=>{
    const {courseInfo}=this.state;
    if(IsSign){
      Toast.fail("已签到,请勿重复签到");
      return;
    }
    Toast.loading("刷新", 0);
    let sendData = {
      courseID:this.props.match.params.courseID,
      catalogID:courseInfo.CatalogID,
      Duration:courseInfo.Duration
    }
    CourseDetail.SetLearnRecord(sendData).then(res => {
      if (res.Ret === 0) {
        Toast.success("签到成功");
        this.getSignInfo(this.state.token);
      }else {
        Toast.fail(res.Msg)
      }
    })
  }
  //返回
  goback=()=>{
    this.props.history.goBack();
  }
  render(){
    const {courseInfo}=this.state;
    return(
      <div className="course-info">
       <p>课程信息</p>
        <div className="info-box">
          <div>
            <span>课程名称&nbsp;:&nbsp;</span>
            <b>{courseInfo.Name}</b>
          </div>
          <div>
            <span>课程类型&nbsp;:&nbsp;</span>
            <b>{courseInfo.TeachWayDesc}</b>
          </div>
          <div>
            <span>上课时间&nbsp;:&nbsp;</span>
            <b>{courseInfo.SDate}</b>
            <br />
            <b style={{marginLeft:"1.4rem"}}>{courseInfo.EDate}</b>
          </div>
          <div>
            <span>上课地点&nbsp;:&nbsp;</span>
            <b>{courseInfo.Addr}</b>
          </div>
        </div>
        <div className="operation">
          <p onClick={()=>this.goback()}>返回</p>
          <p onClick={()=>this.signIn(courseInfo.IsSign)}>{courseInfo.IsSign?"已签到":"确认签到"}</p>
        </div>

      </div>
    )
  }
}
export default SignIn;

