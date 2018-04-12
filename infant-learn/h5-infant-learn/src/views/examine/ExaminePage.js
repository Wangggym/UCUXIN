/**
 * Created by QiHan Wang on 2017/9/29.
 * Enroll
 */

import React, {Component} from 'react';
import Api from '../../api';
import './examine-page.scss';

import {Toast} from 'antd-mobile';

class HasEnroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainPlan: {},
      selectedPerson: [],
      allSelected: false
    }
  }

  componentDidMount() {
    this.getApplyTrainPlan();
  }

  getApplyTrainPlan = () => {
    const {match} = this.props;
    Api.Examine.getApplyTrainPlan({trainPlanId: match.params.trainPlanID, gId: match.params.gId}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          trainPlan: res.Data
        });
      }
    })
  };
  handleExamine = () => {
    const {st, selectedPerson, remark} = this.state;
    if (st === undefined) {
      Toast.info('请选择是否通过！', 1);
      return;
    }
    if (!selectedPerson.length) {
      Toast.info('请选择审核的人员！', 1);
      return;
    }

    if (!st && !remark) {
      Toast.info('请填写不通用意见！', 1);
      return;
    }

    Api.Examine.updateApplyUser({
      body: {
        st,
        ids: selectedPerson,
        remark
      }
    }).then(res => {
      if (res.Ret === 0) {
        Toast.success('审核成功', 1, () => {
          this.props.history.goBack();
        })
      } else {
        Toast.fail(res.Msg, 1);
      }
    });
  };

  handleSelectPerson = (i, e) => {
    const {trainPlan} = this.state;

    trainPlan.ListUser[i].checked = e.target.checked;

    const nextSelected = trainPlan.ListUser.filter(item => item.checked).map(item => item.ID);
    const allSelected = trainPlan.ListUser.every(item => item.checked);
    this.setState({trainPlan, selectedPerson: nextSelected, allSelected})
  };

  handleChangeStatus = (e) => {
    this.setState({st: !!(+e.target.value)})
  };
  handleAllSelect = (e) => {
    const {trainPlan} = this.state;
    trainPlan.ListUser.forEach(item => item.checked = e.target.checked);
    const nextSelected = trainPlan.ListUser.filter(item => item.checked).map(item => item.ID);
    this.setState({trainPlan, selectedPerson: nextSelected, allSelected: e.target.checked})
  };

  handlePinion = (e) => {
    this.setState({remark: e.target.value})
  };

  render() {
    const {trainPlan, selectedPerson, allSelected, st} = this.state;
    return (
      <div className="examine-page">
        <h1 className="train-plan-title">{trainPlan.TrainPlanName}</h1>
        <div className="enroll-basic">
          共报名{trainPlan.TotalCnt}人，限定名额{trainPlan.LimitCnt}人，审核通过{trainPlan.AuditedCnt}人
        </div>
        <div className="examine-opt">
          <label htmlFor="pass">
            <input type="radio" id="pass" name="st" className="examine-checkbox" value={1}
                   onChange={this.handleChangeStatus}/><i/>通过
          </label>
          <label htmlFor="not-pass">
            <input type="radio" id="not-pass" name="st" className="examine-checkbox" value={0}
                   onChange={this.handleChangeStatus}/><i/>不通过
          </label>
          {
            (st === false) && <div className="examine-pinion">
              <textarea onChange={this.handlePinion} placeholder="请填写不通过意见"/>
            </div>
          }

        </div>

        <div className="examine-person">
          {
            Array.isArray(trainPlan.ListUser) && trainPlan.ListUser.map((item, i) =>
              <label htmlFor={item.ID} className="person-list-item" key={item.ID}>
                <span className="person-pic" style={{backgroundImage: `url(${item.Pic})`}}/>
                <div className="person-desc">
                  <input type="checkbox" id={item.ID} name="person" className="examine-checkbox"
                         checked={!!item.checked}
                         onChange={(e) => this.handleSelectPerson(i, e)}/><i/>{item.UName}
                </div>
              </label>)
          }


          {/*<label htmlFor="person" className="person-list-item">
            <span className="person-pic"/>
            <div className="person-desc">
              <input type="checkbox" id="person" name="person" className="examine-checkbox"/><i/>不通过
            </div>
          </label>*/}

        </div>
        <div className="examine-footer-bar">
          <div className="examine-footer-desc">
            <label htmlFor="all">
              <input type="checkbox" id="all" className="examine-checkbox" onChange={this.handleAllSelect}
                     checked={allSelected}/><i/>
              全选
            </label>
            <span
              className="selected">已选择（<b>{selectedPerson.length}/{trainPlan.ListUser && trainPlan.ListUser.length}</b>）</span>
          </div>
          <button className="btn-examine" onClick={this.handleExamine}>提交</button>
        </div>
      </div>
    )
  }
}

export default HasEnroll;
