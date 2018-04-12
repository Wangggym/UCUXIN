/**
 * Created by xj on 2017/8/11.
 *
 * 复制的PropertyAssemblage/index,避免造成资源列表的冲突
 *
 * 资源属性集合操作
 * 多条属性选中后生成一个选中数据集合，便于在数据查询时组合查询条件
 * params
 * options: 数组用于查询属性资源数据
 * onChange: 组件值更新后返值
 */

import React, {Component} from 'react';
import {Token} from '../../../common/utils';

import ServiceAsync from '../../service';

// -- Custom Components
import Hierarchy from '../Hierarchy';

// AntDesign Components
import {Form} from 'antd';
const token = Token();
const FormItem = Form.Item;

// 静态属性查询字段， 用于配置查询属性接口字段
const staticQuery = [
  {label: 'phaseID', key: 'PhaseList', value: 1},
  {label: 'gradeID', key: 'GradeList', value: 2},
  {label: 'subjectID', key: 'SubjectList', value: 4},
  {label: 'publisherID', key: 'PublisherList', value: 8},
  {label: 'textBookID', key: 'TextBookList', value: 16},
  {label: 'areaID', key: 'AreaList', value: 32},
  {label: 'partYearID', key: 'PartYearList', value: 64},
  {label: 'chapterID', key: 'ChapterList', value: 128},
  {label: 'knowledgeID', key: 'KnowledgeList', value: 256},
];

