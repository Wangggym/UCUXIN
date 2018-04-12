/**
 * Created by fanweihua on 2016/11/25.
 * userMenuPermissionsController
 * user menu permissions
 */
app.controller('userMenuPermissionsPartnersController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * user menu permissions
     * @type {{init: init, variable: variable, serviceApi, operation}}
     */
    var userMenuPermissions = {
        /**
         * function init
         */
        init: function () {
            this.variable();//variable
            // this.serviceApi.pageIndex();//page index
            this.serviceApi.getUserMenuPage();
            this.operation.basicOperation();//basic operation
        },
        /**
         * variable
         */
        variable: function () {
            $scope.model = {
                name: undefined,
                threeMenuName: undefined,
                itemList: [],
                pSize: 20,
                title:$stateParams.Name.split(' ')[0]+'/'+$stateParams.Name.split(' ')[1]
            };
        },
        /**
         * service gather
         */
        serviceApi: (function () {
            return {
                /**
                 * get user menu page
                 */
                getUserMenuPage: function () {
                    applicationServiceSet.internalServiceApi.userManagement.GetMenusByOrgUIDNew.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid"), $stateParams.UID,3]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.itemList = data.Data;
                        }
                    });
                },
                /**
                 * get simple org users
                 */
                // getSimpleOrgUsers: function (useId) {
                //     applicationServiceSet.internalServiceApi.userManagement.GetSimpleOrgUsers.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                //         if (data.Ret == 0) {
                //             for (var i in data.Data) {
                //                 if (useId == data.Data[i].UID) {
                //                     $scope.model.name = data.Data[i].UName;
                //                     break;
                //                 }
                //             }
                //             $scope.search();
                //         }
                //     });
                // },
                /**
                 * 增加用户菜单权限
                 */
                addUserMenu:function (item) {
                    applicationServiceSet.internalServiceApi.userManagement.AddUserMenu.send([$stateParams.UID, APPMODEL.Storage.getItem('orgid'), item.MenuID,3]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('添加成功！');
                            userMenuPermissions.serviceApi.getUserMenuPage();
                        }
                    });
                },
                /**
                 * delete user menu
                 * @param item
                 */
                deleteUserMenu: function (item) {
                    applicationServiceSet.internalServiceApi.userManagement.DeleteUserMenuNew.send([item.MenuID,APPMODEL.Storage.getItem('orgid'),$stateParams.UID,3]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('删除成功');
                            userMenuPermissions.serviceApi.getUserMenuPage();
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
                            applicationServiceSet.internalServiceApi.userManagement.GetUserMenuPage.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid"), $scope.model.name, $scope.model.threeMenuName, $scope.model.pSize, page.pIndex]).then(function (data) {
                                if (data.Ret == 0) {
                                    userMenuPermissions.operation.enumOrgTypeChange(data.Data.ViewModelList);//enum org type
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
                            applicationServiceSet.internalServiceApi.userManagement.GetUserMenuPage.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid"), $scope.model.name, $scope.model.threeMenuName, $scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    userMenuPermissions.operation.enumOrgTypeChange(data.Data.ViewModelList);//enum org type
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
                            applicationServiceSet.internalServiceApi.userManagement.GetUserMenuPage.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid"), $scope.model.name, $scope.model.threeMenuName, $scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    userMenuPermissions.operation.enumOrgTypeChange(data.Data.ViewModelList);//enum org type
                                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndex.pageindexList(data.Data);//paging
                                }
                            });
                        }
                    };
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
                     * search
                     */
                    $scope.search = function () {
                        userMenuPermissions.serviceApi.getUserMenuPage();//get user menu page
                    };
                    /**
                     * delete itemList confirm
                     * @param item
                     */
                    $scope.confirm = function (item) {
                        $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
                        userMenuPermissions.serviceApi.deleteUserMenu(item);//delete user menu
                    };
                    /**
                     * 添加权限
                     */
                    $scope.addUserMenu = function (item) {
                        userMenuPermissions.serviceApi.addUserMenu(item);
                    };
                    if ($stateParams.UID) {
                        // this.dataEdit();//data edit
                    }
                    // 返回
                    $scope.go = function () {
                        window.history.go(-1);
                    }
                },
                /**
                 * enum org type
                 */
                enumOrgTypeChange: function (data) {
                    var type = [
                        {
                            'id': 2,
                            'name': '内部运营'
                        },
                        {
                            'id': 4,
                            'name': '家校共育基金'
                        },
                        {
                            'id': 8,
                            'name': '合作伙伴'
                        },
                        {
                            'id': 16,
                            'name': '商家'
                        },
                        {
                            'id': 32,
                            'name': '教师'
                        }
                    ];
                    for (var i in data) {
                        for (var s in type) {
                            if (data[i].OrgType == type[s].id) {
                                data[i].OrgTypeName = type[s].name;
                                break;
                            }
                        }
                    }
                    $scope.model.itemList = data;//transformation Data
                },
                /**
                 * data edit
                 */
                dataEdit: function () {
                    userMenuPermissions.serviceApi.getSimpleOrgUsers($stateParams.UID);//get simple org users
                }
            };
        })()
    };
    userMenuPermissions.init();//user menu permissions function init
}]);