/**
 *  Create by xj on 2017/11/16.
 *  fileName: area-detail
 */
import React, {Component} from 'react';
import {Form, Input, Button, Select, DatePicker, Table, message, Row, Col} from 'antd';
import Api from '../../../api';
import {Token} from "../../../utils";

const FormItem = Form.Item;
const Option = Select.Option;
const token = Token();


class AreaDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      cityData: [],
      countyData: [],
      TrainType: [],
      dataSource: {},
      pagination: {pageSize: 10, current: 1},
      Areas: this.props.location.state.Areas
    };
    this.columns = [
      {
        title: '培训项目',
        dataIndex: 'Name',

      },
      {
        title: '培训类型',
        dataIndex: 'TrainType',

      },
      {
        title: '总学分',
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
    ]
  }

  componentDidMount() {
    //获取培训类型
    this.getTraintType()
    //设置顶部查询条件框的内容，并默认获取列表内容
    this.getCurrentUserArea()
  }

  //获取当前人的区域集合
  getCurrentUserArea() {
    const {Areas}=this.state;
    let AreaIDs = Object.keys(Areas);
    let AreaName = Object.values(Areas);
    //设置省市区默认值
    this.props.form.setFieldsValue({
      "province": AreaName[0],
      "city": AreaName[1],
      "district": AreaName[2],
    });
    this.setState({AreaIDs: AreaIDs, loading: false});
    //获取登陆人员的下级区域
    if (AreaIDs[1]) {
      this.getDistrict(AreaIDs[1])
    } else {
      this.getCity(AreaIDs[0])
    }
    // //默认获取指派详情
     this.getPageData(AreaIDs[0], AreaIDs[1], AreaIDs[2])
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


//获取培训类型
  getTraintType = () => {
    Api.CourseManagement.GetTrainTypeList({token}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          TrainType: res.Data
        })
      }
    });
  }

  //获取分页数据
  getPageData(prvID, cityID, countyID,TrianType,keyword) {
    const {pageSize, current} = this.state.pagination;
    let NewViewModelList = [];
    const sendData = {
      token,
      prvID: prvID,
      cityID: cityID||0,
      countyID: countyID || 0,
      keyword:keyword ||"",
      pIndex:current,
      pSize:pageSize,
      trainType:TrianType||0
    };
    Api.CourseManagement.GetCreditReportDateByArea(sendData).then(res => {
      if (res.Ret === 0) {
        if (res.Data) {
          const pagination = {...this.state.pagination};
          pagination.total = res.Data.TotalRecords;
          pagination.current = res.Data.PageIndex;
          //处理数据
          res.Data.ViewModelList.forEach((item, index) => {
            let obj = {
              Name: item.Name,
              TrainType: item.TrainType,
              QtyProductCredit: item.QtyProductCredit,
              QtyCourse: item.QtyCourse,
              QtyTrainPeople: item.QtyTrainPeople,
              QtyHaveTrainCredit: item.QtyHaveTrainCredit,
              RateQualified: item.RateQualified,
              Id:item.Id,
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
    const {AreaIDs, cityID, proID} = this.state;
    console.log(AreaIDs)
    e.preventDefault();
    this.props.form.validateFields((err, values) => {//未使用表单获取的值
      console.log('Received values of form: ', values);
      let cityIDNew = cityID ? cityID : AreaIDs[1];
      let proIDNew = proID ? proID : AreaIDs[2]
      this.getPageData(AreaIDs[0], cityIDNew, proIDNew,values.TrianType,values.keyword)
    });
  };

  render() {
    const {cityData, countyData, TrainType} = this.state;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    return (
      <div className="area-detail">
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
                style={{width: 140, marginRight: "2rem"}}
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
          <FormItem {...formItemLayout} label={'培训类型'}>
            {getFieldDecorator(`TrianType`)(
              <Select
                style={{width: 140}}
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
            )}
          </FormItem>


          <FormItem style={{marginLeft: "2.2rem"}} label="区域关键字">
            {getFieldDecorator(`keyword`)(
              <Input placeholder="请输入区域关键字"/>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" style={{marginLeft: 8}} htmlType="submit">查询</Button>
          </FormItem>

          <Table rowKey="Id" bordered columns={this.columns}
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

export default Form.create()(AreaDetail);