class PropertyAssemblage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      selectedOptions: [],
      baseProperties: [],
      additional: [],
      basePropertiesID: undefined
    };
  }
  /*-----------------题库start---------------------*/
  componentDidMount() {
    const {options} = this.props;
    if(options){
      options.PropertyList.forEach(property => {
        for (let item of staticQuery) {
          if (+property.Value === item.value) {
            property.keyName = item.key;
            property.propertyType = item.value;
            return;
          }
        }
      });
      this.setState({
        dataSource: options.PropertyList,
        selectedOptions: [],
        baseProperties: [],
        additional: []
      }, () => this.getBaseProperties(options.Property));
    }
  }
  /*-----------------题库end---------------------*/

  componentWillReceiveProps(nextProps) {
    // 当分类改变时重新加载基础属性, 并设置属性列表数据
    if (nextProps.options && nextProps.options !== this.props.options) {
      nextProps.options.PropertyList.forEach(property => {
        for (let item of staticQuery) {
          if (+property.Value === item.value) {
            property.keyName = item.key;
            property.propertyType = item.value;
            return;
          }
        }
      });
      this.setState({
        dataSource: nextProps.options.PropertyList,
        selectedOptions: [],
        baseProperties: [],
        additional: []
      }, () => this.getBaseProperties(nextProps.options.Property));
    }

    // 当nextProps.options没有数据时 重置当前组件
    if (!nextProps.options) {
      this.setState({
        dataSource: [],
        selectedOptions: [],
        baseProperties: [],
        additional: [],
        basePropertiesID: undefined
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.dataSource === this.state.dataSource) {
      return false;
    }
    return true;
  }

  handlePropertyChange = (value, selectedOption) => {

    const selectedProperty = selectedOption[selectedOption.length - 1];
    const {baseProperties, additional, dataSource} = this.state;
    if (selectedProperty.PropertyType <= 8) {

      // 当空附加属性数据
      dataSource.map(item => {
        if (item.propertyType > 8) {
          Reflect.deleteProperty(item, 'properties');
        }
      })

      const indexInBaseProperties = baseProperties.findIndex(item => item.PropertyType === selectedProperty.PropertyType);
      this.setState({
        baseProperties: indexInBaseProperties >= 0 ? [
          ...baseProperties.slice(0, indexInBaseProperties),
          selectedProperty
        ] : [
          ...baseProperties,
          selectedProperty
        ],
        additional: [],
        dataSource
      }, () => {
        console.log(this.state.baseProperties)
        // 当基础属性选中值长度为4时，则开始查询附加属性
        if (this.state.baseProperties.length === 4) {
          // 查询附加属性
          this.getBasePropertyID();
        } else {
          // 不等于4则表示进行基础属性筛选
          this.getBaseProperties(this.props.options.Property);
        }
        // 传递给父层选中的属性集合
        this.props.onChange([...this.state.baseProperties, ...this.state.additional])
      })
    } else {
      // 附加属性操作
      const indexInAdditional = additional.findIndex(item => item.PropertyType === selectedProperty.PropertyType);

      this.setState({
        additional: indexInAdditional >= 0 ? [
          ...additional.slice(0, indexInAdditional),
          selectedProperty
        ] : [
          ...additional,
          selectedProperty
        ]
      }, () => {
        if (additional.length < 5) this.getAdditional();
        // 传递给父层选中的属性集合
        this.props.onChange([...this.state.baseProperties, ...this.state.additional])
      })
    }
  }

  // 获取基础属性
  getBaseProperties = (property) => {
    const {baseProperties, dataSource} = this.state;

    // 查询参数配置
    const options = {Property: property,token};
    for (let selectedProperty of baseProperties) {
      for (let query of staticQuery) {
        if (selectedProperty.PropertyType === query.value) {
          options[query.label] = selectedProperty.ID;
        }
      }
    }

    ServiceAsync('GET', 'Resource/v3/Property/GetBasePropertyRelation', options).then(res => {
      if (res.Ret === 0) {
        if (res.Data) {
          const data = res.Data;
          // console.log(data)
          Object.keys(data).forEach(key => {
            if (data[key]) {
              for (let item of dataSource) {
                if ((item.keyName === key)) {
                  for (let child of data[key]) {
                    child.value = child.ID;
                    child.label = child.Value;
                  }
                  item.properties = data[key];
                  item.properties.unshift({
                    value: '-1',
                    label: '不限',
                    ID: '-1',
                    PropertyType: item.propertyType,
                    Value: '不限'
                  })
                }
              }
            }
            // 当值为Null 时
            if (!data[key]) {
              const {baseProperties} = this.state;
              for (let sq of staticQuery) {
                if (sq.key === key) {
                  const isInclude = baseProperties.find(bp => bp.PropertyType === sq.value);
                  if (!isInclude) {
                    baseProperties.push({
                      value: '-1',
                      label: '不限',
                      ID: '-1',
                      PropertyType: sq.value,
                      Value: '不限'
                    });
                    this.setState({baseProperties})
                  }
                }
              }
            }
          });

          this.setState({dataSource: [...this.state.dataSource]});
        }
      }
    });
  }

  // 获取附加属性标识
  getBasePropertyID = () => {
    const {baseProperties} = this.state;
    let query = {};
    for (let bp of baseProperties) {
      for (let sq of staticQuery) {
        if (bp.PropertyType === sq.value) {
          query[sq.label] = (+bp.ID < 0 ? 0 : bp.ID)
        }

      }
    }
    ServiceAsync('GET', 'Resource/v3/Property/GetBasePropertyID', query).then(res => {
      if (res.Ret === 0) {
        if (res.Data) {
          this.setState({
            basePropertiesID: res.Data
          }, () => this.getAdditional())
        }
      }
    });
  }

  // 获取附加属性
  getAdditional = () => {
    const {basePropertiesID, dataSource, additional} = this.state;
    const options = {
      dimRelID: basePropertiesID,
      Property: this.props.options.Property
    };

    for (let selectedProperty of additional) {
      for (let query of staticQuery) {
        if (selectedProperty.PropertyType === query.value) {
          options[query.label] = selectedProperty.ID;
        }
      }
    }

    ServiceAsync('GET', 'Resource/v3/Property/GetAppendPropertyRelation', options).then(res => {
      if (res.Ret === 0) {
        if (res.Data) {
          const data = res.Data;
          Object.keys(data).forEach(key => {
            if (data[key]) {
              for (let item of dataSource) {
                if ((item.keyName === key)) {
                  for (let child of data[key]) {
                    child.value = child.ID;
                    child.label = child.Value;
                  }
                  item.properties = data[key];
                  item.properties.unshift({
                    value: '-1',
                    label: '不限',
                    ID: '-1',
                    PropertyType: item.propertyType,
                    Value: '不限'
                  })

                }
              }
            }
            // 当值为Null 时
            if (!data[key]) {
              const {additional} = this.state;
              for (let sq of staticQuery) {
                if (sq.key === key) {
                  const isInclude = additional.find(bp => bp.PropertyType === sq.value);
                  if (!isInclude) {
                    additional.push({
                      value: '-1',
                      label: '不限',
                      ID: '-1',
                      PropertyType: sq.value,
                      Value: '不限'
                    });
                    this.setState({additional})
                  }
                }
              }
            }
          });

          this.setState({dataSource: [...this.state.dataSource]});
        }
      }
    });
  }

  render() {
    const {dataSource, baseProperties} = this.state;
    // 验证当前属性集合是否需要显示
    const showPropertyAssemblage = () => {
      for (let item of dataSource) {
        if (item.isChecked && item.properties) {
          return true;
        }
      }
      return false;
    };

    return (
      showPropertyAssemblage() ? <div className="form-search-group">
        {
          /* 循环展示出属性列表，并设置其初始值为不限
          * 组件Hierarchy 默认选中属性值: initialValue="0"
          * */
          dataSource.map(item => {
            if (item.isChecked && item.properties) {
              return (
                <FormItem label={item.Text} className="line-block" key={item.Value}>
                  <Hierarchy options={item.properties} onChange={this.handlePropertyChange}/>
                </FormItem>
              )


           }
          })
        }
      </div> : null
    )
  }
}

export default PropertyAssemblage;
