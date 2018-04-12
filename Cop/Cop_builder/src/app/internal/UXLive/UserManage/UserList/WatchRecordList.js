/**
 * Created by lqw on 2017/11/15.
 */
app.controller('WatchRecordListController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {

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





    var  watchRecordList={
        //初始化
        init:function () {
            this.variable();
            this.serviceApi.pageIndex();//分页服务
            this.operation();//操作

            setTimeout(function () {

                watchRecordList.serviceApi.GetUserLiveNav();
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
                Year:undefined,
                Month:undefined,
                s_state:undefined,
                keyword:undefined,
                pubStartDate:undefined,
                pubEndDate:undefined,
                sortFieldList:[],
                YearList:[],
                MonthList:[
                    {id:1,name:'01'},
                    {id:2,name:'02'},
                    {id:3,name:'03'},
                    {id:4,name:'04'},
                    {id:5,name:'05'},
                    {id:6,name:'06'},
                    {id:7,name:'07'},
                    {id:8,name:'08'},
                    {id:9,name:'09'},
                    {id:10,name:'10'},
                    {id:11,name:'11'},
                    {id:12,name:'12'},
                ],
                isMoke:false,

            }
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;

            //初始化时间
            $scope.loadYear=function () {

                //配置时间开始------------
                 var dateNow=new Date();
                 var nowYear = dateNow.getFullYear();

                 for(var i = 0 ; i<7; i++)
                 {
                     var prevYear=nowYear-i;
                     $scope.model.YearList.push({id:(prevYear),name:(prevYear)})
                 }
                 $scope.model.Year= nowYear;
                 $scope.model.Month=dateNow.getMonth()+1;
            }



            $scope.loadYear();

            //当从用户流量明细跳转过来的时候
            if($stateParams.Year){
                $scope.model.Year=$stateParams.Year;
            }
            if($stateParams.Month){
                $scope.model.Month=$stateParams.Month;
            }
        },

        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                //获取直播员列表
                GetUserLiveNav:function () {
                    applicationServiceSet.liveService.officialBackground.GetUserLiveNav.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.model.uid,   $scope.model.Year,$scope.model.Month,
                        $scope.model.pIndex,
                        $scope.model.pSize,$scope.model.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                        .then(function (data) {

                            if(data.Ret==0){
                                watchRecordList.setting.DataChange(data.Data)
                            }
                        });
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
                            applicationServiceSet.liveService.officialBackground.GetUserLiveNav.send([APPMODEL.Storage.getItem('copPage_token'),
                                $scope.model.uid,   $scope.model.Year,$scope.model.Month,
                               page.pIndex,
                                $scope.model.pSize,$scope.model.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if(data.Ret==0){
                                        watchRecordList.setting.DataChange(data.Data)
                                    }
                                });

                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.liveService.officialBackground.GetUserLiveNav.send([APPMODEL.Storage.getItem('copPage_token'),
                                $scope.model.uid,   $scope.model.Year,$scope.model.Month,
                                pageNext,
                                $scope.model.pSize,$scope.model.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if(data.Ret==0){
                                        watchRecordList.setting.DataChange(data.Data)
                                    }
                                });

                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {

                            applicationServiceSet.liveService.officialBackground.GetUserLiveNav.send([APPMODEL.Storage.getItem('copPage_token'),
                                $scope.model.uid,   $scope.model.Year,$scope.model.Month,
                                pageNext,
                                $scope.model.pSize,$scope.model.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if(data.Ret==0){
                                        watchRecordList.setting.DataChange(data.Data)
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
                watchRecordList.serviceApi.GetUserLiveNav();
            }



            //禁播 or  解禁
            $scope.Forbid = function (isForbid,item) {

                watchRecordList.serviceApi.Forbid(isForbid,[item.LiveID],function () {
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

                watchRecordList.serviceApi.Forbid(isForbid,ids,function () {
                    watchRecordList.serviceApi.GetUserLiveNav();
                });
            }


            //返回
            $scope.btnReturn = function () {
                 history.back();
                //  $location.url('access/app/internal/UXLive/UserList?activeType='+3);
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
    watchRecordList.init();
}]);