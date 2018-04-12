import React, {Component} from "react";
import {Form, Input, Button, Select, Radio, Table, message, Modal, Row, Col} from 'antd';
import Api from '../../../api';
import {Token} from "../../../utils";

const token = Token();
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {TextArea} = Input;

class HaveSigUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      queryFields: {
        planID:this.props.location.state.planID,
        auditST: 0
      },
      pagination: {pageSize: 10, current: 1},
      checkState: [],//审核状态
      visible: false,
      isPassState: true,//审核理由框是否可填
      currentPlanID:"",
      loading:false
    }

    this.columns = [
      {
        title: '培训计划',
        dataIndex: 'TrainPlanName',

      },
      {
        title: '学员姓名',
        dataIndex: 'Name',

      },
      {
        title: '手机号码',
        dataIndex: 'TelPhone',

      },
      // {
      //   title: '学员角色',
      //   dataIndex: 'UID',
      //
      // },
      {
        title: '教龄',
        dataIndex: 'TeaAge',

      },
      {
        title: '学历',
        dataIndex: 'EducationDesc',

      },
      {
        title: '状态',
        dataIndex: 'AuditST',

      },
      // {
      //   title: '操作',
      //   dataIndex: 'operation',
      //
      //   render: (text, record, index) => (
      //     (
      //       <div className="btn-group">
      //         <Button type="primary"  disabled={record.AuditST==1} onClick={() => this.check(record)}>审核</Button>
      //       </div>
      //     )
      //   )
      // }
    ]
  }

  componentDidMount() {
    //获取审核状态
    Api.CourseManagement.GetAuditSTList(token).then(res => {
      if (res.Ret === 0) {
        this.setState({
          checkState: res.Data
        })
      }
    })
    //根据培训计划ID分页获取报名学员
    this.getPageData();
  }

