/**
 * Created by QiHan Wang on 2017/7/12.
 */
import React, {Component} from 'react';
import ServiceAsync from '../../../common/service';
import './main.scss';
import {Token} from '../../../common/utils';

// -- Custom Component
import Hierarchy from '../../../common/components/Hierarchy';
import PropertyAssemblage from '../../../common/components/PropertyAssemblage';
import TextFile from './TextFile';

// -- AntDesign Components
import {Form, Button, Radio, Checkbox} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const token = Token();


class FilesUpload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      domain: [],       // 领域
      tags: [],         // 标签
      category: [],     // 分类,
      crowd: [],        // 人群

      loading: false
    }
  }
  componentDidMount() {
    this.getDomain();
    this.getCrowd();
    this.getCategory(1);
    this.getTags(1);
  }

  // 获取领域分类
  getDomain() {
    ServiceAsync('GET', 'Resource/v3/Category/GetDomianList',{token}).then(res => {
      if (res.Ret === 0) {
        if (res.Data && res.Data.length) {
          this.setState({
            domain: res.Data
          })
        }
      }
    })
  }

  // 获取适用对象
  getCrowd() {
    ServiceAsync('GET', 'Resource/v3/Category/GetPeopleList',{token}).then(res => {
      if (res.Ret === 0) {
        const crowd = [];
        if (res.Data && res.Data.length) {
          res.Data.unshift({Text: "不限", Value: "0", isChecked: false})
          res.Data.map(item => crowd.push(Object.assign(item, {label: item.Text, value: item.Value})));
        }
        this.setState({crowd})
      }
    })
  }

  // 根据领域获取分类列表
  getCategory(doMain, property = 0, parentID = 0) {
    ServiceAsync('GET', 'Resource/v3/Category/GetCategoryListByParentID', {token,doMain, property, parentID}).then(res => {
      if (res.Ret === 0) {
        const category = [];
        if (res.Data && res.Data.length) {
          res.Data.map(item => category.push(Object.assign(item, {
            label: item.Name,
            value: item.ID,
            isLeaf: item.HasChild
          })))
        }
        this.setState({category})
      }
    })
  }

  // 动态分类子类
  loadCategoryData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    const domain = this.props.form.getFieldValue('domain');

    ServiceAsync('GET', 'Resource/v3/Category/GetCategoryListByParentID', {
      token,
      domain,
      property: 0,
      parentID: targetOption.ID
    }).then(res => {
      targetOption.loading = false;
      targetOption.children = [];
      if (res.Ret === 0) {
        for (let item of res.Data) {
          targetOption.children.push(Object.assign(item, {label: item.Name, value: item.ID, isLeaf: item.HasChild}))
        }
      }
      this.setState({category: [...this.state.category]});
    })
  };

  // 根据领域获取标签
  getTags(domain) {
    ServiceAsync('GET', 'Resource/v3/Resource/TagList', {token,domain}).then(res => {
      if (res.Ret === 0) {
        let tags = [];
        if (res.Data && res.Data.length) {
          res.Data.map(item => tags.push(Object.assign(item, {label: item.Name, value: item.ID})));
        }
        this.setState({tags})
      }
    })
  }

  // 重置提交数据
  handleReset = () => {
    this.props.form.resetFields();
    this.setState({tags: [], category: [],selectedCategory: undefined});
    this.getCategory(1);
    this.getTags(1);
  };

  handleChangeDomain = (e) => {
    //  初始化数据
    this.setState({selectedCategory: undefined});
    this.props.form.resetFields(['category', 'tags']);
    this.getCategory(e.target.value);
    this.getTags(e.target.value);
  };

  // 分类模块改变时
  handleChangeCategory = (values, selectedOptions) => {
    const selectedOption = selectedOptions[selectedOptions.length - 1];
    // 设置属性区段
    this.setState({selectedCategory: selectedOption});
  };

  handleUpload = (fn)=> this.props.form.validateFields((err, values) => fn(err, values));

  handleCancel = ()=> this.props.form.resetFields();

  render() {
    const {getFieldDecorator} = this.props.form;
    const {domain, crowd, tags, category, selectedCategory} = this.state;

    return (
      <div className="resource-list">
        <Form className="form-search-group" style={{marginBottom: '15px'}}>
          <FormItem label={'所属领域'} className="line-block">
            {getFieldDecorator(`domain`, {initialValue: '1', rules: [{required: true}]})(
              <RadioGroup onChange={this.handleChangeDomain}>
                {
                  domain.map((item => <Radio value={item.Value} key={item.Value}>{item.Text}</Radio>))
                }
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label={'适用对象'} className="line-block">
            {getFieldDecorator(`crowd`,{ rules: [{required: true, message:'请选择适用对象'}]})(<RadioGroup options={crowd} />)}
          </FormItem>
          <FormItem label={'所属分类'} className="line-block">
            {getFieldDecorator(`category`,{ rules: [{required: true, message:'请选择分类'}]})(
              <Hierarchy
                options={category}
                onChange={this.handleChangeCategory}
                loadData={this.loadCategoryData}
              />
            )}
          </FormItem>
          {/* 属性展示 */}

          <FormItem label={'属性'} className="line-block">
            {getFieldDecorator(`property`,{ rules: [{required: true, message:'请选择属性'}]})(
              <PropertyAssemblage className="ant-form" options={selectedCategory}/>
            )}
          </FormItem>
          <FormItem label={'标签'} className="line-block">
            {getFieldDecorator(`tags`)(<CheckboxGroup options={tags}/>)}

          </FormItem>
          <div className="line-block" style={{margin: '5px 0', paddingBottom: '5px', border:0}}>
            <FormItem style={{flex: 1, marginRight: 0, textAlign: 'right'}}>
              <Button style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
            </FormItem>
          </div>

          {/* 文件上传 */}
          <TextFile className="line" onUpload={this.handleUpload} onCancel={this.handleCancel} tags={tags} {...this.props}/>
        </Form>
      </div>
    );
  }
}
export default Form.create()(FilesUpload);
