import * as React from "react";
import ReactEcharts from 'echarts-for-react';
import styles from './page.less'
import { Tabs, WhiteSpace } from 'antd-mobile';
import api from '../../api'
import router from 'umi/router';

export default class Home extends React.Component {
    state = {
        status: false,
    };

    componentDidMount() {

    };
    changeStatus = () =>{
        this.state.status ? this.setState({status:false}) : this.setState({status:true});
    };
    goStudy = () => {
        router.push('/pointsRuler');
    };
    goPointsItem = () => {
        router.push('/pointsItem');
    };


    render(){
        const  status = this.state.status;
        return <div className={styles.buyResult}>
            <div className={styles.banner}>
                <img src="../../public/assets/wkxt.png" alt=""/>
            </div>
            {status ? <div className={styles.content}>
                        <img className={styles.resultImg} src="../../public/assets/success.png" alt=""/>
                        <span className={styles.resultText}>您已经成功开通微课学堂服务</span>
                      </div>
                : <div className={styles.content}>
                    <img className={styles.resultImg} src="../../public/assets/false.png" alt=""/>
                    <span className={styles.resultText}>购买失败</span>
                  </div>
            }

            <div className={styles.footer}>
                <span  onClick={this.changeStatus}>稍后学习</span>
                {status ?  <span className={styles.btn} onClick={this.goStudy}>去学习</span>
                    : <span className={styles.btn}  onClick={this.goStudy}>重新购买</span>
                }
            </div>



        </div>
    }

}