/**
 * Created by xj on 2017/9/5.
 */
import React, {Component} from 'react';
import './achievement-info.scss'
import {trainPlan, CourseDetail} from '../../api'
import { Toast,Button} from 'antd-mobile';

class PersonAchievement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      DetailData: "",//个人详情
      BtnDisabled:true//确定按钮状态
    }
  }



  componentDidMount() {
    const {type} = this.props;
    Toast.loading("刷新",0)
    trainPlan.getMineDetail().then(res => {
      if (res.Ret === 0) {
        setTimeout(()=>Toast.hide(),300)
        this.setState({DetailData: res.Data},()=>{
          let AchievementNum = this.state.DetailData.Achievement?this.state.DetailData.Achievement.length:0;
          let IntroNum = this.state.DetailData.Intro?this.state.DetailData.Intro.length:0;
          this.refs.areaValue.value = type===1?this.state.DetailData.Achievement:this.state.DetailData.Intro;
          this.setState({wordLength:type===1?AchievementNum:IntroNum})
        })
      }
    })
  }


//文本域值改变
  textAreaChange(value) {
    const {type,limit} = this.props;
    let wordValue = this.refs.areaValue.value
    this.setState({
      wordLength:this.refs.areaValue.value.length
    },()=>{
      if(this.state.wordLength>limit){
        Toast.fail(`字数不能超过${limit}`,2)
        this.setState({BtnDisabled:false})
      }else{
        this.setState({BtnDisabled:true})

      }
    })
  }

  //确定
  sure() {
    const {DetailData} = this.state;
    const {type,limit} = this.props;
    let sendData = {
      stuInfoID: DetailData.UID,
      instro:type===2?this.refs.areaValue.value:DetailData.Intro,
      achieve:type===1?this.refs.areaValue.value:DetailData.Achievement,
    }
    if(this.refs.areaValue.value.length>limit){
      Toast.fail(`字数不能超过${limit}`,2)
      return;
    }
    CourseDetail.UpdateStuInfo(sendData).then(res => {
      if (res.Ret === 0) {
        Toast.success("提交成功",1,()=>window.location.href= `ucux://webview?action=close`)
      }
    })
  }
//限制字数
  limitWord(){
    console.log()
  }
  render() {
    const {tip, limit, type} = this.props;
    const {DetailData,wordLength} = this.state;
    return (
      <div>
        <div className="my-achievement-textarea">
          <textarea rows="9" onChange={(e) => this.textAreaChange(e.target.value)} ref="areaValue" cols="20"
                    placeholder={tip}>

            </textarea>
        </div>
        <div className="count-word">
          {limit}个字以内({wordLength }/{limit})
        </div>
        <div className={"btn-sure "+(this.state.BtnDisabled?"":"btn-sure-disabled")} onClick={() => this.sure()}>确定</div>
      </div>
    )
  }
}

export default PersonAchievement;
