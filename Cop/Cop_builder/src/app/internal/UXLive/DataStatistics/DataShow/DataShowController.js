/**
 * Created by Administrator on 2017/11/15.
 */
app.controller('DataShowController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {

    //切换选项卡
    $scope.changeTab = function (i) {
        //初始化排序
        $(".DayAvgCnt,.MonthAvgCnt,.SumCnt").removeClass("sortActive");
        $scope.GetDataStatList.SortFieldList = [];
        $scope.model.activeType = i;
        DataShowController.events.loadTab(i);
    };

    //排序
    $scope.sortList = function (type,check) {
        if(type == 1 && check){
            $scope.GetDataStatList.SortFieldList = [{SortField:"DayAvgCnt",IsAsc:true}];
            $("button.DayAvgCnt span").html("降");
            $(".DayAvgCnt").addClass("sortActive").siblings("button").removeClass("sortActive");
            $scope.model.DayAvgCnt = false
            $scope.model.MonthAvgCnt = $scope.model.SumCnt = true;
            $(".MonthAvgCnt span,.SumCnt span").html("升");
        }else if(type == 1 && !check){
            $scope.GetDataStatList.SortFieldList = [{SortField:"DayAvgCnt",IsAsc:false}];
            $("button.DayAvgCnt span").html("升");
            $(".DayAvgCnt").removeClass("sortActive");
            $scope.model.DayAvgCnt = true;
        }

        if(type ==2 && check){
            $scope.GetDataStatList.SortFieldList = [{SortField:"MonthAvgCnt",IsAsc:true}];
            $("button.MonthAvgCnt span").html("降");
            $(".MonthAvgCnt").addClass("sortActive").siblings("button").removeClass("sortActive");
            $scope.model.MonthAvgCnt = false
            $scope.model.DayAvgCnt = $scope.model.SumCnt = true;
            $(".DayAvgCnt span,.SumCnt span").html("升");
        }else if(type ==2 && !check){
            $scope.GetDataStatList.SortFieldList = [{SortField:"MonthAvgCnt",IsAsc:false}];
            $("button.MonthAvgCnt span").html("升");
            $(".MonthAvgCnt").removeClass("sortActive");
            $scope.model.MonthAvgCnt = true;
        }
        if(type ==3 && check){
            $scope.GetDataStatList.SortFieldList = [{SortField:"SumCnt",IsAsc:true}];
            $("button.SumCnt span").html("降");
            $(".SumCnt").addClass("sortActive").siblings("button").removeClass("sortActive");
            $scope.model.SumCnt = false
            $scope.model.DayAvgCnt = $scope.model.MonthAvgCnt = true;
            $(".DayAvgCnt span,.MonthAvgCnt span").html("升");
        }else if(type ==3 && !check){
            $scope.GetDataStatList.SortFieldList = [{SortField:"SumCnt",IsAsc:false}];
            $("button.SumCnt span").html("升");
            $(".SumCnt").removeClass("sortActive");
            $scope.model.SumCnt = true;
        }
        DataShowController.serviceAPI.GetDataStatList();
    };

    //点击跳转事件(跳转到数据明细)明细表事件
    $scope.toLiveRecordList = function (item) {
        $location.url('access/app/internal/UXLive/DataDetail?tabID='+ $scope.model.activeType +'&LiveChannel='+item.LiveChannel);
    };
    //点击曲线图跳转
    $scope.toCharts = function (item) {
        $location.url('access/app/internal/UXLive/DataCharts?tabID='+ $scope.model.activeType +'&LiveChannel='+item.LiveChannel);
    }
    var DataShowController = {

        //变量
        variable: function () {
            //全局可用变量
            $scope.model = {
                activeType:0,
                pSize:1000,
                pIndex:1,
                IsMoke:false,
                tabHis:$stateParams.tabID,
                DayAvgCnt:true,
                MonthAvgCnt:true,
                SumCnt:true,
            },

            //分页获取各个频道的统计数据列表
            $scope.GetDataStatList = {
                Type:[
                    {id:0,text:"发布数量"},
                    {id:1,text:"分享量"},
                    {id:2,text:"评论量"},
                    {id:3,text:"点赞量"},
                    {id:4,text:"收藏量"},
                ],//统计类型-->0：发布数量 1：分享量 2：评论量 3：点赞量 4：收藏量
                StartDate:$scope.sDate,//开始时间
                EndDate:$scope.eDate,//结束时间
                PageIndex:1,//页码
                PageSize:10,//页容量
                SortFieldList:[],//排序字段集合
                itemList:[],
            }
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;
        },
        //初始化
        init: function () {
            this.events.dateSet();
            this.variable();
            this.serviceAPI.GetDataStatList();
            this.events.dataOrigin();
            this.operation();
        },
        //操作
        operation: function () {
            $scope.dateSearch = function () {
                $scope.GetDataStatList.StartDate = DataShowController.events.dateFormat(new Date($scope.sDate),'yyyy/MM/dd');
                $scope.GetDataStatList.EndDate = DataShowController.events.dateFormat(new Date($scope.eDate),'yyyy/MM/dd');
                DataShowController.serviceAPI.GetDataStatList();
            }
        },
        //API服务
        serviceAPI:(function () {
            return {
                //分页获取各个频道的统计数据列表
                GetDataStatList: function () {
                    applicationServiceSet.liveService.officialBackground.GetDataStatList.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.model.activeType,
                        $scope.GetDataStatList.StartDate,
                        $scope.GetDataStatList.EndDate,
                        $scope.model.pIndex,
                        $scope.model.pSize,
                        $scope.GetDataStatList.SortFieldList,
                        $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0 && data.Data){
                            DataShowController.events.dataChange(data.Data);
                        }
                    })
                }
            }
        })(),
        //设置
        events:(function () {
            return {
                //判断切换状态，处于哪个选项
                loadTab: function (i) {
                    switch (i){
                        case 0:
                            DataShowController.serviceAPI.GetDataStatList();
                            $scope.sortList();
                            //console.log($scope.model.activeType);
                            break;
                        case 1:

                            DataShowController.serviceAPI.GetDataStatList();
                            $scope.sortList();
                            //console.log($scope.model.activeType);

                            break;
                        case 2:
                            DataShowController.serviceAPI.GetDataStatList();
                            $scope.sortList();
                            //console.log($scope.model.activeType);

                            break;
                        case 3:
                            DataShowController.serviceAPI.GetDataStatList();
                            $scope.sortList();
                            //console.log($scope.model.activeType);
                            break;
                        case 4:
                            DataShowController.serviceAPI.GetDataStatList();
                            $scope.sortList();
                            //console.log($scope.model.activeType);
                            break;
                    }
                },

                //获取接口数据处理
                dataChange: function (data) {
                    $scope.GetDataStatList.itemList = data.ViewModelList;
                    //console.log($scope.GetDataStatList.itemList);
                },
                //配置时间开始------------
                dateSet : function () {
                    $scope.clear = function () {
                        $scope.sDate = null;
                        $scope.eDate = null;
                    };
                    var date = new Date();
                    var sDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + 1;
                    var nowDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                    $scope.sDate = sDate;
                    $scope.eDate = nowDate;
                    $scope.minDate = $scope.minDate ? null : new Date();

                    $scope.openStartDate = function ($event) {
                        $scope.endOpened = false;
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.openedStart = true;
                    };

                    $scope.openEndDate = function ($event) {
                        $scope.openedStart = false;
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.endOpened = true;
                    };

                    $scope.dateOptions = {
                        formatYear: 'yy',
                        startingDay: 1,
                        class: 'datepicker'
                    };
                    $scope.format = 'yyyy/MM/dd';
                },
                //配置時間結束----------
                //判断显示数据来源并显示()
                dataOrigin: function () {
                    //如果有返回上一级的参数时再去执行
                    if($stateParams.tabID){
                        setTimeout(function () {
                            $('li.tabItem ').removeClass('active');
                            $('li.tabItem[tabType="'+$scope.model.tabHis+'"] ').addClass('active');

                            $('li.tabItem[tabType="'+$scope.model.tabHis+'"]>a').click();

                        },100)
                    }
                },
                //时间字符串截取方法。
                dateFormat : function (date, format) {
                    if (typeof (date)=="undefined") {
                        return "";
                    }
                    if (!(date instanceof  Date)) {
                        return "";
                    }
                    var $this = date;
                    var o = {
                        "M+": $this.getMonth() + 1, //month
                        "d+": $this.getDate(), //day
                        "h+": $this.getHours(), //hour
                        "m+": $this.getMinutes(), //minute
                        "s+": $this.getSeconds(), //second
                        "q+": Math.floor(($this.getMonth() + 3) / 3), //quarter
                        "S": $this.getMilliseconds() //millisecond
                    }
                    if (/(y+)/.test(format)) {
                        format = format.replace(RegExp.$1, ($this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    }

                    for (var k in o) {
                        if (new RegExp("(" + k + ")").test(format)) {
                            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                        }
                    }
                    return format;
                },

            }
        })(),
    };
    DataShowController.init();
}]);