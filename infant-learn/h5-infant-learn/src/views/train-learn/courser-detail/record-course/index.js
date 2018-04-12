/**
 * Created by xj on 2017/9/5.
 */
import React, {Component} from 'react';
import {Tabs, Badge, Toast, Radio, Modal, List} from 'antd-mobile';
import {withRouter} from 'react-router-dom';

import './index.scss';
import {CourseDetail} from '../../../../api';
import Config from '../../../../config';
import Ucux from '../../../../utils/ucux';
import Examination from "./Examination";
import {
  CourseBottomStudy,
  CourseIntro,
  Catalogue,
  Discuss,
  NoContent,
  ToExaminationModal
} from "../../../../components";
import {searchParamName} from "../../../../utils/param/search-param";

const alert = Modal.alert;
const RadioItem = Radio.RadioItem;

const TabPane = Tabs.TabPane;

class RecordCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollect: false,//是否收藏
      isTranspond: false,//是否转发
      pIndex: 1,
      pSize: 10,
      CourserIntroData: '',//课程介绍
      CatalogsData: [],//目录
      PapersData: {},//考试
      DiscussPageData: {},//评价
      isShowCountTiem: true,
      isShowTip: false,
      Singlevalue: 0,//单选框默认的值
      paperList: [],//存储处理后的试卷列表
      isShowToExam: false,//是否显示去考试按钮
    };
    this.timer = null;
    this.countDownTime = 0;
  }

  componentDidMount() {
    Toast.loading("刷新", 0);
    //默认请求课程介绍的数据
    let CourserIntroData = {
      courseID: this.props.match.params.courseID
    };
    this.GetCourseInstro(CourserIntroData);
    //默认请求目录的数据（获取倒计时）
    //this.GetCatalogue(CourserIntroData);
    //默认请求考试目录
    //this.GetTestPaper(CourserIntroData);
  }

  /**
   * 生成订单
   */
  createOrder(isbuy,SurpluCount){
    if(SurpluCount===0){
      Toast.fail("名额已满");
      return
    }
    if(isbuy===true){
      Toast.fail("已报名");
      return false;
    }
    Toast.loading("刷新", 0);
    let {CourserIntroData} = this.state;
    let obj = {
      body: {
        RID: CourserIntroData.CourseType == 1 ? CourserIntroData.PlanID : CourserIntroData.CourseID,
        OrderType: CourserIntroData.CourseType == 1 ? 1 : 2,
      }
    };

    CourseDetail.CreatOrderInfo(obj).then((res => {
      if (res.Ret === 0) {
        Toast.hide();
        if (CourserIntroData.TotalFee === 0) {
          let CourserIntroData = {
            courseID: this.props.match.params.courseID
          };
          this.GetCourseInstro(CourserIntroData);
        } else {
          let url = window.location.href;
          this.props.history.push('/pay-course/' + res.Data + '/' + encodeURIComponent(url));
        }
      } else {
        Toast.fail(res.Msg)
      }
    }));
  }

  //获取课程详情
  GetCourseInstro(CourseID) {
    Toast.loading("刷新", 0);
    CourseDetail.GetCourseInstro(CourseID).then(res => {
      if (res.Ret === 0) {
        Toast.hide();
        this.setState({
          CourserIntroData: res.Data
        }, () => this.GetCatalogue(CourseID))
      } else {
        Toast.fail(res.Msg, 1);
      }
    })
  }

