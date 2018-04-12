/**
 * Created by QiHan Wang on 2017/7/17.
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import ServiceAsync from '../../../common/service';
import {trim, debounce} from 'lodash';
import {SearchParamName, Token} from '../../../common/utils';


// -- Custom Components
import AddAddition from './AddAddition';

// -- AntDesign Components
import {Form, Button, Select, Table, Spin, Cascader} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const token = Token();

class AdditionalDimension extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],

      years: [],
      books: [],
      area: [],
      type: [
        {
          value: 1,
          label: '章节'
        },
        {
          value: 2,
          label: '知识点'
        }
      ],
      chapter: [],
      knowledge: [],

      fetching: false,
      loading: false,

      pagination: {pageSize: 10, current: 1},
      queryFields: {
        type: 0,
        year: 0,
        area: 0,
        book: 0
      },

      visible: false,
      editData: {}
    }
    this.lastFetchId = 0;

    this.getBooks = debounce(this.getBooks, 800);


    // 表格列配置
    this.columns = [
      {
        title: '年份',
        dataIndex: 'PartYearName',
        width: '18%'
      },
      {
        title: '区域',
        dataIndex: 'Area',
        width: '18%',
        render: (text, record, index) => [record.ProvinceName, record.CityName, record.AreaName].join('/')
      }
      ,
      {
        title: '教材',
        dataIndex: 'TextBookName',
        width: '18%',
      },
      {
        title: '类型',
        dataIndex: 'PropertyTypeName',
        width: '18%',
      },
      {
        title: '章节/知识点',
        dataIndex: 'PName',
        width: '18%'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        render: (text, record, index) => {
          return (
            <div className="editable-operations">
              <a onClick={() => {
                this.handleSave(1, record);
              }}>编辑</a>
            </div>
          );
        },
      },
    ];
  }

  componentDidMount() {
    (async () => {
      const propertyList = [
        {
          label: 'years',
          enumValue: 64
        }
      ];

      propertyList.map(item => {
        item.promise = this.getProperty(item.enumValue)
      });

      const promises = [];
      for (let property of propertyList) {
        promises.push({label: property.label, promise: await property.promise})
      }

      const properties = {}
      for (let promise of promises) {
        let data = promise.promise;
        if (data.Ret === 0 && data.Data && data.Data.length) {
          properties[promise.label] = data.Data;
        }
      }


      this.setState(Object.assign(this.state, properties))
    })();

    this.getArea();       // 获取区域一级地区
    this.getAdditional(); // 查询所有附加属性
  }

  // 根据属性类型，关键字，所属关系获取 属性列表
  getProperty(PropertyType, keyword = '', KeyID = 0) {
    return ServiceAsync('GET', 'Resource/v3/Property/GetProperty', {token, PropertyType, keyword, KeyID})
  }

  // 根据关键字获取教材
  getBooks = (value) => {
    value = trim(value);// value.replace(/(^\s*)|(\s*$)/g, "");
    if (!value) return;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({fetching: true});

    this.getProperty(16, value).then(res => {
      if (res.Ret === 0) {
        if (fetchId !== this.lastFetchId) return;
        this.setState({
          fetching: false,
          books: res.Data && res.Data.length ? res.Data : []
        })
      }
    });
  }

  // 根据省市ID查询子区域
  getRegion(rid) {
    return ServiceAsync('GET', 'Resource/v3/Property/GetRegion', {token, rid});
  }

  // 获取省市县
  getArea = (rid = 0) => {
    this.getRegion(rid).then(res => {
      if (res.Ret === 0) {
        let data = res.Data;
        if (data && data.length) {
          data.map(item => Object.assign(item, {label: item.Name, value: item.ID, isLeaf: false}))
        }
        this.setState({area: data})
      }
    })
  }

  // 动态加载省市县
  loadAreaData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.getRegion(targetOption.ID).then(res => {
      targetOption.loading = false;
      targetOption.children = [];
      if (res.Ret === 0) {
        for (let item of res.Data) {
          targetOption.children.push(Object.assign(item, {label: item.Name, value: item.ID, isLeaf: item.Type === 3}))
        }
      }

      this.setState({
        area: [...this.state.area],
      });
    })
  }

  // 获取附加属性列表
  getAdditional(current) {
    this.setState({loading: true});
    const {pageSize} = this.state.pagination;
    const {area, year, book, type} = this.state.queryFields;
    ServiceAsync('GET', 'Resource/v3/AppendPropertyRelation/GetPageByCondition', {
      token,
      basePropertyRelationID: SearchParamName('propertyID'),
      propertyType: type,
      partYearID: year,
      areaID: area,
      textBookID: book,
      pIndex: current || 1,
      pSize: pageSize
    }).then(res => {
      if (res.Ret === 0) {
        let dataSource = [];
        const pagination = {...this.state.pagination};
        if (res.Data && res.Data.ViewModelList) {
          pagination.total = res.Data.TotalRecords;
          pagination.current = res.Data.PageIndex;
          dataSource = res.Data.ViewModelList
        }
        this.setState({dataSource, pagination, loading: false})
      }
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        queryFields: Object.assign(this.state.queryFields, {
          type: values.type || 0,
          year: values.year || 0,
          area: values.area && values.area.length ? values.area[values.area.length - 1] : 0,
          book: values.book || 0
        })
      }, () => this.getAdditional(1))
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  // new add or edit
  handleSave = (isAdd, record) => {
    this.setState({
      visible: true,
      isAdd: !isAdd,
      editData: record
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({pagination: pager});
    this.getAdditional(pagination.current);
  }

  render() {
    //附加维度关系
    const {getFieldDecorator} = this.props.form;
    const {dataSource, years, fetching, books, area, type, pagination, loading, visible, isAdd, confirmLoading, editData} = this.state;
    const columns = this.columns;
    return (
      <div className="additional-dimension">
        <Form layout="inline" onSubmit={this.handleSearch} style={{marginBottom: 15}}>
          <FormItem label={'类型'}>
            {getFieldDecorator(`type`)(
              <Select
                allowClear
                style={{width: 200}}
                placeholder="请选择类型">
                {
                  type.map(item => <Option value={item.value.toString()} key={item.value}>{item.label}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem label={'年份'}>
            {getFieldDecorator(`year`)(
              <Select
                showSearch
                allowClear
                style={{width: 200}}
                placeholder="请选择年份"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {
                  years.map(item => <Option value={item.ID} key={item.ID}>{item.Value}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem label={'区域'}>
            {getFieldDecorator(`area`)(
              <Cascader
                placeholder="请选择区域"
                style={{width: 200}}
                options={area}
                loadData={this.loadAreaData}
                changeOnSelect
              />
            )}
          </FormItem>
          <FormItem label={'教材'}>
            {getFieldDecorator(`book`)(
              <Select
                allowClear
                showSearch={true}
                placeholder="请输入教材名称查询选择"
                notFoundContent={fetching ? <Spin size="small"/> : '没有数据哦~'}
                filterOption={false}
                onSearch={this.getBooks}
                style={{width: 200}}
              >
                {
                  books.map(item => <Option value={item.ID} key={item.ID}>{item.Value}</Option>)
                }
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
            <Button style={{marginLeft: 8}} type="primary" onClick={() => this.handleSave(0)}>新增</Button>
          </FormItem>
        </Form>
        <Table
          rowKey="ID"
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          loading={loading}
          onChange={this.handleTableChange}
        />


        {/* 新增 */}
        <AddAddition
          data={editData}
          isAdd={isAdd}
          visible={visible}
          years={years}
          type={type}
          area={area}
          handleCancel={() => this.setState({visible: false})}
          handleSubmit={(values, id, callback) => {
            this.setState({confirmLoading: true,});
            ServiceAsync('POST', 'Resource/v3/AppendPropertyRelation/AddOrEdit', {
              token,
              body: {
                ID: id,
                PropertyRelID: SearchParamName('propertyID'),
                PartYearID: values.year,
                AreaID: values.area[values.area.length - 1],
                TextBookID: values.book,
                PID: +values.type === 1 ? values.chapter : values.knowledge,
                PropertyType: values.type
              }
            }).then(res => {
              // 错误验证未做
              if (res.Ret === 0) {
                this.setState({visible: false});
                callback();

                this.getAdditional(1)
              }
              this.setState({confirmLoading: false});
            });
          }}
          confirmLoading={confirmLoading}
        />
      </div>
    )
  }
}

export default withRouter(Form.create()(AdditionalDimension))
