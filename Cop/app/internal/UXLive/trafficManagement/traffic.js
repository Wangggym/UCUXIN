/**
 * Created by Administrator on 2017/11/22.
 */
/*
* 流量管理逻辑 ：

 1.由图表展示的 查看明细进入（1.如果是官方后台，→合作伙伴；2.如果不是官方后台，→机构（学校））

 2.合作伙伴页面的情况下，跳转到机构（学校），在机构（学校）页面要判断此机构是否为学校，如果是学校，下次跳转到班级，如果不是学校，直接跳转到用户

 3.在1条件下的第二种情况，由图表直接跳转到机构（学校），判断此机构是否为学校，是，跳转到班级。否，跳转到用户。
* */
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
                IsMoke:false,
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
                            traffic.setting.eCharts();
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

                    //柱状图
                    setTimeout(function () {
                        var barName = ['原有数量', '新增数量', '负增长数量'];
                        var names = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
                        var newAddCnts = $scope.GetFlowBarChart.barNewAddCnts;
                        var oldCnts = $scope.GetFlowBarChart.barOldCnts;
                        var negAddCnts = $scope.GetFlowBarChart.barNegAddCnts;
                        var cnts = $scope.GetFlowBarChart.barCnts;

                        var sums = [newAddCnts.length];
                        for (var i = 0; i < newAddCnts.length; i++) {
                            sums[i] = 0;
                        }
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
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                },
                                formatter: function (params) {
                                    var formart = "";
                                    if (params != null && params.length > 0) {
                                        formart = params[0].axisValue + "<br/>";
                                        for (var i = 0; i < params.length; i++) {
                                            var value = cnts[params[i].dataIndex];
                                            if (params[i].seriesName == "新增数量") {
                                                value = newAddCnts[params[i].dataIndex];
                                            } else if (params[i].seriesName == "原有数量") {
                                                value = oldCnts[params[i].dataIndex];
                                            } else if (params[i].seriesName == "负增长数量") {
                                                value = negAddCnts[params[i].dataIndex];
                                            }
                                            formart += params[i].marker + params[i].seriesName + ": " + value + "<br/>";
                                        }
                                    }
                                    return formart;
                                },
                            },

                            legend: {
                                data: barName,
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
                                data: names
                            },
                            series: [
                                {
                                    name: barName[0],
                                    type: 'bar',
                                    stack: '总量',
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'inside',
                                            formatter: function (params, option) {
                                                if (params.value == 0) {
                                                    return "";
                                                }
                                                return params.value;
                                            },
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
                                    data: oldCnts,
                                },
                                {
                                    name: barName[1],
                                    type: 'bar',
                                    stack: '总量',
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'inside',
                                            formatter: function (params, option) {
                                                if (params.value == 0) {
                                                    return "";
                                                }
                                                return params.value;
                                            },
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
                                    data:newAddCnts,
                                },

                                {
                                    name: barName[2],
                                    type: 'bar',
                                    stack: '总量',
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'insideLeft',
                                            formatter: function (params, option) {
                                                if (params.value == 0) {
                                                    return "";
                                                }
                                                return params.value;
                                            },
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

                                    data:negAddCnts,
                                },
                                {
                                    name:"现有量",
                                    type: 'bar',
                                    stack: '总量',
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'top',
                                            textStyle: {
                                                color: 'black'
                                            },
                                            formatter: function (params) {
                                                return cnts[params.dataIndex];
                                            }
                                        }
                                    },
                                    data: sums
                                },
                            ],
                            textStyle:{
                                color:'#000'
                            }
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
               // console.log($scope.model.OrgLevel)
                if($scope.model.OrgLevel == 1){
                    $location.url('access/app/internal/UXLive/trafficPartner?year='+$scope.model.Year+'&month='+$scope.model.Month+'&PtnID=');
                }else{
                    $location.url('access/app/internal/UXLive/trafficSchool?year='+$scope.model.Year+'&month='+$scope.model.Month+'&PtnID='+$scope.model.OrgID);
                }

            }
        })()

    }




    traffic.init();
}]);