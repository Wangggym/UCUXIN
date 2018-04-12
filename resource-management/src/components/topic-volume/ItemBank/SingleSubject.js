/**
 * Created by xj on 2017/8/11.
 */
import React, {Component} from 'react';
import {Button, Modal} from 'antd';
import ServiceAsync from '../../../common/service';
import {Token} from '../../../common/utils';

const token = Token();

class SingleSubject extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ModalVisible: false,
      item: this.props.item,
      DetailData: []
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      item: nextProps.item
    })
  }

  //查看详情
  searchDetail(state, questionID) {
    this.setState({
      ModalVisible: state
    })
    ServiceAsync('POST', 'Resource/v3/QuePap/GetQuestionDetailByIDNew', {
      token,
      body: {
        QuestioinIDs: [questionID]
      }
    }).then(res => {
      if (res.Ret === 0) {
        this.setState({
          DetailData: res.Data
        })
      }
    })
  }

//关闭弹窗
  cancelSearchDetail(state) {
    this.setState({
      ModalVisible: state
    })
  }

  render() {
    const {item, DetailData} = this.state;
    let Difficulty = "";
    switch (item.Difficulty) {
      case 1:
        Difficulty = "容易";
        break;
      case 2:
        Difficulty = "较易";
        break;
      case 3:
        Difficulty = "中等";
        break;
      case 4:
        Difficulty = "较难";
        break;
      case 5:
        Difficulty = "很难";
        break;
    }
    return (
      <div className="subject">
        <div className="subject-title">
          <p>题型 : <span>{item.Type === 1 ? "单选题" : (item.Type === 2 ? "多选题" : "选择题")}</span></p>
          <p>难易度 : <span>{Difficulty}</span></p>
          <p>组卷次数 : <span>{item.QtyQuote}</span></p>
        </div>
        <div className="subject-content">
          <span className="subject-stem">{`${this.props.index + 1}、${item.Stem}`}</span>
          <div className="subject-option">
            {
              item.QusetionJson && JSON.parse(item.QusetionJson).map((e, index) => {
                return (
                  <span key={e.ID}>{e.Section}、{e.Name}</span>
                )
              })
            }

          </div>
        </div>
        <div className="subject-bottom">
          <Button type="primary" ghost onClick={() => this.searchDetail(true, item.ID)}>查看详情</Button>
          <Modal
            title="查看详情"
            wrapClassName="vertical-center-modal subject-list"
            visible={this.state.ModalVisible}
            onCancel={() => this.cancelSearchDetail(false)}
            footer={null}
            width="80%"
          >
            {
              DetailData && DetailData.map(item => {
              return (
                <div className="subject" key={item.ID}>
                  <div className="subject-title">
                    <p>题型 : <span>{item.Type === 1 ? "单选题" : (item.Type === 2 ? "多选题" : "判断题")}</span></p>
                    <p>难易度 : <span>{Difficulty}</span></p>
                    <p>组卷次数 : <span>{item.QtyQuote}</span></p>
                  </div>
                  <div className="subject-content">
                    <span className="subject-stem">{`${this.props.index + 1}、${item.Stem}`}</span>
                    <div className="subject-option">
                      {
                        item.QusetionJson && JSON.parse(item.QusetionJson).map((e, index) => {
                          return (
                            <span key={index}>{e.Section}、{e.Name}</span>
                          )
                        })
                      }
                    </div>
                  </div>
                  <div className="subject-analysis">

                    <p>
                      <b>【解题思路】</b>
                      {item.SolveThink}
                    </p>
                    <p>
                      <b>【答案解析】</b>
                      {item.Analysis}
                    </p>
                    <p>
                      <b>【正确答案】</b>
                      {
                        item.QusetionJson && JSON.parse(item.QusetionJson).map((e, index) => {
                          return (
                            e.IsAnswer&&e.Section
                          )
                        })
                      }
                    </p>
                  </div>
                </div>
              )
            })
            }
          </Modal>
        </div>
      </div>
    )
  }
}

export default SingleSubject;
