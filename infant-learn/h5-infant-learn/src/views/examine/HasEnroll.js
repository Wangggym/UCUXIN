/**
 * Created by QiHan Wang on 2017/9/29.
 * Enroll
 */

import React, {Component} from 'react';
import Api from '../../api';
import classNames from 'classnames';
import './examine.scss';

class HasEnroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainPlan: {}
    }
  }

  componentDidMount() {
    this.getTrainPlan();
  }

  getTrainPlan = () => {
    const {match} = this.props;
    // const params = searchParams(location.search);
    Api.Examine.getTrainPlan({
      trainPlanID: match.params.trainPlanID,
      gId: match.params.gId,
      isUser: !!(+match.params.isUser)
    }).then(res => {
      if (res.Ret === 0) {
        this.setState({trainPlan: res.Data})
      }
    });
  };

  handleExamine = () => {
    const {match, history} = this.props;
    history.push(`${match.url}/examine-page`);
  };

  render() {
    const {trainPlan} = this.state;
    const notEamineNum = ()=> {
      if(Array.isArray(trainPlan.ListUser)){
        return trainPlan.ListUser.filter(item => item.AuditST === 30).length
      }else {
        return 0;
      }
    };

    return (
      <div className="examine">
        <h1 className="train-plan-title">{trainPlan.Title}</h1>
        <div className="train-plan-content">
          <dl>
            <dt>培训名称</dt>
            <dd>{trainPlan.Name}</dd>
          </dl>
          <dl>
            <dt>培训内容</dt>
            <dd>{trainPlan.Cnt}</dd>
          </dl>
          <dl>
            <dt>适用角色</dt>
            <dd>{trainPlan.DestPeople && trainPlan.DestPeople.filter(item => item.IsCheck).map(item => item.Name).join('、')}</dd>
          </dl>
          <dl>
            <dt>授课讲师</dt>
            <dd>{trainPlan.LecturerList && trainPlan.LecturerList.map(item => item.Name).join('、')}</dd>
          </dl>
          <dl>
            <dt>学分</dt>
            <dd>{trainPlan.Credit}</dd>
          </dl>
          <dl>
            <dt>参训限定名额</dt>
            <dd>{trainPlan.QtyLimit}</dd>
          </dl>
          <dl>
            <dt>报名截止时间</dt>
            <dd>{trainPlan.EndDate}</dd>
          </dl>
        </div>
        <div className="has-enroll">
          <div className="has-enroll-title">已报名（{trainPlan.QtySignUped}人）</div>
          <div className="has-enroll-content">
            {
              Array.isArray(trainPlan.ListUser) && trainPlan.ListUser.map(item =>
                <div className="enroll-list-item" key={item.ID}>
                  <div className="enroll-list-hd">
                    <span className="enroll-avatar" style={{backgroundImage: `url(${item.Pic})`}}/>
                  </div>
                  <div className="enroll-list-bd">
                    <div className="enroll-name">{item.UName}</div>
                    <div className="enroll-desc">时间：{item.UDate}</div>
                  </div>
                  <div className="enroll-list-ft">
                    <span className={classNames({
                      'examine-pending': item.AuditST === 30,
                      'examine-not-pass': item.AuditST === 40,
                      'examine-pass': item.AuditST === 50
                    })}>{item.AuditSTDisplay}</span>
                  </div>
                </div>
              )
            }

            {/*<div className="enroll-list-item">
              <div className="enroll-list-hd">
                <span className="enroll-avatar" style={{backgroundImage: ''}}/>
              </div>
              <div className="enroll-list-bd">
                <div className="enroll-name">张三</div>
                <div className="enroll-desc">张三</div>
              </div>
              <div className="enroll-list-ft"><span className="examine-pending">审核通过</span></div>
            </div>
            <div className="enroll-list-item">
              <div className="enroll-list-hd">
                <span className="enroll-avatar" style={{backgroundImage: ''}}/>
              </div>
              <div className="enroll-list-bd">
                <div className="enroll-name">张三</div>
                <div className="enroll-desc">张三</div>
              </div>
              <div className="enroll-list-ft"><span className="examine-not-pass">审核通过</span></div>
            </div>
            <div className="enroll-list-item">
              <div className="enroll-list-hd">
                <span className="enroll-avatar" style={{backgroundImage: ''}}/>
              </div>
              <div className="enroll-list-bd">
                <div className="enroll-name">张三</div>
                <div className="enroll-desc">张三</div>
              </div>
              <div className="enroll-list-ft"><span className="examine-pass">审核通过</span></div>
            </div>*/}
          </div>
        </div>
        <div className="examine-footer-bar">
          <div className="examine-footer-desc"/>
          <button className="btn-examine" onClick={this.handleExamine} disabled={!(notEamineNum())}>审核</button>
        </div>
      </div>
    )
  }
}

export default HasEnroll;
