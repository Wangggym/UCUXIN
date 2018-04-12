/**
 * Created by xj on 2017/10/9
 */
import React, {Component} from "react";
// import {withRouter} from 'react-router-dom';
import {Form, Input, Button, Radio, Spin, Icon, Select, Table, Modal,message} from 'antd';

import Api from '../../../api';
import {Token} from "../../../utils";
// import './AssignDetail.scss'

const token = Token();
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

class AssignDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolData: [],
      selectSchoolModal: false,
      cityData: [],
      countyData: [],
      pagination: {pageSize: 2, current: 1},
      queryFields: {
        messageType: 0,//消息类型
        IsRead: false,//阅读状态
        cnt: "",//内容关键字
      },
    };
    this.columns = [
      {
        title: '区域',
        dataIndex: 'AreaName',
      },
      {
        title: '是否直属指派',
        dataIndex: 'IsCreate',

      },
      {
        title: '幼儿园',
        dataIndex: 'GName',

      },
      {
        title: '名额',
        dataIndex: 'QtyLimit',

      },
      {
        title: '报名人数',
        dataIndex: 'Cnt',

      },
      {
        title: '审核通过人数',
        dataIndex: 'ApplyCnt',
      },
    ]
  };

  componentDidMount() {
    //获取当前用户的省
    //this.getMangeUser()
    //获取当前人的区域集合
    this.getCurrentUserArea()
  }

  //获取当前人的区域集合
  getCurrentUserArea() {
    this.setState({loading:true})
    Api.CourseManagement.GetCurrentUserArea(token).then(res => {
      if (res.Ret === 0) {
        let AreaIDs = Object.keys(res.Data);
        let AreaName = Object.values(res.Data);
        //设置省市区默认值
        this.props.form.setFieldsValue({
          "province": AreaName[0],
          "city": AreaName[1],
          "district": AreaName[2],
        });
        this.setState({AreaIDs: AreaIDs,loading:false});
        //获取登陆人员的下级区域
        if (AreaIDs[1]) {
          this.getDistrict(AreaIDs[1])
        } else {
          this.getCity(AreaIDs[0])
        }
        //默认获取指派详情
        this.getAssignDtail(AreaIDs[0], AreaIDs[1], AreaIDs[2])
      }else {
        message.warn(res.Msg);
        this.setState({loading:false})
      }
    })
  }

  //获取当前用户所在市
  getCity(provinceID) {
    const sendData = {
      token,
      rid: provinceID
    }
    Api.CourseManagement.GetRegion(sendData).then(res => {
      if (res.Ret === 0) {
        this.setState({
          cityData: res.Data,
        })
      }
    })
  }

//市改变
  cityChange(value) {
    this.setState({
      rid: value,
      cityID: value
    })
    this.getDistrict(value)
  }

  //区改变
  countyChange(value) {
    this.setState({
      rid: value,
      proID: value
    }, () => console.log(this.state.rid))
  }

//获取当前用户所在区
  getDistrict(countyID) {
    const sendData = {
      token,
      rid: countyID
    }
    Api.CourseManagement.GetRegion(sendData).then(res => {
      if (res.Ret === 0) {
        this.setState({
          countyData: res.Data,
        })
      }
    })
  }

  //根据区域ID获取机构列表
  searchShool() {
    const sendData = {
      token,
      rid: this.state.rid,
      name: this.state.schoolName || ""
    }
    Api.CourseManagement.GetGroupsByRid(sendData).then(res => {
      if (res.Ret === 0) {
        this.setState({
          schoolData: res.Data
        })
      }
    })
  }

  //默认获取指派详情
  getAssignDtail(prvID, cityID, countyID, gid) {
    this.setState({loading:true})
    const sendData = {
      token,
      planID: this.props.location.state.planID,
      prvID: prvID,
      cityID: cityID || 0,
      countyID: countyID || 0,
      gid: gid || 0,
    }
    Api.CourseManagement.GetDistributionList(sendData).then(res => {
      if (res.Ret === 0) {
        let tableList = [];
        res.Data.forEach(item => {
          let tableData = {
            PlanID: item.PlanID,
            AreaName: item.AreaName,
            IsCreate: item.IsCreate ? "是" : "否",
            GName: item.GName,
            QtyLimit: item.QtyLimit,
            Cnt: item.Cnt,
            GID: item.GID,
            ApplyCnt: item.ApplyCnt,
          }
          tableList.push(tableData);
        })
        this.setState({dataSource: tableList,loading:false})
      }else {
        message.warn(res.Msg);
        this.setState({loading:false})
      }
    })
  }

