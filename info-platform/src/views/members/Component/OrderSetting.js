/**
 *  Create by xj on 2018/1/11.
 *  fileName: OrderSetting
 */
import React, {Component} from 'react';
import {Card, Switch,message} from 'antd';
import Api from '../../../api';


class OrderSetting extends Component {
    state = {
        actionID: "",
        menuType: ""
    };

    componentDidMount() {
        this.setState({leftMenu: this.props.leftMenu})
    }
    //点击订购设置
    orderSetting=(item)=>{
        this.setState({actionID: item.PackageType});
        //将订购设置选中的内容传给父组件
        this.props.setMenuType(item.Code,item.PackageType)
    };
    //点击版块设置
    forumSetting=(item)=>{
         if(!item.Url)return;
        this.setState({actionID: item.ModuleID});
        //将版块设置选中的内容传给父组件
        this.props.setMenuType(item.Code)
    };
    //订购设置开关
    orderSwitch=(value,PackageType)=>{
        Api.systemSetting.SetGroupPackageType({packageType:PackageType,enable:value}).then(res=>{
            if(res.Ret===0){
                message.success("保存成功")
            }else {
                console.log(res.Msg)
            }
        })
    };
    //版块设置开关
    switchChange=(value,ModuleID)=>{
        const {leftMenu}=this.state;
        leftMenu.Modules.map(item=>{
            if(item.ModuleID===ModuleID){
                item.Enable=value
            }
        });
        this.setState({
            leftMenu
        },()=>Api.systemSetting.SetGSpaceModule({body:this.state.leftMenu.Modules}).then(res=>{
            if(res.Ret===0){
                message.success("保存成功")
            }else {
                message.error(res.Msg)
            }
        }))
    };
    //确定
    sure=()=>{
        Api.systemSetting.SetGSpaceModule({body:this.state.leftMenu.Modules}).then(res=>{
            if(res.Ret===0){
                message.success("保存成功")
            }else {
                message.error(res.Msg)
            }
        })
    };
    render() {
        const {actionID, leftMenu} = this.state;
        return (
            <div className='order-setting'>
                <h1>订购设置 <span>(关闭后将不能用该订阅方式)</span></h1>
                <p>以下两种订阅方式均不包含实物报刊</p>
                {
                    leftMenu && leftMenu.PackageTypes.length && leftMenu.PackageTypes.map(item => {
                        return (
                            <div key={item.PackageType}
                                 className={"card " + (actionID === item.PackageType ? "actoin" : "")}
                                 style={{marginTop: 10}} onClick={() => this.orderSetting(item)}>
                                <div className='left-title'>
                                    <p>{item.PackageTypeName}</p>
                                    <p>{item.Desc}</p>
                                </div>
                                <div className='right-switch'>
                                    <Switch defaultChecked={item.Enable} onChange={(e)=>this.orderSwitch(e,item.PackageType)}/>
                                </div>
                            </div>
                        )
                    })
                }

                <div className='cute-line'/>
                <h1>版块设置 <span>(关闭后将不显示该区块)</span></h1>
                {
                    leftMenu && leftMenu.Modules.length && leftMenu.Modules.map(item => {
                        return (
                            <div key={item.ModuleID} className={"card " + (actionID === item.ModuleID ? "actoin" : "")}
                                 style={{marginTop: 10}} onClick={() =>this.forumSetting(item) }>
                                <div className={'left-title '+(item.Url?"":"not-link")}>
                                    <p>{item.Name}</p>
                                </div>
                                <div className='right-switch'>
                                    <Switch defaultChecked={item.Enable} onChange={(e)=>this.switchChange(e,item.ModuleID)}/>
                                </div>
                            </div>
                        )
                    })
                }

                <a className="switch-sure" style={{display:"none"}} onClick={()=>this.sure()}>确定</a>
            </div>
        )
    }
}

export default OrderSetting;