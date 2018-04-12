/**
 * Created by Yu Tian Xiong on 2018/2/05.
 * fileName:总页数组件
 */
import React, {Component} from 'react';
import {Input} from 'antd';

export default class FreeRead extends Component{

  state = {
    data :this.props.value || {freeBeginPage: null, freeEndPage: null},
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.value && nextProps.value !== this.props.value){
      this.setState({data:nextProps.value});
    }
  }

  //起始页
  handleStartPage = (e) =>{
    const data = {...this.state.data,freeBeginPage:+e.target.value};
    this.setState({data});
    this.props.onChange(data);
  };

  //结束页
  handleEndPage = (e) =>{
    const data = {...this.state.data,freeEndPage:+e.target.value};
    this.setState({data});
    this.props.onChange(data);
  };


  render(){
    return (
      <div>
        <Input type="number" placeholder="请输入起始页" style={{width:'30%'}} onChange={this.handleStartPage} value={this.state.data.freeBeginPage}/>
        <Input type="number" placeholder="请输入结束页" style={{width:'30%',marginLeft:'2%'}} onChange={this.handleEndPage} value={this.state.data.freeEndPage}/>
      </div>
    )
  }
}