//取消选择学校模态框
  cancelselectSchoolModal() {
    this.setState({
      selectSchoolModal: false
    })
  }

  //确定选择学校模态框
  sureSelectSchoolModal() {
    this.props.form.setFieldsValue({
      "schoolName": this.state.schoolName,
    })
    this.setState({
      selectSchoolModal: false
    })
  }

//查询
  handleSearch = (e) => {
    const {AreaIDs, cityID, proID} = this.state;
    console.log(AreaIDs)
    e.preventDefault();
    this.props.form.validateFields((err, values) => {//未使用表单获取的值
      console.log('Received values of form: ', values);
      let cityIDNew = cityID ? cityID : AreaIDs[1];
      let proIDNew = proID ? proID : AreaIDs[2]
      this.getAssignDtail(AreaIDs[0], cityIDNew, proIDNew, this.state.gid)
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    const {cityData, countyData, selectSchoolModal, schoolData} = this.state;
    const {getFieldDecorator} = this.props.form;

    return (
      <div className="assign-detail">
        <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label={'省'}>
            {getFieldDecorator(`province`)(
              <Input placeholder="省" disabled/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'市'}>
            {getFieldDecorator(`city`)(
              <Select
                style={{width: 140}}
                placeholder="请选择市"
                optionFilterProp="children"
                onChange={(value) => {
                  this.cityChange(value)
                }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  cityData.map((item, key) => {
                    return (
                      <Option value={`${item.ID}`} key={item.ID}>{item.Name}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'区'}>
            {getFieldDecorator(`district`)(
              <Select
                style={{width: 140}}
                placeholder="请选择区"
                optionFilterProp="children"
                onChange={(id) => {
                  this.countyChange(id)
                }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  countyData.map((item, key) => {
                    return (
                      <Option value={`${item.ID}`} key={item.ID}>{item.Name}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'学校'}>
            {getFieldDecorator(`schoolName`)(
              <Input placeholder="请选择学校" disabled
                     addonAfter={<Icon type="plus" onClick={() => this.setState({selectSchoolModal: true})}/>}/>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" style={{marginLeft: 18}} htmlType="submit">查询</Button>
          </FormItem>
          <Table rowKey="GID" bordered columns={this.columns}
                 style={{marginTop: "0.5rem"}}
                 loading={this.state.loading}
                 pagination={false}
                 dataSource={this.state.dataSource}
                 onChange={(pagination, filters, sorter) => {
                   this.onChangePage(pagination, filters, sorter)
                 }}
          />
          <div className="agree" style={{textAlign: "right", marginTop: "0.5rem"}}>
            <Button type="primary" style={{marginLeft: 8}} onClick={()=>this.props.history.goBack()}>同意</Button>
          </div>
        </Form>

        <Modal
          width="50%"
          visible={selectSchoolModal}
          title="选择学校"
          onCancel={() => this.cancelselectSchoolModal()}
          footer={[
            <Button key="back" size="large" onClick={() => this.cancelselectSchoolModal()}>取消</Button>,
            <Button key="submit" type="primary" size="large" onClick={() => this.sureSelectSchoolModal()}>
              确定
            </Button>
          ]}
        >
          <Form layout="inline">
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="学校名称">
              <Input onChange={(e) => this.setState({schoolName: e.target.value})} placeholder="请输入学校名称"/>
            </FormItem>
            <FormItem wrapperCol={{span: 12}} style={{textAlign: "right"}}>
              <Button style={{marginLeft: 8}} type="primary" onClick={() => this.searchShool()}>查询学校</Button>
            </FormItem>
          </Form>
          <div className="content">
            <RadioGroup name="radiogroup"
                        onChange={(e) => this.setState({gid: e.target.value, schoolName: e.target.schoolName})}>
              {
                schoolData.length !== 0 ? schoolData.map(item => {
                  return (
                    <Radio value={item.ID} key={item.ID} schoolName={item.FName}>
                      {item.FName}
                    </Radio>
                  )
                }) : "该区域无学校"
              }
            </RadioGroup>
          </div>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(AssignDetail);
