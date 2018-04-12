//成员管理编辑

import React, {Component} from 'react';
import {Form,Select,Input,message,Button} from 'antd';
import ThumbUpload from '../../publicComponents/thumbload/ThumbUpload';
import Directory from '../../publicComponents/directory/Directory';
import MenuRules from '../../publicComponents/menuRules/menuRules';
import './editMember.less';
import Api from '../../../api';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;

class EditMember extends Component{

    state = {
        title: false,
        cover:'',
        my: true,
        roleList:[],
        id:this.props.match.params.id ? this.props.match.params.id : 0,
    };

    componentDidMount () {
        this.getDetail();
        this.getRoleList();
    }
    //获取角色列表
    getRoleList = () => {
        Api.OrgManger.GetOrderContentList().then(res => {
            if (res.Ret === 0) {
                this.setState({roleList: res.Data})
            } else {
                message.error(res.Msg)
            }
        })
    };
    deal (data){

        const obj = data.map((item,key)=> {
            const node = {
                ID: 0,
                edit: false,
                ItemNo: key + 1,
                Title: item,
            };
            return node;
        });
        return obj;
    };
    //获取机构成员详情
    getDetail = () => {
        let id  = this.props.match.params.id ? this.props.match.params.id : 0;
        Api.OrgManger.GetDetail({ ID: id}).then(res => {
            if (res.Ret === 0) {
                let data = res.Data;
                let nickNameData = Array.isArray(data.Titles) && this.deal(data.Titles);
                let workData = Array.isArray(data.Works) && this.deal(data.Works);
                let { setFieldsValue } = this.props.form;
                // console.log(data);
                //设置表单值
                setFieldsValue({
                    phone: data.Tel,
                    name: data.Name,
                    intro: data.Introduce,
                    member: data.RoleID === 0 ? null : data.RoleID.toString(),
                    nickName: nickNameData,
                    Works:workData,
                });
                //非表单赋值
                this.setState({
                    cover:data.Photo,
                    nickName: nickNameData,
                    Works:workData,
                    UID:data.UID,
                });
            } else {
                message.error(res.Msg)
            }
        })
    };
    //ThumbUpload组件 接收子组件 传过来的图片路径
    getUploadUrl = (value) =>{
        this.setState({cover:value})
    };

    handleSelectChange = (value) => {
        console.log(value);
    };
    //保存成员
    addMember = (e)=> {
        e.preventDefault();
        const state = this.state;

        let thumb = [state.cover].filter(i => i);
        if (thumb.length === 0) {
            message.info('请上传封面');
            return
        }
        this.props.form.validateFields((err, values) => {
            console.log(values);
            let Titles = [];
            values.nickName && values.nickName.map(item => {
                Titles.push(item.Title)
            });
            let Works = [];
            values.work && values.work.map(item => {
                Works.push(item.Title)
            });
            if (!err) {
                let body = {
                    ID: this.props.match.params.id ? this.props.match.params.id : 0,
                    Status: 1,
                    UID: this.state.UID ? this.state.UID : 0,
                    Tel: values.phone,
                    Name: values.name,
                    Photo: state.cover,
                    Introduce: values.intro,
                    Titles: Titles,
                    Works: Works,
                    RoleID: values.member,
                    AuMenus: values.AuMenus,
                };
                console.log(body);
                Api.OrgManger.AddMember({body}).then(res => {
                    if (res.Ret === 0) {
                        this.setState({ID:res.Data.ID});
                        this.state.UID ? message.success('保存成功') : message.success('新增成功');
                        this.props.history.push('/org');
                    }else{
                        message.error(res.Msg);
                    }
                })
            }
        });
    };
    //验证手机号
    checkAccount(rule, value, callback) {
        var regex = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (value) {
            if (regex.test(value)) {
                callback();
            } else {
                callback('请输入正确的手机号码！');
            }
        }else{
            callback();
        }
    };
    render(){
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
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
        const {roleList} = this.state;
        return (
            <div className="editMember">
                <div className="Member-left">
                    <Form className="form-search-group" onSubmit={this.handleSearch}>
                            <FormItem  {...formItemLayout} label="手机号" extra="可用手机号登录后台发布文章" >
                                {getFieldDecorator('phone', {
                                    rules: [{ required: true, message: '请输入手机号' },{
                                        validator: this.checkAccount,
                                    }],
                                })(
                                    <Input placeholder="请输入手机号" style={{ width: '100%' }}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} label="姓名" >
                                {getFieldDecorator('name', {
                                    rules: [{
                                        required: true, message: '请输入姓名',
                                    }],
                                })(
                                    <Input placeholder="请输入姓名"/>
                                )}
                            </FormItem>

                            <FormItem
                                label="角色"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 8 }}
                            >
                                {getFieldDecorator('member', {
                                    rules: [{ required: true, message: '请选择身份' }],
                                })(
                                    <Select
                                        style={{width: 300}}
                                        placeholder="请选择身份"
                                        onChange={this.handleSelectChange}
                                    >
                                        {
                                            roleList.map(item => {
                                                return (
                                                    <Option value={(item.ID).toString()} key={item.ID}>{item.Name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem label="头像" {...formItemLayout} >
                                <span style={{position:'relative',right:'46px',fontSize:12,color:'#f04134',fontFamily: 'SimSun'}}>*</span>
                                <ThumbUpload upload={(value)=>{this.getUploadUrl(value)}} cover={this.state.cover} type={true} cropRate="3:2" size={true}/>
                            </FormItem>

                            <FormItem {...formItemLayout}  label="头衔" >
                                {getFieldDecorator('nickName', {
                                    rules: [{
                                        required: this.state.title, message: '请输入头衔',
                                    }],
                                })(
                                    <Directory data={this.state.my} isWork={false} Directories={this.state.nickName} />
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout}  label="代表作" >
                                {getFieldDecorator('work', {
                                    rules: [{
                                        required: this.state.title, message: '请输入代表作',
                                    }],
                                })(
                                    <Directory data={this.state.my} isWork={true} Directories={this.state.Works}/>
                                )}
                            </FormItem>

                            <FormItem {...formItemLayout} layout="inline" label="介绍" >
                                {getFieldDecorator('intro', {
                                    rules: [{
                                        required: this.state.title, message: '请输入介绍',
                                    }],
                                })(
                                    <TextArea placeholder="请输入介绍" rows={4} />
                                )}
                            </FormItem>
                            {/*<TreeSelect {...tProps} />*/}
                            <FormItem label='设置权限' {...formItemLayout} className="publish-range">
                                {getFieldDecorator('AuMenus', {
                                    rules: [{required: false}],
                                })(

                                    <MenuRules detaiID={this.state.id}/>
                                )}
                            </FormItem>

                            <FormItem {...tailFormItemLayout}>
                                <Button type="primary" onClick={() => {this.props.history.push('/org')}} style={{marginRight:10,marginBottom:100}} className="btn-cofirm">取消</Button>
                                {this.props.match.params.id ?
                                    <Button className="publish-btn" onClick={(e)=>this.addMember(e)}>保存</Button> :<Button className="publish-btn" onClick={(e)=>this.addMember(e)}> 新增</Button>
                                }
                            </FormItem>

                        </Form>
                </div>
            </div>
        )
    }

}

export default Form.create()(EditMember);