//获取目录
  GetCatalogue(CourseID) {
    Toast.loading("刷新", 0);
    CourseDetail.GetCourseCatalogs(CourseID).then(res => {
      if (res.Ret === 0) {
        Toast.hide();
        this.countTime(res.Data);
        this.setState({
          CatalogsData: res.Data
        })
      } else {
        Toast.fail(res.Msg, 1);
      }
    })
  }

  //获取考试
  GetTestPaper(CourseID) {
    Toast.loading("刷新", 0);
    CourseDetail.GetCoursePapers(CourseID).then(res => {
      if (res.Ret === 0) {
        Toast.hide();
        this.setState({
          PapersData: res.Data
        })
      } else {
        Toast.fail(res.Msg, 1);
      }
    })
  }

  handleTabClick(key) {
    let data = {
      courseID: this.props.match.params.courseID
    };

    //课程介绍
    if (key === "1") {
      this.GetCourseInstro(data);
      this.setState({isShowToExam: false});
      return;
    }
    //目录
    if (key === "2") {
      this.GetCatalogue(data);
      this.setState({isShowToExam: false});

      return;
    }
    //考试
    if (key === "3") {
      this.GetTestPaper(data);
      this.setState({isShowToExam: true});
      return;
    }
    //评论
    if (key === "4") {
      Toast.loading("刷新", 0);
      this.setState({isShowToExam: false});
      let page = {
        pIndex: this.state.pIndex,
        pSize: this.state.pSize
      };
      CourseDetail.GetCourseDiscussPage(data, page).then(res => {
        if (res.Ret === 0) {
          Toast.hide();
          this.setState({
            DiscussPageData: res.Data
          })
        }
      });
    }
  }

  //子组件操作后 重新获取评论数据
  getNewData() {
    let data = {
      courseID: this.props.match.params.courseID
    };
    let page = {
      pIndex: this.state.pIndex,
      pSize: this.state.pSize
    };
    //获取评论列表
    CourseDetail.GetCourseDiscussPage(data, page).then(res => {
      if (res.Ret === 0) {
        this.setState({
          DiscussPageData: res.Data
        })
      }
    });
    //获取课程详情（更新是否已经评论IsAlreadyDiscuss字段）
    this.GetCourseInstro(data);
  }

  //收藏
  onFavorClick() {
    let data = {
      rid: this.props.match.params.courseID,
      favorType: 2
    };
    CourseDetail.FavorCourse(data).then(res => {
      if (res.Ret === 0) {
        Toast.success(this.state.CourserIntroData.IsFavor ? `收藏成功` : "取消收藏成功", 2);
        let CourserIntroData = {
          courseID: data.rid
        };
        this.GetCourseInstro(CourserIntroData)
      }
    })
  }

  //获取直播倒计时（取出为即将开始的直播倒计时间）
  getCountTime(CatalogsData) {
    if (!this.countDownTime) {
      CatalogsData.forEach((item, i) => {
        item.CourseResourceDetails.forEach((e, i) => {
          if (e.LiveST === 2) {
            this.countDownTime = e.OnlineTime
          }
        })
      })
    }
    const newTime = this.countDownTime - 1;
    this.countDownTime = newTime;
    return newTime;
  }

  //倒计时
  countTime(CatalogsData) {
    clearTimeout(this.timer);
    if (this.state.CourserIntroData.TeachWay !== 2) return;//不是直播类型不显示倒计时
    let leftTime = parseInt(this.getCountTime(CatalogsData));
    let days = parseInt(leftTime / 60 / 60 / 24, 10); //计算剩余的天数
    let hours = parseInt(leftTime / 60 / 60 % 24, 10); //计算剩余的小时
    let minutes = parseInt(leftTime / 60 % 60, 10);//计算剩余的分钟
    let seconds = parseInt(leftTime % 60, 10);//计算剩余的秒数
    days = this.checkTime(days);
    hours = this.checkTime(hours);
    minutes = this.checkTime(minutes);
    seconds = this.checkTime(seconds);
    const countTime = "距离开始还剩 : " + days + "天" + hours + ":" + minutes + ":" + seconds
    this.setState({countTime});
    if (leftTime > 0) {
      this.timer = setTimeout(() => {
        if (this.state.CourserIntroData.TeachWay === 2) {//为直播是才启用倒计时
          this.countTime()
        }
        // if (leftTime === 0) {
        //   clearTimeout(this.timer);
        //   this.setState({
        //     isShowCountTiem: false//取消倒计时图层
        //   })
        // }
      }, 1000);
    }
    if (leftTime <= 0) {
      clearTimeout(this.timer);
      this.setState({
        isShowCountTiem: false//取消倒计时图层
      })
    }
  }

  checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

