/**
 * Created by Yu Tian Xiong on 2017/1/23.
 * fileName:专栏目录
 */
import React, {Component} from 'react';
import {Card,Button} from 'antd';
import ListItem from './ListItem'
import uid from '../../../basics/uid';
import './directory.less'

export default class Directory extends Component{

  state = {
    data: this.props.value || []
  };
  componentWillReceiveProps(nextProps){
    if(nextProps.Directories && nextProps.Directories !== this.props.Directories){
      this.setState({data: nextProps.Directories,ItemNo:nextProps.Directories.length});
    }
  }

  handleAdd = () => {
    if(this.props.disabled)return;
    this.state.ItemNo++;
    const data = [...this.state.data, {
      ID: 0,
      edit: true,
      ItemNo: this.state.ItemNo ? this.state.ItemNo : +uid(),
      Title: undefined
    }];
    this.setState({data});
  };

  handleConfirm = (value) => {
    if(this.props.disabled)return;
    const {data} = this.state;
    const index = data.findIndex(item => item.ItemNo === value.ItemNo);
    const nextData = [
      ...data.slice(0, index),
      value,
      ...data.slice(index + 1),
    ];
    this.setState({data: nextData});
    this.props.onChange(nextData);
  };

  handleRemove = (value) => {
    if(this.props.disabled)return;
    const {data} = this.state;
    const index = data.findIndex(item => item.ItemNo === value.ItemNo);
    const nextData = [
      ...data.slice(0, index),
      ...data.slice(index + 1),
    ];
    this.setState({data: nextData});
    this.props.onChange(nextData);
  };

  getChange = (value) =>{
    const {data} = this.state;
    const index = data.findIndex(item => item.ItemNo === value.ItemNo);
    const nextData = [
      ...data.slice(0, index),
      value,
      ...data.slice(index + 1),
    ];
    this.setState({data:nextData},()=>{this.props.onChange(this.state.data);});
  };


  render(){
    const {data} = this.state;
    return(
        this.props.data ?
            <Card
                  extra={<Button size="small" icon="plus" onClick={this.handleAdd}>添加</Button>}>
                {
                    Array.isArray(data) && data.length ?
                        <div className="catalog">
                            {
                                data.map((item, i) =>
                                    <ListItem
                                        key={item.ItemNo}
                                        data={item}
                                        index={i}
                                        onConfirm={this.handleConfirm}
                                        onRemove={this.handleRemove}
                                        getChange ={this.getChange}
                                        getDis = {this.props.disabled}
                                        my={this.props.data}
                                        isWork={this.props.isWork}
                                    />
                                )
                            }
                        </div>
                        : this.props.isWork ? "没有代表作哦" : "没有头衔哦"
                }
            </Card>
      :<Card title={`共${data.length ? data.length : 0}集` }
            extra={<Button size="small" icon="plus" onClick={this.handleAdd}>添加目录</Button>}>
        {
          Array.isArray(data) && data.length ?
            <div className="catalog">
              {
                data.map((item, i) =>
                  <ListItem
                    key={item.ItemNo}
                    data={item}
                    index={i}
                    onConfirm={this.handleConfirm}
                    onRemove={this.handleRemove}
                    getChange ={this.getChange}
                    getDis = {this.props.disabled}
                    my={this.props.data}
                  />
                )
              }
            </div>
            : <div className="catalog-no-data">没有目录哦~</div>
        }
      </Card>
    )
  }
}