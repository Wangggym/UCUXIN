//本周排行
import * as React from "react";
import styles from './page.less'
import {Button, Icon, Toast, WhiteSpace} from 'antd-mobile'
import api from '../../api'
import router from "umi/router";
// import Config from '../../api/config';
import changeTimeFuc from '../../components/changeTimeFuc'

const time = require('../../public/assets/ryb_time.png')
const read = require('../../public/assets/ryb_read.png')
const learn = require('../../public/assets/ryb_learn.png')
const jf = require('../../public/assets/ryb_jf.png')

const nodata = (RuleRemind) =>{
    return (
        <div>
            <div style={{backgroundColor: '#fff', padding: '30px 0'}}>
                <img style={{width: '50%'}} src={require('../../public/assets/noPoins.png')}/>
                <p style={{color: '#888', margin: '20px 0'}}>暂无排名</p>
                <p style={{color: '#888', margin: '10px 0'}}>本周你还没有开始学习，加油就会迎头赶上的</p>
            </div>
            <WhiteSpace size="xs" />
            <div className={styles.card}>
                <img style={{width: '50%'}} src={require('../../public/assets/jf50.png')} alt=""/>
                <p style={{color: '#888', margin: '20px 0'}}>{RuleRemind}</p>
                <div className={styles.btn} onClick={() => router.push('/courseList')}>去学习</div>
            </div>
        </div>
    );
} 
const noone = <div>
    <img src={require('../../public/assets/ryb_noone.png')} alt=""/>
    <p style={{color: '#888', marginTop: 15}}>暂无人员上榜</p>
</div>;

export default class Home extends React.PureComponent {
    state = {
        data: {
            PointRank: {},
            LearnSecondsRank: {},
            LearnDaysRank: {},
            HabitRank: {},
        },
        loading: true,
    }
    componentWillUnmount() {
        Toast.loading('加载中', 1.5);
    }
    
    
    setLoading = (RuleRemind) => {
        if (this.state.loading) {
             return null;
        } else {
            return (<div className={styles.body}>{nodata(RuleRemind)}</div>);
        }
    }

    // 设置上升名次 
    setArrows = (data) => {
        if (!data || !data.ChangeRank) {
            return null;
        }
        if (data.ChangeRank > 0) {
            return ( <p><span className={styles.uparrow} /><span className={styles.fontSpan}>比昨天上升{data.ChangeRank}名</span> </p> )
        } else {
            return ( <p><span className={styles.downarrow} /><span className={styles.fontSpan}>比昨天下降{-data.ChangeRank}名</span> </p> )
        }

    }

    componentDidMount() {
        let params;
        if (getQueryString('token')) {
            params = {
                weekID: getQueryString('weekID'),
                token: getQueryString('token')
            }
        } else {
            params = {
                weekID: getQueryString('weekID') || 0,
            }
        }
        api.GetMyWeekRank(params).then(res => {
            if (res.Ret === 0) {
                this.setState({
                    data: res.Data,
                    loading: false,
                })
            }
            Toast.hide();
        })
    }
    
    setHeartenMsg = () => {
        const {data: {PointRank, LearnSecondsRank, LearnDaysRank, HabitRank}} = this.state;
        const data = [PointRank, LearnSecondsRank, LearnDaysRank, HabitRank];
        let topNum = false;
        let middMum = false;
        for (const value of data) {
            if (value) {
                if (value.Rank <　4 ) {
                    topNum = true;
                }
                if (value.Rank < 10 && value.Rank > 4) {
                    middMum = true;
                }
            }
        }
       
        if (topNum) {
            return '本周上荣誉榜是非你莫属，加油，不能让他们赶超了';
        }
        if (middMum) {
            return '本周上荣誉榜的概率较大，加油哟';
        }
        return '本周上荣誉榜的机会在前方等着你，努力吧';
    }

