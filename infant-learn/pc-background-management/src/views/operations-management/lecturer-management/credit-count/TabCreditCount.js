/**
 *  Create by xj on 2017/11/21.
 *  fileName: CreditCount
 */
import React, {Component} from 'react';
import {Form, Input, Button, Tabs, Select, Table, message} from 'antd';
import Api from '../../../../api';
import {Token} from "../../../../utils";

const token = Token();
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class TabCreditCount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      provinceData: [],
      cityData: [],
      countyData: [],
      TrainType: [],
      dataSource: {},
      pagination: {pageSize: 10, current: 1},
      type:this.props.type
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
        title: '参培园所',
        dataIndex: 'GName',

      },
      {
        title: '总学分',
        dataIndex: 'QtyProductCredit',

      },
      {
        title: '开课数量',
        dataIndex: 'QtyCourse',

      },
      {
        title: '参培人数',
        dataIndex: 'QtyTrainPeople',

      },
      {
        title: '有学分人数',
        dataIndex: 'QtyHaveTrainCredit',

      }
    ]
    this.projectColumns = [
      {
        title: '培训项目',
        dataIndex: 'Name',
      }, {
        title: '培训类型',
        dataIndex: 'TrainType',
      }, {
        title: '参培区域',
        dataIndex: 'QtyTrainArea',
      }, {
        title: '参培园所',
        dataIndex: 'GName',
      }, {
        title: '总学分',
        dataIndex: 'QtyProductCredit',
      }, {
        title: '开课数量',
        dataIndex: 'QtyCourse',
      }, {
        title: '参培人数',
        dataIndex: 'QtyTrainPeople',
      }, {
        title: '有学分人数',
        dataIndex: 'QtyHaveTrainCredit',
      },
    ]
  }

  componentDidMount() {
    //获取培训类型
    this.getTraintType();
    //获取区域数据
    if(this.state.type==="1"){
      this.getProviceData()
    }else{
      this.getPageData()
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.type!==this.props.type){
      this.setState({
        type:nextProps.type
      })
    }
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
  };
//获取省市区数据
  getProviceData = () => {
    this.getRegion(0, 0)
  };
//切换省
  provinceChange = (provinceID) => {
    this.props.form.setFieldsValue({
      city: '',
      district: ''
    });
    //切换省获取市
    this.getRegion(provinceID, 1)
  };
  //切换市
  cityChange = (cityID) => {
    this.props.form.setFieldsValue({
      district: ''
    });
    this.getRegion(cityID, 2)
  };
  getRegion = (rid, type) => {
    this.setState({loading: true});
    const getConfigData = {
      token,
      rid: rid
    };
    Api.CourseManagement.GetRegion(getConfigData).then(res => {
      if (res.Ret === 0) {
        switch (type) {
          case 0:
            this.setState({provinceData: res.Data, loading: false});
            break;
          case 1:
            this.setState({cityData: res.Data, loading: false});
            break;
          case 2:
            this.setState({countyData: res.Data, loading: false});
            break;
        }
      } else {
        message.warning(res.Msg)
      }
    })
  };

//查询
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.getPageData(values.province, values.city, values.district, values.TrianType, values.keyword)
    });
  };

  //获取分页数据
  getPageData(prvID, cityID, countyID, TrianType, keyword) {
    const {pageSize, current} = this.state.pagination;
    let NewViewModelList = [];
    if(this.state.type==="1"){
      if (!prvID) {
        message.warning('请选择省份');
        return;
      }
      this.setState({loading: true})
      const sendData = {
        token,
        prvID: prvID,
        cityID: cityID || 0,
        countyID: countyID || 0,
        keyword: keyword || "",
        pIndex: current,
        pSize: pageSize,
        trainType: TrianType || 0,
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
                Id: item.Id
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
    }else{
      this.setState({loadign:true});
      const sendData={
        token,
        trainType:TrianType||0,
        keyword:keyword||"",
        pIndex: current,
        pSize: pageSize,
      };
      Api.CourseManagement.GetCreditReportDateByPlan(sendData).then(res=>{
        if (res.Ret === 0) {
          if (res.Data) {
            const pagination = {...this.state.pagination};
            pagination.total = res.Data.TotalRecords;
            pagination.current = res.Data.PageIndex;
            //处理数据
            res.Data.ViewModelList.forEach((item, index) => {
              let obj = {
                Id: item.Id,
                Name: item.Name,
                TrainType: item.TrainType,
                GName: item.GName,
                QtyTrainArea: item.QtyTrainArea,
                QtyProductCredit: item.QtyProductCredit,
                QtyCourse: item.QtyCourse,
                QtyTrainPeople: item.QtyTrainPeople,
                QtyHaveTrainCredit: item.QtyHaveTrainCredit,
                RateQualified: item.RateQualified,
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




  }

//分页改变时触发
  onChangePage(pagination, filters, sorter) {

    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({pagination: pager, loading: true}, () => this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      this.getPageData(values.province, values.city, values.district, values.TrianType, values.keyword)
    }));
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {provinceData, cityData, countyData, TrainType,type} = this.state;
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    return (
      <Form layout="inline" className="form-search-group" onSubmit={this.handleSearch}>
        {
          type==="1"&& <FormItem {...formItemLayout} label={'省'}>
            {getFieldDecorator(`province`)(
              <Select
                style={{width: 140}}
                placeholder="省"
                optionFilterProp="children"
                onChange={(value) => {
                  this.provinceChange(value)
                }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  provinceData.map((item, key) => {
                    return (
                      <Option value={`${item.ID}`} key={item.ID}>{item.Name}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
        }
        {
          type==="1"&&<FormItem {...formItemLayout} label={'市'}>
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
        }
        {
          type==="1"&&<FormItem {...formItemLayout} label={'区'} style={{marginRight: "2rem"}}>
            {getFieldDecorator(`district`)(
              <Select
                style={{width: 140}}
                placeholder="请选择区"
                optionFilterProp="children"
                onChange={(id) => {
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
        }

        <FormItem {...formItemLayout} label={'培训类型'}>
          {getFieldDecorator(`TrianType`)(
            <Select
              allowClear
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
        <FormItem {...formItemLayout} label={'关键字'}>
          {getFieldDecorator(`keyword`)(
            <Input placeholder="请输入关键字查询"/>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" style={{marginLeft: 18}} htmlType="submit">查询</Button>
        </FormItem>
        <Table rowKey="Id" bordered columns={type==="1"?this.columns:this.projectColumns}
               style={{marginTop: "0.5rem"}}
               loading={this.state.loading}
               pagination={this.state.pagination}
               dataSource={this.state.dataSource.ViewModelList}
               onChange={(pagination, filters, sorter) => {
                 this.onChangePage(pagination, filters, sorter)
               }}
        />
      </Form>
    )
  }
};
export default Form.create()(TabCreditCount);
