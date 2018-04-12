/**
 * Created by Administrator on 2017/11/15.
 */
app.controller('DataDetailController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {

    var DataDetailController = {
        //变量
        variable:function (){
            //全局变量
            $scope.model = {
                IsMoke:false,
                pSize:20,
                pIndex:1,
                activeType:0,
                itemList:[],
                partnerType:true,
                groupType:true,
                isPtnID:true,
                isGrpID:true,
                clickPage:0,
            }
            //分页获取各个频道的数据明细列表(按合作伙伴排行)
            $scope.GetPartnerDataStatDetlList = {
                LiveChannel:$stateParams.LiveChannel,//Campus=1校园直播,Course =2 课程直播
                Type:$stateParams.tabID,//0：发布数量 1：分享量 2：评论量 3：点赞量 4：收藏量
                StartDate:$scope.sDate,//
                EndDate:$scope.eDate,//
                SortFieldList:[],//排序字段合集
            }
            //分页获取各个频道的数据明细列表(按机构排行)
            $scope.GetGroupDataStatDetlList = {
                LiveChannel:$stateParams.LiveChannel,//Campus=1校园直播,Course =2 课程直播
                Type:$stateParams.tabID,//0：发布数量 1：分享量 2：评论量 3：点赞量 4：收藏量
                StartDate:$scope.sDate,//
                EndDate:$scope.eDate,//
                SortFieldList:[],//排序字段合集
            }
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            //$scope.model.OrgLevel = 0;
            $scope.model.OrgID= orgModel.OrgID;
        },
        //初始化操作
        init: function () {
            this.variable();
            this.serviceAPI.pageIndex();//分页服务
            this.operation();
            this.events.dateSet();
            this.events.dataOrigin();//显示数据来源tab选项卡
        },
        //API服务
        serviceAPI: (function () {
            return{
                //分页获取各个频道的数据明细列表(合作伙伴)
                GetPartnerDataStatDetlList: function () {
                    applicationServiceSet.liveService.officialBackground.GetPartnerDataStatDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.GetPartnerDataStatDetlList.LiveChannel,
                        $scope.model.activeType,
                        $scope.GetPartnerDataStatDetlList.StartDate,
                        $scope.GetPartnerDataStatDetlList.EndDate,
                        $scope.model.pIndex,
                        $scope.model.pSize,
                        $scope.GetPartnerDataStatDetlList.SortFieldList,
                        $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0 && data.Data){
                            DataDetailController.events.dataChange(data.Data,$scope.model.pIndex);
                        }
                    })
                },
                //分页获取各个频道的数据明细列表(机构)
                GetGroupDataStatDetlList: function () {
                    applicationServiceSet.liveService.officialBackground.GetGroupDataStatDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.GetGroupDataStatDetlList.LiveChannel,
                        $scope.model.activeType,
                        $scope.GetGroupDataStatDetlList.StartDate,
                        $scope.GetGroupDataStatDetlList.EndDate,
                        $scope.model.pIndex,
                        $scope.model.pSize,
                        $scope.GetGroupDataStatDetlList.SortFieldList,
                        $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0 && data.Data){
                            DataDetailController.events.dataChange(data.Data,$scope.model.pIndex);
                        }
                    })
                },
                /**
                 * paging function
                 */
                pageIndex: function () {
                    /**
                     * paging index send
                     */
                    $scope.pageIndex = {
                        /**
                         * click paging
                         * @param page
                         */
                        fliPage: function (page) {
                            $scope.GetPartnerDataStatDetlList.StartDate = DataDetailController.events.dateFormat(new Date($scope.sDate),'yyyy/MM/dd');
                            $scope.GetPartnerDataStatDetlList.EndDate = DataDetailController.events.dateFormat(new Date($scope.eDate),'yyyy/MM/dd');
                            $scope.GetGroupDataStatDetlList.StartDate = DataDetailController.events.dateFormat(new Date($scope.sDate),'yyyy/MM/dd');
                            $scope.GetGroupDataStatDetlList.EndDate = DataDetailController.events.dateFormat(new Date($scope.eDate),'yyyy/MM/dd');

                            if($scope.model.activeType==$scope.model.clickPage) {
                                //当显示机构时
                                if(!$scope.model.partnerType){
                                    applicationServiceSet.liveService.officialBackground.GetGroupDataStatDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                            $scope.GetGroupDataStatDetlList.LiveChannel,
                                            $scope.model.activeType,
                                            $scope.GetGroupDataStatDetlList.StartDate,
                                            $scope.GetGroupDataStatDetlList.EndDate,
                                            page.pIndex,
                                            $scope.model.pSize,
                                            $scope.GetGroupDataStatDetlList.SortFieldList,
                                            $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                        .then(function (data) {
                                            if (data.Ret == 0 && data.Data) {
                                                DataDetailController.events.dataChange(data.Data,page.pIndex)
                                            }
                                        });
                                }else{
                                    //当显示合作伙伴时
                                    applicationServiceSet.liveService.officialBackground.GetPartnerDataStatDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                            $scope.GetPartnerDataStatDetlList.LiveChannel,
                                            $scope.model.activeType,
                                            $scope.GetPartnerDataStatDetlList.StartDate,
                                            $scope.GetPartnerDataStatDetlList.EndDate,
                                            page.pIndex,
                                            $scope.model.pSize,
                                            $scope.GetPartnerDataStatDetlList.SortFieldList,
                                            $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                        .then(function (data) {
                                            if (data.Ret == 0 && data.Data) {
                                                DataDetailController.events.dataChange(data.Data,page.pIndex)
                                            }
                                        });
                                }

                            }
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            $scope.GetPartnerDataStatDetlList.StartDate = DataDetailController.events.dateFormat(new Date($scope.sDate),'yyyy/MM/dd');
                            $scope.GetPartnerDataStatDetlList.EndDate = DataDetailController.events.dateFormat(new Date($scope.eDate),'yyyy/MM/dd');
                            $scope.GetGroupDataStatDetlList.StartDate = DataDetailController.events.dateFormat(new Date($scope.sDate),'yyyy/MM/dd');
                            $scope.GetGroupDataStatDetlList.EndDate = DataDetailController.events.dateFormat(new Date($scope.eDate),'yyyy/MM/dd');

                            if($scope.model.activeType==$scope.model.clickPage) {
                                //当显示机构时
                                if(!$scope.model.partnerType){
                                    applicationServiceSet.liveService.officialBackground.GetGroupDataStatDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                            $scope.GetGroupDataStatDetlList.LiveChannel,
                                            $scope.model.activeType,
                                            $scope.GetGroupDataStatDetlList.StartDate,
                                            $scope.GetGroupDataStatDetlList.EndDate,
                                            pageNext,
                                            $scope.model.pSize,
                                            $scope.GetGroupDataStatDetlList.SortFieldList,
                                            $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                        .then(function (data) {
                                            if (data.Ret == 0 && data.Data) {
                                                DataDetailController.events.dataChange(data.Data,pageNext)
                                            }
                                        });
                                }else{
                                    //当显示合作伙伴时
                                    applicationServiceSet.liveService.officialBackground.GetPartnerDataStatDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                            $scope.GetPartnerDataStatDetlList.LiveChannel,
                                            $scope.model.activeType,
                                            $scope.GetPartnerDataStatDetlList.StartDate,
                                            $scope.GetPartnerDataStatDetlList.EndDate,
                                            pageNext,
                                            $scope.model.pSize,
                                            $scope.GetPartnerDataStatDetlList.SortFieldList,
                                            $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                        .then(function (data) {
                                            if (data.Ret == 0 && data.Data) {
                                                DataDetailController.events.dataChange(data.Data,pageNext)
                                            }
                                        });
                                }
                            }
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            $scope.GetPartnerDataStatDetlList.StartDate = DataDetailController.events.dateFormat(new Date($scope.sDate),'yyyy/MM/dd');
                            $scope.GetPartnerDataStatDetlList.EndDate = DataDetailController.events.dateFormat(new Date($scope.eDate),'yyyy/MM/dd');
                            $scope.GetGroupDataStatDetlList.StartDate = DataDetailController.events.dateFormat(new Date($scope.sDate),'yyyy/MM/dd');
                            $scope.GetGroupDataStatDetlList.EndDate = DataDetailController.events.dateFormat(new Date($scope.eDate),'yyyy/MM/dd');

                            if($scope.model.activeType==$scope.model.clickPage) {
                                //当显示机构时
                                if(!$scope.model.partnerType){
                                    applicationServiceSet.liveService.officialBackground.GetGroupDataStatDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                            $scope.GetGroupDataStatDetlList.LiveChannel,
                                            $scope.model.activeType,
                                            $scope.GetGroupDataStatDetlList.StartDate,
                                            $scope.GetGroupDataStatDetlList.EndDate,
                                            pageNext,
                                            $scope.model.pSize,
                                            $scope.GetGroupDataStatDetlList.SortFieldList,
                                            $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                        .then(function (data) {
                                            if (data.Ret == 0 && data.Data) {
                                                DataDetailController.events.dataChange(data.Data,pageNext)
                                            }
                                        });
                                }else{
                                //当显示合作伙伴时
                                    applicationServiceSet.liveService.officialBackground.GetPartnerDataStatDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                            $scope.GetPartnerDataStatDetlList.LiveChannel,
                                            $scope.model.activeType,
                                            $scope.GetPartnerDataStatDetlList.StartDate,
                                            $scope.GetPartnerDataStatDetlList.EndDate,
                                            pageNext,
                                            $scope.model.pSize,
                                            $scope.GetPartnerDataStatDetlList.SortFieldList,
                                            $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                        .then(function (data) {
                                            if (data.Ret == 0 && data.Data) {
                                                DataDetailController.events.dataChange(data.Data,pageNext)
                                            }
                                        });
                                }

                            }
                        }
                    };
                }
            }
        })(),
        //事件
        events:(function () {
            return{
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
                //判断处于哪个选项卡
                loadTab: function (i) {
                    $scope.model.clickPage = i;
                   switch (i){
                       case 0:
                           if($scope.model.partnerType){
                               //合作伙伴显示
                               DataDetailController.serviceAPI.GetPartnerDataStatDetlList();
                           }else{
                               //机构显示
                               DataDetailController.serviceAPI.GetGroupDataStatDetlList();
                           }
                           break;
                       case 1:
                           if($scope.model.partnerType){
                               //合作伙伴显示
                               DataDetailController.serviceAPI.GetPartnerDataStatDetlList();
                           }else{
                               //机构显示
                               DataDetailController.serviceAPI.GetGroupDataStatDetlList();
                           }
                           break;
                       case 2:
                           if($scope.model.partnerType){
                               //合作伙伴显示
                               DataDetailController.serviceAPI.GetPartnerDataStatDetlList();
                           }else{
                               //机构显示
                               DataDetailController.serviceAPI.GetGroupDataStatDetlList();
                           }
                           break;
                       case 3:
                           if($scope.model.partnerType){
                               //合作伙伴显示
                               DataDetailController.serviceAPI.GetPartnerDataStatDetlList();
                           }else{
                               //机构显示
                               DataDetailController.serviceAPI.GetGroupDataStatDetlList();
                           }
                           break;
                       case 4:
                           if($scope.model.partnerType){
                               //合作伙伴显示
                               DataDetailController.serviceAPI.GetPartnerDataStatDetlList();
                           }else{
                               //机构显示
                               DataDetailController.serviceAPI.GetGroupDataStatDetlList();
                           }
                           break;

                   }
               },
                //接口数据处理
                dataChange: function (data,pIndex) {
                    $scope.model.itemList = data.ViewModelList;
                    //console.log($scope.model.itemList)
                    //清空排序条件
                    $scope.GetPartnerDataStatDetlList.SortFieldList = [];
                    if($scope.model.itemList){
                        for(var i=0;i <= $scope.model.itemList.length;i++){
                            if( $scope.model.itemList[i])
                            $scope.model.itemList[i].index= $scope.model.pSize*(pIndex-1) + i+1;
                        }
                    }
                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
                },

                //判断显示数据来源并显示
                dataOrigin: function () {
                    if($stateParams.tabID) {
                        setTimeout(function () {
                            $('li.tabItem ').removeClass('active');
                            $('li.tabItem[tabType="' + $stateParams.tabID + '"] ').addClass('active');

                            $('li.tabItem[tabType="' + $stateParams.tabID + '"]>a').click();

                        }, 100)
                    }
                    //当从表格返回的时候，判断是否显示为正确的表格数据（合作伙伴或者机构）
                    setTimeout(function () {
                        //当为官方后台时，开始默认显示合作伙伴
                        if($scope.model.OrgLevel == 1){
                            if($stateParams.PGType === 'false'){
                                $scope.model.partnerType = false;
                                //机构显示
                                DataDetailController.serviceAPI.GetGroupDataStatDetlList();
                                $("button.group").addClass("btn-success").siblings("button").removeClass("btn-success");
                            }else{
                                $scope.model.partnerType = true;
                                //合作伙伴显示
                                DataDetailController.serviceAPI.GetPartnerDataStatDetlList();
                                $("button.partner").addClass("btn-success").siblings("button").removeClass("btn-success");
                            }
                        }else if($scope.model.OrgLevel != 1){
                            //不是官方后台，直接显示机构
                            DataDetailController.serviceAPI.GetGroupDataStatDetlList();
                            $("button.group").addClass("btn-success").siblings("button").removeClass("btn-success");
                        }

                    },200)

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
                    $scope.GetPartnerDataStatDetlList.StartDate = $scope.sDate;
                    $scope.GetPartnerDataStatDetlList.EndDate = $scope.eDate;
                    $scope.GetGroupDataStatDetlList.StartDate = $scope.sDate;
                    $scope.GetGroupDataStatDetlList.EndDate = $scope.eDate;
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
            }
        })(),
        //操作
        operation: function () {
            //切换选项卡
            $scope.changeTab = function (i) {

                //切换选项卡时，默认为机构($scope.model.partnerType=true 合作伙伴 若为false 默认显示机构 )
                $scope.model.partnerType = false;
                $("button.group").addClass("btn-success").siblings("button").removeClass("btn-success");

                $scope.model.activeType = i;
                DataDetailController.events.loadTab(i);
            };

            //返回上一级
            $scope.backHistory = function () {
                $location.url('access/app/internal/UXLive/DataShow?tabID='+ $scope.model.activeType);
            };
            //点击合作伙伴表格时曲线图跳转事件
            $scope.toPidCharts = function (model,PID) {
                //参数分别为，tabID-此时显示的tab选项，PtnID-合作伙伴ID，PGType-true 合作伙伴 若为false 显示机构
                $location.url('access/app/internal/UXLive/DataCharts?tabID='+ $scope.model.activeType +'&PtnID='+PID+'&PGType='+$scope.model.partnerType);
            };
            //点击机构表格时曲线图跳转事件
            $scope.toGidCharts = function (model,GID) {
                $location.url('access/app/internal/UXLive/DataCharts?tabID='+ $scope.model.activeType +'&GID='+GID+'&PGType='+$scope.model.partnerType);
            };
            //合作伙伴排序
            $scope.sortPartner = function () {
                $scope.model.partnerType = true;
                DataDetailController.serviceAPI.GetPartnerDataStatDetlList();
                $("button.partner").addClass("btn-success").siblings("button").removeClass("btn-success");
            };
            //机构排序
            $scope.sortGroup = function () {
                $scope.model.partnerType = false;
                DataDetailController.serviceAPI.GetGroupDataStatDetlList();
                $("button.group").addClass("btn-success").siblings("button").removeClass("btn-success");
            }
            //日均量升降序排列
            $scope.daySort = function (type) {
                if($scope.model.partnerType){
                    if(type){
                        $scope.GetPartnerDataStatDetlList.SortFieldList = [{SortField:"DayAvgCnt",IsAsc:true}]
                    }else{
                        $scope.GetPartnerDataStatDetlList.SortFieldList = [{SortField:"DayAvgCnt",IsAsc:false}]
                    }
                    DataDetailController.serviceAPI.GetPartnerDataStatDetlList();
                }else{
                    if(type){
                        $scope.GetGroupDataStatDetlList.SortFieldList = [{SortField:"DayAvgCnt",IsAsc:true}]
                    }else{
                        $scope.GetGroupDataStatDetlList.SortFieldList = [{SortField:"DayAvgCnt",IsAsc:false}]
                    }
                    DataDetailController.serviceAPI.GetGroupDataStatDetlList();
                }


            };

            //月均量升降序排列
            $scope.monthSort = function (type) {
                if($scope.model.partnerType){
                    if(type){
                        $scope.GetPartnerDataStatDetlList.SortFieldList = [{SortField:"MonthAvgCnt",IsAsc:true}]
                    }else{
                        $scope.GetPartnerDataStatDetlList.SortFieldList = [{SortField:"MonthAvgCnt",IsAsc:false}]
                    }
                    DataDetailController.serviceAPI.GetPartnerDataStatDetlList();
                }else{
                    if(type){
                        $scope.GetGroupDataStatDetlList.SortFieldList = [{SortField:"MonthAvgCnt",IsAsc:true}]
                    }else{
                        $scope.GetGroupDataStatDetlList.SortFieldList = [{SortField:"MonthAvgCnt",IsAsc:false}]
                    }
                    DataDetailController.serviceAPI.GetGroupDataStatDetlList();
                }

            };
            //总数量升降序排列
            $scope.sumSort = function (type) {
                if($scope.model.partnerType){
                    if(type){
                        $scope.GetPartnerDataStatDetlList.SortFieldList = [{SortField:"SumCnt",IsAsc:true}]
                    }else{
                        $scope.GetPartnerDataStatDetlList.SortFieldList = [{SortField:"SumCnt",IsAsc:false}]
                    }
                    DataDetailController.serviceAPI.GetPartnerDataStatDetlList();
                }else{
                    if(type){
                        $scope.GetGroupDataStatDetlList.SortFieldList = [{SortField:"SumCnt",IsAsc:true}]
                    }else{
                        $scope.GetGroupDataStatDetlList.SortFieldList = [{SortField:"SumCnt",IsAsc:false}]
                    }
                    DataDetailController.serviceAPI.GetGroupDataStatDetlList();
                }

            };
            //按时间段查询
            $scope.dateSearch = function () {
                $scope.GetPartnerDataStatDetlList.StartDate = DataDetailController.events.dateFormat(new Date($scope.sDate),'yyyy-MM-dd');
                $scope.GetPartnerDataStatDetlList.EndDate = DataDetailController.events.dateFormat(new Date($scope.eDate),'yyyy-MM-dd');
                $scope.GetGroupDataStatDetlList.StartDate = DataDetailController.events.dateFormat(new Date($scope.sDate),'yyyy-MM-dd');
                $scope.GetGroupDataStatDetlList.EndDate = DataDetailController.events.dateFormat(new Date($scope.eDate),'yyyy-MM-dd');
                if($scope.model.partnerType){
                    //合作伙伴显示
                    DataDetailController.serviceAPI.GetPartnerDataStatDetlList();
                }else{
                    //机构显示
                    DataDetailController.serviceAPI.GetGroupDataStatDetlList();
                }

            };
        }
    };
    DataDetailController.init();
}]);