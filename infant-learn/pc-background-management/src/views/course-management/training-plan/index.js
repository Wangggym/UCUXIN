/**
 * Created by xj on 2017/8/22.
 */
import React, {Component} from "react";
import {withRouter} from 'react-router-dom';
import moment from 'moment';
import {
  Form, Input, Button, Select, DatePicker, Table, message, Modal, Row, Col, Popconfirm, InputNumber,
} from 'antd';
import './training-plan.scss';

import Api from '../../../api';
import {Token} from "../../../utils";

const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';
const token = Token();

class TrainingPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TrainType: [],//存储培训类型
      planState: [], //存储计划状态
      dataSource: [], //存储查询的数据
      organizationModal: false,//是否显示机构模态框
      ProCityRangList: [],//已填写的省市区人数
      RangList: [], //已填写的机构(学校)信息
      addShool: false,//是否显示添加学校模态框
      organization: [],//机构信息
      DetailData: {},//查看详情
      loading: false,
      visible: false,//是否显示模态框
      queryFields: {
        name: '',//培训名称
        trainST: 0,//状态
        trainType: 0,//培训类型
        st: '', //开始时间
        et: '',//结束时间
        // pIndex: 1,
        // pSize: 2//每页返回多少条数据
      },
      pagination: {pageSize: 10, current: 1}
    };

    this.columns = [
      {
        title: '培训名称',
        dataIndex: 'Name',

      },
      {
        title: '培训类型',
        dataIndex: 'TrainType',

      },
      {
        title: '培训对象',
        dataIndex: 'DestPeople',

      },
      // {
      //   title: '本区参培名额',
      //   dataIndex: 'LocalObj',
      //
      // },
      {
        title: '总学分',
        dataIndex: 'SumCredit',

      },
      {
        title: '培训开始时间',
        dataIndex: 'TrainSDate',

      },
      {
        title: '培训结束时间',
        dataIndex: 'TrainEDate',

      },
      {
        title: '名额',
        dataIndex: 'QtyLimit',

      },
      {
        title: '已报名人数',
        dataIndex: 'QtySignUp',

      },
      {
        title: '状态',
        dataIndex: 'TrainSTDesc',

      },
      {
        title: '发布时间',
        dataIndex: 'UDate',

      },
      {
        title: '操作',
        dataIndex: 'operation',

        render: (text, record, index) => (
          (
            <div className="btn-group">
              <Button type="primary" onClick={() => this.searchDetail(record)}>详情</Button>
              {/*<Button type="primary" disabled={record.TrainST===2} onClick={() => this.release(record)}>发布</Button>*/}
              <Button type="primary" disabled={(record.IsDistribution==false&&record.TrainST===2)||(record.IsDistribution==true&&record.DistributionTrainST===2)} onClick={() => this.release(record)}>发布</Button>
              {
                record.IsDistribution ? <Button type="primary" disabled={record.DistributionTrainST!==1} onClick={() => this.assignTo(record)}>指派</Button> :
                  <Button type="primary" disabled={record.TrainST===2} onClick={() => this.editPlan(record)}>编辑</Button>
              }
              <Button type="primary" onClick={() => this.assignDetail(record)}>指派详情</Button>
              <Popconfirm title="确定删除？" okText="是" cancelText="否"
                          onConfirm={() => this.delPlan(record)}>
                {
                  !record.IsDistribution&&<Button type="primary" disabled={record.TrainST===2}>删除</Button>
                }
              </Popconfirm>
            </div>
          )
        )
      }
    ]
  }

  componentDidMount() {
    this.setState({loading: true})
    //获取培训类型
    Api.CourseManagement.GetTrainTypeList().then(res => {
      if (res.Ret === 0) {
        this.setState({
          TrainType: res.Data
        })
      }
    })
    //获取计划状态
    Api.CourseManagement.GetTrainSTList().then(res => {
      if (res.Ret === 0) {
        this.setState({
          planState: res.Data
        })
      }
    });
    //默认获取分页数据
    this.getPageData()
  }

