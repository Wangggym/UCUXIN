/**
 * Created by Yu Tian Xiong on 2017/1/19.
 * file:登记表组件
 */
import React,{Component} from 'react';
import {Card,Button,Modal,Form,Input,Select,Radio,message,Icon} from 'antd';
import uid from '../../../basics/uid';
import RegistrationItem from './RegistrationItem';
import './registration.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class Registration extends Component {
    state = {
        visible:false,
        data:[],
        valueList:[],
        type:'',
        deleteData:'',
        showVisible:false,
    };
    componentWillReceiveProps(nextProps){
        if(nextProps.RefResigsterFields && nextProps.RefResigsterFields !== this.props.RefResigsterFields){
            this.setState(
                {data: nextProps.RefResigsterFields,SNO:nextProps.RefResigsterFields.length});
        }
    }
    //添加登记表
    handleAdd = () =>{
        let { setFieldsValue } = this.props.form;
        this.setState({visible:true},()=>{
            setFieldsValue(
                {
                    FiledName:undefined,
                    ControlType:undefined,
                    IsNotNull:undefined,
                    Values:undefined,
                }
            )
        });
    };
    //确定  关闭模态  并且存值
    handleOk = (e) => {
        e.preventDefault();
        let {valueList} = this.state;
        this.props.form.validateFields((err, values) => {
            if(values.ControlType==="1" && valueList.length===0)
            {message.info('请输入值集合');return false}
            else if(values.ControlType==="1" && valueList.length>0){};
            if (!err) {
                this.state.SNO++;
                 const data = [...this.state.data,
                    {
                        SNO:this.state.SNO ? this.state.SNO : +uid(),
                        FiledName: values.FiledName,
                        ControlType: +values.ControlType,
                        IsNotNull:values.IsNotNull,
                        Values:valueList,
                    }
                    ];
                this.setState({visible:false,data:data},()=>{this.props.getRegistration(this.state.data)});
            }
        });
    };
    //取消
    handleCancel = () =>{
        this.setState({visible:false});
    };
    //值集合
    handleChange = (value) =>{
        this.setState({valueList:value});
    };
    //类型改变  文本框  下拉框
    changeType = (value) =>{
        this.setState({type: +value});
    };
    //删除
    handleRemove = (value) => {
        const {data} = this.state;
        const index = data.findIndex(item => item.SNO === value.SNO);
        const nextData = [
            ...data.slice(0, index),
            ...data.slice(index + 1),
        ];
        this.setState({data: nextData},()=>{this.props.getRegistration(this.state.data)});
    };
    //编辑
    handleOnEdit = (value)=>{
        let { setFieldsValue } = this.props.form;
        const {data} = this.state;
        this.setState({deleteData:value});
        this.setState({showVisible:true,valueList:value.Values,data:data},()=>{
            setFieldsValue(
                {
                    FiledName:value.FiledName,
                    ControlType:value.ControlType.toString(),
                    IsNotNull:value.IsNotNull,
                    Values:this.state.valueList
                }
            )

        });

    };
    //编辑模态关闭  确定
    handleEditModal = () =>{
        this.setState({showVisible:false})
    };
    handleEditOk = () =>{
        const {data,deleteData,valueList} = this.state;
        this.props.form.validateFields((err, values) => {
            if(values.ControlType==="1" && valueList.length===0)
            {message.info('请输入值集合');return false}
            else if(values.ControlType==="1" && valueList.length>0){}
            if (!err) {
              let index = data.findIndex(item => item.SNO === deleteData.SNO);
              let newData = {
                  SNO:deleteData.SNO,
                  FiledName: values.FiledName,
                  ControlType: +values.ControlType,
                  IsNotNull:values.IsNotNull,
                  Values:valueList,
              };
              data.splice(index,1,newData);
              this.setState({showVisible:false,data:data},()=>{this.props.getRegistration(this.state.data)});
            }
        });
    };
    render () {
        let {visible,data,type,showVisible} = this.state;
        const { getFieldDecorator } = this.props.form;
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
        return (
            <Card title="" extra={<Button size="small" icon="plus" onClick={this.handleAdd}>添加登记表</Button>}>
                <Modal
                    title="字段配置"
                    visible={visible}
                    wrapClassName="vertical-center-modal"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form>
                       <FormItem label="配置字段" {...formItemLayout}>
                           {getFieldDecorator('FiledName', {
                               rules: [{ required: true, message: '请输入名称' }],
                           })(
                            <Input placeholder="请输入名称"/>
                           )}
                       </FormItem>
                        <FormItem label="字段名称" {...formItemLayout}>
                            {getFieldDecorator('ControlType', {
                                rules: [{ required: true, message: '请选择控件类型' }],
                                initialValue: '0'
                            })(
                            <Select onChange={this.changeType}>
                                <Option value="0">文本框</Option>
                                <Option value="1">列表框</Option>
                            </Select>
                            )}
                        </FormItem>
                        <FormItem label="是否必填" {...formItemLayout}>
                            {getFieldDecorator('IsNotNull', {
                                rules: [{ required: true, message: '请选择是否必填' }],
                            })(
                            <RadioGroup>
                                <Radio value={true}>是</Radio>
                                <Radio value={false}>否</Radio>
                            </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem label="列表框值集合" {...formItemLayout}>
                            {getFieldDecorator('Values', {
                                rules: [{ required: type===1 ? true : false, }],
                            })(
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder="请输入值"
                                onChange={this.handleChange}
                                tags={true}
                            >
                            </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
                <Modal
                    title="字段配置"
                    visible={showVisible}
                    wrapClassName="vertical-center-modal"
                    onOk={this.handleEditOk}
                    onCancel={this.handleEditModal}
                >
                    <Form>
                        <FormItem label="配置字段" {...formItemLayout}>
                            {getFieldDecorator('FiledName', {
                                rules: [{ required: true, message: '请输入名称' }],
                            })(
                                <Input placeholder="请输入名称"/>
                            )}
                        </FormItem>
                        <FormItem label="字段名称" {...formItemLayout}>
                            {getFieldDecorator('ControlType', {
                                rules: [{ required: true, message: '请选择控件类型' }],
                                initialValue: '0'
                            })(
                                <Select onChange={this.changeType}>
                                    <Option value="0">文本框</Option>
                                    <Option value="1">列表框</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="是否必填" {...formItemLayout}>
                            {getFieldDecorator('IsNotNull', {
                                rules: [{ required: true, message: '请选择是否必填' }],
                            })(
                                <RadioGroup>
                                    <Radio value={true}>是</Radio>
                                    <Radio value={false}>否</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem label="列表框值集合" {...formItemLayout}>
                            {getFieldDecorator('Values', {
                                rules: [{ required: type===1 ? true : false,message: '请输入值集合' }],
                            })(
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="请输入值"
                                    onChange={this.handleChange}
                                    tags={true}
                                >
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
                {Array.isArray(data) && data.length ?
                    data.map((item,i)=>
                            <RegistrationItem
                                key={item.SNO}
                                data={item}
                                index={i}
                                onRemove={this.handleRemove}
                                onEdit ={this.handleOnEdit}
                            />
                    )
                :<div>没有关联登记表哟</div>}
            </Card>
        )
    }
}
export default Form.create()(Registration);