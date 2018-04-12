/**
 * create by xj 2017/8/16
 *
 * */
import React, {Component} from 'react';
import {Button} from 'antd';
import {Link,withRouter} from 'react-router-dom';
class TestPaperList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data:this.props.item
    }
  }
  componentWillReceiveProps(nextProps){
    console.log(nextProps.item)
    this.setState({
      data:nextProps.item
    })
  }
  //查看
  search(id){
    this.props.history.push({pathname: `${this.props.match.url}/paper-detail`, search: `TestPaperID=${id}`});
  }
  render() {
    const {data} = this.state;
    let Difficulty ="";
    switch (data.Difficulty){
      case 1:
        Difficulty="容易";
        break;
      case 2:
        Difficulty="较易";
        break;
      case 3:
        Difficulty="中等";
        break;
      case 4:
        Difficulty="较难";
        break;
      case 5:
        Difficulty="很难";
        break;
    }
    return (
      <div className="paper-list">
        <div className="paper-list-logo"/>
        <div className="paper-list-content">
          <div className="paper-list-title">
            {data.Name}
          </div>
          <div className="paper-tip">
            <span>创建日期: <b>{data.CDate}</b></span>
            <span>难度: <b>{Difficulty}</b></span>
            <span>总时长: <b>{data.TotalTime}</b>分钟</span>
            <span>总题目数: <b>{data.QtyQuestion}</b></span>
            <span>总分值: <b>{data.TotalScore}</b></span>
          </div>
        </div>
        <div className="paper-list-btn">
          <Button type="primary" onClick={()=>this.search(data.ID)}>
            查看
          </Button>
        </div>
      </div>
    )
  }
}

export default withRouter(TestPaperList) ;
