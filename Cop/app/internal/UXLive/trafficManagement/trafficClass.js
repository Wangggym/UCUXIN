/**
 * Created by Administrator on 2017/11/29.
 */
app.controller('trafficClass', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    var trafficClass ={
        //变量
        variable : function () {
            $scope.model = {
                pSize: 20,
                pIndex: 1,
                IsMoke:false,
                itemList:[],
                schoolName:$stateParams.name,
                backYear:$stateParams.year,
                backMonth:$stateParams.month,
                hisYear:$stateParams.year,
                hisMonth:$stateParams.month,
                s_class:undefined,
                classList:[{id:undefined,name:'-请选择班级-'}],
            }

            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;
            //分页获取班级流量明细列表【页面82】
            $scope.GetClassData = {
                LiveChannel:1,//1:校园直播，2学科课程，3心理课程，4.营养课程
                PtnID:$stateParams.PtnID,
                SchoolID:$stateParams.school,
                ClassID:undefined,//班级ID
                Year:new Date().getFullYear(),
                Month:new Date().getMonth()+1,
                Keyword:'',
            }
        },
        //初始化
        init: function () {
            this.variable();
            this.setting.pageIndex();//分页
            this.operation();
            this.serviceAPI.GetClassFlowDetlList();
            $(".dateTime").val($scope.model.hisYear +'年 - '+$scope.model.hisMonth+'月');
            console.log($stateParams)
        },
        //api服务
        serviceAPI: (function () {
            return {
                //分页获取班级流量明细列表【页面82】
                GetClassFlowDetlList: function () {
                    applicationServiceSet.liveService.officialBackground.GetClassFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.GetClassData.LiveChannel,
                        $scope.GetClassData.PtnID,
                        $scope.GetClassData.SchoolID,
                        $scope.GetClassData.ClassID,
                        $scope.model.hisYear,
                        $scope.model.hisMonth,
                        $scope.model.pIndex,
                        $scope.model.pSize,
                        $scope.model.SortFieldList,
                        $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0 && data.Data){
                            trafficClass.setting.dataChange(data.Data);
                        }
                    })
                },
                //GetSchoolList:function (key) {
                //    applicationServiceSet.liveService.officialBackground.GetSchoolList.send([APPMODEL.Storage.getItem('copPage_token'),key,0])
                //
                //        .then(function (data) {
                //            if(data.Ret==0){
                //                $scope.model.classList=[];
                //                for(var i =  0 ; i<data.Data.length;i++){
                //                    $scope.model.classList.push({id:data.Data[i].ID,name:data.Data[i].Name});
                //                }
                //            }
                //        });
                //},
            }
        })(),
        //设置
        setting:(function () {
            return {
                //数据操作
                dataChange: function (data,pIndex) {
                   // console.log(data)
                    $scope.model.itemList = data.ViewModelList;
                    //获取班级列表（?）
                    if($scope.model.itemList.length>0){
                      $scope.model.classList = [];
                        for(var j = 0;j < $scope.model.itemList.length;j++){
                            $scope.model.classList.push({id:$scope.model.itemList[j].ClassID,name:$scope.model.itemList[j].ClassName});
                        }
                    }
                    //获取序号列表
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
                            applicationServiceSet.liveService.officialBackground.GetClassFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.GetClassData.LiveChannel,
                                    $scope.GetClassData.PtnID,
                                    $scope.GetClassData.SchoolID,
                                    $scope.GetClassData.ClassID,
                                    $scope.model.hisYear,
                                    $scope.model.hisMonth,
                                    page.pIndex,
                                    $scope.model.pSize,
                                    $scope.model.SortFieldList,
                                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if (data.Ret == 0) {
                                        trafficClass.setting.dataChange(data.Data,page.pIndex)
                                    }
                                });

                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {

                            applicationServiceSet.liveService.officialBackground.GetClassFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.GetClassData.LiveChannel,
                                    $scope.GetClassData.PtnID,
                                    $scope.GetClassData.SchoolID,
                                    $scope.GetClassData.ClassID,
                                    $scope.model.hisYear,
                                    $scope.model.hisMonth,
                                    pageNext,
                                    $scope.model.pSize,
                                    $scope.model.SortFieldList,
                                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if (data.Ret == 0) {
                                        trafficClass.setting.dataChange(data.Data,pageNext)
                                    }
                                });

                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {

                            applicationServiceSet.liveService.officialBackground.GetClassFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.GetClassData.LiveChannel,
                                    $scope.GetClassData.PtnID,
                                    $scope.GetClassData.SchoolID,
                                    $scope.GetClassData.ClassID,
                                    $scope.model.hisYear,
                                    $scope.model.hisMonth,
                                    pageNext,
                                    $scope.model.pSize,
                                    $scope.model.SortFieldList,
                                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if (data.Ret == 0) {
                                        trafficClass.setting.dataChange(data.Data,pageNext)
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
                    $scope.GetClassData.Year = $scope.model.hisYear;
                    $scope.GetClassData.Month = $scope.model.hisMonth;
                    //接口调用
                    trafficClass.serviceAPI.GetClassFlowDetlList();
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
                trafficClass.serviceAPI.GetClassFlowDetlList();
            };
            //选择班级事件
            //$scope.refreshClassList = function (key) {
            //    if(!key){
            //        // toastr.error('请输入关键字');
            //        return false;
            //    }
            //    trafficClass.serviceAPI.GetSchoolList(key);
            //};
            //点击筛选
            $scope.clsSure = function () {
                trafficClass.serviceAPI.GetClassFlowDetlList();
            };
            //清除列表
            $scope.clsClear = function () {
                $scope.model.classList = [{id:undefined,name:'-请选择班级-'}];
                $scope.GetClassData.ClassID = undefined;
            };
            $scope.toUsers = function (cid,GName) {
                //年、月、学校ID 、班级ID、学校Name+班级Name
                $location.url('access/app/internal/UXLive/trafficUser?year='+$scope.model.hisYear+'&month='+$scope.model.hisMonth+'&schoolID='+$stateParams.school+'&classID='+cid+'&name='+$stateParams.name+GName+'&PtnID='+$stateParams.PtnID);
            }
        }
    }
    trafficClass.init();
}])