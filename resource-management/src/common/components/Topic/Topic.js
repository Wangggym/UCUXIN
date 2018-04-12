import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, InputNumber, Icon, Button, Popconfirm } from 'antd'
import TopicTrunk from './TopicTrunk'
import './style.scss'

const questionType = [
  , '单选题', '多选题', '判断题'
]
const questionDifficulty = [
  , '容易', '较易', '中等', '较难', '很难'
]
const cssRoot = 'Topic'
export default class Topic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.defaultVisible,
    }
  }

  handleVisibleClick = () => {
    this.setState({ visible: !this.state.visible })
  }

  handleDelete = () => {
    const { onDelete } = this.props
    onDelete && onDelete()
  }


  handleValueChange = (value) => {
    const { onChange } = this.props
    onChange && onChange(value)
  }
  //查看详情
  searchDetail(state, type, id) {
    this.props.searchDetail(state, type, id);
  }

  render() {
    const { visible } = this.state;
    const { Type, Stem, Difficulty, QtyQuote, QusetionJson, index, ID, setting, Score } = this.props
    return (
      <div className={cssRoot} >
        <Row>
          <Col span={12}>
            <span className={`${cssRoot}-order`}>{index}、</span>
            <span className={`${cssRoot}-type`}>[{questionType[Type]}]</span>
            <span className={`${cssRoot}-difficulty`}>{questionDifficulty[Difficulty]}</span>
            <a className={`${cssRoot}-visible`} href='javascript:void(0)' onClick={this.handleVisibleClick}>
              {
                visible ? '收起' : '展开'
              }
              {
                visible ? <Icon type="up" /> : <Icon type="down" />
              }
            </a>
            {
              !setting ? <Button ghost type="primary" style={{ marginLeft: "1rem" }}
                onClick={() => this.searchDetail(true, Type, ID)}>查看详情</Button> : ""
            }
          </Col>
          <Col span={12}>
            {
              setting && <div>
                <span>分值：<InputNumber style={{ marginRight: '5px' }} min={1} value={Score} onChange={this.handleValueChange} />分</span>
                <Popconfirm title="确定要删除本题吗？" onConfirm={this.handleDelete}>
                  <Button shape="circle" icon="delete" style={{ border: 'none' }} />
                </Popconfirm>
              </div>
            }
          </Col>
        </Row>
        <p style={{ marginBottom: '10px' }}>{Stem}</p>
        {
          visible && <TopicTrunk Options={JSON.parse(QusetionJson)} Type={Type} />
        }
      </div>
    )
  }
}

//限定控件传入的属性类型
Topic.propTypes = {
  defaultVisible: PropTypes.bool,
  setting: PropTypes.bool,
}

//设置默认属性
Topic.defaultProps = {
  defaultVisible: true,
  setting: true,
}
