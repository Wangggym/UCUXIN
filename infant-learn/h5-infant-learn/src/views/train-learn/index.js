import React from 'react'
import PropTypes from 'prop-types'
import {Tabs, Icon, Toast} from 'antd-mobile';
import './style.scss'
import {Link, withRouter} from 'react-router-dom';
import {CourseItem, ButtonGroup} from '../../components'
import {trainPlan} from '../../api'
import MyCourse from './MyCourse'
import AllPlan from './AllPlan'

const TabPane = Tabs.TabPane;
const LinkType = [, '全部课程', '全部课程', '全部课程', '全部课程']
const courseName = [, '我的培训课程', '我的自主课程', '我的自主课程']
const getCourseApi = [, trainPlan.getMyPlanCoursePage, trainPlan.getAutonoMyCoursePage, trainPlan.getAutonoMyCoursePage]
export default class TrainLearn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mycourse: -1,
      planType: -1,
      forceUpdata: false,
    }
    this.courseType = this.props.match.params.courseType;
    this.getList = this.courseType === '1' ? trainPlan.getPlanPage : trainPlan.getAllCoursePage
    this.courseApi = getCourseApi[this.props.match.params.courseType]
  }

  handleStudySTClick(fields, value) {
    this.setState({[fields]: value, forceUpdata: !this.state.forceUpdata})
  }

  render() {
    const {forceUpdata, mycourse, planType} = this.state;
    const isAlbum = this.props.match.params.courseType === "3";
    return (
      <Tabs
        swipeable={false}
        className='app-tabs'
      >
        <TabPane tab={LinkType[this.courseType]} key="1">
          {
            this.courseType === '1' && <ButtonGroup
              groupType={[
                {key: 0, value: '全部'},
                {key: 1, value: '国培'},
                {key: 2, value: '省培'},
                {key: 3, value: '市培'},
                {key: 4, value: '区县培训'},
                {key: 5, value: '付费学分'},
              ]}
              onClick={(value) => this.handleStudySTClick('planType', value)} active={planType}/>
          }
          <AllPlan api={this.getList}
                   forceUpdata={forceUpdata}
                   fields={{
                     courseType: this.courseType,
                     isAlbum,
                     trainType: planType === 5 ? 0 : planType,
                     isPay: planType === 5
                   }}
                  />
          {/* CourseType={this.courseType}*/}
        </TabPane>
        <TabPane tab={courseName[this.courseType]} key="2">
          <ButtonGroup onClick={(value) => this.handleStudySTClick('mycourse', value)} active={mycourse}/>
          <MyCourse api={this.courseApi} forceUpdata={forceUpdata}
                    fields={{StudyST: mycourse}} height={'85vh'}/>
        </TabPane>
      </Tabs>
    )
  }
}


//限定控件传入的属性类型
TrainLearn.propTypes = {}

//设置默认属性
TrainLearn.defaultProps = {}


