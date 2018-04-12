/**
 * Created by QiHan Wang on 2017/7/12.
 * 数据资源树
 * 无限树：子级数据提升到与父级同级显示
 *
 * params:
 * options: 数据集合 数组
 * onChange: 组件值更新时操作
 * loadData: 动态加载子级数据
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './hierarchy.scss';

// -- AntDesign Components
import {Radio, Spin} from 'antd';

const RadioGroup = Radio.Group;

class Hierarchy extends Component {
  static defaultProps = {
    initialValue: [],
    options: [],
    onChange() {
    }
  }

  static propTypes = {
    initialValue: PropTypes.array,
    options: PropTypes.array,
    onChange: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedOptions: [],
      values: [],
      isLoading: false
    }
  }

  // 组件首次实例化时
  componentWillMount() {
    this.setState({data: [this.props.options]});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options && nextProps.options !== this.props.options) {
      // 抽取子节点数据到与父层平级
      const data = [nextProps.options];
      const {values} = this.state;
      for (let i = 0; i < values.length; i++) {
        if (data[i]) {
          for (let item of data[i]) {
            if (item.value === values[i]) {
              if (item.children && Array.isArray(item.children)) data.push(item.children)
            }
          }
        }
      }

      if(this.state.isLoading){
        this.setState({data, isLoading: false});
      }else{
        this.setState({data, selectedOptions:[], values: []});
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.data === this.state.data) {
      return false;
    }
    return true;
  }

  // 查找出选中的数据
  handleFilterSelected = (value, data) => data.find(item => value === item.value);

  // 层级值改变时
  handleChange = (index, e) => {
    const {data} = this.state;
    const value = e.target.value;
    let selectedOption = this.handleFilterSelected(value, data[index]);


    this.setState({
      // 更新子节点数据
      data: [...this.state.data.slice(0, index + 1)],
      // 更新选中的对象
      selectedOptions: [
        ...this.state.selectedOptions.slice(0, index),
        selectedOption
      ],
      // 更新选中值
      values: [
        ...this.state.values.slice(0, index),
        selectedOption.value
      ]
    }, () => {
      // 返回选中值
      this.props.onChange(this.state.values, this.state.selectedOptions);

      // 当不存在子节点时
      if (!selectedOption.isLeaf) return;

      // 当存在子节点， 并且不存在子节点数据，则从服务端获取数据
      if (selectedOption.isLeaf && !(selectedOption.children && selectedOption.children.length)) {
        this.props.loadData(this.state.selectedOptions);
        this.setState({isLoading: true});
      } else {
        // 当存在子节点， 并且存在子节点数据则直接添加子节点数据
        this.setState({
          data: [
            ...this.state.data.slice(0, index + 1),
            selectedOption.children
          ]
        })
      }
    })
  }

  render() {
    const {data, selectedOptions, values} = this.state;
    const {initialValue} = this.props;
    return (
      <div className="hierarchy">
        {
          data.map((item, i) => {
            return(
              <RadioGroup defaultValue={initialValue[i]} options={item} value={values[i]}
                          onChange={(e) => this.handleChange(i, e)} className="hierarchy-leave"
                          key={i}/>
            )
            }
          )
        }
        {
          selectedOptions.length && selectedOptions[selectedOptions.length - 1].loading ?
            <div style={{textAlign: 'center', marginTop: '10px'}}><Spin tip="Loading..."/></div> : null
        }
      </div>
    )
  }
}

export default Hierarchy;
