/**
 *  Create by xj on 2017/11/15.
 *  fileName: index
 */
import React, {Component} from 'react';
import {Tabs, Row, Col, Form, Button, DatePicker, Table, message, Spin} from 'antd';
import AreaBarCharts from './AreaBarCharts';
import {withRouter} from 'react-router-dom';

import moment from 'moment';
import './credit-management.scss';
import Api from '../../../api';
import {Token} from "../../../utils";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const token = Token();


class CreditManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaSDate: "",
      areaEDate: "",
      projectSDate: "",
      projectEDate: "",
      barData: null,//按区域，按项目是同一个接口
      areaTabData: [], //区域表格的数据
      projectTabData: [],//按项目表格的数据
      pagination: {pageSize: 10, current: 1},
      dataSource: {},
      barLoading: false,   //此处用的两个loading来控制两个tab页的状态，（如需要单独控制，需要再增加两个loading分开控制）
      tableLoading: false,
    };
    let clientInfo = JSON.parse(decodeURIComponent(sessionStorage.getItem('clientInfo')));
    this.areaColumns = [
      {
        title: clientInfo.ManageLevel===4?'参培院所名称':"区域名称",
        dataIndex: 'Name',
      },
      {
        title: '参培项目数',
        dataIndex: 'QtyTrainProduct',
      },
      {
        title: '主办培训项目数',
        dataIndex: 'QtyMainTrainProduct',
      },
      {
        title: '培训总学分',
        dataIndex: 'CntTrainCredit',
      },
      {
        title: '参培人数',
        dataIndex: 'QtyTrainPeople',
      },
      {
        title: '培训覆盖率（%）',
        dataIndex: 'RateConverTrain',
      },
      {
        title: '有学分人数',
        dataIndex: 'QtyHaveTrainCredit',
      },
      // {
      //   title: '合格人数',
      //   dataIndex: 'QtyTrainQualified',
      //
      // },
      {
        title: '合格率（%）',
        dataIndex: 'RateQualified',

      },
      {
        title: '操作',
        dataIndex: 'Operation',
        render: (text, record, index) => (
          (
            <div className="btn-group">
              <Button type="primary" onClick={() => this.areaSearchDetail(record)}>查看详情</Button>
            </div>
          )
        )
      }
    ];
    this.projectColumns = [
      {
        title: '项目名称',
        dataIndex: 'Name',
      },
      {
        title: '培训类型',
        dataIndex: 'TrainType',
      },
      {
        title: '参培地市数',
        dataIndex: 'QtyTrainArea',
      },
      {
        title: '状态',
        dataIndex: 'STDesc',
      },
      {
        title: '项目总学分',
        dataIndex: 'QtyProductCredit',
      },
      {
        title: '参培人数',
        dataIndex: 'QtyTrainPeople',
      },
      {
        title: '有学分人数',
        dataIndex: 'QtyHaveTrainCredit',
      },
      {
        title: '合格率（%）',
        dataIndex: 'RateQualified',

      },
      {
        title: '操作',
        dataIndex: 'Operation',
        render: (text, record, index) => (
          (
            <div className="btn-group">
              <Button type="primary" onClick={() => this.projectSearchDetail(record)}>查看详情</Button>
            </div>
          )
        )
      }
    ]
  }

  componentDidMount() {
    this.getBarDataByArea();
    this.getTableDataByArea();
  }

  /*-----------------------按区域 start-------------------------------------*/
  //获取区域住状图数据
  getBarDataByArea = () => {
    this.setState({barLoading:true});
    let getDataParam = {
      token,
      type: 1,//1-按区域；2-按项目
      st: this.state.areaSDate,
      et: this.state.areaEDate
    };
    Api.CourseManagement.GetLowerAreaQtyPeople(getDataParam).then(res => {
      if (res.Ret === 0) {
        this.setState({
          barData: res.Data,
          barLoading:false
        })
      } else {
        message.warning(res.Msg)
      }
    })
  };
  //获取区域表格数据
  getTableDataByArea = () => {
    this.setState({tableLoading:true});
    let getDataParam = {
      token,
      st: this.state.areaSDate,
      et: this.state.areaEDate
    };
    Api.CourseManagement.GetLowerAreaReportDateByArea(getDataParam).then(res => {
      if (res.Ret === 0) {
        this.setState({areaTabData: res.Data,tableLoading:false})
      } else {
        message.warning(res.Msg)
      }
    })
  }

// 按区域日期改变
  areaDataChange = (valeu) => {
    this.setState({
      areaSDate: moment(valeu[0]).format(dateFormat),
      areaEDate: moment(valeu[1]).format(dateFormat)
    });
  };
  //区域查询按钮
  areaSearch = () => {
    this.getBarDataByArea();
    this.getTableDataByArea();
  };
  //查看详情(按区域)
  areaSearchDetail = (record) => {
    this.props.history.push({pathname: `/area-detail/${record.PID}`, state: {Areas: record.Areas}})
  };
  //查看详情
  projectSearchDetail = (record) => {
    this.props.history.push(`/project-detail/${record.PlanID}`)
  }

  /*-----------------------按区域 end-------------------------------------*/
  tabSwitch = (value) => {
    console.log(value)
    if (value === "1") {
      this.getBarDataByArea();
      this.getTableDataByArea();
    } else {
      this.getDataByProject();
      this.getTableDataByProject();
    }
  }

  /*-----------------------按项目 start-------------------------------------*/
  getDataByProject = () => {
    //获取区域住状图数据
    this.setState({barLoading:true});
    let getDataParam = {
      token,
      type: 2,//1-按区域；2-按项目
      st: this.state.projectSDate,
      et: this.state.projectEDate
    };
    Api.CourseManagement.GetLowerAreaQtyPeople(getDataParam).then(res => {
      if (res.Ret === 0) {
        this.setState({
          barData: res.Data,
          barLoading:false
        })
      } else {
        message.warning(res.Msg)
      }
    })
  };

