/**
 * Created by Yu Tian Xiong on 2018/2/02.
 * fileName:编辑电子书
 */

import React, {Component} from 'react';
import {Form,Select,Input,Button,Radio,message,Upload,Icon,Modal} from 'antd';
import ThumbUpload from '../../publicComponents/thumbload/ThumbUpload';
import HotTag from '../../publicComponents/hotTag/HotTag';
import PublishRange from '../../publicComponents/publishRange/PublishRange';
import AllPage from './bookComponent/AllPage';
import FreeRead from './bookComponent/FreeRead';
import './editEbook.less';
import Api from '../../../api';
import oss from '../../../basics/oss';
import UE from 'UEditor';
import PublicFuc from '../../../basics/publicFuc';
import InsertVideo from '../../publicComponents/insertHtmlTemplate/insertVideo';
import InsertMusic from '../../publicComponents/insertHtmlTemplate/insertMusic';
import TrailFile from './bookComponent/TrailFile';




const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const RadioGroup = Radio.Group;
const videoFormat = ['webm', 'mp4', 'ogg', 'avi', 'rmvb', 'rm', 'asf', 'divx', 'mpg', 'mpeg', 'mpe', 'wmv', 'mkv', 'vob'];


class EditEbook extends Component{
  constructor(props) {
    super(props);
    this.state = {
      iconVisible:false,
      musicVisible:false,
      videoVisible:false,
      tags:[],
      cover:'',
      fileList:[],
      filekey:[],
      trailFile:[],
    };
    this.editor = null;
  }

