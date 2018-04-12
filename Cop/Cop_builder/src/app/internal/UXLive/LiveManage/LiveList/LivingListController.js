/**
 * Created by Administrator on 2017/11/8.
 * list of live LiveListController
 */
app.controller('LivingListController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    $scope.selectedList = [];
    $scope.checkedAllB = false;
    $scope.checkAll = function (ck) {
        $scope.selectedList = [];


            $scope.checkedAllB = ck;
            angular.forEach($scope.model.itemList, function (item) {
                if ($scope.checkedAllB) {
                    item.checked = true;
                    $scope.selectedList.push(item.ID);
                } else {
                    item.checked = false;
                }
            });

    };


    //直播中点击排序事件
    $scope.living_sort = function (type,check) {
        if(type == 1 && check){
            $scope.livingList.SortFieldList = [{SortField:"PraiseCnt",IsAsc:true}];
            LivingListController.serviceAPI.GetLiveIngList();
            $("#PraiseCntLiving span").html("降");
            $("#PraiseCntLiving").addClass("sortActive").siblings("button").removeClass("sortActive");
            $scope.model.PraiseCnt = false
            $scope.model.CmtCnt = $scope.model.ShareCnt = $scope.model.FavCnt = true;
            $("#CmtCntLiving span,#ShareCntLiving span,#FavCntLiving span").html("升");
        }else if(type == 1 && !check){
            $scope.livingList.SortFieldList = [{SortField:"PraiseCnt",IsAsc:false}];
            LivingListController.serviceAPI.GetLiveIngList();
            $("#PraiseCntLiving span").html("升");
            $("#PraiseCntLiving").removeClass("sortActive");
            $scope.model.PraiseCnt = true
        }
        if(type == 2 && check){
            $scope.livingList.SortFieldList = [{SortField:"CmtCnt",IsAsc:true}];
            LivingListController.serviceAPI.GetLiveIngList();
            $("#CmtCntLiving span").html("降");
            $("#CmtCntLiving").addClass("sortActive").siblings("button").removeClass("sortActive");
            $scope.model.CmtCnt = false
            $scope.model.PraiseCnt = $scope.model.ShareCnt = $scope.model.FavCnt = true;
            $("#PraiseCntLiving span,#ShareCntLiving span,#FavCntLiving span").html("升");
        }else if(type == 2 && !check){
            $scope.livingList.SortFieldList = [{SortField:"CmtCnt",IsAsc:false}];
            LivingListController.serviceAPI.GetLiveIngList();
            $("#CmtCntLiving span").html("升");
            $("#CmtCntLiving").removeClass("sortActive");
            $scope.model.CmtCnt = true
        }
        if(type == 3 && check){
            $scope.livingList.SortFieldList = [{SortField:"ShareCnt",IsAsc:true}];
            LivingListController.serviceAPI.GetLiveIngList();
            $("#ShareCntLiving span").html("降");
            $("#ShareCntLiving").addClass("sortActive").siblings("button").removeClass("sortActive");
            $scope.model.ShareCnt = false
            $scope.model.CmtCnt = $scope.model.PraiseCnt = $scope.model.FavCnt = true;
            $("#PraiseCntLiving span,#CmtCntLiving span,#FavCntLiving span").html("升");
        }else if(type == 3 && !check){
            $scope.livingList.SortFieldList = [{SortField:"ShareCnt",IsAsc:false}];
            LivingListController.serviceAPI.GetLiveIngList();
            $("#ShareCntLiving span").html("升");
            $("#ShareCntLiving").removeClass("sortActive");
            $scope.model.ShareCnt = true
        }
        if(type == 4 && check){
            $scope.livingList.SortFieldList = [{SortField:"FavCnt",IsAsc:true}];
            LivingListController.serviceAPI.GetLiveIngList();
            $("#FavCntLiving span").html("降");
            $("#FavCntLiving").addClass("sortActive").siblings("button").removeClass("sortActive");
            $scope.model.FavCnt = false
            $scope.model.CmtCnt = $scope.model.ShareCnt = $scope.model.PraiseCnt = true;
            $("#PraiseCntLiving span,#CmtCntLiving span,#ShareCntLiving span").html("升");
        }else if(type == 4 && !check){
            $scope.livingList.SortFieldList = [{SortField:"FavCnt",IsAsc:false}];
            LivingListController.serviceAPI.GetLiveIngList();
            $("#FavCntLiving span").html("升");
            $("#FavCntLiving").removeClass("sortActive");
            $scope.model.FavCnt = true
        }

    };
    //搜索事件
    $scope.searchLive = function () {
        LivingListController.serviceAPI.GetLiveIngList();
    };
    //选定机构
    $scope.orgSearch = function (slcOrg) {
            $scope.livingList.GTypeID = slcOrg;
            applicationServiceSet.liveService.officialBackground.GetLiveIngList.send([APPMODEL.Storage.getItem('copPage_token'),
                $scope.livingList.GTypeID,
                $scope.livingList.Status,
                $scope.livingList.Keyword,
                $scope.model.dateStart,
                $scope.model.dateEnd,
                $scope.model.LiveStartDate,
                $scope.model.LiveEndDate,
                $scope.livingList.PageIndex,
                $scope.livingList.PageSize,
                $scope.livingList.SortFieldList,
                $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                if(data.Ret == 0 && data.Data){
                    LivingListController.setting.livingDataChange(data.Data);
                }
            })


    };
    //选定状态
    $scope.statusSlc = function (slcSta) {
            $scope.livingList.Status = slcSta;
            applicationServiceSet.liveService.officialBackground.GetLiveIngList.send([APPMODEL.Storage.getItem('copPage_token'),
                $scope.livingList.GTypeID,
                $scope.livingList.Status,
                $scope.livingList.Keyword,
                $scope.model.dateStart,
                $scope.model.dateEnd,
                $scope.model.LiveStartDate,
                $scope.model.LiveEndDate,
                $scope.livingList.PageIndex,
                $scope.livingList.PageSize,
                $scope.livingList.SortFieldList,
                $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                if(data.Ret == 0 && data.Data){
                    LivingListController.setting.livingDataChange(data.Data);
                }
            })


    };
    //日期选定
    $scope.dateSearch = function () {
        //发布开始时间和结束时间
        $scope.model.dateStart =  new Date($scope.sDate);
        $scope.model.dateEnd = new Date($scope.eDate);
        $scope.model.dateStart = $scope.model.dateStart.getFullYear()+ '-' + ($scope.model.dateStart.getMonth() + 1) + '-' + $scope.model.dateStart.getDate();
        $scope.model.dateEnd = $scope.model.dateEnd.getFullYear()+ '-' + ($scope.model.dateEnd.getMonth() + 1) + '-' + $scope.model.dateEnd.getDate();
        //直播开始时间和结束时间
        $scope.model.LiveStartDate =  new Date($scope.liveDate);
        $scope.model.LiveEndDate = new Date($scope.livedDate);
        $scope.model.LiveStartDate = $scope.model.LiveStartDate.getFullYear()+ '-' + ($scope.model.LiveStartDate.getMonth() + 1) + '-' + $scope.model.LiveStartDate.getDate();
        $scope.model.LiveEndDate = $scope.model.LiveEndDate.getFullYear()+ '-' + ($scope.model.LiveEndDate.getMonth() + 1) + '-' + $scope.model.LiveEndDate.getDate();
            //接口调用
            applicationServiceSet.liveService.officialBackground.GetLiveIngList.send([APPMODEL.Storage.getItem('copPage_token'),
                $scope.livingList.GTypeID,
                $scope.livingList.Status,
                $scope.livingList.Keyword,
                $scope.model.dateStart,
                $scope.model.dateEnd,
                $scope.model.LiveStartDate,
                $scope.model.LiveEndDate,
                $scope.livingList.PageIndex,
                $scope.livingList.PageSize,
                $scope.livingList.SortFieldList,
                $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                if(data.Ret == 0 && data.Data){
                    LivingListController.setting.livingDataChange(data.Data);
                }
            })
    }

    $scope.checkedSingle = function (checked, id) {
        if (checked) {
            $scope.selectedList.push(id);

                if ($scope.selectedList.length === $scope.livingList.itemList.length) {
                    $scope.checkedAllB = true;
                }


        } else {
            $scope.checkedAllB = false;
            $scope.selectedList.splice($scope.selectedList.indexOf(id), 1);
        }
    };

    //禁播 or  解禁
    $scope.Forbid = function (isForbid,item) {
        LivingListController.serviceAPI.Forbid(isForbid,[item.LiveID],function () {
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
            LivingListController.serviceAPI.Forbid(isForbid,ids,function () {
                $(".checkAll").removeAttr("checked");
            });

    }


    var  LivingListController={

        //变量
        variable: function () {

            //直播中
            $scope.livingList = {
                GTypeID:undefined,//机构类型ID
                Status:undefined,//直播状态-->0：正常 -1：禁播
                Keyword:[],//关键字：直播名称、发布员
                PubStartDate:$scope.sDate,//发布开始时间
                PubEndDate:$scope.eDate,//发布结束时间
                LiveStartDate:$scope.liveDate,//直播开始时间
                LiveEndDate:$scope.livedDate,//直播结束时间
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
                LiveStartDate:$scope.liveDate,//直播开始时间
                LiveEndDate:$scope.livedDate,//直播开始时间
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
            this.serviceAPI.GetLiveIngList();//初始加载直播预告

        },

        //API 服务
        serviceAPI:(function () {
            return{

                //分页获取直播进行中数据列表
                GetLiveIngList: function () {
                    applicationServiceSet.liveService.officialBackground.GetLiveIngList.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.livingList.GTypeID,
                        $scope.livingList.Status,
                        $scope.livingList.Keyword,
                        $scope.model.dateStart,
                        $scope.model.dateEnd,
                        $scope.model.LiveStartDate,
                        $scope.model.LiveEndDate,
                        $scope.livingList.PageIndex,
                        $scope.livingList.PageSize,
                        $scope.livingList.SortFieldList,
                        $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
                        if(data.Ret == 0 && data.Data){
                            LivingListController.setting.livingDataChange(data.Data);
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
                            //直播中 分页显示
                            applicationServiceSet.liveService.officialBackground.GetLiveIngList.send([APPMODEL.Storage.getItem('copPage_token'),
                                $scope.livingList.GTypeID,
                                $scope.livingList.Status,
                                $scope.livingList.Keyword,
                                $scope.model.dateStart,
                                $scope.model.dateEnd,
                                $scope.model.LiveStartDate,
                                $scope.model.LiveEndDate,
                                page.pIndex,
                                $scope.livingList.PageSize,
                                $scope.livingList.SortFieldList,
                                $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                .then(function (data) {
                                    if(data.Ret==0){

                                        LivingListController.setting.livingDataChange(data.Data)
                                        $(".checkAll").removeAttr("checked");
                                    }
                                });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {

                            //直播中 分页显示
                            applicationServiceSet.liveService.officialBackground.GetLiveIngList.send([APPMODEL.Storage.getItem('copPage_token'),
                                $scope.livingList.GTypeID,
                                $scope.livingList.Status,
                                $scope.livingList.Keyword,
                                $scope.model.dateStart,
                                $scope.model.dateEnd,
                                $scope.model.LiveStartDate,
                                $scope.model.LiveEndDate,
                                pageNext,
                                $scope.livingList.PageSize,
                                $scope.livingList.SortFieldList,
                                $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                .then(function (data) {
                                    if(data.Ret==0){

                                        LivingListController.setting.livingDataChange(data.Data)
                                        $(".checkAll").removeAttr("checked");
                                    }
                                });

                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            //直播中 分页显示
                            applicationServiceSet.liveService.officialBackground.GetLiveIngList.send([APPMODEL.Storage.getItem('copPage_token'),
                                $scope.livingList.GTypeID,
                                $scope.livingList.Status,
                                $scope.livingList.Keyword,
                                $scope.model.dateStart,
                                $scope.model.dateEnd,
                                $scope.model.LiveStartDate,
                                $scope.model.LiveEndDate,
                                pageNext,
                                $scope.livingList.PageSize,
                                $scope.livingList.SortFieldList,
                                $scope.IsMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                .then(function (data) {
                                    if(data.Ret==0){

                                        LivingListController.setting.livingDataChange(data.Data)
                                        $(".tab-content .active .checkAll").removeAttr("checked");
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

                livingDataChange: function (data) {
                    $scope.model.itemList = data.ViewModelList;
                    //console.log($scope.livingList.itemList);
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
                    //按发布时间
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
                    //按直播时间
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
    LivingListController.init();

}]);