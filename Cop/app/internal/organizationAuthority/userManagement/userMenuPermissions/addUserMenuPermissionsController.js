/**
 * Created by fanweihua on 2016/11/23.
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
            this.serviceApi.getOrgList();//get org list
        },
        /**
         * variable
         */
        variable: function () {
            $scope.model = {
                partners: undefined,
                partnersList: [],
                nameId: undefined,
                itemList: [],
                nameList: [],
                headName: undefined
            };
            if ($stateParams.OrgID) {
                $scope.model.headName = '编辑用户菜单权限';
            } else {
                $scope.model.headName = '添加用户菜单权限';
            }
        },
        /**
         * service gather
         */
        serviceApi: (function () {
            return {
                /**
                 * get org list
                 */
                getOrgList: function () {
                    applicationServiceSet.internalServiceApi.paymentTableSearch.getOrganization.send([APPMODEL.Storage.getItem('copPage_token'), 0]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.partnersList = data.Data;
                        }
                    });
                },
                /**
                 * get simple org users
                 */
                getSimpleOrgUsers: function () {
                    applicationServiceSet.internalServiceApi.userManagement.GetSimpleOrgUsers.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.partners]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.nameList = data.Data;
                        }
                    });
                },
                /**
                 * get menus by org uid
                 */
                getMenusByOrgUID: function () {
                    applicationServiceSet.internalServiceApi.userManagement.GetMenusByOrgUID.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.partners, $scope.model.nameId]).then(function (data) {
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
                    applicationServiceSet.internalServiceApi.userManagement.DeleteUserMenu.send([], [$scope.model.nameId, $scope.model.partners, item.MenuID]).then(function (data) {
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
                    applicationServiceSet.internalServiceApi.userManagement.AddUserMenu.send([], [$scope.model.nameId, $scope.model.partners, item.MenuID]).then(function (data) {
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
                     * select partner
                     */
                    $scope.selectPartner = function () {
                        $scope.model.itemList = [];
                        $scope.model.nameId = undefined;
                        addUserMenuPermissions.serviceApi.getSimpleOrgUsers();//get simple org users
                    };
                    /**
                     * delete partners
                     */
                    $scope.deletePartners = function () {
                        $scope.model.itemList = [];
                        $scope.model.partners = undefined;
                        $scope.model.nameId = undefined;
                    };
                    /**
                     * select user name
                     */
                    $scope.selectUseName = function () {
                        addUserMenuPermissions.serviceApi.getMenusByOrgUID();//get menus by org uid
                        var userNameInfo = {
                            nameId: $scope.model.nameId,
                            partners: $scope.model.partners
                        };
                        APPMODEL.Storage.setItem('userNameInfo', JSON.stringify(userNameInfo));
                    };
                    /**
                     * delete name id
                     */
                    $scope.deleteNameId = function () {
                        $scope.model.nameId = undefined;
                        $scope.model.itemList = [];
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
                    if ($stateParams.OrgID) {
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
                    $scope.model.partners = $stateParams.OrgID;
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