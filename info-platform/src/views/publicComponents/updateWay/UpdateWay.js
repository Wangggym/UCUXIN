/**
 * Created by Yu Tian Xiong on 2017/1/23.
 * fileName:专栏更新方式
 */
import React, { Component } from 'react';
import {Radio,Select} from 'antd';
import './updateWay.less'

const Option = Select.Option;
const RadioGroup = Radio.Group;

//更新频率枚举
const Freq= [
  {key:'0',name:'每日更新'},
  {key:'1',name:'每周更新'},
  {key:'2',name:'每半月更新'},
  {key:'3',name:'每月更新'},
];

//每周更新枚举
const Week = [
  {key:'0',name:'每周一'},
  {key:'1',name:'每周二'},
  {key:'2',name:'每周三'},
  {key:'3',name:'每周四'},
  {key:'4',name:'每周五'},
  {key:'5',name:'每周六'},
  {key:'6',name:'每周日'},
];

//每半月  每月更新枚举
const Data = [];
for(let i=1;i<32;i++){Data.push(i);};

export default class UpdateWay extends Component{

  state = {
    data:this.props.value || {updateType: 0,updateFreq:null,updateWeek: null,updateDay1:null,updateDay2:null}
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.value && nextProps.value !== this.props.value){
      this.setState({data: nextProps.value});
    }
  }

  //单选赋值
  handleChangeType = (e) =>{
    const data = { ...this.state.data, updateType:+e.target.value};
    this.setState({data});
    this.props.onChange(data);
  };

  //更新频率
  handleFreq = (value) =>{
    const data = { ...this.state.data, updateFreq:+value,updateWeek: null,updateDay1:null,updateDay2:null};
    this.setState({data});
    this.props.onChange(data);
  };

  //每周更新
  handleWeek = (value) =>{
    const data = { ...this.state.data, updateWeek:+value,updateDay1:null,updateDay2:null};
    this.setState({data});
    this.props.onChange(data);
  };

  //每半月更新 每月更新
  handleOne = (value) =>{
    const data = { ...this.state.data, updateDay1:+value,updateWeek: null};
    this.setState({data});
    this.props.onChange(data);
  };
  handleTwo = (value) =>{
    const data = { ...this.state.data, updateDay2:+value,updateWeek: null};
    this.setState({data});
    this.props.onChange(data);
  };
  render(){
    const {data} = this.state;
    return(
      <div>
        <RadioGroup onChange={this.handleChangeType} value={ data.updateType.toString()} disabled={this.props.disabled}>
          <Radio value="0">一次性更新</Radio>
          <Radio value="1">定时更新</Radio>
          <Radio value="2">不定时更新</Radio>
        </RadioGroup>
        {
          data.updateType === 1 &&
          <div>
            <Select className="select-width" value={data.updateFreq ? data.updateFreq.toString() : '更新方式'} onChange={this.handleFreq} disabled={this.props.disabled}>
              {Array.isArray(Freq) && Freq.map((item, i)=><Option value={item.key} key={i}>{item.name}</Option>)}
            </Select>
            {/*每周更新*/}
            {data.updateFreq === 1 &&
              <Select className="select-width" value={data.updateWeek ? data.updateWeek.toString() : '更新日期'} onChange={this.handleWeek} disabled={this.props.disabled}>
                {Array.isArray(Week) && Week.map((item,i)=><Option value={item.key} key={i}>{item.name}</Option>)}
              </Select>
            }
            {/*每半月更新*/}
            {data.updateFreq === 2 &&
              <span>
                <Select className="select-width" value={data.updateDay1 ? data.updateDay1.toString() : '更新日期1'} onChange={this.handleOne} disabled={this.props.disabled}>
                  {Array.isArray(Data) && Data.map((item,i)=><Option value={item.toString()} key={i}>{item}</Option>)}
                </Select>
                <Select className="select-width" value={data.updateDay2 ? data.updateDay2.toString() : '更新日期2'} onChange={this.handleTwo} disabled={this.props.disabled}>
                  {Array.isArray(Data) && Data.map((item,i)=><Option value={item.toString()} key={i}>{item}</Option>)}
                </Select>
              </span>
            }
            {/*每月更新*/}
            {data.updateFreq === 3 &&
              <Select className="select-width" value={data.updateDay1 ? data.updateDay1.toString() : '更新日期'} onChange={this.handleOne}>
                {Array.isArray(Data) && Data.map((item,i)=><Option value={item.toString()} key={i}>{item}</Option>)}
              </Select>
            }
          </div>
        }
      </div>
    )
  }
}