/**
 *  Create by xj on 2017/11/27.
 *  fileName: PieCharts
 */
import React, {Component} from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入环形图(饼图)
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class PieCharts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      siglePieData: this.props.siglePieData
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.siglePieData !== this.props.siglePieData) {
      this.setState({
        siglePieData: nextProps.siglePieData
      },()=>this.getPieData())
    }
  }

  componentDidMount() {
    console.log(this.state.siglePieData)
    this.getPieData()
  }

  getPieData() {
    let myChart = echarts.init(document.getElementById(this.props.id));
    const {CourseTypeName, AreaTeachWayList} = this.state.siglePieData;
    //处理饼状图数据
    let fanData = [], fanDataName = [];
    AreaTeachWayList.map(item => {
      item.name = item.TeachWayName;
      item.value = item.QtyCount;
      fanData.push(item);
      fanDataName.push(item.TeachWayName)
    })

    // 绘制图表
    myChart.setOption({
      title: {
        text: CourseTypeName,
        x: 'left'
      },
      tooltip: {
        trigger: 'item',
        formatter: " 类型: {b}<br/>课程数量: {c}<br/>百分比: {d}%"
      },
      color:["rgb(104,201 ,76)", 'rgb(253,99 ,15)','rgb(44,167 ,253)','rgb(255,165 ,2)','rgb(162,41 ,207)'],

      legend: {
        orient: 'vertical',
        left: 'left',
        data: fanDataName
      },
      series: [
        {
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: fanData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    });

  }

  render() {
    const{AreaTeachWayList,QtyCount,CourseTypeName}=this.state.siglePieData
    return (
      <div className='pie-charts'>
        <div id={this.props.id} style={{width: "30%", height: "30rem", marginTop: "2rem"}}/>
        <div className='right-info'>
          <div>{CourseTypeName}总计{QtyCount}份</div>
          {
            AreaTeachWayList.map((item,key)=>{
              return(
                <p key={key}>
                  <span><i/>{item.TeachWayName}</span>
                  <span>{item.QtyCount}份</span>
                  <span>占{item.Rate}</span>
                </p>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default PieCharts;
