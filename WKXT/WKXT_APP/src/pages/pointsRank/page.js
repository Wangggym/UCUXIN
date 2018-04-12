//积分排名【页面17】
import * as React from "react";
import ReactEcharts from 'echarts-for-react';
import styles from './page.less'
import {Tabs, WhiteSpace, Toast} from 'antd-mobile';
import api from '../../api'
import router from 'umi/router';
import {changeTimeFuc} from '../../components'

export default class Home extends React.Component {
    state = {
        data: {}
    };

    componentDidMount() {
        api.GetPointOverView().then(res => {
            if (res.Ret === 0) {
                this.setState({
                    data: res.Data,
                })
            } else {
                Toast.fail(res.Msg);
            }
        })
    };

    //积分规则
    goPointsRuler = () => {
        router.push('/pointsRuler');
    };
    //积分明细
    goPointsItem = () => {
        let {data} = this.state;
        data.TotalPoint && router.push('/pointsItem');
    };
    //去学习
    goStudy = () => {
        router.push('./courseList');
    };

    render() {
        const tabs = [
            {title: '班级排名', sub: '1'},
            {title: '全国排名', sub: '2'},
        ];
        const {data} = this.state;
        return <div className={styles.pointsRank}>
            <div className={styles.title}>
                <div className={styles.number}>
                    <div style={{textAlign:'center'}}>
                      {!data.TotalPoint ? 0 : data.TotalPoint}
                        <span onClick={this.goPointsItem} className={styles.ruler}>积分明细</span>
                    </div>
                </div>
                <div className={styles.explain}>
                    <span>
                    <span>累计积分</span>
                    <img src={require('../../public/assets/gz.png')} alt="" onClick={this.goPointsRuler}/>
                    </span>
                </div>

            </div>

            <div className={styles.twoPoints}>
                <div className={styles.left}>
                    今日积分：{!data.TodayPoint ? 0 : data.TodayPoint}
                </div>
                <div className={styles.line}>

                </div>
                <div className={styles.right}>
                    可用积分：{!data.AvailPoint ? 0 : data.AvailPoint}
                </div>

            </div>

            <Tabs tabs={tabs}
                  initialPage={0}
                  tabBarPosition="top"
                  renderTab={tab => <span>{tab.title}</span>}
            >
                <div className={styles.classRank}>
                    {
                        !data.SelfRankOfClass ? '' : <div className={styles.myRank}>
                        <span className={styles.rankNumber}>
                            {data.SelfRankOfClass.Rank === 0 ?
                                <span style={{opacity: 0}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> :
                                
                                    data.SelfRankOfClass.Rank > 3 ? <span>&nbsp;&nbsp;{data.SelfRankOfClass.Rank}</span> :
                                        <img src={require(`../../public/assets/jiangpai${data.SelfRankOfClass.Rank}.png`)} alt="" className={styles.rankCake}/>
                            }
                                
                        </span>
                            <div className={styles.rankImg}>
                                <img src={data.SelfRankOfClass.UPic} alt=""/>
                            </div>
                            <span className={styles.rankItem}>
                            <div className={styles.itemOne}>
                                <span className={styles.name}>{data.SelfRankOfClass.UName}</span>
                                {data.SelfRankOfClass.Rank === 0 ? '' :
                                    <span>积分 &nbsp;&nbsp;&nbsp;&nbsp;{data.SelfRankOfClass.TotalPoint}</span>}
                            </div>
                            <div className={styles.itemTwo}>
                                {data.SelfRankOfClass.Rank === 0 ? <span>暂无排名</span> :
                                    <span>{data.SelfRankOfClass.HonorRollCnt}次上荣誉榜</span>}
                                {data.SelfRankOfClass.Rank === 0 ? '' :
                                    <span>学习时长 &nbsp;&nbsp;&nbsp;&nbsp;{changeTimeFuc(data.SelfRankOfClass.LearnSeconds)}</span>}
                            </div>

                        </span>
                        </div>
                    }

                    {!data.SelfRankOfClass ? '' : <WhiteSpace className={styles.aaa}/>}

                    {
                        data.ClassRank && data.ClassRank.length > 0 ? data.ClassRank.map((item, index) =>
                                <div key={index} className={styles.myRank}>
                        <span className={styles.rankNumber}>
                            {
                                item.Rank > 3 ? <span>{item.Rank}</span> :
                                    <img src={require(`../../public/assets/jiangpai${item.Rank}.png`)} alt="" className={styles.rankCake}/>
                            }
                        </span>
                                    <div className={styles.rankImg}>
                                        <img src={item.UPic} alt=""/>
                                    </div>
                                    <span className={styles.rankItem}>
                            <div className={styles.itemOne}>
                                <span className={styles.name}>{item.UName}</span>
                                <span>积分 &nbsp;&nbsp;&nbsp;&nbsp;{item.TotalPoint}</span>
                            </div>
                            <div className={styles.itemTwo}>
                                <span>{item.HonorRollCnt}次上荣誉榜</span>
                                <span>学习时长 &nbsp;&nbsp;&nbsp;&nbsp;{changeTimeFuc(item.LearnSeconds)}</span>
                            </div>
                        </span>
                                </div>
                        ) : <span style={{display: 'flex', justifyContent: 'center', padding: '30px'}}>暂无数据</span>
                    }


                </div>


                <div className={styles.classRank}>

                    {
                        !data.SelfRankOfAll ? '' : <div className={styles.myRank}>
                        <span className={styles.rankNumber}>
                        {data.SelfRankOfAll.Rank === 0 ?
                                <span style={{opacity: 0}}></span> :
                                    data.SelfRankOfAll.Rank > 3 ? <span>{data.SelfRankOfAll.Rank}</span> :
                                    <img src={require(`../../public/assets/jiangpai${data.SelfRankOfAll.Rank}.png`)} alt="排名" className={styles.rankCake}/>
                            }
                        </span>
                            <div className={styles.rankImg}>
                                <img src={data.SelfRankOfAll.UPic} alt=""/>
                            </div>
                            <span className={styles.rankItem}>
                            <div className={styles.itemOne}>
                                <span className={styles.name}>{data.SelfRankOfAll.UName}</span>
                                {data.SelfRankOfAll.Rank === 0 ? '' :
                                    <span>积分 &nbsp;&nbsp;{data.SelfRankOfAll.TotalPoint}</span>}
                            </div>
                            <div className={styles.itemTwo}>
                                {data.SelfRankOfAll.Rank === 0 ? <span>暂无排名</span> :
                                    <span>{data.SelfRankOfAll.HonorRollCnt}次上荣誉榜</span>}
                                {data.SelfRankOfAll.Rank === 0 ? '' :
                                    <span>学习时长 &nbsp;&nbsp;{changeTimeFuc(data.SelfRankOfAll.LearnSeconds)}</span>}
                            </div>

                        </span>
                        </div>
                    }


                    {!data.SelfRankOfAll ? '' : <WhiteSpace className={styles.aaa}/>}

                    {
                        data.AllRank && data.AllRank.length > 0 ? data.AllRank.map((item, index) =>
                                <div key={index} className={styles.myRank}>
                        <span className={styles.rankNumber}>
                            {
                                item.Rank > 3 ? <span>{item.Rank}</span> :
                                    <img src={require(`../../public/assets/jiangpai${item.Rank}.png`)} alt="" className={styles.rankCake}/>
                            }
                        </span>
                                    <div className={styles.rankImg}>
                                        <img src={item.UPic} alt=""/>
                                    </div>
                                    <span className={styles.rankItem}>
                            <div className={styles.itemOne}>
                                <span className={styles.name}>{item.UName}</span>
                                <span>积分 &nbsp;&nbsp;{item.TotalPoint}</span>
                            </div>
                            <div className={styles.itemTwo}>
                                <span>{item.HonorRollCnt}次上荣誉榜</span>
                                <span>学习时长 &nbsp;&nbsp;{changeTimeFuc(item.LearnSeconds)}</span>
                            </div>
                        </span>
                                </div>
                        ) : <span style={{display: 'flex', justifyContent: 'center', padding: '40px'}}>暂无数据</span>
                    }


                </div>
            </Tabs>

            {/*<div className={styles.btn}>*/}
            {/*<span onClick={this.goStudy}>*/}
            {/*<span>积分兑换</span>*/}
            {/*</span>*/}
            {/*</div>*/}


        </div>
    }

}