  componentDidMount () {
    if(this.props.match.params.id){this.getEbookDetail();}
    //实例化百度编辑器
    const self = this;
    UE.registerUI('插入图片',(editor,uiName) => {
      //创建一个button
      let btnOne = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:uiName,
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -380px -0px;',
        //点击时执行的命令
        onclick: (s) => {
          //做自己的操作
          if(s==='click'){
            self.setState({iconVisible:true});
            return;
          }else {
            self.setState({iconVisible:false});
          }
          editor.execCommand( 'inserthtml',s );
        }
      });
      //设置btn状态 进行 html 字符串传递
      self.setState({btnOne});
      //当点到编辑内容上时，按钮要做的状态反射
      editor.addListener('selectionchange', () => {
        let state = editor.queryCommandState(uiName);
        if (state === -1) {
          btnOne.setDisabled(true);
          btnOne.setChecked(false);
        } else {
          btnOne.setDisabled(false);
          btnOne.setChecked(state);
        }
      });
      return btnOne;
    });
    UE.registerUI('插入音频',(editor,uiName) => {
      //创建一个button
      let btnTwo = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:uiName,
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -18px -40px;',
        //点击时执行的命令
        onclick: (s) => {
          //做自己的操作
          if(s==='click'){
            self.setState({musicVisible:true});
            return;
          }else {
            self.setState({musicVisible:false});
          }
          editor.execCommand( 'inserthtml',s );
        }
      });
      //设置btn状态 进行 html 字符串传递
      self.setState({btnTwo});
      //当点到编辑内容上时，按钮要做的状态反射
      editor.addListener('selectionchange', () => {
        let state = editor.queryCommandState(uiName);
        if (state === -1) {
          btnTwo.setDisabled(true);
          btnTwo.setChecked(false);
        } else {
          btnTwo.setDisabled(false);
          btnTwo.setChecked(state);
        }
      });
      return btnTwo;
    });
    UE.registerUI('插入视频',(editor,uiName) => {
      //创建一个button
      let btnThree = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:uiName,
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'background-position: -320px -20px;',
        //点击时执行的命令
        onclick: (s) => {
          console.log(s);
          //做自己的操作
          if(s==='click'){
            self.setState({videoVisible:true});
            return;
          }else {
            self.setState({videoVisible:false});
          }
          editor.execCommand( 'inserthtml',s );
        }
      });
      //设置btn状态 进行 html 字符串传递
      self.setState({btnThree});
      //当点到编辑内容上时，按钮要做的状态反射
      editor.addListener('selectionchange', () => {
        let state = editor.queryCommandState(uiName);
        if (state === -1) {
          btnThree.setDisabled(true);
          btnThree.setChecked(false);
        } else {
          btnThree.setDisabled(false);
          btnThree.setChecked(state);
        }
      });
      return btnThree;
    });
    this.initEditor();
  }
  componentWillMount() {
    const {id} = this.props;
    this.setState({id: `UE${id ? `-${id}` : ''}-${(new Date().getTime()).toString()}`})
  }
  //初始化编辑器
  initEditor = () => {
    const {config, onChange, value} = this.props;
    const {id} = this.state;
    const ueEditor = UE.getEditor(id, config);
    ueEditor.ready((ueditor) => {
      if (!ueditor) {
        UE.delEditor(id);
        this.initEditor();
      }
      // 初始化时设置默认值
      value && ueEditor.setContent(value)
    })
  };

  //ThumbUpload组件 接收子组件 传过来的图片路径
  getUploadUrl = (value) =>{
    this.setState({cover:value})
  };
  //HotTag 组件  子组件传过来的tag数组
  getHotTag = (value) =>{
    if(value.length>5) value.splice(0,1);
    this.setState({tags:value});
  };

  //获取电子书详情
  getEbookDetail = () =>{
    Api.Content.getEbookDetail({contentID: this.props.match.params.id}).then(res=>{
      if(res.Ret === 0){
        let data = res.Data;
        let { setFieldsValue } = this.props.form;
        //组装总页数的值
        let AllPage = {
          pagesCount:data.PagesCount,
          wordsCount:data.WordsCount
        };
        //组装免费试读的值
        let FreeRead = {
          freeBeginPage:data.FreeBeginPage,
          freeEndPage:data.FreeEndPage,
        };
        //发布范围数据回填进表单
        let PublishRange = {
          MTypeRangeType:data.MTypeRangeType,
          MTypeIDs:data.MTypeIDs,
          RegionRangeType:data.RegionRangeType,
          Regions:data.Regions,
          PhaseRangeType:data.PhaseRangeType,
          PhaseIDs:data.PhaseIDs,
        };
        //设置表单值
        setFieldsValue({
          title:data.Title,
          category:data.BookType.toString(),
          Author:data.Author,
          publish:data.Publisher,
          directory:data.Directories,
          allPage:AllPage,
          IsFree:Number(data.IsFree).toString(),
          publishRange:PublishRange,
        });
        //非表单赋值
        this.setState({
          tags:data.Tags ? data.Tags : [],
          ID:data.ID,
          editStatus:res.Data.Status,
          cover:data.Thumbs && data.Thumbs[0],
          read:Number(data.IsFree).toString(),
          filekey:data.File ? [data.File] : [],
          htmlContent:data.Summary,
        },()=>{
          setFieldsValue({
            price:data.SalePrice,
            freeRead:FreeRead,
          });
          if(data.TrailFile){
            //组装数据
            let key = {
              ID:data.TrailFile.ID,
              HashCode:data.TrailFile.HashCode,
              size:data.TrailFile.Length,
              name:data.TrailFile.Name,
              url:data.TrailFile.Url,
            };
            this.setState({trailFile:[data.TrailFile]});
            setFieldsValue({
              trailFile:[key]
            });

          }
        });
        const {id} = this.state;
        this.editor = UE.getEditor(id);
        this.editor.ready(() => {
          // 初始化时设置默认值
          data.Summary && this.editor.setContent(data.Summary)
        })
      }
    })
  };

  //保存电子书
  saveEbook = (e) =>{
    e.preventDefault();
    const state = this.state;
    const ueEditor = UE.getEditor(state.id);
    let htmlContent = ueEditor.getPlainTxt();//获取百度编辑器里的html字符串
    let thumb = [state.cover].filter(i => i);
    if(thumb.length === 0 ){message.info('请上传封面');return}
    if (htmlContent === '') {message.info('请编辑电子书简介');return;}
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (state.filekey.length !== 0 || state.fileList.length !== 0) {
          let file = {
            ID:state.filekey.length!==0  ? state.filekey[0].ID : 0,
            Type:4,
            Name:state.fileList.length!==0 ? state.fileList[0].name : state.filekey[0].Name,
            Thumb:'',
            Url:state.fileList.length!==0 ? `${state.fileList[0].url}` : `${state.filekey[0].Url}`,
            SuffixName:state.fileList.length!==0 ? state.fileList[0].name.slice(state.fileList[0].name.lastIndexOf('.') + 1) : state.filekey[0].SuffixName,
            Length:state.fileList.length!==0 ? state.fileList[0].size : state.filekey[0].Length,
            Desc:'',
            CreateDate:this.getCurrentTime(),
            HashCode:state.fileList.length!==0 ? sessionStorage.getItem('hashCode') : state.filekey[0].HashCode
          };
          let trailFile;
          if(this.state.read==='0' && values.trailFile ) {
            trailFile = {
              ID: values.trailFile.length !==0 ? values.trailFile[0].ID : 0,
              Type: 4,
              Name: values.trailFile.length !==0 && values.trailFile[0].name,
              Thumb: '',
              Url: values.trailFile.length !==0 && `${values.trailFile[0].url}`,
              SuffixName: values.trailFile.length !==0 && values.trailFile[0].name.slice(values.trailFile[0].name.lastIndexOf('.') + 1),
              Length: values.trailFile.length !==0 && values.trailFile[0].size,
              Desc: '',
              CreateDate: this.getCurrentTime(),
              HashCode: values.trailFile[0].HashCode ? values.trailFile[0].HashCode : sessionStorage.getItem('hash'),
            };
          }
          let body = {
            ID: this.state.ID ? this.state.ID : 0,
            ContentType: 23,
            Status: 0,//未上架
            Title: values.title,//电子书标题
            Thumbs: thumb,
            BookType: values.category,//类别
            Tags: state.tags ? state.tags : '',//标签
            Summary:htmlContent,
            Directories: values.directory,
            Author: values.Author,
            MemberUID: '',
            Publisher: values.publish,
            PagesCount: values.allPage.pagesCount ? values.allPage.pagesCount : '',//总页数
            WordsCount: values.allPage.wordsCount ? values.allPage.wordsCount : '',
            FreeBeginPage: values.freeRead && values.freeRead.freeBeginPage,//试读起始页
            FreeEndPage: values.freeRead && values.freeRead.freeEndPage,//试读结束页
            File:file,//电子书文件
            TrailFile:this.state.read === '0' ? trailFile : [],//试读文件
            IsFree: +values.IsFree,//是否免费
            SalePrice: values.price,//售价
            MTypeRangeType: values.publishRange.MTypeRangeType,//角色范围
            MTypeIDs: values.publishRange.MTypeIDs,//角色
            RegionRangeType: values.publishRange.RegionRangeType,//区域范围
            Regions: values.publishRange.Regions,//区域
            PhaseRangeType: values.publishRange.PhaseRangeType,//学段范围
            PhaseIDs: values.publishRange.PhaseIDs//学段
          };
          Api.Content.saveEbook({body}).then(res => {
            if (res.Ret === 0) {
              this.setState({ID: res.Data.ID});
              message.success('保存电子书成功');
            }else {
              message.error(res.Msg)
            }
          })
        }else{
          message.info('请上传文件')
        }
      }

    });

  };
  //发布电子书
  publishEbook = (e) =>{
    e.preventDefault();
    const state = this.state;
    const ueEditor = UE.getEditor(state.id);
    let htmlContent = ueEditor.getPlainTxt();//获取百度编辑器里的html字符串
    let thumb = [state.cover].filter(i => i);
    if(thumb.length === 0 ){message.info('请上传封面');return}
    if (htmlContent === '') {message.info('请编辑电子书简介');return;}
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(state.filekey.length !== 0 || state.fileList.length !== 0) {
          let file = {
            ID:state.filekey.length!==0 ? state.filekey[0].ID : 0,
            Type:4,
            Name:state.fileList.length!==0 ? state.fileList[0].name : state.filekey[0].Name,
            Thumb:'',
            Url:state.fileList.length!==0 ? `${state.fileList[0].url}` : `${state.filekey[0].Url}`,
            SuffixName:state.fileList.length!==0 ? state.fileList[0].name.slice(state.fileList[0].name.lastIndexOf('.') + 1) : state.filekey[0].SuffixName,
            Length:state.fileList.length!==0 ? state.fileList[0].size : state.filekey[0].Length,
            Desc:'',
            CreateDate:this.getCurrentTime(),
            HashCode:state.fileList.length!==0 ? sessionStorage.getItem('hashCode') : state.filekey[0].HashCode
          };
          let trailFile;
          if(this.state.read==='0' && values.trailFile) {
            console.log(values.trailFile[0].HashCode);
            trailFile = {
              ID: values.trailFile.length !==0 ? values.trailFile[0].ID : 0,
              Type: 4,
              Name: values.trailFile.length !==0 && values.trailFile[0].name,
              Thumb: '',
              Url: values.trailFile.length !==0 && `${values.trailFile[0].url}`,
              SuffixName: values.trailFile.length !==0 && values.trailFile[0].name.slice(values.trailFile[0].name.lastIndexOf('.') + 1),
              Length: values.trailFile.length !==0 && values.trailFile[0].size,
              Desc: '',
              CreateDate: this.getCurrentTime(),
              HashCode: values.trailFile[0].HashCode ? values.trailFile[0].HashCode : sessionStorage.getItem('hash'),
            };
          }
          let body = {
            ID: this.state.ID ? this.state.ID : 0,
            ContentType: 23,
            Status: 0,//未上架
            Title: values.title,//电子书标题
            Thumbs: thumb,
            BookType: values.category,//类别
            Tags: state.tags ? state.tags : '',//标签
            Summary:htmlContent,
            Directories: values.directory,
            Author: values.Author,
            MemberUID: '',
            Publisher: values.publish,
            PagesCount: values.allPage.pagesCount ? values.allPage.pagesCount : '',//总页数
            WordsCount: values.allPage.wordsCount ? values.allPage.wordsCount : '',
            FreeBeginPage: values.freeRead && values.freeRead.freeBeginPage,//试读起始页
            FreeEndPage: values.freeRead && values.freeRead.freeEndPage,//试读结束页
            File:file,//电子书文件
            TrailFile:this.state.read === '0' ? trailFile : '',//试读文件
            IsFree: +values.IsFree,//是否免费
            IsTimeFree: '',//是否限时免费
            SalePrice: values.price,//售价
            MTypeRangeType: values.publishRange.MTypeRangeType,//角色范围
            MTypeIDs: values.publishRange.MTypeIDs,//角色
            RegionRangeType: values.publishRange.RegionRangeType,//区域范围
            Regions: values.publishRange.Regions,//区域
            PhaseRangeType: values.publishRange.PhaseRangeType,//学段范围
            PhaseIDs: values.publishRange.PhaseIDs//学段
          };
          Api.Content.publishEbook({body}).then(res => {
            if (res.Ret === 0) {
              message.success('发布电子书成功');
              this.props.history.push('/contents/ebook');
            }else {
              message.error(res.Msg)
            }
          })
        }else{
          message.info('请上传文件')
        }
      }

    });

  };

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
    PublicFuc.hashCode(options.file);
    oss.ali.uploader(options.file, 'ebook', options)
  };
  //是否免费状态切换
   changePrice = (e) =>{
     this.setState({read:e.target.value});
   };
  //试读页面验证
  checkRead = (rule,value,callback) =>{
    if(value){
      if(value.freeBeginPage!==null){
        callback();
      }else{
        callback('请输入起始页')
      }
      if(value.freeEndPage!==null){
        callback();
      }else{
        callback('请选择结束页');
      }

    }
    callback('请选择开始页和结束页');

  };

  //插入视频
  sureInsertVideo = (value,data) => {
    this.setState({videoVisible:value});
    data && this.state.btnThree.onclick(PublicFuc.insertVideoTemplate(data));
  };

  //插入音频
  insertMusic = (value,data) => {
    this.setState({musicVisible:value});
    data && this.state.btnTwo.onclick(PublicFuc.insertMusicTemplate(data));
  };

  //插入图片
  getIconUrl = (value) => this.setState({Icon: value});
  insertIcon = () => {
    if(this.state.Icon){
      this.state.Icon && this.state.btnOne.onclick(`<img src='${this.state.Icon}' style='width:100%'/>`);
    }else {
      message.info('请选择要插入的图片')
    }
  };
  //获取当前时间
  getCurrentTime = () =>{
    let currentTime = new Date();
    return `${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()}`
  };

  render(){
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
          span: 14,
          offset: 6,
        },
      },
    };
    const {tags,editStatus,fileList,filekey,id} =this.state;
    return (
      <div className="editEbook">
        {/*左侧编辑表单*/}
        <div className="Ebook-left">
          <Form  className="login-form">
            <FormItem {...formItemLayout} label="标题" style={{marginTop:'20px'}}>
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入电子书标题' }],
              })(
                <Input placeholder="点击输入电子书标题" disabled={editStatus===8 ? true : editStatus===9 ? true : false} maxLength="20"/>
              )}
            </FormItem>
            <FormItem label="封面" {...formItemLayout} >
              <span style={{position:'relative',right:'46px',fontSize:12,color:'#f04134',fontFamily: 'SimSun'}}>*</span>
              <ThumbUpload upload={(value)=>{this.getUploadUrl(value)}} cover={this.state.cover} cropRate="3:4" size={true}/>
            </FormItem>
            <FormItem label="类别" {...formItemLayout} >
              {getFieldDecorator('category', {
                rules: [{ required: false }],
              })(
                <Select placeholder="请选择类别">
                  <Option value="0">书刊</Option>
                  <Option value="1">报刊</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="作者" style={{marginTop:'20px'}}>
              {getFieldDecorator('Author', {
                rules: [{ required: false }],
              })(
                <Input placeholder="点击输入作者"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="出版社" style={{marginTop:'20px'}}>
              {getFieldDecorator('publish', {
                rules: [{ required: false }],
              })(
                <Input placeholder="点击输入出版社"/>
              )}
            </FormItem>
            <FormItem label='简介' {...formItemLayout}>
              <span style={{position:'relative',right:'46px',fontSize:12,color:'#f04134',fontFamily: 'SimSun'}}>*</span>
              <script id={id} name="content" type="text/plain" style={{width:'100%',height:300}}/>
              {/*插入视频*/}
              <Modal
                visible={this.state.videoVisible}
                wrapClassName="vertical-center-modal"
                title="请插入视频"
                onCancel={()=>{this.setState({videoVisible:false})}}
                maskClosable={false}
                width={600}
                footer={null}
              >
                <InsertVideo getVideoUrl = {this.sureInsertVideo}/>
              </Modal>
              {/*插入图片*/}
              <Modal
                visible={this.state.iconVisible}
                wrapClassName="vertical-center-modal"
                title="请插入图片"
                onCancel={()=>{this.setState({iconVisible:false})}}
                onOk = {this.insertIcon}
                maskClosable={false}
                width={400}
              >
                <ThumbUpload upload={(value) => {this.getIconUrl(value)}} cake="上传图片" size={false} cropRate=""/>
              </Modal>
              {/*插入音频*/}
              <Modal
                visible={this.state.musicVisible}
                wrapClassName="vertical-center-modal"
                title="请插入音频"
                onCancel={()=>{this.setState({musicVisible:false})}}
                maskClosable={false}
                width={600}
                footer={null}
              >
                <InsertMusic getMusicUrl ={this.insertMusic}/>
              </Modal>
            </FormItem>
            <FormItem label='目录' {...formItemLayout}>
            {getFieldDecorator('directory', {
              rules: [{required: true, message: '请输入目录'}],
            })(
              <TextArea autosize={{minRows: 4, maxRows: 8}}/>
            )}
            </FormItem>
            <FormItem label='总页数' {...formItemLayout}>
              {getFieldDecorator('allPage', {
                rules: [{required: false}],
                initialValue: {pagesCount: null, wordsCount: null}
              })(
                <AllPage/>
              )}
            </FormItem>
            <FormItem label="标签" {...formItemLayout} >
              <HotTag tag={(value)=>{this.getHotTag(value)}} tags={tags}/>
            </FormItem>
            <FormItem{...formItemLayout} label="电子书文件">
              <span style={{position:'relative',right:'80px',fontSize:12,color:'#f04134',fontFamily: 'SimSun'}}>*</span>
              <span>
                <Upload
                fileList={fileList}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
                customRequest={this.handleCustomRequest}
              >
                <Button><Icon type="upload"/> 点击上传</Button>
                {((this.props.match.params.id && filekey.filter(i=>i).length !==0) && fileList.length === 0 ) ? <span style={{marginLeft:10}}>{filekey[0].Name}</span> : null}
              </Upload>
              </span>
            </FormItem>
            <FormItem label='是否免费' {...formItemLayout}>
              {getFieldDecorator('IsFree', {
                rules: [{required: true, message: '请选择收费状态'}],
              })(
                <RadioGroup onChange={this.changePrice} disabled={editStatus === 8 ? true : false}>
                  <Radio value="1">免费</Radio>
                  <Radio value="0">收费</Radio>
                </RadioGroup>
              )}
            </FormItem>
            { this.state.read === "0" && <FormItem {...formItemLayout} label="价格" style={{marginTop:'20px'}}>
              {getFieldDecorator('price', {
                rules: [{ required: true,message:'请输入价格' }],
              })(
                <Input placeholder="请输入价格" type="number" disabled={editStatus === 8 ? true : false}/>
              )}
            </FormItem>}
            {this.state.read === "0" && <FormItem label='免费试读' {...formItemLayout}>
              {getFieldDecorator('freeRead', {
                rules: [{ required: true,validator: this.checkRead }],
                initialValue: {freeBeginPage: null, freeEndPage: null}
              })(
                <FreeRead/>
              )}
            </FormItem>}
            {this.state.read === "0" && <FormItem label='试读文件' {...formItemLayout}>
              {getFieldDecorator('trailFile', {
                rules: [{ required: false}],
              })(
                <TrailFile trail ={this.state.trailFile}/>
              )}
            </FormItem>}
            <FormItem label='发布范围' {...formItemLayout} className="publish-range">
              {getFieldDecorator('publishRange', {
                rules: [{required: false, message: '请输入发布范围'}],
                initialValue:{MTypeRangeType:0,MTypeIDs:null,RegionRangeType:0,Regions:null,PhaseRangeType:0,PhaseIDs:null},
              })(
                <PublishRange
                   disabled={editStatus === 8 ? true : false}
                />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              {editStatus !==8 && <Button type="primary" onClick={(e) => this.saveEbook(e)} style={{marginRight:10,marginBottom:100}} className="btn-cofirm">保存</Button>}
              <Button className="publish-btn" onClick={(e)=>this.publishEbook(e)}>发布</Button>
            </FormItem>
          </Form>
        </div>
        {/*预览编辑页面*/}
        {/*<div className="Ebook-see">*/}

        {/*</div>*/}
      </div>
    )
  }

}



export default Form.create()(EditEbook);