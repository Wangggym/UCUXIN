/**
 * Created by Yu Tian Xiong on 2017/1/29.
 * fileName:内容库专栏小集编辑
 */
import React, { Component } from 'react';
import {Form,Input,Button,Select,message,Modal} from 'antd';
import ThumbUpload from '../../../publicComponents/thumbload/ThumbUpload';
import HotTag from '../../../publicComponents/hotTag/HotTag';
import PublishSet from '../../../publicComponents/PublishSet';
import './editSmallColum.less';
import Api from '../../../../api';
import './Check';
import Check from "./Check";
import moment from 'moment';
import UE from 'UEditor';
import PublicFuc from '../../../../basics/publicFuc';
import InsertVideo from '../../../publicComponents/insertHtmlTemplate/insertVideo';
import InsertMusic from '../../../publicComponents/insertHtmlTemplate/insertMusic';

 const FormItem = Form.Item;
 const Option = Select.Option;

 class EditSmallColum extends Component{

   constructor(props) {
     super(props);
     this.state = {
       iconVisible:false,
       musicVisible:false,
       videoVisible:false,
       cover:'',
       tags:[],
       speakerList:[],
     };
     this.editor = null;
   }

   componentDidMount() {
     if(this.props.match.params.id){this.getSmallDetail();}
     this.getSpeaker();
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

  //获取主讲人
   getSpeaker = () =>{
     Api.Content.getSpeaker().then(res=>{
       if(res.Ret===0){
         this.setState({speakerList:res.Data});
       }
     })
   };

   //获取专栏小集详情
   getSmallDetail = () =>{
     Api.Content.getSmallDetail({contentID:this.props.match.params.id}).then(res=>{
       if(res.Ret===0){
         let data = res.Data;
         let speaker = {key:data.MemberUID.toString(),label:data.Author};
         let PublishTimer = {
           type:res.Data.PublishSendType,
           date:res.Data.PublishTimerDate,
         };
         let { setFieldsValue } = this.props.form;
         //设置表单值
         setFieldsValue({
           title:data.Title,
           number:data.ItemNo,
           speaker:speaker,
           read:data.IsFree,
           PublishTimerDate:PublishTimer,
         });
         //非表单赋值
         this.setState({
           tags:data.Tags ? data.Tags : [],
           ID:data.ID,
           editStatus:res.Data.Status,
           cover:data.Thumbs && data.Thumbs[0],
           htmlContent:data.Content,
         });
         const {id} = this.state;
         this.editor = UE.getEditor(id);
         this.editor.ready(() => {
           // 初始化时设置默认值
           data.Content && this.editor.setContent(data.Content)
         })
       }
     })
   };

   //保存专栏小集
   saveSmallColum = (e) =>{
     e.preventDefault();
     const state = this.state;
     const ueEditor = UE.getEditor(state.id);
     let htmlContent = ueEditor.getContent();//获取百度编辑器里的html字符串
     let thumb = [state.cover].filter(i => i);
     if (thumb.length === 0) {message.info('请上传封面');return;}
     if (htmlContent === '') {message.info('请编辑内容');return;}
     this.props.form.validateFields((err, values) => {
       if (!err) {
         let body = {
           ID: this.state.ID ? this.state.ID : 0,//主键id
           ContentType: 22,//专栏小集
           Status: 0,//草稿
           ScolumnID:sessionStorage.getItem('key'),//所属专栏
           ItemNo:values.number,//小集集数
           Title:values.title,//专栏小集标题
           Thumbs:thumb,
           Tags:state.tags ? state.tags : '',//标签数组
           Author:values.speaker.label,//主讲人
           MemberUID:+values.speaker.key,
           Summary:'',
           Content:htmlContent,//内容
           IsFree:values.read,
           PublishSendType:values.PublishTimerDate.type ? 1 : 0,//内容发布类型
           PublishTimerDate:values.PublishTimerDate.type === 0 ? '' : moment(values.PublishTimerDate.date).format('YYYY-MM-DD HH:mm:ss'),
           PublishDesc:'',
           MTypeIDs:[],
           RegionRangeType:'',
           Regions:[],
           PhaseRangeType:'',
           PhaseIDs:[],
         };
         Api.Content.saveSmallColum({body}).then(res=>{
           if(res.Ret===0){
             this.setState({ID:res.Data.ID});
             message.success('保存专栏小集成功');
           }else{
             message.error(res.Msg)
           }
         })

       }
     });

   };
   //发布专栏小集
   publishSmallColum = (e) =>{
     e.preventDefault();
     const state = this.state;
     const ueEditor = UE.getEditor(state.id);
     let htmlContent = ueEditor.getContent();//获取百度编辑器里的html字符串
     let thumb = [state.cover].filter(i => i);
     if (thumb.length === 0) {message.info('请上传封面');return;}
     if (htmlContent === '') {message.info('请编辑内容');return;}
     this.props.form.validateFields((err, values) => {
       if (!err) {
         let body = {
           ID: this.state.ID ? this.state.ID : 0,//主键id
           ContentType: 22,//专栏小集
           Status: 0,//草稿
           ScolumnID:sessionStorage.getItem('key'),//所属专栏
           ItemNo:values.number,//小集集数
           Title:values.title,//专栏小集标题
           Thumbs:thumb,
           Tags:state.tags ? state.tags : '',//标签数组
           Author:values.speaker.label,//主讲人
           MemberUID:+values.speaker.key,
           Summary:'',
           Content:htmlContent,//内容
           IsFree:values.read,
           PublishSendType:values.PublishTimerDate.type ? 1 : 0,//内容发布类型
           PublishTimerDate:values.PublishTimerDate.type === 0 ? '' : moment(values.PublishTimerDate.date).format('YYYY-MM-DD HH:mm:ss'),
           PublishDesc:'',
           MTypeIDs:[],
           RegionRangeType:'',
           Regions:[],
           PhaseRangeType:'',
           PhaseIDs:[],
         };
         Api.Content.publsihSmallColum({body}).then(res=>{
           if(res.Ret===0){
             this.props.history.push('/contents/scolumn/smallscolumn');
           }else{
             message.error(res.Msg);
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
     if(this.state.cover){
       this.state.cover && this.state.btnOne.onclick(`<img src='${this.state.Icon}' style='width:100%' />`);
     }else {
       message.info('请选择要插入的图片')
     }
   };
  render(){
    const {tags,speakerList,editStatus,id} = this.state;
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
    const { getFieldDecorator } = this.props.form;
    return(
      <div>
        <div className="smallColumEdit">
        {/*左侧编辑表单*/}
        <div className="smallColumEdit-left">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem {...formItemLayout} label="集数" style={{marginTop:'20px'}}>
              {getFieldDecorator('number', {
                rules: [{ required: false, message: '请输入小集集数' }],
              })(
                <Input placeholder="点击输入小集集数"
                       type="number"
                  disabled={editStatus!==undefined ? true : false}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="小集标题">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入小集标题' }],
              })(
                <Input placeholder="点击输入小集标题" disabled={editStatus!==undefined ? true : false} maxLength="30"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="主讲人">
              {getFieldDecorator('speaker', {
                rules: [{ required: true, message: '选择主讲人' }],
              })(
                <Select
                  placeholder="请选择主讲人"
                  labelInValue = {true}
                >
                  {Array.isArray(speakerList) && speakerList.map((item,i)=> <Option value={item.UID} key={i}>{item.Name}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem label="封面" {...formItemLayout} >
              <span style={{position:'relative',right:'46px',fontSize:12,color:'#f04134',fontFamily: 'SimSun'}}>*</span>
              <ThumbUpload upload={(value)=>{this.getUploadUrl(value)}} cover={this.state.cover} cropRate="3:2" size={true}/>
            </FormItem>
            <FormItem label="试读" {...formItemLayout} >
              {getFieldDecorator('read', {
                rules: [{ required: false, message: '是否试读' }],
              })(
                <Check/>
              )}
            </FormItem>
            <FormItem label='内容' {...formItemLayout}>
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
                <ThumbUpload upload={(value) => {this.getIconUrl(value)}} cake="上传图片" cropRate="" size={false}/>
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
            <FormItem label="标签" {...formItemLayout} >
              <HotTag tag={(value)=>{this.getHotTag(value)}} tags={tags}/>
            </FormItem>
            <FormItem label="发布时间" {...formItemLayout} >
              {getFieldDecorator('PublishTimerDate', {
                rules: [{required: true, validator: this.checkPublishSet}],
                initialValue: {type: 0, date: null}
              })(
                <PublishSet
                  //disabled={ editStatus=== 8 ? true : false}
                />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              { editStatus !== 5 &&  editStatus !== 8 ?<Button type="primary" onClick={(e) => this.saveSmallColum(e)} style={{marginRight:10,marginBottom:100}} className="btn-cofirm">保存</Button>:null}
              <Button className="publish-btn" onClick={(e)=>this.publishSmallColum(e)}>发布</Button>
            </FormItem>
          </Form>
        </div>
        {/*预览编辑页面*/}
        {/*<div className="smallColumEdit-see">*/}

        {/*</div>*/}
      </div>
      </div>
    )
  }
}

export default Form.create()(EditSmallColum);