//一键签到
  signIn(IsBuy, IsCanLearn) {
    if (!IsBuy) {
      Toast.fail('尚未购买，请点击“我要学习”进行购买!');
      return;
    }
    if (!IsCanLearn) {
      Toast.info("未到学习时间,不能签到");
      return;
    }
    if (!window.onGetQRCode) {
      Ucux.signInGetQRCodeMethod();
    }
    Ucux.getQRCode(data => window.location.href = data);
  }

  /**
   * 开始直播
   */
  playLive() {
    let {CourserIntroData} = this.state;
    let obj = {
      courseID: CourserIntroData.CourseID,
    };
    if (!CourserIntroData.IsBuy) {
      Toast.fail('尚未购买，请点击“我要学习”进行购买!');
      return;
    }
    if (!CourserIntroData.IsCanLearn) {
      Toast.fail('未到学习时间喔!');
      return;
    }
    CourseDetail.GetSID(obj).then(res => {
      if (res.Ret === 0) {
        this.toPlay(res.Data);
      } else {
        Toast.info(res.Msg);
      }
    });
  }

  //调ux视频播放
  toPlay(obj) {
    let {CourserIntroData} = this.state;
    window.playBack = (json) => {
      let object, info;
      info = JSON.parse(json);
      object = {
        courseID: CourserIntroData.CourseID,
        catalogID: obj.CatalogID,
        Duration: info.Position,
      };
      CourseDetail.SetLearnRecord(object).then(res => {
        if (res.Ret === 0) {
          this.GetCatalogue({courseID: this.props.match.params.courseID})
        } else {
          //alert(JSON.stringify(res));
        }
      })
    };
    let businessParams = [];
    for (let i = 0; i < 5; i++) {
      businessParams.push({"Time": Math.floor(Math.random() * 4000), "Pause": true, "Msg": ""});
    }
    let buz = JSON.stringify(businessParams);
    let params = encodeURI(buz);
    if (obj.ResourceType === 3) {
      window.location.href = `ucux://player/liveplay?sid=${obj.SID}&callback=playBack`;
    } else {
      // window.location.href = `ucux://player/videoplay?sid=${obj.SID}&callback=playBack`;
      window.location.href = `ucux://player/videoplay?sid=${obj.SID}&unforward=1&businessparams=${params}&title=&url=&extraparams=&callback=playBack`
    }
  }

  /**
   * 分享
   */
  share() {
    let {CourserIntroData} = this.state;
    let obj = {
      Desc: CourserIntroData.TrainType,
      Title: CourserIntroData.Name,
      ThumbImg: CourserIntroData.CoverImg,
      Url: window.location.href,
      Type: 7,
    };
    window.location.href = 'ucux://forward?contentjscall=share';
    window.share = () => {
      return JSON.stringify(obj);
    };
  }

