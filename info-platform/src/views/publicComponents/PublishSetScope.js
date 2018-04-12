/**
 * Created by Yu Tian Xiong on 2017/12/28.
 */
import React,{Component} from 'react';
import {Radio, Input} from 'antd';

const { TextArea } = Input;
const RadioGroup = Radio.Group;

export default class PublishSetScope extends Component{
    state = {
        data: this.props.value || {type:1,date: null}
    };

    componentWillReceiveProps(nextProps){
        if(nextProps.value !== this.state.value){
            this.setState({data: nextProps.value});
        }
    }
    handleChangeType = (e) => {
        const data = {...this.state.data, type: +e.target.value, date: null};
        this.setState({data});
        this.props.onChange(data);
    };
    handleChangeDate = (value) => {
        const data = {...this.state.data, date: value};
        this.setState({data});
        this.props.onChange(data);
    };
    render(){
        const {data} = this.state;
        return(
            <div>
                <RadioGroup defaultValue={data.type.toString()} onChange={this.handleChangeType} style={{float:'left'}}>
                    <Radio value="1">本地</Radio>
                    <Radio value="2">全国</Radio>
                    <Radio value="3">区域</Radio>
                    <span>(&nbsp;发布本地话题不需要审核,全国或区域话题需要官方审核&nbsp;)</span>
                </RadioGroup>
                {
                    data.type === 3 &&  <TextArea placeholder="请输入省或市，以逗号隔开" autosize />
                }
            </div>
        )
    }
}

