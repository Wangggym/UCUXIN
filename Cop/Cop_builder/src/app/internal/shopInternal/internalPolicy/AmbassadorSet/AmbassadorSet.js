
/**
 * Created by lqw on 2017/8/16
 */

app.controller('AmbassadorSetController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {



    /**
     * 关爱使设置
     * @type {{init: init, variable: variable, serviceApi, operation: operation, setting}}
     */
    var listOfAmbassador = {


        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.serviceApi.pageIndex();//分页服务
            this.operation();//操作

        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                parterID:0,
                pSize: 20,
                pIndex: 1,
                sid:undefined,
                sName:undefined,
                schoolList:[],
                schoolID:undefined,
            };
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.parterID=orgModel.OrgType;


            if ($stateParams.sid) {
                $scope.model.sid=$stateParams.sid;
                $scope.model.sName=$stateParams.sName;
            }


        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {

                //根据学校获取学校的关爱使成员
                GetMembersByRole: function (index) {
                    applicationServiceSet.shopInternalServiceApi.shopService.GetMembersByRole.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.parterID,11003,$scope.model.schoolID,20,index]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.itemList = data.Data.ViewModelList;
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                },
                //获取合作伙伴下的学校
                GetCurUserSchool:function ( ) {
                    applicationServiceSet.shopInternalServiceApi.shopService.GetCurUserSchool.send([APPMODEL.Storage.getItem('copPage_token') ,$scope.model.parterID ]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList=data.Data;
                            if(data.Data.length>0){
                                $scope.model.schoolID= data.Data[0].ID;
                                listOfAmbassador.serviceApi.GetMembersByRole(1);
                            }
                        }
                    });
                },
                //删除关爱使
                RemoveRoleMember:function ( ) {
                    applicationServiceSet.shopInternalServiceApi.shopService.RemoveRoleMember.send(undefined,[APPMODEL.Storage.getItem('copPage_token'),11003]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("删除成功");
                            listOfAmbassador.serviceApi.GetMembersByRole(1);
                        }
                    });
                },



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
                            applicationServiceSet.shopInternalServiceApi.shopService.GetMembersByRole.send([APPMODEL.Storage.getItem("copPage_token"),$scope.model.parterID,11003,$scope.model.schoolID,20,page.pIndex]).then(function (data) {
                                if (data.Ret == 0) {
                                    $scope.model.itemList = data.Data.ViewModelList;//transformation Data
                                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndex.pageindexList(data.Data);//paging
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.shopInternalServiceApi.shopService.GetMembersByRole.send([APPMODEL.Storage.getItem("copPage_token"),$scope.model.parterID,11003,$scope.model.schoolID,20,pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    $scope.model.itemList = data.Data.ViewModelList;//transformation Data
                                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndex.pageindexList(data.Data);//paging
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.shopInternalServiceApi.shopService.GetMembersByRole.send([APPMODEL.Storage.getItem("copPage_token"),$scope.model.parterID,11003,$scope.model.schoolID,20,pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    $scope.model.itemList = data.Data.ViewModelList;//transformation Data
                                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndex.pageindexList(data.Data);//paging
                                }
                            });
                        }
                    };
                }

            }

        })(),
        /**
         * 操作
         */
        operation: function () {
            /**
             * 查询
             */
            $scope.search = function () {
                if(!$scope.model.schoolID){
                    listOfAmbassador.serviceApi.GetCurUserSchool();
                }
                else {
                    listOfAmbassador.serviceApi.GetMembersByRole(1);
                }
            };
            //删除关爱使
            $scope.remove = function (item) {
                console.log(item);
                listOfAmbassador.serviceApi.RemoveRoleMember();
            };


            //添加关爱使
            $scope.just=function () {
                $modal.open({
                    templateUrl: 'AddAmbassador.html',
                    controller: 'AddAmbassadorCtrl',
                    keyboard: false,
                    backdrop: false,
                    size:'lg',
                    resolve: {
                        items: function () {

                        },
                        service: function () {
                            return listOfAmbassador.serviceApi;
                        }
                    }
                });
            }

            $scope.search();//查询
        }
    };
    listOfAmbassador.init();//函数入口

}]);