//查询
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      //改变审核状态
      this.setState({
        queryFields: Object.assign({}, this.state.queryFields, {
          auditST: values.CheckState || 0
        })
      }, () => this.getPageData())
    });
  }

  //获取分页数据
  getPageData() {
     this.setState({loading:true})
    const {pageSize, current} = this.state.pagination;
    let data = {
      token,
      ...this.state.queryFields,
      pIndex: current,
      pSize: pageSize,
    }
    let NewViewModelList = [];
    Api.CourseManagement.GetApplyUserPageByCondition(data).then(res => {
      if (res.Ret === 0) {
        this.setState({loading:false})
        const pagination = {...this.state.pagination};
        pagination.total = res.Data.TotalRecords;
        pagination.current = res.Data.PageIndex;
        //处理数据
        res.Data.ViewModelList.forEach((item, index) => {
          //处理审核状态
          let newState = "";
          switch (item.AuditST) {
            case 10:
              newState = "未发布";
              break;
            case 20:
              newState = "已发布";
              break;
            case 30:
              newState = "待审核";
              break;
            case 40:
              newState = "审核驳回";
              break;
            case 50:
              newState = "审核通过";
              break;
            default:
              newState = item.AuditST
          }
          let obj = {
            ID: item.ID,
            Name: item.Name,
            TrainPlanName: item.TrainPlanName,
            TelPhone: item.TelPhone,
            AuditST: newState,
            UID: item.UID,
            TrainPlanID: item.TrainPlanID,
            TeaAge: item.TeaAge,
            Education: item.Education,
            EducationDesc: item.EducationDesc,
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
        setTimeout(this.setState({loading: false}), 10000)
      }
    })
  }

  //审核
  check(record) {
    this.setState({
      visible: true,
      currentPlanID:record.ID
    })
  }

  //取消显示模态框
  handleCancel() {
    this.setState({
      visible: false
    })
  }

//分页改变时触发
  onChangePage(pagination, filters, sorter) {

    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({pagination: pager, loading: true}, () => this.getPageData(pager.current));
  }

//是否审核通过
  isPass(state) {
    //通过
    if (state) {
      this.setState({
        isPassState: true
      })
      //清空不通过理由
      this.props.form.setFieldsValue({
        "reason":""
      })
      return;
    }
    //不通过
    this.setState({
      isPassState: false
    })
  }
//审核确定
  checkSure(){
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      if(!values.reason&&!this.state.isPassState){
        message.warn("请填写未通过理由！")
        return;
      }
      let data={
        token,
        id:this.state.currentPlanID,
        st:values.isPass,
        remark:values.reason
      }
      Api.CourseManagement.ApproveApplyUser(data).then(res=>{
        if(res.Ret===0){
          message.info("审核成功");
          setTimeout(()=>{
            this.setState({visible:false})
            this.getPageData()//模态框隐藏后重新获取数据页面
          },2000)
        }
      })
    });
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const {checkState, visible} = this.state;
    const formItemLayout = {
      labelCol: {span: 10},
      wrapperCol: {span: 14},
    };
    return (
      <div className="sign-up">
        <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch}>
          {/*<FormItem {...formItemLayout} label={'培训计划'}>*/}
          {/*{*/}
          {/*getFieldDecorator(`TrainingPlan`)(//默认显示子组件的值*/}
          {/*<Select*/}
          {/*style={{width: 100}}*/}
          {/*placeholder="培训计划"*/}
          {/*optionFilterProp="children"*/}
          {/*onChange={() => {*/}
          {/*}}*/}
          {/*filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}*/}
          {/*>*/}
          {/*<Option value={"1"}>全部</Option>*/}
          {/*<Option value={"2"}>课程</Option>*/}
          {/*<Option value={"3"}>授课</Option>*/}
          {/*</Select>*/}
          {/*)*/}
          {/*}*/}
          {/*</FormItem>*/}

          <FormItem {...formItemLayout} label={'审核状态'}>
            {
              getFieldDecorator(`CheckState`)(//默认显示子组件的值
                <Select
                  style={{width: 100}}
                  placeholder="培训项目"
                  optionFilterProp="children"
                  onChange={() => {
                  }}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    checkState.map((item, key) => {
                      return (
                        <Option value={item.Value} key={key}>{item.Text}</Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </FormItem>
          <FormItem>
            <Button type="primary" style={{marginLeft: "2rem"}} htmlType="submit">查询</Button>
          </FormItem>
          <Table rowKey="ID" bordered columns={this.columns} dataSource={this.state.dataSource.ViewModelList}
                 style={{marginTop: "0.5rem"}}
                 loading={this.state.loading}
                 pagination={this.state.pagination}
                 onChange={(pagination, filters, sorter) => {
                   this.onChangePage(pagination, filters, sorter)
                 }}
          />

          <Modal
            className="searchDetail"
            width="40%"
            visible={visible}
            title="审核学员"
            onCancel={() => this.handleCancel()}
            footer={[
              <div key="btn">
                <Button key="cancel" size="large" onClick={() => this.handleCancel()}>
                  取消
                </Button>
                <Button key="submit" type="primary" size="large" onClick={() => this.checkSure()}>
                  确定
                </Button>
              </div>
            ]}
          >
            <Row>
              <Col span={2}/>
              <Col span={2}>
                审核:
              </Col>
              <Col span={20}>
                {getFieldDecorator(`isPass`)(
                  <RadioGroup>
                    <Radio value={"true"} onClick={() => this.isPass(1)}>通过</Radio>
                    <Radio value={"false"} onClick={() => this.isPass(0)}>不通过</Radio>
                  </RadioGroup>
                )}
              </Col>
            </Row>

            <Row style={{marginTop: "1rem"}}>
              <Col span={2}/>
              <Col span={2}>
                理由:
              </Col>
              <Col span={20}>
                {getFieldDecorator(`reason`)(
                  <TextArea rows={4} placeholder="请填写不通过理由" disabled={this.state.isPassState}/>
                )}
              </Col>
            </Row>
          </Modal>
        </Form>

      </div>
    )
  }
}

export default Form.create()(HaveSigUp);
