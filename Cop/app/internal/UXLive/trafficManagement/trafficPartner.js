/**
 * Created by Administrator on 2017/12/1.
 */
app.controller('trafficPartner', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    var trafficPartner = {
        //变量
        variable : function () {
            $scope.model={
                pSize: 20,
                pIndex: 1,
                IsMoke:false,
                activeType:2,
                yearLists:[
                    {id:1,year:new Date().getFullYear()},
                    {id:2,year:new Date().getFullYear()-1},
                    {id:3,year:new Date().getFullYear()-2},
                    {id:4,year:new Date().getFullYear()-3},
                    {id:5,year:new Date().getFullYear()-4},
                ],
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
                SortFieldList:[],
                partnerList:[{id:undefined,name:'-请选择-'}],
                itemList:[],
                backYear:$stateParams.year,
                backMonth:$stateParams.month,
                hisYear:$stateParams.year,
                hisMonth:$stateParams.month,
                initDate:true,
            }
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;
            //分页获取合作伙伴流量明细列表
            $scope.GetPartnerData = {
                LiveChannel:1,//1:校园直播，2学科课程，3心理课程，4.营养课程
                PtnID:undefined,//合作伙伴ID
                Year:new Date().getFullYear(),
                Month:new Date().getMonth()+1,
            }
        },
        //初始化
        init: function () {
            this.variable();
            this.operation();
            this.setting.pageIndex();
            this.serviceAPI.GetPartnerFlowDetlList();
            $(".dateTime").val($scope.model.backYear +'年 - '+$scope.model.backMonth+'月');
            //console.log($stateParams)
        },
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
                    $scope.GetPartnerData.Year = $scope.model.hisYear;
                    $scope.GetPartnerData.Month = $scope.model.hisMonth;
                    trafficPartner.serviceAPI.GetPartnerFlowDetlList();
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
            //跳转到
            $scope.toGroup = function (PtnID,PtnName) {
                //跳转到机构（学校）
                $location.url('access/app/internal/UXLive/trafficSchool?year='+$scope.model.hisYear+'&month='+$scope.model.hisMonth+'&PtnID='+PtnID+'&name='+PtnName);
            };

            //查找机构
            $scope.refreshPtnList = function (key) {
                if(!key){
                    // toastr.error('请输入关键字');
                    return false;
                }
                trafficPartner.serviceAPI.GetPartnerByKeyword(key);
            };
            //点击筛选
            $scope.ptnSure = function () {
                trafficPartner.serviceAPI.GetPartnerFlowDetlList();
            };
            //清除列表
            $scope.ptnClear = function () {
                $scope.model.partnerList = [{id:undefined,name:'-请选择-'}];
                $scope.GetPartnerData.PtnID = undefined;
            };
        },
        //api服务
        serviceAPI:(function () {
            return{
                GetPartnerFlowDetlList: function () {
                    if($scope.model.initDate){
                        $scope.GetPartnerData.Year = $stateParams.year;
                        $scope.GetPartnerData.Month = $stateParams.month;
                        $scope.model.initDate = false
                    }
                    applicationServiceSet.liveService.officialBackground.GetPartnerFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.GetPartnerData.LiveChannel,
                        $scope.GetPartnerData.PtnID,
                        $scope.GetPartnerData.Year,
                        $scope.GetPartnerData.Month,
                        $scope.model.pIndex,
                        $scope.model.pSize,
                        $scope.model.SortFieldList,
                        $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0 && data.Data){
                            trafficPartner.setting.dataChange(data.Data);
                        }
                    })
                },
                //获取根据关键字获取合作伙伴列表
                GetPartnerByKeyword:function (key) {
                    applicationServiceSet.liveService.officialBackground.GetPartnerByKeyword.send([APPMODEL.Storage.getItem('copPage_token'),key,$scope.model.OrgLevel,$scope.model.OrgID])

                        .then(function (data) {
                            if(data.Ret==0){
                                $scope.model.partnerList=[];
                                for(var i =  0 ; i<data.Data.length;i++){
                                    $scope.model.partnerList.push({id:data.Data[i].ID,name:data.Data[i].Name});
                                }
                            }
                        });
                },
            }
        })(),
        //设置
        setting:(function () {
            return{
                //数据操作
                dataChange: function (data,pIndex) {
                    $scope.model.itemList = data.ViewModelList;
                   // console.log($scope.model.itemList)
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
                            applicationServiceSet.liveService.officialBackground.GetPartnerFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.GetPartnerData.LiveChannel,
                                    $scope.GetPartnerData.PtnID,
                                    $scope.GetPartnerData.Year,
                                    $scope.GetPartnerData.Month,
                                    page.pIndex,
                                    $scope.model.pSize,
                                    $scope.model.SortFieldList,
                                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if (data.Ret == 0) {
                                        trafficPartner.setting.dataChange(data.Data,page.pIndex)
                                    }
                                });

                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {

                            applicationServiceSet.liveService.officialBackground.GetPartnerFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.GetPartnerData.LiveChannel,
                                    $scope.GetPartnerData.PtnID,
                                    $scope.GetPartnerData.Year,
                                    $scope.GetPartnerData.Month,
                                    pageNext,
                                    $scope.model.pSize,
                                    $scope.model.SortFieldList,
                                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if (data.Ret == 0) {
                                        trafficPartner.setting.dataChange(data.Data,pageNext)
                                    }
                                });

                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {

                            applicationServiceSet.liveService.officialBackground.GetPartnerFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.GetPartnerData.LiveChannel,
                                    $scope.GetPartnerData.PtnID,
                                    $scope.GetPartnerData.Year,
                                    $scope.GetPartnerData.Month,
                                    pageNext,
                                    $scope.model.pSize,
                                    $scope.model.SortFieldList,
                                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if (data.Ret == 0) {

                                        trafficPartner.setting.dataChange(data.Data,pageNext)
                                    }
                                });
                        }

                    };
                }
            }
        })(),
        //事件
        events:(function () {
            return{

            }
        })()
    }
    trafficPartner.init();
}])