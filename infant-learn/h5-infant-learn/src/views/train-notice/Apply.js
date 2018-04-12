import React from 'react'
import {List, InputItem, WhiteSpace, Modal, Toast, Picker} from 'antd-mobile';
import {createForm} from 'rc-form';
import {T_Time} from '../../components'
import './TrainNotice.scss'
import {trainPlan} from '../../api'
import './Apply.scss'

const EducationType = [
  {label: '大专', value: '1'},
  {label: '本科', value: '2'},
  {label: '研究生', value: '3'},
  {label: '博士', value: '4'},
]

class BasicInputExample extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  handleClickSubmit() {
    this.props.form.validateFields((error, value) => {
      if (error) return console.log(error);
      value.Education = value.Education[0];
      this.aignUpTrainPlan(value)
    });
  }

  // 学员报名
  aignUpTrainPlan(data) {
    Toast.loading(null, 0)
    const {trainPlanID, ID, gId} = this.props.match.params
    const body = {...data, ID: 0, TrainPlanID: trainPlanID, UID: ID, GID: gId}
    console.log(body)
    trainPlan.aignUpTrainPlan({body}).then(res => {
      setTimeout(() => (Toast.hide()), T_Time * 500)
      if (!res) return
      if (res.Ret === 0) {
        setTimeout(() => (this.showModal()), T_Time * 500)
      }
      if (res.Ret === 5) {
        setTimeout(() => (Toast.info(res.Msg, 1)), T_Time * 500)
      }
    })
  }

  showModal() {
    this.setState({visible: !this.state.visible})
  }

  //关闭modal
  onClose = () => {
    const {trainPlanID, gId} = this.props.match.params
    this.props.history.push({pathname: `/train-notice/${trainPlanID}/${gId}`})
  }

  message = () => {
    alert('123')
  }

  render() {
    const {getFieldProps} = this.props.form;
    return (<div className='TrainNotice'>
        <header style={{left: 0, width: '100%', position: 'unset', height: '1.3rem', lineHeight: '1.3rem'}}>
          国培计划（2017）幼师培训通知公告
        </header>
        <main style={{left: 0, overflow: 'unset', position: 'unset', width: '100%'}}>
          <List>
            <InputItem
              placeholder="请输入名称"
              maxLength={11}
              {...getFieldProps('Name', {rules: [{required: false}],})}
            >
              姓名
            </InputItem>
            <InputItem
              maxLength={11}
              type='number'
              placeholder="请输入教龄"
              {...getFieldProps('TeaAge', {rules: [{required: false}],})}
            >教龄</InputItem>
            <Picker data={EducationType}
                    cols={1} {...getFieldProps('Education')}>
              <List.Item arrow="horizontal">学历</List.Item>
            </Picker>
            <InputItem
              {...getFieldProps('TelPhone', {rules: [{required: false}],})}
              clear={false}
              placeholder="请输入手机号码"
              maxLength={11}
            >手机号码</InputItem>
          </List>
        </main>
        <div className='button' onClick={this.handleClickSubmit.bind(this)}>
          确认提交
        </div>
        <Modal
          transparent
          maskClosable={false}
          visible={this.state.visible}
          onClose={this.onClose}
          footer={[{
            text: <div className='modal-config'>OK</div>, onPress: () => {
              this.onClose();
            }
          }]}
          platform="ios"
        >
          <div className='modal-content'>
            <div className='icon'></div>
            <div className='title'>报名成功！</div>
            <div className='orange-color'>资格审核中</div>
            <div className='hint'>温馨提示：将由园长审核并上报参培资格</div>
          </div>
        </Modal>
      </div>

    );
  }
}

export default createForm()(BasicInputExample);
