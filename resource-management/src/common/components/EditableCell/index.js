/**
 * Created by QiHan Wang on 2017/7/14.
 */
import React from 'react';
import { Table, Input } from 'antd';

export default class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: this.props.editable || false,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        this.props.onChange(this.state.value);
      } else if (nextProps.status === 'cancel') {
        this.setState({ value: this.cacheValue });
        this.props.onChange(this.cacheValue);
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
      nextState.value !== this.state.value;
  }
  handleChange(e) {
    const value = e.target.value;
    this.setState({ value });
  }
  render() {
    const { value, editable } = this.state;
    return (
      editable ?
        <Input
          value={value}
          onChange={e => this.handleChange(e)}
        />
        :
        <div className="editable-row-text">
          {value.toString() || ' '}
        </div>
    );
  }
}
