/**
 * Created by QiHan Wang on 2017/8/14.
 * QeustionIntro
 */
import React, { Component } from 'react';
import Api from '../../../../api';
import Config from '../../../../common/config';
// --
import PropertyAssemblage from '../../../../common/components/PropertyAssemblage';
import Hierarchy from '../../../../common/components/Hierarchy';

// -- Ant Design Component
import { Form, Radio, Modal, Checkbox, Button, message } from 'antd';
import './formStyle.scss'
import ServiceAsync from '../../../../common/service';
import { Token } from '../../../../common/utils';
const token = Token();
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    //获取难度
    ServiceAsync('GET', 'QuePap/v3/Question/GetDifficulty', {token}).then(res => {
      if (!res) return message.info('res为空')
      if (res.Ret === 0) {
        this.setState({
          difficultyType: res.Data
        })
      }
    });
    this.getBasicData().then(res => this.setState({ ...res }));

  }

  getBasicData = async () => {
    const { getFieldsValue } = this.props.form;
    const { domainSelected } = getFieldsValue();
    const [crowds, domain, categories, tags] = await Promise.all([

      Api.TopicVolume.getCrowds(),
      Api.TopicVolume.getDomain(),
      Api.TopicVolume.getCategory(domainSelected),
      Api.TopicVolume.getTags(domainSelected)
    ]);

    let result = {};

    // 人群数据处理
    if (crowds.Ret === 0) {
      if (crowds.Data && crowds.Data.length) {
        result.crowds = crowds.Data;
      }
    }

    // 人群数据处理
    if (domain.Ret === 0) {
      if (domain.Data && domain.Data.length) {
        result.domain = domain.Data;
      }
    }
    // 分类数据处理
    if (categories.Ret === 0) {
      if (categories.Data && categories.Data.length) {
        result.categories = categories.Data.map(item => {
          Object.assign(item, {
            label: item.Name,
            value: item.ID,
            isLeaf: item.HasChild
          });
          return item;
        });
      }
    }

    // 分类数据处理
    if (tags.Ret === 0) {
      if (tags.Data && tags.Data.length) {
        result.tags = tags.Data;
      }
    }
    return result;
  }

  // 获取分类
  getCategory = (domainSelected) => {
    Api.TopicVolume.getCategory(domainSelected).then(res => {
      if (res.Ret === 0) {
        if (res.Data && res.Data.length) {
          this.setState({
            categories: res.Data.map(item => {
              Object.assign(item, {
                label: item.Name,
                value: item.ID,
                isLeaf: item.HasChild
              });
              return item;
            })
          })
        }
      }
    })
  }
  // 获取标签
  getTags = (domainSelected) => {
    Api.TopicVolume.getTags(domainSelected).then(res => {
      if (res.Ret === 0) {
        if (res.Data && res.Data.length) {
          this.setState({ tags: res.Data })
        }
      }
    })
  }

  handleChangeDomain = (e) => {
    this.setState({ categories: [], tags: [] });
    this.props.form.resetFields(['categorySelected', 'tagSelected']);
    this.getCategory(e.target.value)
    this.getTags(e.target.value)
  }

  handleChangeCategory = (values, selectedOptions) => {
    const selectedOption = selectedOptions[selectedOptions.length - 1];
    // 设置属性区段
    this.setState({ categorySelectedObj: selectedOption });
  }

  // 动态分类子类
  loadCategoryData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    const domain = this.props.form.getFieldValue('domainSelected');

    Api.TopicVolume.getCategory(domain, 0, targetOption.ID).then(res => {
      targetOption.loading = false;
      targetOption.children = [];
      if (res.Ret === 0) {
        for (let item of res.Data) {
          targetOption.children.push(Object.assign(item, { label: item.Name, value: item.ID, isLeaf: item.HasChild }))
        }
      }
      this.setState({ categories: [...this.state.categories] });
    })
  }

  // 重置提交数据
  // handleReset = () => {
  //   this.props.form.resetFields();
  //   this.setState({ tags: [], category: [], selectedCategory: undefined });
  //   this.getCategory(1);
  //   this.getTags(1);
  // }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { domain, crowds, categories, tags, categorySelectedObj } = this.state;
    return (
      <div>
        <Form layout="inline" className="form-search-group">
          <FormItem label={'所属领域'} className="line-block" style={{ display: 'none' }}>
            {getFieldDecorator(`domainSelected`, { initialValue: '1', rules: [{ required: true }] })(
              <RadioGroup onChange={this.handleChangeDomain}>
                {
                  Array.isArray(domain) && domain.map((item => <Radio value={item.Value}
                    key={item.Value}>{item.Text}</Radio>))
                }
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label={'适用对象'} className="line-block">
            {getFieldDecorator(`People`)(
              <RadioGroup>
                {
                  Array.isArray(crowds) && crowds.map((item => <Radio value={item.Value}
                    key={item.Value}>{item.Text}</Radio>))
                }
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label={'所属分类'} className="line-block">
            {getFieldDecorator(`CategroyIDs`)(
              <Hierarchy
                options={categories}
                onChange={this.handleChangeCategory}
                loadData={this.loadCategoryData}
              />
            )}
          </FormItem>
          {/*属性展示*/}
          {getFieldDecorator(`PropertyList`)(
            <PropertyAssemblage options={categorySelectedObj} />
          )}

          <FormItem label={'标签'} className="line-block">
            {getFieldDecorator(`ResourceTags`)(
              <CheckboxGroup>{
                Array.isArray(tags) && tags.map((item => <Checkbox value={item.ID}
                  key={item.ID}>{item.Name}</Checkbox>))
              }
              </CheckboxGroup>
            )}
          </FormItem>
          <FormItem label="难度" className=" line-block">
            {getFieldDecorator(`Difficulty`)(
              <RadioGroup>
                {
                  this.state.difficultyType && this.state.difficultyType.map((item, index) => {
                    return (
                      <Radio value={item.Value} key={index}>{item.Text}</Radio>
                    )
                  })
                }
              </RadioGroup>
            )}
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create({
  onValuesChange: (props, values) => {
    props.onChange(values)
  }
})(Category);
