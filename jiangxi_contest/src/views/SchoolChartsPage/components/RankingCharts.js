import React from 'react'
// 引入 ECharts 主模块
import echarts from 'echarts' //必须
// 引入柱状图
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

class RankingCharts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(this.refs.main);
        // 绘制图表
        const xAxisData = () => {
            const array = []
            for (let i = 1; i < 11; i++) {
                array.push('第' + i)
            }
            return array
        }
        const getChartData = () => {
            const data = []
            const {Top10Schools} = this.props
            if (Top10Schools && Top10Schools.length) {
                Top10Schools.forEach(({Rank, GName, AVGScore, JoinCount}) => {
                    data.push({Rank, GName, value: AVGScore, JoinCount})
                })
            }
            return data
        }
        // this.props.Top10Schools
        myChart.setOption({
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    const {GName, value, JoinCount} = params[0].data
                    console.log(GName, value, JoinCount)
                    return `${GName}<br/>参与人数：${JoinCount}<br/>平均分：${value}`
                },
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '0.5%',
                right: '0.5%',
                bottom: '3%',
                top: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxisData(),
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '60%',
                    data: getChartData()
                },
            ]
        });

    }

    render() {
        return (
            <div ref="main" className="RankingCharts"></div>
        );
    }
}

export default RankingCharts