/**
 *  Create by xj on 2018/1/15.
 *  fileName: 消息公告
 */
import React, {Component} from 'react';
import {Form, Input, DatePicker, Radio, message,Button,Modal} from "antd";
import Api from '../../../api';
import moment from 'moment';
import ZxTable from './Table/ZxTable';

const FormItem = Form.Item;
const {TextArea} = Input;
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;

const dateFormat = 'YYYY-MM-DD HH:mm:ss';


class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLimite: this.props.Notice && (this.props.Notice.ValidBeginDate && this.props.Notice.ValidEndDate) ? true : false,
      Notice: this.props.Notice || {},
      visible:false,
      type:'1',
      listData:null,
      delThumb:false//是否删除图片
    }
  }


  //选择有效期
  isLimite = (value) => {
    this.setState({isLimite: value})
  };
  //确定
  sure = () => {
    const {Notice,listData} = this.state;
    var delThumb=this.state.delThumb;
    this.props.form.validateFields((err, values) => {
      Notice.Content = values.notice;
      Notice.ValidBeginDate = values.SeartchSEDate ? moment(values.SeartchSEDate[0]).format(dateFormat) : "";
      Notice.ValidEndDate = values.SeartchSEDate ? moment(values.SeartchSEDate[1]).format(dateFormat) : "";
      Notice.ContentType = listData ? listData.ContentType : Notice.ContentType;
      Notice.ContentID = listData ? listData.ContentID :  Notice.ContentID;
      Notice.Title = listData ? listData.Title : Notice.Title;
      Notice.Thumb = listData ? listData.Thumb :  Notice.Thumb;
      if(delThumb){
      	Notice.Thumb="";
      	Notice.ContentType="";
      	Notice.ContentID="";
      	Notice.Title="";
      }
      Notice.Url = listData ? listData.Url :  Notice.Url;
    });
//  console.log(Notice)
    Api.systemSetting.SetGSpaceNotice({body: Notice}).then(res => {
    	this.setState({delThumb:false})
      if (res.Ret === 0) {
        this.getMenuList();
        message.success("保存成功")
      } else {
        message.error(res.Msg)
      }
    })
  };
  delete = () => {
  	this.setState({delThumb:true})
  }

  getData = (value,data)=>{
    this.setState({visible:value,listData:data},
      ()=>{
      data && this.setState({Notice:{...this.state.Notice,ContentType:data.ContentType,Title:data.Title}})
      })
  };


  //枚举  类型 显示不同标题
  handleType = (type) => {
    let content = '';
    switch (type) {
      case 11:
        content = '关联文章';
        break;
      case 12:
        content = '关联话题';
        break;
      case 13:
        content = '关联图集';
        break;
      case 14:
        content = '关联宣传';
        break;
      case 21:
        content = '关联专栏';
        break;
      case 23:
        content = '关联电子书';
        break;
      case 25:
        content = '关联实物商品';
        break;
      case '':
        content = '';
        break;
    }
    return content;
  };

  getMenuList = () => {
    Api.systemSetting.GetGroupSettings().then(res => {
      if (res.Ret === 0) {
        this.props.changeValue(res.Data);
      } else {
        message.error(res.Msg)
      }
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    // const {Notice} = this.props;
    const {isLimite,Notice} = this.state;
    const DataRange = Notice && (Notice.ValidBeginDate && Notice.ValidEndDate) ? [moment(Notice.ValidBeginDate), moment(Notice.ValidEndDate)] : "";
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    return (
      <div className="message-notice" style={{width:"70%"}}>
        {/*关联内容*/}
        <Modal
          title="选择要关联的内容"
          visible={this.state.visible}
          onCancel={()=>{this.setState({visible:false})}}
          wrapClassName="vertical-center-modal"
          width={600}
          footer={null}
        >
          <ZxTable getData={this.getData}/>
        </Modal>
        <FormItem label="消息公告:" {...formItemLayout}>
          {
            getFieldDecorator("notice", {initialValue: Notice ? Notice.Content:''})(<TextArea rows={4} placeholder="请输入固定电话归属"/>)
          }
        </FormItem>
        <FormItem label="选择有效期" {...formItemLayout}>
          {getFieldDecorator(`IsCharge`, {
            rules: [{required: true}],
            initialValue: Notice && (Notice.ValidBeginDate && Notice.ValidEndDate) ? true : false
          })(
            <RadioGroup onChange={(e) => this.isLimite(e.target.value)}>
              <Radio value={false}>无期限</Radio>
              <Radio value={true}>规定时间内</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {
          isLimite &&
          <FormItem label="选择有效期" {...formItemLayout}>
            {getFieldDecorator(`SeartchSEDate`, {initialValue: DataRange})(<RangePicker format={dateFormat} showTime={{format: 'HH:mm:ss'}}/>)}
          </FormItem>
        }
        <FormItem label="关联内容" {...formItemLayout}>
          <Button  onClick={()=>this.setState({visible:true})}>选择关联内容</Button>&nbsp;&nbsp;
          <Button  onClick={()=>this.delete()}>	清除关联图片</Button>
          <br/>{Notice && <span>{this.handleType(Notice.ContentType)}&nbsp;:<span>{Notice.Title}</span></span>}
        </FormItem>
        <a style={{fontSize: "20px",marginLeft:"70px"}} onClick={() => this.sure()}>确定</a>
      </div>
    )
  }
}

export default Form.create()(Notice);