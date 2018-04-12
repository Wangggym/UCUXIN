/**
 * Created by Yu Tian Xiong on 2018/2/05.
 * fileName:总页数组件
 */
import React, {Component} from 'react';
import {Input} from 'antd';

export default class AllPage extends Component{

  state = {
    data:this.props.value || {pagesCount: null, wordsCount: null}
  };


  componentWillReceiveProps(nextProps){
    if(nextProps.value && nextProps.value !== this.props.value){
     this.setState({data:nextProps.value});
    }
  }

  //总页数
  handlePagesCount = (e) =>{
    const data = {...this.state.data,pagesCount:+e.target.value};
    this.setState({data});
    this.props.onChange(data);
  };

  //总字数
  handleWordsCount = (e) =>{
    const data = {...this.state.data,wordsCount:+e.target.value};
    this.setState({data});
    this.props.onChange(data);
  };

  render(){
    return (
      <div>
        <Input type="number" placeholder="请输入总页数" style={{width:'30%',marginRight:'2%'}} onChange={this.handlePagesCount} value={this.state.data.pagesCount}/>
        字数：<Input type="number" placeholder="请输入总字数" style={{width:'30%'}} onChange ={this.handleWordsCount} value={this.state.data.wordsCount}/>
      </div>
    )
  }
}