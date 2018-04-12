/**
 * Created by xj on 2017/8/31.
 */
import React, {Component} from "react";
import {withRouter} from 'react-router-dom';
import {Form, Input, Button, Select, DatePicker, Table, message, Modal, Row, Col} from 'antd';

import {Token} from "../../../utils";
import Api from '../../../api';
import "../training-plan/training-plan.scss";
const token = Token();
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const {RangePicker} = DatePicker;

class MessageManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible:false,
      loading: false,
      messageType: [],
      DetailData:{},
      pagination: {pageSize: 10, current: 1},
      queryFields: {
        messageType: 0,//消息类型
        IsRead: false,//阅读状态
        cnt: "",//内容关键字
      },
      dataSource: {},
    }

    this.columns = [
      {
        title: '内容',
        dataIndex: 'Cnt',

      },
      {
        title: '时间',
        dataIndex: 'CDate',

      },
      {
        title: '消息类型',
        dataIndex: 'MessageTypeDesc',

      },
      {
        title: '状态',
        dataIndex: 'IsRead',

      },
      {
        title: '操作',
        dataIndex: 'Operation',
        render: (text, record, index) => (
          (
            <div className="btn-group">
              <Button type="primary" onClick={() => this.searchDetail(record)}>查看</Button>
              <Button type="primary" style={{marginLeft: "0.5rem"}} onClick={() => this.delCurrent(record)}>删除</Button>
            </div>
          )
        )
      }
    ]
  }

  componentDidMount() {
    this.setState({
      loading: true
    })
    //获取消息类型
    Api.CourseManagement.GetMessageTypeList({token}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          messageType: res.Data
        })
      }
    });
    //默认获取分页数据
    this.getPageData()
  }

  //获取分页数据
  getPageData() {
    const {pageSize, current} = this.state.pagination;
    let NewViewModelList = [];
    Api.CourseManagement.GetMessageList(this.state.queryFields, current, pageSize, token).then(res => {
      if (res.Ret === 0) {
        if (res.Data) {
          const pagination = {...this.state.pagination};
          pagination.total = res.Data.TotalRecords;
          pagination.current = res.Data.PageIndex;
          //处理数据
          res.Data.ViewModelList.forEach((item, index) => {
            let obj = {
              ID: item.ID,
              MessageType: item.MessageType,
              MessageTypeDesc: item.MessageTypeDesc,
              Cnt: item.Cnt,
              CDate: item.CDate,
              IsRead: item.IsRead ? "已读" : "未读",
              IsReadState: item.IsRead,
              RID: item.RID,
            }
            NewViewModelList.push(obj)
          })
          this.setState({
            dataSource: Object.assign({}, this.state.dataSource, {
              ViewModelList: NewViewModelList
            }),
            pagination,
            loading: false
          })
        } else {
          setTimeout(() => this.setState({loading: false}), 10000)
        }

      }
    })
  }

  //分页改变时触发
  onChangePage(pagination, filters, sorter) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({pagination: pager, loading: true}, () => this.getPageData(pager.current));
  }

//查询
  handleSearch = (e) => {
    this.setState({loading: true})
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      this.setState({
        queryFields: Object.assign({}, this.state.queryFields, {
          messageType: values.MessageType || 0,
          IsRead: values.ReadState,
          cnt: values.Name || ""
        }),
        pagination:Object.assign({},this.state.pagination,{
          current:1
        })
      }, () => this.getPageData(this.state.queryFields))
    });
  }

  //查看
  searchDetail(record){
    this.setState({
      visible:true
    })
    let data={
      MessageID:record.ID,
      token
    };
    Api.CourseManagement.GetMessageDetailByID(data).then(res=>{
      if (res.Ret===0){
        this.setState({
          DetailData:res.Data
        })
      }
    })
  }

  //删除
  delCurrent(record) {
    console.log(record)
    const {ViewModelList} = this.state.dataSource;
    let data = {
      MessageID: record.ID,
      token
    }
    Api.CourseManagement.DelMessageByID(data).then(res => {
      if (res.Ret === 0) {
        ViewModelList.forEach((item, index) => {
          if (item.ID === record.ID) {
            this.setState({
              dataSource: Object.assign({}, this.state.dataSource, {
                ViewModelList: [
                  ...ViewModelList.slice(0, index),
                  ...ViewModelList.slice(index + 1)
                ]
              })
            },()=>message.info("删除成功"))
          }
        })
      }
    })
  }
  //取消显示模态框
  handleCancel(){
    this.getPageData();
    this.setState({
      visible:false
    })
  }

  render() {
    const {messageType,visible,DetailData} = this.state;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    let width=2;
    return (
      <div className="message-management">
        <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label={'消息类型'}>
            {getFieldDecorator(`MessageType`)(
              <Select
                style={{width: 150}}
                placeholder="消息类型"
                optionFilterProp="children"
                onChange={() => {
                }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  messageType.map((item, key) => {
                    return (
                      <Option value={item.Value} key={key}>{item.Text}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={'阅读状态'}>
            {getFieldDecorator(`ReadState`, {initialValue: "false"})(
              <Select
                style={{width: 150}}
                placeholder="阅读状态"
                optionFilterProp="children"
                onChange={() => {
                }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value={"true"}>已读</Option>
                <Option value={"false"}>未读</Option>

              </Select>
            )}
          </FormItem>

          <FormItem style={{marginLeft: "2.2rem"}} label="名称">
            {getFieldDecorator(`Name`)(
              <Input placeholder="请输入名称"/>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" style={{marginLeft: 8}} htmlType="submit">查询</Button>
          </FormItem>

          <Table rowKey="ID" bordered columns={this.columns}
                 style={{marginTop: "0.5rem"}}
                 loading={this.state.loading}
                 pagination={this.state.pagination}
                 dataSource={this.state.dataSource.ViewModelList}
                 onChange={(pagination, filters, sorter) => {
                   this.onChangePage(pagination, filters, sorter)
                 }}
          />

          <Modal
            className="searchDetail"
            width="50%"
            visible={visible}
            title="查看详情"
            onOk={this.handleOk}
            onCancel={() => this.handleCancel()}
            footer={[
              <Button key="submit"  size="large" onClick={() => this.handleCancel()}>
                取消
              </Button>
            ]}
          >
            <Row>
              <Col span={width}/>
              <Col span={2}>
                接收人名称:
              </Col>
              <Col span={20}>
                {DetailData.Rname}
              </Col>
            </Row>

            <Row>
              <Col span={width}/>
              <Col span={2}>
                内容:
              </Col>
              <Col span={20}>
                {DetailData.Cnt}
              </Col>
            </Row>
            <Row>
              <Col span={width}/>
              <Col span={2}>
                消息类型 :
              </Col>
              <Col span={20}>
                {DetailData.MessageTypeDesc}
              </Col>
            </Row>
            <Row>
              <Col span={width}/>
              <Col span={2}>
                创建日期:
              </Col>
              <Col span={20}>
                {DetailData.CDate}
              </Col>
            </Row>

          </Modal>
        </Form>
      </div>
    )
  }
}

export default withRouter(Form.create()(MessageManagement));

