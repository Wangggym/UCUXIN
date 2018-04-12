import React, {Component} from 'react';
import {Button, Modal} from 'antd';
import ServiceAsync from '../../../common/service';
import {Token} from '../../../common/utils';
const token = Token();

const arr =["容易","较易","中等","较难","很难"]
class QuestionsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ModalVisible: false,
      item: this.props.data||this.props.Questions,
      DetailData: []

    }
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
    const{item,DetailData}=this.state;
    return (
      <div className="subject-list">
        {
          item&&item.map((e,i)=>{
            return(
              <div className="subject" key={e.ID}>
                <div className="subject-content">
                  <span className="subject-stem">{i+1}、{e.Stem}</span>
                  <div className="subject-option">
                    {
                      e.QusetionJson && JSON.parse(e.QusetionJson).map((value, index) => {
                        return (
                          <span key={index}>{value.Section}、{value.Name}</span>
                        )
                      })
                    }
                  </div>
                </div>
                <div className="subject-bottom">
                  <Button type="primary" ghost onClick={() => this.searchDetail(true,e.ID)}>查看详情</Button>

                </div>
              </div>
            )
          })
        }
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
                    <p>题型 : <span>{item.Type === 1 ? "单选题" : (item.Type === 2 ? "多选题" : "选择题")}</span></p>
                    <p>难易度 : <span>{arr[item.Difficulty]}</span></p>
                    <p>组卷次数 : <span>{item.QtyQuote}</span></p>
                  </div>
                  <div className="subject-content">
                    <span className="subject-stem">{`${item.Stem}`}</span>
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

    )
  }
}

export default QuestionsList;
