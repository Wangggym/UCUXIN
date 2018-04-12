//提醒开通服务、学习
import * as React from "react";
import styles from './page.less'
import {TextareaItem, Checkbox, Toast} from 'antd-mobile';
import router from 'umi/router';
import api from '../../api'

const AgreeItem = Checkbox.AgreeItem;
export default class Home extends React.Component {
    state = {
        chooseNum: 0,//已选择数量
        isAll: false,//是否全选
        UMs: [],//提醒数据
        text: +sessionStorage.getItem('RemindUserType') === 1 ? '看到你如此勤奋老师很是欣慰，但更多的是心疼，下次早点挤出时间来学习吧。'
            : '温故而知新，你是个聪明的孩子，如果课后能及时学习微课，复习新知，你会取得更好的成就。',//提示语

    };

    // 看到你如此勤奋老师很是欣慰，但更多的是心疼，下次早点挤出时间来学习吧。
    componentDidMount() {
        if (!sessionStorage.getItem('UMs')) {
            this.GetRemindUserList();
        } else {
            this.setState({
                UMs: JSON.parse(sessionStorage.getItem('UMs')),
            })
        }
    };

    //提醒全班获取全班数据
    GetRemindUserList = () => {
        api.GetRemindUserList({
            WeekID: +sessionStorage.getItem('WeekID'),
            RemindType: 4,
        }).then(res => {
            if (res.Ret === 0) {
                this.setState({
                    UMs: res.Data,
                })
            } else {
                Toast.fail(res.Msg);
            }
        })
    };


    //全选
    isChooseAll = () => {
        const {UMs, isAll} = this.state;
        UMs.map(item => {
            item.isChecked = !isAll;
        });
        this.setState({
            UMs,
            isAll: !isAll,
            chooseNum: isAll ? 0 : UMs.length,
        });

    };
    //单选
    chooseOne = (selected) => {
        const {UMs} = this.state;
        const index = UMs.findIndex(item => item.UMID === selected.UMID);
        UMs[index].isChecked = !UMs[index].isChecked;
        this.setState({UMs, isAll: false,});
        this.setState({chooseNum: 0});
        let i = 1;
        UMs.map(item => {
            if (item.isChecked === true) {
                this.setState({chooseNum: i++});
            }
        })
    };
    getText = (e) => {
        this.setState({text: e});
    };
    //提醒
    RemindUser = () => {
        const {text, UMs,} = this.state;
        const node = UMs.filter(item => item.isChecked).map(item => {
            return {UID: item.UID, UMID: item.UMID}
        });
        if (node.length < 1) {
            Toast.fail('请选择', 1);
            return;
        }
        const flag = sessionStorage.getItem('IsSubject') === "false" ? false : true;
        const flag2 = sessionStorage.getItem('IsWeek') === "false" ? false : true;
        api.RemindUser({
            body: {
                RemindOperateType: -1,
                RemindUserType: +sessionStorage.getItem('RemindUserType'),
                SubjectID: flag ? +sessionStorage.getItem('SubjectID') : null,
                WeekID: flag2 ? +sessionStorage.getItem('WeekID') : null,
                UMs: node,
                Content: text,
            }
        }).then(res => {
            if (res.Ret === 0) {
                Toast.info('提醒成功', 1);
            } else {
                Toast.fail(res.Msg);
            }
        })
    };


    render() {
        const {UMs, chooseNum, isAll, text} = this.state;
        return <div className={styles.remind}>

            <TextareaItem
                rows={3}
                className={styles.remindText}
                defaultValue={text}
                onBlur={this.getText}
            />
            <div className={styles.chooseRemind}>
                <span className={styles.title}>
                    <div className={styles.checkAll}>  <AgreeItem checked={isAll}
                                                                  onClick={this.isChooseAll}>全选</AgreeItem></div>
                    <span>已选择（{chooseNum}）</span>
                </span>
                <div className={styles.remindUser}>
                    {
                        UMs && UMs.length > 0 ?
                            UMs.map((item, index) =>
                                <div className={styles.box}>
                                    <div key={index} className={styles.item} checked={item.isChecked} uid={item.UMID}
                                         id={item.UID} onClick={() => {
                                        this.chooseOne(item)
                                    }}>
                                        <img src={item.UPic} alt=""/>
                                        <span>{item.UName}</span>
                                        {
                                            item.isChecked ?
                                                <img className={styles.icon}
                                                     src={require("../../public/assets/checked.png")}
                                                     alt=""/>
                                                :
                                                <img className={styles.icon} src={require("../../public/assets/check.png")}
                                                     alt=""/>
                                        }

                                    </div>
                                </div>
                            )
                            : <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '20px 0'
                            }}>
                                <img src={require("../../public/assets/kong.png")} alt=""
                                     style={{width: '248px', height: '214px', margin: '20px 0'}}/>
                                <span>暂无相关数据</span>
                            </div>
                    }

                </div>

                {/*<span className={styles.remin} onClick={this.RemindUser}>*/}
                    {/*发送*/}
                {/*</span>*/}
                <button className={styles.btn} onClick={this.RemindUser}>发送</button>
            </div>

        </div>
    }

}