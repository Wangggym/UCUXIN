/**
 * Created by lqw on 2017/11/15.
 */
app.controller('ReleaseRecordListController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {

     // --- 表格全选功能 开始 --------------------------------------------------
    $scope.selectedList = [];
    $scope.checkedAll = false;
    $scope.checkAll = function () {
        $scope.selectedList = [];
        angular.forEach($scope.model.itemList, function (item) {
            if ($scope.checkedAll) {
                item.checked = true;
                $scope.selectedList.push(item.LiveID);
            } else {
                item.checked = false;
            }
        });
    };
    $scope.checkedSingle = function (checked, id) {
        if (checked) {
            $scope.selectedList.push(id);
            if ($scope.selectedList.length === $scope.model.itemList.length) {
                $scope.checkedAll = true;
            }
        } else {
            $scope.checkedAll = false;
            $scope.selectedList.splice($scope.selectedList.indexOf(id), 1);
        }
    };

    // --- 表格全选功能 结束 --------------------------------------------------





    var  releaseRecordList={
        //初始化
        init:function () {
            this.variable();
            this.serviceApi.pageIndex();//分页服务
            this.operation();//操作

            setTimeout(function () {

                releaseRecordList.serviceApi.GetPubMbrLiveNav();
            },500);
        },
        //变量
        variable:function () {

            $scope.model={
                itemList:[],
                uid:$stateParams.userID,
                Title:$stateParams.Name,
                pSize: 20,
                pIndex: 1,
                gTypeID:undefined,
                orgLists:[{id:undefined,name:'全部'},{id:11,name:"学校"},{id:21,name:"公司"}],
                Status:[{id:undefined,name:'全部'},{id:0,name:"正常"},{id:-1,name:"已禁播"} ],
                s_state:undefined,
                keyword:undefined,
                pubStartDate:undefined,
                pubEndDate:undefined,
                sortFieldList:[],
                isMoke:false,

            }
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;



            $scope.model.isPraiseCnt = true;
            $scope.model.isCmtCnt = true;
            $scope.model.isShareCnt = true;
            $scope.model.isFavCnt = true;

            //初始化时间
            $scope.loadDate=function () {
                //配置时间开始------------

                var date = new Date();
                var nowDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                $scope.model.pubStartDate =date.getFullYear() + "/" + (date.getMonth() + 1) + "/1" ;
                $scope.model.pubEndDate = nowDate;
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
                //配置時間結束----------
            }



            $scope.loadDate();

        },

        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                //获取直播员列表
                GetPubMbrLiveNav:function () {
                    applicationServiceSet.liveService.officialBackground.GetPubMbrLiveNav.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.model.uid, $scope.model.gTypeID,  $scope.model.s_state,$scope.model.keyword,$scope.model.pubStartDate,$scope.model.pubEndDate,
                        $scope.model.pIndex,
                        $scope.model.pSize,$scope.model.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                        .then(function (data) {
                            if(data.Ret==0){
                                releaseRecordList.setting.DataChange(data.Data)
                            }
                        });
                },

                //禁播或解禁
                Forbid: function (isForbid,ids,call) {
                    applicationServiceSet.liveService.officialBackground.Forbid.send([ids],[APPMODEL.Storage.getItem('copPage_token'),isForbid,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
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
                            applicationServiceSet.liveService.officialBackground.GetPubMbrLiveNav.send([APPMODEL.Storage.getItem('copPage_token'),
                                $scope.model.uid, $scope.model.gTypeID,  $scope.model.s_state,$scope.model.keyword,$scope.model.pubStartDate,$scope.model.pubEndDate,
                                page.pIndex,
                                $scope.model.pSize,$scope.model.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if(data.Ret==0){
                                        releaseRecordList.setting.DataChange(data.Data)
                                    }
                                });

                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.liveService.officialBackground.GetPubMbrLiveNav.send([APPMODEL.Storage.getItem('copPage_token'),
                                $scope.model.uid,  $scope.model.gTypeID,  $scope.model.s_state,$scope.model.keyword,$scope.model.pubStartDate,$scope.model.pubEndDate,
                                pageNext,
                                $scope.model.pSize,$scope.model.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if(data.Ret==0){
                                        releaseRecordList.setting.DataChange(data.Data)
                                    }
                                });

                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {

                            applicationServiceSet.liveService.officialBackground.GetPubMbrLiveNav.send([APPMODEL.Storage.getItem('copPage_token'),
                                $scope.model.uid, $scope.model.gTypeID,  $scope.model.s_state,$scope.model.keyword,$scope.model.pubStartDate,$scope.model.pubEndDate,
                                pageNext,
                                $scope.model.pSize,$scope.model.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if(data.Ret==0){
                                        releaseRecordList.setting.DataChange(data.Data)
                                    }
                                });
                        }
                    };
                }
            };
        })(),
        /**
         * 操作
         */
        operation:function () {

            //查找
            $scope.btnSearch=function () {

                var date = new Date();
                var nowDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                var sdate=date.getFullYear() + "/" + (date.getMonth() + 1) + "-1" ;


                $scope.model.pubStartDate =  $scope.model.pubStartDate?dateFormat($scope.model.pubStartDate):sdate;
                $scope.model.pubEndDate =  $scope.model.pubEndDate?dateFormat($scope.model.pubEndDate):nowDate;
                function  dateFormat(date) {
                    var df = new Date(date);
                    return  df.getFullYear()+ '/' + (df.getMonth() + 1) + '/' + df.getDate();
                }


                releaseRecordList.serviceApi.GetPubMbrLiveNav();
                $scope.checkedAll=false;
            }
            //排序
            $scope.pre_sort = function (type) {



                if(type == 1){
                    if($scope.model.isPraiseCnt){
                        $('#isPraiseCnt').addClass('sortActive')
                        $('#isCmtCnt,#isShareCnt,#isFavCnt').removeClass('sortActive')
                    }
                    else {
                        $('#isPraiseCnt').removeClass('sortActive')
                    }
                    $scope.model.sortFieldList = [{SortField:"PraiseCnt",IsAsc:$scope.model.isPraiseCnt}];
                    $scope.model.isPraiseCnt = !$scope.model.isPraiseCnt;
                    $scope.model.isCmtCnt = $scope.model.isShareCnt = $scope.model.isFavCnt=true;

                }
                else if(type == 2){
                    if($scope.model.isCmtCnt){
                        $('#isCmtCnt').addClass('sortActive')
                        $('#isPraiseCnt,#isShareCnt,#isFavCnt').removeClass('sortActive')
                    }
                    else {
                        $('#isCmtCnt').removeClass('sortActive')
                    }
                    $scope.model.sortFieldList = [{SortField:"CmtCnt",IsAsc:$scope.model.isCmtCnt}]
                    $scope.model.isCmtCnt = !$scope.model.isCmtCnt;
                    $scope.model.isPraiseCnt = $scope.model.isShareCnt = $scope.model.isFavCnt =true;

                }
                else if(type == 3){
                    if($scope.model.isShareCnt){
                        $('#isShareCnt').addClass('sortActive')
                        $('#isPraiseCnt,#isFavCnt,#isCmtCnt').removeClass('sortActive')
                    }
                    else {
                        $('#isShareCnt').removeClass('sortActive')
                    }
                    $scope.model.sortFieldList = [{SortField:"ShareCnt",IsAsc:$scope.model.isShareCnt}]
                    $scope.model.isShareCnt = !$scope.model.isShareCnt;
                    $scope.model.isCmtCnt = $scope.model.isFavCnt = $scope.model.isPraiseCnt=true;

                }else if(type == 4){
                    if($scope.model.isFavCnt){
                        $('#isFavCnt').addClass('sortActive')
                        $('#isPraiseCnt,#isShareCnt,#isCmtCnt').removeClass('sortActive')
                    }
                    else {
                        $('#isFavCnt').removeClass('sortActive')
                    }
                    $scope.model.sortFieldList = [{SortField:"FavCnt",IsAsc:$scope.model.isFavCnt}]
                    $scope.model.isFavCnt = !$scope.model.isFavCnt;
                    $scope.model.isCmtCnt = $scope.model.isShareCnt =   $scope.model.isPraiseCnt=true;

                }

                releaseRecordList.serviceApi.GetPubMbrLiveNav();
            };


            //禁播 or  解禁
            $scope.Forbid = function (isForbid,item) {

                releaseRecordList.serviceApi.Forbid(isForbid,[item.LiveID],function () {
                    if(isForbid){
                        item.Status=-1;
                        item.StatusName="禁播";
                    }
                    else{
                        item.Status=0;
                        item.StatusName="正常";
                    }
                });
            }

            //禁播 or  解禁
            $scope.ForbidAll = function (isForbid) {

                var ids=[];
                for (var i = 0; i < $scope.model.itemList.length; i++) {
                    var ni = $scope.model.itemList[i];
                    if (ni.checked) {
                        ids.push(ni.LiveID)
                    }
                }


                if(ids.length==0){
                    toastr.error('请选择直播记录');
                    return false;
                }

                releaseRecordList.serviceApi.Forbid(isForbid,ids,function () {
                    releaseRecordList.serviceApi.GetPubMbrLiveNav();
                    $scope.checkedAll=false;
                });
            }


            //返回
            $scope.btnReturn = function () {
                history.back();
               // $location.url('access/app/internal/UXLive/pubUserList');
            }
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                //直播记录数据处理与设定
                DataChange:function (data) {

                    $scope.model .itemList = data.ViewModelList;

                    for(var i = 0 ; i< $scope.model.itemList.length; i++){
                        if($scope.model.itemList[i].Status ==0){
                            $scope.model.itemList[i].StatusName='正常';
                        }
                        if($scope.model.itemList[i].Status ==-1){
                            $scope.model.itemList[i].StatusName='禁播';
                        }


                    }

                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
                },

                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                },
            }


        })()



    };
    releaseRecordList.init();
}]);