import React, {Component} from 'react';
import {Row, Col, Card, Button, Input, Checkbox, Select, Popconfirm, message} from 'antd'
import './style.scss'
import Statistics from './Statistics'
import TestPaperTitle from './TestPaperTitle'
import MoveButtonGroup from './MoveButtonGroup'
import TestPaperDetails from './TestPaperDetails'
import Category from './Category';
import api from '../../../../api';
import {withRouter} from 'react-router-dom'

const {TextArea} = Input
const ButtonGroup = Button.Group;
const Option = Select.Option
const cssRoot = 'AddTestPaper'

const defaultPart = () => {
  return {
    ID: '0',
    Name: '',
    Remark: '',
    PaperQuestions: [],
  }
}

const defaultState = () => {
  return {
    Name: '',           //试卷名称
    Subtitle: '',       //副标题
    Desc: '',           //试卷描述（该信息考生不可见）
    Remark: '',         //考试说明（考生可见）
    TotalTime: 120,    //总时长
    QtyQuestion: 0,     //总题目数
    TotalScore: 0,      //总分值
    HasPart: false,     //是否包含部分
    Parts: [],
    PaperQuestions: [],
    categoryValue: {}
  }
}
const initailStateMethod = (data) => {
  const {addTestPaper, selectSubject, index} = data
  let newState = {...addTestPaper}
  if (index === -1) {
    newState.PaperQuestions = newState.PaperQuestions.concat(selectSubject)
    return newState
  }
  let newPaperQuestions = newState.Parts[index].PaperQuestions
  newPaperQuestions = newPaperQuestions.concat(selectSubject)
  newState.Parts[index].PaperQuestions = newPaperQuestions
  return newState
}

const getScore = (PaperQuestions) => {
  for (let i = 0; i < PaperQuestions.length; i++) {
    if (!PaperQuestions[i].Score) return `第${i + 1}题未设置分值`
  }
}

const checkFields = (data) => {
  const {Name, Desc, HasPart, Parts, PaperQuestions, categoryValue: {People, CategroyIDs, ResourceTags, Difficulty, PropertyList}} = data
  const please = '请选择'
  if (!People) return please + '请选择适用对象'
  if (!CategroyIDs) return please + '所属分类'
  if (!ResourceTags) return please + '标签'
  if (!Difficulty) return please + '难度'
  if (!PropertyList) return please + '属性'
  if (!Name) return '试卷名称' + '必填'
  if (!Desc) return '试卷描述' + '必填'
  if (!HasPart && !(PaperQuestions.length)) return '至少选择一道题'
  if (!HasPart) {
    const error = getScore(PaperQuestions)
    if (error) return error
  }
  if (HasPart) {
    for (let i = 0; i < Parts.length; i++) {
      if (!Parts[i].Name) return `第${i + 1}部分名称必填`
      if (!Parts[i].PaperQuestions.length) return `第${i + 1}部分没有题`
      let error = getScore(Parts[i].PaperQuestions)
      if (error) return `第${i + 1}部分` + error
    }
  }
}

const formatTest = (data) => {
  data.TotalTime = data.TotalTime * 60
  const getNewPaperQuestions = (PaperQuestions) => {
    const newPaperQuestions = []
    PaperQuestions.forEach(({ID, Type, Score}, index) => {
      newPaperQuestions.push({QuestionID: ID, Type, Seq: index, Score})
    })
    return newPaperQuestions
  }
  const {Name, Subtitle, Desc, Remark, TotalTime, QtyQuestion, TotalScore, HasPart, Parts, PaperQuestions, categoryValue: {People, CategroyIDs, ResourceTags, Difficulty, PropertyList}} = data
  let newData = {
    Name,
    Subtitle,
    Desc,
    Remark,
    TotalTime,
    QtyQuestion,
    TotalScore,
    ID: '0',
    Orgin: '资源组织平台',
    ST: true,
    People,
    CategroyIDs,
    ResourceTags,
    Difficulty,
    PropertyList
  }
  if (!HasPart) {
    const newPaperQuestions = getNewPaperQuestions(PaperQuestions)
    newData = {...newData, HasPart, PaperQuestions: newPaperQuestions}
    return newData
  }
  let newParts = []
  Parts.forEach((item, index) => {
    const {ID, Remark, Name} = item
    const newPaperQuestions = getNewPaperQuestions(item.PaperQuestions)
    newParts.push({ID, Remark, Name, Seq: index, PaperQuestions: newPaperQuestions})
  })
  newData = {...newData, HasPart, Parts: newParts}
  return newData
}

const arrayElementMove = (field, array, index) => {
  if (field === 'up') {
    array[index - 1] = array.splice(index, 1, array[index - 1])[0]
    return array
  }
  array[index + 1] = array.splice(index, 1, array[index + 1])[0]
  return array
}

