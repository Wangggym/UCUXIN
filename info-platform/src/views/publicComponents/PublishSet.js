/**
 * Created by Yu Tian Xiong on 2017/12/28.
 */
import React, {Component} from 'react';
import {Radio, DatePicker} from 'antd';
import moment from 'moment';

const RadioGroup = Radio.Group;
export default class PublishSet extends Component {
    state = {
        data: this.props.value || {type: 1, date: null}
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

    render() {
        const {data} = this.state;
        return (
            <div className="publish-set">
                <RadioGroup value={data.type.toString()} onChange={this.handleChangeType} disabled={this.props.disabled}>
                    <Radio value="0">即时发布</Radio>
                    <Radio value="1">定时发布</Radio>
                </RadioGroup>
                {
                    data.type !== 0 && <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        onChange={this.handleChangeDate}
                        value={data.date ? moment(data.date):''}
                    />
                }
            </div>
        )
    }
}