//单击已报名人数
  haveSignUp(planID) {
    this.props.history.push({pathname: '/have-sign-up', state: {planID: planID}})
  }

  //获取分页数据
  getPageData() {
    const {pageSize, current} = this.state.pagination;
    let NewViewModelList = [];
    Api.CourseManagement.GetTrainPlan(this.state.queryFields, current, pageSize, token).then(res => {
      if (res.Ret === 0) {
        const pagination = {...this.state.pagination};
        pagination.total = res.Data.TotalRecords;
        pagination.current = res.Data.PageIndex;
        //处理数据
        res.Data.ViewModelList&&res.Data.ViewModelList.forEach((item, index) => {
          let obj = {
            ID: item.ID,
            Name: item.Name,
            TrainType: item.TrainType,
            DestPeople: item.DestPeople,
            SumCredit: item.SumCredit,
            TrainSDate: item.TrainSDate,
            IsDistribution: item.IsDistribution,
            DistributionTrainST: item.DistributionTrainST,
            TrainEDate: item.TrainEDate,
            UName: item.UName,
            TrainSTDesc: item.TrainSTDesc,
            TrainST: item.TrainST,
            UDate: item.UDate,
            QtyLimit: item.QtyLimit,
            QtySignUp: item.QtySignUp === 0 ? item.QtySignUp :
              <a onClick={() => this.haveSignUp(item.ID)}>{item.QtySignUp}</a>,//已报名人数

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
        message.warn(res.Msg)
        this.setState({loading: false})
      }
    })
  }

//查询
  handleSearch = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      this.setState({
        queryFields: Object.assign({}, this.state.queryFields, {
          name: values.TrainingName || "",
          trainST: values.TrainingTypeState || 0,
          trainType: values.TrainingType || 0,
          st: values.sDate ? moment(values.sDate).format(dateFormat) : '',
          et: values.eDate ? moment(values.eDate).format(dateFormat) : '',
        }),
        pagination:Object.assign({},this.state.pagination,{
          current:1  //查询后.重新请求第一页的数据
        })
      }, () => this.getPageData())
    });
  }

  //新增
  addPlan() {
    this.props.history.push({pathname: '/add-training-plan'})
  }

//发布相似培训计划
  sendSameTrainPlan(planData) {
    this.props.history.push({pathname: '/add-training-plan', state: {NowData: planData}})
  }

//查看详情
  searchDetail(record) {
    this.setState({loading: true})
    const data = {
      planID: record.ID,
      token
    }
    Api.CourseManagement.GetPlanByID(data).then(res => {
      if (res.Ret === 0) {
        this.setState({
          DetailData: res.Data,
          visible:true,
          loading:false
        })
      }else{
        message.warn(res.Msg);
        this.setState({loading:false})
      }
    })
  }

//处理适用对象
  handleDestPeople(peopleLlist) {
    let newPeople = [];
    if (peopleLlist) {
      peopleLlist.map(item => {
        if (item.IsCheck)
          newPeople.push(item.Name)
      })
    }
    return newPeople.join('、')
  }

//取消显示模态框
  handleCancel() {
    this.setState({visible: false})
  }

  //发布计划
  release(record) {
    // if (record.TrainST === 2) {
    //   message.warn("你已经发布过了喔！")
    //   return;
    // }
    let data = {
      planID: record.ID
    }
//是否分配的计划
    if (!record.IsDistribution) {
      Api.CourseManagement.PublishPlan(data, token).then(res => {
        if (res.Ret === 0) {
          message.info("发布成功", this.getPageData())
        } else {
          message.info(res.Msg)
        }
      })
    } else {
      Api.CourseManagement.PublishSubPlan(data, token).then(res => {
        if (res.Ret === 0) {
          message.info("发布成功", this.getPageData())
        } else {
          message.info(res.Msg)
        }
      })
    }

  }

//编辑
  editPlan(record) {
    const data = {
      planID: record.ID,
      token
    }
    Api.CourseManagement.GetPlanByID(data).then(res => {
      if (res.Ret === 0) {
        this.props.history.push({
          pathname: `/edit-training-plan`, state: {
            "NowData": res.Data
          }
        })
      }
    })

  }

//删除
  delPlan(record) {
    let {ViewModelList} = this.state.dataSource;
    let data = {
      planID: record.ID
    }

    Api.CourseManagement.DelTrainPlanByID(data, token).then(res => {
      if (res.Ret === 0) {
        ViewModelList.forEach((item, index) => {
          if (item.ID === record.ID) {
            ViewModelList = [
              ...ViewModelList.slice(0, index),
              ...ViewModelList.slice(index + 1)
            ]
            this.setState({
              dataSource: Object.assign({}, this.state.dataSource, {
                ViewModelList: ViewModelList
              })
            }, () => message.info("删除成功"))
          }
        })


      }
    })


  }