class AddTestPaper extends Component {
  constructor(props) {
    super(props)
    const initailState = props.location.state ? initailStateMethod(props.location.state) : defaultState()
    this.state = {...initailState}
  }

  componentDidMount() {
    let TotalScore = 0
    let QtyQuestion = 0
    const {Parts, HasPart, PaperQuestions} = this.state
    if (Parts.length) {
      TotalScore = this.totalScore(Parts)
      QtyQuestion = this.totalTopic(Parts)
    }
    if (!HasPart && PaperQuestions.length) {
      TotalScore = this.PaperQuestionsTotalScore(PaperQuestions)
      QtyQuestion = this.PaperQuestionsTotalTopic(PaperQuestions)
    }
    this.setState({TotalScore, QtyQuestion})
  }

  //标题change
  handleTitleChange = (field, value) => {
    this.setState({[field]: value})
  }

  //统计信息change
  handleStatisticsChange = (TotalTime) => {
    this.setState({TotalTime})
  }

  handleCategoryChange = (values) => {
    this.state.categoryValue = {...this.state.categoryValue, ...values}
  }

  //保存试卷
  handleSaveTest = () => {
    console.log('lastTime', this.state)
    const error = checkFields(this.state)
    if (error) return message.info(error)
    const body = formatTest(this.state)
    api.TopicVolume.AddPaper({body}).then(res => {
      if (res.Ret === 0) {
        message.success('保存试卷成功')
        this.props.history.push({pathname: '/test-paper'})
        // this.setState({ loading: false, visible: false })
      } else {
        message.info(res.Msg)
      }
    })
    // const data = { body }
    // const url = 'http://10.10.12.188/Resource/v3/QuePap/AddPaper?token=58b62559f2624a419d915672d5faf200'
    // fetch(url, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //     body: queryString(data.body)
    // }).then(function (response) {
    //     return response.json();
    // }).catch(function (ex) {
    //     console.log('parsing failed', ex)
    // });
    console.log('submit', body)
  }

  //添加新部分
  handleAddPart = () => {
    const {Parts, HasPart, PaperQuestions} = this.state
    const newPart = defaultPart()
    let newParts = []
    if (!HasPart) {
      newPart.PaperQuestions = PaperQuestions
      newParts.push(newPart)
      return this.setState({Parts: newParts, HasPart: true})
    }
    newParts = [...Parts, newPart]
    this.setState({Parts: newParts})
    // this.parts = newParts
    // console.log(this.parts)
  }

  //删除部分
  handleDeletePart = (index) => {
    const {Parts} = this.state
    let newParts = [...Parts]
    newParts = newParts.filter((item, thisIndex) => thisIndex !== index)
    if (!newParts.length) return this.setState({
      Parts: newParts,
      HasPart: false,
      PaperQuestions: [],
      TotalScore: 0,
      QtyQuestion: 0
    })
    const TotalScore = this.totalScore(newParts)
    const QtyQuestion = this.totalTopic(newParts)
    this.setState({Parts: newParts, TotalScore, QtyQuestion})
    // this.parts = newParts
    // console.log(this.parts)
  }

  //部分值改变
  handlePartsChange = (index, field, value) => {
    const {Parts} = this.state
    const newParts = []
    Parts.forEach((item, thisIndex) => {
      let newItem = item
      if (thisIndex === index) {
        newItem = {...item, [field]: value}
      }
      newParts.push(newItem)
    })
    this.setState({Parts: newParts})
    // this.parts = newParts
    // console.log(this.parts)
  }

  handleTestPaperDetailsChange(index, value) {
    if (index === -1) {
      const TotalScore = this.PaperQuestionsTotalScore(value)
      const QtyQuestion = this.PaperQuestionsTotalTopic(value)
      return this.setState({PaperQuestions: value, TotalScore, QtyQuestion})
    }
    const {Parts} = this.state
    const newParts = [...Parts]
    newParts[index].PaperQuestions = value
    const TotalScore = this.totalScore(newParts)
    const QtyQuestion = this.totalTopic(newParts)
    this.setState({Parts: newParts, TotalScore, QtyQuestion})
  }

  //计算分值
  totalScore(Parts, noPartPaperQuestions) {
    let TotalScore = 0
    if (Parts) {
      Parts.forEach(({PaperQuestions}) => {
        let thisPartScore = this.PaperQuestionsTotalScore(PaperQuestions)
        if (thisPartScore) TotalScore += thisPartScore
      })
      return TotalScore
    }
    return this.PaperQuestionsTotalScore(noPartPaperQuestions)
  }

