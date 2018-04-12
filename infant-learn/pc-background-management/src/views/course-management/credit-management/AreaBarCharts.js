/**
 *  Create by xj on 2017/11/15.
 *  fileName: BarCharts
 */
import React, {Component} from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入环形图(饼图)
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
// //引入区域缩放的组件
 import 'echarts/lib/component/dataZoom';
class AreaBarCharts extends Component{
  constructor(props){
    super(props);
    this.state={
      barData: this.props.barData
    }
  }
componentWillReceiveProps(nextProps){
    if(nextProps.barData!==this.props.barData){
      this.setState({
        barData:nextProps.barData
      },()=>this.getEchartData())
    }
}
  componentDidMount(){
   this.getEchartData()
  }
  getEchartData(){
    //QtyTrained 参培人数
    //QtyQualified 合格人数
    let xData = [],QtyTrained=[],QtyQualified=[];
    let myChart = echarts.init(document.getElementById(this.props.type));
    this.state.barData.forEach(item=>{
      xData.push(item.Name)
      QtyTrained.push(item.QtyTrained)
      QtyQualified.push(item.QtyQualified)
    });
    // 绘制图表
    myChart.setOption({
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            show: true
          }
        }
      },
      legend: {
        show: true,
        data:['参培总人数','合格总人数']
      },
      xAxis : [
        {
          type : 'category',
          data : xData
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : [
        {
          name:'参培总人数',
          barWidth:30,
          type:'bar',
          data:QtyTrained,
        },
        {
          name:'合格总人数',
          barWidth:30,
          barGap:"10%",
          type:'bar',
          data:QtyQualified,
        }
      ],
      dataZoom: [
        {
          type: 'slider',//x轴滚动条的样式
          show: true,//是否显示x轴滚动条
          start: 0,
          end: 80,
          handleSize: 12
        },
        {
          type: 'inside',
        },
        // {
        //   type: 'slider',//y轴滚动条的样式
        //   show: false,//是否显示y轴滚动条
        //   yAxisIndex: 0,
        //   filterMode: 'empty',
        //   width: 12,
        //   height: '70%',
        //   handleSize: 8,
        //   showDataShadow: true,
        //   left: '93%'
        // }
      ],
    });
  }
  render() {

    return (
      <div id={this.props.type} className="class-echart" style={{width: "100%", height: "30rem",background:"#fff",marginTop:"2rem"}}/>
    )
  }
}
export default AreaBarCharts;
