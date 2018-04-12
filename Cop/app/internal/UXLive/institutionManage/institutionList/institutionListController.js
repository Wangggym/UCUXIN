/**
 * Created by lqw on 2017/11/15.
 */
app.controller('institutionListController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {

    // --- 表格全选功能 开始 --------------------------------------------------
    $scope.selectedList = [];
    $scope.checkedAll = false;
    $scope.checkAll = function () {
        $scope.selectedList = [];
        angular.forEach($scope.model.itemList, function (item) {
            if ($scope.checkedAll) {
                item.checked = true;
                $scope.selectedList.push(item.ID);
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

                releaseRecordList.serviceApi.GetPubGroupList();
            },500);
        },
        //变量
        variable:function () {

            $scope.model={
                itemList:[],
                pSize: 20,
                pIndex: 1,
                gTypeID:undefined,
                orgLists:[{id:undefined,name:'全部'},{id:11,name:"学校"},{id:21,name:"公司"}],
                Status:[{id:undefined,name:'全部'},{id:0,name:"正常"},{id:-1,name:"已禁用"} ],
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

            //初始化时间
            $scope.loadDate=function () {

                //配置时间开始------------

                var date = new Date();
                var nowDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                $scope.model.pubStartDate = nowDate;
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
                GetPubGroupList:function () {
                    applicationServiceSet.liveService.officialBackground.GetPubGroupList.send([APPMODEL.Storage.getItem('copPage_token'),
                         $scope.model.gTypeID,  $scope.model.s_state,$scope.model.keyword,
                        $scope.model.pIndex,
                        $scope.model.pSize,$scope.model.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                        .then(function (data) {
                            if(data.Ret==0){
                                releaseRecordList.setting.DataChange(data.Data)
                                $scope.checkedAll=false;
                            }
                        });
                },

                //禁播或解禁
                CopGroupWebDisabled: function (isDisable,ids,call) {
                    applicationServiceSet.liveService.officialBackground.CopGroupWebDisabled.send([ids],[APPMODEL.Storage.getItem('copPage_token'),isDisable,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID]).then(function (data) {
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
                            applicationServiceSet.liveService.officialBackground.GetPubGroupList.send([APPMODEL.Storage.getItem('copPage_token'),
                                $scope.model.gTypeID,  $scope.model.s_state,$scope.model.keyword,
                                page.pIndex,
                                $scope.model.pSize,$scope.model.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if(data.Ret==0){
                                        releaseRecordList.setting.DataChange(data.Data)
                                        $scope.checkedAll=false;
                                    }
                                });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.liveService.officialBackground.GetPubGroupList.send([APPMODEL.Storage.getItem('copPage_token'),
                              $scope.model.gTypeID,  $scope.model.s_state,$scope.model.keyword,
                                pageNext,
                                $scope.model.pSize,$scope.model.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if(data.Ret==0){
                                        releaseRecordList.setting.DataChange(data.Data)
                                        $scope.checkedAll=false;
                                    }
                                });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {

                            applicationServiceSet.liveService.officialBackground.GetPubGroupList.send([APPMODEL.Storage.getItem('copPage_token'),
                                $scope.model.gTypeID,  $scope.model.s_state,$scope.model.keyword,
                                pageNext,
                                $scope.model.pSize,$scope.model.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                .then(function (data) {
                                    if(data.Ret==0){
                                        releaseRecordList.setting.DataChange(data.Data)
                                        $scope.checkedAll=false;
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

                releaseRecordList.serviceApi.GetPubGroupList();
            }

            //禁用和开启
            $scope.Disable=function ( item) {
                var  isDisable = true;
                if(item.Status == -1){
                    isDisable = false;
                }
                //正常
                if(item.Status == 0){
                    isDisable = true;
                }

                releaseRecordList.serviceApi.CopGroupWebDisabled(isDisable,[item.ID],function () {

                    //封号
                    if (isDisable) {
                        item.StatusName = '已禁用';
                        item.Status = -1;
                    }
                    //开启
                    else {
                        item.StatusName = '正常';
                        item.Status = 0;
                    }
                })
            }


            //禁言所有
            $scope.DisableAll=function (isDisable) {
                var ids= [];
                var descript='';

                    var ids=[];
                    for (var i = 0; i < $scope.model.itemList.length; i++) {
                        var ni = $scope.model.itemList[i];
                        if (ni.checked) {
                            ids.push(ni.ID);
                        }
                    }


                if(ids.length==0){
                    toastr.error('请至少选择一条记录操作');
                    return false;
                }

                //禁言、开启
                releaseRecordList.serviceApi.CopGroupWebDisabled(isDisable,ids,function () {
                       releaseRecordList.serviceApi.GetPubGroupList();
                       $scope.checkedAll=false;
                },descript)

            }


            //调转到机构直播管理列表
            $scope.toInstitutionLiveList= function (item) {
                $location.url('access/app/internal/UXLive/institutionListLiveManage?ID='+item.GID+'&Name='+item.GrpName);
            }

            //修改资料
            $scope.updateInstitutionLiveList=function (item) {
                if(!item){
                    item={ID:0,GrpName:''}
                }
                $location.url('access/app/internal/UXLive/updateInstitution?ID='+item.ID+'&Name='+item.GrpName);
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
                            $scope.model.itemList[i].StatusName='已禁用';
                        }
                        if($scope.model.itemList[i].Status ==-2){
                            $scope.model.itemList[i].StatusName='封号';
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