/**
 * Created by xj on 2017/10/13.
 */
import React, {Component} from 'react';
import {List, Button, Modal,Radio,Toast} from 'antd-mobile';
import {withRouter} from 'react-router-dom';
import {NoContent} from '../../components';
import {CourseDetail} from '../../api';

import './ToExaminationModal.scss';

class ToExaminationModal extends Component{
  constructor(props){
    super(props);
    this.state={
      isShowTip:this.props.isShowTip,
      paperList:[],
      PapersData: {},
    }
  }
  componentDidMount(){
    this.GetTestPaper(this.props.courseID)
  }
  //获取考试信息
  GetTestPaper(CourseID) {
    Toast.loading("刷新", 0);
    CourseDetail.GetCoursePapers({CourseID}).then(res => {
      if (res.Ret === 0) {
        Toast.hide();
        this.setState({
          PapersData: res.Data
        }, () => this.handleTestpaper())
      } else {
        Toast.fail(res.Msg, 1);
        Toast.hide();
      }
    })
  }
//考试
  examination() {
    this.setState({
      isShowTip: true
    })
  }
//关闭考试弹窗
  onCloseTip() {
    this.setState({isShowTip: false})
  }
  //处理弹窗后的试卷列表（不需要显示试卷分类目录）
  handleTestpaper() {
    const {PapersData, paperList} = this.state;
    //取出练习题
    PapersData && PapersData.length !== 0 && PapersData.CourseCatalogs.map(item => {
      item.CourseResourceDetails.map(e => {
        paperList.push(e)
      })
    });
    this.setState({paperList})
  }
  //改变练习单选框的值
  onChangeInput = (item) => {
    this.setState({
      Singlevalue:item.YLSResourceID,
      testID:item.ID,
      paperID:item.ID,//用于控制，只能在试卷和练习之间选择一个
      paperType:2, //1考试  2练习
    });
  };
  //改变考试单选框
  onChangePaper=(PaperInfo)=>{
    console.log(PaperInfo)
    this.setState({
      Singlevalue:PaperInfo.ResourceID,
      paperID:PaperInfo.ID,
      testID:PaperInfo.ID,//用于控制，只能在试卷和练习之间选择一个
      paperType:1 //1考试  2练习
    })
  }

  //去考试
  toExamination() {
    if(this.state.paperList.length===0&&this.state.PapersData.PaperInfo==null){
      Toast.fail("没有可以选择的试卷和练习！");
      return;
    }
    if (!this.state.Singlevalue) {
      Toast.fail("请选择试卷！")
      return;
    }
    let IDs = {
      courseID: this.props.courseID,
      YLSResourceID: this.state.Singlevalue,
      type: this.state.paperType  //1考试  2练习
    };
    this.props.history.push({pathname: `/examination`, state: {IDsAndType: IDs}})
  }
  render(){
    const {paperList,PapersData} = this.state;
    return(
      <div onClick={()=>this.examination()}>
        {this.props.children}
        <Modal
          transparent
          maskClosable={false}
          visible={this.state.isShowTip}
          footer={[{
            text: '先等等', onPress: () => this.onCloseTip()
          }, {
            text: '去考试', onPress: () => {
              this.toExamination();
            }
          }]}
        >
          <h3>练习</h3>
          {
            paperList.length !== 0 ? paperList.map((item, key) => {
              return (
                <div className="line-paper" key={key}>
                  <Radio className="my-radio" value={item.ID}
                         checked={this.state.testID === item.ID}
                         onChange={e => this.onChangeInput(item)}/>
                  <div className="paper-list">
                    <div className="test-img"/>
                    <div className="test-content">
                      <h4>{item.ResourceName}</h4>
                      <span>共{item.Count}道题</span>
                    </div>
                  </div>
                </div>
              )
            }) : <NoContent/>
          }
          <h3>试卷</h3>
          {
            PapersData&&PapersData.PaperInfo?<div className="line-paper">
              <Radio className="my-radio" value={PapersData.PaperInfo.ID}
                checked={this.state.paperID === PapersData.PaperInfo.ID}
                 onChange={e => this.onChangePaper(PapersData.PaperInfo)}
              />
              <div className="paper-list">
                <div className="test-img"/>
                <div className="test-content">
                  <h4>{PapersData.PaperInfo.PaperName}</h4>
                  {/*<span>共{PapersData.PaperInfo.Count}道题</span>*/}
                </div>
              </div>
            </div>: <div className='no-testPaper'>暂无试卷</div>

          }
        </Modal>
      </div>

    )
  }
}
export default withRouter(ToExaminationModal);
