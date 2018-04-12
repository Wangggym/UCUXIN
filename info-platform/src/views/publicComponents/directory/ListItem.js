/**
 * Created by Yu Tian Xiong on 2017/1/23.
 * fileName:专栏目录列表
 */
import React, {PureComponent} from 'react';
import {Input, Icon} from 'antd';

export default class ListItem extends PureComponent {

  state = {
    edit: this.props.data.edit,
    data: this.props.data || {}
  };
  componentWillReceiveProps(nextProps){
    if(nextProps.data && nextProps.data !== this.props.data){
      this.setState({data: nextProps.data});
    }
  }
  handleEdit = () => {
    const {edit} = this.state;
    this.setState({edit: !edit});
    this.props.onConfirm({...this.state.data, edit:!edit})
  };
  handleDel = () => this.props.onRemove(this.state.data);

  handleChange = (e) => {
    this.setState({data: {...this.state.data, Title: e.target.value}},()=>{this.props.getChange(this.state.data)});
  };

  render() {
    const {edit, data} = this.state;
    return (
      <div className="catalog-item">
          {this.props.my ? (this.props.isWork ?<div className="catalog-item-hd">代表作{this.props.index+1}</div>  :<div className="catalog-item-hd">头衔{this.props.index+1}</div>) :<div className="catalog-item-hd">第{this.props.index+1}集</div>}
        <div className="catalog-item-bd">
          {
            edit ? <Input defaultValue={data.Title} onChange={this.handleChange} disabled={this.props.getDis}/> : data.Title
          }
        </div>
        <div className="catalog-item-ft">
          <Icon type={edit ? 'check' : 'edit'} onClick={this.handleEdit}/>
          <Icon type="close" onClick={this.handleDel}/>
        </div>
      </div>
    )
  }
}
