import React from 'react'
import PropTypes from 'prop-types'
import './TrainNotice.scss'
import img from '../../assets/images/file_icon_def.png'
import {trainPlan} from '../../api'
import {withRouter} from 'react-router-dom'
import {ListItem} from '../../components'

const listType = {
  Name: '培训名称',
  Cnt: '培训内容',
  DestPeople: '培训对象',
  LecturerList: '授课讲师',
  Credit: '总学分',
  EndDate: '截止时间',
}
//是否可报名状态（1-未报名，2-名额已满，3-已报名）
const SignUpSTType = [, '立即报名', '名额已满', '已报名','已截止']

//审核状态
const AuditSTType = {10: '未发布', 20: '已发布', 30: '待审核', 40: '审核驳回', 50: '审核通过'}

export default class TrainNotice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.getTrainPlanSignUpModel()
  }

  getTrainPlanSignUpModel() {
    const {trainPlanID, gId, isUser = false} = this.props.match.params
    trainPlan.getTrainPlanSignUpModel({trainPlanID, gId, isUser}).then(res => {
      if (!res) return
      if (res.Ret === 0) {
        if (!res.Data) return
        this.setState({...res.Data})
      }
    })
  }

  getLecturerList(LecturerList) {
    let stringList = []
    if (!(LecturerList && LecturerList.length)) return null
    LecturerList.forEach(({Name}) => {
      stringList.push(Name)
    });
    return stringList.join('、');
  }

  handleClick() {
    let {SignUpST, ID} = this.state
    const {trainPlanID, gId} = this.props.match.params
    if (SignUpST !== 1) return
    this.props.history.push({pathname: `/apply/${trainPlanID}/${ID}/${gId}`})
  }

  render() {
    let {ID, Name, AttachName, Cnt, DestPeople, LecturerList, Credit, EndDate, AttachUrl, AttachCnt, QtySignUped, QtyLimit, SignUpST, AuditST, Title} = this.state
    return (
      <div className='TrainNotice'>
        <header>
          {Title}
        </header>
        <main>
          <ListItem title={listType.Name}>{Name}</ListItem>
          <ListItem title={listType.Cnt}>{Cnt}</ListItem>
          <ListItem title={listType.DestPeople}>{this.getLecturerList(DestPeople)}</ListItem>
          <ListItem title={listType.LecturerList}>{this.getLecturerList(LecturerList)}</ListItem>
          <ListItem title={listType.Credit}>{Credit}</ListItem>
          <ListItem title={listType.EndDate}>{EndDate}</ListItem>

          <div className='affix'>
            <a className='affix-url' href={AttachUrl}>
              <img src={img}/>
              <div className='content'>
                <span className='name'>{AttachName}</span>
                {/* <span className='size'>120KB</span> */}
              </div>
            </a>
            <div className='affix-content'>
              <div className='title'>附件内容</div>
              <div className='content'>{AttachCnt}</div>
            </div>
          </div>
        </main>
        <footer>
          <div className='left-content'>
            <div className='orange-color'>{AuditSTType[AuditST]}</div>
            {SignUpST === 1 && <span></span>}
            {SignUpST === 1 && <div>{QtySignUped}人报名</div>}
          </div>
          <div className='right-content' style={SignUpST === 1 ? null : {background: '#888'}}
               onClick={this.handleClick.bind(this)}>
            {SignUpSTType[SignUpST]}
          </div>
        </footer>
      </div>
    )
  }
}

//限定控件传入的属性类型
TrainNotice.propTypes = {}

//设置默认属性
TrainNotice.defaultProps = {}
