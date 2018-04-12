/**
 * Created by Yu Tian Xiong on 2017/12/22.
 * fileName:编辑文章
 */
import React, {Component} from 'react';
import {Form, Input, Button, Icon, Radio, Select, Upload, message, Tag, Tooltip,Modal} from 'antd';
import PublishSet from '../../publicComponents/PublishSet';
import Api from '../../../api';
import oss from '../../../basics/oss';
import './editarticle.less';
import moment from 'moment';
import PublicFuc from '../../../basics/publicFuc';
import UE from 'UEditor';
import InsertVideo from '../../publicComponents/insertHtmlTemplate/insertVideo';
import InsertMusic from '../../publicComponents/insertHtmlTemplate/insertMusic';
import ThumbUpload from '../../publicComponents/thumbload/ThumbUpload';
import InsertArticleColum from '../../publicComponents/insertHtmlTemplate/insertArticleTemplate/insertArticleColum';
import InsertArticleGoods from '../../publicComponents/insertHtmlTemplate/insertArticleTemplate/insertArticleGoods';
import InsertArticleEbook from '../../publicComponents/insertHtmlTemplate/insertArticleTemplate/insertArticleEbook';
import HotTag from '../../publicComponents/hotTag/HotTag';


const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const CheckableTag = Tag.CheckableTag;


class Editarticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      visible: false,
      goodVisible: false,
      bookVisible: false,
      iconVisible: false,
      btnOne: null,//插入图片
      btnTwo: null,//插入音频
      btnThree: null,//插入视频
      musicVisible: false,
      videoVisible: false,
      dataRefContents: [],

      cover: [],//封面
      channelList: [],//频道列表
      rich: undefined,//富文本编辑
      ChannelID: [],//频道ID
      ChannelIDs: [],//频道ID数组

      coverOne: '',//单张封面
      coverTwo: '',
      coverThree: '',
      coverFour: '',
      editStatus: undefined,//编辑状态
      disabled: false,//是否禁用控件
      disOne: false,//是否禁用控件

      tags: [],
      inputVisible: false,
      inputValue: '',
      tagBox: false,
    };
    this.editor = null;
  }
  componentWillMount() {
    const {id} = this.props;
    this.setState({id: `UE${id ? `-${id}` : ''}-${(new Date().getTime()).toString()}`})
  }
  componentDidMount() {
    if (this.props.match.params.id) {
      this.getDetail();
    }
    this.getchannelList();
    this.getTags();
    //实例化编辑器
    const self = this;
    UE.registerUI('插入图片', (editor, uiName) => {
      //创建一个button
      let btnOne = new UE.ui.Button({
        //按钮的名字
        name: uiName,
        //提示
        title: uiName,
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules: 'background-position: -380px -0px;',
        //点击时执行的命令
        onclick: (s) => {
          //做自己的操作
          if (s === 'click') {
            self.setState({iconVisible: true});
            return;
          } else {
            self.setState({iconVisible: false});
          }
          editor.execCommand('inserthtml', s);
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
    UE.registerUI('插入音频', (editor, uiName) => {
      //创建一个button
      let btnTwo = new UE.ui.Button({
        //按钮的名字
        name: uiName,
        //提示
        title: uiName,
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules: 'background-position: -18px -40px;',
        //点击时执行的命令
        onclick: (s) => {
          //做自己的操作
          if (s === 'click') {
            self.setState({musicVisible: true});
            return;
          } else {
            self.setState({musicVisible: false});
          }
          editor.execCommand('inserthtml', s);
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
    UE.registerUI('插入视频', (editor, uiName) => {
      //创建一个button
      let btnThree = new UE.ui.Button({
        //按钮的名字
        name: uiName,
        //提示
        title: uiName,
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules: 'background-position: -320px -20px;',
        //点击时执行的命令
        onclick: (s) => {
          //做自己的操作
          if (s === 'click') {
            self.setState({videoVisible: true});
            return;
          } else {
            self.setState({videoVisible: false});
          }
          editor.execCommand('inserthtml', s);
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
  };

  componentWillUnmount() {
    // 组件卸载后，清除放入库的id
    UE.delEditor(this.state.id);
  }

  //初始化编辑器
  initEditor = () => {
    const {config,value} = this.props;
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
    ueEditor.addListener('selectionchange',()=>{
  		var dom = ueEditor.selection.getStart();
  		this.action(dom)
 	  })
  };
  //文章编辑详情
  getDetail = () => {
    Api.Info.getInfoDetail({contentType: 11, contentID: this.props.match.params.id}).then(res => {
      if (res.Data.Thumbs === null) {
        this.setState({value: "2"})
      } else if (res.Data.Thumbs.length === 1) {
        this.setState({value: "1"})
      } else {
        this.setState({value: "0"})
      }
      if (res.Ret === 0) {
        //点击编辑绑定值到表单
        let {setFieldsValue} = this.props.form;
        let channels = [];
        let PublishTimer = {
          type:res.Data.PublishSendType,
          date:res.Data.PublishTimerDate,
        };
        //重置频道对象内的属性值
        res.Data.Channels.map((item) => {
          item.key = item.ID;
          item.label = item.Name;
          delete item.ID;
          delete item.Name;
          channels.push(item);
        });
        setFieldsValue(
          {
            Author: res.Data.Author,
            Title: res.Data.Title,
            SrcUrl: res.Data.SrcUrl,
            chanel: channels,
            PublishTimerDate:PublishTimer,
          }
        );

        this.setState({
          detail: res.Data,
          coverOne: res.Data.Thumbs ? res.Data.Thumbs[0] : '',
          coverTwo: res.Data.Thumbs ? res.Data.Thumbs[0] : '',
          coverThree: res.Data.Thumbs ? res.Data.Thumbs[1] : '',
          coverFour: res.Data.Thumbs ? res.Data.Thumbs[2] : '',
          tags: res.Data.Tags ? res.Data.Tags : [],
          editStatus: res.Data.Status,
          ID: res.Data.ID,
          htmlContent: res.Data.Content,
          dataRefContents:res.Data.RefContents ? res.Data.RefContents : [],
        });
        const {id} = this.state;
        this.editor = UE.getEditor(id);
        this.editor.ready(() => {
          // 初始化时设置默认值
          res.Data.Content && this.editor.setContent(res.Data.Content)
        })

      }
    })
  };
  //获取热门标签
  getTags = () => {
    Api.Info.getTags({tagType: 1}).then(res => {
      if (res.Ret === 0) {
        this.setState({hotTag: res.Data})
      }
    })
  };
  //--保存资讯 提交表单
  submitSave = (e) => {
    e.preventDefault();
    const {coverOne, coverTwo, coverThree, coverFour, value, tags,id} = this.state;
    const ueEditor = UE.getEditor(id);
    let htmlContent = ueEditor.getContent();//获取百度编辑器里的html字符串
    let summary = PublicFuc.changeString(htmlContent);
    let uploadImg = [coverTwo, coverThree, coverFour].filter(i => i);//过滤空字符
    let uploadOne = [coverOne].filter(i => i);//过滤空字符
    if (value === "0" && uploadImg.length < 3) {
      message.info('请上传三张封面');
      return;
    }
    if ((value === "1" && uploadOne.length === 0)) {
      message.info('请上传单张封面');
      return;
    }
    if (htmlContent || htmlContent === '') {
      let data = this.state.dataRefContents;
      data.map((item, index) => {
        if (new RegExp(this.handleTitle(item.Title)).test(htmlContent)) {
          this.setState({dataRefContents: data})
        } else {
          data.splice(index, 1);
          this.setState({dataRefContents: data})
        }
      });
    }
    this.props.form.validateFields((err, values) => {
      let chanels = [];
      values.chanel && values.chanel.map((item) => {
        chanels.push({ID: item.key, Name: item.label})
      });
      if (!err) {
        const body = {
          ID: this.state.ID ? this.state.ID : 0,//主键ID
          ContentType: 11,//内容类型 （文章）
          Status: 0,//内容状态 (草稿)
          MemberUID: '',//作者id
          Summary: summary,//摘要
          Content: htmlContent,//资讯内容
          Channels: chanels,//取两个频道生成的数组
          PublishSendType: values.PublishTimerDate.type ? 1 : 0,//内容发布类型
          RefContents: this.state.dataRefContents.length !== 0 && this.state.dataRefContents,//关联内容
          Title: values.Title,//标题
          Thumbs: value === "1" ? uploadOne : value === "0" ? uploadImg : '',//封面
          Author: values.Author,//作者
          SrcUrl: values.SrcUrl,//原文链接
          Tags: tags ? tags : '',//标签
          PublishTimerDate: values.PublishTimerDate.type === 0 ? '' : moment(values.PublishTimerDate.date).format('YYYY-MM-DD HH:mm:ss'),
        };
        Api.Info.saveInfo({body}).then(res => {
          if (res.Ret === 0) {
            this.setState({ID: res.Data.ID});
            message.success('保存文章成功');
          }else{
            message.error(res.Msg)
          }
        })
      }
    });
  };
  //--发布资讯 提交表单
  submitPublish = (e) => {
    e.preventDefault();
    const {coverOne, coverTwo, coverThree, coverFour, value, tags,id} = this.state;
    const ueEditor = UE.getEditor(id);
    let htmlContent = ueEditor.getContent();//获取百度编辑器里的html字符串
    let summary = PublicFuc.changeString(htmlContent);
    let uploadImg = [coverTwo, coverThree, coverFour].filter(i => i);//过滤空字符
    let uploadOne = [coverOne].filter(i => i);//过滤空字符
    if (value === "0" && uploadImg.length < 3) {
      message.info('请上传三张封面');
      return;
    }
    if ((value === "1" && uploadOne.length === 0)) {
      message.info('请上传单张封面');
      return;
    }
    if (htmlContent || htmlContent === '') {
      let data = this.state.dataRefContents;
      data.map((item, index) => {
        if (new RegExp(this.handleTitle(item.Title)).test(htmlContent)) {
          this.setState({dataRefContents: data})
        } else {
          data.splice(index, 1);
          this.setState({dataRefContents: data})
        }
      });
    }
    this.props.form.validateFields((err, values) => {
      let chanels = [];
      values.chanel && values.chanel.map((item) => {
        chanels.push({ID: item.key, Name: item.label})
      });
      if (!err) {
        console.log(this.state.dataRefContents);
        const body = {
          ID: this.state.ID ? this.state.ID : 0,//主键ID
          ContentType: 11,//内容类型 （文章）
          Status: 0,//内容状态 (草稿)
          MemberUID: '',//作者id
          Summary: summary,//摘要
          Content: htmlContent,//资讯内容
          Channels: chanels,//取两个频道生成的数组
          PublishSendType: values.PublishTimerDate.type ? 1 : 0,//内容发布类型
          RefContents: this.state.dataRefContents.length !== 0 && this.state.dataRefContents,//关联内容
          Title: values.Title,//标题
          Thumbs: value === "1" ? uploadOne : uploadImg,//封面
          Author: values.Author,//作者
          SrcUrl: values.SrcUrl,//原文链接
          Tags: tags ? tags : '',//标签
          PublishTimerDate: values.PublishTimerDate.type === 0 ? '' : moment(values.PublishTimerDate.date).format('YYYY-MM-DD HH:mm:ss'),
        };
        Api.Info.publishInfo({body}).then(res => {
          if (res.Ret === 0) {
            this.props.history.push('/news');
          }else{
            message.error(res.Msg)
          }
        })
      }
    });
  };
  // 封面上传部分
  beforeUpload = (file) => {
    const mimeType = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/webp'];
    const isJPG = mimeType.includes(file.type);
    if (!isJPG) {
      message.error('您只能上传图片类型为jpg、png、bmp、webp、gif的图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小必须小于2M！');
    }
    return isJPG && isLt2M;
  };

  //自定义封面上传
  handleCustomRequest = (options) => {
    this.setState({uploadPicLoading: true});
    let key = options.file.name.slice(options.file.name.lastIndexOf('.') + 1);
    oss.ucuxin.uploader({
      options,
      attachmentStr: `{"Path": "zx","AttachType": 1, "ExtName": '.${key}',"ResizeMode": 1,"SImgResizeMode": 2, "CreateThumb": true, "Width": 100, "Height": 100,"SHeight": 50,"SWidth": 50 }`,
      cropRate:'3:2'
    }, (res) => {
      if (res.Ret === 0) {
        this.setState({coverOne: res.Data.ThumbUrl});
      } else {
        message.error('上传失败！');
        this.props.form.setFieldsValue({cover: undefined});
      }
      this.setState({uploadPicLoading: false});
    })
  };
  //上传三张封面
  handleRequest = (options) => {
    this.setState({uploadLoadingTwo: true});
    let key = options.file.name.slice(options.file.name.lastIndexOf('.') + 1);
    oss.ucuxin.uploader({
      options,
      attachmentStr: `{"Path": "zx","AttachType": 1, "ExtName": '.${key}',"ResizeMode": 1,"SImgResizeMode": 2, "CreateThumb": true, "Width": 100, "Height": 100,"SHeight": 50,"SWidth": 50 }`,
      cropRate:'3:2'
    }, (res) => {
      if (res.Ret === 0) {
        this.setState({coverTwo: res.Data.ThumbUrl})
      } else {
        message.error('上传失败！');
        this.props.form.setFieldsValue({cover: undefined});
      }
      this.setState({uploadLoadingTwo: true});
    })
  };
  handleRequestThree = (options) => {
    this.setState({uploadLoadingThree: true});
    let key = options.file.name.slice(options.file.name.lastIndexOf('.') + 1);
    oss.ucuxin.uploader({
      options,
      attachmentStr: `{"Path": "zx","AttachType": 1, "ExtName": '.${key}',"ResizeMode": 1,"SImgResizeMode": 2, "CreateThumb": true, "Width": 100, "Height": 100,"SHeight": 50,"SWidth": 50 }`,
      cropRate:'3:2'
    }, (res) => {
      if (res.Ret === 0) {
        this.setState({coverThree: res.Data.ThumbUrl})
      } else {
        message.error('上传失败！');
        this.props.form.setFieldsValue({cover: undefined});
      }
      this.setState({uploadLoadingThree: true});
    })
  };
  handleRequestFour = (options) => {
    this.setState({uploadLoadingFour: true});
    let key = options.file.name.slice(options.file.name.lastIndexOf('.') + 1);
    oss.ucuxin.uploader({
      options,
      attachmentStr: `{"Path": "zx","AttachType": 1, "ExtName": '.${key}',"ResizeMode": 1,"SImgResizeMode": 2, "CreateThumb": true, "Width": 100, "Height": 100,"SHeight": 50,"SWidth": 50 }`,
      cropRate:'3:2'
    }, (res) => {
      if (res.Ret === 0) {
        this.setState({coverFour: res.Data.ThumbUrl})
      } else {
        message.error('上传失败！');
        this.props.form.setFieldsValue({cover: undefined});
      }
      this.setState({uploadLoadingFour: true});
    })
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
  onChange = (e) => {
    if (e.target.value === "2") {
      this.setState({coverOne: '', coverTwo: '', coverThree: '', coverFour: '',});
    }
    if (e.target.value === "1") {
      this.setState({coverOne: ''});
    }
    if (e.target.value === "0") this.setState({coverTwo: '', coverThree: '', coverFour: '',});
    this.setState({value: e.target.value});
  };
  //操作频道数
  handleChange = (value) => {
    let {setFieldsValue} = this.props.form;
    if (value.length > 2) {
      value.splice(0, 1);
      setFieldsValue({chanel: value})
    }
  };
  //获取频道列表
  getchannelList = () => {
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

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({tags});
  };

  showInput = () => {
    this.setState({inputVisible: true, tagBox: true}, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({inputValue: e.target.value});
  };

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    if (tags.length > 5) tags.splice(0, 1);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
      // tagBox:false
    });
  };

  saveInputRef = input => this.input = input;

  handleTag = (tag, checked) => {
    const {tags} = this.state;
    const nextSelectedTags = checked ?
      [...tags, tag] :
      tags.filter(t => t !== tag);
    if (nextSelectedTags.length > 5) {
      nextSelectedTags.splice(0, 1);
    }
    this.setState({tags: nextSelectedTags});
  };

  //处理名称过长
  handleTitle = (title) => {
    let Title = title.substr(0);
    if (Title.length > 16) {
      Title = `${Title.substr(0, 8)}...`
    }
    return Title;
  };

  //插入专栏
  insertColumn = () => this.setState({visible:true});
  cancelColumn = () => this.setState({visible:false});
  getColumValue = (value,data) => {
    const {dataRefContents,id} = this.state;
    const ueEditor = UE.getEditor(id);
    data && dataRefContents.push(data);
    this.setState({visible:value,dataRefContents});
    data && ueEditor.execCommand('insertHtml',PublicFuc.insertColumTemplate(data));
    ueEditor.addListener('selectionchange',()=>{
  		var dom = ueEditor.selection.getStart();
  		this.action(dom)
 	})
  };

  //插入实物商品
  insertGoods = () => this.setState({goodVisible:true});
  cancelInsertGoods = () => this.setState({goodVisible:false});
  getGoodsValue = (value,data) => {
    const {dataRefContents,id} = this.state;
    const ueEditor = UE.getEditor(id);
    data && dataRefContents.push(data);
    this.setState({goodVisible:value,dataRefContents});
    data &&  ueEditor.execCommand('insertHtml',PublicFuc.insertGoodsTemplate(data));
    ueEditor.addListener('selectionchange',()=>{
  		let dom = ueEditor.selection.getStart();
  		this.action(dom)
 	})
  };
  action = (dom) =>{
 	dom.onclick=function(){
 		if(dom.className==='goodOff'){
 		  this.parentNode.parentNode.parentNode.parentNode.remove()
 		}
 	};
	dom.onclick()
 };
  //插入电子书
  insertBook = () => this.setState({bookVisible:true});
  cancelInsertBook = () => this.setState({bookVisible:false});
  getBookValue = (value,data) => {
    const {dataRefContents,id} = this.state;
    const ueEditor = UE.getEditor(id);
    data && dataRefContents.push(data);
    this.setState({bookVisible:value,dataRefContents});
    data && ueEditor.execCommand('insertHtml',PublicFuc.insertEbookTemplate(data));
    ueEditor.addListener('selectionchange',()=>{
  		var dom = ueEditor.selection.getStart();
  		this.action(dom)
 	})
  };


  //插入图片
  getUploadUrl = (value) => this.setState({Icon: value});
  insertIcon = () => {
    if(this.state.Icon){
      this.state.Icon && this.state.btnOne.onclick(`<img src='${this.state.Icon}' style='width:100%'/>`);
    }else {
      message.info('请选择要插入的图片')
    }
  };

  //插入音频
  insertMusic = (value,data) => {
    this.setState({musicVisible:value});
    data && this.state.btnTwo.onclick(PublicFuc.insertMusicTemplate(data));
  };

  //插入视频
  sureInsertVideo = (value,data) => {
    this.setState({videoVisible:value});
    data && this.state.btnThree.onclick(PublicFuc.insertVideoTemplate(data));
  };

  render() {
    const {editStatus, channelList, uploadPicLoading, coverOne, coverTwo, coverThree, coverFour, uploadLoadingTwo, uploadLoadingFour, uploadLoadingThree, tags, inputVisible, inputValue, tagBox, id} = this.state;
    const {getFieldDecorator} = this.props.form;
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
      <div className="articleEdit">
        {/*左侧编辑表单*/}
        <div className="article-left">
          <Form className="login-form">
            <FormItem {...formItemLayout} label="文章标题" style={{marginTop: '20px'}}>
              {getFieldDecorator('Title', {
                rules: [
                  {
                    required: true, message: '请输入文章标题',
                  }],
              })(
                <Input placeholder="点击输入文章标题" disabled={editStatus === 8 ? true : editStatus === 9 ? true : false} maxLength="30"/>
              )}
            </FormItem>
            <FormItem label="作者或出处" {...formItemLayout}>
              {getFieldDecorator('Author', {
                rules: [
                  {
                    required: false, message: '请输入作者或出处',
                  }],
              })(
                <Input placeholder="请输入作者和文章出处" maxLength="10"/>
              )}
            </FormItem>
            <FormItem label="封面" {...formItemLayout} >
              {getFieldDecorator('radio', {
                rules: [
                  {
                    required: true, message: '请上传封面',
                  }],
                initialValue: this.state.value
              })(
                <RadioGroup onChange={this.onChange}>
                  <Radio value="2">无封面</Radio>
                  <Radio value="1">单张封面</Radio>
                  <Radio value="0">三张封面</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {this.state.value === "1" ? <FormItem {...formItemLayout} extra="封面格式为jpg, png, gif, webp, bmp且大小不超过2M，画面清晰"
                                                  style={{marginLeft: '25%'}}>
              <div style={{display: 'block', width: '25%'}}></div>
              <Upload
                className="avatar-uploader"
                name="avatar"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                customRequest={this.handleCustomRequest}
                accept="image/gif,image/png,image/jpeg,image/bmp,image/webp"
              >
                {
                  coverOne ?
                    <img src={coverOne} alt="" className="avatar"/> :
                    <div className="avatar-uploader-trigger"><Icon
                      type={uploadPicLoading ? 'loading' : 'plus'}/><br/>{uploadPicLoading ? '正在上传...' : '上传封面'}</div>
                }
              </Upload>
            </FormItem> : null}
            {this.state.value === "0" ? <FormItem {...formItemLayout} extra="封面格式为jpg, png, gif, webp, bmp且大小不超过2M，画面清晰"
                                                  style={{marginLeft: '25%'}}>
              <div style={{display: 'flex'}}>
                <Upload
                  className="avatar-uploader"
                  name="avatar"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  customRequest={this.handleRequest}
                  accept="image/gif,image/png,image/jpeg,image/bmp,image/webp"
                >
                  {
                    coverTwo ?
                      <img src={coverTwo} alt="" className="avatar"/> :
                      <div className="avatar-uploader-trigger"><Icon
                        type={uploadLoadingTwo ? 'loading' : 'plus'}/><br/>{uploadLoadingTwo ? '正在上传...' : '上传封面'}</div>
                  }
                </Upload>
                <Upload
                  className="avatar-uploader"
                  name="avatar"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  customRequest={this.handleRequestThree}
                  accept="image/gif,image/png,image/jpeg,image/bmp,image/webp"
                >
                  {
                    coverThree ?
                      <img src={coverThree} alt="" className="avatar"/> :
                      <div className="avatar-uploader-trigger"><Icon
                        type={uploadLoadingThree ? 'loading' : 'plus'}/><br/>{uploadLoadingThree ? '正在上传...' : '上传封面'}
                      </div>
                  }
                </Upload>
                <Upload
                  className="avatar-uploader"
                  name="avatar"
                  showUploadList={false}
                  beforeUpload={this.beforeUpload}
                  customRequest={this.handleRequestFour}
                  accept="image/gif,image/png,image/jpeg,image/bmp,image/webp"
                >
                  {
                    coverFour ?
                      <img src={coverFour} alt="" className="avatar"/> :
                      <div className="avatar-uploader-trigger"><Icon
                        type={uploadLoadingFour ? 'loading' : 'plus'}/><br/>{uploadLoadingFour ? '正在上传...' : '上传封面'}
                      </div>
                  }
                </Upload>
              </div>
            </FormItem> : null}
            <FormItem label='内容' {...formItemLayout}>
              {/*<span style={{position:'relative',right:'46px',fontSize:12,color:'#f04134',fontFamily: 'SimSun'}}>*</span>*/}
              <div className="cake">
                <div className="btn-box">
                  <Button  onClick={this.insertColumn} className="box-btn">
                    <i></i>
                    插入专栏
                  </Button>
                  <Button style={{marginLeft:'2%'}} onClick={this.insertGoods} className="btn-two">
                    <i></i>
                    插入商品
                  </Button>
                  <Button style={{marginLeft:'2%'}} onClick={this.insertBook} className="btn-three">
                    <i></i>
                    插入电子书
                  </Button>
                </div>
                <script id={id} name="content" type="text/plain" style={{width:'100%',height:300}}/>
                {/*插入音频*/}
                <Modal
                  visible={this.state.musicVisible}
                  wrapClassName="vertical-center-modal"
                  title="请插入音频"
                  onCancel={()=>{this.setState({musicVisible:false})}}
                  maskClosable={false}
                  footer={null}
                  width={600}
                >
                  <InsertMusic getMusicUrl ={this.insertMusic}/>
                </Modal>
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
                  <ThumbUpload upload={(value) => {this.getUploadUrl(value)}} cake="上传图片" cropRate=""/>
                </Modal>

                {/*插入专栏*/}
                <Modal
                  visible={this.state.visible}
                  wrapClassName="vertical-center-modal"
                  title="请选择要插入的专栏"
                  onCancel={this.cancelColumn}
                  maskClosable={false}
                  width={600}
                  footer={null}
                >
                  <InsertArticleColum getValue={this.getColumValue} value="请上传用于展示的图片，支持jpg、png、bmp" dataClean={{search:'',upload:''}}/>
                </Modal>

                {/*插入实物商品*/}
                <Modal
                  visible={this.state.goodVisible}
                  wrapClassName="vertical-center-modal"
                  title="请选择要插入的实物商品"
                  onCancel={this.cancelInsertGoods}
                  maskClosable={false}
                  width={600}
                  footer={null}
                >
                  <InsertArticleGoods getValue={this.getGoodsValue} dataClean={{search:'',upload:'',data:''}}/>
                </Modal>

                {/*插入电子书*/}
                <Modal
                  visible={this.state.bookVisible}
                  wrapClassName="vertical-center-modal"
                  title="请选择要插入的电子书"
                  onCancel={this.cancelInsertBook}
                  maskClosable={false}
                  width={600}
                  footer={null}
                >
                  <InsertArticleEbook getValue={this.getBookValue} dataClean={{search:'',upload:''}}/>
                </Modal>
              </div>
            </FormItem>
            <FormItem label="原文链接" {...formItemLayout} >
              {getFieldDecorator('SrcUrl', {
                rules: [{required: false, message: '请输入原文链接'}],
              })(
                <Input placeholder="http://"/>
              )}
            </FormItem>
            <FormItem label="标签" {...formItemLayout} >
              <div style={{border: '1px solid #d9d9d9', borderRadius: '4px'}} onClick={() => {
                this.setState({tagBox: true})
              }}>
                {tags && tags.map((tag, index) => {
                  const isLongTag = tag.length > 20;
                  const tagElem = (
                    <Tag key={tag} closable={true} afterClose={() => this.handleClose(tag)}>
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </Tag>
                  );
                  return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {inputVisible && (
                  <Input
                    ref={this.saveInputRef}
                    type="text"
                    size="small"
                    style={{width: 78}}
                    value={inputValue}
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputConfirm}
                    onPressEnter={this.handleInputConfirm}
                  />
                )}
                {!inputVisible &&
                <Button size="small" type="dashed" onClick={this.showInput} style={{color: '#bfbfbf'}}>添加标签</Button>}
              </div>
              {tagBox && <div style={{border: '1px solid #eee'}}>
                <div><Icon type="close" onClick={() => this.setState({tagBox: false})} style={{cursor: 'pointer', position: 'absolute', right: 0, margin: 6}}></Icon></div>
                <div style={{marginLeft: 2}}>最多可以添加5个标签</div>
                <div>
                  <div>
                    {Array.isArray(this.state.hotTag) && this.state.hotTag.map(tag => (
                      <CheckableTag
                        key={tag.Name}
                        checked={tags.indexOf(tag.Name) > -1}
                        onChange={checked => this.handleTag(tag.Name, checked)}
                      >
                        {tag.Name}
                      </CheckableTag>
                    ))}
                  </div>
                </div>
              </div>}
            </FormItem>
            <FormItem label="发布频道" {...formItemLayout} >
              {getFieldDecorator('chanel', {
                rules: [{required: true, message: '请选择发布频道'}],
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
                <Button type="primary" onClick={(e) => this.submitSave(e)} className="btn-cofirm">保存</Button> : null}
              <Button onClick={(e) => this.submitPublish(e)} className="publish-btn">发布</Button>
            </FormItem>
          </Form>
        </div>
        {/*/!*预览编辑页面*!/*/}
        {/*<div className="article-see">*/}

        {/*</div>*/}
      </div>
    );
  }
}

export default Form.create()(Editarticle);