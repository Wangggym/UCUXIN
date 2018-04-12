/**
 * Created by Yu Tian Xiong on 2017/12/22.
 * fileName:编辑宣传
 */
import React, {Component} from 'react';
import {Form, Input, Select, message, Button,Modal} from 'antd';
import PublishSet from '../../publicComponents/PublishSet';
import Api from '../../../api';
import ThumbUpload from '../../publicComponents/thumbload/ThumbUpload';
import HotTag from '../../publicComponents/hotTag/HotTag';
import PublishSetDate from '../../publicComponents/PublishSetDate';
import Registration from '../../publicComponents/registration/Registration'
import './propaganda.less';
import moment from 'moment';
import PublicFuc from '../../../basics/publicFuc';
import UE from 'UEditor';
import InsertVideo from '../../publicComponents/insertHtmlTemplate/insertVideo';
import InsertMusic from '../../publicComponents/insertHtmlTemplate/insertMusic';
import InsertArticleColum from '../../publicComponents/insertHtmlTemplate/insertArticleTemplate/insertArticleColum';
import InsertArticleGoods from '../../publicComponents/insertHtmlTemplate/insertArticleTemplate/insertArticleGoods';
import InsertArticleEbook from '../../publicComponents/insertHtmlTemplate/insertArticleTemplate/insertArticleEbook';

const FormItem = Form.Item;
const Option = Select.Option;

class Editpropaganda extends Component {

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

