/**
 *  Create by xj on 2018/1/15.
 *  fileName: 机构简介
 */
import React,{Component} from 'react';
import {Form,Input,message} from "antd";
import Api from '../../../api';

const {TextArea} = Input;
const FormItem = Form.Item;

class Introduce extends Component{
    constructor(props){
        super(props);
        this.state={
            Introduce:this.props.Introduce || {}
        }
    }
    //确定
    sure=()=>{
        const {Introduce}=this.state;
        this.props.form.validateFields((err,values)=>{
            Introduce.Introduce=values.orgIntro;
            Introduce.Contact=values.contactWay
        });
         Api.systemSetting.SetGSpaceIntroduce({body:Introduce}).then(res=>{
             if(res.Ret===0){
                 message.success("保存成功")
             }else {
                 message.error(res.Msg)
             }
         })
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        const {Introduce}=this.state;
        return(
            <div className="introduce">
                <FormItem label="机构简介:">
                    {
                        getFieldDecorator("orgIntro", {initialValue: Introduce ? Introduce.Introduce :''})(<TextArea rows={4}
                                                                                              placeholder="请填写机构简介"/>)
                    }
                </FormItem>
                <FormItem label="联系方式:">
                    {
                        getFieldDecorator("contactWay", {initialValue: Introduce ? Introduce.Contact :''})(<TextArea rows={4}
                                                                                    placeholder="请填写联系方式"/>)
                    }
                </FormItem>
                <a style={{fontSize:"20px"}} onClick={()=>this.sure()}>确定</a>
            </div>

        )
    }
}
export default Form.create()(Introduce);