/**
 * Created by xj on 2017/9/5.
 *
 * 视频详情  课程介绍选项卡
 */
import React, {Component} from 'react';

import {List, Button, Toast} from 'antd-mobile';
import {CourseDetail} from '../../api'
import {searchParamName} from "../../utils/param/search-param"
import {withRouter} from 'react-router-dom';
import './CourseIntro.scss'

const Item = List.Item;
const Brief = Item.Brief;


// const preview =searchParamName('preview', this.props.location.search)

class CourseIntro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
      haveFocus: false,//是否关注讲师
      preview: searchParamName('preview', this.props.location.search)//是否是pc预览
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.data})
  }

  //关注
  focusTeacher(LecturerID) {
    //alert(1)
    console.log()
    if (this.state.preview === "pc") return;
    let data = {LecturerID: LecturerID};

    CourseDetail.FollowLecturer(data).then(res => {
      let courseID = {
        courseID: this.props.match.params.courseID,
      };
      if (res.Ret === 0) {
        this.setState({data: {...this.state.data, IsFollow: !this.state.data.IsFollow}});
        Toast.success(this.state.data.IsFollow ? "关注成功" : "取消关注", 2);

        // ()=> this.props.GetCourseInstro(courseID)
      }else{
        Toast.fail(`${this.state.data.IsFollow ? '关注' : '取消'}失败`);
      }
    })
  }

  //去看看
  toWatch(LecturerID) {
    this.props.history.push({pathname: `/expert-detail/${LecturerID}`,state:"isSee"})
    // this.props.history.push({pathname: `/examination`, state: {IDsAndType: IDs}})

  }

  render() {
    const {data, haveFocus} = this.state;

    return (
      <div className="course-intro">
        <List className="my-list">
          <Item extra={<div>
            <div style={{
              marginBottom: "0.5rem",
              color: "#ef823d"
            }}>{data.TeachWay === 1 ? `${data.QtySignUp}人已报名` : `剩余${data.SurpluCount ? data.SurpluCount : 0}名额`}</div>
            <div>学分:{data.Credit}</div>
          </div>} align="top" multipleLine>
            <b>{data.Name}</b>
            <Brief>共有{data.Count}节课</Brief>
            <Brief>授课方式:{data.TeachWayDesc}</Brief>
            <div className={data.TeachWay === 3 ? "current-block" : "current-none"}>
              <Brief>上课时间:</Brief>
              <Brief>{`${data.SDate}`}</Brief>
              <Brief>至{`${data.EDate}`}</Brief>
              <Brief>上课地点:</Brief>
              <Brief>{`${data.Area ? data.Area : "暂无"}`}</Brief>
            </div>
          </Item>
        </List>

        <List className="my-list teacher-introduce" renderHeader={() => '讲师简介'}>
          <Item extra={<Button type="ghost" inline size="small"
                               onClick={() => this.focusTeacher(data.LecturerID)}>{!data.IsFollow ? '+ 关注' : '已关注'}</Button>}
                thumb={data.HeadPic}>
            {data.LecturerName}
            {/*<Brief>好评率85%aa未确认aa</Brief>*/}
          </Item>
          <Item className="teacher-intro">
            <div style={{fontSize: "0.3rem"}}>{data.TeaInstro}</div>
          </Item>
        </List>

        <List className="my-list">
          <Item
            multipleLine
            onClick={() => {
            }}
            extra={<Button type="ghost" inline size="small" style={{marginRight: '0.08rem'}}
                           onClick={() => this.toWatch(data.LecturerID)}>去看看</Button>}
          >
            开设{data.LectuerCourses}门课程
          </Item>
        </List>
        <List renderHeader={() => '课程简介'} className="my-list" style={{marginBottom: "1.1rem"}}>
          <Item wrap>{data.Instro}</Item>
        </List>
      </div>
    )
  }
}

export default withRouter(CourseIntro);
