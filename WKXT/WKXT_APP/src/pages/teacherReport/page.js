//教师每周荣誉榜
import * as React from "react";
import styles from './page.less'
import { Tabs,Toast, WhiteSpace} from 'antd-mobile'
import api from '../../api'
import router from "umi/router";
import Config from '../../api/config';

const share = require('../../public/assets/ryb_share.png')
const princess = require('../../public/assets/ryb_princess.png')

const { Fragments } = React;
const noone = <div>
    <img src={require('../../public/assets/ryb_noone.png')} alt=""/>
    <p style={{color: '#888', marginTop: '36px'}}>暂无人员上榜</p>
</div>;
const tabs = [
    {title: '荣誉榜'},
    {title: '需关注'}
];
export default class Home extends React.Component {
    state = {
        data: {
            SDate: '',
            EDate: '',
            WeekID: null,
            HonorRoll: {
                HabitRankList: [],
                LearnDaysRankList: [],
                LearnSecondsRankList: [],
                PointRankList: []
            }
        },
        pay_attention_list: {
            NightbirdList: [],
            NoLearnList: [],
            NoFuncBoughtList: []
        },
        classInfo: JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')).ClassName: null,       
        PhaseID:  JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')).PhaseID: null,       
    }

    componentWillMount() {
        if (!this.state.PhaseID) {
            sessionStorage.setItem('goBack', '1');
            router.push('/');   
        }
    }
    componentDidMount() {
       
        api.GetWeekReport({weekID: getQueryString('weekID') || 0}).then(res => {
            if (res.Ret === 0) {
                res.Data.EDate = res.Data.EDate.slice(0, 10);
                res.Data.SDate = res.Data.SDate.slice(0, 10);
                for (let x in res.Data.HonorRoll) {
                    let arr = [res.Data.HonorRoll[x][1], res.Data.HonorRoll[x][0], res.Data.HonorRoll[x][2]];
                    res.Data.HonorRoll[x] = arr;
                }
                this.setState({
                    data: res.Data,
                    weekID: res.weekID,
                })
            }else{
                Toast.fail(res.Msg);
            }
        })
        api.GetAttentionUserList({weekID: getQueryString('weekID') || 0}).then(res => {
            if (res.Ret === 0) {

                this.setState({
                    pay_attention_list: res.Data
                })
            }else{
                Toast.fail(res.Msg);
            }
        })
    }

     //点击头像私聊
     chat = (e) => {
        if (e.UID === 0 || e.UID === "0"){
            Toast.fail("该学生还没有激活，无法发起私聊!");
        }else {
            window.location.href = `ucux://vcard?type=contact&uid=${e.UID}`;
        }
    };

    // NightbirdList
    // 勤劳的夜猫子(晚上11点后学习的同学)   1
    // NoLearnList
    // 迷路的孩子(未学习的同学)   2
    // NoFuncBoughtList
    // 沉睡的孩子(未开通服务的同学)   3
    //提醒表扬
    goRemind = (i) => {
        // console.log(this.state.data.WeekID);
        const {data, pay_attention_list} = this.state;
        i === 4 ? sessionStorage.setItem('UMs', []) : i === 1 ? sessionStorage.setItem('UMs', JSON.stringify(pay_attention_list.NightbirdList))
            : i === 2 ? sessionStorage.setItem('UMs', JSON.stringify(pay_attention_list.NoLearnList)) : sessionStorage.setItem('UMs', JSON.stringify(pay_attention_list.NoFuncBoughtList));
        sessionStorage.setItem('RemindUserType', i);
        sessionStorage.setItem('WeekID', data.WeekID);
        sessionStorage.setItem('IsSubject', false);
        sessionStorage.setItem('IsWeek', true);
        router.push('/remind');
    };

