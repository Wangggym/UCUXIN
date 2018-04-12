/**
 * Created by QiHan Wang on 2017/7/14.
 */
import React from 'react';
import {Select} from 'antd';
const Option = Select.Option;

export default class SelectTableCell extends React.Component {

  static defaultProps = {
    selected: null,
    editable: false,
    data: [],
    status: undefined,
    onChange(){}
  }

  constructor(props){
    super(props)
    this.state = {
      value: this.props.selected ? this.props.selected.Name : undefined,
      editable: this.props.editable || false,
      data: this.props.data,
      selected: this.props.selected
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({editable: nextProps.editable});
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
        this.cacheSelected = this.state.selected;
      }
    }
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        this.props.onChange(this.state.selected);
      } else if (nextProps.status === 'cancel') {
        this.setState({value: this.cacheValue});
        this.props.onChange(this.cacheSelected);
      }
    }

    if(nextProps.data && nextProps.data !== this.props.data){
      this.setState({data: nextProps.data})
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable || nextState.value !== this.state.value || nextProps.data !== this.state.data;
  }

  handleChange(value) {
    const selected = this.state.data.filter(item => item.Name === value)[0];
    this.props.callback && this.props.callback(selected.ID);
    this.setState({value, selected});
  }

  render() {
    const {value, editable, data} = this.state;
    return (
      editable ?
        <Select
          defaultValue={value}
          showSearch
          style={{width: '100%'}}
          placeholder="请选择"
          optionFilterProp="children"
          onChange={this.handleChange.bind(this)}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {
            data.map((item)=> <Option value={item.Name} key={item.ID}>{item.Name}</Option>)
          }
        </Select>
        :
        <div className="editable-row-text">
          {value ? value.toString() : ''}
        </div>
    );
  }
}
