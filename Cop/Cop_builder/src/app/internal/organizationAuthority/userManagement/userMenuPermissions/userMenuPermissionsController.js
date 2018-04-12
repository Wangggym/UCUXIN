/**
 * Created by fanweihua on 2016/11/23.
 * userMenuPermissionsController
 * user menu permissions
 */
app.controller('userMenuPermissionsController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
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
            this.serviceApi.pageIndex();//page index
            this.serviceApi.getOrgList();//get org list
            this.operation.basicOperation();//basic operation
        },
        /**
         * variable
         */
        variable: function () {
            $scope.model = {
                partners: undefined,
                partnersList: [],
                name: undefined,
                threeMenuName: undefined,
                itemList: [],
                pSize: 20
            };
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
                 * get user menu page
                 */
                getUserMenuPage: function () {
                    applicationServiceSet.internalServiceApi.userManagement.GetUserMenuPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.partners, $scope.model.name, $scope.model.threeMenuName, $scope.model.pSize, 1]).then(function (data) {
                        if (data.Ret == 0) {
                            userMenuPermissions.operation.enumOrgTypeChange(data.Data.ViewModelList);//enum org type
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                },
                /**
                 * get simple org users
                 */
                getSimpleOrgUsers: function (useId) {
                    applicationServiceSet.internalServiceApi.userManagement.GetSimpleOrgUsers.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.partners]).then(function (data) {
                        if (data.Ret == 0) {
                            for (var i in data.Data) {
                                if (useId == data.Data[i].UID) {
                                    $scope.model.name = data.Data[i].UName;
                                    break;
                                }
                            }
                            $scope.search();
                        }
                    });
                },
                /**
                 * delete user menu
                 * @param item
                 */
                deleteUserMenu: function (item) {
                    applicationServiceSet.internalServiceApi.userManagement.DeleteUserMenu.send([], [item.UID, item.OrgID, item.MenuID]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('删除成功');
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
                            applicationServiceSet.internalServiceApi.userManagement.GetUserMenuPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.partners, $scope.model.name, $scope.model.threeMenuName, $scope.model.pSize, page.pIndex]).then(function (data) {
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
                            applicationServiceSet.internalServiceApi.userManagement.GetUserMenuPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.partners, $scope.model.name, $scope.model.threeMenuName, $scope.model.pSize, pageNext]).then(function (data) {
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
                            applicationServiceSet.internalServiceApi.userManagement.GetUserMenuPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.partners, $scope.model.name, $scope.model.threeMenuName, $scope.model.pSize, pageNext]).then(function (data) {
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
                     * delete partenrs
                     */
                    $scope.deletePartners = function () {
                        $scope.model.partners = undefined;
                        $scope.model.name = undefined;
                    };
                    /**
                     * delete itemList confirm
                     * @param item
                     */
                    $scope.confirm = function (item) {
                        $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
                        userMenuPermissions.serviceApi.deleteUserMenu(item);//delete user menu
                    };
                    if ($stateParams.OrgID) {
                        this.dataEdit();//data edit
                    } else if (!$stateParams.OrgID && APPMODEL.Storage.getItem('userNameInfo')) {
                        this.newAddUserNameInfo();//new add user name info
                    } else {
                        delete APPMODEL.Storage.userNameInfo;
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
                    $scope.model.partners = $stateParams.OrgID;
                    userMenuPermissions.serviceApi.getSimpleOrgUsers($stateParams.UID);//get simple org users
                },
                /**
                 * new add user name info
                 */
                newAddUserNameInfo: function () {
                    var userNameInfo = JSON.parse(APPMODEL.Storage.getItem('userNameInfo'));
                    $scope.model.partners = userNameInfo.partners;
                    userMenuPermissions.serviceApi.getSimpleOrgUsers(userNameInfo.nameId);//get simple org users
                }
            };
        })()
    };
    userMenuPermissions.init();//user menu permissions function init
}]);