//指派详情
  assignDetail(record){
     this.props.history.push({pathname:'/assign-detail',state:{planID:record.ID}})
  }
  //处理授课讲师
  handleTeacher(LecturerList) {
    if (!LecturerList) return;
    let nameList = [];
    LecturerList.forEach(item => {
      nameList.push(item.Name)
    })
    return nameList.join(",")

  }

  //处理学校指派情况
  handleRangList(RangList) {
    if (!RangList) return;
    let nameList = [];
    RangList.forEach(item => {
      nameList.push(item.GName?item.GName:item.AreaName)
    })
    return nameList.join(",")
  }

  //处理授课类型
  handleTrainType(TrainType) {
    if (!TrainType) return;
    const arr = ["国培", "省培", "区县培"]
    return arr[TrainType - 1]
  }

//分页改变时触发
  onChangePage(pagination, filters, sorter) {

    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({pagination: pager, loading: true}, () => this.getPageData(pager.current));
  }

  /*--------------------------指派范围相关 start------------------------------------*/

//指派
  assignTo(record) {
    //判断是不是点击当前计划，如果不是，清空学校范围人数
    if(record.ID!==this.state.PlanID){
      this.setState({RangList:[],organization:[]})
    }
    //获取当前用户所在区域
    this.getMangeUser();
    this.setState({
      organizationModal: true,
      PlanID: record.ID
    })
  }

  //获取当前用户所在区域
  getMangeUser() {
    Api.CourseManagement.GetMangeUser(token).then(res => {
      if (res.Ret === 0) {
        this.setState({AreaName: res.Data.AreaName, rid: res.Data.AreaID,ManageLevel:res.Data.ManageLevel})
        //根据区域id获取省市县
        this.getProCity(res.Data.AreaID)
      }
    })
  }

  //获取省市县
  getProCity(AreaID) {
    Api.OperationsManagement.getAreaList({token, rid: AreaID}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          ProvinceData: res.Data
        })
      }
    })
  }

  //添加学校
  addSchool() {
    const {AreaID} = this.state;
    //获取当前区域下的学校
    this.setState({
      addShool: true
    })
  }

//搜索
  searchShool() {
    this.setState({loading: true})
    let data = {
      name: this.state.schoolName,
      rid: this.state.rid,
      token
    }
    Api.CourseManagement.GetGroupsByRid(data).then(res => {
      if (res.Ret === 0) {
        this.setState({
          loading: false,
          organization: res.Data,
        }, () => this.setSchoolDefaultValue())
      } else {
        message.warn(res.Msg)
        this.setState({loading: false})
      }
    })
  }

  //设置已选中学校的值
  setSchoolDefaultValue() {
    const {organization, RangList} = this.state;
    if (RangList.length === 0) return;
    RangList.map(item => {
      organization.map(e => {
        e.Count = 0;
        if (item.GID === e.ID) {
          e.Count = item.Count
        }
      })
    })
    this.setState({organization})
  }


  //确定省市区范围模态框
  sureOrganization(ProCityRangList) {
    this.setState({
      ProCityRangList: this.delNullNum(ProCityRangList),
    }, () => this.apiAssign())
  }

//分配指标
  apiAssign() {
    let sendData = {
      token,
      body: {
        PlanID: this.state.PlanID,
        IsAll: this.state.IsAll||false,
        RangList: this.state.RangList,
        RangeIndcatorList: this.state.ProCityRangList
      }
    }
    Api.CourseManagement.DistributionTrainPlan(sendData).then(res => {
      if (res.Ret === 0) {
        message.success("指派成功！")
        this.setState({organizationModal: false})
      } else {
        message.warn(res.Msg)
      }
    })
  }
//是否全部可见
  isShowAll(value){
    this.setState({IsAll:value})
  }
  //取消省市区范围模态框
  CancelOrganization() {
    const {ProCityRangList} = this.state;
    this.setState({
      ProCityRangList: this.delNullNum(ProCityRangList),
      organizationModal: false
    })
  }

//确定添加学校模态框
  sureAddShool() {
    const {RangList} = this.state;
    this.setState({
      RangList: this.delSchoolNullNum(RangList),
      addShool: false
    })
  }

  //取消显示添加学校的模态框
  cancelAddschool() {
    const {RangList} = this.state;
    this.setState({
      RangList: this.delSchoolNullNum(RangList),
      addShool: false
    })
  }

