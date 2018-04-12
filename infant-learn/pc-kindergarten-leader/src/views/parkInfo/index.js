import React from 'react'
import PropTypes from 'prop-types'
import api from '../../api'
import {Spin, message, Button, Row, Col, Tabs, Form, Card} from 'antd'
import {Link} from 'react-router-dom'
import ParkInfoItem from './ParkInfoItem'
import TeacherInfo from './TeacherInfo'

const TabPane = Tabs.TabPane;
const FormItem = Form.Item
const NO_MESSAGE = '暂无信息'

export default class ParkInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      parkInfo: {
        Name: null,
        ImgUrl: null,
        History: null,
        CreatorName: null,
        Theory: null,
        Feature: null,
        Hardware: null,
        Tel: null,
        TeaName: null,
        AchievementList: [],
        Honor: null,
      },
      loading: false,
      ishasInfo: false,
      leaderList: [],
      TeacherList: [],

    }
  }

  componentDidMount() {
    this.getGardenInfo()
  }

  //获取园所信息
  getGardenInfo() {
    this.setState({loading: true})
    api.ParkInfo.getGardenInfo().then(res => {
      this.setState({loading: false})
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        if (res.Data && res.Data.ID !== '0') {
          this.setState({ishasInfo: true})
          this.getTeachers(res.Data.ID)
        }
        this.setState({parkInfo: res.Data})
      } else {
        message.info(res.Msg)
      }
    })
  }

  // 根据园所ID获取教师风采
  getTeachers(gardenID) {
    api.ParkInfo.getTeachers({gardenID}).then(res => {
      this.setState({loading: false})
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        this.getLeaderList(res.Data)
      } else {
        message.info(res.Msg)
      }
    })
  }

  //获得教师风采列表
  getLeaderList(data) {
    const leaderList = data.filter(({TeacherType}) => (TeacherType === 1))
    const TeacherList = data.filter(({TeacherType}) => (TeacherType === 2))
    this.setState({leaderList, TeacherList})
  }

  //切换tabs
  handleTabsChange = () => {

  }

  //编辑
  handleEditor = () => {
    const {leaderList, TeacherList} = this.state
    this.props.history.push(
      {
        pathname: '/editor-parkInfo',
        state: {parkInfo: this.state.parkInfo, leaderList, TeacherList}
      }
    )
  }

  render() {
    const {
      parkInfo: {Name, ImgUrl, History, CreatorName, Theory, Feature, Hardware, Tel, TeaName, AchievementList, Honor},
      loading, ishasInfo, leaderList, TeacherList
    } = this.state
    return (
      <Spin spinning={loading}>
        {
          ishasInfo ? <Tabs defaultActiveKey="1" onChange={this.handleTabsChange}
                            tabBarExtraContent={<Button onClick={this.handleEditor} type='primary'>编辑</Button>}>
            <TabPane tab="园所介绍  " key="1">
              <ParkInfoItem label={'园所名称'} content={Name}/>
              <ParkInfoItem label={'机构图片'} content={ImgUrl} type='img'/>
              <ParkInfoItem label={'园所历史'} content={History}/>
              <ParkInfoItem label={'办学理念'} content={Theory}/>
              <ParkInfoItem label={'园所特色'} content={Feature}/>
              <ParkInfoItem label={'硬件环境介绍'} content={Hardware}/>
              <ParkInfoItem label={'咨询电话'} content={Tel}/>
              <ParkInfoItem label={'咨询老师'} content={TeaName}/>
            </TabPane>
            <TabPane tab="荣誉成果" key="2">
              <ParkInfoItem label={'荣誉介绍 '} content={Honor}/>
              <ParkInfoItem label={'成果展示 '} content={AchievementList}/>
            </TabPane>
            <TabPane tab="教师风采" key="3">
              <div className='mien-title'><span>园长介绍</span></div>
              {
                leaderList && leaderList.length ? leaderList.map(({Name, Instro, HeadImg}, index) => {
                  return <TeacherInfo key={index} Name={Name} Instro={Instro} HeadImg={HeadImg}/>
                }) : NO_MESSAGE
              }
              <div className='mien-title'><span>老师介绍</span></div>
              {
                TeacherList && TeacherList.length ? TeacherList.map(({Name, Instro, HeadImg}, index) => {
                  return <TeacherInfo key={index} Name={Name} Instro={Instro} HeadImg={HeadImg}/>
                }) : NO_MESSAGE
              }
            </TabPane>
          </Tabs> : <div>暂无内容，可点击 “<a href="javascript:void(0);" onClick={this.handleEditor}>编辑</a> ”</div>
        }
      </Spin>
    )
  }
}

//限定控件传入的属性类型
ParkInfo.propTypes = {}

//设置默认属性
ParkInfo.defaultProps = {}
