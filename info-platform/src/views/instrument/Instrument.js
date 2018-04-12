/**
 * 仪表盘
 */
import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import './Instrument.less';
import ReactDOM from 'react-dom';
import { Tabs , DatePicker, Button ,message,Menu} from 'antd';
import Api from '../../api';
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

class Instrument extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: null,//收费数据
            totalData:null,//彩色活跃度统计
            rankListRight:[],//排行6-10数据
            rankListLeft:[],//排行1-5数据
            rankListRight2:[],//排行6-10数据
            rankListLeft2:[],//排行1-5数据
            sort:'',//排行字段
            countDay: 7,//时间初始化查询天数
            readData:[],//活跃折线图阅读数
            shareData:[],//活跃折线图分享数
            commentData:[],//活跃折线图评论数
            favoriteData:[],//活跃折线图收藏数
            timeData:[],//活跃折线图x坐标
            activeUser:0,//活跃用户数
            OrderAmount:0,//总收入
            OrderCount:0,//付费总人数
            s1:this.getTime(7).t2,//付费开始时间
            e1:this.getTime().t1,//付费结束时间
            s2:this.getTime(7).t2,//历史走势开始时间
            e2:this.getTime().t1,//历史走势结束时间
            moneyTime:[],//收费折线图x坐标
            moneyTotal:[],//收费折线图金额
            moneyCount:[],//收费折线图人数
            isTime:true,//第一个折线图用tab时间还是自定义时间
            isTime2:true,//第二个折线图用tab时间还是自定义时间
            behaviorSum:null,//按日期查询活跃度汇总
            historyAmount:0,//历史走势总收入
            historyCount:0,//历史走势总人数
        }
    };
    componentDidMount() {
        this.GetOrderTotal();//付费情况统计--第一排
        this.GetBehaviorCountList();//按日期获取机构活跃度统计清单--第二个折线图
        this.GetBehaviorTotal();//活跃度统计--彩色
        this.handSort();//按字段排行
        this.GetActiveUserSum();//按日期范围获取活跃用户数
        this.GetOrderSum();//按日期范围获取机构收费统计汇总--折线图右边数据--总收入+总人数
        this.GetOrderCountList();//按日期获取机构收费统计清单--第一个折线图
        this.GetBehaviorSum();//
        this.GetHistorySum()
       	
    }
	
    //付费情况统计--第一排
    GetOrderTotal = () => {
        Api.chart.GetOrderTotal().then(res => {
            if (res.Ret === 0) {
                this.setState({chartData: res.Data});
            } else {
                message.error(res.Msg)
            }
        })
    };
    //获取日期
    getTime = (count) => {
    	
        let num = count > 0 ? count - 1 : count;
        let time1 = new Date();
        let Y1 = time1.getFullYear() + '-';
        let M1 = (time1.getMonth()+1 < 10 ? '0'+(time1.getMonth()+1) : time1.getMonth()+1) + '-';
        let D1 = (time1.getDate() < 10 ? '0' + (time1.getDate()) : time1.getDate()) + ' ';
        let timer1 = Y1 + M1 + D1; // 当前时间
        let time2 = new Date();
        time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * num));
        let Y2 = time2.getFullYear();
        let M2 = ((time2.getMonth() + 1) > 9 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1));
        let D2 = (time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate());
        let timer2 = Y2 + '-' + M2 + '-' + D2;
        return {
            t1 : timer1,
            t2 : timer2,
        };
    };
    //第一个折线图选择tab日期天数
    chooseDate = (e) => {
    	console.log(e)
        this.setState({
            countDay : e,
            s1:this.getTime(e).t2,
            e1:this.getTime(e).t1,
            isTime : true,
        },() => {
            this.GetOrderCountList(e);
            this.GetActiveUserSum(e);
            this.GetOrderSum(e);
        })
    };
    //第一个折线图选择自定义时间范围
    onChange = (date, dateString) =>{
        this.setState({
            s1 : dateString[0],
            e1 : dateString[1],
            scoreStartTime1 : dateString[0],
            scoreEndTime1 : dateString[1],
            isTime : false,
        })
    };


    //第一个折线图确定查询自定义时间范围
    scoreTime = () => {
        this.setState({
            s1 : this.state.scoreStartTime1,
            e1 : this.state.scoreEndTime1,
            isTime : false,
        },()=>{
            this.GetOrderCountList();
            this.GetActiveUserSum();
            this.GetOrderSum();
        });
    };
    //按日期获取机构收费统计清单--第一个折线图
    GetOrderCountList = () => {
        const {moneyTime, moneyTotal, moneyCount, isTime, s1, e1} = this.state;
        
        let beginDate = isTime ? this.getTime(this.state.countDay).t2 : s1;
        let endDate = isTime ? this.getTime().t1 : e1;
        let getDataConfig = {
            beginDate : beginDate,
            endDate : endDate,
        };
        Api.chart.GetOrderCountList(getDataConfig).then(res => {
            if(res.Ret === 0) {
                this.dealOrderData(res.Data);
//                 console.log(res.Data);
//                 console.log(moneyCount);
                this.setState({
                    line_option:{
                        legend:{
                            top:'0',
                            left:'center',
                            data:["付费金额","付费人数"],
                            selected:{
                            	"付费金额":true,
                            	"付费人数":false
                            }
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : moneyTime,
                                axisLabel:{
                                    rotate:-45,
                                }
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                name : '金额（元）'
                            },
                            
                        ],
                        
                        series : [
                            {
                                name:'付费金额',
                                type:'line',
                                data:moneyTotal,
                            },
                            {
                                name:'付费人数',
                                type:'line',
                                data:moneyCount,
                            },
                           

                        ]
                    },

                    show_line: 'number'
                })
            }else {
                message.error(res.Msg);
            }
        })
    };
    //按日期范围获取机构收费统计汇总--折线图右边数据--总收入+总人数
    GetOrderSum = () => {
        const {isTime, s1, e1} = this.state;
        let beginDate = isTime ? this.getTime(this.state.countDay).t2 : s1;
        let endDate = isTime ? this.getTime().t1 : e1;
        let getDataConfig = {
            beginDate : beginDate,
            endDate : endDate,
        };
        Api.chart.GetOrderSum(getDataConfig).then(res => {
            if (res.Ret === 0) {
                this.setState({
                    OrderAmount: res.Data.OrderAmount,
                    OrderCount: res.Data.OrderCount,
                });
            } else {
                message.error(res.Msg)
            }
        })
    };
    //按日期范围获取活跃用户数
    GetActiveUserSum = () => {
        const {isTime, s1, e1} = this.state;
        let beginDate = isTime ? this.getTime(this.state.countDay).t2 : s1;
        let endDate = isTime ? this.getTime().t1 : e1;
        let getDataConfig = {
            beginDate : beginDate,
            endDate : endDate,
        };
        Api.chart.GetActiveUserSum(getDataConfig).then(res => {
            if (res.Ret === 0) {
                this.setState({activeUser: res.Data});
            } else {
                message.error(res.Msg)
            }
        })
    };


    //处理默认时间天数
    deal = (e) => {
        if(!e){
            var e = {
                key : '1'
            };
            return e;
        }
    };
    //第1个折线图数据处理
    dealOrderData = (data) => {
//  	console.log(111)
        const {moneyTime, moneyTotal, moneyCount} = this.state;
        this.setState({
            moneyTime: [],
            moneyTotal: [],
            moneyCount: [],
        });
        data.map(item => {
            moneyTotal.push(item.OrderAmount);
            moneyCount.push(item.OrderCount);
            moneyTime.push(item.Date);
        })
    };
    //第二个折线图数据处理
    dealData = (data) => {
        const {commentData, readData, shareData, favoriteData, timeData} = this.state;
        this.setState({
            commentData: [],
            readData: [],
            shareData: [],
            favoriteData: [],
            timeData: [],
        });
        data.map(item => {
            commentData.push(item.CommentCount);
            readData.push(item.ReadCount);
            shareData.push(item.ShareCount);
            favoriteData.push(item.FavoriteCount);
            timeData.push(item.Date);
        })
    };


    //活跃度统计--彩色
    GetBehaviorTotal = () => {
        Api.chart.GetBehaviorTotal().then(res => {
            if (res.Ret === 0) {
                this.setState({totalData: res.Data});
            } else {
                message.error(res.Msg)
            }
        })
    };


    //获取机构内容排行---10条数据排行
    GetContentTops = (flag) => {
        const sort = this.state.sort;
        Api.chart.GetContentTops({
            body: { SortFields: sort}
        }).then(res => {
            if (res.Ret === 0) {
//              console.log(res.Data);
                !res.Data ? "" : res.Data.map(item => {
                    if(item.ContentName.length >= 15){
                        item.ContentName = item.ContentName.substr(0,15) + "......";
                    }
                });
                if(flag===1){
                	this.setState({
	                    rankListRight: res.Data.slice(5,10),
	                    rankListLeft: res.Data.slice(0,5),
	                    rankListRight2:[],
	                    rankListLeft2:[],
	                });
                }else{
                	this.setState({
                		rankListRight:[],
                		rankListLeft:[],
	                    rankListRight2: res.Data.slice(5,10),
	                    rankListLeft2: res.Data.slice(0,5),
	                });
                }
                
            } else {
                message.error(res.Msg)
            }
        })
    };
    //按不同字段获取机构内容排行---10条数据排行
    handSort = (e) => {
        if(!e) e = this.deal(e);
        switch(e.key)
        {
            case '1':
                this.setState({
                    sort: [{Field: 'ReadCount', sortType: "-1",}]
                }, () => {
                    this.GetContentTops(1);
                });
                break;
            case '2':
                this.setState({
                    sort: [{Field: 'ShareCount', sortType: "-1",}]
                }, () => {
                    this.GetContentTops(1);
                });
                break;
            case '3':
                this.setState({
                    sort: [{Field: 'CommentCount', sortType: "-1",}]
                }, () => {
                    this.GetContentTops(1);
                });
                break;
            case '4':
                this.setState({
                    sort: [{Field: 'FavoriteCount', sortType: "-1",}]
                }, () => {
                    this.GetContentTops(1);
                });
                break;
            case '5':
                this.setState({
                    sort: [{Field: 'OrderCount', sortType: "-1",}]
                }, () => {
                    this.GetContentTops(2);
                });
                break;
            case '6':
                this.setState({
                    sort: [{Field: 'OrderAmount', sortType: "-1",}]
                }, () => {
                    this.GetContentTops(2);
                });
                break;
            default:
                this.setState({
                    sort: [{Field: 'ReadCount', sortType: "-1",}]
                }, () => {
                    this.GetContentTops(1);
                });
        }
    };


    //按日期获取机构活跃度统计清单--第二个折线图
    GetBehaviorCountList = (e) =>{
        const {commentData, readData, shareData, favoriteData, timeData,isTime2, s2, e2} = this.state;
        let beginDate = isTime2 ? this.getTime(this.state.countDay).t2 : s2;
        let endDate = isTime2 ? this.getTime().t1 : e2;
        let getDataConfig = {
            beginDate : beginDate,
            endDate : endDate,
        };
        Api.chart.GetBehaviorCountList(getDataConfig).then(res => {
            if(res.Ret === 0) {
                this.dealData(res.Data);
                this.setState({
                    order_option:{

                        legend:{
                            top:'0',
                            left:'center',
                            data:["阅读","分享","评论","收藏"],
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : timeData,
                                axisLabel:{
                                    rotate:-45,
                                }
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                            }
                        ],
                        series : [
                            {
                                name:'阅读',
                                type:'line',
                                data:readData,
                            },
                            {
                                name:'分享',
                                type:'line',
                                data:shareData,
                            },
                            {
                                name:'评论',
                                type:'line',
                                data:commentData,
                            },
                            {
                                name:'收藏',
                                type:'line',
                                data:favoriteData,
                            },
                        ]
                    },

                    show_line: 'number'
                })
            }else {
                message.error(res.Msg);
            }
        })
    };
    //第二个折线图选择tab日期天数
    historyDate = (e) => {
        // console.log(e);
        this.setState({
            countDay : e,
            s2:this.getTime(e).t2,
            e2:this.getTime(e).t1,
            isTime : true,
        },() => {
            this.GetBehaviorCountList(e);
            this.GetHistorySum(e);
            this.GetBehaviorSum(e);
        })
    };
    //第二个折线图选择自定义时间范围
    historyChange = (date, dateString) =>{
        this.setState({
            s2 : dateString[0],
            e2 : dateString[1],
            scoreStartTime2 : dateString[0],
            scoreEndTime2 : dateString[1],
            isTime2 : false,
        })
    };
    //第二个折线图确定查询自定义时间范围
    historyScoreTime = () => {
        this.setState({
            s2 : this.state.scoreStartTime2,
            e2 : this.state.scoreEndTime2,
            isTime : false,
        },()=>{
            this.GetBehaviorCountList();
            this.GetBehaviorSum();
            this.GetHistorySum();
        });
    };
    //按日期范围获取机构活跃度统计汇总
    GetBehaviorSum = () => {
        const {isTime2, s2, e2} = this.state;
        let beginDate = isTime2 ? this.getTime(this.state.countDay).t2 : s2;
        let endDate = isTime2 ? this.getTime().t1 : e2;
        let getDataConfig = {
            beginDate : beginDate,
            endDate : endDate,
        };
        Api.chart.GetBehaviorSum(getDataConfig).then(res => {
            if (res.Ret === 0) {
                this.setState({
                    behaviorSum:res.Data,
                });
            } else {
                message.error(res.Msg);
            }
        })
    };
    //按日期范围获取机构收费统计汇总--折线图右边数据--总收入+总人数
    GetHistorySum = () => {
        const {isTime2, s2, e2} = this.state;
        let beginDate = isTime2 ? this.getTime(this.state.countDay).t2 : s2;
        let endDate = isTime2 ? this.getTime().t1 : e2;
        let getDataConfig = {
            beginDate : beginDate,
            endDate : endDate,
        };
        Api.chart.GetOrderSum(getDataConfig).then(res => {
            if (res.Ret === 0) {
                this.setState({
                    historyAmount: res.Data.OrderAmount,
                    historyCount: res.Data.OrderCount,
                });
            } else {
                message.error(res.Msg)
            }
        })
    };
	onChartLegendselectchanged= () =>{
		var line_option=this.state.line_option;
		var flag=this.state.flag;
		line_option.legend.selected.付费人数=!line_option.legend.selected.付费人数;
		line_option.legend.selected.付费金额=!line_option.legend.selected.付费金额;
		if(line_option.legend.selected.付费人数){
			line_option.yAxis[0].name="人数(个)";
		}else{
			line_option.yAxis[0].name="金额(元)";
		}
		this.setState({line_option:line_option})
	}
    render(){
    	let onEvents = {
		  'legendselectchanged': this.onChartLegendselectchanged
		}
        const operations = <div>
          <span style={{marginRight:20}}>查看时间段：</span>
          <RangePicker onChange={this.onChange} />
          <Button style={{marginLeft:20}} onClick={this.scoreTime}>确定</Button>
        </div>;
        const historyOption = <div>
            <span style={{marginRight:20}}>查看时间段：</span>
            <RangePicker onChange={this.historyChange} />
            <Button style={{marginLeft:20}} onClick={this.historyScoreTime}>确定</Button>
        </div>;
        const {totalData , chartData,rankListRight,rankListLeft,rankListRight2,rankListLeft2,line_option,activeUser,OrderCount,OrderAmount,s1,s2,e1,e2,order_option,behaviorSum,historyAmount,historyCount} = this.state;
//      console.log(behaviorSum)
        return(
            <div>
              {/*收费情况*/}
              <div className="payments">
                <div className="payments-title">
                  <div className="title-line"></div>
                  <h2>付费情况</h2>
                </div>
                <div className="payments-item">
                  <div className="one-payments">
                    <span className="payments-number order-number">{!chartData ? null : chartData.YesterydayOrderCount}</span>
                    <span>昨日付费人数</span>
                  </div>
                  <div className="one-payments">
                    <span className="payments-number order-number">{!chartData ? null : chartData.TodayOrderCount}</span>
                    <span>今日付费人数</span>
                  </div>
                  <div className="one-payments">
                    <span className="payments-number order-number">{!chartData ? null : chartData.YesterydayOrderAmount}</span>
                    <span>昨日收入</span>
                  </div>
                  <div className="one-payments">
                    <span className="payments-number order-number">{!chartData ? null : chartData.TodayOrderAmount}</span>
                    <span>今日收入</span>
                  </div>
                  <div className="one-payments">
                    <span className="payments-number order-number">{!chartData ? null : chartData.SumOrderCount}</span>
                    <span>付费人数</span>
                  </div>
                  <div className="one-payments no-line">
                    <span className="payments-number order-number">{!chartData ? null : chartData.SumOrderAmount}</span>
                    <span>总收入</span>
                  </div>
                </div>

                <div className="chart-choose">
                  <Tabs defaultActiveKey="7"  tabBarExtraContent={operations} onTabClick={this.chooseDate}>
                    <TabPane tab="今天" key="0" className="tabOne">
                      <div className="chart-left">
                          {
                              !line_option ? null :
                                  <ReactEcharts
                                      option={line_option}
                                      style={{height: '100%', width: '100%'}}
                                      onEvents={onEvents}
                                  />
                          }
                      </div>
                      <div className="chart-right">
                          <div className="total-one time-scope">
                              <span className="aaa">{s1}~{e1}</span>
                          </div>
                        <div className="total-one">
                            <span className="total-number">{OrderAmount}</span>
                          <span className="total-text">总收入</span>
                        </div>
                        <div className="total-one">
                            <span className="total-number">{OrderCount}</span>
                          <span className="total-text">付费总人数</span>
                        </div>
                        <div className="total-one">
                            <span className="total-number">{activeUser}</span>
                          <span className="total-text">活跃用户数</span>
                        </div>
                      </div>
                    </TabPane>
                    <TabPane tab="7天" key="7" className="tabOne">
                      <div className="chart-left" ref>
                          {
                              !line_option ? null :
                                  <ReactEcharts
                                  		onEvents={onEvents}
                                      option={line_option}
                                      notMerge={true}
                                      lazyUpdate={true}
                                      theme={"theme_name"}
                                      style={{height: '100%', width: '100%'}}
                                  />
                          }
                      </div>
                        <div className="chart-right">
                            <div className="total-one time-scope">
                                <span>{s1}~{e1}</span>
                            </div>
                            <div className="total-one">
                                <span className="total-number">{OrderAmount}</span>
                                <span className="total-text">总收入</span>
                            </div>
                            <div className="total-one">
                                <span className="total-number">{OrderCount}</span>
                                <span className="total-text">付费总人数</span>
                            </div>
                            <div className="total-one">
                                <span className="total-number">{activeUser}</span>
                                <span className="total-text">活跃用户数</span>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="30天" key="30" className="tabOne">
                      <div className="chart-left">
                          {
                              !line_option ? null :
                                  <ReactEcharts
                                  onEvents={onEvents}
                                      option={line_option}
                                      notMerge={true}
                                      lazyUpdate={true}
                                      theme={"theme_name"}
                                      style={{height: '100%', width: '100%'}}
                                  />
                          }
                      </div>
                      <div className="chart-right">
                          <div className="total-one time-scope">
                              <span>{s1}~{e1}</span>
                          </div>
                        <div className="total-one">
                          <span className="total-text">总收入</span>
                          <span className="total-number">{OrderAmount}</span>
                        </div>
                        <div className="total-one">
                          <span className="total-text">付费总人数</span>
                          <span className="total-number">{OrderCount}</span>
                        </div>
                        <div className="total-one">
                          <span className="total-text">活跃用户数</span>
                          <span className="total-number">{activeUser}</span>
                        </div>
                      </div>
                    </TabPane>
                    <TabPane tab="90天" key="90" className="tabOne">
                      <div className="chart-left">
                          {
                              !line_option ? null :
                                  <ReactEcharts
                                  onEvents={onEvents}
                                      option={line_option}
                                      notMerge={true}
                                      lazyUpdate={true}
                                      theme={"theme_name"}
                                      style={{height: '100%', width: '100%'}}
                                  />
                          }
                      </div>
                      <div className="chart-right">
                          <div className="total-one time-scope">
                              <span>{s1}~{e1}</span>
                          </div>
                        <div className="total-one">
                          <span className="total-text">总收入</span>
                          <span className="total-number">{OrderAmount}</span>
                        </div>
                        <div className="total-one">
                          <span className="total-text">付费总人数</span>
                          <span className="total-number">{OrderCount}</span>
                        </div>
                        <div className="total-one">
                          <span className="total-text">活跃用户数</span>
                          <span className="total-number">{activeUser}</span>
                        </div>
                      </div>
                    </TabPane>
                  </Tabs>
                </div>

              </div>
              {/*活跃度*/}
              <div className="payments center">
                <div className="payments-title">
                  <div className="title-line"></div>
                  <h2>活跃度</h2>
                </div>
                <div className="payments-item">
                    <div className=" live-number live-number3" style={{backgroundColor:'#99de37'}}>
                        <span className="payments-number">{!totalData ? null : totalData.FavoriteCount}</span>
                        <span>总阅读</span>
                    </div>
                  <div className=" live-number live-number2" style={{backgroundColor:'#feb44b'}}>
                    <span className="payments-number">{!totalData ? null : totalData.ShareCount}</span>
                    <span>总分享</span>
                  </div>
                    <div className=" live-number live-number1" style={{backgroundColor:'#fd7b4d'}}>
                        <span className="payments-number">{!totalData ? null : totalData.CommentCount}</span>
                        <span>总评论</span>
                    </div>

                  <div className=" live-number live-number4" style={{backgroundColor:'#4bb0fe'}}>
                    <span className="payments-number">{!totalData ? null : totalData.FollowCount}</span>
                    <span>总关注</span>
                  </div>
                  <div className=" live-number live-number5" style={{backgroundColor:'#bd50e1'}}>
                    <span className="payments-number">{!totalData ? null : totalData.FavoriteCount}</span>
                    <span>总收藏数</span>
                  </div>
                </div>

              </div>
              {/*排行榜*/}
              <div className="payments rank">
                <div className="payments-title">
                  <div className="title-left">
                    <div className="title-line"></div>
                    <h2>排行榜</h2>
                  </div>
                  <div className="choose-menu">
                    <Menu
                        onClick={this.handSort}
                        defaultSelectedKeys={['1']}
                        mode="horizontal"
                    >
                    <Menu.Item key="1" >
                        阅读
                    </Menu.Item>
                    <Menu.Item key="2" >
                        分享
                    </Menu.Item>
                      <Menu.Item key="3" >
                        评论
                      </Menu.Item>
                      <Menu.Item key="4" >
                        收藏
                      </Menu.Item>
                      <Menu.Item key="5" >
                        付费人数
                      </Menu.Item>
                      <Menu.Item key="6" >
                        付费金额
                      </Menu.Item>
                    </Menu>
                  </div>
                </div>

                <div className="payments-content">
                  <div className="content-left">
                      {
                          rankListLeft.length!==0 ?   rankListLeft.map((item,index) => {
                              return <div className="payments-item" key={index}>
                                <div className="one-item">
                                    {
                                        index === 0 ? <img src={require('../../assets/images/jiangpai.png')} style={{width: 36}} alt=""/>
                                            : index === 1 ? <img src={require('../../assets/images/jiangpai_2.png')} style={{width: 36}} alt=""/>
                                            : index === 2 ? <img src={require('../../assets/images/jiangpai_3.png')} style={{width: 36}} alt=""/>
                                                :  <div className="border-number">
                                                    {index + 1}
                                                </div>
                                    }
                                </div>

                                <div className="item-left-icon">
                                  <h2 className="one-item-title">
                                    <span>[{item.ContentTypeName}]</span>
                                      {item.ContentName}
                                  </h2>
                                  <div className="icon-ary">
                                    <div className="one-item-icon">
                                      <img src={require('../../assets/images/see.png')} style={{width: 16}} alt=""/>
                                      <span>{item.ReadCount}</span>
                                    </div>
                                    <div className="one-item-icon">
                                      <img src={require('../../assets/images/zhuan.png')} style={{width: 16}} alt=""/>
                                      <span>{item.ShareCount}</span>
                                    </div>
                                    <div className="one-item-icon">
                                      <img src={require('../../assets/images/comment.png')} style={{width: 16}} alt=""/>
                                      <span>{item.CommentCount}</span>
                                    </div>
                                    <div className="one-item-icon">
                                      <img src={require('../../assets/images/favorite.png')} style={{width: 16}} alt=""/>
                                      <span>{item.FavoriteCount}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          }):
                          rankListLeft2.map((item,index) => {
                              return <div className="payments-item" key={index}>
                                <div className="one-item">
                                    {
                                        index === 0 ? <img src={require('../../assets/images/jiangpai.png')} style={{width: 36}} alt=""/>
                                            : index === 1 ? <img src={require('../../assets/images/jiangpai_2.png')} style={{width: 36}} alt=""/>
                                            : index === 2 ? <img src={require('../../assets/images/jiangpai_3.png')} style={{width: 36}} alt=""/>
                                                :  <div className="border-number">
                                                    {index + 1}
                                                </div>
                                    }
                                </div>
                                <div className="item-left-icon">
                                  <h2 className="one-item-title">
                                    <span>[{item.ContentTypeName}]</span>
                                      {item.ContentName}
                                  </h2>
                                  <div className="icon-ary">
                                    <div className="one-item-icon">
                                      <span style={{margin:"0"}}>付费金额:</span>
                                      <span>{item.OrderAmount}</span>
                                    </div>
                                    <div className="one-item-icon">
                                      <span style={{margin:"0"}}>付费人数:</span>
                                      <span>{item.OrderCount}</span>
                                    </div>
                                    
                                  </div>
                                </div>
                              </div>
                          })
                      }
                  </div>
                  <div className="content-right">
                      {
                          rankListRight.length!==0 ?  rankListRight.map((item,index) => {
                              return <div className="payments-item" key={index}>
                                <div className="one-item">
                                    <div className="border-number">
                                        {index + 6}
                                    </div>
                                </div>

                                <div className="item-left-icon">
                                  <h2 className="one-item-title">
                                    <span>[{item.ContentTypeName}]</span>
                                      {item.ContentName}
                                  </h2>
                                  <div className="icon-ary">
                                    <div className="one-item-icon">
                                      <img src={require('../../assets/images/see.png')} style={{width: 16}} alt=""/>
                                      <span>{item.ReadCount}</span>
                                    </div>
                                    <div className="one-item-icon">
                                      <img src={require('../../assets/images/zhuan.png')} style={{width: 16}} alt=""/>
                                      <span>{item.ShareCount}</span>
                                    </div>
                                    <div className="one-item-icon">
                                      <img src={require('../../assets/images/comment.png')} style={{width: 16}} alt=""/>
                                      <span>{item.CommentCount}</span>
                                    </div>
                                    <div className="one-item-icon">
                                      <img src={require('../../assets/images/favorite.png')} style={{width: 16}} alt=""/>
                                      <span>{item.FavoriteCount}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          }):
                          rankListRight2.map((item,index) => {
                              return <div className="payments-item" key={index}>
                                <div className="one-item">
                                    <div className="border-number">
                                        {index + 6}
                                    </div>
                                </div>

                                <div className="item-left-icon">
                                  <h2 className="one-item-title">
                                    <span>[{item.ContentTypeName}]</span>
                                      {item.ContentName}
                                  </h2>
                                  <div className="icon-ary">
                                    <div className="one-item-icon">
                                      <span style={{margin:"0"}}>付费金额:</span>
                                      <span>{item.OrderAmount}</span>
                                    </div>
                                    <div className="one-item-icon">
                                      <span style={{margin:"0"}}>付费人数:</span>
                                      <span>{item.OrderCount}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          })
                          
                      }
                  </div>
                </div>

              </div>
              {/*历史走势*/}
              <div className="payments-history">
                <div className="payments-title">
                  <div className="title-line"></div>
                  <h2>历史走势</h2>
                </div>

                <div className="chart-choose">
                  <Tabs defaultActiveKey="7"  tabBarExtraContent={historyOption} onTabClick={this.historyDate}>
                    <TabPane tab="今天" key="0" className="tabOne">
                      <div className="chart-left">
                          {
                              !order_option ? null :
                                  <ReactEcharts
                                      option={order_option}
                                      notMerge={true}
                                      lazyUpdate={true}
                                      theme={"theme_name"}
                                      style={{height: '100%', width: '100%'}}
                                  />
                          }
                      </div>
                        <div className="chart-right">
                            <div className="total-one time-scope">
                                <span>{s2}~{e2}</span>
                            </div>
                            <div className="history-number">
                            	<div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.ReadCount}</span>
                                    <span className="total-text">总阅读</span>
                                </div>
                                
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.ShareCount}</span>
                                    <span className="total-text">总分享</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.CommentCount}</span>
                                    <span className="total-text">总评论</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.FavoriteCount}</span>
                                    <span className="total-text">总收藏</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!historyAmount ? 0 : historyAmount}</span>
                                    <span className="total-text">总收入</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!historyCount ? 0 : historyCount}</span>
                                    <span className="total-text">付费总人数</span>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="7天" key="7" className="tabOne">
                      <div className="chart-left">
                          {
                              !order_option ? null :
                                  <ReactEcharts
                                      option={order_option}
                                      notMerge={true}
                                      lazyUpdate={true}
                                      theme={"theme_name"}
                                      style={{height: '100%', width: '100%'}}
                                  />
                          }
                      </div>
                        <div className="chart-right">
                            <div className="total-one time-scope">
                                <span>{s2}~{e2}</span>
                            </div>
                            <div className="history-number">
                            	<div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.ReadCount}</span>
                                    <span className="total-text">总阅读</span>
                                </div>
                                
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.ShareCount}</span>
                                    <span className="total-text">总分享</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.CommentCount}</span>
                                    <span className="total-text">总评论</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.FavoriteCount}</span>
                                    <span className="total-text">总收藏</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!historyAmount ? 0 : historyAmount}</span>
                                    <span className="total-text">总收入</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!historyCount ? 0 : historyCount}</span>
                                    <span className="total-text">付费总人数</span>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="30天" key="30" className="tabOne">
                      <div className="chart-left">
                          {
                              !order_option ? null :
                                  <ReactEcharts
                                      option={order_option}
                                      notMerge={true}
                                      lazyUpdate={true}
                                      theme={"theme_name"}
                                      style={{height: '100%', width: '100%'}}
                                  />
                          }
                      </div>
                        <div className="chart-right">
                            <div className="total-one time-scope">
                                <span>{s2}~{e2}</span>
                            </div>
                            <div className="history-number">
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.CommentCount}</span>
                                    <span className="total-text">总评论</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.ShareCount}</span>
                                    <span className="total-text">总分享</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.ReadCount}</span>
                                    <span className="total-text">总阅读</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.FavoriteCount}</span>
                                    <span className="total-text">总收藏</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!historyAmount ? 0 : historyAmount}</span>
                                    <span className="total-text">总收入</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!historyCount ? 0 : historyCount}</span>
                                    <span className="total-text">付费总人数</span>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="90天" key="90" className="tabOne">
                      <div className="chart-left">
                          {
                              !order_option ? null :
                                  <ReactEcharts
                                      option={order_option}
                                      notMerge={true}
                                      lazyUpdate={true}
                                      theme={"theme_name"}
                                      style={{height: '100%', width: '100%'}}
                                  />
                          }
                      </div>
                        <div className="chart-right">
                            <div className="total-one time-scope">
                                <span>{s2}~{e2}</span>
                            </div>
                            <div className="history-number">
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.CommentCount}</span>
                                    <span className="total-text">总评论</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.ShareCount}</span>
                                    <span className="total-text">总分享</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.ReadCount}</span>
                                    <span className="total-text">总阅读</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!behaviorSum ? 0 : behaviorSum.FavoriteCount}</span>
                                    <span className="total-text">总收藏</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!historyAmount ? 0 : historyAmount}</span>
                                    <span className="total-text">总收入</span>
                                </div>
                                <div className="total-one">
                                    <span className="total-number">{!historyCount ? 0 : historyCount}</span>
                                    <span className="total-text">付费总人数</span>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                  </Tabs>
                </div>

              </div>
            </div>
        )
    }
}
export default Instrument;
