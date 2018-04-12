/**
 * Created by Yu Tian Xiong on 2017/12/11.
 * fileName:插入视频
 */
import React, {Component} from 'react';
import {Upload, Button, Icon, message, Menu, Form,Select,Input,Table} from 'antd';
import oss from '../../../basics/oss';
import ThumbUpload from '../thumbload/ThumbUpload';
import Api from '../../../api'

const FormItem = Form.Item;
const Option = Select.Option;
const videoFormat = ['webm', 'mp4', 'ogg', 'avi', 'rmvb', 'rm', 'asf', 'divx', 'mpg', 'mpeg', 'mpe', 'wmv', 'mkv', 'vob'];

 class InsertVideo extends Component {

  constructor(props){
    super(props);
    this.state = {
      pagination: {current: 1, pageSize:5},//分页
      fileList: [],
      current: '1',
    };
    this.colums = [
      {
        title: '名称',
        dataIndex: 'Name',
        width:500
      },
      {
        title: '创建日期',
        dataIndex: 'CreateDate',
        width:500
      },
    ];
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
    this.setState({fileList});
  };

  // 上传文件类型检测
  beforeUpload = (file) => {
    const isVideo = videoFormat.includes(file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase());
    if (!isVideo) {
      message.error(`请选择视频文件`);
    }
    const isLtSize = file.size / 1024 / 1024 < 50;
    if (!isLtSize) {
      message.error('上传文件最大不能超过50M！');
    }
    return isVideo && isLtSize;
  };

  // 文件组件自定义上传
  handleCustomRequest = (options) => {
    oss.ali.uploader(options.file, 'video', options)
  };
  //tab 切换
  handleClick = (e) => {
    this.setState({current: e.key},()=>{
      if(this.state.current === '2'){
        this.getFileList(1);
      }
    })
  };

  //选择上传类型
  chooseChange = (value) => this.setState({type:value});

  //上传视频封面
  getUploadUrl = (value) => {this.setState({cover: value})};

   //提交插入视频信息
   videoSubmit = (e) => {
     e.preventDefault();
     const {dataKey} = this.state;
     this.props.form.validateFields((err, values) => {
       if (!err && this.state.current === '1') {
         if(!this.state.cover){message.info('请上传封面');return}
          if(this.state.current === '1' && this.state.type === '1'){
            let fileName = values.videoLocal.fileList[0].name;
            let suffixName = fileName.slice(fileName.lastIndexOf('.') + 1);
            let body = {
              ID:0,
              Type:2,
              Name:fileName,
              Thumb:this.state.cover,
              Url:`${values.videoLocal.fileList[0].url}`,
              SuffixName:suffixName,
              Length:values.videoLocal.fileList[0].size,
              Desc:'',
              CreateDate:this.getCurrentTime()
            };
            Api.Info.FileUpload({body}).then(res=>{
              if(res.Ret === 0){
                this.props.getVideoUrl(false,res.Data);
                message.success('插入视频成功');
              }
            })

          }
          if(this.state.current === '1' && this.state.type === '2'){
            let body = {Thumb:this.state.cover,Url:values.videoOut};
            this.props.getVideoUrl(false,body);
            message.success('插入视频成功');
          }
       }
       if(this.state.current === '2'){
         if(dataKey){
           this.props.getVideoUrl(false,dataKey);
         }else{
           message.info('请选择列表');
         }
       }
     })
   };
   //取消插入视频模态
   close = () => this.props.getVideoUrl(false);
   //获取当前时间
   getCurrentTime = () =>{
     let currentTime = new Date();
     return `${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()}`
   };
   //获取文件列表
   getFileList = (pIndex) => {
     const {current, pageSize} = this.state.pagination;
     this.setState({loading: true});
     Api.Info.getFileList({
       pageIndex: pIndex || current,
       pageSize: pageSize,
       body: {Type:2,Name:'',CloudID:'',GID:'',CreateUID:'',SortFields:''}
     }).then(res=>{
       if(res.Ret===0){
         let dataSource = [];
         const pagination = {...this.state.pagination};
         if (res.Data) {
           pagination.total = res.Data.TotalRecords;
           pagination.current = res.Data.PageIndex;
           if (res.Data.TotalRecords) {
             let data = res.Data.ViewModelList;
             //操作关联内容数据
             data.map(item => {
               dataSource.push({
                 ...item,
               })
             })
           }
         }
         this.setState({dataSource, pagination, loading: false});

       }else {
         message.error(res.Msg);
       }
     })
   };

   //操作分页
   handleTableChange = (pagination) =>{
     const pager = {...this.state.pagination};
     pager.current = pagination.current;
     this.setState({pagination: pager});
     this.getFileList(pagination.current);
   };

   rowClick = (record) =>{
     const index = record.ID;
     let data = record;
     this.setState({index,dataKey:data})
   };


  render() {
    const {fileList,loading,dataSource} = this.state;
    const { getFieldDecorator } = this.props.form;
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
          span: 24,
          offset: 0,
        },
      },
    };
    return (
      <div>
        <Form>
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="1">
              上传视频
            </Menu.Item>
            <Menu.Item key="2">
              历史记录
            </Menu.Item>
          </Menu>
          {this.state.current === '1' &&
          <FormItem label='上传方式' {...formItemLayout} style={{marginTop: 10}}>
              {getFieldDecorator('videoType', {
                rules: [{required: true, message:'请选择上传方式'}],
              })(
              <Select  onChange={this.chooseChange}>
                <Option value='1'>本地上传</Option>
                <Option value='2'>外部链接地址</Option>
              </Select>
              )}
          </FormItem>}
          {(this.state.type === '1' && this.state.current === '1') &&
          <FormItem {...formItemLayout} label="本地上传">
              {getFieldDecorator('videoLocal', {
                rules: [{required: true, message:'请上传视频'}],
              })(
              <Upload
                fileList={fileList}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
                customRequest={this.handleCustomRequest}
              >
                <Button><Icon type="upload"/>点击上传视频文件</Button>
              </Upload>
              )}
          </FormItem>}
          {(this.state.type === '2' && this.state.current === '1') &&
          <FormItem label='视频地址' {...formItemLayout}>
            {getFieldDecorator('videoOut', {
              rules: [{required: true, message:'请输入外部视频链接地址'}],
            })(
            <Input placeholder='请输入外部视频链接地址'/>
            )}
          </FormItem>}
          {this.state.current === '1'&&
          <FormItem label='视频封面' {...formItemLayout}>
            <span style={{position: 'relative', right: '70px', fontSize: 12, color: '#f04134', fontFamily: 'SimSun'}}>*</span>
            <ThumbUpload upload={(value) => {this.getUploadUrl(value)}} cover={this.state.cover} cropRate=""/>
          </FormItem>}
          {this.state.current === '2' && <FormItem style={{marginTop:10}}>
            <Table
              rowKey="ID"
              bordered = {false}
              rowClassName={(record,index) => record.ID === this.state.index ? 'no-bordered': ''}
              columns={this.colums}
              onRowClick = {this.rowClick}
              size="small"
              loading={loading}
              dataSource={dataSource}
              pagination={this.state.pagination}
              onChange={this.handleTableChange}
            />
          </FormItem>}

          <FormItem  {...tailFormItemLayout}>
            <Button style={{float:'right'}} type="primary" onClick={(e)=>this.videoSubmit(e)}>确定</Button>
            <Button style={{float:'right',marginRight:10}} onClick={this.close}>取消</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(InsertVideo);