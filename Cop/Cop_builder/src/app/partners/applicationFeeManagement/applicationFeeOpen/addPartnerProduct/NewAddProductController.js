/**
 * Created by xj on 2017/3/8.
 */
app.controller('NewAddProductController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet) {
    /**
     * Add Product
     */
    var NewFunIDs = [];//局部变量找不到，所以设置全局变量
    $scope.id = $state.params.id;
    var addStuFuncService = {
         /**
         * function init
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
            this.serviceApi.getOrgSchoolPage();//get school org pages list
            //根据是否有id值来判定是修改还是增加
            if (!$scope.id) {
                this.serviceApi.getServiceItemList();//获取所有功能项及对应的业务领域
            } else {
                $scope.model.selectedGid = $stateParams.GID;
                this.serviceApi.getSingleProduct();
            }
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                selectedGid: $stateParams.SchoolId,
                schoolList: [],
                productName: undefined,
                id: 0,
                FuncIDs: []
            };
        },
        /**
         * 操作
         */
        operation: function () {
            $scope.saveAll = function () {
                $.each($scope.FuncIDs,function (e,item) {
                    if(item.IsContains){
                        NewFunIDs.push(item.FuncID);
                    }
                });
                addStuFuncService.serviceApi.addStuFuncServiceByGive();//保存
            };
            $scope.addNew = function (item, index) {
                $scope.FuncIDs[index].IsContains = true;
                // NewFunIDs.push($scope.FuncIDs[index].FuncID)
            };
            $scope.delNew = function (item, index) {
                $scope.FuncIDs[index].IsContains = false
            }
        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * get school org pages list
                 */
                getOrgSchoolPage: function () {
                    $scope.formServiceDisabled = false;
                    applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList = data.Data;
                        }
                    });
                },
                /**
                 * add Product
                 */
                addStuFuncServiceByGive: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.AddOrUpProduct.send([$scope.id, $scope.model.selectedGid, $scope.model.productName, NewFunIDs], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("保存成功");
                            $state.go('access.app.partner.applicationFeeOpen.addPartnerProduct');
                        }
                    });
                },
                /**
                 * 获取所有功能项及对应的业务领域
                 */
                getServiceItemList: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetFuncAppList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.FuncIDs = data.Data;
                        }
                    });
                },
                /**
                 *根据ID获取单个产品信息
                 */
                getSingleProduct: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetSigleProdutInfo.send([APPMODEL.Storage.getItem('copPage_token'), $scope.id]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.FuncIDs = data.Data.ProductFuncs;
                            $scope.model.productName = data.Data.Name;
                        }
                    });
                },
                /**
                 * 删除收费功能项
                 * @param item
                 */
                deleteUserMenu: function (item) {
                    applicationServiceSet.internalServiceApi.userManagement.DeleteUserMenu.send([], [$scope.model.nameId, APPMODEL.Storage.getItem("orgid"), item.MenuID]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('删除成功');
                            item.IsOwn = false;
                            item.IsOwnName = '未包含';
                            item.IsOwnColor = {
                                'color': 'red'
                            };
                        }
                    });
                },
                /**
                 * 添加收费功能项
                 * @param item
                 */
                addUserMenu: function (item) {
                    applicationServiceSet.internalServiceApi.userManagement.AddUserMenu.send([], [$scope.model.nameId, APPMODEL.Storage.getItem("orgid"), item.MenuID]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('添加成功');
                            item.IsOwn = true;
                            item.IsOwnName = '已包含';
                            item.IsOwnColor = {
                                'color': 'green'
                            };
                        }
                    });
                },

            };
        })()
    };
    addStuFuncService.init();//function init
}]);