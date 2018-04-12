/**
 * Created by Yu Tian Xiong on 2017/1/23.
 * fileName:底部分页器
 */
import React, { Component } from 'react';
import {Select} from 'antd';
import './bottom.less';

const Option = Select.Option;

export default class Bottom extends Component{

    state={
        pagination:this.props.pagination || {}
    };

    componentWillReceiveProps(nextProps){
        if(nextProps.pagination && nextProps.pagination !== this.props.pagination){
            this.setState({pagination: nextProps.pagination});
        }
    }
    //操作分页
    handleSelectBottom = (value) => {
        let {pagination} = this.state;
        this.setState({
            pagination: {current: pagination.current, pageSize: +value, total: pagination.total}
        },()=>this.props.refreshList(this.state.pagination));

    };
    render(){
        const {pagination} = this.state;
        return(
            <div style={{marginTop:'-58px'}} className="table-total">

                <div className="select-bottom">
                    <span>每页显示:&nbsp;</span>
                    <Select defaultValue={pagination.pageSize+'条'} style={{width: 120}} onChange={this.handleSelectBottom}>
                        <Option value={"5"}>5条</Option>
                        <Option value={"10"}>10条</Option>
                        <Option value={"15"}>15条</Option>
                    </Select>
                </div>
                <div className="total-info">
                    <span className="total-span">总共有{pagination.total}条记录</span>
                </div>
            </div>
        )
    }
}