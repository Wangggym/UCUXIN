/**
 * create by xj 2017/8/16
 * */
import React, {Component} from 'react';

import QuestionsList from './QuestionsList';
import PartList from './PartList';
import {SearchParamName} from '../../../common/utils';
import ServiceAsync from '../../../common/service';
import {Token} from '../../../common/utils';
import '../ItemBank/ItemBank.scss';
const token = Token();
class PaperDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paperDetail: {},//试卷详情
    }
  }

  componentDidMount() {
    //根据试卷ID获取试卷详情
    ServiceAsync('GET', 'Resource/v3/QuePap/GetPaperByPaperIDNew', {
      token,
      paperID: SearchParamName("TestPaperID")
    }).then(res => {
      if (res.Ret === 0) {
        this.setState({
          paperDetail: res.Data
        })
      }
    });
  }

  render() {
    const {paperDetail} = this.state;
    let Difficulty = "";
    switch (paperDetail.Difficulty) {
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
      <div className="paper-detail">
        <div className="paper-detail-title">
          <p className="paper-name">{paperDetail.Name}</p>
          <p className="second-name">{paperDetail.Subtitle}</p>
          <p className="test-explain">{paperDetail.Desc}</p>
          <p className="test-info">
            <span>创建时间: <b>{paperDetail.CDate}</b></span>
            <span>难度: <b>{Difficulty}</b></span>
            <span>总时长: <b>{paperDetail.TotalTime}</b>分钟</span>
            <span>总题目数: <b>{paperDetail.QtyQuestion}</b></span>
            <span>总分值: <b>{paperDetail.TotalScore}</b>分</span>
          </p>
        </div>
        <div className="paper-detail-content">
          {
            paperDetail.HasPart ?  paperDetail.Parts.map((item,index)=>{
              return(
                <PartList data={item} key={index}/>
              )
              }):(paperDetail.Questions&&paperDetail.Questions.length?<QuestionsList Questions={paperDetail.Questions}/>:"暂无数据")
          }

        </div>
      </div>
    )
  }
}

export default PaperDetail;
