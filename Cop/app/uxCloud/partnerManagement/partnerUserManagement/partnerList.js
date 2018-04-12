/**
 * Created by fanweihua on 2016/11/22.
 * userManagementController
 * user management
 */
app.controller('partnerList', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * 用户管理
     * @type {{init: init, variable: variable, operation: operation, setting, serviceApi}}
     */
    var user = JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));

    var userManagement = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
            this.serviceApi.getOrgList(); //获取合作伙伴
            // this.serviceApi.getSimpleOrgUsers();//获取组织下管理员
            // this.serviceApi.pageIndex();//分页
            this.setting.tip();//tip
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                organization: undefined,
                organizationList: [],
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
             * 选择组织机构
             */
            // $scope.selectOrganization = function () {
            //     userManagement.serviceApi.getSimpleOrgUsers();//获取组织下的所有用户
            //     $scope.search();
            // };
            /**
             * 删除选择的组织机构
             */
            // $scope.deleteOrganization = function () {
            //     $scope.model.organization = undefined;
            //     $scope.model.userId = undefined;
            //     $scope.model.itemList = [];
            // };
            /**
             * 搜索
             */
            $scope.search = function () {
                userManagement.serviceApi.getSimpleOrgUsers();//获取全部组织用户分页
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
                        items: function () {
                            return $scope.model.organizationList;
                        },
                        service: function () {
                            return userManagement.serviceApi;
                        },
                        enumOrgType: function () {
                            return $scope.model.enumOrgType
                        },
                        setting: function () {
                            return userManagement.setting
                        },
                        partnerList:function () {
                            return $scope.partnerList
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
                 * 获取组织机构列表
                 */
                getOrgList: function () {
                    applicationServiceSet.internalServiceApi.userManagementInstitution.GetPartnersNew.send([APPMODEL.Storage.getItem('copPage_token'),user.CloudID]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.partnerList = data.Data;
                        }
                    });
                },
                /**
                 * 获取组织下的所有用户
                 */
                getSimpleOrgUsers: function () {
                    applicationServiceSet.internalServiceApi.userManagement.GetOrgAdmin.send([APPMODEL.Storage.getItem('copPage_token'), $scope.orgName,3]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.userList = data.Data;
                        }
                    });
                },
                /**
                 * 获取全部组织用户分页
                 */
                getOrgUserPage: function () {
                    applicationServiceSet.internalServiceApi.userManagementInstitution.GetOrgUserPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.organization, $scope.model.userId, $scope.model.pSize, $scope.model.pIndex]).then(function (data) {
                        if (data.Ret == 0) {
                            userManagement.setting.dataChange(data.Data);//数据类型转换
                        }
                    });
                },
                /**
                 * 删除用户组织
                 * @param item
                 */
                deleteOrgUser: function (item) {
                    applicationServiceSet.internalServiceApi.userManagementInstitution.DeleteOrgUser.send(undefined, [APPMODEL.Storage.getItem('copPage_token'), item.ID]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("删除成功");
                            // $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
                            $scope.model.userList.splice($scope.model.userList.indexOf(item), 1);
                        }
                    });
                },
                /**
                 * 根据手机号获取用户信息
                 */
                getUserByTel: function (tel, func) {
                    applicationServiceSet.internalServiceApi.userManagementInstitution.GetUserByTelNew.send([APPMODEL.Storage.getItem('copPage_token'), tel]).then(function (data) {
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
                    var current_org = JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
                    applicationServiceSet.internalServiceApi.userManagementInstitution.AddOrgUserNew.send([item.orgID, item.UID,3], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
//                             var userItem = {
//                                 "UID": item.UID,
//                                 "UName": item.UName
//                             };
//                             var itemListUser = {
//                                 "OrgID": item.organization,
//                                 "OrgName": item,
//                                 "OrgTypeName": item.type,
//                                 "UName": item.UName,
// //                                "OrgType": item.OrgType,
//                                 "UID": item.UID,
//                                 "Tel": item.phoneNum
//                             };
                            // $scope.model.userList.push(userItem);
                            toastr.success("添加成功");
                            // userManagement.serviceApi.getSimpleOrgUsers();//获取组织下管理员
                            // $scope.model.itemList.unshift(itemListUser);
                            func();
                        }
                    });
                },
            };
        })()
    };
    userManagement.init();//函数入口
}]);
/**
 * userManagementModalContentCtrl
 */
app.controller('userManagementModalContentCtrl', ['$scope', '$modalInstance', 'items', 'service', 'enumOrgType','partnerList', 'setting', 'toastr', function ($scope, $modalInstance, items, service, enumOrgType,partnerList, setting, toastr) {
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
                organization: undefined,
                organizationList: items,
                type: undefined,
//                OrgType: undefined,
                phoneNum: undefined,
                UID: undefined,
                UName: undefined,
                partnerList:partnerList,
                orgID: undefined
            };
        },
        operation: function () {
            /**
             * 选择模态框中的组织机构
             */
            $scope.selectOrganizationModel = function () {
                for (var i in enumOrgType) {
                    if (enumOrgType[i].id == parseInt($scope.newModel.organization)) {
                        $scope.newModel.type = enumOrgType[i].name;
//                        $scope.newModel.OrgType = enumOrgType[i].id;
                        break;
                    }
                }
            };
            /**
             * 删除组织机构
             */
            $scope.deleteOrganizationModel = function () {
                $scope.newModel.organization = undefined;
//                $scope.newModel.type = undefined;
            };
            /**
             * cancel
             */
            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            };
            /**
             * 手机号搜索
             */
            $scope.search = function () {
                if (!$scope.newModel.phoneNum) {
                    toastr.error("请输入手机号");
                    return;
                }
                service.getUserByTel($scope.newModel.phoneNum, function (data) {
                    if (!data) {
                        toastr.error("查无此用户");
                        return;
                    }
                    $scope.newModel.UName = data.Name;
                    $scope.newModel.UID = data.UID;
                });
            };
            $scope.myKeyUp = function (e) {
                var isMax = $scope.newModel.phoneNum.length == 11;
                if(isMax){
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