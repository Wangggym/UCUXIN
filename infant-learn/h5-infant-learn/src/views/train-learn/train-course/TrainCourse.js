import React from 'react'
import PropTypes from 'prop-types'
import {CourseItem, Progress, BottomStudy as Footer} from '../../../components'
import './train-course.scss'
import {Link, withRouter} from 'react-router-dom';
import {trainPlan, CourseDetail} from '../../../api'
//统计进度
const getPercent = (QtySignUp, QtyLimit) => {
  if (!QtySignUp && !QtyLimit) return 0
  const percent = Math.ceil((QtySignUp / QtyLimit) * 100)
  return percent
}

class TrainCourse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ViewModelList: {PlanCourseList: [], QtySignUp: 0, QtyLimit: 150}
    }
  }

  componentDidMount() {
    this.getPlanDetailByID()
  }

  // 培训学习》根据计划ID获取详情
  getPlanDetailByID(planID = this.props.match.params.planID) {
    trainPlan.getPlanDetailByID({planID}).then(res => {
      if (!res) return
      if (res.Ret === 0) {
        this.setState({ViewModelList: res.Data})
      }
    })
  }

  //收藏切换
  handleFavorClick = () => {
    trainPlan.favorCourse({rid: this.state.ViewModelList.ID}).then(res => {
      if (!res) return
      if (res.Ret === 0) {
        this.getPlanDetailByID()
      }
    })
  }

  /**
   * 分享
   */
  share() {
    let {ViewModelList} = this.state;
    let obj = {
      Desc: ViewModelList.TrainType,
      Title: ViewModelList.Name,
      ThumbImg: ViewModelList.CoverImg,
      Url: window.location.href,
      Type: 7,
    };
    window.location.href = 'ucux://forward?contentjscall=share';
    window.share = () => {
      return JSON.stringify(obj);
    };
  }


  handleClick = (boolean,TotalFee) => {
    boolean && this.createOrder(TotalFee)
  }


  createOrder(TotalFee) {
    let {ViewModelList} = this.state;
    let obj = {
      body: {
        RID: ViewModelList.ID,
        OrderType: 1,
      }
    };
    CourseDetail.CreatOrderInfo(obj).then((res => {
      if (res.Ret === 0) {
        if (!TotalFee) {
          this.getPlanDetailByID()
        } else {
          this.props.history.push('/pay-course/' + res.Data + '/' + encodeURIComponent(window.location.href));
        }
      }
    }));
  }

  render() {
    const {ViewModelList} = this.state;
    const {PlanCourseList, QtySignUp, QtyLimit} = ViewModelList;
    return (
      <div className='train-course'>
        <div className='header'>
          <CourseItem {...ViewModelList} />
          <div>
            <div className='apply-plan'> 报名：{QtySignUp}/{QtyLimit}</div>
            <Progress percent={getPercent(QtySignUp, QtyLimit)}/>
          </div>
        </div>
        <div className='main'>
          {PlanCourseList.length ? PlanCourseList.map((item, index) => {
            return (
              <Link to={`/course-detail/${item.ID}`} key={index}>
                <CourseItem {...item} blankTotalFee className="small-courseItem"/>
              </Link>
            )
          }) : null}
        </div>
        <Footer {...ViewModelList} onTranspondClick={() => this.share()} onFavorClick={this.handleFavorClick}
                onClick={this.handleClick}/>
      </div>
    )
  }
}

//限定控件传入的属性类型
TrainCourse.propTypes = {}

//设置默认属性
TrainCourse.defaultProps = {}


export default withRouter(TrainCourse)
