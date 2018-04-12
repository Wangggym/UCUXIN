/**
 * Created by QiHan Wang on 2017/9/18.
 * AnswerStream
 */
import React, {Component} from 'react';
import {Button} from 'antd-mobile';

import './exam-result.scss';

class ExamResult extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.setState({data: this.props.location.state});
  }

  handleMakeUpExam = () => {
    const {data} = this.state;

    //this.props.history.push({pathname: '/examination/exam-detail', state: this.props.location.state});

    //this.props.history.push(`/pay-course/${res.Data}/${encodeURIComponent(window.location.href)}`);

    // 重新考试
    this.props.history.push({pathname:`/examination`,state:{IDsAndType:{
      courseID:data.CourseID,
      YLSResourceID:data.ResourceID,
      type:data.ExamType  //1考试  2练习
    }}});
  };
  handleResultDetail = () => {
    this.props.history.push({pathname: '/examination/exam-detail', state: this.props.location.state});
  };

  handleReturn=()=>{
    const {data} = this.state;
    this.props.history.push(`/course-detail/${data.CourseID}`);
  };

  render() {
    const {data} = this.state;
    return (
      <div className="exam-result">
        <div className="exam-result-score"><span><b>{data.Score}</b>分</span></div>
        <div className="exam-result-desc">
          {
            data.ExamType === 1 ?
              <div className="er-result-info">{data.IsPass ? '恭喜！您的考试成绩合格' : '很遗憾，未能通过考试！'}</div> :
              <div className="er-result-info">恭喜！您的考试得分为：{data.Score}分</div>
          }

          {/*<div className="er-result-prompt">{
            data.IsPass ? `成功获得该课程学分：+${data.Credit}学分` : `补考剩余次数：${data.UpCount}次`
          }</div>*/}
          <div className="er-cost-time">考试用时：{Math.ceil(data.UserTime)}s</div>
        </div>
        <div style={{marginTop:'.4rem'}}>
          {
            (data.ExamType ===1 && !data.IsPass) &&
            <a className="exam-re-exam"
               onClick={this.handleMakeUpExam}
            >重考</a>
          }
        </div>
        {
          <div className="exam-result-btn">
            <Button inline type="primary" onClick={this.handleResultDetail}>查看结果</Button>
            <Button inline onClick={this.handleReturn}>返回</Button>
          </div>
        }
      </div>
    )
  }
}

export default ExamResult;
