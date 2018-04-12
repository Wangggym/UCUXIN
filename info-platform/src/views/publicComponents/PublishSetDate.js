/**
 * Created by Yu Tian Xiong on 2017/12/28.
 */
import React, {Component} from 'react';
import {Radio, DatePicker} from 'antd';
import moment from 'moment';

const RadioGroup = Radio.Group;
export default class PublishSetDate extends Component {
    state = {
        data: this.props.value || {type: 1, ValidBeginDate: null,ValidEndDate:null},
        startValue:null,
        endValue: null,
    };

    componentWillReceiveProps(nextProps){
        if(nextProps.value !== this.props.value){
            this.setState({data: nextProps.value});
        }
    }

    handleChangeType = (e) => {
        const data = {...this.state.data, type: +e.target.value, ValidBeginDate: null,ValidEndDate:null};
        this.setState({data});
        this.props.onChange(data);
    };
    handleChangeDate = (value) => {
        const data = {...this.state.data, ValidBeginDate: value};
        this.setState({data});
        this.props.onChange(data);
    };
    handleChangeDateTwo= (value) => {
        const data = {...this.state.data, ValidEndDate: value};
        this.setState({data});
        this.props.onChange(data);
    };
    render() {
        const {data} = this.state;
        return (
            <div className="publish-set">
                <RadioGroup value={data.type.toString()} onChange={this.handleChangeType}>
                    <Radio value="0">无限期</Radio>
                    <Radio value="1">规定时间内</Radio>
                </RadioGroup>
                {
                    data.type !== 0 &&
                    <div>
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            onChange={this.handleChangeDate}
                            placeholder="请选择开始日期"
                            value={data.ValidBeginDate ? moment(data.ValidBeginDate):''}
                        />
                        <span>~</span>
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="请选择结束日期"
                            onChange={this.handleChangeDateTwo}
                            value={data.ValidEndDate ? moment(data.ValidEndDate):''}
                        />
                    </div>
                }
            </div>
        )
    }
}
