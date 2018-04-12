import React from 'react'
import PropTypes from 'prop-types'
import {Steps, Form, Input, Icon, Upload, message, Row, Col, Spin, Card, Button} from 'antd';
import {AppToken} from "../../utils/token";
import {StorageService} from '../../utils';
import Config from '../../config';
import Api from '../../api';
import './style.scss'
import ButtonGroup from './ButtonGroup'

const FormItem = Form.Item
const TextArea = Input.TextArea
const Step = Steps.Step

const LEDERLIST_TEMPLATE = {ID: 0, Name: null, HeadImg: null, TeacherType: 1, Instro: null}
const TEACHER_TEMPLATE = {ID: 0, Name: null, HeadImg: null, TeacherType: 2, Instro: null}
const initialValues = (data) => {
  if (data) return data
  return {}
}
const initialAchievementList = (data) => {
  if (data) {
    const {AchievementList} = data
    if (AchievementList && AchievementList.length) {
      return AchievementList
    }
    return [{ImgUrl: null, Desc: null}]
  }
  return [{ImgUrl: null, Desc: null}]
}
const initialLeaderList = (data) => {
  if (data && data.length) {
    return data
  }
  return [{...LEDERLIST_TEMPLATE}]
}

const initialTeacherList = (data) => {
  if (data && data.length) {
    return data
  }
  return [{...TEACHER_TEMPLATE}]
}

const initTemporaryUrl = (data) => {
  if (data) return data.ImgUrl
  return null
}