//获取项目表格数据（分页）
  getTableDataByProject() {
    const {pageSize, current} = this.state.pagination;
    this.setState({tableLoading:true});
    let NewViewModelList = [];
    let getProjectData = {
      token,
      st: this.state.projectSDate,
      et: this.state.projectEDate,
      pIndex: current,
      pSize: pageSize,
    };
    Api.CourseManagement.GetPlanReportDateByArea(getProjectData).then(res => {
      if (res.Ret === 0) {
        if (res.Data) {
          const pagination = {...this.state.pagination};
          pagination.total = res.Data.TotalRecords;
          pagination.current = res.Data.PageIndex;
          //处理数据
          res.Data.ViewModelList.forEach((item, index) => {
            let obj = {
              PlanID: item.PlanID,
              Name: item.Name,
              TrainType: item.TrainType,
              QtyTrainArea: item.QtyTrainArea,
              ST: item.ST,
              STDesc: item.STDesc,
              QtyProductCredit: item.QtyProductCredit,
              QtyTrainPeople: item.QtyTrainPeople,
              QtyHaveTrainCredit: item.QtyHaveTrainCredit,
              RateQualified: item.RateQualified,
            }
            NewViewModelList.push(obj)
          });
          this.setState({
            dataSource: Object.assign({}, this.state.dataSource, {
              ViewModelList: NewViewModelList
            }),
            pagination,
            tableLoading: false
          })
        } else {
          setTimeout(() => this.setState({tableLoading: false}), 10000)
        }

      }
    })
  }

  //分页改变时触发
  onChangePage(pagination, filters, sorter) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({pagination: pager, loading: true}, () => this.getTableDataByProject());
  }

  // 按项目日期改变
  projecDataChange = (valeu) => {
    this.setState({
      projectSDate: moment(valeu[0]).format(dateFormat),
      projectEDate: moment(valeu[1]).format(dateFormat)
    });
  }
  //按项目查询
  projectSearch = () => {
    this.getDataByProject();
    this.getTableDataByProject();
  }

  /*-----------------------按项目 end-------------------------------------*/


  render() {
    let clientInfo = JSON.parse(decodeURIComponent(sessionStorage.getItem('clientInfo')))
    return (
      <div className='credit-management'>
        <Form layout="inline" className="form-search-group">
          <Tabs defaultActiveKey="1" onTabClick={(value) => this.tabSwitch(value)}>
            <TabPane tab="按区域统计" key="1">
              <Row className='right-row'>
                <FormItem label="查询起止时间">
                  <RangePicker format={dateFormat} onChange={this.areaDataChange}/>
                </FormItem>
                <FormItem>
                  <Button type="primary" onClick={this.areaSearch}>查询</Button>
                </FormItem>
              </Row>
              <Spin spinning={this.state.barLoading}>
                <Row className="table-info">
                  <Col span={6}>
                    <b>{clientInfo.AreaName}学分统计图</b>
                  </Col>
                  {
                    this.state.barData && <AreaBarCharts type="area" barData={this.state.barData}/>
                  }
                </Row>
              </Spin>
              <Row className="table-info" style={{marginTop: "2rem"}}>
                <Col span={6}>
                  <b>{clientInfo.AreaName}学分统计表</b>
                  {/*<span>数据更新时间:2017-5-8</span>*/}
                </Col>
                <Col className='down-table' span={6}> <Button type="primary">下载表格</Button></Col>
              </Row>
              <Spin spinning={this.state.tableLoading}>
                <Row>
                  <Table rowKey="PID" columns={this.areaColumns} dataSource={this.state.areaTabData} bordered/>
                </Row>
              </Spin>
            </TabPane>
            <TabPane tab="按项目统计" key="2">
              <Row className='right-row'>
                <FormItem label="查询起止时间">
                  <RangePicker format={dateFormat} onChange={this.projecDataChange}/>
                </FormItem>
                <FormItem>
                  <Button type="primary" onClick={this.projectSearch}>查询</Button>
                </FormItem>
              </Row>
              <Spin spinning={this.state.barLoading}>
                <Row className="table-info">
                  <Col span={6}>
                    <b>{clientInfo.AreaName}学分统计图</b>
                  </Col>
                  {
                    this.state.barData && <AreaBarCharts type="project" barData={this.state.barData}/>
                  }
                </Row>
              </Spin>
              <Row className="table-info" style={{marginTop: "2rem"}}>
                <Col span={6}>
                  <b>{clientInfo.AreaName}学分统计表</b>
                  {/*<span>数据更新时间:2017-5-8</span>*/}
                </Col>
                <Col className='down-table' span={6}> <Button type="primary">下载表格</Button></Col>
              </Row>
              <Spin spinning={this.state.tableLoading}>
                <Row>
                  <Table rowKey="PlanID" bordered columns={this.projectColumns}
                         pagination={this.state.pagination}
                         dataSource={this.state.dataSource.ViewModelList}
                         onChange={(pagination, filters, sorter) => {
                           this.onChangePage(pagination, filters, sorter)
                         }}
                  />
                </Row>
              </Spin>
            </TabPane>
          </Tabs>
        </Form>
      </div>
    )
  }
}

export default withRouter(CreditManagement);
