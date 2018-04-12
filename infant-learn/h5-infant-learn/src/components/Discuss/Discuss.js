/**
 * Created by xj on 2017/9/5.
 */
import React, {Component} from 'react';
import {List, Button, Popup, Toast} from 'antd-mobile';
import ReactStars from 'react-stars';
import {CourseDetail} from '../../api'
import "./Discuss.scss";
import {searchParamName} from "../../utils/param/search-param"
import DiscussListPage from "./DiscussListPage"

const Item = List.Item;
const Brief = Item.Brief;

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps;
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class Discuss extends Component {
  constructor(props) {
    super(props)
    this.state = {
      preview: searchParamName('preview', this.props.location.search),
      starsValue: 0,//星值
      discussValue: "",//评论内容
      data: {},
      forceUpdata:false,
      IsBuy:this.props.IsBuy
    }
  }
  componentWillReceiveProps(next) {
    this.setState({
      data: next.data,
      IsBuy:next.IsBuy,//
      IsDiscuss:next.IsDiscuss,
      IsAlreadyDiscuss:next.IsAlreadyDiscuss,
      CourserIntroData:next.CourserIntroData,
      IsCanLearn:next.IsCanLearn
    })
  }

  //发布
  toSend(uid, type,TopDistance) {
    let sendData = {
      RID: uid ? uid : this.props.match.params.courseID,
      UID: 0,
      Cnt: this.state.discussValue,
      StarCount: this.state.starsValue,
      // CDate:"",
      DisType: type ? 2 : 1
    }
    CourseDetail.AddOrReDiscussInfo(sendData).then(res => {
      if (res.Ret === 0) {
        Toast.success(`${type ? "回复" : "评价"}成功`, 2);
        Popup.hide();
        document.body.scrollTop =  TopDistance+"px";
        this.setState({forceUpdata:!this.state.forceUpdata})
       this.props.getNewData();//调取父组件的方法，重新获取数据

      } else {
        Toast.fail(res.Msg, 2)
      }
    })
  }

  //评论内容
  discussValueChange(discussValue) {
    this.setState({
      discussValue
    })
  }

  //改变星值
  starsChange(e) {

    this.setState({
      starsValue: e
    })
  }

  //去评价
  toDiscuss(uid, type,TopDistance) {
    if(!this.state.IsBuy){
      Toast.fail("尚未购买，请点击“我要学习”进行购买");
      return;
    }
    if(!this.props.IsCanLearn){
      Toast.fail("未到学习时间,不能进行评价");
      return;
    }
    if(!this.state.IsDiscuss){
      Toast.fail('课程未完成，不能进行评价');
      return;
    }
    if(this.state.IsAlreadyDiscuss){
      Toast.fail('您已经评价过了喔！');
      return;
    }

    Popup.show(
      <div className="disscuss-window">
        <div className="discuss-starts">
          <div>评价</div>
          <div style={{marginLeft: "0.2rem"}}>
            <ReactStars
              className="starts-component"
              value={0}
              count={5}
              onChange={(e) => this.starsChange(e)}
              size={0.5}
              color1={"grey"}
              color2={'#ffc700'}/>
          </div>
          <div className="close" onClick={() => this.onClose()}>X</div>
        </div>
        <div className="discuss-input">
          <textarea rows="3" onChange={(e) => this.discussValueChange(e.target.value)} cols="20"
                    placeholder="请至少输入五个字的评价内容">
          </textarea>
        </div>
        <div className="face-send">
          <i/>
          <Button type="ghost" inline size="small" onClick={() => this.toSend(uid, type,TopDistance)}>发布</Button>
        </div>
      </div>, {animationType: 'slide-up', maskProps, maskClosable: false})
  }

  //关闭评价
  onClose() {
    Popup.hide();
  };


  render() {
    const {data} = this.state;
    return (
      <div className="discuss">
        <div className="stars">
          <ReactStars
            className="starts-component"
            value={5}
            count={5}
            edit={false}
            onChange={(e) => console.log(e)}
            size={0.5}
            color1={"grey"}
            color2={'#ffc700'}/>
          <Button type="ghost" inline size="small" onClick={() => this.toDiscuss()}>去评价</Button>
        </div>
        <div className="discuss-statistics">
          该课程已有{data.TotalRecords}人评价
        </div>
        <DiscussListPage api={CourseDetail.GetCourseDiscussPage} fields={{courseID: this.props.match.params.courseID}}
                         toDiscuss={(id, type,TopDistance) => this.toDiscuss(id, type,TopDistance)} height="80vh"
                         forceUpdata={this.state.forceUpdata} />
      </div>
    )
  }
}
export default Discuss;
