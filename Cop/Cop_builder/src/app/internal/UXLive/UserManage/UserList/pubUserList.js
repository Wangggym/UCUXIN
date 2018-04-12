/**
 * Created by lqw on 2017/7/21.
 * liveUserListController
 * list of live
 */
app.controller('pubUserListController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {


    // --- 表格全选功能 开始 --------------------------------------------------
    $scope.selectedList = [];
    $scope.checkedAllB = false;
    $scope.checkAll = function (ck) {

        $scope.selectedList = [];

        if($scope.model.activeType == 2) {
            $scope.checkedAllB = ck;
            angular.forEach($scope.pubPersion.itemList, function (item) {
                if ($scope.checkedAllB) {
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

            if($scope.model.activeType == 2) {
                if ($scope.selectedList.length === $scope.pubPersion.itemList.length) {
                    $scope.checkedAllB = true;
                }
            }
        } else {
            $scope.checkedAllB = false;
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
                isMoke:false,
                activeType:2,
                ptnID:undefined,
                ptnList:[],
                gid:undefined,
                grpList:[ ],

                json: 'internal/UXLive/UserManage/UserList/city.html',
            }
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;

            if($scope.model.OrgLevel!=1){
                $scope.model.cloudID = orgModel.CloudID;
            }
            else{
                $scope.model.OrgID=0;
            }

            if($stateParams.activeType){
                $scope.model.activeType =  $stateParams.activeType;
            }
            //发布员
            $scope.pubPersion= {
                itemList: [],  //集合列表
                sBtnList:[

                ] ,  //搜索集合按钮
                stateList:[
                    {id:undefined,name:'全部'},
                    {id:-2,name:'已封号'},
                    {id:-1,name:'已禁言'},
                    {id:0,name:'正常'},
                ], //状态列表
                s_btn:undefined,  //按钮搜索
                s_stateList:[] , //状态列表
                s_state:undefined, //状态值
                keyword:undefined ,//机构名称/帐号/手机/负责人
            }

        },

        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {

                //获取发布员列表
                GetPubMbrList:function () {

                    applicationServiceSet.liveService.officialBackground.GetPubMbrList.send([APPMODEL.Storage.getItem('copPage_token'),$scope.pubPersion.s_state,$scope.pubPersion.keyword,
                        $scope.model.pIndex, $scope.model.pSize,$scope.pubPersion.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID,$scope.model.gid,$scope.model.ptnID] )
                        .then(function (data) {
                            if(data.Ret==0){

                                liveUserListController.setting.pubPersonDataChange(data.Data)
                            }
                        });
                },

                //获取合作伙伴
                GetPartnerByKeyword:function(key){
                    applicationServiceSet.liveService.officialBackground.GetPartnerByKeyword.send([APPMODEL.Storage.getItem('copPage_token'),key,$scope.model.OrgLevel,$scope.model.OrgID] )
                        .then(function (data) {
                            if(data.Ret==0){
                              $scope.model.ptnList= data.Data;
                            }
                        });

                },
                //获取学校/机构
                GetSchoolList:function (key) {
                    applicationServiceSet.liveService.officialBackground.GetCompanysByKeyWord.send([APPMODEL.Storage.getItem('applicationToken'),key, $scope.model.cloudID,$scope.model.OrgID])

                        .then(function (data) {
                            if(data.Ret==0){
                                $scope.model.grpList=[];
                                for(var i =  0 ; i<data.Data.length;i++){
                                    $scope.model.grpList.push({id:data.Data[i].GID,name:data.Data[i].FName});
                                }
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

                            if ($scope.model.activeType == 2) {
                                applicationServiceSet.liveService.officialBackground.GetPubMbrList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.pubPersion.s_state,
                                    $scope.pubPersion.keyword, page.pIndex, $scope.model.pSize, $scope.pubPersion.sortFieldList, $scope.model.isMoke, $scope.model.OrgLevel, $scope.model.OrgID,$scope.model.gid,$scope.model.ptnID])
                                    .then(function (data) {
                                        if (data.Ret == 0) {

                                            liveUserListController.setting.pubPersonDataChange(data.Data)
                                        }
                                    });
                            }
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {


                            if ($scope.model.activeType == 2) {
                                applicationServiceSet.liveService.officialBackground.GetPubMbrList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.pubPersion.s_state, $scope.pubPersion.keyword,
                                    pageNext, $scope.model.pSize, $scope.pubPersion.sortFieldList, $scope.model.isMoke, $scope.model.OrgLevel, $scope.model.OrgID,$scope.model.gid,$scope.model.ptnID])
                                    .then(function (data) {
                                        if (data.Ret == 0) {

                                            liveUserListController.setting.pubPersonDataChange(data.Data)
                                        }
                                    });
                            }

                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {


                            if ($scope.model.activeType == 2) {
                                applicationServiceSet.liveService.officialBackground.GetPubMbrList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.pubPersion.s_state, $scope.pubPersion.keyword,
                                    pageNext, $scope.model.pSize, $scope.pubPersion.sortFieldList, $scope.model.isMoke, $scope.model.OrgLevel, $scope.model.OrgID,$scope.model.gid,$scope.model.ptnID])
                                    .then(function (data) {
                                        if (data.Ret == 0) {

                                            liveUserListController.setting.pubPersonDataChange(data.Data)
                                        }
                                    });
                            }
                        }
                    }
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

               if(i==2){
                    liveUserListController.serviceApi.GetPubMbrList();
                }


                $scope.checkedAllB = false;
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
                liveUserListController.serviceApi.Disabled(isDisable, [{UID:item.UID,GID:item.GID}], function () {
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
                    liveUserListController.serviceApi.Disabled(false, [{UID:item.UID,GID:item.GID}], function () {

                        item.StatusName = '正常';
                        item.Status = 0;

                    },descript)
                }
                //已禁言---开启
                else  if(item.Status == -1){
                    //禁言、开启
                    liveUserListController.serviceApi.Shutup(false,[{UID:item.UID,GID:item.GID}],function () {

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
                    liveUserListController.serviceApi.Shutup(true,[{UID:item.UID,GID:item.GID}],function () {

                        item.StatusName = '禁言';
                        item.Status = -1;

                    },descript)
                }


            }

            //封号所有
            $scope.DisableAll=function (a_isdiable) {
                var ids= [];
                var descript='';

                if($scope.model.activeType==2){
                    var ids=[];
                    for (var i = 0; i < $scope.pubPersion.itemList.length; i++) {
                        var ni = $scope.pubPersion.itemList[i];
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

                if($scope.model.activeType==2){
                    var ids=[];
                    for (var i = 0; i < $scope.pubPersion.itemList.length; i++) {
                        var ni = $scope.pubPersion.itemList[i];
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

                  if($scope.model.activeType==2){
                    liveUserListController.serviceApi.GetPubMbrList();
                }

            }


            //查找合作伙伴
           $scope.refreshPntList = function ( key) {
                if(!$.trim(key)){
                    return false;
                }
                   liveUserListController.serviceApi.GetPartnerByKeyword(key);
           }

            //查找机构
            $scope.refreshGrpList = function ( key) {
                if(!key){
                    // toastr.error('请输入关键字');
                    return false;
                }
                liveUserListController.serviceApi.GetSchoolList(key);
            }



            //跳转到发布员发布直播记录
            $scope.toReleaseRecordList=function (item) {
                $location.url('access/app/internal/UXLive/ReleaseRecordList?userID='+ item.UID+'&ID='+item.ID+'&Name='+item.PubMbrName);
            }



            //排序
            $scope.headerSort=function (sortField,isDesc) {
           if($scope.model.activeType==2){
                    $scope.pubPersion.sortFieldList = [{SortField:sortField,IsAsc:isDesc}]

                }
                $scope.BtnSearch();
            }
        },
        /**
         * 设置
         */
        setting: (function () {
            return {

                //发布员数据处理与设定
                pubPersonDataChange:function (data) {

                    $scope.pubPersion .itemList = data.ViewModelList;

                    for(var i = 0 ; i< $scope.pubPersion.itemList.length; i++){
                        if($scope.pubPersion.itemList[i].Status ==0){
                            $scope.pubPersion.itemList[i].StatusName='正常';
                        }
                        if($scope.pubPersion.itemList[i].Status ==-1){
                            $scope.pubPersion.itemList[i].StatusName='禁言';
                        }
                        if($scope.pubPersion.itemList[i].Status ==-2){
                            $scope.pubPersion.itemList[i].StatusName='封号';
                        }
                        if($scope.pubPersion.itemList[i])
                            $scope.pubPersion.itemList[i].Name=$scope.pubPersion.itemList[i].PubMbrName;
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