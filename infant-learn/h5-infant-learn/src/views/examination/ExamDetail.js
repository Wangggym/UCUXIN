/**
 * Created by QiHan Wang on 2017/9/18.
 * AnswerStream
 */
import React, {Component} from 'react';
import './exam-detail.scss';

class ExamDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    this.setState({data: this.props.location.state});
  }

  render() {
    const {data} = this.state;
    return (
      <div className="exam-detail">
        <div className="ed-info">总共{data.QtyWrong + data.QtyRight}道题，正确<span className="green">{data.QtyRight}</span>道，错误<span className="orange">{data.QtyWrong}</span>道</div>
        <ul className="ed-list">
          {
            data.QuestionAnswers.map((item,i)=> <li key={item.QuestionID}>{i+1}<i className={`ed-icon ${item.IsRight ? 'ed-right': 'ed-error'}`}/></li>)
          }
        </ul>
      </div>
    )
  }
}

export default ExamDetail;
