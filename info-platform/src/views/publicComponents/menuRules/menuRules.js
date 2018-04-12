import React, {Component} from 'react';
import {Card, Checkbox, Select,message} from 'antd';
import './menuRules.less'
import Api from '../../../api';

const CheckboxGroup = Checkbox.Group;

export default class PublishRange extends Component {

    state = {
        AuMenus:[],
        checkedID:[],
    };

    componentDidMount() {
        this.getDetail();
    }
    componentWillReceiveProps(nextProps){
        // console.log(nextProps);
        // if(nextProps.pictures && nextProps.pictures !== this.props.pictures){
        //     this.setState(
        //         {data: nextProps.pictures,SNO:nextProps.pictures.length});
        // }
    }

    //获取机构成员详情
    getDetail = () => {
        Api.OrgManger.GetDetail({ ID: this.props.detaiID}).then(res => {
            if (res.Ret === 0) {
                this.setState({AuMenus:res.Data.AuMenus});
                // console.log(res.Data.AuMenus);
            } else {
                message.error(res.Msg)
            }
        })
    };
    //权限选择
    getRules = (e) =>{
        console.log(e);
        // if(e.length === undefined){
            this.state.AuMenus.map(item => {
                if (item.ID === e.target.id && e.target.checked) {
                    item.Enable = true;
                }
                if (item.ID === e.target.id && !e.target.checked) {
                    item.Enable = false;
                }

                if (item.SubMenus !== null) {
                    item.SubMenus.map(ele => {
                        if (ele.ID === e.target.id && e.target.checked) {
                            ele.Enable = true;
                        }
                        if (ele.ID === e.target.id && !e.target.checked) {
                            ele.Enable = false;
                        }
                    });
                }
            });
        // }else{
        //     if(e.length == 0) return ;
        //     this.state.AuMenus.map(father => {
        //         if(father.ID != e[0].PID) return;
        //         father.SubMenus && father.SubMenus.map(item => {
        //             item.Enable = false;
        //         });
        //         e.map(val => {
        //             father.SubMenus.map(item => {
        //                 if(val.ID == item.ID) item.Enable = true;
        //             });
        //         });
        //     });
        // }
        console.log(this.state.AuMenus);
        this.props.onChange(this.state.AuMenus);

    };


    render() {
        const {AuMenus} = this.state;

        return (
            <div className="visible-p">
                <Card>
                    {
                        <div className="visible-content">
                            {Array.isArray(AuMenus) && AuMenus.map(item =>
                                <dl className="range-item" key={item.ID}>
                                    <dt><Checkbox onChange={this.getRules} id={item.ID} defaultChecked={item.Enable}>{item.Name}</Checkbox></dt>
                                    {item.SubMenus &&
                                        <dd>
                                            {/*<CheckboxGroup onChange={this.getRules} id={item.ID}>*/}
                                                {Array.isArray(item.SubMenus) && item.SubMenus.map(item => <Checkbox  defaultChecked={item.Enable}  value={item} key={item.ID}  id={item.ID} onChange={this.getRules}>{item.Name}</Checkbox>)}
                                            {/*</CheckboxGroup>*/}
                                        </dd>
                                    }
                                </dl>
                            )}


                        </div>
                    }
                </Card>
            </div>
        )
    }
}