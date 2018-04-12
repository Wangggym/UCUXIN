/**
 * Created by lqw on 2017/7/21.
 * liveUserListController
 * list of live
 */
app.controller('watchUserListController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {


    // --- 表格全选功能 开始 --------------------------------------------------
    $scope.selectedList = [];

    $scope.checkedAllC = false;
    $scope.checkAll = function (ck) {

        $scope.selectedList = [];

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

            if($scope.model.activeType == 3) {
                if ($scope.selectedList.length === $scope.modelAudience.itemList.length) {
                    $scope.checkedAllC = true;
                }
            }
        } else {
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
                activeType:3,
                ptnID:undefined,
                ptnList:[],
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


            //console.log($scope.model.cloudID,$scope.model.OrgID)
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

            $scope.modelAudience.isCmtCnt = true;
            $scope.modelAudience.isShareCnt = true;
            $scope.modelAudience.isFavCnt = true;
            $scope.modelAudience.isPlayHours = true;
        },

        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {

                //获取受众用户列表
                GetUserList:function () {
                    applicationServiceSet.liveService.officialBackground.GetUserList.send([APPMODEL.Storage.getItem('copPage_token'),
                         $scope.model.ptnID,$scope.modelAudience.s_school,$scope.modelAudience.s_class,
                        $scope.modelAudience.s_state,
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
                //获取合作伙伴
                GetPartnerByKeyword:function(key){
                    applicationServiceSet.liveService.officialBackground.GetPartnerByKeyword.send([APPMODEL.Storage.getItem('copPage_token'),key,$scope.model.OrgLevel,$scope.model.OrgID] )
                        .then(function (data) {
                            if(data.Ret==0){
                                $scope.model.ptnList= data.Data;
                            }
                        });

                },
              //  获取学校/机构
              //  GetSchoolList:function (key) {
              //      applicationServiceSet.liveService.officialBackground.GetCompanysByKeyWord.send([APPMODEL.Storage.getItem('applicationToken'),key, $scope.model.cloudID,$scope.model.OrgID])
              //
              //          .then(function (data) {
              //              if(data.Ret==0){
              //                  $scope.model.grpList=[];
              //                  for(var i =  0 ; i<data.Data.length;i++){
              //                      $scope.model.grpList.push({id:data.Data[i].GID,name:data.Data[i].FName});
              //                  }
              //              }
              //          });
              //  },
                //禁言、开启
                Shutup:function (isShutup,ids,call,descript) {
                    var data = {};
                    data.msg =  (isShutup?'"禁言"':'"开启"')+'操作';
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
                 * 获取当前用户学校列表
                 */
                getAllSchool:function (keyword) {
                    applicationServiceSet.liveService.officialBackground.GetCompanysByKeyWord.send([sessionStorage.getItem('applicationToken'),keyword, $scope.model.cloudID,$scope.model.OrgID]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.modelAudience.schoolList  = data.Data;
                            $scope.model.grpList=[];
                            for(var i =  0 ; i<data.Data.length;i++){
                                $scope.model.grpList.push({id:data.Data[i].GID,name:data.Data[i].FName});
                            }
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

                            if($scope.model.activeType==3) {
                                applicationServiceSet.liveService.officialBackground.GetUserList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.model.ptnID,$scope.modelAudience.s_school,
                                    $scope.modelAudience.s_grade,$scope.modelAudience.s_state,
                                    $scope.modelAudience.keyword,
                                    page.pIndex,
                                    $scope.model.pSize,$scope.modelAudience.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){
                                            liveUserListController.setting.AudienceDataChange(data.Data)
                                            $scope.checkedAllC = false;
                                            $('#chekcallC').removeAttr('checked')
                                        }
                                    });
                            }
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {

                            if($scope.model.activeType==3) {
                                applicationServiceSet.liveService.officialBackground.GetUserList.send([APPMODEL.Storage.getItem('copPage_token'),
                                    $scope.model.ptnID,$scope.modelAudience.s_school,
                                    $scope.modelAudience.s_grade,$scope.modelAudience.s_state,
                                    $scope.modelAudience.keyword,
                                    pageNext,
                                    $scope.model.pSize,$scope.modelAudience.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){
                                            liveUserListController.setting.AudienceDataChange(data.Data)
                                            $scope.checkedAllC = false;
                                            $('#chekcallC').removeAttr('checked')
                                        }
                                    });
                            }
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {

                            if($scope.model.activeType==3) {
                                applicationServiceSet.liveService.officialBackground.GetUserList.send([APPMODEL.Storage.getItem('copPage_token'),
                                     $scope.model.ptnID,$scope.modelAudience.s_school,
                                    $scope.modelAudience.s_grade,$scope.modelAudience.s_state,
                                    $scope.modelAudience.keyword,
                                    pageNext,
                                    $scope.model.pSize,$scope.modelAudience.sortFieldList,$scope.model.isMoke,$scope.model.OrgLevel,$scope.model.OrgID] )
                                    .then(function (data) {
                                        if(data.Ret==0){
                                            liveUserListController.setting.AudienceDataChange(data.Data)
                                            $scope.checkedAllC = false;
                                            $('#chekcallC').removeAttr('checked')
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

                $scope.checkedAllC = false;
            }

            //查找合作伙伴
            $scope.refreshPntList = function ( key) {
                if(!$.trim(key)){
                    return false;
                }
                liveUserListController.serviceApi.GetPartnerByKeyword(key);
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

                if($scope.model.activeType==3){
                    var ids=[];
                    for (var i = 0; i < $scope.modelAudience.itemList.length; i++) {
                        var ni = $scope.modelAudience.itemList[i];
                        if (ni.checked) {
                            ids.push({UID:ni.UID,GID:ni.GID});
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
                    $scope.checkedAllC = false;
                    $('#chekcallC').removeAttr('checked')
                },descript)

            }
            //禁言所有
            $scope.ShutupAll=function (isShutup) {
                var ids= [];
                var descript='';

                if($scope.model.activeType==3){
                    var ids=[];
                    for (var i = 0; i < $scope.modelAudience.itemList.length; i++) {
                        var ni = $scope.modelAudience.itemList[i];
                        if (ni.checked) {
                            ids.push({UID:ni.UID,GID:ni.GID});
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
                    $scope.checkedAllC = false;
                    $('#chekcallC').removeAttr('checked')
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
                $scope.checkedAllC = false;
                $('#chekcallC').removeAttr('checked')
            }


            //直播预告点击排序事件
            $scope.pre_sort = function (type) {

                if(type == 1){
                    if($scope.modelAudience.isCmtCnt){
                        $('#isCmtCnt').addClass('sortActive')
                        $('#isPlayHours,#isFavCnt,#isShareCnt').removeClass('sortActive')
                    }
                    else {
                        $('#isCmtCnt').removeClass('sortActive')
                    }
                    $scope.modelAudience.sortFieldList = [{SortField:"CmtCnt",IsAsc:$scope.modelAudience.isCmtCnt}];
                    $scope.modelAudience.isCmtCnt = !$scope.modelAudience.isCmtCnt;
                    $scope.modelAudience.isShareCnt = $scope.modelAudience.isFavCnt = $scope.modelAudience.isPlayHours=true;

                }else if(type == 2){
                    if($scope.modelAudience.isShareCnt){
                        $('#isShareCnt').addClass('sortActive')
                        $('#isPlayHours,#isFavCnt,#isCmtCnt').removeClass('sortActive')
                    }
                    else {
                        $('#isShareCnt').removeClass('sortActive')
                    }
                    $scope.modelAudience.sortFieldList = [{SortField:"ShareCnt",IsAsc:$scope.modelAudience.isShareCnt}]
                    $scope.modelAudience.isShareCnt = !$scope.modelAudience.isShareCnt;
                    $scope.modelAudience.isCmtCnt = $scope.modelAudience.isFavCnt = $scope.modelAudience.isPlayHours=true;

                }else if(type == 3){
                    if($scope.modelAudience.isFavCnt){
                        $('#isFavCnt').addClass('sortActive')
                        $('#isPlayHours,#isShareCnt,#isCmtCnt').removeClass('sortActive')
                    }
                    else {
                        $('#isFavCnt').removeClass('sortActive')
                    }
                    $scope.modelAudience.sortFieldList = [{SortField:"FavCnt",IsAsc:$scope.modelAudience.isFavCnt}]
                    $scope.modelAudience.isFavCnt = !$scope.modelAudience.isFavCnt;
                    $scope.modelAudience.isCmtCnt = $scope.modelAudience.isShareCnt =   $scope.modelAudience.isPlayHours=true;

                }else if(type == 4){
                    if($scope.modelAudience.isPlayHours){
                        $('#isPlayHours').addClass('sortActive')
                        $('#isFavCnt,#isShareCnt,#isCmtCnt').removeClass('sortActive')
                    }
                    else {
                        $('#isPlayHours').removeClass('sortActive')
                    }
                    $scope.modelAudience.sortFieldList = [{SortField:"PlayHours",IsAsc:$scope.modelAudience.isPlayHours}]
                    $scope.modelAudience.isPlayHours = !$scope.modelAudience.isPlayHours;
                    $scope.modelAudience.isCmtCnt = $scope.modelAudience.isShareCnt = $scope.modelAudience.isFavCnt =true;

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


                        if($scope.modelAudience.itemList[i].Gender ==-1){
                            $scope.modelAudience.itemList[i].Gender='未知';
                        }
                        if($scope.modelAudience.itemList[i].Gender ==0){
                            $scope.modelAudience.itemList[i].Gender='女';
                        }
                        if($scope.modelAudience.itemList[i].Gender ==1){
                            $scope.modelAudience.itemList[i].Gender='男';
                        }


                        if($scope.modelAudience.itemList[i])
                            $scope.modelAudience.itemList[i].Name=$scope.modelAudience.itemList[i].UserName;

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