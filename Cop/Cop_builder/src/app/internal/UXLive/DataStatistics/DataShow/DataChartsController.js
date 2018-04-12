/**
 * Created by Administrator on 2017/11/20.
 */

app.controller('DataChartsController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {

    //切换选项卡
    $scope.changeTab = function (i,model) {
        $scope.model.activeType = i;

        if(model.tabID == $scope.model.activeType){
            $scope.model.activeType = model.tabID;
        }else{
            $scope.model.activeType = i;
        }
        DataChartsController.events.loadTab(i);
    };
    //点击频道信息显示结果
    $scope.sortList = function (type) {
        $scope.model.LiveChannel = type;
        DataChartsController.setting.dataChange()
    };
    //年份选择筛选显示
    $scope.yearShow = function (year) {
        if(year){
            $scope.model.Year =year;
            DataChartsController.setting.dataChange();
        }
    };

    //返回上一级
    $scope.backHistory = function () {
        if($stateParams.LiveChannel){
            //如果从数据统计跳过来时
            $location.url('access/app/internal/UXLive/DataShow?tabID='+ $scope.model.activeType);
        }else if(!$stateParams.LiveChannel && $stateParams.tabID){
            //如果从数据明细跳过来时
                $location.url('access/app/internal/UXLive/DataDetail?tabID='+ $scope.model.activeType+'&PGType='+$stateParams.PGType);
        }else if(!$stateParams.LiveChannel && !$stateParams.tabID){
            //判断当没有参数的时候
            $(".backHistory").attr("href","javascript:history.back(-1);")
        }

    }
    var DataChartsController = {

        //变量
        variable : function (){
            //全局变量
            $scope.model = {
                itemList:[],
                IsMoke:false,
                pSize:10,
                pIndex:1,
                activeType:0,
                LiveChannel:1,
                yearShow:[
                    {id:1,year:new Date().getFullYear()},
                    {id:2,year:new Date().getFullYear()-1},
                    {id:3,year:new Date().getFullYear()-2},
                    {id:4,year:new Date().getFullYear()-3},
                    {id:5,year:new Date().getFullYear()-4},
                ],
                Year:2017,
                tabID:$stateParams.tabID,
                newChannel:false,
            }
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;

            //获取视频数量统计数据（某年）
            $scope.GetVideoStat = {
                Type:0,//统计类型-->0：发布数量 1：分享量 2：评论量 3：点赞量 4：收藏量
                LiveChannel:1,//1:校园直播，2学科课程，3心理课程，4.营养课程
                PtnID:$stateParams.PtnID,//合作伙伴ID
                GID:$stateParams.GID,//机构ID
                Year:2017,//年
                videoOldCs:[],//原有数量
                videoNewCs:[],//新增数量
                videoNegCs:[],//负增长量
                videoNowCs:[],//先有数量
            }
        },
        //初始化
        init: function () {
            this.variable();
            this.events.dataOrigin();
            this.setting.dataChange();
        },
        //API服务
        serviceAPI:(function () {
            return{
                //获取视频数量统计数据
                StatDataBarChart: function () {
                    applicationServiceSet.liveService.officialBackground.StatDataBarChart.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.model.activeType,
                        $scope.model.LiveChannel,
                        $scope.GetVideoStat.PtnID,
                        $scope.GetVideoStat.GID,
                        $scope.model.Year,
                        $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0 && data.Data){
                            data = data.Data;
                            $scope.GetVideoStat.videoOldCs = data.OldCnts;
                            $scope.GetVideoStat.videoNewCs = data.NewAddCnts;
                            $scope.GetVideoStat.videoNegCs = data.NegAddCnts;
                            $scope.GetVideoStat.videoNowCs = data.Cnts;
                        }
                    })
                }
            }
        })(),
        //设置，数据处理
        setting:(function () {
            return{
                //数据处理
                dataChange: function () {
                    if($stateParams.LiveChannel && $scope.model.newChannel){
                        $scope.model.LiveChannel = $stateParams.LiveChannel;
                    }
                    DataChartsController.serviceAPI.StatDataBarChart();
                    DataChartsController.setting.eCharts();
                },
                //图表数据操作
                eCharts: function () {
                    //获取视频数量统计数据
                    setTimeout(function () {
                        var barName = ['原有数量', '新增数量', '负增长数量'];
                        var names = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
                        var newAddCnts = $scope.GetVideoStat.videoNewCs;
                        var oldCnts = $scope.GetVideoStat.videoOldCs;
                        var negAddCnts = $scope.GetVideoStat.videoNegCs;
                        var cnts = $scope.GetVideoStat.videoNowCs;

                        var sums = [newAddCnts.length];
                        for (var i = 0; i < newAddCnts.length; i++) {
                            sums[i] = 0;
                        }
                        var myYearChart = echarts.init(document.getElementById('mainYear'+$scope.model.activeType));
                        //指定图表的配置项和数据
                        var option = {
                            title:{text:"视频数量统计"},
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
                                x:"right"
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
                                data:names,
                            },
                            series: [
                                {
                                    name:barName[0],
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
                                            color:'red',
                                            label : {
                                                show:true,
                                                position: 'top',

                                            }
                                        }
                                    },

                                    data: negAddCnts,
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

                        myYearChart.setOption(option);
                    },500);

                }
            }
        })(),
        //事件
        events:(function () {
            return{
                //tab切换
                loadTab: function (i) {
                    //切换选项卡时设置默认频道为第一个
                    $scope.model.LiveChannel = 1;
                    ////切换选项卡时设置默认年份
                    //$scope.model.Year = 2017;
                    ////切换选项卡时初始化年份选择
                    //$scope.model.yearShow = [
                    //    {id:1,year:new Date().getFullYear()},
                    //    {id:2,year:new Date().getFullYear()-1},
                    //    {id:3,year:new Date().getFullYear()-2},
                    //    {id:4,year:new Date().getFullYear()-3},
                    //    {id:5,year:new Date().getFullYear()-4},
                    //];
                    switch (i){
                        case 0:
                            DataChartsController.setting.dataChange();
                            break;
                        case 1:
                            DataChartsController.setting.dataChange();
                            break;
                        case 2:
                            DataChartsController.setting.dataChange();
                            break;
                        case 3:
                            DataChartsController.setting.dataChange();
                            break;
                        case 4:
                            DataChartsController.setting.dataChange();
                            break;
                    }
                },



                //判断显示数据来源并显示()
                dataOrigin: function () {
                    //如果有返回上一级的参数时再去执行
                    if($stateParams.tabID){
                        setTimeout(function () {

                            $('li.tabItem ').removeClass('active');
                            $('li.tabItem[tabType="'+$scope.model.tabID+'"] ').addClass('active');

                            $('li.tabItem[tabType="'+$scope.model.tabID+'"]>a').click();
                            //只让跳转过来的频道序号执行一次
                            $scope.model.newChannel = false;
                        },100)
                    }
                }
            }
        })()

    }
    DataChartsController.init();
}]);