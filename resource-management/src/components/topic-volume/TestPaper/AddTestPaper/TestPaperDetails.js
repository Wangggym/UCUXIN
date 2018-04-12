import React from 'react'
import {Card, Row, Col, Checkbox, Button, Select, InputNumber, message, Popover} from 'antd'
import MoveButtonGroup from './MoveButtonGroup'
import {Topic} from '../../../../common'
import {Link} from 'react-router-dom'

const Option = Select.Option
const cssRoot = 'AddTestPaper'

const initialChecked = (array) => {
  const checked = []
  array.forEach((item, index) => {
    checked[index] = false
  })
  return checked
}

const arrayElementMove = (field, array, index) => {
  if (field === 'up') {
    array[index - 1] = array.splice(index, 1, array[index - 1])[0]
    return array
  }
  array[index + 1] = array.splice(index, 1, array[index + 1])[0]
  return array
}

export default class TestPaperDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      PaperQuestions: props.PaperQuestions,
      checked: initialChecked(props.PaperQuestions),
      checkedAll: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.PaperQuestions !== this.props.PaperQuestions) {
      this.setState({PaperQuestions: nextProps.PaperQuestions})
    }
  }

  totalScore() {
    const {PaperQuestions} = this.state
    let ScoreTotal = 0
    if (PaperQuestions.length) {
      PaperQuestions.forEach(({Score}) => {
        if (Score) ScoreTotal += Score
      })
    }
    return ScoreTotal
  }

  totalTopic() {
    const {PaperQuestions} = this.state
    let topicTotal = 0
    if (PaperQuestions.length) {
      topicTotal = PaperQuestions.length
    }
    return topicTotal
  }

  handleValueChange(index, Score) {
    const {PaperQuestions} = this.state
    const newPaperQuestions = [...PaperQuestions]
    newPaperQuestions[index].Score = Score
    this.setState({PaperQuestions: newPaperQuestions})
    this.props.onChange(newPaperQuestions)
  }

  handleDelete = (index) => {
    const {PaperQuestions} = this.state
    const newPaperQuestions = [...PaperQuestions]
    newPaperQuestions.splice(index, 1)
    this.setState({PaperQuestions: newPaperQuestions})
    this.props.onChange(newPaperQuestions)
  }

  handleCheckChange(index, checked) {
    let newChecked = [...this.state.checked]
    newChecked[index] = checked === null ? !newChecked[index] : checked
    const newCheckedAll = newChecked.every(item => (item === true))
    this.setState({checked: newChecked, checkedAll: newCheckedAll})
  }

  handleCheckedAll(checkedAll) {
    let newChecked = [...this.state.checked]
    newChecked.forEach((item, index) => {
      newChecked[index] = checkedAll
    })
    this.setState({checked: newChecked, checkedAll})
  }

  checkStatus() {
    if (this.state.checked.every(item => item === false)) return false
    return true
  }

  handleBatchSetScore = (Score) => {
    if (!(this.checkStatus())) return
    const {PaperQuestions, checked} = this.state
    const newPaperQuestions = [...PaperQuestions]
    checked.forEach((item, index) => {
      if (item) newPaperQuestions[index].Score = Score
    })
    this.setState({PaperQuestions: newPaperQuestions})
    this.props.onChange(newPaperQuestions)
  }

  handleBatchDelete = () => {
    if (!(this.checkStatus())) return message.info('至少选择一个目标')
    const {PaperQuestions, checked} = this.state
    let newPaperQuestions = [...PaperQuestions]
    const newChecked = []
    newPaperQuestions = newPaperQuestions.filter((item, index) => {
      if (!checked[index]) newChecked.push(checked[index])
      return !(checked[index])
    })
    this.setState({PaperQuestions: newPaperQuestions, checked: newChecked})
    this.props.onChange(newPaperQuestions)
  }

  handleMoveClick = (field) => {
    if (!(this.checkStatus())) return message.info('至少选择一个目标')
    const {checked, PaperQuestions} = this.state
    const currentChecked = []
    checked.forEach((item, index) => {
      if (item) currentChecked.push(index)
    })
    if (!currentChecked.length) return
    if (currentChecked.length > 1) return message.info('最多选择一个目标')
    if (field === 'up' && currentChecked[0] === 0) return
    if (field === 'down' && currentChecked[0] === checked.length - 1) return
    const newPaperQuestions = arrayElementMove(field, PaperQuestions, currentChecked[0])
    const newChecked = new Array(PaperQuestions.length)
    const nextIndex = currentChecked[0] + (field === 'up' ? -1 : 1)
    newChecked[nextIndex] = true
    this.setState({PaperQuestions: newPaperQuestions, checked: newChecked})
  }

  render() {
    const {index} = this.props
    const {PaperQuestions, checked, checkedAll} = this.state
    const checkedTotal = checked.filter(item => item === true).length
    const CardTitle = (
      <Row>
        <Col span={16}>
          <Checkbox onChange={(e) => this.handleCheckedAll(e.target.checked)} checked={checkedAll}>全选</Checkbox>
          <span><span className="gray">操作选中的{checkedTotal}道题目：</span>
            <SetScore
              checkedTotal={checkedTotal}
              onChange={this.handleBatchSetScore}>
                      <Button>设置分值</Button>
                    </SetScore>
                    </span>
          <Button icon='delete' onClick={this.handleBatchDelete}>删除</Button>
          <MoveButtonGroup onClick={(field) => this.handleMoveClick(field)}/>
        </Col>
        <Col span={8} style={{textAlign: 'right'}}>
                    <span className={`${cssRoot}-statistics`}>
                        总题数： <span>{this.totalTopic()}</span>道
                    </span>
          <span className={`${cssRoot}-statistics`}>
                        总分值： <span>{this.totalScore()}</span>分
                    </span>
          <Link to={{pathname: "/item-bank", state: {addTestPaper: this.props.locationState, index: this.props.index}}}>
            <Button type='primary' icon='check'>选择题目</Button>
          </Link>
        </Col>
      </Row>
    )
    return (
      <Card title={CardTitle} className={`${cssRoot}-Card`} noHovering>
        {
          (PaperQuestions && PaperQuestions.length) ? PaperQuestions.map(({Type, Stem, Difficulty, QtyQuote, QusetionJson, Score}, index) => {
            let topic = {Type, Stem, Difficulty, QtyQuote, QusetionJson, index: index + 1, Score}
            return (
              <Row key={index}>
                <Col span={1} style={{textIndent: '5px'}}>
                  <Checkbox checked={checked[index]} onChange={(e) => this.handleCheckChange(index, e.target.checked)}/>
                </Col>
                <Col span={23}>
                  <Topic
                    {...topic}
                    defaultVisible={false}
                    onChange={(value) => this.handleValueChange(index, value)}
                    onDelete={() => this.handleDelete(index)}
                  />
                </Col>
              </Row>
            )
          }) : null
        }
      </Card>
    )
  }
}

class SetScore extends React.Component {
  state = {
    visible: false,
    value: 1,
  }
  hide = () => {
    this.setState({visible: false,});
    this.props.onChange(this.state.value)
  }
  handleVisibleChange = (visible) => {
    if (visible && !this.props.checkedTotal) return message.info('至少选择一个目标')
    this.setState({visible});
  }

  handleValueChange = (value) => {
    this.setState({value})
  }

  render() {
    return (
      <Popover
        content={<div className="SetScore">
          设置分值：<InputNumber
          style={{marginRight: '5px'}}
          min={1}
          value={this.state.value}
          onChange={this.handleValueChange}
        />分
          <Button onClick={this.hide} type="primary" size="small" style={{marginLeft: 5}}>确定</Button></div>}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        {this.props.children}
      </Popover>
    );
  }
}
