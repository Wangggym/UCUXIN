/**
 * Created by lqw on 2017/7/21.
 * liveUserListController
 * list of live
 */
app.controller('liveUserListController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {


    // --- 表格全选功能 开始 --------------------------------------------------
    $scope.selectedList = [];
    $scope.checkedAllA = false;
    $scope.checkAll = function (ck) {

        $scope.selectedList = [];


        if($scope.model.activeType == 1) {
            $scope.checkedAllA = ck;

            angular.forEach($scope.modelLivePart.itemList, function (item) {

                if ($scope.checkedAllA) {
                    item.checked = true;
                    $scope.selectedList.push(item.ID);
                } else {
                    item.checked = false;
                }
            });
        }

    };
    $scope.checkedSingle = function (checked, id) {
        if (checked) {
            $scope.selectedList.push(id);

                if ($scope.selectedList.length === $scope.modelLivePart.itemList.length) {
                    $scope.checkedAllA = true;
                }

        } else {
            $scope.checkedAllA = false;
            $scope.selectedList.splice($scope.selectedList.indexOf(id), 1);
        }
    };




    // --- 表格全选功能 结束 --------------------------------------------------


    var  liveUserListController={
        //初始化
        init:function () {
            this.variable();
            this.serviceApi.pageIndex();//分页服务
            this.operation();//操作

            setTimeout(function () {

                $('li.tabItem ').removeClass('active');
                $('li.tabItem[tabType="'+$scope.model.activeType+'"] ').addClass('active')

                $('li.tabItem[tabType="'+$scope.model.activeType+'"]>a').click();

            },500)

            $scope.loadTab($scope.model.activeType);
        },
        //变量
        variable:function () {


            $scope.model={
                pSize: 20,
                pIndex: 1,
                isMoke: false,
                activeType:1,
                json: 'internal/UXLive/UserManage/UserList/city.html',
            }

            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;



            if($stateParams.activeType){
                $scope.model.activeType =  $stateParams.activeType;
            }
            //直播员
            $scope.modelLivePart={
                   itemList:[] , //集合列表
                   stateList:[
                       {id:undefined,name:'全部'},
                       {id:-2,name:'已封号'},
                       {id:-1,name:'已禁言'},
                       {id:0,name:'正常'},
                   ], //状态列表
                   s_state:undefined, //状态值
                   keyword: undefined, //查找条件
                   sortFieldList:[]

            }


        },

        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                //获取直播员列表
                GetLivepartList:function () {
                    applicationServiceSet.liveService.officialBackground.GetAnchorList.send([APPMODEL.Storage.getItem('copPage_token'),$scope.modelLivePart.s_state,$scope.modelLivePart.keyword,
                        $scope.model.pIndex, $scope.model.pSize,$scope.modelLivePart.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                        .then(function (data) {
                            if(data.Ret==0){

                                liveUserListController.setting.liveApartDataChange(data.Data)
                            }
                        });
                },


                //封号、开启
                Disabled:function (isDisable,ids,call,descript) {
                    var data = {};
                    data.msg = (isDisable?'"封号"':'"开启"')+'操作';
                    data.title='您是否确定要执行'+(isDisable?'"封号"':'"开启"')+'操作?';
                    data.okCallBack = function () {
                        applicationServiceSet.liveService.officialBackground.Disabled.send(
                            [ids,isDisable],
                            [APPMODEL.Storage.getItem('copPage_token'),  isDisable,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID]
                        )  .then(function (data) {
                            if(data.Ret==0){
                                if(call) call();
                            }
                        });
                    }


                    var modalInstance = $modal.open({
                        templateUrl: 'pushMsgDetail.html',
                        controller: 'ModalMsgDetailCtrl',
                        size: 'sm',
                        resolve: {
                            items: function () {
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (data) {
                        $scope.data = data;
                    }, function () {

                    });

                },
                //禁言、开启
                Shutup:function (isShutup,ids,call,descript) {
                    var data = {};
                    data.msg = (isShutup?'"禁言"':'"开启"')+'操作';
                    data.title='您是否确定要执行'+(isShutup?'"禁言"':'"开启"')+'操作?';


                    data.okCallBack = function () {
                        applicationServiceSet.liveService.officialBackground.Shutup.send(
                            [ids,isShutup],
                            [APPMODEL.Storage.getItem('copPage_token'),  isShutup,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID]
                        )  .then(function (data) {
                            if(data.Ret==0){
                                if(call) call();
                            }
                        });
                    }


                    var modalInstance = $modal.open({
                        templateUrl: 'pushMsgDetail.html',
                        controller: 'ModalMsgDetailCtrl',
                        size: 'sm',
                        resolve: {
                            items: function () {
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (data) {
                        $scope.data = data;
                    }, function () {

                    });
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
                            if($scope.model.activeType==1) {
                                applicationServiceSet.liveService.officialBackground.GetAnchorList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.modelLivePart.s_state,
                                    $scope.modelLivePart.keyword, page.pIndex, $scope.model.pSize, $scope.modelLivePart.sortFieldList, $scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                    .then(function (data) {
                                        if (data.Ret == 0) {

                                            liveUserListController.setting.liveApartDataChange(data.Data)
                                        }
                                    });
                            }

                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {

                            if($scope.model.activeType==1) {
                                applicationServiceSet.liveService.officialBackground.GetAnchorList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.modelLivePart.s_state,
                                    $scope.modelLivePart.keyword, pageNext, $scope.model.pSize, $scope.modelLivePart.sortFieldList, $scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                    .then(function (data) {
                                        if (data.Ret == 0) {

                                            liveUserListController.setting.liveApartDataChange(data.Data)
                                        }
                                    });
                            }

                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {

                            if($scope.model.activeType==1) {
                                applicationServiceSet.liveService.officialBackground.GetAnchorList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.modelLivePart.s_state
                                    , $scope.modelLivePart.keyword, pageNext, $scope.model.pSize, $scope.modelLivePart.sortFieldList, $scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                    .then(function (data) {
                                        if (data.Ret == 0) {

                                            liveUserListController.setting.liveApartDataChange(data.Data)
                                        }
                                    });
                            }

                        }
                    };
                }
            };
        })(),
        /**
         * 操作
         */
        operation:function () {
            //切换选项卡
            $scope.changeTab=function (i) {

                  $scope.model.activeType = i;
                  $scope.loadTab(i);


            }

            //加载选项卡内容
            $scope.loadTab=function (i) {

                  if(i==1){
                      liveUserListController.serviceApi.GetLivepartList();
                  }
                  else if(i==2){
                      liveUserListController.serviceApi.GetPubMbrList();
                  }
                  else if(i==3){
                      liveUserListController.serviceApi.GetUserList();
                  }

                $scope.checkedAllA = false;
            }

            //封号/开启
            $scope.Disable=function (item) {
                var descript = item.Name;
                var  isDisable = true;
                //已封号--开启
                if(item.Status == -2){
                    isDisable = false;
                }
                //已禁言---开启
                else  if(item.Status == -1){
                    isDisable = true;
                }
                //正常
                if(item.Status == 0){
                    isDisable = true;
                }
                //封号、开启
                liveUserListController.serviceApi.Disabled(isDisable, [{GID:item.GID,UID:item.UID}], function () {
                    //封号
                    if (isDisable) {
                        item.StatusName = '封号';
                        item.Status = -2;
                    }
                    //开启
                    else {
                        item.StatusName = '正常';
                        item.Status = 0;
                    }
                },descript)
 
            }

            //开启
            $scope.Start=function (item) {
                var descript = item.Name;
                //已封号--开启
                if(item.Status == -2){
                    //封号、开启
                    liveUserListController.serviceApi.Disabled(false, [{GID:item.GID,UID:item.UID}], function () {

                            item.StatusName = '正常';
                            item.Status = 0;

                    },descript)
                }
                //已禁言---开启
                else  if(item.Status == -1){
                    //禁言、开启
                    liveUserListController.serviceApi.Shutup(false,[{GID:item.GID,UID:item.UID}],function () {

                            item.StatusName = '正常';
                            item.Status = 0;

                    },descript)
                }

            }

            //禁言/开启
            $scope.Shutup=function (item) {

                var descript = item.Name;
                if(item.Status == 0){
                    //禁言、开启
                    liveUserListController.serviceApi.Shutup(true,[{GID:item.GID,UID:item.UID}],function () {

                            item.StatusName = '禁言';
                            item.Status = -1;

                    },descript)
                }


            }

            //封号所有
            $scope.DisableAll=function (a_isdiable) {
                var ids= [];
                var descript='';
                if($scope.model.activeType==1){
                    var ids=[];
                    for (var i = 0; i < $scope.modelLivePart.itemList.length; i++) {
                        var ni = $scope.modelLivePart.itemList[i];
                        if (ni.checked) {
                            ids.push(ni.UID);
                            descript+=ni.Name;
                            if(ni>0)descript+',';
                        }
                    }
                }


                if(ids.length==0){
                    toastr.error('请至少选择一条记录封号');
                    return false;
                }
                //封号、开启
                liveUserListController.serviceApi.Disabled(a_isdiable,ids,function () {
                    $scope.loadTab($scope.model.activeType);
                },descript)

            }
            //禁言所有
            $scope.ShutupAll=function (isShutup) {
                var ids= [];
                var descript='';
                if($scope.model.activeType==1){
                    var ids=[];
                    for (var i = 0; i < $scope.modelLivePart.itemList.length; i++) {
                        var ni = $scope.modelLivePart.itemList[i];
                        if (ni.checked) {
                            ids.push(ni.UID);
                        }
                    }
                }


                if(ids.length==0){
                    toastr.error('请至少选择一条记录禁言');
                    return false;
                }
                //封号、开启
                liveUserListController.serviceApi.Shutup(isShutup,ids,function () {
                    $scope.loadTab($scope.model.activeType);
                },descript)

            }


            //查找直播员
            $scope.BtnSearch=function () {
                if($scope.model.activeType==1){
                    liveUserListController.serviceApi.GetLivepartList();
                }

            }

            /**
             * refresh service get school list
             * @param selectedGid
             */
            $scope.refreshSchool = function (name) {
                if (name) {
                    liveUserListController.serviceApi.getAllSchool(name);//get school org pages list
                }
            };
            // 选择学校
            $scope.choiceSchool = function () {
                  liveUserListController.serviceApi.getAllClass();
            };

            //选择班级
            $scope.changeClass=function () {

            }

            //跳转到直播员直播直播记录
            $scope.toLiveRecordList=function (item) {
                $location.url('access/app/internal/UXLive/LiveRecordList?userID='+ item.UID+'&ID='+item.ID+'&Name='+item.AnchorName);
            }
            //跳转到发布员发布直播记录
            $scope.toReleaseRecordList=function (item) {
                $location.url('access/app/internal/UXLive/ReleaseRecordList?userID='+ item.UID+'&ID='+item.ID+'&Name='+item.PubMbrName);
            }
            //跳转到观看记录
            $scope.toWacthRecordList=function (item) {
                $location.url('access/app/internal/UXLive/WatchRecordList?userID='+ item.UID+'&ID='+item.ID+'&Name='+item.UserName);
            }
            
            //排序
            $scope.headerSort=function (sortField,isDesc) {
                if($scope.model.activeType==1){
                    $scope.modelLivePart.sortFieldList = [{SortField:sortField,IsAsc:isDesc}];

                }
                $scope.BtnSearch();
            }
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                //直播员数据处理与设定
               liveApartDataChange:function (data) {

                        $scope.modelLivePart .itemList = data.ViewModelList;

                        for(var i = 0 ; i< $scope.modelLivePart.itemList.length; i++){
                            if($scope.modelLivePart.itemList[i].Status ==0){
                                $scope.modelLivePart.itemList[i].StatusName='正常';
                            }
                            if($scope.modelLivePart.itemList[i].Status ==-1){
                                $scope.modelLivePart.itemList[i].StatusName='禁言';
                            }
                            if($scope.modelLivePart.itemList[i].Status ==-2){
                                $scope.modelLivePart.itemList[i].StatusName='封号';
                            }
                            $scope.modelLivePart.itemList[i].Name=$scope.modelLivePart.itemList[i].AnchorName;
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

    liveUserListController.init();
}]);


//提示消息
app.controller('ModalMsgDetailCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.msgDetail = items.msg;
    $scope.msgTitle =items.title;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.cancelDelet = function () {
        items.okCallBack();
        $modalInstance.dismiss('cancel');
    };
}]);