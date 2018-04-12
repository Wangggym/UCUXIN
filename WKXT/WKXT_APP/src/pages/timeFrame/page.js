//时段详情【页面33】

import * as React from "react";
import styles from './page.less'
import api from '../../api'
import isMock from '../../api/config'
import {Toast} from 'antd-mobile';

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    };

    componentDidMount() {
        api.GetTimeFrameList().then(res => {
            if (res.Ret === 0) {
                this.setState({
                    data: res.Data,
                })
            } else {
                Toast.fail(res.Msg);
            }
        })
    }


    render() {
        const data = this.state.data;
        return <div className={styles.timeFrame}>
            {
                data && data.length > 0 ? data.map((item, index) =>
                    <div key={index} className={styles.myRank}>
                        <div className={styles.rankImg}>
                            <img src={item.UPic} alt=""/>
                        </div>
                        <span className={styles.rankItem}>
                                <div className={styles.itemOne}>
                                    <span className={styles.name}>{item.UName}</span>
                                    <span>{item.Cnt}次21时后学习</span>
                                </div>
                                <div className={styles.itemTwo}>
                                    <span>学习时段集中在{item.Concentrate}时</span>
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
    }
}