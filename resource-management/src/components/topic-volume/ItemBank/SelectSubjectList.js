import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ServiceAsync from '../../../common/service';
import { Row, Col, Checkbox, Modal, Button } from 'antd'
import {Token} from '../../../common/utils';
import { Topic } from '../../../common'
const token= Token();
// let arr = [];//存储选中后的题目
class SelectSubjectList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectSubject: [],//存储选题
      ModalVisible: false,
      data: this.props.data,
      DetailData: {},
      isSelect: false,//是否可选题
      checked: [],
      checkAll: false,
      isDisableCheckedAll: false//全选按钮是否可用
    }
  }

  componentDidMount() {
    // if (!this.props.location.state.addTestPaper.HasPart) {
    //   console.log(this.props.location.state.addTestPaper.PaperQuestions)
    // }else {
    //   console.log(this.props.location.state.addTestPaper.PaperQuestions)
    // }
  }


  componentWillReceiveProps(nextProps) {
    const initialChecked = (array) => {
      const checked = []
      array && array.length && array.forEach((item, index) => {
        checked[index] = false
      })
      return checked
    }
    // 当再次选题时当前页是否已经全选
    /*---------------------------------------------------------*/
    const { ViewModelList } = nextProps.data;
    const { addTestPaper } = this.props.location.state;
    const arr = ViewModelList && this.getInitialId(ViewModelList);
    const returnArr = this.getNewTestIDList(addTestPaper);
    let num = 0;
    // console.log(arr)
    // console.log(returnArr)
    arr && arr.map((item, index) => {
      returnArr.map(e => {
        if (item === e) {
          num++
        }
      })
    });
    console.log(num)
    if (arr) {
      if (num === arr.length) {
        this.setState({
          checkedAll: true,
          isDisableCheckedAll: true
        })
      } else {
        this.setState({
          checkedAll: false,
          isDisableCheckedAll: false
        })
      }
    }
    // if (arr) {
    //   if (arr.length === returnArr.length) {
    //     this.setState({
    //       checkedAll: true,
    //       isDisableCheckedAll: true
    //     })
    //   }
    // }
    /*---------------------------------------------------------*/
    this.setState({
      data: nextProps.data,
      checked: initialChecked(nextProps.data.ViewModelList)
    })
  }

  //查看详情
  searchDetail(state, type, id) {
    this.setState({ ModalVisible: state })
    ServiceAsync('GET', 'QuePap/v3/Question/GetQuestionDetailByID', {
      token,
      questionType: type,
      questionID: id
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
    this.setState({ ModalVisible: state })
  }

  //选题时，选中操作
  changeSelect(checked, topic, index) {
    const { selectSubject } = this.state;
    const newChecked = [...this.state.checked]
    newChecked[index] = checked
    const newCheckedAll = newChecked.every(item => (item === true))
    this.setState({ checked: newChecked, checkedAll: newCheckedAll })

    const delindex = selectSubject.findIndex(item => item.ID === topic.ID);
    if (delindex >= 0) {
      this.setState({
        selectSubject: [...selectSubject.slice(0, delindex), ...selectSubject.slice(delindex + 1)]
      })
    } else {
      selectSubject.push(topic);
    }
  }

  //保存
  save() {
    const addTestPaperAll = this.getNewTestIDList(this.props.location.state.addTestPaper)
    const { selectSubject } = this.state
    const all = addTestPaperAll;
    const repetition = []
    all.forEach((item) => {
      selectSubject.forEach(({ ID },index) => {
        if (item === ID) {
          repetition.push(index)
        }
      })
    })
    const newSelectSubject = selectSubject.filter((item, index) => {
      if (!(repetition.length)) return true
      let isRepetition = false
      repetition.forEach((thisItem) => {
        if (index === thisItem) {
          isRepetition = true
        }
      })
      return !isRepetition
    })
    console.log(newSelectSubject)

    // const data = {
    //   selectSubject: newSelectSubject,
    //   addTestPaper: this.props.location.state
    // };
    this.props.history.push({
      pathname: `/test-paper/add-testPaper`,
      state: {
        "selectSubject": newSelectSubject,
        "addTestPaper": this.props.location.state.addTestPaper,
        "index": this.props.location.state.index
      }
    });
  }

  //处理已选择的id(将在部分列表中和不在部分列表中的ID放到一个数组)
  getNewTestIDList(addTestPaper) {
    const { HasPart, Parts, PaperQuestions } = addTestPaper
    const getID = (PaperQuestions) => {
      const array = []
      PaperQuestions.forEach(({ ID }) => {
        array.push(ID)
      })
      return array
    }
    if (!HasPart) {
      return getID(PaperQuestions)
    }
    let array = []
    Parts.forEach((item) => {
      array = array.concat(getID(item.PaperQuestions))
    })
    return array
  }

  //获取请求的数据的id
  getInitialId(item) {
    const arr = [];
    item.forEach(e => {
      arr.push(e.ID)
    })
    return arr;
  }

  //全选
  handleCheckedAll(checkedAll, selectSubject) {
    const newChecked = [...this.state.checked]
    //设置所有选项
    newChecked.forEach((item, index) => {
      newChecked[index] = checkedAll
    })
    //删除已经选中的题目
    const { addTestPaper } = this.props.location.state;
    const haveSelect = this.getNewTestIDList(addTestPaper);
    // selectSubject.forEach(item => {
    //   if (haveSelect.length) { //已经选题时全选，排除已经选的
    //     haveSelect.forEach(e => {
    //       if (item.ID === e) {
    //         let delIndex = selectSubject.indexOf(item);
    //         this.setState({
    //           selectSubject: [...selectSubject.slice(0, delIndex), ...selectSubject.slice(delIndex + 1)]
    //         })
    //       }
    //     })
    //   } else {//未选题时全选,将所有数据中
    //     this.setState({
    //       selectSubject
    //     })
    //   }
    // })
    this.setState({ checked: newChecked, checkedAll, selectSubject })
  }

  render() {
    const { DetailData, checkedAll, checked, isDisableCheckedAll } = this.state;
    const { ViewModelList } = this.state.data;
    const { addTestPaper } = this.props.location.state;
    return (
      <div className="subject-list">
        {/*{*/}
        {/*this.state.data.ViewModelList ? this.state.data.ViewModelList.map((item, index) => {*/}
        {/*return (*/}
        {/*<SingleSubject item={item} key={index} index={index}/>*/}
        {/*)*/}
        {/*}) : <NoData/>*/}
        {/*}*/}
        <Checkbox onChange={(e) => this.handleCheckedAll(e.target.checked, ViewModelList)} checked={checkedAll}
          disabled={isDisableCheckedAll}>全选</Checkbox>

        {<Button type="primary" onClick={() => this.save()}>保存</Button>}
        {
          ViewModelList && ViewModelList.length && ViewModelList.map(({ Type, Stem, Difficulty, QtyQuote, QusetionJson, ID }, index) => {
            let topic = { Type, Stem, Difficulty, QtyQuote, QusetionJson, ID, index: index + 1 }
            return (
              <Row key={index} className="single-subject">
                <Col span={1} style={{ textIndent: '5px', position: "relative" }}>
                  <Checkbox onChange={(e) => this.changeSelect(e.target.checked, topic, index)}
                    checked={checked[index]} />
                  {
                    this.getNewTestIDList(addTestPaper).map((item, index) => {
                      if (item === ID) {
                        return <p key={index}
                          style={{ background: "#dddddd", position: "absolute", top: 0, zIndex: 888 }}>已选择</p>
                      }
                    })
                  }
                </Col>
                <Col span={23}>
                  <Topic {...topic} searchDetail={(state, type, id) => this.searchDetail(state, type, id)}
                    defaultVisible={true} setting={false} />
                </Col>
                <Modal
                  title="查看详情"
                  wrapClassName="vertical-center-modal subject-list"
                  visible={this.state.ModalVisible}
                  onCancel={() => this.cancelSearchDetail(false)}
                  footer={null}
                  width="80%"
                >
                  <div className="subject">
                    <div className="subject-title">
                      <p>题型 : <span>{DetailData.Type === 1 ? "单选题" : (DetailData.Type === 2 ? "多选题" : "选择题")}</span></p>
                      <p>难易度 : <span>{Difficulty}</span></p>
                      <p>组卷次数 : <span>{DetailData.QtyQuote}</span></p>
                    </div>
                    <div className="subject-content">
                      <span className="subject-stem">{`${index + 1}、${DetailData.Stem}`}</span>
                      <div className="subject-option">
                        {
                          DetailData.Options && DetailData.Options.map((item, index) => {
                            return (
                              <span key={index}>{item.Section}、{item.Name}</span>
                            )
                          })
                        }
                      </div>
                    </div>
                    <div className="subject-analysis">

                      <p>
                        <b>【解题思路】</b>
                        {DetailData.SolveThink}
                      </p>
                      <p>
                        <b>【答案解析】</b>
                        {DetailData.Analysis}
                      </p>
                    </div>
                  </div>
                </Modal>
              </Row>
            )
          })
        }
        {

        }
      </div>
    )
  }
}

export default withRouter(SelectSubjectList);
