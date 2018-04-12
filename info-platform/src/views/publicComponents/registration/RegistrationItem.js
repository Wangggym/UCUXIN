/**
 * Created by Yu Tian Xiong on 2017/1/19.
 * file:登记表列表
 */
import React,{Component} from 'react';
import {Form,Input,Icon,Select} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

export default class RegistrationItem extends Component {

    state = {
        dataSource: this.props.data || {},
        dataValue:'',
    };
    componentWillReceiveProps(nextProps){
        if(nextProps.data && nextProps.data !== this.props.data){
            this.setState({dataSource: nextProps.data,dataValue:nextProps.data.Values[0]});
        }
    }
    componentDidMount(){

    }
    //删除对应数据
    handleDel = () => this.props.onRemove(this.state.dataSource);

    //把对象回填进编辑对话框

    handleEdit = () => {
        this.props.onEdit(this.state.dataSource);
    };



    render (){
        const {dataSource,dataValue} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        return(
            <div>
                <Form>
                    <FormItem label={dataSource.FiledName} {...formItemLayout}>
                        {dataSource.ControlType === 0 &&
                        <div>
                            <Input placeholder="请输入名称" style={{width:'80%'}}/>
                            <Icon type='edit' style={{marginLeft:'2%',cursor:'pointer'}} onClick={this.handleEdit}/>
                            <Icon type='close' style={{marginLeft:'2%',cursor:'pointer'}} onClick={this.handleDel}/>
                        </div>}
                        {dataSource.ControlType === 1 &&
                        <div>
                            <Select
                                // mode="multiple"
                                style={{ width: '80%' }}
                                placeholder="请输入值"
                                defaultValue={dataValue}
                            >
                                {Array.isArray(dataSource.Values) && dataSource.Values.map((item,i )=> <Option value={item} key={i}>{item}</Option>)}
                            </Select>
                            <Icon type='edit' style={{marginLeft:'2%',cursor:'pointer'}} onClick={this.handleEdit}/>
                            <Icon type='close' style={{marginLeft:'2%',cursor:'pointer'}} onClick={this.handleDel}/>
                        </div>}
                    </FormItem>
                </Form>
            </div>
        );
    }
}