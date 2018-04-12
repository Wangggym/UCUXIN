/**
 * Created by Administrator on 2017/11/28.
 */
app.controller('trafficSchool', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {

    //变量
    var trafficSchool = {
        //变量
        variable : function () {
            $scope.model={
                pSize: 20,
                pIndex: 1,
                IsMoke:true,
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
                itemList:[],
                grpList:[
                    {id:undefined,name:'-请选择-'}
                ],
                backYear:$stateParams.year,
                backMonth:$stateParams.month,
                hisYear:$stateParams.year,
                hisMonth:$stateParams.month,
            }
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;
            //分页获取学校流量明细列表
            $scope.GetSchoolData = {
                LiveChannel:1,//1:校园直播，2学科课程，3心理课程，4.营养课程
                PtnID:undefined,
                GID:undefined,
                Year:new Date().getFullYear(),
                Month:new Date().getMonth()+1,
                Keyword:'',//关键字：学校名称、负责人、账号

            }
        },
        //初始化
        init: function () {
            this.variable();
            this.setting.pageIndex();//分页操作
            this.serviceAPI.GetSchoolFlowDetlList();
            this.operation();
            $(".dateTime").val($scope.model.hisYear +'年 - '+$scope.model.hisMonth+'月');

        },
        //api服务
        serviceAPI:(function () {
            return {
                //分页获取学校流量明细列表
                GetSchoolFlowDetlList: function () {
                    applicationServiceSet.liveService.officialBackground.GetSchoolFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.GetSchoolData.LiveChannel,
                        $scope.GetSchoolData.PtnID,
                        $scope.GetSchoolData.GID,
                        $scope.GetSchoolData.Year,
                        $scope.GetSchoolData.Month,
                        $scope.model.pIndex,
                        $scope.model.pSize,
                        $scope.model.SortFieldList,
                        $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0){
                            trafficSchool.setting.dataChange(data.Data);
                        }
                    })
                },
                //获取学校/机构
                GetSchoolList:function (key) {
                    applicationServiceSet.liveService.officialBackground.GetSchoolList.send([APPMODEL.Storage.getItem('copPage_token'),key,0])

                        .then(function (data) {
                            if(data.Ret==0){
                                $scope.model.grpList=[];
                                for(var i =  0 ; i<data.Data.length;i++){
                                    $scope.model.grpList.push({id:data.Data[i].ID,name:data.Data[i].Name});
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
                    //console.log($scope.model.itemList);

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
                                applicationServiceSet.liveService.officialBackground.GetSchoolFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                        $scope.GetSchoolData.LiveChannel,
                                        $scope.GetSchoolData.PtnID,
                                        $scope.GetSchoolData.GID,
                                        $scope.GetSchoolData.Year,
                                        $scope.GetSchoolData.Month,
                                        page.pIndex,
                                        $scope.model.pSize,
                                        $scope.model.SortFieldList,
                                        $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                    .then(function (data) {
                                        if (data.Ret == 0) {
                                            trafficSchool.setting.dataChange(data.Data,page.pIndex)
                                        }
                                    });

                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {

                                applicationServiceSet.liveService.officialBackground.GetSchoolFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                        $scope.GetSchoolData.LiveChannel,
                                        $scope.GetSchoolData.PtnID,
                                        $scope.GetSchoolData.GID,
                                        $scope.GetSchoolData.Year,
                                        $scope.GetSchoolData.Month,
                                        pageNext,
                                        $scope.model.pSize,
                                        $scope.model.SortFieldList,
                                        $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                    .then(function (data) {
                                        if (data.Ret == 0) {
                                            trafficSchool.setting.dataChange(data.Data,pageNext)
                                        }
                                    });

                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {

                            applicationServiceSet.liveService.officialBackground.GetSchoolFlowDetlList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.GetSchoolData.LiveChannel,
                                    $scope.GetSchoolData.PtnID,
                                    $scope.GetSchoolData.GID,
                                    $scope.GetSchoolData.Year,
                                    $scope.GetSchoolData.Month,
                                    pageNext,
                                    $scope.model.pSize,
                                    $scope.model.SortFieldList,
                                    $scope.model.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if (data.Ret == 0) {

                                        trafficSchool.setting.dataChange(data.Data,pageNext)
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
                    $scope.GetSchoolData.Year = $scope.model.hisYear;
                    $scope.GetSchoolData.Month = $scope.model.hisMonth;
                    trafficSchool.serviceAPI.GetSchoolFlowDetlList();
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
            $scope.toClass = function (gid,GName) {
                 $location.url('access/app/internal/afterManage/trafficClass?year='+$scope.model.hisYear+'&month='+$scope.model.hisMonth+'&school='+gid+'&name='+GName);
            };
            //搜索框搜索事件
            $scope.searchGrp = function () {

                trafficSchool.serviceAPI.GetSchoolFlowDetlList();
            };
            //查找机构
            $scope.refreshGrpList = function (key) {
                if(!key){
                    // toastr.error('请输入关键字');
                    return false;
                }
                trafficSchool.serviceAPI.GetSchoolList(key);
            };
            //点击筛选
            $scope.grpSure = function () {
                trafficSchool.serviceAPI.GetSchoolFlowDetlList();
            };
            //清除列表
            $scope.grpClear = function () {
                $scope.model.grpList = [{id:undefined,name:'-请选择-'}];
                $scope.GetSchoolData.GID = undefined;
            };

        },
    }

    trafficSchool.init()
}])