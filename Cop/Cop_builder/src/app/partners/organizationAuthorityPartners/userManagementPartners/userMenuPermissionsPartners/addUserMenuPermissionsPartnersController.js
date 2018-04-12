/**
 * Created by fanweihua on 2016/9/24.
 * addUserMenuPermissionsController
 * add user menu permissions
 */
app.controller('addUserMenuPermissionsController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * add user menu permissions
     * @type {{init: init, variable: variable, serviceApi, operation}}
     */
    var addUserMenuPermissions = {
        /**
         * function init
         */
        init: function () {
            this.variable();//variable
            this.operation.basicOperation();//basic operation
        },
        /**
         * variable
         */
        variable: function () {
            $scope.model = {
                nameId: undefined,
                itemList: [],
                nameList: [],
                headName: undefined
            };
            if ($stateParams.UID) {
                $scope.model.headName = '编辑用户菜单权限';
            } else {
                $scope.model.headName = '添加用户菜单权限';
                addUserMenuPermissions.serviceApi.getSimpleOrgUsers();//get simple org users
            }
        },
        /**
         * service gather
         */
        serviceApi: (function () {
            return {
                /**
                 * get simple org users
                 */
                getSimpleOrgUsers: function () {
                    applicationServiceSet.internalServiceApi.userManagement.GetSimpleOrgUsers.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.nameList = data.Data;
                        }
                    });
                },
                /**
                 * get menus by org uid
                 */
                getMenusByOrgUID: function () {
                    applicationServiceSet.internalServiceApi.userManagement.GetMenusByOrgUID.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid"), $scope.model.nameId]).then(function (data) {
                        if (data.Ret == 0) {
                            addUserMenuPermissions.operation.isOwnDataChange(data.Data);//is own data change
                        }
                    });
                },
                /**
                 * delete user menu
                 * @param item
                 */
                deleteUserMenu: function (item) {
                    applicationServiceSet.internalServiceApi.userManagement.DeleteUserMenu.send([], [$scope.model.nameId, APPMODEL.Storage.getItem("orgid"), item.MenuID]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('删除成功');
                            item.IsOwn = false;
                            item.IsOwnName = '否';
                            item.IsOwnColor = {
                                'color': 'red'
                            };
                        }
                    });
                },
                /**
                 * add user menu
                 * @param item
                 */
                addUserMenu: function (item) {
                    applicationServiceSet.internalServiceApi.userManagement.AddUserMenu.send([], [$scope.model.nameId, APPMODEL.Storage.getItem("orgid"), item.MenuID]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('添加成功');
                            item.IsOwn = true;
                            item.IsOwnName = '是';
                            item.IsOwnColor = {
                                'color': 'green'
                            };
                        }
                    });
                }
            };
        })(),
        /**
         * operation
         */
        operation: (function () {
            return {
                /**
                 * basic
                 */
                basicOperation: function () {
                    /**
                     * select user name
                     */
                    $scope.selectUseName = function () {
                        for (var i in $scope.model.nameList) {
                            if ($scope.model.nameId == $scope.model.nameList[i].UID) {
                                $stateParams.UID = $scope.model.nameList[i].UID;
                                $stateParams.Name = $scope.model.nameList[i].UName;
                                break;
                            }
                        }
                        addUserMenuPermissions.serviceApi.getMenusByOrgUID();//get menus by org uid
                    };
                    /**
                     * delete name id
                     */
                    $scope.deleteNameId = function () {
                        $scope.model.nameId = undefined;
                        $scope.model.itemList = [];
                    };
                    /**
                     * 返回
                     */
                    $scope.returnIndex = function () {
                        $location.url('access/app/partner/userManagementPartner/userMenuPermissionsPartners?UID=' + $stateParams.UID + '&Name=' + $stateParams.Name);
                    };
                    /**
                     * confirm delete
                     * @param item
                     */
                    $scope.confirm = function (item) {
                        addUserMenuPermissions.serviceApi.deleteUserMenu(item);//delete user menu
                    };
                    /**
                     * add item is own
                     * @param item
                     */
                    $scope.addItemIsOwn = function (item) {
                        addUserMenuPermissions.serviceApi.addUserMenu(item);//delete user menu
                    };
                    if ($stateParams.UID) {
                        this.dataEdit();//data edit
                    } else {
                        delete APPMODEL.Storage.userNameInfo;
                    }
                    this.tip();//tip
                },
                /**
                 * data edit
                 */
                dataEdit: function () {
                    $scope.model.nameId = $stateParams.UID;
                    addUserMenuPermissions.serviceApi.getSimpleOrgUsers();//get simple org users
                    $scope.selectUseName();
                },
                /**
                 * is own data change
                 * @param data
                 */
                isOwnDataChange: function (data) {
                    for (var i in data) {
                        if (!data[i].IsOwn) {
                            data[i].IsOwnName = '否';
                            data[i].IsOwnColor = {
                                'color': 'red'
                            };
                        } else {
                            data[i].IsOwnName = '是';
                            data[i].IsOwnColor = {
                                'color': 'green'
                            };
                        }
                    }
                    $scope.model.itemList = data;
                },
                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 500;
                }
            };
        })()
    };
    addUserMenuPermissions.init();
}]);