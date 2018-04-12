/**
 * Created by xj on 2017/9/15.
 */
import React, {Component} from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入环形图(饼图)
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
class PieEcharts extends Component {
  componentDidUpdate(){
   //处理oppo手机显示
    let textSize=0;
    let subTextSize=0;
    if(navigator.userAgent.match(/OPPO/i)=="OPPO"||navigator.userAgent.match(/m3 note/i)=="m3 note"){
      textSize=15;subTextSize=10
    }else if(navigator.userAgent.match(/iPhone/i)=="iPhone"){
      textSize=20;subTextSize=15
    }else{
      textSize=35;subTextSize=30
    }

    const {UserYearCreditH5ModelList} = this.props.ScoreUpperData;
    //取出名字和值渲染进图表
    let EchartsData = [];
    let totalScore = 0;
    UserYearCreditH5ModelList&&UserYearCreditH5ModelList.length!==0&&UserYearCreditH5ModelList.map(item=>{

      EchartsData.push({value:item.Credit,name:item.Year+"年"})
      totalScore+=item.Credit
    });
    let myChart = echarts.init(document.getElementById('score-echart'));
    myChart.setOption( {
      title: {
        subtext: '累积学分',
        text: totalScore,
        x: 'center',
        y: 'center',
        textStyle:{
          color:'#333',
          fontSize:textSize,
        },
        subtextStyle:{
          fontSize:subTextSize,
        },
        //bottom:110
      },
      tooltip: {
        trigger: 'item',
      },
      color:["rgb(104,201 ,76)", 'rgb(253,99 ,15)','rgb(44,167 ,253)','rgb(255,165 ,2)','rgb(162,41 ,207)'],
      legend: {
        orient: 'vertical',
        x: 'left',
        //data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
      },
      series: [
        {
          name:this.props.tipName,
          type:'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'

            },
            emphasis: {
              show: false,//是否显示点击部分，中间圆圈显示值
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
          data:EchartsData
        }
      ]
    });
    //window.onresize = myChart.resize;
  }
  render() {

    return (
      <div id="score-echart" className="class-echart" style={{width: "100%", height: "3rem",background:"#fff"}}/>
    )
  }
}
export default PieEcharts
