import React from 'react'
import PropTypes from 'prop-types'
import ParkTabs from './components/ParkTabs'
import ImageText from './components/ImageText'
import {trainPlan} from '../../api'
import './style.scss'

export default class ParkDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 0,
      parkInfo: {},
      teacherInfo: [],
    }
  }

  componentDidMount() {
    this.getGardenInfoByID()
    this.getTeachers()
  }

  // 根据ID获取圆所详情
  getGardenInfoByID(gardenID = this.props.match.params.gardenID) {
    trainPlan.getGardenInfoByID({gardenID}).then(res => {
      if (!res) return
      if (res.Ret === 0) {
        this.setState({parkInfo: res.Data})
      }
    })
  }

  // 根据园所ID获取教师风采
  getTeachers(gardenID = this.props.match.params.gardenID) {
    trainPlan.getTeachers({gardenID}).then(res => {
      if (!res) return
      if (res.Ret === 0) {
        this.setState({teacherInfo: res.Data})
      }
    })
  }

  //切换展示
  handleChangeTabs = (active) => {
    this.setState({active})
  }

  //根据active展示内容
  getContent(active, parkInfo, teacherInfo) {
    if (active === 0) {
      const {History, Theory, TeaName, Tel} = parkInfo
      return (
        <div>
          <div className='classify'>
            <div className='title'>园所历史</div>
            <p>{History}</p>
          </div>
          <div className='classify'>
            <div className='title'>办学理念</div>
            <p>{Theory}</p>
          </div>
          <div className='classify'>
            <div className='title'>咨询老师</div>
            <ImageText {...parkInfo}/>
          </div>
        </div>
      )
    }
    if (active === 1) {
      const parkLoader = teacherInfo.filter(({TeacherType}) => TeacherType === 1)
      const teacher = teacherInfo.filter(({TeacherType}) => TeacherType === 2)
      return (
        <div>
          <div className='classify'>
            <div className='title'>园长简介</div>
            {
              parkLoader && parkLoader.length ? parkLoader.map(({ID, Instro, Name, HeadImg, TeacherTypeDesc}, index) => {
                return (
                  <div key={ID}>
                    <ImageText TeaName={Name} imgUrl={HeadImg} TeacherTypeDesc={TeacherTypeDesc}/>
                    <p>{Instro}</p>
                    {index + 1 !== parkLoader.length && <div className='border-bottom1PX'></div>}
                  </div>
                )
              }) : null
            }
          </div>
          <div className='classify'>
            <div className='title'>老师简介</div>
            {
              teacher && teacher.length ? teacher.map(({ID, Instro, Name, HeadImg, TeacherTypeDesc}, index) => {
                return (
                  <div key={ID}>
                    <ImageText TeaName={Name} imgUrl={HeadImg} TeacherTypeDesc={TeacherTypeDesc}/>
                    <p>{Instro}</p>
                    {index + 1 !== teacher.length && <div className='border-bottom1PX'></div>}
                  </div>
                )
              }) : null
            }
          </div>
        </div>
      )
    }
    if (active === 2) {
      const {AchievementList, Honor} = parkInfo
      return (
        <div>
          <div className='classify'>
            <div className='title'>荣誉介绍</div>
            <p>{Honor}</p>
          </div>
          <div className='honor-pic'>
            {AchievementList && AchievementList.length ? AchievementList.map(({Desc, ImgUrl}, index) => (
              <div key={index}>
                <img src={ImgUrl}/>
                <div style={{'marginBottom': '0.3rem'}}>{Desc}</div>
              </div>
            )) : null}
          </div>
        </div>
      )
    }
  }

  render() {
    const {active, parkInfo, teacherInfo} = this.state
    return (
      <div className='park-detail'>
        <div className='pic'>
          <img src={parkInfo.ImgUrl}/>
        </div>
        <ParkTabs active={active} onClick={this.handleChangeTabs}/>
        {this.getContent(active, parkInfo, teacherInfo)}
      </div>
    )
  }
}

//限定控件传入的属性类型
ParkDetail.propTypes = {}

//设置默认属性
ParkDetail.defaultProps = {}
