/**
 * Created by QiHan Wang on 2017/9/18.
 * AnswerStream
 */
import React, {Component} from 'react';
import {Prompt} from 'react-router-dom';
import Api from '../../api';
import Config from '../../config';

import {Progress, Button, Toast, Modal} from 'antd-mobile';

import './examination.scss';

let timer = null;
let subTimer = null;

// 时间格式化
const durationFormat = (duration) => {
  let h = Number.parseInt(duration / 3600).toString();
  if (h < 10) h = h.padStart(2, '0');
  let m = Number.parseInt((duration % 3600) / 60).toString().padStart(2, '0');
  let s = ((duration % 3600) % 60).toString().padStart(2, '0');
  return [h, m, s].join(':');
};

class AnswerStream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      duration: 7200,
      startTime: 0,
      questions: [],

      subDuration: 10,
      subDialogVisible: false,

      isLoading: true
    };
  }

  componentWillMount() {
    //debugger
    const {state} = this.props.location;
    if (state && state.IDsAndType) {
      this.setState({
        resourceID: state.IDsAndType.YLSResourceID,
        courseID: state.IDsAndType.courseID,
        examType: state.IDsAndType.type,
        isSubmit: false
      })
    }
    //console.log(this.props.location.state.IDsAndType)
    /*this.setState({
      resourceID: '127764709175010345',
      courseID: '126178031122010342'
    })*/
  }

  componentDidMount() {
    this.getAnswerSign(this.getQuestions);
  }

  componentWillUnmount() {
    clearTimeout(timer);
    clearTimeout(subTimer);
  }

  // 计时
  counter = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      let duration = this.state.duration;
      duration--;
      this.setState({duration});

      if (duration === 300) {
        //Modal
        clearTimeout(timer);
        this.handleDuration(() => this.counter(duration));
        return;
      }

      // 时间小于等于0时止计时并自动提交试卷
      if (duration <= 0) {
        clearTimeout(timer);
        this.handleTimeOver();
        return;
      }
      this.counter();
    }, 1000);
  };

  // 时间剩余提示
  handleDuration = (callback) => {
    Modal.alert('时间提示', '考试时间还剩余5分钟，请注意答题！', [{
      text: '确定', onPress: () => callback()
    }]);
  };

  // 交卷到计时
  subCounter = () => {
    clearTimeout(subTimer);
    subTimer = setTimeout(() => {
      let subDuration = this.state.subDuration;
      subDuration--;

      if (subDuration === 0) {
        clearTimeout(subTimer);
        this.handleSubmit();
        this.setState({subDuration, subDialogVisible: false});
        return;
      }
      this.setState({subDuration});

      this.subCounter();
    }, 1000);
  };

  // 时间已到
  handleTimeOver = () => {
    this.setState({subDialogVisible: true});
    this.subCounter();
  };


  // 课程 126178031122010342
  // 试卷 126714730532010845
  getQuestions = () => {
    const {resourceID} = this.state;
    Toast.loading('试题加载中...', 0);
    this.setState({isLoading: true});
    Api.Examination.getQuestions({resourceID}).then(res => {
      let questions = [];
      if (res.Ret === 0) {
        questions = Array.isArray(res.Data) ? res.Data : [];
        questions.forEach(item => item.Options = JSON.parse(item.QusetionJson));
        if (res.Data && res.Data.length) {
          this.counter();
        }
      } else {
        Toast.fail(res.Msg);
      }
      this.setState({isLoading: false, questions});
      Toast.hide();
    });
  };

  getAnswerSign = (callback) => {
    const {resourceID, courseID} = this.state;
    Toast.loading("刷新",0);
    Api.Examination.getAnswerSign({resourceID, courseID, appID: Config.appId}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          duration: res.Data.LeftTime,
          answerTime: res.Data.AnswerTime,
          sign: res.Data.Sign
        });
        callback();
      } else {
        Toast.fail(res.Msg, 3, ()=> {
          this.props.history.goBack();
        });

      }
    })
  };

  // 下一题
  handleNext = () => {
    let {step, questions} = this.state;
    const selectedAnswers = questions[step].Options.filter(item => item.checked);
    if (!selectedAnswers.length) {
      Toast.fail('请先选择答案！', 1);
      return;
    }
    step++;
    if (step >= questions.length) {
      this.handleSubmit();
      return;
    }
    this.setState({step})
  };

  // 上一题
  handlePrev = () => {
    let {step} = this.state;
    step--;
    if (step < 0) return;
    this.setState({step})
  };

  handleChange = (e, i) => {
    let {step, questions} = this.state;
    const currentQuestion = questions[step];

    if (currentQuestion.Type === 2) {
      currentQuestion.Options[i].checked = e.target.checked;
    } else {
      currentQuestion.Options.forEach(item => item.checked = false);
      currentQuestion.Options[i].checked = e.target.checked;
    }
    this.setState({questions});
  };

  // 提交考试
  handleSubmit = () => {
    clearTimeout(timer);
    const {questions, resourceID, courseID, sign, examType, answerTime} = this.state;
    // 生成答案选项
    const submitQuestions = questions.map(item => {
      const answer = (item.Options.filter(opt => opt.checked)).map(item => item.Section);
      return {
        QuestionID: item.ID,
        QuestionType: item.Type,
        Answer: answer.join('|')
      }
    });

    Api.Examination.savePaper({
      body: {
        CourseID: courseID,
        ResourceID: resourceID,
        AnswerTime: answerTime,
        ExamType: examType || 1,
        AnswerType: 2,  // 剔哥说的
        Sign: sign,
        SubmitQuestions: submitQuestions
      }
    }).then(res => {
      if (res.Ret === 0) {
        this.setState({isSubmit: true});
        this.props.history.replace(`/course-detail/${res.Data.CourseID}`);
        this.props.history.push({pathname: '/examination/exam-result', state: res.Data})
      } else {
        Toast.fail(res.Msg);
      }
    });
  };

  render() {
    const {questions, step, duration, subDialogVisible, subDuration, isLoading, isSubmit} = this.state;
    return (
      <div className="examination">
        {/*<Prompt*/}
          {/*when={!isSubmit}*/}
          {/*message={location => (*/}
            {/*"离开此页面，考试数据将被清空，确认离开"*/}
          {/*)}*/}
        {/*/>*/}
        <div className="ex-progress-bar">
          <div className="ex-progress">
            <div className="ex-info">已完成{step + 1}/{questions.length}</div>
            <Progress percent={(step + 1) / questions.length * 100} position="normal" appearTransition/>
          </div>
          <div className="ex-counter"><span>{durationFormat(duration)}</span>时间剩余</div>
        </div>
        {
          questions.length ?
            <div className="ex-answer">
              <div className="ex-answer-topic">{step + 1}、{questions[step].Stem}（{questions[step].Score}分）</div>
              {
                questions[step].Options.map((item, i) =>
                  <label className="ex-answer-option" htmlFor={item.ID} key={item.ID}>
                    <div className="ex-answer-opt-hd">{item.Section}、</div>
                    <div className="ex-answer-opt-bd">{item.Name}</div>
                    <div className="ex-answer-opt-ft">
                      <input
                        className="ex-checkbox"
                        id={item.ID}
                        type={questions[step].Type === 2 ? 'checkbox' : 'radio'}
                        name={questions[step].ID}
                        onChange={(e) => this.handleChange(e, i)}
                        defaultChecked={item.checked}
                      />
                      <i/>
                    </div>
                  </label>)
              }

              {/*
          <label className="ex-answer-option" htmlFor="aa">
            <div className="ex-answer-opt-hd">A、</div>
            <div className="ex-answer-opt-bd">
              \123A\123A\123A\123A\123A\123A\123A\123A\123A\123A\123A\123A\123A\123A\123A\123A\123A\123A\123A\123A\123
            </div>
            <div className="ex-answer-opt-ft">
              <input type="checkbox" className="ex-checkbox" id="aa" name="aa"/><i/>
            </div>
          </label>*/}
            </div> : !isLoading ?
            <div className="ex-no-paper">当前课程没有考试试卷哦！</div>: null
        }
        {
          questions.length ?
            <div className="ex-btn-group">
              <Button inline onClick={this.handlePrev}>上一题</Button>
              {
                step === questions.length - 1 ?
                  <Button
                    inline
                    style={{backgroundColor: '#f19149', borderColor: '#f19149', color: '#fff'}}
                    onClick={this.handleNext}>提交</Button>
                  :
                  <Button inline type="primary" onClick={this.handleNext}>下一题</Button>
              }
            </div> : null
        }

        <Modal
          title="抱歉，考试时间已到！"
          transparent
          maskClosable={false}
          visible={subDialogVisible}
          //onClose={this.onClose('modal1')}
          footer={[{
            text: '交卷并查看结果', onPress: () => {
              this.handleSubmit();
            }
          }]}
        >
          不能再继续答题<br/>{subDuration}秒后自动交卷
        </Modal>
      </div>
    )
  }
}

export default AnswerStream;