    isPupil() {
        return JSON.parse(sessionStorage.getItem('user')) 
        && JSON.parse(sessionStorage.getItem('user')).PhaseID 
        && JSON.parse(sessionStorage.getItem('user')).PhaseID === '30020';
    }
  

    render() {
        const {data: {PointRank, LearnSecondsRank, LearnDaysRank, HabitRank, RuleRemind, WeekIsLearn}} = this.state;
       
         return (<div>
            {
                !WeekIsLearn ? this.setLoading(RuleRemind) :
                    <div>
                        <div className={styles.card} style={{marginTop: 0, padding: 0}}>
                            <div className={styles.content}>
                                <ul>
                                    {PointRank && <li>
                                        <div className={styles.card_img}>
                                            <img style={{width: '50%'}} src={jf} alt=""/>
                                        </div>
                                        <div className={styles.card_content}>
                                            <div>
                                                <span>积分</span>
                                                <span>{PointRank && PointRank.Num && PointRank.Num}</span>
                                                <span>{PointRank && PointRank.Rank && PointRank.Rank}名</span>
                                            </div>
                                          {this.setArrows(PointRank)}
                                        </div>
                                    </li>}
                                    {this.isPupil() &&  <li>
                                        <div className={styles.card_img}>
                                            <img style={{width: '50%'}} src={read} alt=""/>
                                        </div>
                                        <div className={styles.card_content}>
                                            <div>
                                                <span>好习惯</span>
                                                <span>{HabitRank && HabitRank.Num && HabitRank.Num}</span>
                                                <span>{HabitRank && HabitRank.Rank ? `${HabitRank.Rank}名` : '暂无排名'}</span>
                                            </div>
                                            {this.setArrows(HabitRank)}
                                        </div>
                                    </li>}
                                    {<li>
                                        <div className={styles.card_img}>
                                            <img style={{width: '50%'}} src={learn} alt=""/>
                                        </div>
                                        <div className={styles.card_content}>
                                            <div>
                                                <span>连续学习</span>
                                                <span>{LearnDaysRank && LearnDaysRank.Num && LearnDaysRank.Num}</span>
                                                <span>{LearnDaysRank && LearnDaysRank.Rank ? `${LearnDaysRank.Rank}名` : '暂无排名'}</span>
                                            </div>
                                            {this.setArrows(LearnDaysRank)}
                                        </div>
                                    </li>}
                                    {<li>
                                        <div className={styles.card_img}>
                                            <img style={{width: '50%'}} src={time} alt=""/>
                                        </div>
                                        <div className={styles.card_content}>
                                            <div>
                                                <span>学习时长</span>
                                                <span>{LearnSecondsRank && LearnSecondsRank.Num && changeTimeFuc(LearnSecondsRank.Num)}</span>
                                                <span>{LearnSecondsRank && LearnSecondsRank.Rank ? `${LearnSecondsRank.Rank}名` : '暂无排名'}</span>
                                            </div>
                                            {this.setArrows(LearnSecondsRank)}
                                        </div>
                                    </li>}
                                    <li style={{border: 'none', paddingLeft: '15px'}}>
                                        <div className={styles.rule}>
                                            <span>{this.setHeartenMsg()}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <WhiteSpace size="xs" />
                        <div className={styles.card} style={{textAlign: 'center'}} >
                            <img style={{width: '50%'}} src={require('../../public/assets/jf50.png')} alt=""/>
                            <p style={{color: '#888', margin: '20px 10px', lineHeight:1.3, textAlign: 'center'}}>{RuleRemind && RuleRemind}</p>
                            <div style={{display: 'flex', margin:'30px 0'}}>
                            <div className={styles.btn} style={{background:'#fff', color:'#27A4FB'}} onClick={() => router.push('/studentReport')}>查看周荣誉榜</div>                             
                                <div className={styles.btn} onClick={() => router.push('/courseList')}>去学习</div>
                            </div>
                            
                        </div>
                      
                    </div>
            }


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


