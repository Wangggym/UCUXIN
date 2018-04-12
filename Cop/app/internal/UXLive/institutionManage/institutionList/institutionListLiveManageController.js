/**
 * Created by lqw on 2017/7/21.
 * liveUserListController
 * list of live
 */
app.controller('liveUserListController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {


    // --- 表格全选功能 开始 --------------------------------------------------
    $scope.selectedList = [];
    $scope.checkedAllA = false;
    $scope.checkedAllB = false;
    $scope.checkAll = function (ck) {

        $scope.selectedList = [];
        // if($scope.model.activeType==1) model=$scope.modelLivePart.itemList;
        // if($scope.model.activeType==1) model=$scope.pubPersion.itemList;
        // if($scope.model.activeType==1) model=$scope.modelAudience.itemList;

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

            if ($scope.selectedList.length === $scope.modelLivePart.itemList.length) {
                $scope.checkedAllA = true;
            }

            if($scope.model.activeType == 2) {
                if ($scope.selectedList.length === $scope.pubPersion.itemList.length) {
                    $scope.checkedAllB = true;
                }
            }

        } else {
            $scope.checkedAllA = false;
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
                $scope.loadTab($scope.model.activeType);
            } )


        },
        //变量
        variable:function () {


            $scope.model={
                pSize: 20,
                pIndex: 1,
                isMoke:false,
                activeType:1,
                gid: $stateParams.ID,
                Title:$stateParams.Name,
                grpList:[{
                    id:$stateParams.ID,
                    name:$stateParams.Name,
                } ],
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
            //直播员
            $scope.modelLivePart={
                itemList:[] , //集合列表
                orgLists:[{id:undefined,name:'全部'},{id:11,name:"学校"},{id:21,name:"公司"}],
                stateList:[
                    {id:undefined,name:'全部'},
                    {id:-1,name:'已禁播'},
                    {id:0,name:'正常'},
                ], //状态列表
                s_state:undefined, //状态值
                gTypeID:undefined,
                keyword: undefined, //查找条件
                liveStartDate:undefined,
                liveEndDate:undefined,
                sortFieldList:[]

            }


            $scope.modelLivePart.isCmtCnt = true;
            $scope.modelLivePart.isShareCnt = true;
            $scope.modelLivePart.isFavCnt = true;
            $scope.modelLivePart.isPraiseCnt = true;

            //发布员
            $scope.pubPersion= {
                itemList: [],  //集合列表
                sBtnList:[

                ] ,  //搜索集合按钮
                stateList:[
                    {id:undefined,name:'全部'},
                    {id:-1,name:'已禁言'},
                    {id:0,name:'正常'},
                ], //状态列表
                gid:undefined,
                gTypeID:undefined,
                s_btn:undefined,  //按钮搜索
                s_stateList:[] , //状态列表
                s_state:undefined, //状态值
                keyword:undefined ,//机构名称/帐号/手机/负责人
                pubStartDate:undefined,
                pubEndDate:undefined,
                sortFieldList:[],
            }

            $scope.pubPersion.isCmtCnt = true;
            $scope.pubPersion.isShareCnt = true;
            $scope.pubPersion.isFavCnt = true;
            $scope.pubPersion.isPraiseCnt = true;

            //初始化时间
            $scope.loadDate=function () {

                //配置时间开始------------

                var date = new Date();
                var nowDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();

                $scope.pubPersion.pubStartDate =date.getFullYear() + "/" + (date.getMonth() + 1) + "/1" ;
                $scope.pubPersion.pubEndDate = nowDate;
                $scope.modelLivePart.liveStartDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/1" ;
                $scope.modelLivePart.liveEndDate = nowDate;
                $scope.minDate = $scope.minDate ? null : new Date();

                $scope.openStartDate = function ($event) {

                    $scope.endOpenedA = false;
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.openedStartA = true;
                }


                $scope.openEndDate = function ($event) {
                    $scope.openedStartA = false;
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.endOpenedA = true;
                };

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1,
                    class: 'datepicker'
                };
                $scope.format = 'yyyy/MM/dd';
                //配置時間結束----------

                $scope.stopEvent=function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                }
            }



            $scope.loadDate();
        },

        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                //获取直播员列表
                GetLivepartList:function () {

                    applicationServiceSet.liveService.officialBackground.GetGroupLiveNav_GRP.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.model.gid ,$scope.modelLivePart.gTypeID,$scope.modelLivePart.s_state,$scope.modelLivePart.liveStartDate,$scope.modelLivePart.liveEndDate,$scope.modelLivePart.keyword, $scope.model.pIndex,
                        $scope.model.pSize,$scope.modelLivePart.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                        .then(function (data) {
                            if(data.Ret==0){

                                liveUserListController.setting.liveApartDataChange(data.Data)
                            }
                        });
                },
                //获取发布员列表
                GetPubMbrList:function () {
                    applicationServiceSet.liveService.officialBackground.GetGroupPubNav_GRP.send([APPMODEL.Storage.getItem('copPage_token'),
                      $scope.model.gid,$scope.pubPersion.gTypeID,  $scope.pubPersion.s_state,$scope.pubPersion.pubStartDate,$scope.pubPersion.pubEndDate,
                        $scope.pubPersion.keyword, $scope.model.pIndex, $scope.model.pSize,$scope.pubPersion.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                        .then(function (data) {
                            if(data.Ret==0){

                                liveUserListController.setting.pubPersonDataChange(data.Data)
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


                //封号、开启
                Disabled:function (isDisable,ids,call,descript) {
                    var data = {};
                    data.msg = $.trim(descript)?descript:(isDisable?'"禁言"':'"开启"')+'操作';
                    data.title='您是否确定要执行'+(isDisable?'"禁言"':'"开启"')+'操作?';
                    data.okCallBack = function () {
                        applicationServiceSet.liveService.officialBackground.Disabled.send(
                            [ids],
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
                    data.msg = $.trim(descript)?descript:(isShutup?'"禁言"':'"开启"')+'操作';
                    data.title='您是否确定要执行'+(isShutup?'"禁言"':'"开启"')+'操作?';


                    data.okCallBack = function () {
                        applicationServiceSet.liveService.officialBackground.Shutup.send(
                            [ids],
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
                                applicationServiceSet.liveService.officialBackground.GetGroupLiveNav_GRP.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.model.gid ,$scope.modelLivePart.gTypeID,$scope.modelLivePart.s_state,$scope.modelLivePart.liveStartDate,$scope.modelLivePart.liveEndDate,
                                    $scope.modelLivePart.keyword, page.pIndex,
                                    $scope.model.pSize,$scope.modelLivePart.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){

                                            liveUserListController.setting.liveApartDataChange(data.Data)
                                        }
                                    });
                            }
                            if($scope.model.activeType==2) {
                                applicationServiceSet.liveService.officialBackground.GetGroupPubNav_GRP.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.gid,$scope.pubPersion.gTypeID,
                                    $scope.pubPersion.s_state,$scope.pubPersion.pubStartDate,$scope.pubPersion.pubEndDate,$scope.pubPersion.keyword, page.pIndex,
                                    $scope.model.pSize,$scope.pubPersion.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){

                                            liveUserListController.setting.pubPersonDataChange(data.Data)
                                        }
                                    });
                            }
                            $scope.checkedAllA = false;
                            $scope.checkedAllB = false;
                            $('#checkedAllA').removeAttr('checked')
                            $('#checkedAllB').removeAttr('checked')

                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {

                            if($scope.model.activeType==1) {
                                applicationServiceSet.liveService.officialBackground.GetGroupLiveNav_GRP.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.model.gid ,$scope.modelLivePart.gTypeID,$scope.modelLivePart.s_state,$scope.modelLivePart.liveStartDate,$scope.modelLivePart.liveEndDate,
                                    $scope.modelLivePart.keyword, pageNext,
                                    $scope.model.pSize,$scope.modelLivePart.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){

                                            liveUserListController.setting.liveApartDataChange(data.Data)
                                        }
                                    });
                            }

                            if($scope.model.activeType==2) {
                                applicationServiceSet.liveService.officialBackground.GetGroupPubNav_GRP.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.gid,$scope.pubPersion.gTypeID,
                                    $scope.pubPersion.s_state,$scope.pubPersion.pubStartDate,$scope.pubPersion.pubEndDate,$scope.pubPersion.keyword, pageNext,
                                    $scope.model.pSize,$scope.pubPersion.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){

                                            liveUserListController.setting.pubPersonDataChange(data.Data)
                                        }
                                    });
                            }
                            $scope.checkedAllA = false;
                            $scope.checkedAllB = false;
                            $('#checkedAllA').removeAttr('checked')
                            $('#checkedAllB').removeAttr('checked')

                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {

                            if($scope.model.activeType==1) {
                                applicationServiceSet.liveService.officialBackground.GetGroupLiveNav_GRP.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.model.gid ,$scope.modelLivePart.gTypeID,$scope.modelLivePart.s_state,$scope.modelLivePart.liveStartDate,$scope.modelLivePart.liveEndDate,
                                    $scope.modelLivePart.keyword, pageNext,
                                    $scope.model.pSize,$scope.modelLivePart.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){

                                            liveUserListController.setting.liveApartDataChange(data.Data)
                                        }
                                    });
                            }
                            if($scope.model.activeType==2) {
                                applicationServiceSet.liveService.officialBackground.GetGroupPubNav_GRP.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.gid,$scope.pubPersion.gTypeID,
                                    $scope.pubPersion.s_state,$scope.pubPersion.pubStartDate,$scope.pubPersion.pubEndDate,
                                    $scope.pubPersion.keyword, pageNext, $scope.model.pSize,$scope.pubPersion.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){
                                            liveUserListController.setting.pubPersonDataChange(data.Data)
                                        }
                                    });
                            }
                            $scope.checkedAllA = false;
                            $scope.checkedAllB = false;
                            $('#checkedAllA').removeAttr('checked')
                            $('#checkedAllB').removeAttr('checked')


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


                $scope.checkedAllA = false;
                $scope.checkedAllB = false;
            }

            //封号/开启
            $scope.Forbid=function (item) {
                var descript = item.Name;
                var  isDisable = true;

           if(item.Status == -1){
                    isDisable = false;
                }
                //正常
                if(item.Status == 0){
                    isDisable = true;
                }
                //封号、开启
                liveUserListController.serviceApi.Forbid(isDisable, [item.LiveID], function () {
                    //封号
                    if (isDisable) {
                        item.StatusName = '已禁播';
                        item.Status = -1;
                    }
                    //开启
                    else {
                        item.StatusName = '正常';
                        item.Status = 0;
                    }
                },descript)

            }

            //禁播 or  解禁
            $scope.ForbidAll = function (isForbid) {

                var ids=[];

                if($scope.model.activeType==1) {
                    for (var i = 0; i < $scope.modelLivePart.itemList.length; i++) {
                        var ni = $scope.modelLivePart.itemList[i];
                        if (ni.checked) {
                            ids.push(ni.LiveID)
                        }
                    }
                }
                else if($scope.model.activeType==2) {

                    for (var i = 0; i < $scope.pubPersion.itemList.length; i++) {
                        var ni = $scope.pubPersion.itemList[i];
                        if (ni.checked) {
                            ids.push(ni.LiveID)
                        }
                    }
                }


                if(ids.length==0){
                    toastr.error('请选择直播记录');
                    return false;
                }


                liveUserListController.serviceApi.Forbid(isForbid,ids,function () {
                    $scope.BtnSearch();
                    $scope.checkedAll=false;
                });

            }



            //查找直播员
            $scope.BtnSearch=function () {

                var date = new Date();
                var nowDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
               var sdate=date.getFullYear() + "/" + (date.getMonth() + 1) + "/1" ;

                $scope.pubPersion.pubStartDate =  $scope.pubPersion.pubStartDate?dateFormat($scope.pubPersion.pubStartDate):sdate;
                $scope.pubPersion.pubEndDate =  $scope.pubPersion.pubEndDate?dateFormat($scope.pubPersion.pubEndDate):nowDate;

                $scope.modelLivePart.liveStartDate = $scope.modelLivePart.liveStartDate?dateFormat($scope.modelLivePart.liveStartDate):nowDate;
                $scope.modelLivePart.liveEndDate = $scope.modelLivePart.liveEndDate?dateFormat($scope.modelLivePart.liveEndDate):nowDate;

                function  dateFormat(date) {
                    var df = new Date(date);
                    return  df.getFullYear()+ '/' + (df.getMonth() + 1) + '/' + df.getDate();
                }


                if($scope.model.activeType==1){
                    liveUserListController.serviceApi.GetLivepartList();
                }
                else if($scope.model.activeType==2){
                    liveUserListController.serviceApi.GetPubMbrList();
                }

                $scope.checkedAllA = false;
                $scope.checkedAllB = false;
                $('#checkedAllA').removeAttr('checked')
                $('#checkedAllB').removeAttr('checked')
            }


            //直播预告点击排序事件
            $scope.pre_sort = function (type) {



                if($scope.model.activeType==1){


                    if(type == 1){
                        if($scope.modelLivePart.isPraiseCnt){
                            $('#isPraiseCnt').addClass('sortActive')
                            $('#isCmtCnt,#isShareCnt,#isFavCnt').removeClass('sortActive')
                        }
                        else {
                            $('#isPraiseCnt').removeClass('sortActive')
                        }
                        $scope.modelLivePart.sortFieldList = [{SortField:"PraiseCnt",IsAsc:$scope.modelLivePart.isPraiseCnt}];
                        $scope.modelLivePart.isPraiseCnt = !$scope.modelLivePart.isPraiseCnt;

                        $scope.modelLivePart.isCmtCnt = $scope.modelLivePart.isShareCnt = $scope.modelLivePart.isFavCnt=true;

                    }
                    else if(type == 2){
                        if($scope.modelLivePart.isCmtCnt){
                            $('#isCmtCnt').addClass('sortActive')
                            $('#isPraiseCnt,#isShareCnt,#isFavCnt').removeClass('sortActive')
                        }
                        else {
                            $('#isCmtCnt').removeClass('sortActive')
                        }
                        $scope.modelLivePart.sortFieldList = [{SortField:"CmtCnt",IsAsc:$scope.modelLivePart.isCmtCnt}]
                        $scope.modelLivePart.isCmtCnt = !$scope.modelLivePart.isCmtCnt;
                        $scope.modelLivePart.isPraiseCnt = $scope.modelLivePart.isShareCnt = $scope.modelLivePart.isFavCnt =true;

                    }
                    else if(type == 3){
                        if($scope.modelLivePart.isShareCnt){
                            $('#isShareCnt').addClass('sortActive')
                            $('#isPraiseCnt,#isFavCnt,#isCmtCnt').removeClass('sortActive')
                        }
                        else {
                            $('#isShareCnt').removeClass('sortActive')
                        }
                        $scope.modelLivePart.sortFieldList = [{SortField:"ShareCnt",IsAsc:$scope.modelLivePart.isShareCnt}]
                        $scope.modelLivePart.isShareCnt = !$scope.modelLivePart.isShareCnt;
                        $scope.modelLivePart.isCmtCnt = $scope.modelLivePart.isFavCnt = $scope.modelLivePart.isPraiseCnt=true;

                    }else if(type == 4){
                        if($scope.modelLivePart.isFavCnt){
                            $('#isFavCnt').addClass('sortActive')
                            $('#isPraiseCnt,#isShareCnt,#isCmtCnt').removeClass('sortActive')
                        }
                        else {
                            $('#isFavCnt').removeClass('sortActive')
                        }
                        $scope.modelLivePart.sortFieldList = [{SortField:"FavCnt",IsAsc:$scope.modelLivePart.isFavCnt}]
                        $scope.modelLivePart.isFavCnt = !$scope.modelLivePart.isFavCnt;
                        $scope.modelLivePart.isCmtCnt = $scope.modelLivePart.isShareCnt =   $scope.modelLivePart.isPraiseCnt=true;

                    }

                }
                else if($scope.model.activeType==2){
                    if(type == 1){
                        if($scope.pubPersion.isPraiseCnt){
                            $('#isPraiseCntB').addClass('sortActive')
                            $('#isCmtCntB,#isShareCntB,#isFavCntB').removeClass('sortActive')
                        }
                        else {
                            $('#isPraiseCntB').removeClass('sortActive')
                        }
                        $scope.pubPersion.sortFieldList = [{SortField:"PraiseCnt",IsAsc:$scope.pubPersion.isPraiseCnt}];
                        $scope.pubPersion.isPraiseCnt = !$scope.pubPersion.isPraiseCnt;
                        $scope.pubPersion.isCmtCnt = $scope.pubPersion.isShareCnt = $scope.pubPersion.isFavCnt=true;

                    }
                    else if(type == 2){
                        if($scope.pubPersion.isCmtCnt){
                            $('#isCmtCntB').addClass('sortActive')
                            $('#isPraiseCntB,#isShareCntB,#isFavCntB').removeClass('sortActive')
                        }
                        else {
                            $('#isCmtCntB').removeClass('sortActive')
                        }
                        $scope.pubPersion.sortFieldList = [{SortField:"CmtCnt",IsAsc:$scope.pubPersion.isCmtCnt}]
                        $scope.pubPersion.isCmtCnt = !$scope.pubPersion.isCmtCnt;
                        $scope.pubPersion.isPraiseCnt = $scope.pubPersion.isShareCnt = $scope.pubPersion.isFavCnt =true;

                    }
                    else if(type == 3){
                        if($scope.pubPersion.isShareCnt){
                            $('#isShareCntB').addClass('sortActive')
                            $('#isPraiseCntB,#isFavCntB,#isCmtCntB').removeClass('sortActive')
                        }
                        else {
                            $('#isShareCntB').removeClass('sortActive')
                        }
                        $scope.pubPersion.sortFieldList = [{SortField:"ShareCnt",IsAsc:$scope.pubPersion.isShareCnt}]
                        $scope.pubPersion.isShareCnt = !$scope.pubPersion.isShareCnt;
                        $scope.pubPersion.isCmtCnt = $scope.pubPersion.isFavCnt = $scope.pubPersion.isPraiseCnt=true;

                    }else if(type == 4){
                        if($scope.pubPersion.isFavCnt){
                            $('#isFavCntB').addClass('sortActive')
                            $('#isPraiseCntB,#isShareCntB,#isCmtCntB').removeClass('sortActive')
                        }
                        else {
                            $('#isFavCntB').removeClass('sortActive')
                        }
                        $scope.pubPersion.sortFieldList = [{SortField:"FavCnt",IsAsc:$scope.pubPersion.isFavCnt}]
                        $scope.pubPersion.isFavCnt = !$scope.pubPersion.isFavCnt;
                        $scope.pubPersion.isCmtCnt = $scope.pubPersion.isShareCnt =   $scope.pubPersion.isPraiseCnt=true;

                    }
                }


                $scope.BtnSearch();
            }

            //查找机构
            $scope.refreshGrpList = function ( key) {
                if(!key){
                   // toastr.error('请输入关键字');
                    return false;
                }
                liveUserListController.serviceApi.GetSchoolList(key);
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
                            $scope.modelLivePart.itemList[i].StatusName='已禁播';
                        }

                        $scope.modelLivePart.itemList[i].Name=$scope.modelLivePart.itemList[i].LiveName;
                    }
                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
                },
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
                    }
                   // $scope.modelLivePart.itemList[i].Name=$scope.modelLivePart.itemList[i].LiveName;
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