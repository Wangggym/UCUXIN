import React, {Component} from 'react';

import ServiceAsync from '../../../common/service';
import {trim, debounce} from 'lodash';
import {Token} from "../../../common/utils/token";

// -- AntDesign Components
import {Form, Select, Spin, Cascader, Modal, message} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const token = Token();

class AddAddition extends Component {
  static defaultProps = {
    visible: false,
    years: [],
    type: [],
    area: [],
    data: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      books: [],
      chapter: [],
      knowledge: [],
      area: [...this.props.area],

      fetching: false,
    }
    this.lastFetchId = 0;
    this.getBooks = debounce(this.getBooks, 800);
    this.getChapter = debounce(this.getChapter, 800);
    this.getKnowledge = debounce(this.getKnowledge, 800);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && nextProps.data !== this.props.data) {
      // 修改时调取配置选择数据即 教材与章节
      const propertyList = [];
      if (nextProps.data.TextBookName) {
        propertyList.push({
          label: 'books',
          enumValue: 16,
          keyword: nextProps.data.TextBookName
        })
      }

      if (nextProps.data.PropertyType === 1) {
        propertyList.push({
          label: 'chapter',
          enumValue: 128,
          keyword: nextProps.data.PName
        })
      }
      if (nextProps.data.PropertyType === 2) {
        propertyList.push({
          label: 'knowledge',
          enumValue: 256,
          keyword: nextProps.data.PName
        })
      }

      (async (propertyList) => {
        propertyList.forEach(item => {
          item.promise = this.getProperty(item.enumValue, item.keyword)
        });

        const promises = [];
        for (let property of propertyList) {
          promises.push({label: property.label, promise: await property.promise})
        }

        const properties = {};
        for (let promise of promises) {
          let data = promise.promise;
          if (data.Ret === 0 && data.Data && data.Data.length) {
            properties[promise.label] = data.Data;
          }
        }

        this.setState(Object.assign(properties, {type: nextProps.data.PropertyType}));

      })(propertyList);


      // 区域处理
      (async ()=> {
        const data = nextProps.data;
        const region = this.state.area;
        const promise = [];
        if (+data.ProvinceID) {
          promise.push(this.getRegion(data.ProvinceID))
        }
        if (+data.CityID) {
          promise.push(this.getRegion(data.CityID))
        }
        let [city, area] = await Promise.all(promise).catch(err => console.log(err));

        if(city){
          const cityList = city.Data.map(item=> {
            item.value = item.ID;
            item.label = item.Name;
            return item;
          });

          // 查出市索引
          const aIndex = cityList.findIndex(item=> item.ID === +data.CityID);
          cityList[aIndex].children = area && area.Data.map(item=> {
            item.value = item.ID;
            item.label = item.Name;
            return item;
          });

          // 查出省索引
          const pIndex = region.findIndex(item=> +data.ProvinceID === item.ID);
          region[pIndex].children = cityList
        }
        this.setState({area: region});
      })();


      const data = nextProps.data;
      this.props.form.setFieldsValue({
        year: +data.PartYearID ? data.PartYearID : undefined,
        area: +data.ProvinceID ? [+data.ProvinceID, +data.CityID, +data.AreaID] : undefined,
        book: +data.TextBookID ? data.TextBookID : undefined,
        type: data.PropertyType ? data.PropertyType.toString() : data.PropertyType,
      });
    }


    // 设置区域数据
    if (nextProps.area && nextProps.area !== this.props.area) {
      this.setState({area: nextProps.area})
    }
  }

  // 根据属性类型，关键字，所属关系获取 属性列表
  getProperty(PropertyType, keyword = '', KeyID = 0) {
    return ServiceAsync('GET', 'Resource/v3/Property/GetProperty', {token, PropertyType, keyword, KeyID})
  }

  // 根据关键字获取教材
  getBooks = (value) => {
    value = trim(value);
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
      } else {
        message.error(res.Msg)
      }
    });
  };

  // 根据关键字获取章节
  getChapter = (value, KeyID) => {
    value = trim(value);
    if (!value) return;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({fetching: true});

    this.getProperty(128, value, KeyID).then(res => {
      if (res.Ret === 0) {
        if (fetchId !== this.lastFetchId) return;
        this.setState({
          fetching: false,
          chapter: res.Data && res.Data.length ? res.Data : []
        })
      } else {
        message.error(res.Msg)
      }
    })
  };

  // 根据关键字查询知识点
  getKnowledge = (value, KeyID) => {
    value = trim(value);
    if (!value) return;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({fetching: true});
    this.getProperty(256, value, KeyID).then(res => {
      if (res.Ret === 0) {
        if (fetchId !== this.lastFetchId) return;
        this.setState({
          fetching: false,
          knowledge: res.Data && res.Data.length ? res.Data : []
        })
      } else {
        message.error(res.Msg)
      }
    })
  };

  // 根据省市ID查询子区域
  getRegion(rid) {
    return ServiceAsync('GET', 'Resource/v3/Property/GetRegion', {token, rid});
  }

  // 加载省市县
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

  handleOk = () => {
    const {data, isAdd} = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('请将表单填写完整！');
        return;
      }
      this.props.handleSubmit(values, (isAdd ? 0 : data.ID), this.props.form.resetFields)
    });
  };

  renderPropertyType() {
    const {type, knowledge, chapter, fetching} = this.state;
    const {data} = this.props;
    const {getFieldDecorator} = this.props.form;
    switch (type) {
      case 1:
        return <FormItem label={'章节'}>
          {getFieldDecorator(`chapter`, {initialValue: data.PID, rules: [{required: true, message: "请选择章节"}]})(
            <Select
              showSearch={true}
              placeholder="请输入章节名称查询选择"
              notFoundContent={fetching ? <Spin size="small"/> : '没有数据哦~，请重新输入查询关键字！'}
              filterOption={false}
              onSearch={this.getChapter}
              style={{width: '100%'}}
            >
              {
                chapter.map(item => <Option value={item.ID} key={item.ID}>{item.Value}</Option>)
              }
            </Select>
          )}
        </FormItem>;
      case 2:
        return <FormItem label={'知识点'}>{getFieldDecorator(`knowledge`, {
          initialValue: data.ID,
          rules: [{required: true, message: "请选择知识点"}]
        })(
          <Select
            showSearch={true}
            placeholder="请输入知识点名称查询选择"
            notFoundContent={fetching ? <Spin size="small"/> : '没有数据哦~，请重新输入查询关键字！'}
            filterOption={false}
            onSearch={this.getKnowledge}
            style={{width: '100%'}}
          >
            {
              knowledge.map(item => <Option value={item.ID} key={item.ID}>{item.Value}</Option>)
            }
          </Select>
        )}
        </FormItem>;

      default:
        return null;
    }
  }

  render() {
    const {visible, years, type, handleCancel, confirmLoading, isAdd} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {area, books, fetching} = this.state;
    return (
      <Modal title={`${isAdd ? '新增' : '修改'}附加维度`}
             visible={visible}
             onOk={this.handleOk}
             confirmLoading={confirmLoading}
             onCancel={handleCancel}
             width="600px"
             maskClosable={false}
      >
        <Form>
          <FormItem label={'年份'}> {getFieldDecorator(`year`, {rules: [{required: true, message: "请选择年份"}]})(
            <Select
              showSearch
              style={{width: '100%'}}
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
          <FormItem label={'区域'}>{getFieldDecorator(`area`, {rules: [{required: true, message: "请选择区域"}]})(
            <Cascader
              placeholder="请选择区域"
              options={area}
              loadData={this.loadAreaData}
              changeOnSelect
            />
          )}
          </FormItem>
          <FormItem label={'教材'}>{getFieldDecorator(`book`, {rules: [{required: true, message: "请选择教材"}]})(
            <Select
              showSearch={true}
              placeholder="请输入教材名称查询选择"
              notFoundContent={fetching ? <Spin size="small"/> : '没有数据哦~，请重新输入查询关键字！'}
              filterOption={false}
              onSearch={this.getBooks}
              style={{width: '100%'}}
            >
              {
                books.map(item => <Option value={item.ID} key={item.ID}>{item.Value}</Option>)
              }
            </Select>
          )}
          </FormItem>
          <FormItem label={'类别'}> {getFieldDecorator(`type`, {rules: [{required: true, message: "请选择类别"}]})(
            <Select
              placeholder="请选择类别"
              onChange={(value) => this.setState({type: +value})}
            >
              {
                type.map((item) => <Option value={item.value.toString()} key={item.value}>{item.label}</Option>)
              }
            </Select>
          )}
          </FormItem>
          {this.renderPropertyType()}

        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AddAddition);
