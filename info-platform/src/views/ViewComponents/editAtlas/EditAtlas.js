/**
 * Created by Yu Tian Xiong on 2017/12/22.
 * fileName:编辑图集
 */
import React, {Component} from 'react';
import {Form, Input, Select, message,Button} from 'antd';
import Api from '../../../api';
import PublishSet from '../../publicComponents/PublishSet';
import ThumbUpload from '../../publicComponents/thumbload/ThumbUpload';
import './editAtlas.less';
import HotTag from "../../publicComponents/hotTag/HotTag";
import AddImg from '../../publicComponents/addImg/AddImg';
import Associated from '../../publicComponents/associated/Associated';
import moment from 'moment'


const FormItem = Form.Item;
const Option = Select.Option;


class EditAtlas extends Component {
  state = {
    channelList: [],
    IsRefContent: 0,
    cover: '',
    tags: [],
    pictures: [],
  };

  componentDidMount() {
    this.getChannelList();
    if (this.props.match.params.id) {
      this.getAltasDetail();
    }
  }

  //获取频道列表
  getChannelList = () => {
    Api.Info.getChannelList().then(res => {
      if (res.Ret === 0) {
        this.setState({
          channelList: res.Data
        })
      } else {
        message.error(res.Msg);
      }
    })
  };
  //获取图集详情
  getAltasDetail = () => {
    Api.Info.getAltasDetail({contentType: 13, contentID: this.props.match.params.id}).then(res => {
      if (res.Ret === 0) {
        let data = res.Data;
        let channels = [];
        let PublishTimer = {
          type:res.Data.PublishSendType,
          date:res.Data.PublishTimerDate,
        };
        data.Channels.map(item => {
          channels.push({key: item.ID, label: item.Name});
        });
        let {setFieldsValue} = this.props.form;
        //设置表单值
        setFieldsValue({
          title: data.Title,
          chanel: channels,
          Author: data.Author,
          RefContent:data.RefContent,
          PublishTimerDate:PublishTimer,
        });
        //非表单赋值
        this.setState({
          tags: data.Tags ? data.Tags : [],
          ID: data.ID,
          editStatus: data.Status,
          pictures: data.Pictures,
          cover: data.Thumbs && data.Thumbs[0]
        });
      }
    })
  };
  //HotTag 组件  子组件传过来的tag数组
  getHotTag = (value) => {
    if (value.length > 5) value.splice(0, 1);
    this.setState({tags: value});
  };
  //ThumbUpload组件 接收子组件 传过来的图片路径
  getUploadUrl = (value) => {
    this.setState({cover: value});
  };
  //增加图集的传值
  addImg = (value) => {
    this.setState({pictures: value});
  };
  //保存图集 发布图集
  saveAltas = (e) => {
    e.preventDefault();
    let state = this.state;
    let thumb = [state.cover].filter(i => i);
    if (thumb.length === 0) {
      message.info('请上传封面');
      return
    }
    if (state.pictures.length === 0) {
      message.info('请新增图集');
      return
    }
    this.props.form.validateFields((err, values) => {
      let chanels = [];
      values.chanel && values.chanel.map((item) => {
        chanels.push({ID: item.key, Name: item.label})
      });
      if (!err) {
        let body = {
          ID: this.state.ID ? this.state.ID : 0,
          ContentType: 13,
          Status: 0,//草稿
          Title: values.title,
          Thumbs: thumb,
          Author: values.Author,
          Pictures: state.pictures,
          RefContent: values.RefContent ? values.RefContent : '',
          Tags: state.tags ? state.tags : '',
          Channels: chanels,
          PublishSendType: values.PublishTimerDate.type ? 1 : 0,//内容发布类型,
          PublishTimerDate: values.PublishTimerDate.type === 0 ? '' : moment(values.PublishTimerDate.date).format('YYYY-MM-DD HH:mm:ss'),
        };
        Api.Info.saveAltas({body}).then(res => {
          if (res.Ret === 0) {
            this.setState({ID: res.Data.ID});
            message.info('保存图集成功');
          }else{
            message.error(res.Msg)
          }
        })
      }
    });
  };
  publishAltas = (e) => {
    e.preventDefault();
    let state = this.state;
    let thumb = [state.cover].filter(i => i);
    if (thumb.length === 0) {
      message.info('请上传封面');
      return
    }
    if (state.pictures.length === 0) {
      message.info('请新增图集');
      return
    }
    this.props.form.validateFields((err, values) => {
      let chanels = [];
      values.chanel && values.chanel.map((item) => {
        chanels.push({ID: item.key, Name: item.label})
      });
      if (!err) {
        let body = {
          ID: this.state.ID ? this.state.ID : 0,
          ContentType: 13,
          Status: 0,//草稿
          Title: values.title,
          Thumbs: thumb,
          Author: values.Author,
          Pictures: state.pictures,
          RefContent: values.RefContent ? values.RefContent : '',
          Tags: state.tags ? state.tags : '',
          Channels: chanels,
          PublishSendType: values.PublishTimerDate.type ? 1 : 0,//内容发布类型,
          PublishTimerDate: values.PublishTimerDate.type === 0 ? '' : moment(values.PublishTimerDate.date).format('YYYY-MM-DD HH:mm:ss'),
        };
        Api.Info.publishAltas({body}).then(res => {
          if (res.Ret === 0) {
            this.setState({ID: res.Data.ID});
            this.props.history.push('/news');
          }else{
            message.error('res.Msg')
          }
        })
      }
    });
  };
  // 验证发布设置
  checkPublishSet = (rule, value, callback) => {
    if (value && value.type === 1) {
      if (value.date) {
        callback();
        return;
      } else {
        callback('请选择定时时间！');
        return;
      }
    }
    if (value && value.type === 0) {
      callback();
      return;
    }
    callback('请选择发布设定！');
  };
  //操作频道数
  handleChange = (value) => {
    let {setFieldsValue} = this.props.form;
    if (value.length > 2) {
      value.splice(0, 1);
      setFieldsValue({chanel: value})
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {channelList, tags, editStatus} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    return (
      <div className="articleAtlas">
        {/*左侧编辑表单*/}
        <div className="atlas-left">
          <Form className="login-form">
            <FormItem {...formItemLayout} label="图集标题" style={{marginTop: '20px'}}>
              {getFieldDecorator('title', {
                rules: [{required: true, message: '请输入图集标题'}],
              })(
                <Input placeholder="点击输入图集标题" disabled={editStatus === 8 ? true : editStatus === 9 ? true : false} maxLength="30"/>
              )}
            </FormItem>
            <FormItem label="作者或出处" {...formItemLayout}>
              {getFieldDecorator('Author', {
                rules: [{required: false, message: '请输入作者'}],
              })(
                <Input placeholder="请输入作者和文章出处" maxLength="10"/>
              )}
            </FormItem>
            <FormItem label="封面" {...formItemLayout} >
              <span style={{position: 'relative', right: '46px', fontSize: 12, color: '#f04134', fontFamily: 'SimSun'}}>*</span>
              <ThumbUpload upload={(value) => {this.getUploadUrl(value)}} cover={this.state.cover} cropRate="16:9" size={true}/>
            </FormItem>
            <FormItem label='内容' {...formItemLayout}>
              <span style={{position: 'relative', right: '46px', fontSize: 12, color: '#f04134', fontFamily: 'SimSun'}}>*</span>
              <AddImg getImgChange={this.addImg} pictures={this.state.pictures}/>
            </FormItem>
            <FormItem label="关联内容" {...formItemLayout}>
              {getFieldDecorator('RefContent', {
                rules: [{required: false}],
              })(
                <Associated/>
              )}
            </FormItem>
            <FormItem label="标签" {...formItemLayout} >
              <HotTag tag={(value) => {
                this.getHotTag(value)
              }} tags={tags}/>
            </FormItem>
            <FormItem label="发布频道" {...formItemLayout} >
              {getFieldDecorator('chanel', {
                rules: [{required: true, message: '请选择发布频道'},],
              })(
                <Select
                  mode="tags"
                  placeholder="请选择发布频道"
                  labelInValue={true}
                  onChange={this.handleChange}
                  disabled={editStatus === 8 ? true : false}
                >
                  {Array.isArray(channelList) && channelList.map(item => <Option value={item.ID}
                                                                                 key={item.ID}>{item.Name}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem label="发布时间" {...formItemLayout} >
              {getFieldDecorator('PublishTimerDate', {
                rules: [{required: true, validator: this.checkPublishSet}],
                initialValue: {type: 0, date: null}
              })(
                <PublishSet disabled={editStatus === 8 ? true : false}/>
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              {editStatus !== 5 && editStatus !== 8 ?
                <Button type="primary" onClick={(e) => this.saveAltas(e)} style={{marginRight: 10, marginBottom: 100}}
                        className="btn-cofirm">保存</Button> : null}
              <Button className="publish-btn" onClick={(e) => this.publishAltas(e)}>发布</Button>
            </FormItem>
          </Form>
        </div>
        {/*预览编辑页面*/}
        {/*<div className="atlas-see">*/}

        {/*</div>*/}
      </div>
    );
  }
}

export default Form.create()(EditAtlas);