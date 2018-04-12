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
    $scope.checkedAllC = false;
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
        if($scope.model.activeType == 3) {
            $scope.checkedAllC = ck;
            angular.forEach($scope.modelAudience.itemList, function (item) {
                if ($scope.checkedAllC) {
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
            if($scope.model.activeType == 3) {
                if ($scope.selectedList.length === $scope.modelAudience.itemList.length) {
                    $scope.checkedAllC = true;
                }
            }
        } else {
            $scope.checkedAllA = false;
            $scope.checkedAllB = false;
            $scope.checkedAllC = false;
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
                activeType:1,
                json: 'internal/applicationFeeManagement/paymentTableSearch/paymentBySchoolStatistics/city.json',
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

            //受众用户
            $scope.modelAudience={
                itemList: [],  //集合列表
                stateList:[
                    {id:undefined,name:'全部'},
                    {id:-2,name:'已封号'},
                    {id:-1,name:'已禁言'},
                    {id:0,name:'正常'},
                ], //状态列表

                provinceList: [],//省list
                cityList: [],//市list
                countyList: [],//县list
                schoolList:[], //schoolList
                classList:[],  //classList

                s_province: undefined, //省-搜索
                s_city: undefined,  //市-搜索
                s_county: undefined, //县-搜索
                s_school: undefined, //学校、组织搜索
                s_class: undefined, //班级搜索
                s_state:undefined, //状态值
                keyword:undefined ,//机构名称/帐号/手机/负责人
                freezedList: [],   //冻结状态列表
                s_freezedState: undefined, //冻结状态值
                sortFieldList:[],
                s_order: undefined,  //排序值


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
                //获取发布员列表
                GetPubMbrList:function () {
                    applicationServiceSet.liveService.officialBackground.GetPubMbrList.send([APPMODEL.Storage.getItem('copPage_token'),$scope.pubPersion.s_state,
                        $scope.pubPersion.keyword, $scope.model.pIndex, $scope.model.pSize,$scope.pubPersion.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                        .then(function (data) {
                            if(data.Ret==0){

                                liveUserListController.setting.pubPersonDataChange(data.Data)
                            }
                        });
                },
                //获取受众用户列表
                GetUserList:function () {
                    applicationServiceSet.liveService.officialBackground.GetUserList.send([APPMODEL.Storage.getItem('copPage_token'),
                        $scope.modelAudience.s_province,$scope.modelAudience.s_city,  $scope.modelAudience.s_county,$scope.modelAudience.s_school,$scope.modelAudience.s_class,$scope.modelAudience.s_state,
                        $scope.modelAudience.keyword,
                        $scope.model.pIndex,
                        $scope.model.pSize,$scope.modelAudience.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                        .then(function (data) {
                            if(data.Ret==0){
                                liveUserListController.setting.AudienceDataChange(data.Data);
                                liveUserListController.serviceApi.getProvinceList();
                            }
                        });
                },

                //封号、开启
                Disabled:function (isDisable,ids,call,descript) {
                    var data = {};
                    data.msg = $.trim(descript)?descript:(isDisable?'"封号"':'"开启"')+'操作';
                    data.title='您是否确定要执行'+(isDisable?'"封号"':'"开启"')+'操作?';
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


                /**
                 * 获取当前用户学校列表
                 */
                getAllSchool:function (keyword) {
                    applicationServiceSet.commonService.schoolApi.getFuzzySchoolList.send([sessionStorage.getItem('applicationToken'),keyword]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.modelAudience.schoolList  = data.Data;
                        }
                    });
                },
                /**
                 *获取所有班级
                 */
                getAllClass:function(){
                    applicationServiceSet.commonService.schoolApi.GetSchClassesNew.send([sessionStorage.getItem('applicationToken'),$scope.modelAudience.s_school]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.modelAudience.classList  = data.Data;
                        }
                    });
                },
                /**
                 * get province list
                 */
                getProvinceList: function () {
                    $http.get($scope.model.json).success(function (data) {
                        $scope.modelAudience.provinceList = data;
                    })
                },
                /**
                 * get city list
                 * @param provinceId
                 */
                getCityList: function (provinceId) {
                    $http.get($scope.model.json).success(function (data) {
                        for (var i in data) {
                            if (data[i].id == provinceId) {
                                $scope.modelAudience.cityList = data[i].sub;

                                break;
                            }
                        }
                    })
                },
                /**
                 * get county list
                 * @param cityId
                 */
                getCountyList: function (cityId) {
                    $http.get($scope.model.json).success(function (data) {
                        for (var i in data) {
                            if (data[i].id == $scope.modelAudience.s_province) {
                                for (var s in data[i].sub) {
                                    if (data[i].sub[s].id == cityId) {
                                        $scope.modelAudience.countyList = data[i].sub[s].sub;
                                        break;
                                    }
                                }
                                break;
                            }
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
                            if($scope.model.activeType==1) {
                                applicationServiceSet.liveService.officialBackground.GetAnchorList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.modelLivePart.s_state,
                                    $scope.modelLivePart.keyword, page.pIndex, $scope.model.pSize, $scope.modelLivePart.sortFieldList, $scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                    .then(function (data) {
                                        if (data.Ret == 0) {

                                            liveUserListController.setting.liveApartDataChange(data.Data)
                                        }
                                    });
                            }
                            if($scope.model.activeType==2) {
                                applicationServiceSet.liveService.officialBackground.GetPubMbrList.send([APPMODEL.Storage.getItem('copPage_token'),$scope.pubPersion.s_state,
                                    $scope.pubPersion.keyword, page.pIndex, $scope.model.pSize,$scope.s_state.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){

                                            liveUserListController.setting.pubPersonDataChange(data.Data)
                                        }
                                    });
                            }
                            if($scope.model.activeType==3) {
                                applicationServiceSet.liveService.officialBackground.GetUserList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.modelAudience.s_province,$scope.modelAudience.s_city,  $scope.modelAudience.s_county,$scope.modelAudience.s_school,$scope.modelAudience.s_grade,$scope.modelAudience.s_state,
                                    $scope.modelAudience.keyword,
                                    page.pIndex,
                                    $scope.model.pSize,$scope.modelAudience.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){
                                            liveUserListController.setting.AudienceDataChange(data.Data)
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

                            if($scope.model.activeType==2) {
                                applicationServiceSet.liveService.officialBackground.GetPubMbrList.send([APPMODEL.Storage.getItem('copPage_token'),$scope.pubPersion.s_state
                                    ,$scope.pubPersion.keyword, pageNext, $scope.model.pSize,$scope.s_state.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){

                                            liveUserListController.setting.pubPersonDataChange(data.Data)
                                        }
                                    });
                            }
                            if($scope.model.activeType==3) {
                                applicationServiceSet.liveService.officialBackground.GetUserList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.modelAudience.s_province,$scope.modelAudience.s_city,  $scope.modelAudience.s_county,$scope.modelAudience.s_school,
                                    $scope.modelAudience.s_grade,$scope.modelAudience.s_state,
                                    $scope.modelAudience.keyword,
                                    pageNext,
                                    $scope.model.pSize,$scope.modelAudience.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){
                                            liveUserListController.setting.AudienceDataChange(data.Data)
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
                                applicationServiceSet.liveService.officialBackground.GetAnchorList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.modelLivePart.s_state,
                                    $scope.modelLivePart.keyword, pageNext, $scope.model.pSize, $scope.modelLivePart.sortFieldList, $scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID])
                                    .then(function (data) {
                                        if (data.Ret == 0) {

                                            liveUserListController.setting.liveApartDataChange(data.Data)
                                        }
                                    });
                            }
                            if($scope.model.activeType==2) {
                                applicationServiceSet.liveService.officialBackground.GetPubMbrList.send([APPMODEL.Storage.getItem('copPage_token'),$scope.pubPersion.s_state,
                                    $scope.pubPersion.keyword, pageNext, $scope.model.pSize,$scope.s_state.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){

                                            liveUserListController.setting.pubPersonDataChange(data.Data)
                                        }
                                    });
                            }

                            if($scope.model.activeType==3) {
                                applicationServiceSet.liveService.officialBackground.GetUserList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.modelAudience.s_province,$scope.modelAudience.s_city,  $scope.modelAudience.s_county,$scope.modelAudience.s_school,
                                    $scope.modelAudience.s_grade,$scope.modelAudience.s_state,
                                    $scope.modelAudience.keyword,
                                    pageNext,
                                    $scope.model.pSize,$scope.modelAudience.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){
                                            liveUserListController.setting.AudienceDataChange(data.Data)
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
                $scope.checkedAllB = false;
                $scope.checkedAllC = false;
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
                liveUserListController.serviceApi.Disabled(isDisable, [item.UID], function () {
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
                    liveUserListController.serviceApi.Disabled(false, [item.UID], function () {

                        item.StatusName = '正常';
                        item.Status = 0;

                    },descript)
                }
                //已禁言---开启
                else  if(item.Status == -1){
                    //禁言、开启
                    liveUserListController.serviceApi.Shutup(false,[item.UID],function () {

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
                    liveUserListController.serviceApi.Shutup(true,[item.UID],function () {

                        item.StatusName = '禁言';
                        item.Status = -1;

                    },descript)
                }


            }

            //封号所有
            $scope.DisableAll=function () {
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
                if($scope.model.activeType==3){
                    var ids=[];
                    for (var i = 0; i < $scope.modelAudience.itemList.length; i++) {
                        var ni = $scope.modelAudience.itemList[i];
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
                liveUserListController.serviceApi.Disabled(true,ids,function () {
                    $scope.loadTab($scope.model.activeType);
                },descript)

            }
            //禁言所有
            $scope.ShutupAll=function () {
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
                if($scope.model.activeType==2){
                    var ids=[];
                    for (var i = 0; i < $scope.pubPersion.itemList.length; i++) {
                        var ni = $scope.pubPersion.itemList[i];
                        if (ni.checked) {
                            ids.push(ni.UID);
                        }
                    }
                }
                if($scope.model.activeType==3){
                    var ids=[];
                    for (var i = 0; i < $scope.modelAudience.itemList.length; i++) {
                        var ni = $scope.modelAudience.itemList[i];
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
                liveUserListController.serviceApi.Shutup(true,ids,function () {
                    $scope.loadTab($scope.model.activeType);
                },descript)

            }


            //查找直播员
            $scope.BtnSearch=function () {
                if($scope.model.activeType==1){
                    liveUserListController.serviceApi.GetLivepartList();
                }
                else if($scope.model.activeType==2){
                    liveUserListController.serviceApi.GetPubMbrList();
                }
                else if($scope.model.activeType==3){
                    liveUserListController.serviceApi.GetUserList();
                }
            }


            //直播预告点击排序事件
            $scope.pre_sort = function (type) {
                if(type == 1){
                    $scope.modelAudience.sortFieldList = [{SortField:"CmtCnt",IsAsc:true}];

                }else if(type == 2){
                    $scope.modelAudience.sortFieldList = [{SortField:"ShareCnt",IsAsc:true}]

                }else if(type == 3){
                    $scope.modelAudience.sortFieldList = [{SortField:"FavCnt",IsAsc:true}]

                }else if(type == 4){
                    $scope.modelAudience.sortFieldList = [{SortField:"PlayHours",IsAsc:false}]

                }
                liveUserListController.serviceApi.GetUserList();
            }


            /**
             * change province
             * @param provinceId
             */
            $scope.province = function (provinceId) {

                liveUserListController.serviceApi.getCityList(provinceId);//get city list
                $scope.modelAudience.s_city = undefined;
                $scope.modelAudience.s_county = undefined;
            };
            /**
             * change city
             * @param cityId
             */
            $scope.selectCity = function (cityId) {
                liveUserListController.serviceApi.getCountyList(cityId);//get county list
                $scope.modelAudience.s_county = undefined;
            };
            /**
             * delete province
             */
            $scope.deleteProvince = function () {
                $scope.modelAudience.s_province = undefined;
                $scope.modelAudience.s_city = undefined;
                $scope.modelAudience.s_county = undefined;
            };
            /**
             * delete city
             */
            $scope.deleteCity = function () {
                $scope.modelAudience.s_city = undefined;
                $scope.modelAudience.s_county = undefined;
            };

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
                        if($scope.modelLivePart.itemList[i])
                            $scope.modelLivePart.itemList[i].Name=$scope.modelLivePart.itemList[i].PubMbrName;
                    }

                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
                },

                //受众用户数据处理与设定
                AudienceDataChange:function (data) {

                    $scope.modelAudience .itemList = data.ViewModelList;

                    for(var i = 0 ; i< $scope.modelAudience.itemList.length; i++){
                        if($scope.modelAudience.itemList[i].Status ==0){
                            $scope.modelAudience.itemList[i].StatusName='正常';
                        }
                        if($scope.modelAudience.itemList[i].Status ==-1){
                            $scope.modelAudience.itemList[i].StatusName='禁言';
                        }
                        if($scope.modelAudience.itemList[i].Status ==-2){
                            $scope.modelAudience.itemList[i].StatusName='封号';
                        }
                        if($scope.modelLivePart.itemList[i])
                            $scope.modelLivePart.itemList[i].Name=$scope.modelLivePart.itemList[i].UserName;
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