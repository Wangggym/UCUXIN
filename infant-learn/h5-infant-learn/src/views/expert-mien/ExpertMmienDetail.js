import React from 'react'
import PropTypes from 'prop-types'
import {trainPlan} from '../../api'
import {HeadComp, ListItem, ButtonGroup, NoContent, T_care, T_Time, PullRefreshComp} from '../../components'
import './ExpertMmienDetail.scss'
import {Link} from 'react-router-dom'
import {Accordion, Tabs, Toast} from 'antd-mobile'
import PlanList from './PlanList'
import CourseListCount from './CourseListCount'
import CourseList from './CourseList'

const TabPane = Tabs.TabPane
const PersonType = {1: 'planList', 2: 'learnList'}
const listItemType = {
  Instro: '个人简介',
  Achieve: '个人成就',
}
const groupType = (bool) => {
  if (bool) {
    return [
      {key: 'parkInfo', value: '园所介绍'},
      {key: 'learn-flie', value: '学习档案'},
      {key: 'courseList', value: '开设课程'},
    ]
  }
  return [
    {key: 'parkInfo', value: '园所介绍'},
    {key: 'courseList', value: '开设课程'},
  ]
}

export default class ExpertMmienDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorName: groupType()[0].key,
      planList: [],
      learnList: [],
      hasLearnFile: false,
      hideSomeThing: this.props.location.state === "isSee" || false
    }
  }

  componentDidMount() {
    this.getLecturerDetail();
  }

  //检查是否显示学习档案
  hasLearnFileCheck() {
    const {planList, learnList} = this.state
    if (planList.length !== 0 && learnList !== 0) this.setState({hasLearnFile: true})
  }

  // 根据讲师ID获取讲师详情
  getLecturerDetail() {
    trainPlan.getLecturerDetail({lecturerID: this.props.match.params.lecturerID}).then(res => {
      if (!res) return
      if (res.Ret === 0) {
        this.setState({...res.Data})
        const {ID} = res.Data
        this.getUserCreditOfYear(1, ID)
        this.getUserCreditOfYear(2, ID)
      }
    })
  }


  // 获取个人用户培训学分统计（学员+园长首页培训统计报表）--培训+幼学学分上部分
  getUserCreditOfYear(type, uid) {
    trainPlan.getUserCreditOfYear({uid, type}).then(res => {
      if (!res) return
      if (res.Ret === 0) {
        this.setState({[PersonType[type]]: res.Data.UserYearCreditH5ModelList}, () => this.hasLearnFileCheck())
      }
    })
  }

  scrollToAnchor = (anchorName) => {
    this.setState({anchorName})
    if (anchorName) {
      // 找到锚点
      let anchorElement = document.getElementById(anchorName);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  }

  //关注
  handleCareClick = () => {
    const newFollow = !this.state.IsFollow
    this.setState({IsFollow: newFollow})
    trainPlan.followLecturer({lecturerID: this.state.ID}).then(res => {
      if (!res) return
      if (res.Ret === 0) {
        Toast.success(T_care(newFollow), T_Time)
      }
      trainPlan.getLecturerDetail({lecturerID: this.props.match.params.lecturerID}).then(res => {
        if (!res) return
        if (res.Ret === 0) {
          this.setState({...res.Data})
        }
      })
    })
  }


  render() {
    const {Instro, Achieve, anchorName, ImgGarden, GardenID, planList, learnList, ID, IsFollow, UID, hideSomeThing} = this.state
    return (
      <div className='expert-detail'>
        <HeadComp {...this.state} />
        {
          //hideSomeThing从"课程详情"->"去看看"，隐藏一些界面
          !hideSomeThing&&<div className='care' onClick={this.handleCareClick}><span
            className={!IsFollow ? 'cared' : 'nocare'}>{!IsFollow ? '关注' : '已关注'}</span>
          </div>
        }
        <div className='message'>
          <ListItem title={listItemType.Instro}>{Instro}</ListItem>
          {
            !hideSomeThing && <ListItem title={listItemType.Achieve}>{Achieve}</ListItem>
          }
        </div>
        {
          !hideSomeThing && ImgGarden &&
          <ButtonGroup
            groupType={groupType(this.state.hasLearnFile)}
            onClick={this.scrollToAnchor} className={'anchor'}
                       active={anchorName} />
        }

        {
          !hideSomeThing && ImgGarden && <Link to={`/parkDetail/${GardenID}`} className='park'>
            <div className='pic'>
              <img src={ImgGarden}/>
              <div>点击查看详情</div>
            </div>
          </Link>
        }
        {this.state.hasLearnFile && <div className='blank-title' id='learn-flie'>学习档案</div>}
        {this.state.hasLearnFile && <Tabs defaultActiveKey="1" animated={true} swipeable={false}>
          <TabPane tab='培训学习' key="1">
            <Accordion accordion className="annual" openAnimation={{}}>
              {planList && planList.length ? planList.map(({Year, Credit, QtyLearnCourse, QtyPassLearnCourse}, index) => (
                <Accordion.Panel
                  key={index}
                  header={
                    <div className='annual-title'>
                      <span>{Year}年度</span>
                      <span className='orange-color'>获得学分：{Credit}</span>
                    </div>}
                >
                  <PlanList api={trainPlan.getUserTrainCreditDetail} fields={{uid: UID, year: Year}}/>
                </Accordion.Panel>
              )) : <NoContent/>}
            </Accordion>
          </TabPane>
          <TabPane tab='自主学习' key="2">
            <Accordion accordion className="annual" openAnimation={{}}>
              {learnList && learnList.length ? learnList.map(({Year, Credit, QtyLearnCourse, QtyPassLearnCourse}, index) => (
                <Accordion.Panel
                  key={index}
                  header={
                    <div className='annual-title'>
                      <span>{Year}年度</span>
                      <span className='orange-color'>获得学分：{Credit}</span>
                    </div>}
                >
                  <CourseListCount api={trainPlan.getUserSelfCreditDetail} fields={{uid: UID, year: Year}}/>
                </Accordion.Panel>
              )) : <NoContent/>}
            </Accordion>
          </TabPane>
        </Tabs>}
        <div className='blank-title' id='courseList'>TA开设的课程</div>
        {ID ? <PullRefreshComp Comp={CourseList} api={trainPlan.getHomeMyCoursePage} fields={{uid: UID}}/> :
          <NoContent/>}
        {/*<CourseList/>*/}
      </div>
    )
  }
}

//限定控件传入的属性类型
ExpertMmienDetail.propTypes = {}

//设置默认属性
ExpertMmienDetail.defaultProps = {}