//不同类型显示不同的（按钮，倒计时，蒙层）
  judgeTeacheWay(CourserIntroData, isShowCountTiem, countTime) {

    switch (CourserIntroData.TeachWay) {
      case 1:
        return <img onClick={() => this.playLive()} className="play-icon"
                    src={require('./../../../../assets/images/player-ico.png')} alt=""/>;
        break;
      case 2:
        if (isShowCountTiem) {
          return <div
            className={"count-down " + (isShowCountTiem ? "current-block" : "current-none")}>{countTime}</div>;
        } else {
          return <img onClick={() => this.playLive()} className="play-icon"
                      src={require('./../../../../assets/images/player-ico.png')} alt=""/>
        }
        break;
    }
  }

  render() {
    const {CourserIntroData, CatalogsData, PapersData, DiscussPageData, countTime, isShowCountTiem, data, paperList, isShowToExam} = this.state;
    const {courseID} = this.props.match.params;
    let objCourseId = {
      courseID: courseID //观看结束后。重新获取目录数据
    };
    const preview = searchParamName('preview', this.props.location.search);
    return (
      <div className="record-course">
        <div className="video">
          <img src={CourserIntroData.CoverImg} style={{width: "100%", height: "4.5rem"}} alt=""/>
          {this.judgeTeacheWay(CourserIntroData, isShowCountTiem, countTime)}
        </div>
        <div className="switch-tab">
          <Tabs defaultActiveKey="1" animated={false}
                onTabClick={(key) => this.handleTabClick(key)}>
            <TabPane tab={<Badge>
              <div className="tab-name">课程介绍</div>
            </Badge>} key="1">
              <CourseIntro data={CourserIntroData}
                           GetCourseInstro={(courseID) => this.GetCourseInstro(courseID)} {...this.props} />
            </TabPane>
            <TabPane tab={<Badge>目录</Badge>} key="2">
              <div className="catalogue">
                <Catalogue data={CatalogsData} courserIntroData={CourserIntroData}
                           getCatalogue={() => this.GetCatalogue(objCourseId)}
                           isShowLock={CourserIntroData.IsSortLearn}
                           TeachWay={CourserIntroData.TeachWay} {...this.props}
                           IsBuy={CourserIntroData.IsBuy}
                           IsCanLearn={CourserIntroData.IsCanLearn}
                />
              </div>

            </TabPane>
            <TabPane tab={<Badge>考试</Badge>} key="3">
              <div className="examination">
                <Examination data={PapersData} {...this.props} TeachWay={CourserIntroData.TeachWay}
                             IsCanLearn={CourserIntroData.IsCanLearn}
                             IsBuy={CourserIntroData.IsBuy}/>
              </div>
            </TabPane>
            <TabPane tab={<Badge>评价</Badge>} key="4">
              <Discuss data={DiscussPageData} {...this.props} TeachWay={CourserIntroData.TeachWay}
                       IsCanLearn={CourserIntroData.IsCanLearn}
                       IsBuy={CourserIntroData.IsBuy} IsDiscuss={CourserIntroData.IsDiscuss}
                       IsAlreadyDiscuss={CourserIntroData.IsAlreadyDiscuss}
                       getNewData={() => this.getNewData()}/>
            </TabPane>
          </Tabs>
          <CourseBottomStudy {...CourserIntroData} {...this.props} signInClick={() => this.signIn()}
                             onTranspondClick={() => this.share()} onFavorClick={() => this.onFavorClick()}
          >
            {
              <div className="right-btn">
                {
                  CourserIntroData.TeachWay === 3 ?
                    <div className={"sign-in " + (!CourserIntroData.IsBuy ? "btn-grey" : "")}
                         onClick={() => this.signIn(CourserIntroData.IsBuy, CourserIntroData.IsCanLearn)}>一键签到</div> :
                    <div
                      className='price orange-font'>{!CourserIntroData.TotalFee ? '免费' : `￥${CourserIntroData.TotalFee}`}</div>
                }
                {
                  isShowToExam && CourserIntroData.IsBuy && CourserIntroData.IsCanLearn ?
                    <ToExaminationModal courseID={this.props.match.params.courseID} IsBuy={CourserIntroData.IsBuy}>
                      <div className="goto-study">去考试</div>
                    </ToExaminationModal> :
                    <div className={"goto-study"} onClick={() => this.createOrder(CourserIntroData.IsBuy,CourserIntroData.SurpluCount)}>
                      {
                        CourserIntroData.IsBuy ? "已报名" : "我要学习"
                      }
                    </div>
                }
              </div>
            }

          </CourseBottomStudy>


        </div>
      </div>
    )
  }
}

export default withRouter(RecordCourse)