//学校名称
  schoolName(e) {
    this.setState({
      schoolName: e
    })
  }

  //过滤掉人数为空的机构
  delNullNum(List) {
    let newArr = List.filter(item => item.Cnt !== "");
    return newArr;
  }

//过滤调人数为空的学校
  delSchoolNullNum(List) {
    let newArr = List.filter(item => item.Count !== "");
    return newArr;
  }

  //选择范围第一个模态框，删除学校
  delSchool(currentSchool) {
    const {RangList} = this.state;
    let newArr = RangList.filter(item => item.GID !== currentSchool.GID);
    this.setState({RangList: newArr})
  }

  //填写（改变）机构(学校)人数
  changPeopleNum(value, id, name) {
    const {RangList} = this.state;
    let data = {
      Count: value,
      GID: id,
      GName: name,
      AreaID: this.state.rid,
      // CUID:不用传
    }
    //判断当前机构是否已经存在RangList（存在-修改人数，不存在-添加当前机构信息，人数为空-删除已经存在的机构信息/不添加机构信息）
    if (RangList.length !== 0) {
      const index = RangList.findIndex(item => item.GID === id);
      if (index >= 0) {
        RangList[index].Count = value;
      } else {
        RangList.push(data)
      }
    } else {
      RangList.push(data)
    }
    this.setState({
      RangList
    })
  }

  //改变省市区的人数
  changProCityNum(value, id, name) {
    const {ProCityRangList} = this.state;
    let data = {
      ID: 0,
      AreaID: id,
      AreaName: name,
      TrainPlanID: 0,
      Cnt: value,
      TrainST: 1
    }
    //判断当前机构是否已经存在RangList（存在-修改人数，不存在-添加当前机构信息，人数为空-删除已经存在的机构信息/不添加机构信息）
    if (ProCityRangList.length !== 0) {
      const index = ProCityRangList.findIndex(item => item.AreaID === id);
      if (index >= 0) {
        ProCityRangList[index].Cnt = value;
      } else {
        ProCityRangList.push(data)
      }
    } else {
      ProCityRangList.push(data)
    }
    this.setState({
      ProCityRangList
    })
  }

  /*--------------------------指派范围相关 end------------------------------------*/
  render() {
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    const {planState, TrainType, visible, DetailData, organizationModal, ProCityRangList, RangList, ProvinceData, addShool, organization,ManageLevel} = this.state;
    const {getFieldDecorator} = this.props.form;
    const width = 2//模态框行宽
    return (
      <div className="training-plan">
        <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch}>
          <Row>
            <FormItem {...formItemLayout} label={'培训名称'}>
              {getFieldDecorator(`TrainingName`)(
                <Input placeholder="培训名称"/>
              )}
            </FormItem>

            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label={'培训类型'} style={{marginLeft: "0.5rem"}}>
              {
                getFieldDecorator(`TrainingType`)(//默认显示子组件的值
                  <Select
                    style={{width: 100}}
                    placeholder="培训类型"
                    optionFilterProp="children"
                    onChange={() => {
                    }}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      TrainType.map((item, key) => {
                        return (
                          <Option value={item.Value} key={key}>{item.Text}</Option>
                        )
                      })
                    }
                  </Select>
                )
              }
            </FormItem>

            <FormItem {...formItemLayout} label={'状态'}>
              {
                getFieldDecorator(`TrainingTypeState`)(//默认显示子组件的值
                  <Select
                    style={{width: 100}}
                    placeholder="培训类型"
                    optionFilterProp="children"
                    onChange={() => {
                    }}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {
                      planState.map((item, key) => {
                        return (
                          <Option value={item.Value} key={key}>{item.Text}</Option>
                        )
                      })
                    }
                  </Select>
                )
              }
            </FormItem>
          </Row>

          <Row >
            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label="培训开始日期">
              {getFieldDecorator(`sDate`)(<DatePicker format={dateFormat}/>)}
            </FormItem>

            <FormItem labelCol={{span: 10}} wrapperCol={{span: 14}} label="培训结束日期">
              {getFieldDecorator(`eDate`)(<DatePicker format={dateFormat}/>)}
            </FormItem>

            <FormItem>
              <Button type="primary" style={{marginLeft: 8}} htmlType="submit">查询</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" style={{marginLeft: 8}} onClick={() => this.addPlan()}>新增</Button>
            </FormItem>
          </Row>

          <Table rowKey="ID" bordered columns={this.columns} dataSource={this.state.dataSource.ViewModelList}
                 style={{marginTop: "0.5rem"}}
                 loading={this.state.loading}
                 pagination={this.state.pagination}
                 onChange={(pagination, filters, sorter) => {
                   this.onChangePage(pagination, filters, sorter)
                 }}
          />
          {/*查看详情*/}
          <Modal
            className="searchDetail"
            width="50%"
            visible={visible}
            title="培训计划"
            onOk={this.handleOk}
            onCancel={() => this.handleCancel()}
            footer={[
              <Button key="submit" type="primary" size="large" onClick={() => this.sendSameTrainPlan(DetailData)}>
                发布相似培训计划
              </Button>
            ]}
          >
            <Row>
              <Col span={width}/>
              <Col span={2}>
                培训名称:
              </Col>
              <Col span={20}>
                {DetailData.Name}
              </Col>
            </Row>
            <Row>
              <Col span={width}/>
              <Col span={2}>
                培训类型:
              </Col>
              <Col span={20}>
                {this.handleTrainType(DetailData.TrainType)}
              </Col>
            </Row>
            <Row>
              <Col span={width}/>
              <Col span={2}>
                培训对象:
              </Col>
              <Col span={20}>
                {this.handleDestPeople(DetailData.DestPeople)}
              </Col>
            </Row>
            <Row>
              <Col span={width}/>
              <Col span={2}>
                培训内容:
              </Col>
              <Col span={20}>
                {DetailData.Cnt}
              </Col>
            </Row>
            <Row>
              <Col span={width}/>
              <Col span={2}>
                区域指派情况:
              </Col>
              <Col span={20}>
                {this.handleRangList(DetailData.RangeIndcatorList)}
              </Col>
            </Row>
            <Row>
              <Col span={width}/>
              <Col span={2}>
                学校指派范围:
              </Col>
              <Col span={20}>
                {this.handleRangList(DetailData.RangList)}
              </Col>
            </Row>
            <Row>
              <Col span={width}/>
              <Col span={2}>
                授课讲师：
              </Col>
              <Col span={20}>
                {this.handleTeacher(DetailData.LecturerList)}
              </Col>
            </Row>

            {/*<Row>*/}
            {/*<Col span={width}/>*/}
            {/*<Col span={2}>*/}
            {/*参训限定名额:*/}
            {/*</Col>*/}
            {/*<Col span={20}>*/}
            {/*教师专业技能培训及案例分析*/}
            {/*</Col>*/}
            {/*</Row>*/}

            <Row>
              <Col span={width}/>
              <Col span={2}>
                培训总学分:
              </Col>
              <Col span={20}>
                {DetailData.SumCredit}
              </Col>
            </Row>

            <Row>
              <Col span={width}/>
              <Col span={3}>
                课程提交截止时间:
              </Col>
              <Col span={19}>
                {DetailData.EndDate}
              </Col>
            </Row>

            <Row>
              <Col span={width}/>
              <Col span={2}>
                培训时间:
              </Col>
              <Col span={20}>
                {DetailData.TrainSDate}至{DetailData.TrainEDate}
              </Col>
            </Row>
            <Row>
              <Col span={width}/>
              <Col span={2}>
                附件：
              </Col>
              <Col span={20} style={{wordWrap:"break-word"}}>
                <a href={DetailData.AttachUrl} target="_Blank">{DetailData.AttachName}</a>
              </Col>
            </Row>

            <Row>
              <Col span={width}/>
              {
                DetailData.TrainST!==1&&
                <Col span={2}>
                  通知时间：
                </Col>
              }
              {
                DetailData.TrainST!==1&&
                <Col span={10}>
                  {DetailData.UDate}
                </Col>
              }
            </Row>
          </Modal>
          {/*填写省市区限定人数*/}
          <Modal
            width="50%"
            visible={organizationModal}
            title="请填写限定名额"
            onCancel={() => this.CancelOrganization()}
            footer={[
              <Button key="back" size="large" onClick={() => this.CancelOrganization()}>取消</Button>,
              <Button key="submit" type="primary" size="large" onClick={() => this.sureOrganization(ProCityRangList)}>
                确定
              </Button>
            ]}
          >
            <div className="select-scope">
              <Form layout="inline">
                <FormItem labelCol={{span: 6}} wrapperCol={{span: 18}} label={'区域'}>
                  <Input disabled value={this.state.AreaName}/>
                </FormItem>
                {/*<FormItem labelCol={{span: 14}} wrapperCol={{span: 10}} label={'是否全部可见'}>*/}
                  {/*<Select*/}
                    {/*defaultValue="false"*/}
                    {/*style={{width: 100}}*/}
                    {/*placeholder="培训类型"*/}
                    {/*optionFilterProp="children"*/}
                    {/*onChange={(value) => this.isShowAll(value)}*/}
                    {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
                  {/*>*/}
                    {/*<Option value={"true"} key={"0"}>是</Option>*/}
                    {/*<Option value={"false"} key={"1"}>否</Option>*/}
                  {/*</Select>*/}
                {/*</FormItem>*/}
                <FormItem wrapperCol={{span: 12}} style={{textAlign: "right",marginLeft:"2rem"}}>
                  <Button style={{marginLeft: 8}} type="primary"
                          onClick={() => this.addSchool()}>添加学校</Button>
                </FormItem>
              </Form>
              <div className="show-shoolCount">
                {
                  RangList.length !== 0 ? RangList.map(item => {
                    return (
                      <div className="single-school" key={item.GID}>
                        {item.GName}({item.Count})人
                        <a onClick={() => this.delSchool(item)}>x</a>
                      </div>
                    )
                  }) : <NoContent/>
                }

              </div>
              {
                ManageLevel!==4&&<div className="content">
                  {
                    ProvinceData && ProvinceData.length ? ProvinceData.map((item, key) => {
                      return (
                        <Row key={item.ID} style={{marginBottom: "0.5rem"}}>
                          <Col span={width}/>
                          <Col span={8} style={{display: "flex", alignItems: "center", height: "2rem"}}>
                            {item.Name}:
                          </Col>
                          <Col span={10} style={{display: "flex", alignItems: "center", height: "2rem"}}>
                            限定名额&nbsp;&nbsp;
                            <InputNumber disabled={this.state.IsAll==="true"?true:false} placeholder="人数" min={0} precision={0}
                                         onBlur={(e) => this.changProCityNum(e.target.value, item.ID, item.Name)}/>
                            &nbsp;&nbsp;人
                          </Col>
                        </Row>
                      )
                    }) : <NoContent/>
                  }
                </div>
              }


            </div>

          </Modal>
          {/*添加学校限定人数*/}
          {/*<Spin spinning={this.state.loading} className="search-loading">*/}
            <Modal
              width="50%"
              visible={addShool}
              title="添加学校"
              onCancel={() => this.cancelAddschool()}
              footer={[
                <Button key="back" size="large" onClick={() => this.cancelAddschool()}>取消</Button>,
                <Button key="submit" type="primary" size="large" onClick={() => this.sureAddShool(RangList)}>
                  确定
                </Button>
              ]}
            >
              <Form layout="inline">
                <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="学校名称">
                  <Input onChange={(e) => this.schoolName(e.target.value)} placeholder="请输入学校名称"/>
                </FormItem>
                <FormItem wrapperCol={{span: 12}} style={{textAlign: "right"}}>
                  <Button style={{marginLeft: 8}} type="primary" disabled={this.state.schoolName ? false : true}
                          onClick={() => this.searchShool()}>搜索</Button>
                </FormItem>
              </Form>
              <div className="content">
                {
                  organization.length ? organization.map((item, key) => {
                    return (
                      <Row key={item.ID} style={{marginBottom: "0.5rem"}}>
                        <Col span={width}/>
                        <Col span={8} style={{display: "flex", alignItems: "center", height: "2rem"}}>
                          {item.FName}:
                        </Col>
                        <Col span={10} style={{display: "flex", alignItems: "center", height: "2rem"}}>
                          限定名额&nbsp;&nbsp;
                          <InputNumber placeholder="人数" min={0} precision={0} defaultValue={item.Count}
                                       onBlur={(e) => this.changPeopleNum(e.target.value, item.ID, item.FName)}/>
                          &nbsp;&nbsp;人
                        </Col>
                      </Row>
                    )
                  }) : <NoContent/>
                }
              </div>
            </Modal>
          {/*</Spin>*/}
        </Form>

      </div>
    )
  }
}

class NoContent extends Component {
  render() {
    return (
      <div className="no-content">
        暂无数据
      </div>
    )
  }
}


export default withRouter(Form.create()(TrainingPlan));
