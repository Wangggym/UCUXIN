/**
 * Created by Yu Tian Xiong on 2017/1/24.
 * fileName:内容库专栏编辑
 */
import React, {Component} from 'react';
import {Form, Input, Select, Button, message,Modal} from 'antd';
import ThumbUpload from '../../publicComponents/thumbload/ThumbUpload';
import HotTag from "../../publicComponents/hotTag/HotTag";
import PublishSet from '../../publicComponents/PublishSet';
import UpdateWay from '../../publicComponents/updateWay/UpdateWay';
import Directory from '../../publicComponents/directory/Directory';
import PublishRange from '../../publicComponents/publishRange/PublishRange';
import Api from '../../../api';
import moment from 'moment';
import './scolumn.less';
import UE from 'UEditor';
import PublicFuc from '../../../basics/publicFuc';
import InsertVideo from '../../publicComponents/insertHtmlTemplate/insertVideo';
import InsertMusic from '../../publicComponents/insertHtmlTemplate/insertMusic';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class EditScolumn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:null,
      iconVisible:false,
      musicVisible:false,
      videoVisible:false,
      channelList: [],
      cover: '',
      tags: [],//标签数组
      RefContents:[]
    };
    this.editor = null;
  }
  componentWillMount() {
    const {id} = this.props;
    this.setState({id: `UE${id ? `-${id}` : ''}-${(new Date().getTime()).toString()}`})
  }

  componentDidMount() {
    if (this.props.match.params.id) {this.getScolumnDetail();}
    this.getChannelList();
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
  componentWillUnmount() {
    // 组件卸载后，清除放入库的id
    UE.delEditor(this.state.id);
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
  //ThumbUpload子组件传过来的图片路径
  getUploadUrl = (value) => this.setState({cover: value});
  //HotTag子组件传过来的tag数组
  getHotTag = (value) => {
    if (value.length > 5) value.splice(0, 1);
    this.setState({tags: value});
  };
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
  //获取专栏详情
  getScolumnDetail = () => {
    Api.Content.getScolumnDetail({contentID: this.props.match.params.id}).then(res => {
      if (res.Ret === 0) {
        let data = res.Data;
        let channels = [];
        let PublishTimer = {
          type:res.Data.PublishSendType,
          date:res.Data.PublishTimerDate,
        };
        //更新方式数据回填进表单
        let updateDetail = {updateType:data.UpdateType,updateFreq:data.UpdateFreq,updateWeek:data.UpdateWeek,updateDay1:data.UpdateDay1,updateDay2:data.UpdateDay2};
        //发布范围数据回填进表单
        let PublishRange = {
          MTypeRangeType:data.MTypeRangeType,
          MTypeIDs:data.MTypeIDs,
          RegionRangeType:data.RegionRangeType,
          Regions:data.Regions,
          PhaseRangeType:data.PhaseRangeType,
          PhaseIDs:data.PhaseIDs,
        };
        data.Channels.map(item => {channels.push({key: item.ID, label: item.Name});});
        let {setFieldsValue} = this.props.form;
        //设置表单值
        setFieldsValue({
          title: data.Title,
          chanel: channels,
          price: data.SalePrice,
          summary: data.Summary,
          Directories:data.Directories,
          update:updateDetail,
          publishRange:PublishRange,
          PublishTimerDate:PublishTimer,
          publishDesc:data.PublishDesc,
        });
        //非表单赋值
        this.setState({
          tags: data.Tags ? data.Tags : [],
          ID: data.ID,
          editStatus: res.Data.Status,
          cover: data.Thumbs[0],
          Directories: data.Directories,
        });
        const {id} = this.state;
        this.editor = UE.getEditor(id);
        this.editor.ready(() => {
          // 初始化时设置默认值
          data.BuyDesc && this.editor.setContent(data.BuyDesc)
        })
      }
    })
  };
  //保存专栏
  saveScolumn = (e) => {
    e.preventDefault();
    const state = this.state;
    const ueEditor = UE.getEditor(state.id);
    let htmlContent = ueEditor.getContent();//获取百度编辑器里的html字符串
    let thumb = [state.cover].filter(i => i);
    if (thumb.length === 0) {message.info('请上传封面');return}
    if (htmlContent === '') {message.info('请编辑订购须知');return;}
    this.props.form.validateFields((err, values) => {
      let chanels = [];//频道
      let directories = [];
      values.chanel && values.chanel.map((item) => {
        chanels.push({ID: item.key, Name: item.label})
      });
      values.Directories && values.Directories.map(item => {
        directories.push({...item, Status: 0})
      });
      if (!err) {
        let body = {
          ID: this.state.ID ? this.state.ID : 0,//主键id
          ContentType: 21,//专栏
          Status: 0,//草稿
          Title: values.title,//专栏标题
          Thumbs: thumb,//封面
          Tags: state.tags ? state.tags : '',//标签数组
          Channels: chanels,//频道
          Summary: values.summary,//专栏摘要
          BuyDesc: htmlContent,//订购须知
          QtyItems: values.Directories && values.Directories.length,//小集数
          UpdateType: values.update.updateType,//更新方式
          UpdateFreq: (values.update.updateType === 1 && values.update.updateFreq) ? values.update.updateFreq : values.update.updateFreq === 0 ? 0 : '',//更新频率
          UpdateWeek: ((values.update.updateType === 1 && values.update.updateFreq === 1) && values.update.updateWeek) ? values.update.updateWeek : values.update.updateWeek === 0 ? 0 : '',//更新周次
          UpdateDay1: (((values.update.updateType === 1 && values.update.updateFreq === 2) || (values.update.updateType === 1 && values.update.updateFreq === 3)) && values.update.updateDay1) ? values.update.updateDay1 : '',//更新日期1
          UpdateDay2: ((values.update.updateType === 1 && values.update.updateFreq === 2) && values.update.updateDay2) ? values.update.updateDay2 : '',//更新日期2
          PublishSendType: values.PublishTimerDate.type ? 1 : 0,//发布时间类型,
          PublishTimerDate: values.PublishTimerDate.type === 0 ? '' : moment(values.PublishTimerDate.date).format('YYYY-MM-DD HH:mm:ss'),
          PublishDesc: values.publishDesc,//发布描述
          SalePrice: values.price,//售价
          Directories: values.Directories,//专栏小集目录
          MTypeRangeType: values.publishRange.MTypeRangeType,//角色范围
          MTypeIDs: values.publishRange.MTypeIDs,//角色
          RegionRangeType: values.publishRange.RegionRangeType,//区域范围
          Regions: values.publishRange.Regions,//区域
          PhaseRangeType:values.publishRange.PhaseRangeType,//学段范围
          PhaseIDs: values.publishRange.PhaseIDs//学段
        };
        Api.Content.saveScolumn({body}).then(res => {
          if (res.Ret === 0) {
            this.setState({ID: res.Data.ID});
            message.success('保存专栏成功');
          }else{
            message.error(res.Msg)
          }
        })
      }
    });

  };
  //发布专栏
  publishScolumn = (e) => {
    e.preventDefault();
    const state = this.state;
    const ueEditor = UE.getEditor(state.id);
    let htmlContent = ueEditor.getContent();//获取百度编辑器里的html字符串
    let thumb = [state.cover].filter(i => i);
    if (thumb.length === 0) {message.info('请上传封面');return}
    if (this.state.htmlContent === '') {message.info('请编辑订购须知');return;}
    this.props.form.validateFields((err, values) => {
      let chanels = [];//频道
      let directories = [];
      values.chanel && values.chanel.map((item) => {
        chanels.push({ID: item.key, Name: item.label})
      });
      values.Directories && values.Directories.map(item => {
        directories.push({...item, Status: 0})
      });
      if (!err) {
        let body = {
          ID: this.state.ID ? this.state.ID : 0,//主键id
          ContentType: 21,//专栏
          Status: 0,//草稿
          Title: values.title,//专栏标题
          Thumbs: thumb,//封面
          Tags: state.tags ? state.tags : '',//标签数组
          Channels: chanels,//频道
          Summary: values.summary,//专栏摘要
          BuyDesc: htmlContent,//订购须知
          QtyItems: values.Directories && values.Directories.length,//小集数
          UpdateType: values.update.updateType,//更新方式
          UpdateFreq: (values.update.updateType === 1 && values.update.updateFreq) ? values.update.updateFreq : values.update.updateFreq === 0 ? 0 : '',//更新频率
          UpdateWeek: ((values.update.updateType === 1 && values.update.updateFreq === 1) && values.update.updateWeek) ? values.update.updateWeek : values.update.updateWeek === 0 ? 0 : '',//更新周次
          UpdateDay1: (((values.update.updateType === 1 && values.update.updateFreq === 2) || (values.update.updateType === 1 && values.update.updateFreq === 3)) && values.update.updateDay1) ? values.update.updateDay1 : '',//更新日期1
          UpdateDay2: ((values.update.updateType === 1 && values.update.updateFreq === 2) && values.update.updateDay2) ? values.update.updateDay2 : '',//更新日期2
          PublishSendType: values.PublishTimerDate.type ? 1 : 0,//发布时间类型,
          PublishTimerDate: values.PublishTimerDate.type === 0 ? '' : moment(values.PublishTimerDate.date).format('YYYY-MM-DD HH:mm:ss'),
          PublishDesc: values.publishDesc,//发布描述
          SalePrice: values.price,//售价
          Directories: values.Directories,//专栏小集目录
          MTypeRangeType: values.publishRange.MTypeRangeType,//角色范围
          MTypeIDs: values.publishRange.MTypeIDs,//角色
          RegionRangeType: values.publishRange.RegionRangeType,//区域范围
          Regions: values.publishRange.Regions,//区域
          PhaseRangeType:values.publishRange.PhaseRangeType,//学段范围
          PhaseIDs: values.publishRange.PhaseIDs//学段
        };
        Api.Content.publishScolumn({body}).then(res => {
          if (res.Ret === 0) {
            this.props.history.push('/contents/scolumn');
            message.success('发布专栏成功');
          }else{
            message.error(res.Msg)
          }
        })
      }
    });
  };
  //验证发布设置
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
  //验证目录
  checkDirectory = (rule, value, callback) => {
    if (value) {
      callback();
    }
    callback('请添加目录');
  };
  //验证更新方式
  checkUpdateWay = (rule, value, callback) => {
    if (value && value.updateType === 0) {
      callback();
      return;
    }
    if (value && value.updateType === 2) {
      callback();
      return;
    }
    if (value && value.updateType === 1) {
      if (value.updateFreq !== null) {
        if (value.updateFreq === 0) {
          callback();
          return;
        }
        if (value.updateFreq === 1) {
          if (value.updateWeek !== null) {
            callback();
            return;
          } else {
            callback('请选择更新日期');
            return;
          }
          callback();
          return;
        }
        if (value.updateFreq === 2) {
          if (value.updateDay1 !== null && value.updateDay2 !== null) {
            callback();
            return;
          } else {
            callback('请选择更新日期');
            return;
          }
          callback();
          return;
        }
        if (value.updateFreq === 3) {
          if (value.updateDay1 !== null) {
            callback();
            return;
          } else {
            callback('请选择更新日期');
            return;
          }
          callback();
          return;
        }
      } else {
        callback('请选择更新频率');
        return;
      }
    }
    callback('请选择更新方式');
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
      this.state.cover && this.state.btnOne.onclick(`<img src='${this.state.Icon}' style='width:100%'/>`);
    }else {
      message.info('请选择要插入的图片')
    }
  };
  //操作频道数
  handleChange = (value) => {
    let {setFieldsValue} = this.props.form;
    if (value.length > 2) {
      value.splice(0, 1);
      setFieldsValue({chanel: value});
    }
  };


  render() {
    const {channelList, editStatus,id} = this.state;
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
      <div>
        <div className="editScolumn">
          {/*左侧编辑表单*/}
          <div className="scolumn-left">
            <Form className="login-form">
              <FormItem {...formItemLayout} label="专栏标题" style={{marginTop: '20px'}}>
                {getFieldDecorator('title', {
                  rules: [{required: true, message: '请输入专栏标题'}],
                })(
                  <Input placeholder="点击输入专栏标题" disabled={editStatus === 8 ? true : editStatus === 9 ? true : false} maxLength="30"/>
                )}
              </FormItem>
              <FormItem label="封面" {...formItemLayout} >
                <span style={{
                  position: 'relative',
                  right: '46px',
                  fontSize: 12,
                  color: '#f04134',
                  fontFamily: 'SimSun'
                }}>*</span>
                <ThumbUpload upload={(value) => {
                  this.getUploadUrl(value)
                }} cover={this.state.cover} cropRate="3:2" size={true}/>
              </FormItem>
              <FormItem {...formItemLayout} label="专栏摘要">
                {getFieldDecorator('summary', {
                  rules: [{required: true, message: '请输入专栏摘要'}],
                })(
                  <TextArea autosize={{minRows: 4, maxRows: 6}} maxLength="100"/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="更新方式">
                {getFieldDecorator('update', {
                  rules: [{required: true, validator: this.checkUpdateWay}],
                  initialValue: {updateType: 0, updateFreq: null, updateWeek: null, updateDay1: null, updateDay2: null}
                })(
                  <UpdateWay disabled={editStatus === 8 ? true : false}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="价格">
                {getFieldDecorator('price', {
                  rules: [{required: true, message: '请输入专栏价格'}],
                })(
                  <Input placeholder="点击输入专栏价格" type="number" disabled={editStatus === 8 ? true : false}/>
                )}
              </FormItem>
              <FormItem label='订购须知' {...formItemLayout}>
                <span style={{position: 'relative', right: '68px', fontSize: 12, color: '#f04134', fontFamily: 'SimSun'}}>*</span>
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
              <FormItem label='目录' {...formItemLayout}>
                {getFieldDecorator('Directories', {
                  rules: [{required: true, validator: this.checkDirectory},],
                })(<Directory Directories={this.state.Directories} disabled={editStatus === 8 ? true : false}/>)}
              </FormItem>
              <FormItem label="标签" {...formItemLayout} >
                <HotTag tag={(value) => {
                  this.getHotTag(value)
                }}/>
              </FormItem>
              <FormItem label="发布时间" {...formItemLayout} >
                {getFieldDecorator('PublishTimerDate', {
                  rules: [{required: true, validator: this.checkPublishSet}],
                  initialValue: {type: 0, date: null}
                })(
                  <PublishSet disabled={editStatus === 8 ? true : false}/>
                )}
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
                    {Array.isArray(channelList) && channelList.map(item => <Option value={item.ID} key={item.ID}>{item.Name}</Option>)}
                  </Select>
                )}
              </FormItem>
              <FormItem label='发布描述' {...formItemLayout}>
                {getFieldDecorator('publishDesc', {
                  rules: [{required: false, message: '请输入发布描述'}],
                })(
                  <TextArea autosize={{minRows: 2, maxRows: 4}}/>
                )}
              </FormItem>
              <FormItem label='发布范围' {...formItemLayout} className="publish-range">
                {getFieldDecorator('publishRange', {
                  rules: [{required: false, message: '请输入发布范围'}],
                  initialValue:{MTypeRangeType:0,MTypeIDs:null,RegionRangeType:0,Regions:null,PhaseRangeType:0,PhaseIDs:null},
                })(
                <PublishRange disabled={editStatus === 8 ? true : false}/>
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                {editStatus !== 5 && editStatus !== 8 ? <Button type="primary" onClick={(e) => this.saveScolumn(e)} style={{marginRight: 10, marginBottom: 100}} className="btn-cofirm">保存</Button> : null}
                <Button className="publish-btn" onClick={(e) => this.publishScolumn(e)}>发布</Button>
              </FormItem>
            </Form>
          </div>
          {/*预览编辑页面*/}
          {/*<div className="scolumn-see">*/}

          {/*</div>*/}
        </div>
      </div>
    )
  }
}

export default Form.create()(EditScolumn);
