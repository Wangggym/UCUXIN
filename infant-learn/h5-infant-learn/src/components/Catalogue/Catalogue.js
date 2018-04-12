/**
 * Created by xj on 2017/9/5.
 */
import React, {Component} from 'react';
import {List, Button, Toast} from 'antd-mobile';
import {withRouter} from 'react-router-dom';
import oss from '../../utils/oss';

import {NoContent} from '../../components'
import "./Catalogue.scss";
import moment from 'moment';
import {CourseDetail} from '../../api'

import files from "../../assets/images/file_icon_def.png"
import examination from "../../assets/images/file_icon_examination.png"
import mp4 from "../../assets/images/file_icon_mp4.png"
import videoO from "../../assets/images/file_icon_video_.png"
import videoG from '../../assets/images/file_icon_video_g.png'
import videoT from "../../assets/images/file_icon_video.png"
import word from "../../assets/images/file_icon_word.png"

import download from "../../assets/images/yx_download.png"
import play from "../../assets/images/yx_play.png"
import arrow from "../../assets/images/right_arrow_gray.png"
import {searchParamName} from "../../utils/param/search-param"

const Item = List.Item;
const Brief = Item.Brief;

class Catalogue extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //preview:searchParamName('preview', this.props.location.search),//pc端预览
      data: this.props.data,
      isShowLock: this.props.isShowLock,
      // isShowLock: this.props.courserIntroData.IsSortLearn,
      isBuy: this.props.IsBuy,
      sid: "",//视频 直播所需
      fileAddr: "",//文件地址
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      isShowLock: nextProps.isShowLock,
      isBuy: this.props.IsBuy,
      IsCanLearn:this.props.IsCanLearn
    })
  }

  checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  //处理直播视频的时间显示
  handleTime(tiem) {
    let hours = parseInt(tiem / 60 / 60 % 24, 10); //计算剩余的小时
    let minutes = parseInt(tiem / 60 % 60, 10);//计算剩余的分钟
    let seconds = parseInt(tiem % 60, 10);//计算剩余的秒数
    hours = this.checkTime(hours);
    minutes = this.checkTime(minutes);
    seconds = this.checkTime(seconds);
    return hours + ":" + minutes + ":" + seconds
  }

  //点击目录列表，根据不同的类型,进入不同的页面（不同的操作）
  toSee(item,isCanPlay) {
    if (!this.props.IsBuy) {
      Toast.info('尚未购买，请点击“我要学习”进行购买!');
      return;
    }
    if(!this.props.IsCanLearn){
      Toast.info("未到学习时间喔！");
      return;
    }
    if(isCanPlay===0){
      Toast.info('请先学习已解锁的目录');
      return;
    }
    // e.CourseCatalogID,e.YLSResourceID, e.ResourceType,e.ResourceName
    let sendData = {
      // resourceID: item.ResourceID,     //10.17 修改（剔）
      resourceID: item.YLSResourceID
    };
    //获取文件资源
    if (item.ResourceType === 1) {
      CourseDetail.GetFileUrlByResourceID(sendData).then(res => {
        if (res.Ret === 0) {
          this.setState({
            fileAddr: res.Data
          }, () => this.fileDownLoad(this.state.fileAddr, item.ResourceName))
        }
      })
    }
    //获取视频资源
    if (item.ResourceType === 2 || item.ResourceType === 3) {
      let {isBuy} = this.state;
      if (!isBuy) {
        Toast.info('尚未购买，请点击“我要学习”进行购买!');
        return;
      }
      if (item.ResourceType === 2) {
        CourseDetail.GetVideoIDByResourceID(sendData).then(res => {
          if (res.Ret === 0) {
            this.setState({
              sid: res.Data
            }, () => this.toPlay(item.CourseCatalogID, this.state.sid, item.ResourceType))
          }
        })
      } else {
        if (item.LiveST == 4) {
          Toast.info('直播已结束，请到目录中点击回看!')
          return;
        }
        this.toPlay(item.CourseCatalogID, item.ResourceID, item.ResourceType)
      }
    }
    //跳转试题界面
    if (item.ResourceType === 4) {
      let IDs = {
        courseID: this.props.match.params.courseID,
        YLSResourceID: item.YLSResourceID,
        type: 2  //1考试  2练习
      }
      this.props.history.push({pathname: `/examination`, state: {IDsAndType: IDs}})
    }

  }

