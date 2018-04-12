import React, {Component} from 'react';
import classNames from 'classnames';

import oss from '../../../common/utils/oss'

import {Form, Input, Button, Upload, Icon, Modal, message} from 'antd';
import ServiceAsync from "../../../common/service";
import {Token} from "../../../common/utils/token";

const FormItem = Form.Item;
const {TextArea} = Input;
const token = Token();

const ossDomain = [{label: 'k12', value: 1}, {label: 'nutri', value: 2}, {label: 'phys', value: 3}];
const videoFormat = ['webm', 'mp4', 'ogg', 'avi', 'rmvb', 'rm', 'asf', 'divx', 'mpg', 'mpeg', 'mpe', 'wmv', 'mkv', 'vob'];

class TextFile extends Component {
  state = {
    fileList: [],
    uploading: false,
  };

  // 文件上传组件值更新时
  handleChange = (info) => {
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-3);

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    // 3. filter successfully uploaded files according to response from server
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.res.status === 200;
      }
      return true;
    });
    console.log(info)
    this.setState({fileList});
  };

  // 上传文件类型检测
  beforeUpload = (file) => {
    const isVideo = videoFormat.includes(file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase());
    if (isVideo) {
      message.error(`请选择非视频文件`);
    }
    const isLtSize = file.size / 1024 / 1024 < 50;
    if (!isLtSize) {
      message.error('上传文件最大不能超过50M！');
    }
    return !isVideo && isLtSize;
  };

  // 文件组件自定义上传
  handleCustomRequest = (options) => {
    console.log(options)
    this.props.onUpload((err, values) => {
      oss.ali.uploader(options.file, ossDomain.find(item => item.value === +values.domain).label, options)
    })
  };

  handleUpload = () => {
    this.props.onUpload((errProps, valuesProps) => {
      this.props.form.validateFields((err, values) => {
        err = Object.assign({}, err || {}, errProps || {});
        values = Object.assign({}, values || {}, valuesProps || {});
        const file = this.state.fileList.slice(-1)[0];

        if (Object.keys(err).length) {
          this.showError({title: '错误提示', content: '请填写完整文件上传信息'});
          return
        }
        this.setState({uploading: true});
        ServiceAsync('POST', 'Resource/v3/File/AddOrEditFile', {
          token,
          body: {
            Orgin: '资源组织平台',
            SuffixName: file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase(),
            Url: file.url,
            Name: values.fileName,
            Format: 1,
            Desc: values.description,
            People: values.crowd,
            Length: file.size,
            Type: 1,
            PropertyList: values.property.filter(item =>{
              Reflect.deleteProperty(item, 'label');
              Reflect.deleteProperty(item, 'value');
              return +item.ID >= 0
            }),
            ResourceTags: this.props.tags.filter(item=> {
              let tags;
              values.tags.forEach(tag => {
                if(item.ID === tag){
                  tags = {...item}
                }
              });
              if(tags){
                Reflect.deleteProperty(tags, 'label');
                Reflect.deleteProperty(tags, 'value');
                return tags;
              }
            }),
            CategroyIDs: values.category
          }
        }).then(res => {
          if (res.Ret === 0) {
            this.showConfirm({
              title: '文件上传成功',
              content: `文件${values.fileName}已成功上传，是否需要继续上传文件？`,
              onOk: () => {
                this.props.form.resetFields();
                this.setState({fileList: []});
              },
              onCancel: () => {
                this.props.form.resetFields();
                this.props.onCancel();
                this.setState({fileList: []});
                this.props.history.push('/resource');
              }
            })
          } else {
            this.showError({title: '文件上传失败', content: res.Data});
          }
          this.setState({uploading: false});
        })
      })
    })

  }

  showConfirm = ({title, content, onOk, onCancel} = {}) => Modal.confirm({title, content, onOk, onCancel})
  showError = ({title, content} = {}) => Modal.error({title, content});

  render() {
    const {uploading, fileList} = this.state
    const {className} = this.props;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 10},
    };

    return (
      <div className={classNames('uploader-text', className)}>
        <FormItem{...formItemLayout} label="文件名称" extra="文件名称20字以内">
          {getFieldDecorator('fileName', {
            rules: [
              {required: true, message: '请填写文件名称！'},
              {max: 20, message:'文件名称不得超过20个字'}
              ]
          })(
            <Input placeholder="文件名称"/>
          )}
        </FormItem>

        <FormItem{...formItemLayout} label="文件简介">
          {getFieldDecorator('description', {
            rules: [{required: true, message: '请填写文件简介！'}]
          })(
            <TextArea autosize={{minRows: 3, maxRows: 6}} placeholder="上传文件简介"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="上传文件"
          extra={<div>文件大小：50M以内<br/>文件类型：所有非视频文件</div>}
        >
          {getFieldDecorator('upload', {
            rules: [{required: true, message: '请先上传文传！'}]
          })(
            <Upload
              fileList={fileList}
              beforeUpload={this.beforeUpload}
              onChange={this.handleChange}
              customRequest={this.handleCustomRequest}
            >
              <Button><Icon type="upload"/> 点击上传</Button>
            </Upload>
          )}
        </FormItem>
        <FormItem wrapperCol={{span: 12, offset: 6}}>
          <Button type="primary"
                  onClick={this.handleUpload}
                  loading={uploading}
          >{uploading ? '上传中...' : '开始上传'}</Button>
        </FormItem>
      </div>
    )
  }
}

const formOptions = {
  onValuesChange: (props, values) => {
    props.onUpload((errProps, valuesProps) => {
      values = Object.assign(values || {}, valuesProps || {});
    });
  }
}

export default Form.create(formOptions)(TextFile);
