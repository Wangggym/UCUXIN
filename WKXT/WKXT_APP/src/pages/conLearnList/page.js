//连续学习天数统计  36
import * as React from "react";
import {Button} from 'antd-mobile'
import api from '../../api'
import styles from './page.less'

export default class List extends React.Component {
    state = {
        list: []
    }

    componentDidMount() {
        api.GetContinLearnList().then(res => {
            if (res.Ret == 0) {
                this.setState({
                    list: res.Data
                })
            }
        })
    }

    render() {
        const {list} = this.state;
        return (
            <div className={styles.conlearnlist}>
                <ul>
                    {
                        list.length == 0 ? <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '20px 0'
                        }}>
                            <img src="../../../src/public/assets/kong1.png" alt=""
                                 style={{width: '248px', height: '214px', margin: '20px 0'}}/>
                            <span>暂无相关数据</span>
                        </div> : list.map((e, i) => {
                            if (i < 3) {
                                return <li>
                                    <img width='50px' height='50px' style={{maxWidth: '50px'}}
                                         src={require(`../../public/assets/jiangpai${i + 1}.png`)}/>
                                    <img src={e.UPic} className={styles.head}/>
                                    <span>{e.UName}</span>
                                    <div>
                                        <p>连续学习记录</p>
                                        <p>最大连续天数</p>
                                    </div>
                                    <div>
                                        <p>{e.ContinCnt}次</p>
                                        <p>{e.ContinDays}天</p>
                                    </div>
                                </li>
                            } else {
                                return <li>
                                    <span
                                        style={{width: '50px', textAlign: 'center', fontWeight: 'bold'}}>{i + 1}</span>
                                    <img src={e.UPic} className={styles.head}/>
                                    <span>{e.UName}</span>
                                    <div>
                                        <p>连续学习记录</p>
                                        <p>最大连续天数</p>
                                    </div>
                                    <div>
                                        <p>{e.ContinCnt}次</p>
                                        <p>{e.ContinDays}天</p>
                                    </div>
                                </li>
                            }
                        })
                    }
                </ul>
            </div>)
    }
};