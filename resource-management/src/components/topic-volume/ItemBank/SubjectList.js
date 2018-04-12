import React, {Component} from 'react';
import SingleSubject from './SingleSubject';
import {Link, withRouter} from 'react-router-dom';
import ServiceAsync from '../../../common/service';
import {Row, Col, Checkbox, Modal, Button} from 'antd'
import {Token} from '../../../common/utils';

const token = Token();
let arr = [];//存储选中后的题目
class SubjectList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectSubject: [],//存储选题
      ModalVisible: false,
      data: this.props.data,
      DetailData: {},
      isSelect: false//是否可选题
    }
  }


  componentWillReceiveProps(nextProps) {

    this.setState({
      data: nextProps.data
    })
  }

//查看详情
  searchDetail(state, type, id) {
    this.setState({ModalVisible: state})
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


  render() {
    const {DetailData} = this.state;
    const {ViewModelList} = this.state.data;
    return (
      <div className="subject-list">
        {
          ViewModelList && ViewModelList.length ? this.state.data.ViewModelList.map((item, index) => {
            return (
              <SingleSubject item={item} key={index} index={index}/>
            )
          }) : <NoData/>
        }

      </div>
    )
  }
}

//无数据
class NoData extends Component {
  render() {
    return (
      <div className="no-data">
        暂无数据
      </div>
    )
  }
}

export default withRouter(SubjectList);
