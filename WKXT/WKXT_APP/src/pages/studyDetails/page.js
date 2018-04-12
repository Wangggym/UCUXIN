//学习详情  页面32
import * as React from "react";
import styles from './page.less'
import {Tabs, Toast} from 'antd-mobile';
import router from 'umi/router';
import api from '../../api'


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading :true,
            userList: [],//已学习
            NoFuncBoughtList: [],//未开通服务的同学
            NoLearnList: [],//未学习的同学
            empty:"../../public/assets/kong1.png"
        };
    }

    componentDidMount() {
        Toast.loading("加载中",1);
        this.GetLearnUserList();
        this.GetNoLearnUserList();
    };

    //跳转提醒页面
    goRemind = (i) => {
        const {NoFuncBoughtList, NoLearnList} = this.state;
        i === 1 ? sessionStorage.setItem('UMs', JSON.stringify(NoFuncBoughtList)) : sessionStorage.setItem('UMs', JSON.stringify(NoLearnList));
        i === 1 ? sessionStorage.setItem('RemindUserType', 3) : sessionStorage.setItem('RemindUserType', 2);
        sessionStorage.setItem('IsSubject', false);
        sessionStorage.setItem('IsWeek', false);
        router.push('/remind');
    };
    // 获取已学人员
    GetLearnUserList = () => {
        api.GetLearnUserList().then(res => {
            this.setState({
                loading:false
            });
            if (res.Ret === 0) {
                this.setState({
                    userList: res.Data,
                })
            } else {
                Toast.fail(res.Msg);
            }
        })
    };
    // 获取未学习用户
    GetNoLearnUserList = () => {
        api.GetNoLearnUserList().then(res => {
            this.setState({
                loading:false
            });
            if (res.Ret === 0) {
                console.log(res);
                this.setState({
                    NoFuncBoughtList: res.Data.NoFuncBoughtList,
                    NoLearnList: res.Data.NoLearnList,
                })
            } else {
                Toast.fail(res.Msg);
            }
        })
    };

    //点击头像私聊
    chat = (e) => {
        if (e.UID === 0 || e.UID === "0"){
            Toast.fail("该学生还没有激活，无法发起私聊!");
        }else {
            window.location.href = `ucux://vcard?type=contact&uid=${e.UID}`;
        }
    };
    NoFuncBoughtList = () =>{
        if (this.state.NoFuncBoughtList && this.state.NoFuncBoughtList.length > 0){
            return (
                <span className={styles.remind} onClick={() => this.goRemind(1)}>提醒一下</span>
            )
        }else {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px 0'
                }}>
                    {!this.state.loading ?  <div className="emptyImg" id="222">
                        <img src={require("../../public/assets/kong1.png")} alt=""
                             style={{width: '248px', height: '214px', margin: '20px 0'}}/>
                        <div style={{textAlign:"center"}}>暂无相关数据</div>
                    </div>:""
                    }
                </div>
            )
        }
    };

    NoLearnList = () =>{
        if (this.state.NoLearnList && this.state.NoLearnList.length > 0){
            return (
                <span className={styles.remind} onClick={() => this.goRemind(2)}>提醒一下</span>
            )
        }else {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px 0'
                }}>
                    {!this.state.loading ?  <div className="emptyImg" id="222">
                        <img src={require("../../public/assets/kong1.png")} alt=""
                             style={{width: '248px', height: '214px', margin: '20px 0'}}/>
                        <div style={{textAlign:"center"}}>暂无相关数据</div>
                    </div>:""}
                </div>
            )
        }
    };
    render() {
        const tabs = [
            {title: '未学人员', sub: '1'},
            {title: '已学人员', sub: '2'},
        ];
        const {userList, NoFuncBoughtList, NoLearnList} = this.state;
        return <div className={styles.pointsRank}>

            <Tabs tabs={tabs}
                 // animated={false}
                  initialPage={0}
                  tabBarPosition="top"
                  renderTab={tab => <span>{tab.title}</span>}
            >

                <div className={styles.noStudy}>
                    <span
                        className={styles.title}>未开通（{NoFuncBoughtList && NoFuncBoughtList.length !== 0 ? NoFuncBoughtList.length : 0}）</span>
                    <div className={styles.box}>
                        {
                            !NoFuncBoughtList ? '' : NoFuncBoughtList.map((item, index) =>
                                <div key={index} className={styles.item} onClick={() => this.chat(item)}>
                                    <img src={item.UPic} alt=""/>
                                    <span>{item.UName}</span>
                                </div>
                            )
                        }
                    </div>
                    {this.NoFuncBoughtList()}
                    {/*{*/}
                        {/*NoFuncBoughtList && NoFuncBoughtList.length > 0 ?*/}
                            {/*<span className={styles.remind} onClick={() => this.goRemind(1)}>提醒一下</span> :*/}
                            {/*<div style={{*/}
                                {/*display: 'flex',*/}
                                {/*justifyContent: 'center',*/}
                                {/*flexDirection: 'column',*/}
                                {/*alignItems: 'center',*/}
                                {/*padding: '20px 0'*/}
                            {/*}}>*/}
                                {/*<img src={require("../../public/assets/kong1.png"   )} alt=""*/}
                                     {/*style={{width: '248px', height: '214px', margin: '20px 0'}}/>*/}
                                {/*<span>暂无相关数据</span>*/}
                            {/*</div>*/}
                    {/*}*/}


                    <span className={styles.title}>
                        <span>未学习（{NoLearnList && NoLearnList.length > 0 ? NoLearnList.length : 0}）</span>
                        <span>可点击头像私聊</span>
                    </span>
                    <div className={styles.box}>
                        {
                            !NoLearnList ? '' : NoLearnList.map((item, index) =>
                                <div key={index} className={styles.item} onClick={() => this.chat(item)}>
                                    <img src={item.UPic} alt=""/>
                                    <span>
                                        {item.UName}
                                    </span>
                                </div>
                            )
                        }

                    </div>
                    {this.NoLearnList()}
                    {/*{*/}
                        {/*this.state.NoLearnList && this.state.NoLearnList.length > 0*/}
                            {/*?*/}
                            {/*<span className={styles.remind} onClick={() => this.goRemind(2)}>提醒一下</span>*/}
                            {/*:*/}
                            {/*<div style={{*/}
                                {/*display: 'flex',*/}
                                {/*justifyContent: 'center',*/}
                                {/*flexDirection: 'column',*/}
                                {/*alignItems: 'center',*/}
                                {/*padding: '20px 0'*/}
                            {/*}}>*/}
                                {/*<img src={require("../../public/assets/kong1.png")} alt=""*/}
                                     {/*style={{width: '248px', height: '214px', margin: '20px 0'}}/>*/}
                                {/*<span>暂无相关数据</span>*/}
                            {/*</div>*/}
                    {/*}*/}

                </div>


                <div className={styles.study}>

                    {
                        userList && userList.length !== 0 ? userList.map((item, index) =>
                                <div key={index} className={styles.oneStudy}>
                            <span className={styles.rankNumber}>
                                {
                                    index > 2 ? <span>{index + 1}</span> :
                                        <img src={require(`../../public/assets/jiangpai${index + 1}.png`)} alt=""/>
                                }
                            </span>
                                    <div className={styles.rankImg}>
                                        <img src={item.UPic} alt=""/>
                                    </div>
                                    <span className={styles.rankItem}>
                            <div className={styles.itemOne}>
                                <span className={styles.name}>{item.UName} </span>
                                <span>积分 &nbsp;&nbsp;{item.Point} </span>
                            </div>
                            <div className={styles.itemTwo}>
                                <span style={{fontSize:24}}>{item.HonorRollCnt} 次上榜荣誉</span>
                                <span style={{fontSize:24}}>学习时长 &nbsp;&nbsp;{Math.floor(item.LearnSeconds / 60)} 分</span>
                            </div>
                        </span>
                                </div>
                        ) : <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '20px 0'
                        }}>
                            <img src={require("../../public/assets/kong1.png")} alt=""
                                 style={{width: '248px', height: '214px', margin: '20px 0'}}/>
                            <span>暂无相关数据</span>
                        </div>
                    }
                </div>


            </Tabs>


        </div>
    }

}