app.controller('AddAmbassadorCtrl', ['$scope', '$modalInstance', 'items', 'service', 'toastr','applicationServiceSet', function ($scope, $modalInstance, items, service,toastr, applicationServiceSet) {



    var addAmbassador = {


        /**
         * 入口
         */
        init: function () {
            this.basic();
        },

        basic: function () {
            //变量声明
            $scope.newModel = {
                parterID:0,
                schoolID:undefined,
                itemList: []
                // isAll:false // 是否全选
            };
            $scope.toDelList = [];
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.newModel.parterID=orgModel.OrgType;
            /**
             * 查询
             */
            $scope.search = function () {
                if(!$scope.newModel.schoolID){
                    addAmbassador.serviceApi.GetCurUserSchool();
                }
                else {
                    addAmbassador.serviceApi.GetMembersForRoleSelect(1);
                }
            };

            $scope.search();//查询
            //关闭
            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            };
            // //全选
            // $scope.selectAll = function () {
            //     if($scope.newModel.isAll){
            //         $scope.newModel.itemList.forEach(function (e, i) {
            //             e.selected = true;
            //         })
            //     }else{
            //         $scope.newModel.itemList.forEach(function (e, i) {
            //             e.selected = false;
            //         })
            //     }
            //     console.log($scope.newModel.itemList);
            // };
            //全选
            $scope.selectAll = function () {
                $scope.newModel.itemList.forEach(function (t) {
                    if($scope.isAll){
                        t.check = true;
                        $scope.toDelList = $scope.newModel.itemList.map(function (t) {
                            return t.ID;
                        })
                    }else{
                        t.check = false;
                        $scope.toDelList = [];
                    }
                    console.log($scope.toDelList);
                })
            };
            //单选
            $scope.checkItem = function (item,index) {
                if(item.check){
                    $scope.toDelList.push(item.ID);
                }else{
                    $scope.toDelList.splice(index,1);
                }
                console.log($scope.toDelList);
            };
            //新增关爱使
            $scope.add = function () {
                if($scope.toDelList.length !== 0){
                    ctr._DeleteScaleAccreditList($scope.toDelList);
                }else{
                    toastr.error('请至少选中一个量表');
                    return;
                }
                // addAmbassador.serviceApi.SetMemberRoles();

            };
        },

        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {

                //根据学校获取学校的关爱使成员
                GetMembersForRoleSelect: function (index) {
                    // applicationServiceSet.shopInternalServiceApi.shopService.GetMembersForRoleSelect.send([APPMODEL.Storage.getItem('copPage_token'),$scope.newModel.schoolID,11003,20,index]).then(function (data) {
                    //     if (data.Ret == 0) {
                    //         $scope.newModel.itemList = data.Data.ViewModelList;
                    //     }
                    // });
                    applicationServiceSet.shopInternalServiceApi.shopService.GetMembersByRole.send([APPMODEL.Storage.getItem('copPage_token'),$scope.newModel.parterID,11003,$scope.newModel.schoolID,20,index]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.newModel.itemList = data.Data.ViewModelList;
                            $scope.newModel.itemList.forEach(function (e, i) {
                                e.selected = false;
                            })
                        }
                    });
                },
                //获取合作伙伴下的学校
                GetCurUserSchool:function ( ) {
                    applicationServiceSet.shopInternalServiceApi.shopService.GetCurUserSchool.send([APPMODEL.Storage.getItem('copPage_token') ,$scope.newModel.parterID ]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.newModel.schoolList=data.Data;
                            if(data.Data.length>0){
                                $scope.newModel.schoolID= data.Data[0].ID;
                                addAmbassador.serviceApi.GetMembersForRoleSelect(1);
                            }
                        }
                    });
                },
                //设置机构下成员身份
                SetMemberRoles:function ( ) {
                    applicationServiceSet.shopInternalServiceApi.shopService.SetMemberRoles.send([APPMODEL.Storage.getItem('copPage_token') ,$scope.newModel.parterID ]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("新增成功");
                        }
                    });
                },

            }
        })()
    };

    addAmbassador.init();//函数入口

}]);













