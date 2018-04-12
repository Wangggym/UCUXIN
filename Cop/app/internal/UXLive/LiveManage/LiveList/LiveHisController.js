/**
 * Created by Administrator on 2017/11/8.
 * list of live LiveListController
 */
app.controller('LiveHisController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    $scope.selectedList = [];
    $scope.checkedAllC = false;
    $scope.checkAll = function (ck) {
        $scope.selectedList = [];

            $scope.checkedAllC = ck;
            angular.forEach($scope.model.itemList, function (item) {
                if ($scope.checkedAllC) {
                    item.checked = true;
                    $scope.selectedList.push(item.ID);
                } else {
                    item.checked = false;
                }
            });

    };


    //往期回顾点击排序事件
    $scope.his_sort = function (type,check) {
        if(type == 1 && check){
            $scope.liveHisList.SortFieldList = [{SortField:"PraiseCnt",IsAsc:true}];
            LiveHisController.serviceAPI.CopLiveHisList();
            $("#PraiseCntHis span").html("降");
            $("#PraiseCntHis").addClass("sortActive").siblings("button").removeClass("sortActive");
            $scope.model.PraiseCnt = false
            $scope.model.CmtCnt = $scope.model.ShareCnt = $scope.model.FavCnt = true;
            $("#CmtCntHis span,#ShareCntHis span,#FavCntHis span").html("升");
        }else if(type == 1 && !check){
            $scope.liveHisList.SortFieldList = [{SortField:"PraiseCnt",IsAsc:false}];
            LiveHisController.serviceAPI.CopLiveHisList();
            $("#PraiseCntHis span").html("升");
            $("#PraiseCntHis").removeClass("sortActive");
            $scope.model.PraiseCnt = true
        }
        if(type == 2 && check){
            $scope.liveHisList.SortFieldList = [{SortField:"CmtCnt",IsAsc:true}]
            LiveHisController.serviceAPI.CopLiveHisList();
            $("#CmtCntHis span").html("降");
            $("#CmtCntHis").addClass("sortActive").siblings("button").removeClass("sortActive");
            $scope.model.CmtCnt = false
            $scope.model.PraiseCnt = $scope.model.ShareCnt = $scope.model.FavCnt = true;
            $("#PraiseCntHis span,#ShareCntHis span,#FavCntHis span").html("升");
        }else if(type == 2 && !check){
            $scope.liveHisList.SortFieldList = [{SortField:"CmtCnt",IsAsc:false}]
            LiveHisController.serviceAPI.CopLiveHisList();
            $("#CmtCntHis span").html("升");
            $("#CmtCntHis").removeClass("sortActive");
            $scope.model.CmtCnt = true
        }
        if(type == 3 && check){
            $scope.liveHisList.SortFieldList = [{SortField:"ShareCnt",IsAsc:true}]
            LiveHisController.serviceAPI.CopLiveHisList();
            $("#ShareCntHis span").html("降");
            $("#ShareCntHis").addClass("sortActive").siblings("button").removeClass("sortActive");
            $scope.model.ShareCnt = false
            $scope.model.CmtCnt = $scope.model.PraiseCnt = $scope.model.FavCnt = true;
            $("#CmtCntHis span,#PraiseCntHis span,#FavCntHis span").html("升");
        }else if(type == 3 && !check){
            $scope.liveHisList.SortFieldList = [{SortField:"ShareCnt",IsAsc:false}]
            LiveHisController.serviceAPI.CopLiveHisList();
            $("#ShareCntHis span").html("升");
            $("#ShareCntHis").removeClass("sortActive");
            $scope.model.ShareCnt = true
        }
        if(type == 4 && check){
            $scope.liveHisList.SortFieldList = [{SortField:"FavCnt",IsAsc:true}]
            LiveHisController.serviceAPI.CopLiveHisList();
            $("#FavCntHis span").html("降");
            $("#FavCntHis").addClass("sortActive").siblings("button").removeClass("sortActive");
            $scope.model.FavCnt = false
            $scope.model.CmtCnt = $scope.model.ShareCnt = $scope.model.PraiseCnt = true;
            $("#CmtCntHis span,#ShareCntHis span,#PraiseCntHis span").html("升");
        }else if(type == 4 && !check){
            $scope.liveHisList.SortFieldList = [{SortField:"FavCnt",IsAsc:false}]
            LiveHisController.serviceAPI.CopLiveHisList();
            $("#FavCntHis span").html("升");
            $("#FavCntHis").removeClass("sortActive");
            $scope.model.FavCnt = true
        }
    };
    //搜索事件
    $scope.searchLive = function () {
       LiveHisController.serviceAPI.CopLiveHisList()
    };
    //选定机构
    $scope.orgSearch = function (slcOrg) {
        $scope.liveHisList.GTypeID = slcOrg;
        applicationServiceSet.liveService.officialBackground.CopLiveHisList.send([APPMODEL.Storage.getItem('copPage_token'),
            $scope.liveHisList.GTypeID,
            $scope.liveHisList.Status,
            $scope.liveHisList.Keyword,
            $scope.model.LiveHisStartDate,
            $scope.model.LiveHisEndDate,
            $scope.model.dateStart,
            $scope.model.dateEnd,
            $scope.liveHisList.PageIndex,
            $scope.liveHisList.PageSize,
            $scope.liveHisList.SortFieldList,
            $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
            if(data.Ret == 0 && data.Data){
                LiveHisController.setting.liveHisDataChange(data.Data);
            }
        })

    };
    //选定状态
    $scope.statusSlc = function (slcSta) {
            $scope.liveHisList.Status = slcSta;
            applicationServiceSet.liveService.officialBackground.CopLiveHisList.send([APPMODEL.Storage.getItem('copPage_token'),
                $scope.liveHisList.GTypeID,
                slcSta,
                $scope.liveHisList.Keyword,
                $scope.model.LiveHisStartDate,
                $scope.model.LiveHisEndDate,
                $scope.model.dateStart,
                $scope.model.dateEnd,
                $scope.liveHisList.PageIndex,
                $scope.liveHisList.PageSize,
                $scope.liveHisList.SortFieldList,
                $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                if(data.Ret == 0 && data.Data){
                    LiveHisController.setting.liveHisDataChange(data.Data);
                }
            })

    };
    //日期选定
    $scope.dateSearch = function () {
        //开始时间和结束时间
        $scope.model.dateStart =  new Date($scope.sDate);
        $scope.model.dateEnd = new Date($scope.eDate);
        $scope.model.dateStart = $scope.model.dateStart.getFullYear()+ '-' + ($scope.model.dateStart.getMonth() + 1) + '-' + $scope.model.dateStart.getDate();
        $scope.model.dateEnd = $scope.model.dateEnd.getFullYear()+ '-' + ($scope.model.dateEnd.getMonth() + 1) + '-' + $scope.model.dateEnd.getDate();
        //直播开始时间和结束时间
        $scope.model.LiveHisStartDate =  new Date($scope.liveDate);
        $scope.model.LiveHisEndDate = new Date($scope.livedDate);
        $scope.model.LiveHisStartDate = $scope.model.LiveHisStartDate.getFullYear()+ '-' + ($scope.model.LiveHisStartDate.getMonth() + 1) + '-' + $scope.model.LiveHisStartDate.getDate();
        $scope.model.LiveHisEndDate = $scope.model.LiveHisEndDate.getFullYear()+ '-' + ($scope.model.LiveHisEndDate.getMonth() + 1) + '-' + $scope.model.LiveHisEndDate.getDate();
            //接口调用
            applicationServiceSet.liveService.officialBackground.CopLiveHisList.send([APPMODEL.Storage.getItem('copPage_token'),
                $scope.liveHisList.GTypeID,
                $scope.liveHisList.Status,
                $scope.liveHisList.Keyword,
                $scope.model.LiveHisStartDate,
                $scope.model.LiveHisEndDate,
                $scope.model.dateStart,
                $scope.model.dateEnd,
                $scope.liveHisList.PageIndex,
                $scope.liveHisList.PageSize,
                $scope.liveHisList.SortFieldList,
                $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                if(data.Ret == 0 && data.Data){
                    LiveHisController.setting.liveHisDataChange(data.Data);
                }
            })

    }

    $scope.checkedSingle = function (checked, id) {
        if (checked) {
            $scope.selectedList.push(id);
            if ($scope.selectedList.length === $scope.liveHisList.itemList.length) {
                $scope.checkedAllC = true;
            }

        } else {
            $scope.checkedAllC = false;
            $scope.selectedList.splice($scope.selectedList.indexOf(id), 1);
        }
    };

    //禁播 or  解禁
    $scope.Forbid = function (isForbid,item) {
        LiveHisController.serviceAPI.Forbid(isForbid,[item.LiveID],function () {
            if(isForbid){
                item.Status=-1;
                item.StatusName="禁播";
            }
            else{
                item.Status=0;
                item.StatusName="解禁";
            }
        });
    }

    //禁播 or  解禁
    $scope.ForbidAll = function (isForbid) {
        var ids=[];
        var ni = {}
        for (var i = 0; i < $scope.model.itemList.length; i++) {
            ni = $scope.model.itemList[i];
            if (ni.checked) {
                ids.push(ni.LiveID);
                if(isForbid){
                    $scope.model.itemList[i].Status = -1;
                }else{
                    $scope.model.itemList[i].Status = 0;
                }
                ni.checked = false
            }
        }
        if(ids.length==0){
            toastr.error('请选择直播记录');
            return false;
        }

        LiveHisController.serviceAPI.Forbid(isForbid,ids,function () {
            //LiveHisController.serviceAPI.CopLiveHisList();
            $(".checkAll").removeAttr("checked");
        });

    }

    var  LiveHisController={

        //变量
        variable: function () {

            //往期回顾
            $scope.liveHisList = {
                GTypeID:undefined,//机构类型ID
                Status:undefined,//直播状态-->0：正常 -1：禁播
                LiveHisStartDate:$scope.liveDate,//直播开始时间
                LiveHisEndDate:$scope.livedDate,//直播结束时间
                Keyword:'',//关键字：直播名称、发布员
                LiveStartDate:$scope.sDate,//发布开始时间
                LiveEndDate:$scope.eDate,//发布结束时间
                PageIndex:1,//页码
                PageSize:20,//页容量
                SortFieldList:[],//排序字段合集
                itemList:[],//获取返回数据
            }
            $scope.selectedList = [];
            //测试数据变量
            $scope.IsMoke = false;
            //全局
            $scope.model={
                PageSize: 20,
                PageIndex: 1,
                activeType:1,
                orgLists:[{id:undefined,name:'全部'},{id:11,name:"学校"},{id:21,name:"公司"}],
                Status:[{id:undefined,name:'全部'},{id:0,name:"正常"},{id:-1,name:"已禁播"} ],
                dateStart:$scope.sDate,//发布开始时间
                dateEnd:$scope.eDate,//发布结束时间
                LiveHisStartDate:$scope.liveDate,//直播开始时间
                LiveHisEndDate:$scope.livedDate,//直播开始时间
                itemList:[],
                PraiseCnt:true,
                CmtCnt:true,
                ShareCnt:true,
                FavCnt:true,
            }
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;
        },
        //初始化
        init:function () {
            this.events.dateSet();
            this.variable();
            this.serviceAPI.pageIndex();//分页服务
            this.serviceAPI.CopLiveHisList();//初始加载直播预告
        },

        //API 服务
        serviceAPI:(function () {
            return{
                //分页获取往期回顾的直播列表
                CopLiveHisList: function () {
                    applicationServiceSet.liveService.officialBackground.CopLiveHisList.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.liveHisList.GTypeID,
                        $scope.liveHisList.Status,
                        $scope.liveHisList.Keyword,
                        $scope.model.LiveHisStartDate,
                        $scope.model.LiveHisEndDate,
                        $scope.model.dateStart,
                        $scope.model.dateEnd,
                        $scope.liveHisList.PageIndex,
                        $scope.liveHisList.PageSize,
                        $scope.liveHisList.SortFieldList,
                        $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0 && data.Data){
                            //$scope.liveHisList.itemList = data.Data.ViewModelList;
                            //console.log($scope.liveHisList.itemList)
                            LiveHisController.setting.liveHisDataChange(data.Data);
                        }
                    })
                },

                //禁播或解禁
                Forbid: function (isForbid,ids,call) {
                    applicationServiceSet.liveService.officialBackground.Forbid.send([ids],[APPMODEL.Storage.getItem('copPage_token'),isForbid,$scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0 ){
                            if(call) call();
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
                            //往期回顾 分页显示

                            applicationServiceSet.liveService.officialBackground.CopLiveHisList.send([APPMODEL.Storage.getItem('copPage_token'),
                                $scope.liveHisList.GTypeID,
                                $scope.liveHisList.Status,
                                $scope.liveHisList.Keyword,
                                $scope.model.LiveHisStartDate,
                                $scope.model.LiveHisEndDate,
                                $scope.model.dateStart,
                                $scope.model.dateEnd,
                                page.pIndex,
                                $scope.liveHisList.PageSize,
                                $scope.liveHisList.SortFieldList,
                                $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                .then(function (data) {
                                    if(data.Ret==0){
                                        LiveHisController.setting.liveHisDataChange(data.Data);
                                        $(".checkAll").removeAttr("checked");
                                    }
                                });

                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            //往期回顾 分页显示
                            applicationServiceSet.liveService.officialBackground.CopLiveHisList.send([APPMODEL.Storage.getItem('copPage_token'),
                                $scope.liveHisList.GTypeID,
                                $scope.liveHisList.Status,
                                $scope.liveHisList.Keyword,
                                $scope.model.LiveHisStartDate,
                                $scope.model.LiveHisEndDate,
                                $scope.model.dateStart,
                                $scope.model.dateEnd,
                                pageNext,
                                $scope.liveHisList.PageSize,
                                $scope.liveHisList.SortFieldList,
                                $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                .then(function (data) {
                                    if(data.Ret==0){

                                        LiveHisController.setting.liveHisDataChange(data.Data)
                                        $(".checkAll").removeAttr("checked");
                                    }
                                });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            //往期回顾 分页显示
                            applicationServiceSet.liveService.officialBackground.CopLiveHisList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.liveHisList.GTypeID,
                                    $scope.liveHisList.Status,
                                    $scope.liveHisList.Keyword,
                                    $scope.model.LiveHisStartDate,
                                    $scope.model.LiveHisEndDate,
                                    $scope.model.dateStart,
                                    $scope.model.dateEnd,
                                    pageNext,
                                    $scope.liveHisList.PageSize,
                                    $scope.liveHisList.SortFieldList,
                                    $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                .then(function (data) {
                                    if(data.Ret==0){

                                        LiveHisController.setting.liveHisDataChange(data.Data)
                                        $(".checkAll").removeAttr("checked");
                                    }
                                });

                        }
                    };
                },


            }
        })(),

        //数据处理与设定
        setting:(function () {
            return {

                //数据处理与设定

                liveHisDataChange: function (data) {
                    $scope.model.itemList = data.ViewModelList;
                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
                }
            }
        })(),
        //事件
        events:(function () {
            return{
                //配置时间开始------------
                dateSet : function () {
                    $scope.clear = function () {
                        $scope.sDate = null;
                        $scope.eDate = null;
                       $scope.liveDate = null;
                       $scope.livedDate = null;
                    };
                    var date = new Date();
                    var sDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + 1;
                    var liveDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + 1;
                    var nowDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                    $scope.sDate = sDate;
                    $scope.liveDate = liveDate;
                    $scope.eDate = nowDate;
                    $scope.livedDate = nowDate;
                    $scope.minDate = $scope.minDate ? null : new Date();
                    //按直播时间
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
                    //按发布时间
                    $scope.openLiveDate = function ($event) {
                        $scope.endLive = false;
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.openLivedStart = true;
                    };

                    $scope.openLivedDate = function ($event) {
                        $scope.openLivedStart = false;
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.endLive = true;
                    };
                    $scope.dateOptions = {
                        formatYear: 'yy',
                        startingDay: 1,
                        class: 'datepicker'
                    };
                    $scope.format = 'yyyy/MM/dd';
                }
                //配置時間結束----------
            }
        })(),

    };
    LiveHisController.init();

}]);