    handerIsLearnCard(list, title, unit, second = false) {
        return (
            <div className={styles.card}>
                 <div className={styles.title}>
                    { title }
                </div>
                <div className={styles.content}>
                    {
                        !list.length ? noone : list.map(e => {
                            if (e) {
                                const number = second ? Math.ceil(e.Num / 60) : e.Num;
                                if (e.Rank === 1) {
                                    return <div key={e.UName} className={styles.one_wrap}>
                                        <div className={styles.one}></div>
                                        <img src={e.UPic} alt=""/>
                                        <div className={styles.one_name}>
                                            <p>{e.UName}</p>
                                            <small>{`${number}  ${unit}`}</small>
                                        </div>
                                    </div>
                                } else if (e.Rank === 2) {
                                    return <div className={styles.second_wrap}>
                                        <div className={styles.second}></div>
                                        <img src={e.UPic} alt=""/>
                                        <div className={styles.second_name}>
                                            <p>{e.UName}</p>
                                            <small>{`${number}  ${unit}`}</small>
                                        </div>
                                    </div>
                                } else if (e.Rank === 3) {
                                    return <div className={styles.three_wrap}>
                                        <div className={styles.three}></div>
                                        <img src={e.UPic} alt=""/>
                                        <div className={styles.three_name}>
                                            <p>{e.UName}</p>
                                            <small>{`${number}  ${unit}`}</small>
                                        </div>
                                    </div>
                                }
                            }
                        
                        })
                    }
                </div>    
            </div>
           
        )
       
    }
    handerIsLearnNum = (honorRoll) => {
        let count = 0;
        const { classInfo, data: { WeekID } } = this.state;
        Object.values(honorRoll).map((value) => {
            if (Array.isArray(value) && value.length) {
                count += value.length;
            }
        });
        return (
          <p className={styles.is_learninfo}>恭喜下列 {count} 名同学荣登第 { WeekID } 周 { classInfo } 的荣誉榜</p>  
        );
    }
    handerAttentionNum = (data) => {
        let count = 0;
        Object.values(data).map((value) => {
            if (Array.isArray(value) && value.length) {
                count += value.length;
            }
        });
        return (
          <p className={styles.is_learninfo}>下列 {count} 名同学需多多关注</p>  
        );
    }
    handerAttentionUserListCard  = (userList, title, info, remind = 2) => {
        const noone =(
                <div style={{height: '100%', marginTop: 100}}>
                    <img style={{ width:150}} src={require('../../public/assets/ryb_noone.png')} alt=""/>
                    <p style={{color: '#888', marginTop: '36px'}}>暂无人员</p>
                 </div>
        ) ;
        let body = noone;
        if ( Array.isArray(userList) && userList.length) {
            body = (
                <div>
                    <div className={styles.pacontent} >
                    {
                        userList.map((e, i) => {
                            return (
                                <div key={e.UMID} className={styles.pawrap}>
                                    <img onClick={() => this.chat(e)} src={e.UPic} alt=""/>
                                    <p className={styles.user_name}>{e.UName}{e.UName}{e.UName}</p>
                                    <p className={styles.user_status} style={{color:remind !== 3 ? '#888': 'red'}}>{getUserStatus(remind, this.state.PhaseID)}</p>
                                </div>
                            )
                        })
                    }
                    </div>
                    <div className={styles.pacardbottom} onClick={() => this.goRemind(remind)}>
                        提醒一下
                    </div>
            </div>
            )
        }
        return (
            <div className={styles.pacard}>
                <div className={styles.title_red}>
                    {title}
                </div>
                {body}
            </div>
        )
    }
    render() {
        const {data, pay_attention_list, classInfo} = this.state;
        return (<div>
            <div className={styles.head}
                 style={{borderBottom: '1px solid #eee'}}>
                  <h4>{ classInfo }</h4>
                <p className={styles.weekInfo}>第{data.WeekID}周（{`${data.SDate}至${data.EDate}`}）</p>
            </div>
            {
                ! data.IsLearn ? <div className={styles.body}>
                        <div>
                            <img src={require('../../public/assets/ryb_nodata.png')}
                                 style={{width: '256px', height: '260px'}} alt=""/>
                            <p style={{color: '#888', marginTop: '36px'}}>全班无人学习，暂无数据</p>
                        </div>
                    </div> :
                    <Tabs tabs={tabs}
                          initialPage={0}
                          swipeable={false}
                        // onChange={(tab, index) => { console.log('onChange', index, tab); }}
                        // onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                    >
                     <div className={styles.tab_card}>
                        {this.handerIsLearnNum(data.HonorRoll)}
                        {this.handerIsLearnCard(data.HonorRoll.PointRankList, '积分', '分')}
                        {this.handerIsLearnCard(data.HonorRoll.LearnSecondsRankList, '学习时长', '分钟', true)}
                        {this.handerIsLearnCard(data.HonorRoll.LearnDaysRankList, '连续学习天数', '天')}
                        {this.handerIsLearnCard(data.HonorRoll.HabitRankList, '好习惯', '天')}
                     
                    </div>
                    <div className={styles.tab_card}>
                        {this.handerAttentionNum(pay_attention_list)}
                        {this.handerAttentionUserListCard(pay_attention_list.NightbirdList, '勤奋的夜猫子', '分', 1)}
                        {this.handerAttentionUserListCard(pay_attention_list.NoFuncBoughtList, '沉睡的孩子', '分', 3)}
                        {this.handerAttentionUserListCard(pay_attention_list.NoLearnList, '迷路的孩子', '分', 2)}
                    </div>
                       
                    </Tabs>
                    
            }
             <WhiteSpace size="xs" />
            <div className={styles.fixed}>
                    <a onClick={() => router.push('/courseList')}>观看微课</a>
                    { data.IsLearn ? null : <a onClick={() => this.goRemind(4)}>提醒一下</a>}
                </div>



        </div>)
    }

}


function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function getUserStatus(type, PhaseID) {
    if (type === 1) {
        if (PhaseID === '30020') {
            return '21:00 还在学习';
        } else {
            return '22.30 还在学习';
        }
    }
    if (type === 2) {
        return '未学习';
    }
    if (type === 3) {
        return '未开通';
    }
}