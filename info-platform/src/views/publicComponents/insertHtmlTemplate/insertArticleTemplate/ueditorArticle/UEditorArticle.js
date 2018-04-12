/**
 * Created by Yu Tian Xiong on 2017/12/11.
 */
import React, {Component} from 'react';
import UE from 'UEditor';
import PropTypes from 'prop-types';
import {Modal,message,Button} from 'antd';
import InsertArticleColum from '../insertArticleColum';
import InsertArticleGoods from '../insertArticleGoods';
import InsertArticleEbook from '../insertArticleEbook';
import ThumbUpload from '../../../thumbload/ThumbUpload';
import './ueditorArticle.less';
import PublicFuc from '../../../../../basics/publicFuc';
import InsertMusic from '../../insertMusic';
import InsertVideo from '../../insertVideo';

class UEditorArticle extends Component {
  static propTypes = {
    width: PropTypes.string,
    id: PropTypes.string,
    config: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.string
  };
  static defaultProps = {
    id: undefined,
    config: {},
    onChange(){},
    value: undefined
  };

  constructor(props) {
    super(props);
    this.state = {
      data:null,
      visible:false,
      goodVisible:false,
      bookVisible:false,
      iconVisible:false,
      btnOne:null,//插入图片
      btnTwo:null,//插入音频
      btnThree:null,//插入视频
      musicVisible:false,
      videoVisible:false,
      dataRefContents:[],
    };
    this.editor = null;
  }
  //回填百度编辑器数据
  componentWillReceiveProps(nextProps) {
    if(nextProps.htmlContent && nextProps.htmlContent !== this.props.htmlContent){
     this.setState({contentHtml:nextProps.htmlContent},()=>{
       const {id} = this.state;
       this.editor = UE.getEditor(id);
       this.editor.ready(() => {
         // 初始化时设置默认值
         this.editor.setContent(this.state.contentHtml)
       })
     })
    }
  }

  componentWillMount() {
    const {id} = this.props;
    this.setState({id: `UE${id ? `-${id}` : ''}-${(new Date().getTime()).toString()}`})
  }
  componentDidMount() {
    //实例化编辑器
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
      //当值改变时将值返回
      ueEditor.addListener('contentChange', () => {
        onChange(ueEditor.getContent());
      });
      // 初始化时设置默认值
      value && ueEditor.setContent(value)

    })
  };

  //插入专栏
  insertColumn = () => {
    this.setState({visible:true});
  };
  cancelColumn = () => this.setState({visible:false});
  getColumValue = (value,data) => {
    const {dataRefContents,id} = this.state;
    const ueEditor = UE.getEditor(id);
    data && dataRefContents.push(data);
    this.setState({visible:value,dataRefContents},()=>{data && this.props.getData(this.state.dataRefContents)});
    data && ueEditor.execCommand('insertHtml',PublicFuc.insertColumTemplate(data))
  };

  //插入实物商品
  insertGoods = () => this.setState({goodVisible:true});
  cancelInsertGoods = () => this.setState({goodVisible:false});
  getGoodsValue = (value,data) => {
    const {dataRefContents,id} = this.state;
    const ueEditor = UE.getEditor(id);
    data && dataRefContents.push(data);
    this.setState({goodVisible:value,dataRefContents},()=>{data && this.props.getData(this.state.dataRefContents)});
    data &&  ueEditor.execCommand('insertHtml',PublicFuc.insertGoodsTemplate(data));
  };

  //插入电子书
  insertBook = () => this.setState({bookVisible:true});
  cancelInsertBook = () => this.setState({bookVisible:false});
  getBookValue = (value,data) => {
    const {dataRefContents,id} = this.state;
    const ueEditor = UE.getEditor(id);
    data && dataRefContents.push(data);
    this.setState({bookVisible:value,dataRefContents},()=>{data && this.props.getData(this.state.dataRefContents)});
    data && ueEditor.execCommand('insertHtml',PublicFuc.insertEbookTemplate(data))
  };


  //插入图片
  getUploadUrl = (value) => this.setState({cover: value});
  insertIcon = () => {
    if(this.state.cover){
      this.state.cover && this.state.btnOne.onclick(`<img src='${this.state.cover}' />`);
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
    const {id} = this.state;
    return (
      <div>
        <div style={{marginBottom:10}}>
          <Button  onClick={this.insertColumn}>插入专栏</Button>
          <Button style={{marginLeft:'2%'}} onClick={this.insertGoods}>插入实物商品</Button>
          <Button style={{marginLeft:'2%'}} onClick={this.insertBook}>插入电子书</Button>
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
          <ThumbUpload upload={(value) => {this.getUploadUrl(value)}} cake="上传图片"/>
        </Modal>

        {/*插入专栏*/}
        <Modal
          visible={this.state.visible}
          wrapClassName="vertical-center-modal"
          title="请选择要插入的专栏"
          onCancel={this.cancelColumn}
          maskClosable={false}
          width={1000}
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
          width={1000}
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
          width={900}
          footer={null}
        >
          <InsertArticleEbook getValue={this.getBookValue} dataClean={{search:'',upload:''}}/>
        </Modal>
      </div>

    )
  }
}

export default UEditorArticle;
