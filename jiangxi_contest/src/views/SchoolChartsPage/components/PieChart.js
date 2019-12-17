import React from 'react'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入柱状图
import 'echarts/lib/chart/pie'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title';

const colorType = {
    '100分': '#FFA502',
    "90～99分": '#F0EA4F',
    '80～89分': '#C4DF3E',
    '70～79分': '#80DC35',
    '60～69分': '#35DBCD',
    "60分以下": '#4FAEF0'
}

class PieChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('min'));
        // 绘制图表
        const getChartData = () => {
            const data = []
            const {CakeScores} = this.props
            if (CakeScores && CakeScores.length) {
                CakeScores.forEach(({Key, Count}) => {
                    if (Count) data.push({name: Key, value: Count})
                })
            }
            return data
        }
        const data = getChartData()
        const color = () => {
            const newData = []
            if (data && data.length) {
                data.forEach(({name, value}) => {
                    newData.push(colorType[name])
                })
            }
            console.log(newData)
            return newData
        }
        const colorData = () => {
            const newData = []
            if (data && data.length) {
                data.forEach(({name, value}) => {
                    newData.push(name)
                })
            }
            console.log(newData)
            return newData
        }
        myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "<span>{b} : {c}人 ({d}%)</span>"
            },
            color: color(),
            legend: {
                orient: 'vertical',
                left: 'left',
                data: colorData()
            },
            grid: {
                // left: '20%',
                right: '3%',
                // top: '3%',
                // bottom:'3%',
                containLabel: false
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '80%',
                    center: ['65%', '50%'],
                    selectedMode: 'single',
                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data,
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
        return (
            <div ref="main" className="PieChart" id="min"></div>
        );
    }
}

export default PieChart