class EditorParkInfo extends React.Component {
  constructor(props) {
    super(props)
    const {parkInfo, leaderList, TeacherList} = this.props.location.state
    this.state = {
      current: 0,
      values: initialValues(parkInfo),
      AchievementList: initialAchievementList(parkInfo),
      loading: false,
      GardenInfoID: null,
      leaderList: initialLeaderList(leaderList),
      TeacherList: initialTeacherList(TeacherList),
      //临时图片
      temporaryUrl: initTemporaryUrl(parkInfo),
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue(this.state.values)
  }

  // 自定义头像上传
  handleCustomRequest = (options, callback) => {
    // 获取应用Token
    Api.Base.getAppToken().then(res => {
      if (typeof res === 'string') {
        callback(options.file, res);
      } else {
        let token = res.Data.Token;
        StorageService('session').set('AppToken', token);
        Config.setToken({name: 'appToken', value: token});
        callback(options.file, token);
      }
    })
  };

  // 上传头像
  handleUploadHeadPic = (file, token,) => {
    const fd = new FormData();
    fd.append('filename', file);
    const attachmentStr = '{"Path": "youls","AttachType": 1, "ExtName": ".jpg","ResizeMode": 1,"SImgResizeMode": 2, "CreateThumb": true, "Width": 100, "Height": 100,"SHeight": 50,"SWidth": 50 }';
    Api.Base.upload({
      token,
      attachmentStr,
      body: fd
    }).then(res => {
      if (res.Ret === 0) {
        this.setState({temporaryUrl: res.Data.Url})
        this.props.form.setFieldsValue({ImgUrl: res.Data.Url});
      } else {
        message.error('上传失败！');
        this.props.form.setFieldsValue({ImgUrl: undefined});
      }
    })
  };

  // 批量上传头像
  handleUploadBatchPic = (file, token, index, fieldName, field) => {
    const fd = new FormData();
    fd.append('filename', file);
    const attachmentStr = '{"Path": "youls","AttachType": 1, "ExtName": ".jpg","ResizeMode": 1,"SImgResizeMode": 2, "CreateThumb": true, "Width": 100, "Height": 100,"SHeight": 50,"SWidth": 50 }';
    Api.Base.upload({
      token,
      attachmentStr,
      body: fd
    }).then(res => {
      if (res.Ret === 0) {
        this.handleBase64(file, imageUrl => this.setImg(res.Data.Url, index, fieldName, field));
      } else {
        message.error('上传失败！');
      }
    })
  };

  //设置图片
  setImg(ImgUrl, index, fieldName, field) {
    const list = [...this.state[fieldName]]
    list[index][field] = ImgUrl
    this.setState({[fieldName]: list})
  }

  // 将图像转为base64
  handleBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  //切换页面
  handleConfirm(field) {
    if (this.SaveValues()) return message.info('信息填写错误')
    let newCurrent = this.state.current
    switch (field) {
      case 'up':
        newCurrent--
        break
      case 'down':
        newCurrent++
        break
    }
    if (newCurrent === 2) {
      this.setState({loading: true})
      this.handleSaveParkInfo().then(res => {
        this.setState({loading: false})
        if (!res) {
          return message.error('res为空')
        }
        if (res.Ret === 0) {
          this.setState({current: newCurrent, GardenInfoID: res.Data})
        } else {
          message.info(res.Msg)
        }
      })
    } else {
      this.setState({current: newCurrent})
    }

  }

  //每次切换保存值
  SaveValues() {
    let isError = false
    this.props.form.validateFields((error, values) => {
      if (error) return isError = error
      this.state.values = {...this.state.values, ...values}
      this.setState({values: this.state.values})
    });
    return isError
  }

  //保存老师风采信息并跳转页面
  handleSave = () => {
    const {GardenInfoID, leaderList, TeacherList} = this.state
    const body = {GardenInfoID, TeacherList: [...leaderList, ...TeacherList]}
    this.setState({loading: true})
    Api.ParkInfo.addOrEditrTeacher({body}).then(res => {
      this.setState({loading: false})
      if (!res) {
        return message.error('res为空')
      }
      if (res.Ret === 0) {
        message.success('添加信息成功')
        this.props.history.push({pathname: '/parkInfo'})
      } else {
        message.info(res.Msg)
      }
    })
  }

  //保存园所信息
  handleSaveParkInfo = () => {
    const {values, AchievementList} = this.state
    const body = {...values, AchievementList}
    console.log(body)
    return Api.ParkInfo.addOrEditGardenInfo({body}).then(res => {
      return res
    })

  }

  //描述改变时
  handleDescChange = (index, Desc) => {
    const AchievementList = [...this.state.AchievementList]
    AchievementList[index].Desc = Desc
    this.setState({AchievementList})
  }

  //添加成果展示
  handleAddAchievement = () => {
    const AchievementList = [...this.state.AchievementList, {ImgUrl: null, Desc: null}]
    this.setState({AchievementList})
  }

  //添加园长介绍
  handleAddLeader = () => {
    const leaderList = [...this.state.leaderList, {...LEDERLIST_TEMPLATE}]
    this.setState({leaderList})
  }

  //添加老师介绍
  handleAddTeacher = () => {
    const TeacherList = [...this.state.TeacherList, {...TEACHER_TEMPLATE}]
    this.setState({TeacherList})
  }

  //当老师风采部分值改变时
  handleMienChange = (NameField, field, index, value) => {
    const list = [...this.state[NameField]]
    list[index][field] = value
    this.setState({[NameField]: list})
  }


  //删除头像
  handleDeleteHeadClick = (fields) => {
    this.setState({[fields]: null})
    this.props.form.setFieldsValue({ImgUrl: null})
  }

  handleDeletePicClick = (NameField, field, index) => {
    const list = [...this.state[NameField]]
    list[index][field] = null
    this.setState({[NameField]: list})
  }

  //上传之前对文件进行检查
  beforeUpload = (file) => {
    console.log(file)
  }

  render() {
    const {current} = this.state
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {labelCol: {span: 6}, wrapperCol: {span: 14}}
    const teacherFormItemLayout = {labelCol: {span: 3}, wrapperCol: {span: 14}}
    return (
      <Spin spinning={this.state.loading}>
        <Steps current={current}>
          <Step title="园所简介" description=""/>
          <Step title="荣誉成果" description=""/>
          <Step title="教师风采" description=""/>
        </Steps>
        <Form>
          <div className='form-content' style={current !== 0 ? {display: 'none'} : null}>
            <FormItem {...formItemLayout} label="园所名称">
              {getFieldDecorator('Name', {
                rules: [{required: true, message: ' 园所名称必填',}],
              })(
                <Input maxLength={'50'} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="机构图片" extra="照片格式为jpg，png，gif，大小不超过2M，画面清晰">
              {getFieldDecorator(`ImgUrl`, {rules: [{required: true, message: ' 机构图片必填',}],})(
                <Upload
                  className="avatar-uploader"
                  name="avatar"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  customRequest={(options) => this.handleCustomRequest(options, (file, token) => this.handleUploadHeadPic(file, token))}
                >
                  {
                    this.state.temporaryUrl ?
                      <img src={this.state.temporaryUrl} alt="" className="avatar"/> :
                      <Icon type="plus" className="avatar-uploader-trigger"/>
                  }
                </Upload>
              )}
              {
                this.state.temporaryUrl ?
                  <Button size={"small"} icon="delete"
                          onClick={() => this.handleDeleteHeadClick('temporaryUrl')}>删除</Button> : null
              }
            </FormItem>
            <FormItem {...formItemLayout} label="园所历史">
              {getFieldDecorator('History')(<TextArea rows={3} maxLength={'2000'}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="办学理念">
              {getFieldDecorator('Theory')(<TextArea rows={3} maxLength={'2000'}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="园所特色">
              {getFieldDecorator('Feature')(<TextArea rows={3} maxLength={'2000'}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="硬件环境介绍">
              {getFieldDecorator('Hardware')(<TextArea rows={3} maxLength={'2000'}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="联系电话">
              {getFieldDecorator('Tel')(<Input maxLength={'11'}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="咨询老师">
              {getFieldDecorator('TeaName')(<Input maxLength={'50'}/>)}
            </FormItem>
          </div>
          <div className='form-content' style={current !== 1 ? {display: 'none'} : null}>
            <FormItem {...formItemLayout} label="荣誉介绍">
              {getFieldDecorator('Honor')(<TextArea rows={3}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="成果展示" extra="照片格式为jpg，png，gif，大小不超过2M，画面清晰">
              {
                this.state.AchievementList.map(({ImgUrl, Desc}, index) => {
                  return (
                    <div key={index} className='achievementList'>
                      <Upload
                        className="avatar-uploader"
                        name="avatar"
                        showUploadList={false}
                        beforeUpload={this.beforeUpload}
                        customRequest={(options) => this.handleCustomRequest(options, (file, token) => this.handleUploadBatchPic(file, token, index, 'AchievementList', 'ImgUrl'))}
                      >
                        {
                          ImgUrl ?
                            <img src={ImgUrl} alt="" className="avatar"/> :
                            <Icon type="plus" className="avatar-uploader-trigger"/>
                        }
                      </Upload>
                      {
                        ImgUrl ?
                          <Button size={"small"} icon="delete"
                                  onClick={() => this.handleDeletePicClick('AchievementList', 'ImgUrl', index,)}>删除</Button> : null
                      }
                      <Input
                        placeholder='填写图片描述内容'
                        onChange={e => this.handleDescChange(index, e.target.value)}
                        style={{marginTop: 10}}
                        value={Desc}/>
                    </div>
                  )
                })
              }
            </FormItem>
            <Row>
              <Col span={6}></Col>
              <Col> <a href='javascript:void(0)' onClick={this.handleAddAchievement}>+添加成果</a></Col>
            </Row>
          </div>
          <div className='form-content' style={current !== 2 ? {display: 'none'} : null}>
            <div className='mien-title'><span>园长介绍</span><a href='javascript:void(0)' onClick={this.handleAddLeader}>+添加园长简介</a>
            </div>
            {
              this.state.leaderList.map(({Name, HeadImg, Instro}, index) => {
                return (
                  <Card key={index} className='teacher-card'>
                    <FormItem {...teacherFormItemLayout} label='姓名'>
                      <Input placeholder='填写园长名称与职务' value={Name}
                             onChange={e => this.handleMienChange('leaderList', 'Name', index, e.target.value)}/>
                    </FormItem>
                    <FormItem {...teacherFormItemLayout} label='头像' extra="照片格式为jpg，png，gif，大小不超过2M，画面清晰">
                      <Upload
                        className="avatar-uploader"
                        name="avatar"
                        showUploadList={false}
                        beforeUpload={this.beforeUpload}
                        customRequest={(options) => this.handleCustomRequest(options, (file, token) => this.handleUploadBatchPic(file, token, index, 'leaderList', 'HeadImg'))}
                      >
                        {
                          HeadImg ?
                            <img src={HeadImg} alt="" className="avatar"/> :
                            <Icon type="plus" className="avatar-uploader-trigger"/>
                        }
                      </Upload>
                      {
                        HeadImg ?
                          <Button size={"small"} icon="delete"
                                  onClick={() => this.handleDeletePicClick('leaderList', 'HeadImg', index,)}>删除</Button> : null
                      }
                    </FormItem>
                    <FormItem {...teacherFormItemLayout} label='简介'>
                      <TextArea placeholder='请填写园长简介' rows={3} value={Instro}
                                onChange={e => this.handleMienChange('leaderList', 'Instro', index, e.target.value)}/>
                    </FormItem>
                  </Card>
                )
              })
            }
            <div className='mien-title'><span>教师简介</span><a href='javascript:void(0)' onClick={this.handleAddTeacher}>+添加教师简介</a>
            </div>
            {
              this.state.TeacherList.map(({Name, HeadImg, Instro}, index) => {
                return (
                  <Card key={index} className='teacher-card'>
                    <FormItem {...teacherFormItemLayout} label='姓名'>
                      <Input placeholder='填写教师名称与职务' value={Name}
                             onChange={e => this.handleMienChange('TeacherList', 'Name', index, e.target.value)}/>
                    </FormItem>
                    <FormItem {...teacherFormItemLayout} label='头像' extra="照片格式为jpg，png，gif，大小不超过2M，画面清晰">
                      <Upload
                        className="avatar-uploader"
                        name="avatar"
                        showUploadList={false}
                        beforeUpload={this.beforeUpload}
                        customRequest={(options) => this.handleCustomRequest(options, (file, token) => this.handleUploadBatchPic(file, token, index, 'TeacherList', 'HeadImg'))}
                      >
                        {
                          HeadImg ?
                            <img src={HeadImg} alt="" className="avatar"/> :
                            <Icon type="plus" className="avatar-uploader-trigger"/>
                        }
                      </Upload>
                      {
                        HeadImg ?
                          <Button size={"small"} icon="delete"
                                  onClick={() => this.handleDeletePicClick('TeacherList', 'HeadImg', index,)}>删除</Button> : null
                      }
                    </FormItem>
                    <FormItem {...teacherFormItemLayout} label='简介'>
                      <TextArea placeholder='填写教师简介' rows={3} value={Instro}
                                onChange={e => this.handleMienChange('TeacherList', 'Instro', index, e.target.value)}/>
                    </FormItem>
                  </Card>
                )
              })
            }
          </div>
          <Row>
            <ButtonGroup onConfirm={this.handleConfirm.bind(this)} current={current} length={3}
                         onSave={this.handleSave}/>
          </Row>
        </Form>
      </Spin>
    )
  }
}

//限定控件传入的属性类型
EditorParkInfo.propTypes = {}

//设置默认属性
EditorParkInfo.defaultProps = {}

export default Form.create()(EditorParkInfo)
