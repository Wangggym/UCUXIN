/**
 *  Create by xj on 2018/1/15.
 *  fileName: 机构整体订阅
 */
import React, {Component} from 'react';
import {InputNumber, message, Switch} from "antd";
import Api from '../../../api';

class OrgAll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrData: this.props.Menus,
            onOff:null
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.Menus !== this.state.arrData) {
            this.setState({arrData: nextProps.Menus})
        }
    }

//价格改变
    priceChange = (value, item) => {
        if(!value){
            this.setState({onOff:false})
        }
        const {arrData} = this.state;
        arrData && arrData.forEach(data => {
            if (item.ID === data.ID) {
                data.SalePrice = value
            }
        });
        this.setState({arrData})
    };
    //开关
    onOff = (isSelect, ID) => {
        const {arrData} = this.state;
        arrData && arrData.forEach(data => {
            if (ID === data.ID) {
                data.Status = isSelect ? 1 : 0
            }
        });
        this.setState({arrData})
    };
//确定
    sure = () => {
    	console.log(this.state.arrData)
        Api.systemSetting.SetGroupPackages({body: this.state.arrData}).then(res => {
            if (res.Ret === 0) {
                message.success("保存成功")
            } else {
                message.error(res.Msg)
            }
        })
    };

    render() {
        const {Menus,onOff} = this.props;
        return (
            <div className="all-order">
                {!this.props.isAll && <div className="tip">不填价格会自动关闭该单类的订阅功能</div>}
                {
                    Menus && Menus.map(item => {
                        return (
                            <div key={item.ID}>
                                <div className="title-name">
                                    <p>
                                        {!this.props.isAll&&<b>{item.ContentTypeName}:</b>}
                                        <span>(多少元一年)</span>
                                    </p>
                                    {
                                        !this.props.isAll&&<Switch defaultChecked={item.Status ? true : false}
                                                                   onChange={(isSelect) => this.onOff(isSelect, item.ID)}/>
                                    }
                                </div>

                                <div className="input-number">
                                    <InputNumber defaultValue={item.SalePrice} min={0} placeholder="请输入价格"
                                                 onChange={(e) => this.priceChange(e, item)}/>
                                </div>
                            </div>
                        )
                    })
                }
                <a onClick={() => this.sure()}>确定</a>
            </div>
        )
    }
}

export default OrgAll;