/**
 * Created by Yu Tian Xiong on 2018/03/20.
 * fileName:上传试读文件组件
 */
import React, {Component} from 'react';
import {Upload,Button,Icon,message} from 'antd';
import PublicFuc from '../../../../basics/publicFuc';
import oss from '../../../../basics/oss';


const videoFormat = ['webm', 'mp4', 'ogg', 'avi', 'rmvb', 'rm', 'asf', 'divx', 'mpg', 'mpeg', 'mpe', 'wmv', 'mkv', 'vob'];

export default class TrailFile extends Component {

  state = {
    fileList:[],
  };
  componentWillReceiveProps(nextProps){
    if(nextProps.trail && nextProps.trail.filter(i=>i).length !==0 ){
      this.setState({data:nextProps.trail});
    }
  }


  //文件上传成功的响应
  handleChange = (info) => {
    let fileList = info.fileList;
    //限制文件数量
    fileList = fileList.slice(-1);
    //文件链接
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    //文件响应
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.res.status === 200;
      }
      return true;
    });
    this.setState({fileList},()=>{this.props.onChange(fileList)});
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
    PublicFuc.hash(options.file);
    oss.ali.uploader(options.file, 'ebook', options)
  };

  render(){
    const {fileList,data} = this.state;
    return(
      <div>
        <Upload
          fileList={fileList}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          customRequest={this.handleCustomRequest}
        >
          <Button><Icon type="upload"/>点击上传</Button>
          { (data && fileList.length === 0) ?  <span style={{marginLeft:10}}>{data[0].Name}</span> : null}
        </Upload>
      </div>
    )
  }
}