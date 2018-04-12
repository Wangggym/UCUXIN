/**
 * Created by Yu Tian Xiong on 2017/1/29.
 * fileName:内容库专栏小集选择框
 */
import React, { Component } from 'react';
import {Checkbox} from 'antd';

export default class Check extends Component {


  state={check:this.props.value || false};

  componentWillReceiveProps(nextProps){
    if(nextProps.value && nextProps.value !== this.props.value){
      this.setState({check:nextProps.value})
    }
  }

  handleRead = (e) =>{
    this.setState({check:e.target.checked});
    this.props.onChange(e.target.checked);
  };


  render(){
    const {check} = this.state;
    return(
      <div>
        <Checkbox onChange={this.handleRead} checked={check}></Checkbox>
        <span>(勾选后用户未购买专栏也能试读该小集)</span>
      </div>
    )
  }
}