      channelList: [],
      tags: [],
      cover: '',
      RefResigsterFields: [],
    };
    this.editor = null;
  }
  componentWillMount() {
    const {id} = this.props;
    this.setState({id: `UE${id ? `-${id}` : ''}-${(new Date().getTime()).toString()}`})
  }
  componentDidMount() {
    this.getchannelList();
    if (this.props.match.params.id) {this.getPropagandaDetail();}
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
  }
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

  //获取频道列表
  getchannelList = () => {
    Api.Info.getChannelList().then(res => {
      if (res.Ret === 0) {
        this.setState({channelList: res.Data})
      } else {
        message.error(res.Msg);
      }
    })
  };

  //获取宣传详情
  getPropagandaDetail = () => {
    Api.Info.getPropagandaDetail({contentType: 14, contentID: this.props.match.params.id}).then(res => {
      if (res.Ret === 0) {
        let data = res.Data;
        let channels = [];
        let PublishTimer = {
          type:res.Data.PublishSendType,
          date:res.Data.PublishTimerDate,
        };
        if(res.Data.RefContents){
          let dataRefContents = res.Data.RefContents;
          this.setState({dataRefContents,RefContents:dataRefContents});
        }
        data.Channels.map(item => {
          channels.push({key: item.ID, label: item.Name});
        });
        let {setFieldsValue} = this.props.form;
        let PublishSetDate = {
          type:data.ValidType,
          ValidBeginDate:data.ValidBeginDate,
          ValidEndDate:data.ValidEndDate
        };
        //设置表单值
        setFieldsValue({
          title: data.Title,
          chanel: channels,
          PublishSetDate:PublishSetDate,
          PublishTimerDate:PublishTimer,
        });
        //非表单赋值
        this.setState({
          tags: data.Tags ? data.Tags : [],
          ID: data.ID,
          editStatus: data.Status,
          RefResigsterFields: data.RefResigsterFields,
          cover: data.Thumbs[0],
          htmlContent:res.Data.Content,
          dataRefContents:res.Data.RefContents ? res.Data.RefContents : [],
        });
        const {id} = this.state;
        this.editor = UE.getEditor(id);
        this.editor.ready(() => {
          // 初始化时设置默认值
          data.Content && this.editor.setContent(res.Data.Content)
        })
      }
    })
  };

  //ThumbUpload组件 接收子组件 传过来的图片路径
  getUploadUrl = (value) => {
    this.setState({cover: value})
  };
  //Registration 组件传的登记列表值
  getRegistration = (value) => {
    this.setState({RefResigsterFields: value});
  };
  //HotTag 组件  子组件传过来的tag数组
  getHotTag = (value) => {
    if (value.length > 5) value.splice(0, 1);
    this.setState({tags: value});
  };

  //操作表单  保存宣传 发布宣传
  savePropaganda = (e) => {
    e.preventDefault();
    let state = this.state;
    const ueEditor = UE.getEditor(state.id);
    let htmlContent = ueEditor.getContent();//获取百度编辑器里的html字符串
    let summary = PublicFuc.changeString(htmlContent);
    let thumb = [state.cover].filter(i => i);
    if (thumb.length === 0) {message.info('请上传封面');return}
    if(htmlContent || htmlContent === ''){
      let data = this.state.dataRefContents;
      data.map((item,index)=>{
        if(new RegExp(this.handleTitle(item.Title)).test(htmlContent)){
          this.setState({dataRefContents:data})
        }else {
          data.splice(index,1);
          this.setState({dataRefContents:data})
        }
      });
    }
    this.props.form.validateFields((err, values) => {
      let chanels = [];
      values.chanel && values.chanel.map((item) => {
        chanels.push({ID: item.key, Name: item.label})
      });
      if (values.PublishSetDate.ValidBeginDate && values.PublishSetDate.ValidEndDate) {
        let startValue = new Date(moment(values.PublishSetDate.ValidBeginDate)).getTime();
        let endValue = new Date(moment(values.PublishSetDate.ValidEndDate)).getTime();
        if (startValue > endValue) {
          message.info('开始时间不能小于结束时间');
        }
      }
      if (!err) {
        let body = {
          ID: this.state.ID ? this.state.ID : 0,
          ContentType: 14,
          Status: 0,//草稿
          Title: values.title,
          Thumbs: thumb,
          Tags: state.tags ? state.tags : '',
          Summary: summary,
          Content: htmlContent,//资讯内容
          Channels: chanels,
          PublishSendType: values.PublishTimerDate.type ? 1 : 0,//内容发布类型,
          PublishTimerDate: values.PublishTimerDate.type === 0 ? '' : moment(values.PublishTimerDate.date).format('YYYY-MM-DD HH:mm:ss'),
          ValidType: values.PublishSetDate.type ? 1 : 0,
          ValidBeginDate: values.PublishSetDate.type === 0 ? '' : moment(values.PublishSetDate.ValidBeginDate).format('YYYY-MM-DD HH:mm:ss'),
          ValidEndDate: values.PublishSetDate.type === 0 ? '' : moment(values.PublishSetDate.ValidEndDate).format('YYYY-MM-DD HH:mm:ss'),
          RefContents: this.state.dataRefContents,//关联内容
          RefResigsterFields: state.RefResigsterFields ? state.RefResigsterFields : [],
        };
        Api.Info.savePropaganda({body}).then(res => {
          if (res.Ret === 0) {
            this.setState({ID: res.Data.ID});
            message.success('保存宣传成功');
          }else{
            message.error(res.Msg)
          }
        })
      }
    });
  };
  //发布宣传
  publishPropaganda = (e) => {
    e.preventDefault();
    let state = this.state;
    const ueEditor = UE.getEditor(state.id);
    let htmlContent = ueEditor.getContent();//获取百度编辑器里的html字符串
    let summary = PublicFuc.changeString(htmlContent);
    let thumb = [state.cover].filter(i => i);
    if (thumb.length === 0) {message.info('请上传封面');return}
    if(state.htmlContent || state.htmlContent === ''){
      let data = this.state.dataRefContents;
      data.map((item,index)=>{
        if(new RegExp(this.handleTitle(item.Title)).test(htmlContent)){
          this.setState({dataRefContents:data})
        }else {
          data.splice(index,1);
          this.setState({dataRefContents:data})
        }
      });
    }
    this.props.form.validateFields((err, values) => {
      let chanels = [];
      values.chanel && values.chanel.map((item) => {
        chanels.push({ID: item.key, Name: item.label})
      });
      if (values.PublishSetDate.ValidBeginDate && values.PublishSetDate.ValidEndDate) {
        let startValue = new Date(moment(values.PublishSetDate.ValidBeginDate)).getTime();
        let endValue = new Date(moment(values.PublishSetDate.ValidEndDate)).getTime();
        if (startValue > endValue) {
          message.info('开始时间不能小于结束时间');
        }
      }
      if (!err) {
        let body = {
          ID: this.state.ID ? this.state.ID : 0,
          ContentType: 14,
          Status: 0,//草稿
          Title: values.title,
          Thumbs: thumb,
          Tags: state.tags ? state.tags : '',
          Summary: summary,
          Content: htmlContent,//资讯内容
          Channels: chanels,
          PublishSendType: values.PublishTimerDate.type ? 1 : 0,//内容发布类型,
          PublishTimerDate: values.PublishTimerDate.type === 0 ? '' : moment(values.PublishTimerDate.date).format('YYYY-MM-DD HH:mm:ss'),
          ValidType: values.PublishSetDate.type ? 1 : 0,
          ValidBeginDate: values.PublishSetDate.type === 0 ? '' : moment(values.PublishSetDate.ValidBeginDate).format('YYYY-MM-DD HH:mm:ss'),
          ValidEndDate: values.PublishSetDate.type === 0 ? '' : moment(values.PublishSetDate.ValidEndDate).format('YYYY-MM-DD HH:mm:ss'),
          RefContents:this.state.dataRefContents,//关联内容
          RefResigsterFields: state.RefResigsterFields ? state.RefResigsterFields : [],
        };
        Api.Info.publishPropaganda({body}).then(res => {
          if (res.Ret === 0) {
            this.props.history.push('/news');
          }else{
            message.error(res.Msg)
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
  //有效期时间验证
  checkPublishSetDate = (rule, value, callback) => {
    if (value && value.type === 1) {
      if (value.ValidBeginDate && value.ValidEndDate) {
        callback();
        return false;
      } else {
        callback('请选择开始和结束时间！');
        return false;
      }
    }
    if (value && value.type === 0) {
      callback();
      return false;
    }
    callback('请选择有效期！');
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
      var dom = ueEditor.selection.getStart();
      this.action(dom)
    })
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
  action = (dom) =>{
    dom.onclick=function(){
      if(dom.className==='goodOff'){
        this.parentNode.parentNode.parentNode.parentNode.remove()
      }
    };
    dom.onclick()
  };

  //插入图片
  getIconUrl = (value) => this.setState({Icon: value});
  insertIcon = () => {
    if(this.state.Icon){
      this.state.Icon && this.state.btnOne.onclick(`<img src='${this.state.Icon}' style='width:100%' />`);
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
    const {channelList, tags, editStatus,id} = this.state;
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
      <div className="propagandaEdit">
        {/*左侧编辑表单*/}
        <div className="propaganda-left">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem {...formItemLayout} label="宣传标题" style={{marginTop: '20px'}}>
              {getFieldDecorator('title', {
                rules: [{required: true, message: '请输入宣传标题'}],
              })(
                <Input placeholder="点击输入宣传标题" disabled={editStatus === 8 ? true : editStatus === 9 ? true : false} maxLength="30"/>
              )}
            </FormItem>
            <FormItem label="封面" {...formItemLayout} >
              <span style={{position: 'relative', right: '46px', fontSize: 12, color: '#f04134', fontFamily: 'SimSun'}}>*</span>
              <ThumbUpload upload={(value) => {
                this.getUploadUrl(value)
              }} cover={this.state.cover} cropRate="3:2" size={true}/>
            </FormItem>
            <FormItem label='内容' {...formItemLayout}>
              {/*<span style={{position: 'relative', right: '46px', fontSize: 12, color: '#f04134', fontFamily: 'SimSun'}}>*</span>*/}
              <div>
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
                  <ThumbUpload upload={(value) => {this.getIconUrl(value)}} cake="上传图片" cropRate="" size={false}/>
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
            <FormItem label="登记表" {...formItemLayout}>
              <Registration getRegistration={this.getRegistration} RefResigsterFields={this.state.RefResigsterFields}/>
            </FormItem>
            <FormItem label="标签" {...formItemLayout}>
              <HotTag tag={(value) => {
                this.getHotTag(value)
              }} tags={tags}/>
            </FormItem>
            <FormItem label="有效期" {...formItemLayout} >
              {getFieldDecorator('PublishSetDate', {
                rules: [{required: true, validator: this.checkPublishSetDate}],
                initialValue: {type: 0, ValidBeginDate: null, ValidEndDate: null}
              })(
                <PublishSetDate/>
              )}
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
                  {Array.isArray(channelList) && channelList.map(item => <Option value={item.ID} key={item.ID}>{item.Name}</Option>)}
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
              {editStatus !== 5 && editStatus !== 8 ? <Button type="primary" onClick={(e) => this.savePropaganda(e)}
                                                              style={{marginRight: 10, marginBottom: 100}}
                                                              className="btn-cofirm">保存</Button> : null}
              <Button onClick={(e) => this.publishPropaganda(e)} className="publish-btn"
                      style={{marginBottom: 100}}>发布</Button>
            </FormItem>
          </Form>
        </div>
        {/*预览编辑页面*/}
        {/*<div className="propaganda-see">*/}

        {/*</div>*/}
      </div>
    );
  }
}

export default Form.create()(Editpropaganda);