//文件下载
  fileDownLoad(fileAddr, ResourceName) {
    oss.ali.download(fileAddr, ResourceName);
  }

//调ux视频播放
  toPlay(catalogID, sid, type) {
    window.playBack = (json) => {
      let object, info;
      info = JSON.parse(json);
      object = {
        courseID: this.props.match.params.courseID,
        catalogID: catalogID,
        Duration: info.Position,
      };
      CourseDetail.SetLearnRecord(object).then(res => {
        if (res.Ret === 0) {
          //观看后重新调取接口获取学习状态
          this.props.getCatalogue()
        } else {
          // alert(JSON.stringify(res));
        }
      })
    };
    /* 为native app做暂停需要记录的信息 start*/
    let businessParams = [];
    for (let i = 0; i < 5; i++) {
      businessParams.push({"Time": Math.floor(Math.random() * 4000), "Pause": true, "Msg": ""});
    }
    let buz = JSON.stringify(businessParams);
    let params = encodeURI(buz);
    /* 为native app做暂停需要记录的信息 end*/
    if (type === 3) {

      window.location.href = `ucux://player/liveplay?sid=${sid}&callback=playBack`;
    } else {
      // window.location.href = `ucux://player/videoplay?sid=${sid}&callback=playBack`;
      window.location.href = `ucux://player/videoplay?sid=${sid}&unforward=1&businessparams=${params}&title=&url=&extraparams=&callback=playBack`
    }
  }

  render() {
    const {data} = this.state;
    return (
      <div>
        {
          data && data.length ? data.map((item, key) => {
            return (
              <div className="courser-list" key={key}>
                <div className="course-title">
                  <span>{item.Name}</span>
                  {
                    !this.state.isShowLock ?
                      <span style={{
                        fontWeight: "normal",
                        color: "#a7a7a7"
                        // this.props.isShowText用于在目录下是否显示文字，
                      }}>{!this.props.isShowText && item.LearnSTDesc}</span> :(item.LearnST===0?<div className="lock">
                        <img src={require("../../assets/images/yx_lock.png")} alt=""/>
                      </div>:<span style={{color:"#a7a7a7"}}>{item.LearnSTDesc}</span>)

                  }
                </div>

                {
                  item.CourseResourceDetails.length !== 0 ? item.CourseResourceDetails.map((e, i) => {
                    let logo = "";
                    let smallLogo = "";
                    let size = "";
                    switch (e.ResourceType) {
                      case 1:
                        logo = files;
                        smallLogo = download;
                        size = parseInt(e.Size / 1024) + "KB";
                        break;
                      case 2:
                        logo = mp4;
                        smallLogo = play;
                        size = this.handleTime(e.Duration);
                        break;
                      case 3:
                        logo = videoO;
                        smallLogo = play;
                        size = e.SDate;
                        break;
                      case 4:
                        logo = examination;
                        smallLogo = arrow;
                        size = `共${e.Count}道题`;
                        break;
                      case 5:
                        logo = word;
                        smallLogo = arrow;
                        break;
                      case 6:
                        logo = videoT;
                        smallLogo = play;
                        break;
                      default:
                    }
                    if (e.ResourceType === 6) {
                      return (
                        <div className="addr-time" key={e.ID}>
                          <div className="addr">
                            <span/>
                            <span>上课时间:{e.SDate}<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{e.EDate}</span>
                          </div>
                          <div className="tiem">
                            <span/>
                            <span>上课地点:{e.Addr}</span>
                          </div>
                        </div>
                      )
                    } else {
                      if(e.LiveST===4){
                        logo=videoG
                      }
                      return (
                        <div className="catalogue-list" key={i}
                             onClick={() => this.toSee(e,item.LearnST)}>
                          <div className="logo-left">
                            <img src={logo} alt=""/>

                          </div>
                          <div className="list-content">
                            <div className="list-content-title">
                              {e.ResourceName}
                            </div>
                            <div className="list-content-subtitle">
                              {size}
                            </div>
                          </div>
                          <div
                            className={"logo-right " + (e.LiveST === 2 ? "action" : "end-action")}>
                            {
                              e.ResourceType === 3 ? `${e.LiveSTDesc}` :
                                <img src={smallLogo} alt=""/>
                            }
                          </div>
                        </div>

                      )
                    }
                  }) : ""//<NoContent/>
                }
              </div>
            )
          }) : <NoContent/>
        }

      </div>
    )
  }
}

export default withRouter(Catalogue);
