/**
 * Created by Administrator on 2017/11/30.
 */
app.controller('trafficUser', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {


    var trafficUser = {
        //变量
        variable: function () {
            //全局变量
          $scope.model = {
              pSize: 20,
              pIndex: 1,
              IsMoke:false,
              itemList:[],
              className:$stateParams.name,
              backYear:$stateParams.year,
              backMonth:$stateParams.month,
              hisYear:$stateParams.year,
              hisMonth:$stateParams.month,
          };
        var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
        $scope.model.OrgLevel = orgModel.OrgLevel;
        $scope.model.OrgID= orgModel.OrgID;
        //分页获取用户流量明细列表【页面83】
        $scope.GetUserData = {
            LiveChannel:1,//频道类型
            PtnID:$stateParams.PtnID,//合作伙伴ID
            GID:$stateParams.schoolID,
            ClassID:$stateParams.classID,
            Year:new Date().getFullYear(),
            Month:new Date().getMonth()+1,
            Keyword:'',
            SortFieldList:[],
        }

        },
        //初始化
        init: function () {
            this.variable();
            this.setting.pageIndex();//分页服务
            this.operation();
            this.serviceAPI.GetUserFlowDetlList();
            $(".dateTime").val($scope.model.hisYear +'年 - '+$scope.model.hisMonth+'月');
        },
        //api服务
        serviceAPI:(function () {
            return {
                GetUserFlowDetlList: function () {
                    applicationServiceSet.liveService.officialBackground.GetUserFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.GetUserData.LiveChannel,
                        $scope.GetUserData.PtnID,
                        $scope.GetUserData.GID,
                        $scope.GetUserData.ClassID,
                        $scope.model.hisYear,
                        $scope.model.hisMonth,
                        $scope.GetUserData.Keyword,
                        $scope.model.pIndex,
                        $scope.model.pSize,
                        $scope.model.SortFieldList,
                        $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0 && data.Data){
                            trafficUser.setting.dataChange(data.Data);
                        }
                    })
                }
            }
        })(),
        //设置
        setting:(function () {
            return {
                //数据处理
                dataChange: function (data,pIndex) {

                    $scope.model.itemList = data.ViewModelList;
                    console.log($scope.model.itemList)
                    for(var j = 0; j < $scope.model.itemList.length;j++){
                        if($scope.model.itemList[j].Gender == -1){
                            $scope.model.itemList[j].Gender = "未知"
                        }else if($scope.model.itemList[j].Gender == 1){
                            $scope.model.itemList[j].Gender = "男"
                        }else if($scope.model.itemList[j].Gender == 0){
                            $scope.model.itemList[j].Gender = "女"
                        }
                    }
                    //序号
                    for(var i=0;i <= $scope.model.itemList.length;i++){
                        if($scope.model.itemList[i]){
                            pIndex = pIndex?pIndex:1;
                            $scope.model.itemList[i].index = $scope.model.pSize*(pIndex-1) + i+1;
                        }
                    }
                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
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
                            applicationServiceSet.liveService.officialBackground.GetUserFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.GetUserData.LiveChannel,
                                    $scope.GetUserData.PtnID,
                                    $scope.GetUserData.GID,
                                    $scope.GetUserData.ClassID,
                                    $scope.model.hisYear,
                                    $scope.model.hisMonth,
                                    $scope.GetUserData.Keyword,
                                    page.pIndex,
                                    $scope.model.pSize,
                                    $scope.model.SortFieldList,
                                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if (data.Ret == 0) {
                                        trafficUser.setting.dataChange(data.Data,page.pIndex)
                                    }
                                });

                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {

                            applicationServiceSet.liveService.officialBackground.GetUserFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.GetUserData.LiveChannel,
                                    $scope.GetUserData.PtnID,
                                    $scope.GetUserData.GID,
                                    $scope.GetUserData.ClassID,
                                    $scope.model.hisYear,
                                    $scope.model.hisMonth,
                                    $scope.GetUserData.Keyword,
                                    pageNext,
                                    $scope.model.pSize,
                                    $scope.model.SortFieldList,
                                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if (data.Ret == 0) {
                                        trafficUser.setting.dataChange(data.Data,pageNext)
                                    }
                                });

                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {

                            applicationServiceSet.liveService.officialBackground.GetUserFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.GetUserData.LiveChannel,
                                    $scope.GetUserData.PtnID,
                                    $scope.GetUserData.GID,
                                    $scope.GetUserData.ClassID,
                                    $scope.model.hisYear,
                                    $scope.model.hisMonth,
                                    $scope.GetUserData.Keyword,
                                    pageNext,
                                    $scope.model.pSize,
                                    $scope.model.SortFieldList,
                                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if (data.Ret == 0) {
                                        trafficUser.setting.dataChange(data.Data,pageNext)
                                    }
                                });
                        }

                    };
                }
            }
        })(),
        //操作
        operation: function () {
            //年月选择
            $scope.changeTime = function () {
                //初始化时间选择条件
                $scope.model.hisYear = undefined;
                $scope.model.hisMonth = undefined;
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
            }
            //  点击年月确定事件
            $scope.dateSure = function () {
                if($scope.model.hisYear && $scope.model.hisMonth){
                    $(".dateTime").val($scope.model.hisYear +'年 - '+$scope.model.hisMonth+'月');
                    $(".hisYear").html($scope.model.hisYear);
                    $(".hisMonth").html($scope.model.hisMonth);
                    $scope.GetUserData.Year = $scope.model.hisYear;
                    $scope.GetUserData.Month = $scope.model.hisMonth;
                    //接口调用
                    trafficUser.serviceAPI.GetUserFlowDetlList();
                }
                else {
                    toastr.error("请选择年月")
                    return false
                }
                var isYes = $(".selectDate").hasClass("dateSelect");
                if(isYes){
                    $(".selectDate").removeClass("dateSelect")
                };

            };
            //选择年
            $scope.slcYear = function (year) {
                $scope.model.hisYear = year.year
            };
            //选择月
            $scope.slcMonth = function (month) {
                $scope.model.hisMonth = month.month
            };
            //搜索框搜索事件
            $scope.searchClass = function () {
                trafficUser.serviceAPI.GetUserFlowDetlList();
            };
            //跳转
            $scope.toUsers = function (UID, UName) {
                $location.url('access/app/internal/UXLive/WatchRecordList?userID='+ UID+'&ID='+'&Name='+UName+'&Year='+$scope.model.hisYear+'&Month='+$scope.model.hisMonth);
            }
        }
    }
    trafficUser.init();

}])