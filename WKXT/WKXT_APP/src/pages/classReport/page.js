//班级报告首页 页面31
import * as React from "react";
import styles from './page.less'
import {Toast} from 'antd-mobile';
import api from '../../api'
import router from "umi/router";
import Config from '../../api/config';
import ReactEcharts from 'echarts-for-react';
// const color = [['#35A6E8', '#A4D8FD'],['#53aa17','#a1cd84'],['#df4a00','#a1cd84'],['#b65ee3','#a1cd84']];
const colors = [
    ['#399fff','#c7e0ff'],
    ['#5ac737','#f3ffb8'],
    ['#EB6100','#fbc4a4'],
    ['#BD79DE','#EDCFFD'],
    ['#B96C30','#FDDCCF'],
    ['#5258D2','#DDDFFF'],
    ['#51C840','#CFF8CC'],
];
const data = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300}];
export default class Home extends React.Component {
    state = {
        data: {},
        loading:true,
        PhaseID: JSON.parse(sessionStorage.getItem('user'))?JSON.parse(sessionStorage.getItem('user')).PhaseID:0,//30020表示是小学,获取缓存数据判断用户是不是小学生
    };

    componentDidMount() {

        if (!this.state.PhaseID){
            sessionStorage.setItem('goBack', '1');
            router.push('/home');
        }
        Toast.loading("加载中",1);
        api.GetClassReport().then(res => {
            this.setState({
                loading:false,
            });
            if (res.Ret === 0) {
                this.setState({
                    data: res.Data
                })
            } else {
                Toast.fail(res.Msg);
            }
        })
    }
    //整体学习情况
    pieData = (name, cnt, rate) => {
        let option;
        rate = !rate ? 100 : rate;
        let one = rate;
        let two = 100 - one;
        return option = {
            color: ['#35A6E8', '#A4D8FD',],
            title: {
                text:'{gray|' + cnt + '}{green|' + name + '}',
                textStyle: {
                    rich: {
                        gray: {
                            padding:[
                                -5,  // 上
                                6, // 右
                            ],
                            color: '#262626 ',
                            fontSize:40,
                        },
                        green: {
                            verticalAlign:"bottom",
                            color: '#c2c2c2',
                            fontSize:16,
                        }
                    },
                },
                x:'center',
                y:'center',
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['90%', '100%'],
                    avoidLabelOverlap: false,
                    hoverAnimation:false,  // 去掉鼠标悬浮效果
                    legendHoverLink:false, // 去掉移动高亮效果
                    silent:false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            },
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {value: one, name: ''},
                        {value: two, name: ''},
                    ]
                }
            ]
        };
    };
    //学科观看率
    pieData2 = (item,key) => {
        // let name = item.SubjectName;
        let cnt = item.PlayRate;
        let rate = item.PlayRate;
        let option;
        rate = !rate ? 100 : rate;
        let one = rate;
        let two = 100 - one;
        return option = {
            // color: ['#35A6E8', '#A4D8FD',],
            color: colors[key],
            title: {
                text:'{gray|' + cnt + '}{green|' + "%" + '}',
                textStyle: {
                    rich: {
                        gray: {
                            padding:[
                                -5,  // 上
                                6, // 右
                            ],
                            color: '#262626 ',
                            fontSize:40,
                        },
                        green: {
                            verticalAlign:"bottom",
                            color: '#c2c2c2',
                            fontSize:16,
                        }
                    },
                },
                x:'center',
                y:'center',
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['90%', '100%'],
                    avoidLabelOverlap: false,
                    hoverAnimation:false,  // 去掉鼠标悬浮效果
                    legendHoverLink:false, // 去掉移动高亮效果
                    silent:false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [
                        {value: one, name: ''},
                        {value: two, name: ''},
                    ]
                }
            ]
        };
    };
    //学习时段分布
    getOption1 = (x, y) => {
        return {
            color: ['#EAF3FE','#5da9da'],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    // data: x
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

                }
            ],
            yAxis: [
                {
                    type: 'value',
                }
            ],
            series: [
                {
                    type: 'line',
                    // data: y,
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    areaStyle: {
                        //color:"#5da9da"
                    },
                    lineStyle: {
                        color: ['#5da9da'],
                    }
                }
            ]
        };
    };
    //查看微课
    goCourseList = () => {
        router.push('/courseList');
    };
    //跳转学习详情
    goStudyDetail = () => {
        router.push('/studyDetails');
    };
    //跳转学科观看率详情
    goSubjectDetail = () => {
        router.push('/subjectLearnDetail');
    };
    //跳转学习时段
    goTimeFrame = () => {
        router.push('/timeFrame');
    };
    //跳转连续学习天数详情
    goConLearnList = () => {
        router.push('/conLearnList');
    };
    //跳转连续学习天数详情
    goLearnDaysList = () => {
        router.push('/learnDaysList');
    };
    //跳转班级周报
    goTeacherReport = () => {
        router.push('/teacherReport');
    };
    //提醒
    goRemind = (i) => {
        const {data} = this.state;
        sessionStorage.setItem('UMs', []);
        sessionStorage.setItem('RemindUserType', i);
        sessionStorage.setItem('IsSubject', false);
        sessionStorage.setItem('IsWeek', false);
        router.push('/remind');
    };
    render() {
        const {data, PhaseID} = this.state;
        const {LearnConditionReport, EvaluateReport, LearnTimeFrameReport, ContinLearnReport, WeekHonorRollReport, AccumuLearnReport} = data;
        const subject = !EvaluateReport ? '' : EvaluateReport.SubjectPlayRateList;
        return <div className={styles.box}>
            {
              this.state.loading ? "":  data && !data.IsLearn ?
                    <div className={styles.classReport}>
                        <div className={styles.card}>
                            <div className={styles.card_title}>
                                <h3>整体学习情况</h3>
                                <span style={{color: '#eeeeee'}}>查看详情</span>
                            </div>
                            <div className={styles.card_content_circle}>
                                <div>
                                    <ReactEcharts className={styles.pie}
                                                  option={this.pieData('人', '0', 100)}
                                                  style={{height: 240, width: '100%'}}/>
                                    <div style={{textAlign:"center",color:"#c2c2c2",paddingTop: '5px'}}>开通服务</div>
                                </div>
                                <div>
                                    <ReactEcharts className={styles.pie}
                                                  option={this.pieData('人', '0', 100)}
                                                  style={{height: 240, width: '100%'}}/>
                                    <div style={{textAlign:"center",color:"#c2c2c2",paddingTop: '5px'}}>有学习记录</div>
                                </div>
                                <div>
                                    <ReactEcharts className={styles.pie}
                                                  option={this.pieData('分钟', '0', 100)}
                                                  style={{height: 240, width: '100%'}}/>
                                    <div style={{textAlign:"center",color:"#c2c2c2",paddingTop: '5px'}}>平均学习时长</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.noDataBtn}>
                            <a onClick={this.goCourseList}>查看微课</a>
                            <a onClick={() => this.goRemind(4)}>提醒一下</a>
                        </div>
                        <div className={styles.nostudyWrp}>
                            <div className={styles.nostudy}>
                                <img src={require("../../public/assets/ace536f61d8682bd04c91500e5725756.png")} />
                            </div>
                            <div className={styles.textInfo}>全班同学无人学习，暂无数据</div>
                        </div>
                    </div>
                    : <div className={styles.classReport}>
                        <div className={styles.card}>
                            <div className={styles.card_title}>
                                <h3>整体学习情况</h3>
                                <span onClick={this.goStudyDetail}>查看详情</span>
                            </div>
                            <div className={styles.card_content_circle}>
                                <div>
                                    <ReactEcharts className={styles.pie}
                                                  option={this.pieData('人', LearnConditionReport.FuncBoughtCnt, LearnConditionReport.FuncBoughtRate)}
                                                  style={{height: 240, width: '100%'}}/>
                                    <div style={{textAlign:"center", color:"#c2c2c2",paddingTop: '5px'}}>开通服务</div>
                                </div>
                                <div>
                                    <ReactEcharts className={styles.pie}
                                                  option={this.pieData('人', LearnConditionReport.LearnUserCnt, LearnConditionReport.LearnUserRate)}
                                                  style={{height: 240, width: '100%'}}/>
                                    <div style={{textAlign:"center", color:"#c2c2c2",paddingTop: '5px'}}>有学习记录</div>
                                </div>
                                <div>
                                    <ReactEcharts className={styles.pie}
                                                  option={this.pieData('分钟', parseInt(Math.floor(LearnConditionReport.AvgLearnSeconds / 60)))}
                                                  style={{height: 240, width: '100%'}}/>
                                    <div style={{textAlign:"center", color:"#c2c2c2",paddingTop: '5px'}}>平均学习时长</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.card_title}>
                                <h3>学习时段分布</h3>
                                <span onClick={this.goTimeFrame}>查看详情</span>
                            </div>
                            <div>
                                <ReactEcharts
                                    option={this.getOption1(LearnTimeFrameReport.ChartData.XAxials, LearnTimeFrameReport.ChartData.YAxials,)}
                                    style={{height: '350px', width: '100%'}}
                                    className='react_for_echarts'/>
                            </div>
                            <span style={{
                                display: 'flex',
                                marginTop:10,
                                justifyContent: 'center',
                                textAlign:"center",
                                fontSize:16,
                                color:"#c2c2c2",
                            }}>{!LearnTimeFrameReport ? '' : LearnTimeFrameReport.Conclusion}</span>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.card_title}>
                                <h3>学科观看率</h3>
                                <span onClick={this.goSubjectDetail}>查看详情</span>
                            </div>
                            <div className={styles.card_content_circle} style={{width: '100%', overflowX: 'scroll'}}>
                                {
                                    !subject ? '' : [...subject, ...subject,...subject].map((item, index) => {
                                        return <div key={index}>
                                            <ReactEcharts className={styles.pie}
                                                          option={this.pieData2(item,index % subject.length)}
                                                          style={{height: 240, width: '100%'}}/>
                                            <div style={{textAlign:"center", color:"#c2c2c2",paddingTop: '5px'}}>{item.SubjectName}</div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>


                        {
                            PhaseID === '30020' ? <div className={styles.card}>
                                <div className={styles.card_title}>
                                    <h3>连续学习天数</h3>
                                    {
                                        ContinLearnReport && ContinLearnReport.Cnt !== 0 ? <span onClick={this.goConLearnList}>查看详情</span> :
                                            <span style={{color: '#eeeeee'}}>查看详情</span>
                                    }
                                </div>
                                {
                                    ContinLearnReport.Cnt && ContinLearnReport.Cnt !== 0 ?
                                        <ReactEcharts
                                            option={this.getOption1(ContinLearnReport.ChartData.XAxials, ContinLearnReport.ChartData.YAxials)}
                                            style={{height: '350px', width: '100%'}}
                                            className={styles.pie}/> : <span style={{display: 'flex',justifyContent:'center',padding:'20px 0'}}>暂时没有同学连续学习微课</span>
                                }
                                {
                                    ContinLearnReport && ContinLearnReport.Conclusion  ? '' :
                                        <span style={{
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}>{!ContinLearnReport ? '' : ContinLearnReport.Conclusion}</span>
                                }
                            </div> : <div className={styles.card}>
                                <div className={styles.card_title}>
                                    <h3>学习天数</h3>
                                    {
                                        AccumuLearnReport && AccumuLearnReport.Days !== 0 ? <span onClick={this.goLearnDaysList}>查看详情</span> :
                                            <span style={{color: '#eeeeee'}}>查看详情</span>

                                    }

                                </div>
                                {
                                    AccumuLearnReport && AccumuLearnReport.Days !== 0 ?
                                        <ReactEcharts
                                            option={this.getOption1(AccumuLearnReport && AccumuLearnReport.ChartData ? (AccumuLearnReport.ChartData.XAxials ,AccumuLearnReport.ChartData.YAxial) : (0,0))}
                                            style={{height: '350px', width: '100%'}}
                                            className={styles.pie}/> :<span style={{display: 'flex',justifyContent:'center',padding:'20px 0'}}>暂时没有同学学习微课</span>
                                }
                                {
                                    AccumuLearnReport && AccumuLearnReport.Conclusion ? '' :
                                        <span style={{
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}>{!AccumuLearnReport ? '' : AccumuLearnReport.Conclusion}</span>
                                }
                            </div>

                        }


                        <div className={styles.card}>
                            <div className={styles.card_title}>
                                <h3>第{!data.WeekHonorRollReport.WeekID ? 0 : data.WeekHonorRollReport.WeekID}周报告</h3>
                                <span onClick={this.goTeacherReport}>查看详情</span>
                            </div>
                            <div className={styles.cardContent}>
                                <img className={styles.noData} src={require("../../public/assets/noData.png")} alt=""/>
                                <div className={styles.cardText}>
                                    <p>{!WeekHonorRollReport ? '' : WeekHonorRollReport.HonorRollCnt}名同学荣登荣誉榜</p>
                                    <p>{!WeekHonorRollReport ? '' : WeekHonorRollReport.AttentionCnt}名同学需要关注</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.btn}>
                            <a onClick={this.goCourseList}>观看微课</a>
                        </div>
                    </div>
            }
        </div>
    }
}