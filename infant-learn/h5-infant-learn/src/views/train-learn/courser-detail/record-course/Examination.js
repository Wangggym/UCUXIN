/**
 * Created by xj on 2017/9/5.
 */
import React, {Component} from 'react';
import {List, Toast} from 'antd-mobile';
import {Catalogue} from "../../../../components"
import {withRouter} from 'react-router-dom';
const Item = List.Item;
const Brief = Item.Brief;

class Examination extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: this.props.data,
      IsBuy:this.props.IsBuy
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      IsBuy:nextProps.IsBuy,
      IsCanLearn:nextProps.IsCanLearn
    })
  }

//去考试
  toTestPaper(CourseID,ResourceID,IsExam){
    if (!this.props.IsBuy) {
      Toast.fail('尚未购买，请点击“我要学习”进行购买!');
      return;
    }
    if(!this.props.IsCanLearn){
      Toast.fail("未到学习时间喔！");
      return;
    }
    if (!IsExam){
      Toast.fail('课程未完成，不能进行考试');
      return;
    }
    let IDs={
      courseID:CourseID,
      YLSResourceID:ResourceID,
      type:1  //1考试  2练习
    }
    this.props.history.push({pathname:`/examination`,state:{IDsAndType:IDs}})
  }
  render() {
    const  {data} = this.props;
    const { PaperInfo } =data;
    return (
      <div>
        <div className="intro-title">
          <span>练习</span>
          <span>{data.TestCount}次</span>
        </div>
        <Catalogue data={data.CourseCatalogs} isShowText IsBuy={this.state.IsBuy} IsCanLearn={this.state.IsCanLearn}/>

        <div className="intro-title">
          <span>考试</span>
          <span>{data.ExamCount}次</span>
        </div>
        {
          PaperInfo&& <div className="review-test">
            <div className="test-name" onClick={()=>this.toTestPaper(PaperInfo.CourseID,PaperInfo.ResourceID,data.IsExam)}>
              <div>{PaperInfo.PaperName}</div>
              <div className="logo-right">
                <img style={{width: "0.3rem", height: "0.3rem"}}
                     src={require("../../../../assets/images/right_arrow_gray.png")} alt=""/>
              </div>
            </div>

            <div className="test-content">
              <div className="test-time">
                <span>{PaperInfo.Duration/60}分钟</span>
                <span>考试时长</span>
              </div>
              {/*<div className="re-test">*/}
                {/*<span>{PaperInfo.UpCount}</span>*/}
                {/*<span>补考次数</span>*/}
              {/*</div>*/}
              <div className="test-score">
                <span style={{color:"#fd630f"}}>{PaperInfo.PassScore}</span>
                <span>考试合格分数</span>
              </div>
            </div>

          </div>
        }

      </div>
    )
  }
}

export default withRouter(Examination);