  //计算总数
  totalTopic(Parts, noPartPaperQuestions) {
    let QtyQuestion = 0
    if (Parts) {
      Parts.forEach(({PaperQuestions}) => {
        let thisPartScore = this.PaperQuestionsTotalTopic(PaperQuestions)
        if (thisPartScore) QtyQuestion += thisPartScore
      })
      return QtyQuestion
    }
    return this.PaperQuestionsTotalTopic(noPartPaperQuestions)
  }

  //单个分值
  PaperQuestionsTotalScore(PaperQuestions) {
    let ScoreTotal = 0
    if (PaperQuestions.length) {
      PaperQuestions.forEach(({Score}) => {
        if (Score) ScoreTotal += Score
      })
    }
    return ScoreTotal
  }

  //单个总数
  PaperQuestionsTotalTopic(PaperQuestions) {
    let topicTotal = 0
    if (PaperQuestions.length) topicTotal = PaperQuestions.length
    return topicTotal
  }

  //上下移动
  handleMoveClick = (index, field) => {
    // const moveType = { up: '向上移动', down: '向下移动' }
    // const newParts = arrayElementMove(field, this.state.Parts, index)
    // message.info(moveType[field])
    // return this.setState({ Parts: newParts })
  }

  render() {
    const {
      Name, Subtitle, Desc, Remark, //试卷标题部分
      TotalTime, QtyQuestion, TotalScore, //试卷统计信息
      HasPart, Parts,
    } = this.state
    const titleData = {Name, Subtitle, Desc, Remark}
    const statisticsData = {TotalTime, QtyQuestion, TotalScore,}
    return (
      <div>
        <Category onChange={this.handleCategoryChange}/>
        <div style={{paddingTop: '10px', borderTop: '2px solid #108ee9'}}>
        </div>
        <Row>
          <Col span={4}>
            <Card bodyStyle={{padding: '0 10px'}} bordered={false} noHovering>
              <Button type='primary' className={`${cssRoot}-primary-button`}>
                基本信息
              </Button>
              {(Parts && Parts.length) ? Parts.map((item, index) => (
                <Button type='primary' className={`${cssRoot}-primary-button`} key={index}>
                  第{index + 1}部分
                </Button>
              )) : null}
              <Button icon="plus" className={`${cssRoot}-dashed-button`} type="dashed" onClick={this.handleAddPart}>
                继续添加部分
              </Button>
              <Statistics {...statisticsData} onChange={this.handleStatisticsChange}/>
              <Button style={{width: '100%', marginBottom: '2px'}} type='primary' onClick={this.handleSaveTest}>
                保存试卷
              </Button>
            </Card>
          </Col>
          <Col span={20}>
            <Card className={`${cssRoot}-Card`}>
              <TestPaperTitle onChange={this.handleTitleChange} {...titleData} />
            </Card>
            {(Parts && Parts.length) ? Parts.map(({ID, Name, Remark, PaperQuestions}, index) => (
              <Card className={`${cssRoot}-Card`} key={index}>
                <Row style={{marginBottom: '10px'}}>
                  <Col span={18}>
                    <span>第{index + 1}部分：</span>
                    <Input
                      style={{width: '80%', borderStyle: 'dashed'}}
                      placeholder='部分名称'
                      value={Name}
                      onChange={(e) => this.handlePartsChange(index, 'Name', e.target.value)}
                    />
                  </Col>
                  <Col span={6} style={{textAlign: 'right'}}>
                    <MoveButtonGroup index={index} length={Parts.length}
                                     onClick={(field) => this.handleMoveClick(index, field)}/>
                    <Popconfirm title="确定要删除该部分吗？" onConfirm={() => this.handleDeletePart(index)}>
                      <Button style={{verticalAlign: 'top'}} type='primary'>删除该部分</Button>
                    </Popconfirm>
                  </Col>
                </Row>
                <TextArea
                  placeholder='部分答题说明，该信息考生可见（选填）'
                  className={`${cssRoot}-textArea`}
                  rows={2} value={Remark}
                  onChange={(e) => this.handlePartsChange(index, 'Remark', e.target.value)}
                />
                <TestPaperDetails
                  order={index}
                  PaperQuestions={PaperQuestions}
                  locationState={this.state}
                  index={index}
                  onChange={(value) => this.handleTestPaperDetailsChange(index, value)}

                />
              </Card>
            )) : null}
            {
              !HasPart ? <TestPaperDetails
                PaperQuestions={this.state.PaperQuestions}
                locationState={this.state}
                index={-1}
                onChange={(value) => this.handleTestPaperDetailsChange(-1, value)}
              /> : null
            }
          </Col>
        </Row>
      </div>
    )
  }
}

export default withRouter(AddTestPaper)
