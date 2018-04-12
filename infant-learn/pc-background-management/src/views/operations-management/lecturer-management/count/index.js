/**
 *  Create by xj on 2017/11/20.
 *  fileName: index
 */

import React, {Component} from "react";
import {withRouter} from 'react-router-dom';
import {Form, Input, Button, Select, DatePicker, Table} from 'antd';

import {Token} from "../../../../utils";
import Api from '../../../../api';
import moment from 'moment';

// import "../training-plan/training-plan.scss";
const token = Token();
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';


class Count extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      CourseType: [],
      TeachWay:[],
      pagination: {pageSize: 10, current: 1},
      queryFields: {
        courseType: 1,//课程类型
        courseName: '',//课程名称
        uid:0,//默认传0，获取我开设的课程
        teachWay: 0,//授课方式
      },
      dataSource: {},
    };

    this.columns = [
      {
        title: '课程名称',
        dataIndex: 'CourseName',

      },
      {
        title: '培训项目',
        dataIndex: 'PlanName',

      },
      {
        title: '授课方式',
        dataIndex: 'TeachWayName',

      },
      {
        title: '开课时间',
        dataIndex: 'CDate',

      },{
        title: '报名人数',
        dataIndex: 'QtySignUpPeople',

      },{
        title: '学习人数',
        dataIndex: 'QtyLearn',

      },{
        title: '浏览量',
        dataIndex: 'QtyView',

      },{
        title: '收藏量',
        dataIndex: 'QtyFavor',

      },{
        title: '考试人数',
        dataIndex: 'QtyExamination',

      },{
        title: '考试合格率',
        dataIndex: 'RateQualified',

      },{
        title: '课程好评率',
        dataIndex: 'GoodDiscuss',
      }
    ]
  }

  componentDidMount() {
    this.setState({
      loading: true
    });
    //获取消息类型
    Api.CourseManagement.GetCourseTypeList({token}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          CourseType: res.Data
        })
      }
    });
    Api.CourseManagement.GetTeachWayList({token}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          TeachWay: res.Data
        })
      }
    });
    //默认获取分页数据
    this.getPageData()
  }

  //获取分页数据
  getPageData() {
    const {pageSize, current} = this.state.pagination;
    const {courseType,courseName,uid,teachWay}=this.state.queryFields;
    let NewViewModelList = [];
    let getData={
      token,
      courseType:courseType,
      courseName:courseName,
      uid:uid,
      teachWay:teachWay,
      pageSize:pageSize,
      pageIndex:current,
    };
    Api.CourseManagement.GetExpertCourseLearn(getData).then(res => {
      if (res.Ret === 0) {
        if (res.Data) {
          const pagination = {...this.state.pagination};
          pagination.total = res.Data.TotalRecords;
          pagination.current = res.Data.PageIndex;
          //处理数据
          res.Data.ViewModelList&&res.Data.ViewModelList.length!==0&&res.Data.ViewModelList.forEach((item, index) => {
            let obj = {
              PlanID: item.PlanID,
              PlanName: item.PlanName,
              CoverImg: item.CoverImg,
              CourseName: item.CourseName,
              CourseID: item.CourseID,
              CourseTypeName: item.CourseTypeName,
              TeachWayName: item.TeachWayName,
              CDate: item.CDate,
              QtySignUpPeople: item.QtySignUpPeople,
              TotalAmount: item.TotalAmount,
              QtyView: item.QtyView,
              QtyFavor: item.QtyFavor,
              GoodDiscuss: item.GoodDiscuss,
              QtyLearn: item.QtyLearn,
              RateArrived: item.RateArrived,
              AvgLearnDuration: item.AvgLearnDuration,
              QtyExamination: item.QtyExamination,
              QtyTrainQualified: item.QtyTrainQualified,
              RateQualified: item.RateQualified,
            };
            NewViewModelList.push(obj)
          });
          this.setState({
            dataSource: Object.assign({}, this.state.dataSource, {
              ViewModelList: NewViewModelList
            }),
            pagination,
            loading: false
          })
        } else {
          setTimeout(() => this.setState({
            loading: false,
            dataSource: Object.assign({}, this.state.dataSource, {
            ViewModelList: []
          }),}), 5000)
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
    this.setState({loading: true});
    e.preventDefault();
    this.props.form.validateFields((err, values) => {

      this.setState({
        queryFields: Object.assign({}, this.state.queryFields, {
          courseType: values.CourseType||0,
          courseName: values.courseName||"",
          teachWay: values.TeachWay || 0,
          // SDate:moment(values.SEDate[0]).format(dateFormat)||"",
          // EDate:moment(values.SEDate[1]).format(dateFormat)||"",
        }),
        pagination:Object.assign({},this.state.pagination,{
          current:1,
        })
      }, () => this.getPageData(this.state.queryFields))
    });
  }




  render() {
    const {CourseType,TeachWay} = this.state;
    const {getFieldDecorator} = this.props.form;
    let ManageLevel=JSON.parse(decodeURIComponent(sessionStorage.getItem('clientInfo'))).ManageLevel
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    let width=2;
    return (
      <div className="count">
        <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch}>
          <FormItem {...formItemLayout} label={'课程类型'}>
            {getFieldDecorator(`CourseType`,{initialValue: "1"})(
              <Select
                style={{width: 150}}
                placeholder="课程类型"
                optionFilterProp="children"
                onChange={() => {
                }}
                disabled={ManageLevel>=2}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  CourseType.map((item, key) => {
                    return (
                      <Option value={item.Value} key={key}>{item.Text}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={'授课方式'}>
            {getFieldDecorator(`TeachWay`,{initialValue: "0"})(
              <Select
                style={{width: 150}}
                placeholder="授课方式"
                optionFilterProp="children"
                onChange={() => {
                }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value="0" >全部</Option>
                {
                  TeachWay.map((item, key) => {
                    return (
                      <Option value={item.Value} key={key}>{item.Text}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>

          <FormItem style={{marginLeft: "2.2rem"}} label="课程名称">
            {getFieldDecorator(`courseName`)(
              <Input placeholder="请输入课程名称"/>
            )}
          </FormItem>

          {/*<FormItem label="查询起止时间">*/}
            {/*{getFieldDecorator(`SEDate`)(*/}
              {/*<RangePicker format={dateFormat}/>)}*/}
          {/*</FormItem>*/}

          <FormItem>
            <Button type="primary" style={{marginLeft: 8}} htmlType="submit">查询</Button>
          </FormItem>

          <Table rowKey="PlanID" bordered columns={this.columns}
                 style={{marginTop: "0.5rem"}}
                 loading={this.state.loading}
                 pagination={this.state.pagination}
                 dataSource={this.state.dataSource.ViewModelList}
                 onChange={(pagination, filters, sorter) => {
                   this.onChangePage(pagination, filters, sorter)
                 }}
          />

        </Form>
      </div>
    )
  }
}

export default withRouter(Form.create()(Count));

