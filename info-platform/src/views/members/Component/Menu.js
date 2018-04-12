/**
 *  Create by xj on 2018/1/15.
 *  fileName: 菜单
 */
import React, {Component} from 'react';
import {Card, Switch, Input, Form, message} from 'antd';
import Api from '../../../api';

const FormItem = Form.Item;

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Menus: this.props.Menus
        }
    }


    //开关
    onOff = (isSelect, MenuID) => {
        const {Menus} = this.state;
        Menus.map(item => {
            if (item.MenuID === MenuID) {
                item.Enable = isSelect
            }
        });
        this.setState({Menus})
    };
    //填入
    fillIn = (MenuID, name) => {
        this.props.form.setFieldsValue({[MenuID]: name});

    };
    //校验字符长度
    checkLength=(rule, value, callback)=>{
       if(value.length>4){
           callback("字数不能超过4位喔！");
           return;
       }
       callback();
    };
    //确定
    sure = () => {
        const {Menus} = this.state;
        this.props.form.validateFields((err, values) => {
            console.log(values);
            for (let i in values) {
                Menus.map(item => {
                    if (item.MenuID == i) {
                        item.NewName = values[i]
                    }
                })
            }
        });
        Api.systemSetting.SetGSpaceMenus({body:Menus}).then(res => {
            if (res.Ret === 0) {
                message.success("保存成功")
            } else {
                message.fail(res.Msg)
            }
        })
    };

    render() {
        const {Menus} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="menu">
                <p>关闭后会不显示该菜单，当菜单下没有内容时默认为关闭</p>
                {
                    Menus.length && Menus.map(item => {
                        return (
                            <div className="menu-list" key={item.MenuID}>
                                <div className="switch">
                                    <Switch defaultChecked={item.Enable}
                                            onChange={(isSelect) => this.onOff(isSelect, item.MenuID)}/>
                                </div>
                                <div className="content-input">
                                    <span>菜单名称：</span>
                                    <FormItem>
                                        {
                                            getFieldDecorator(`${item.MenuID}`,{
                                                initialValue:item.NewName,
                                                rules: [{required: true,validator: this.checkLength}]
                                            })(<Input placeholder="请输入菜单名称"/>)
                                        }
                                    </FormItem>

                                    <b>(最多4个字)</b>
                                </div>
                                <div className='menu-tip'>
                                    <span/>
                                    <div>
                                        默认名称：<b>{item.Name}</b>
                                        <a onClick={() => this.fillIn(item.MenuID, item.Name)}>填入</a>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                <a className="sure" onClick={() => this.sure()}>确定</a>
            </div>
        )
    }
}

export default Form.create()(Menu);