/**
 * Created by Administrator on 2017/11/22.
 */

app.controller('traffic', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {


    var traffic = {

        //变量
        variable : function (){

            //全局变量
            $scope.model = {
                itemList:[],
                Year:new Date().getFullYear(),
                Month:new Date().getMonth() + 1,
                yearLists:[
                    {id:1,year:new Date().getFullYear()},
                    {id:2,year:new Date().getFullYear()-1},
                    {id:3,year:new Date().getFullYear()-2},
                    {id:4,year:new Date().getFullYear()-3},
                    {id:5,year:new Date().getFullYear()-4},
                ],//基于年份选择时
                monthList:[
                    {id:1,month:1},
                    {id:2,month:2},
                    {id:3,month:3},
                    {id:4,month:4},
                    {id:5,month:5},
                    {id:6,month:6},
                    {id:7,month:7},
                    {id:8,month:8},
                    {id:9,month:9},
                    {id:10,month:10},
                    {id:11,month:11},
                    {id:12,month:12},
                ],
                IsMoke:true,
            }
            //获取总流量数【页面80】
            $scope.GetFlowCount = {
                LiveChannel:1,//1:校园直播，2学科课程，3心理课程，4.营养课程
                Year:2017,
                Month:1,
                sumTraffic:1,
            }
            //获取流量消耗月份趋势图数据【页面80】柱状图
            $scope.GetFlowBarChart = {
                LiveChannel:1,//1:校园直播，2学科课程，3心理课程，4.营养课程
                Year:2017,
                Month:1,
                itemList:[],
                barOldCnts:[],//原有数量
                barNewAddCnts:[],//新增数量
                barNegAddCnts:[],//负增长数量
                barCnts:[],//现有数量
            }
            //获取流量消耗分布图数据【页面80】饼图
            $scope.GetFlowPieChart = {
                LiveChannel:1,//1:校园直播，2学科课程，3心理课程，4.营养课程
                Year:2017,
                Month:1,
                itemList:[],
                newItemList:[],
                provinceName:[],
            }
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;
        },
        //初始化
        init: function () {
            this.variable();
            this.setting.eCharts();
            this.serviceAPI.GetFlowCount()
            this.serviceAPI.GetFlowPieChart()
            this.serviceAPI.GetFlowBarChart();
            setTimeout(function () {
                $(".dateTime").val($scope.model.Year +'年 - '+$scope.model.Month+'月');
            },200)

        },

        //API服务
        serviceAPI:(function () {
            return{
                //获取总流量数【页面80】
                GetFlowCount: function () {
                    applicationServiceSet.liveService.officialBackground.GetFlowCount.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.GetFlowCount.LiveChannel,
                        $scope.model.Year,
                        $scope.model.Month,
                        $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0){
                            $scope.GetFlowCount.sumTraffic = data.Data;
                        }
                    })
                },

                //获取流量消耗分布图数据【页面80】饼图
                GetFlowPieChart: function () {
                    applicationServiceSet.liveService.officialBackground.GetFlowPieChart.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.GetFlowPieChart.LiveChannel,
                        $scope.model.Year,
                        $scope.model.Month,
                        $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0){
                            data = data.Data;
                            $scope.GetFlowPieChart.itemList = data.FlowConsumePieChartList;
                            for(var i = 0;i< $scope.GetFlowPieChart.itemList.length;i++){
                                $scope.GetFlowPieChart.provinceName.push($scope.GetFlowPieChart.itemList[i].Name)
                            }
                            //数据转换为eCharts可用格式
                            $scope.GetFlowPieChart.newItemList = $scope.GetFlowPieChart.itemList
                            for(var j = 0;j < $scope.GetFlowPieChart.itemList.length;j++){
                                $scope.GetFlowPieChart.newItemList[j].value = $scope.GetFlowPieChart.newItemList[j].Count
                                $scope.GetFlowPieChart.newItemList[j].name = $scope.GetFlowPieChart.newItemList[j].Name
                                delete $scope.GetFlowPieChart.newItemList[j].Name;
                                delete $scope.GetFlowPieChart.newItemList[j].Count;
                            }
                        }
                    })
                },

                //获取流量消耗月份趋势图数据【页面80】柱状图
                GetFlowBarChart: function () {
                    applicationServiceSet.liveService.officialBackground.GetFlowBarChart.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.GetFlowBarChart.LiveChannel,
                        $scope.model.Year,
                        $scope.model.Month,
                        $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0){
                            data = data.Data;
                            //console.log(data)
                            $scope.GetFlowBarChart.barOldCnts = data.OldCnts
                            $scope.GetFlowBarChart.barNewAddCnts = data.NewAddCnts
                            $scope.GetFlowBarChart.barNegAddCnts = data.NegAddCnts
                            $scope.GetFlowBarChart.barCnts = data.Cnts

                        }
                    })
                }
            }
        })(),
        //设置，数据处理
        setting:(function () {
            return {
                //图表处理
                eCharts: function () {
                    //饼图
                    //setTimeout(function () {
                    //    var myPieChart = echarts.init(document.getElementById('pie'));
                    //    option = {
                    //        title : {
                    //            text:"流量消耗分布图",
                    //            x:'center',
                    //            y:'bottom',
                    //            textStyle: {
                    //                fontFamily: 'Arial, Verdana, sans...',
                    //                fontSize: 14,
                    //                fontStyle: 'normal',
                    //                fontWeight: 'normal',
                    //                color:'#f60',
                    //            },
                    //        },
                    //        tooltip : {
                    //            trigger: 'item',
                    //            formatter: "{a} <br/>{b} : {c} ({d}%)"
                    //        },
                    //        legend: {
                    //            orient: 'vertical',
                    //            left: 'right',
                    //            data: $scope.GetFlowPieChart.provinceName
                    //        },
                    //        series : [
                    //            {
                    //                name: '访问来源',
                    //                type: 'pie',
                    //                radius : '55%',
                    //                center: ['50%', '60%'],
                    //                data:$scope.GetFlowPieChart.newItemList,
                    //
                    //                itemStyle: {
                    //                    normal:{
                    //                        label:{
                    //                            position:'inner',
                    //                            show:true,
                    //                            formatter: '{d}%'
                    //                        }
                    //                    },
                    //                    emphasis: {
                    //                        shadowBlur:10,
                    //                        shadowOffsetX: 0,
                    //                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    //                    }
                    //                }
                    //            }
                    //        ]
                    //    };
                    //    myPieChart.setOption(option);
                    //},500);
                    //柱状图
                    setTimeout(function () {
                        var myBarChart = echarts.init(document.getElementById('bar'));
                        //指定图表的配置项和数据
                        var option = {
                            title:{
                                text:"流量消耗月份趋势图",
                                x:'center',
                                y:'bottom',
                                textStyle: {
                                    fontFamily: 'Arial, Verdana, sans...',
                                    fontSize: 14,
                                    fontStyle: 'normal',
                                    fontWeight: 'normal',
                                    color:'#f60',
                                },
                            },
                            tooltip : {
                                show:false,
                                trigger: 'axis',
                                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                    type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                                },
                            },

                            legend: {
                                data: ['负增长数量','新增数量','原有数量'],
                                x:"right",
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            yAxis: {
                                type: 'value'

                            },
                            xAxis:{
                                type:'category',
                                data: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
                            },
                            series: [
                                {
                                    name: '原有数量',
                                    type: 'bar',
                                    stack: '总量',
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'inside'
                                        }
                                    },
                                    itemStyle:{
                                        normal:{
                                            color:'#aaa',
                                            label : {
                                                show:true,
                                                position: 'top'
                                            }
                                        }
                                    },
                                    data: $scope.GetFlowBarChart.barOldCnts,
                                },
                                {
                                    name: '新增数量',
                                    type: 'bar',
                                    stack: '总量',
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'inside'
                                        }
                                    },
                                    itemStyle:{
                                        normal:{
                                            color:'#21ba45',
                                            label : {
                                                show:true,
                                                position: 'top',
                                            }
                                        }
                                    },
                                    data: $scope.GetFlowBarChart.barNewAddCnts,
                                },

                                {
                                    name: '负增长数量',
                                    type: 'bar',
                                    stack: '总量',
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'insideLeft',
                                            textStyle: {
                                                color: '#333'          // 值域文字颜色
                                            }
                                        }
                                    },
                                    itemStyle:{
                                        normal:{
                                            color:'red',
                                            label : {
                                                show:true,
                                                position: 'top',

                                            }
                                        }
                                    },

                                    data: $scope.GetFlowBarChart.barNegAddCnts
                                },
                                {
                                    name:"",
                                    type: 'bar',
                                    stack: '总量',
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'inside',
                                            textStyle: {
                                                color: 'black'
                                            }
                                        }
                                    },
                                    itemStyle:{
                                        normal:{
                                            color:'rgba(0,0,0,0)',
                                            label : {
                                                show:true,
                                                position: 'insideRight',
                                                formatter: function(params) {
                                                    return params.value + ($scope.GetFlowBarChart.barCnts[params.dataIndex] - $scope.GetFlowBarChart.barNegAddCnts[params.dataIndex]);
                                                }
                                            }
                                        }
                                    },
                                    data: $scope.GetFlowBarChart.barNegAddCnts
                                },
                            ]
                        };
                        myBarChart.setOption(option);
                    },500)
                },
                //数据处理
                dataChange: function (data) {

                }
            }
        })(),
        //事件
        events:(function () {
            //设置年月
            $scope.choiceTime = function () {

            },
            $scope.changeTime = function () {
                //初始化时间选择条件
                $scope.model.Year = undefined;
                $scope.model.Month = undefined;
                $scope.model.yearLists=[
                    {id:1,year:new Date().getFullYear()},
                    {id:2,year:new Date().getFullYear()-1},
                    {id:3,year:new Date().getFullYear()-2},
                    {id:4,year:new Date().getFullYear()-3},
                    {id:5,year:new Date().getFullYear()-4},
                ];
                $scope.model.monthList=[
                    {id:1,month:1},
                    {id:2,month:2},
                    {id:3,month:3},
                    {id:4,month:4},
                    {id:5,month:5},
                    {id:6,month:6},
                    {id:7,month:7},
                    {id:8,month:8},
                    {id:9,month:9},
                    {id:10,month:10},
                    {id:11,month:11},
                    {id:12,month:12},
                ];
                var isYes = $(".selectDate").hasClass("dateSelect");
                if(isYes){
                    $(".selectDate").removeClass("dateSelect");
                }else{
                    $(".selectDate").addClass("dateSelect");
                }
            },
            //  点击年月确定事件 
            $scope.dateSure = function () {
                if($scope.model.Year && $scope.model.Month){
                    $(".dateTime").val($scope.model.Year +'年 - '+$scope.model.Month+'月');
                    traffic.serviceAPI.GetFlowCount()
                    traffic.serviceAPI.GetFlowPieChart()
                    traffic.serviceAPI.GetFlowBarChart()
                }
                else {
                    toastr.error("请选择年月")
                    return false
                }
                var isYes = $(".selectDate").hasClass("dateSelect");
                if(isYes){
                    $(".selectDate").removeClass("dateSelect")
                };
                //获取年月

            },
            //选择年
            $scope.slcYear = function (year) {
                $scope.model.Year = year.year
            },
            //选择月
            $scope.slcMonth = function (month) {
                $scope.model.Month = month.month
            },
            //查看明细跳转事件
            $scope.toDetail = function () {
                $location.url('access/app/internal/afterManage/trafficSchool?year='+$scope.model.Year+'&month='+$scope.model.Month+'&school=');
            }
        })()

    }




    traffic.init();
}]);