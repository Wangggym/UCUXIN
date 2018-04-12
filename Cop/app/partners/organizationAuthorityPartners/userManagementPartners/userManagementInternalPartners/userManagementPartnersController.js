/**
 * Created by fanweihua on 2016/11/25.
 * userManagementPartnersController
 * user management partners
 */
app.controller('userManagementPartnersController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * 用户管理
     * @type {{init: init, variable: variable, operation: operation, setting, serviceApi}}
     */
    var userManagement = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
            this.serviceApi.pageIndex();//分页
            this.serviceApi.getSimpleOrgUsers();//获取组织下的所有用户
            this.setting.tip();//tip
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                userId: undefined,
                userList: [],
                itemList: [],
                pSize: 20,
                pIndex: 1,
                enumOrgType: [
                    {
                        "id": 2,
                        "name": "内部运营"
                    },
                    {
                        "id": 4,
                        "name": "家校共育基金"
                    },
                    {
                        "id": 8,
                        "name": "合作伙伴"
                    },
                    {
                        "id": 16,
                        "name": "商家"
                    },
                    {
                        "id": 32,
                        "name": "教师"
                    }
                ]
            };
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * 搜索
             */
            $scope.search = function () {
                userManagement.serviceApi.getOrgUserPage();//获取全部组织用户分页
            };
            /**
             * 删除确认
             * @param item
             */
            $scope.confirm = function (item) {
                if (item) {
                    userManagement.serviceApi.deleteOrgUser(item);//删除用户组织
                }
            };
            /**
             * 添加用户
             */
            $scope.addUser = function () {
                $modal.open({
                    templateUrl: 'userManagementModalContent.html',
                    controller: 'userManagementModalContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        service: function () {
                            return userManagement.serviceApi;
                        },
                        enumOrgType: function () {
                            return $scope.model.enumOrgType
                        },
                        setting: function () {
                            return userManagement.setting
                        }
                    }
                });
            }
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 数据类型转换
                 * @param data
                 */
                dataChange: function (data) {
                    for (var i in data.ViewModelList) {
                        for (var s in $scope.model.enumOrgType) {
                            if ($scope.model.enumOrgType[s].id == data.ViewModelList[i].OrgType) {
                                data.ViewModelList[i].OrgTypeName = $scope.model.enumOrgType[s].name;
                                break;
                            }
                        }
                    }
                    $scope.model.itemList = data.ViewModelList;
                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
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
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * 获取全部组织用户
                 */
                getSimpleOrgUsers: function () {
                    applicationServiceSet.internalServiceApi.userManagement.GetOrgAdmin.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid"),3]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.userList = data.Data;
                        }
                    });
                },
                /**
                 * 获取全部组织用户分页
                 */
                // getOrgUserPage: function () {
                //     applicationServiceSet.internalServiceApi.userManagementInstitution.GetOrgAdmin.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid"),3]).then(function (data) {
                //         if (data.Ret == 0) {
                //             userManagement.setting.dataChange(data.Data);//数据类型转换
                //         }
                //     });
                // },
                /**
                 * 删除用户组织
                 * @param item
                 */
                deleteOrgUser: function (item) {
                    applicationServiceSet.internalServiceApi.userManagementInstitution.DeleteOrgUser.send(undefined, [APPMODEL.Storage.getItem('copPage_token'),item.ID]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("删除成功");
                            $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
                            $scope.model.userList.splice($scope.model.userList.indexOf(item), 1);
                            $scope.model.userId = undefined;
                        }
                    });
                },
                /**
                 * 根据手机号获取用户信息
                 */
                getUserByTel: function (tel, func) {
                    applicationServiceSet.internalServiceApi.userManagementInstitution.GetUserByTel.send([APPMODEL.Storage.getItem('applicationToken'), tel]).then(function (data) {
                        if (data.Ret == 0) {
                            func(data.Data);
                        }
                    });
                },
                /**
                 * 给用户添加组织
                 * @param item
                 * @param func
                 */
                addOrgUser: function (item, func) {
                    applicationServiceSet.internalServiceApi.userManagementInstitution.AddOrgUserNew.send([item.OrgID, item.UID,3], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            userManagement.serviceApi.getSimpleOrgUsers();//获取组织下的所有用户
                            func();
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
                            applicationServiceSet.internalServiceApi.userManagementInstitution.GetOrgUserPage.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid"), $scope.model.userId, $scope.model.pSize, page.pIndex]).then(function (data) {
                                if (data.Ret == 0) {
                                    userManagement.setting.dataChange(data.Data);//数据类型转换
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.userManagementInstitution.GetOrgUserPage.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid"), $scope.model.userId, $scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    userManagement.setting.dataChange(data.Data);//数据类型转换
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.userManagementInstitution.GetOrgUserPage.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid"), $scope.model.userId, $scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    userManagement.setting.dataChange(data.Data);//数据类型转换
                                }
                            });
                        }
                    };
                }
            };
        })()
    };
    userManagement.init();//函数入口
}]);
/**
 * userManagementModalContentCtrl
 */
app.controller('userManagementModalContentCtrl', ['$scope', '$modalInstance', 'service', 'enumOrgType', 'setting', 'toastr', function ($scope, $modalInstance, service, enumOrgType, setting, toastr) {
    /**
     * 模态框添加用户
     * @type {{init: init, variable: variable, operation: operation}}
     */
    var userManagementModalContentCtrl = {
        init: function () {
            this.variable();
            this.operation();
            setting.tip();
        },
        variable: function () {
            $scope.newModel = {
                type: undefined,
                OrgType: undefined,
                OrgID:sessionStorage.getItem('orgid'),
                phoneNum: undefined,
                UID: undefined,
                UName: undefined
            };
        },
        operation: function () {
            /**
             * cancel
             */
            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            };
            /**
             * 手机号搜索
             */
            $scope.serchUser = function (text) {
                if(text.length===11){
                    $scope.search();
                }
            };
            $scope.search = function () {
                if(!$scope.newModel.phoneNum || $scope.newModel.phoneNum == ''){
                    toastr.error("手机号不能为空！");
                    return;
                }
                service.getUserByTel($scope.newModel.phoneNum, function (data) {
                    if (!data) {
                        toastr.error("查无此用户");
                        return;
                    }
                    $scope.newModel.UID = data.UID;
                    $scope.newModel.UName = data.Name;
                });
            };
            $scope.myKeyUp = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.search();
                }
            };
            /**
             * save
             */
            $scope.save = function () {
                service.addOrgUser($scope.newModel, function () {
                    $modalInstance.dismiss('cancel');
                });//给用户添加组织
            };
        }
    };
    setTimeout(function () {
        $(".modal-content").draggable({ containment: "#app", scroll: false });
    }, 100);
    userManagementModalContentCtrl.init();
}]);