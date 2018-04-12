
app.controller('addtabs', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {

    var addtabs = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作

            // this.setting.tip();//tip


            addtabs.serviceApi.getGradeTypeList();
            addtabs.serviceApi.GetGroupTypeList();
            addtabs.serviceApi.getPhaseList();
            addtabs.serviceApi.getRTypeList();
            addtabs.serviceApi.GetGlobalTab();

        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                BizDomainListAll:[      //业务领域
                    {  id:0,name:'基础教育'  },
                    {  id:1,name:'师资培训'  },
                ],
                BizDomainList:[],
                GTypeListAll:[],//机构类型
                GTypeList:[],
                RTypeListAll:[], //使用角色
                RTypeList:[],
                PhaseListAll:[],//教育阶段
                PhaseList:[],
                GrdTypeListAll:[],//年级段
                GrdTypeList:[],
                TabID:$stateParams.TabID,
                Name:undefined,
                Desc: undefined,
                Icon1:undefined,
                Icon2:undefined,
                Icon3:undefined,
                ActType:undefined,
                Url:undefined,
                SNO: undefined,
                Visible:undefined,
                ST:undefined,
                Grants: [],
                GrantsDesc:undefined,

            },
            $scope.tabModel = {
                // PreviewImg: undefined,
            }


            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.OrgLevel = orgModel.OrgLevel;
            $scope.model.OrgID= orgModel.OrgID;

        },

        /**
         * 服务集合
         */

        serviceApi: (function () {
            return {

                //获取编辑tab
                GetGlobalTab: function () {
                    if(!$scope.model.TabID){
                        return false;
                    }
                    applicationServiceSet.couldRegionServiceApi.couldRegion.GetGlobalTab.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.TabID] ).then(function (data) {

                        if (data.Ret == 0) {
                            $scope.tabModel  = data.Data;
                            addtabs.setting.intModel();
                        }

                    });
                },

                //新增tab
                SaveGlobalTab:function () {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.SaveGlobalTab.send([$scope.model.TabID,$scope.model.Name,$scope.model.Desc,$scope.model.Icon1,$scope.model.Icon2,$scope.model.Icon3, $scope.model.ActType,$scope.model.Url, $scope.model.SNO, $scope.model.Visible,$scope.model. ST,$scope.model. Grants,$scope.model.GrantsDesc],[APPMODEL.Storage.getItem('copPage_token'),]).then(function (data) {

                        if (data.Ret == 0) {
                            toastr.success('添加成功');

                            $location.url('access/app/internal/CloudRegion/overallSituation');


                        }

                    });

                },



                /**
                 * 获取机构类型
                 */
                GetGroupTypeList:function () {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.GetGroupTypeList.send([APPMODEL.Storage.getItem('applicationToken'),1,0]).then(function (data) {
                        if (data.Ret == 0) {
                            var __roleTypeTree  = [];
                            for (var i = 0; i < data.Data.length; i++) {
                                var obj = {};
                                obj.id = data.Data[i].ID;
                                obj.name = data.Data[i].Name;
                                __roleTypeTree.push(obj);
                            }
                            //  __rTypeList.push({id: 0, name: '全部'});
                            $scope.model.GTypeListAll = __roleTypeTree;
                        }
                    });
                },
                /**
                 * 获取教育阶段
                 */
                getPhaseList:function () {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.GetPhaseList.send([APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {

                        if (data.Ret == 0) {
                            var __phaselist = [];
                            for (var i = 0; i < data.Data.length; i++) {
                                var obj = {};
                                obj.id = data.Data[i].ID;
                                obj.name = data.Data[i].Name;
                                __phaselist.push(obj);
                            }
                            //  __phaselist.push({id: 0, name: '全部'});
                            $scope.model.PhaseListAll = __phaselist;
                        }
                    });
                },
                /**
                 * 获取角色
                 */
                getRTypeList:function () {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.GetRoleTypeTree.send([APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {

                        if (data.Ret == 0) {
                            var __rTypeList  = [];
                            for (var i = 0; i < data.Data.length; i++) {
                                var obj = {};
                                obj.id = data.Data[i].ID;
                                obj.name = data.Data[i].Name;
                                __rTypeList.push(obj);

                                for(var j = 0 ; j<data.Data[i].Childs.length; j++)
                                {
                                    var c_obj = {};
                                    c_obj.id = data.Data[i].Childs[j].ID;
                                    c_obj.name = data.Data[i].Childs[j].Name;
                                    __rTypeList.push(c_obj);
                                }
                            }
                            //  __rTypeList.push({id: 0, name: '全部'});
                            $scope.model.RTypeListAll = __rTypeList;
                        }
                    });
                },

                /**
                 * 年纪段
                 */
                getGradeTypeList:function () {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.GetGradeTypeList.send([APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
                        if (data.Ret == 0) {
                            var __grdTypeList  = [];
                            for (var i = 0; i < data.Data.length; i++) {
                                var obj = {};
                                obj.id = data.Data[i].ID;
                                obj.name = data.Data[i].Name;
                                __grdTypeList.push(obj);
                            }

                            //  __rTypeList.push({id: 0, name: '全部'});
                            $scope.model.GrdTypeListAll = __grdTypeList;
                        }
                    });
                },

                //图标上传
                imageUpload: function (file,iconType) {

                    if(file.size>=3145728){
                        toastr.error('预览图大小不能超过3M');
                        return false;
                    }
                    applicationServiceSet.parAppServiceApi.corporateRegistrationIcon.ImageRegistrationUpload.fileUpload(file).then(function (data) {
                        if (data.Ret == 0) {
                                  if(iconType==1){
                                      $scope.tabModel.Icon1= data.Data.Url;
                                  }
                            if(iconType==2){
                                $scope.tabModel.Icon2= data.Data.Url;
                            }
                            if(iconType==3){
                                $scope.tabModel.Icon3= data.Data.Url;
                            }
                        }
                    });
                },
            /*********上传图片***********/
            uploadIcons:function (file) {
                applicationServiceSet.themeSkinServiceApi.Authorization.uploadIcons.fileUpload(file).then(function (data) {
                    if(data.Ret == 0){
                        $scope.imgUrl= data.Data.Url;
                    }
                });
            },


            };
        })(),



        /**
         * 操作
         */
        operation: function () {

            // 图标选择
            $scope.fileChange1 = function (file) {

                if (file) {
                    addtabs.serviceApi.imageUpload(file,1);//图标上传
                }
            };

            $scope.fileChange2 = function (file) {

                if (file) {
                    addtabs.serviceApi.imageUpload(file,2);//图标上传
                }
            };
            $scope.fileChange3 = function (file) {

                if (file) {
                    addtabs.serviceApi.imageUpload(file,3);//图标上传
                }
            };
            /**
             * 勾选开启的业务
             */
            $scope.addCheckedOne = function (itemList, index) {
                angular.forEach(itemList, function (value, key) {
                    if (key == index) {
                        if (value.checked) {
                            value.checked = false;
                        } else {
                            value.checked = true;
                        }
                    }
                });
            };


            // //管理图标集
            $scope.ManageIconList=function (type,oldIcon) {


            };

                //返回
                $scope.quxiao = function () {

                    $location.url('access/app/internal/CloudRegion/overallSituation');

                };
            //保存新增tab

            $scope.savetab=function(){       //添加tab
                $scope.model.Name = $(".saveName").val();
                $scope.model.Desc = $(".saveDesc").val();
                $scope.model.Icon1 = $(".saveIcon1").val();
                $scope.model.Icon2 = $(".saveIcon2").val();
                $scope.model.Icon3= $(".saveIcon3").val();
                $scope.model.ActType= $(".saveActType").val();
                $scope.model.Url= $(".saveUrl").val();
                $scope.model.Visible= $('input[name="saveVisible"]:checked ').val();
                $scope.model.ST= $('input[name="saveST"]:checked ').val();
               $scope.model.GrantsDesc=$('input[type=checkbox]:checked').val();
                //业务领域
                $scope.model.BizDomainList={
                    TabGrantID:1,
                    OrgType: $scope.model.OrgLevel,
                    OrgID:$scope.model.OrgID,
                    TabID:$scope.model.TabID,
                    GrantType:1,
                    Val:[]
                }
                for(var i=0; i<$scope.model.BizDomainListAll.length;i++){
                    if($scope.model.BizDomainListAll[i].checked){
                        $scope.model.BizDomainList.Val.push($scope.model.BizDomainListAll[i].id)

                    }
                }

                //机构类型
                $scope.model.GTypeList={
                    TabGrantID:0,
                    OrgType: $scope.model.OrgLevel,
                    OrgID:$scope.model.OrgID,
                    TabID:$scope.model.TabID,
                    GrantType:2,
                    Val:[]
                }
                for(var i=0; i<$scope.model.GTypeListAll.length;i++){
                    if($scope.model.GTypeListAll[i].checked){
                        $scope.model.GTypeList.Val.push($scope.model.GTypeListAll[i].id)
                    }
                }

                //角色
                $scope.model.RTypeList={
                    TabGrantID:0,
                    OrgType: $scope.model.OrgLevel,
                    OrgID:$scope.model.OrgID,
                    TabID:$scope.model.TabID,
                    GrantType:3,
                    Val:[]
                }
                for(var i=0; i<$scope.model.RTypeListAll.length;i++){
                    if($scope.model.RTypeListAll[i].checked){
                        $scope.model.RTypeList.Val.push($scope.model.RTypeListAll[i].id)
                    }
                }

                //教育阶段
                $scope.model.PhaseList={
                    TabGrantID:0,
                    OrgType: $scope.model.OrgLevel,
                    OrgID:$scope.model.OrgID,
                    TabID:$scope.model.TabID,
                    GrantType:4,
                    Val:[]
                }
                for(var i=0; i<$scope.model.PhaseListAll.length;i++){
                    if($scope.model.PhaseListAll[i].checked){
                        $scope.model.PhaseList.Val.push($scope.model.PhaseListAll[i].id)
                    }
                }

                //年级段
                $scope.model.GrdTypeList={
                    TabGrantID:0,
                    OrgType: $scope.model.OrgLevel,
                    OrgID:$scope.model.OrgID,
                    TabID:$scope.model.TabID,
                    GrantType:5,
                    Val:[]
                }
                for(var i=0; i<$scope.model.GrdTypeListAll.length;i++){
                    if($scope.model.GrdTypeListAll[i].checked){
                        $scope.model.GrdTypeList.Val.push($scope.model.GrdTypeListAll[i].id)
                    }
                }

                $scope.model.Grants.push($scope.model.BizDomainList);
                $scope.model.Grants.push($scope.model.GTypeList);
                $scope.model.Grants.push($scope.model.RTypeList);
                $scope.model.Grants.push($scope.model.PhaseList);
                $scope.model.Grants.push($scope.model.GrdTypeList);

                addtabs.serviceApi.SaveGlobalTab()
            };


        },
        /**
         * 设置
         */
        setting: (function () {
            return {

                /*
                 * 初始化model*/
                intModel:function () {
                    $scope.model.Name=$scope.tabModel.Name;
                    $scope.model.Desc=$scope.tabModel.Desc;
                    $scope.model.Icon1=$scope.tabModel.Icon1;
                    $scope.model.Icon2=$scope.tabModel.Icon2;
                    $scope.model.Icon3=$scope.tabModel.Icon3;
                    // $scope.model.IconsetList=$scope.tabModel.IconsetList;
                    $scope.model.ST=$scope.tabModel.ST;
                    $scope.model.ActType=$scope.tabModel.ActType;
                    $scope.model.BizDomainList=$scope.tabModel.BizDomainList;
                    $scope.model.GTypeList=$scope.tabModel.GTypeList;
                    $scope.model.RTypeList=$scope.tabModel.RTypeList;
                    $scope.model.PhaseList=$scope.tabModel.PhaseList;
                    $scope.model.GrdTypeList=$scope.tabModel.GrdTypeList;
                    $scope.model.SNO=$scope.tabModel.SNO;
                    $scope.model.STypeList=$scope.tabModel.STypeList;

                    $scope.model.Grants=$scope.tabModel.Grants;



                    var BizDomainList = [];
                    var GTypeList=[];
                    var RTypeList=[];
                    var PhaseList=[];
                    var GrdTypeList=[];
                    for(var i = 0 ; i < $scope.tabModel.Grants.length;i++)
                    {
                        var item_grent=  $scope.tabModel.Grants[i];
                        if(item_grent.GrantType ==1){
                            BizDomainList =$scope.tabModel.Grants[i].Val;
                        }
                        if(item_grent.GrantType ==2){
                            GTypeList =$scope.tabModel.Grants[i].Val;
                        }
                        if(item_grent.GrantType ==3){
                            RTypeList =$scope.tabModel.Grants[i].Val;
                        }
                        if(item_grent.GrantType ==4){
                            PhaseList =$scope.tabModel.Grants[i].Val;
                        }
                        if(item_grent.GrantType ==5){
                            GrdTypeList =$scope.tabModel.Grants[i].Val;
                        }
                    }


                    for(var i=0; i<$scope.model.BizDomainListAll.length;i++){
                        for(var j=0 ; j<BizDomainList.length; j++)
                        {
                            if($scope.model.BizDomainListAll[i].id==BizDomainList[j]){
                                $scope.model.BizDomainListAll[i].checked=true;
                            }
                        }
                    }

                    for(var i=0; i<$scope.model.GTypeListAll.length;i++){
                        for(var j=0 ; j<GTypeList.length; j++)
                        {
                            if($scope.model.GTypeListAll[i].id==GTypeList[j]){
                                $scope.model.GTypeListAll[i].checked=true;
                            }
                        }
                    }

                    for(var i=0; i<$scope.model.RTypeListAll.length;i++){
                        for(var j=0 ; j<RTypeList.length; j++)
                        {
                            if($scope.model.RTypeListAll[i].id==RTypeList[j]){
                                $scope.model.RTypeListAll[i].checked=true;
                            }
                        }
                    }

                    for(var i=0; i<$scope.model.PhaseListAll.length;i++){
                        for(var j=0 ; j<PhaseList.length; j++)
                        {
                            if($scope.model.PhaseListAll[i].id==PhaseList[j]){
                                $scope.model.PhaseListAll[i].checked=true;
                            }
                        }
                    }


                    for(var i=0; i<$scope.model.GrdTypeListAll.length;i++){
                        for(var j=0 ; j<GrdTypeList.length; j++)
                        {
                            if(($scope.model.GrdTypeListAll[i].id) ==(GrdTypeList[j])){
                                $scope.model.GrdTypeListAll[i].checked=true;
                            }
                        }
                    }
                },
                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                }


            };
        })(),

    };
    addtabs.init();//函数入口

}]);

