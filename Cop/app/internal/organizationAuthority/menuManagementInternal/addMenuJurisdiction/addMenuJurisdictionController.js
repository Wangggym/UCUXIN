/**
 * Created by fanweihua on 2017/2/8.
 * addMenuJurisdictionController
 * add Menu Jurisdiction
 */
'use strict';
app.controller('addMenuJurisdictionController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * 添加菜单
     * @type {{init: init, variable: variable, operation: operation, setting, serviceApi}}
     */
    var addMenuJurisdiction = {
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
                orgType: undefined,
                orgTypeList: [
                    {
                        name: '内部运营',
                        id: 2
                    },
                    {
                        name: '合作伙伴',
                        id: 8
                    },
                    {
                        name: '区域云二级管理员',
                        id: 64
                    }
                ],
                st: undefined,
                name: undefined,
                pMenuName: undefined,
                effective: true,
                invalid: false,
                checkedId: 0,
                itemList: [],
                pSize: 20,
                pIndex: 1
            };
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * 查询
             */
            $scope.search = function () {
                addMenuJurisdiction.serviceApi.getPageMenuSet();//获取菜单定义分页数据
            };
            /**
             * 状态选择
             */
            $scope.checkedOne = function () {
                if ($scope.model.effective) {
                    $scope.model.effective = false;
                    $scope.model.invalid = true;
                    $scope.model.checkedId = -1;
                } else {
                    $scope.model.effective = true;
                    $scope.model.invalid = false;
                    $scope.model.checkedId = 0;
                }
            };
            /**
             * 编辑
             * @param item
             */
            $scope.addOrEdit = function (item) {
                $modal.open({
                    templateUrl: 'newAddMyModalContent.html',
                    controller: 'newAddMyModalContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        service: function () {
                            return addMenuJurisdiction.serviceApi;
                        },
                        item: function () {
                            return item;
                        }
                    }
                });
            };
            /**
             * 添加菜单
             */
            $scope.addMenu = function () {
                $modal.open({
                    templateUrl: 'newAddMyModalContent.html',
                    controller: 'newAddMyModalContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        service: function () {
                            return addMenuJurisdiction.serviceApi;
                        },
                        item: function () {
                            return undefined;
                        }
                    }
                });
            };
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 数据处理
                 * @param data
                 */
                dataHandle: function (data) {
                    if (data.length == 0 || !data) {
                        $scope.model.itemList = [];
                        return;
                    }
                    for (var i in data) {
                        if (data[i].ST == 0) {
                            data[i].stName = '正常';
                        } else if (data[i].ST == -1) {
                            data[i].stName = '删除';
                        } else {
                            data[i].stName = '正常';
                        }
                        for (var s in $scope.model.orgTypeList) {
                            if (data[i].OrgType == $scope.model.orgTypeList[s].id) {
                                data[i].OrgTypeName = $scope.model.orgTypeList[s].name;
                                break;
                            }
                        }
                    }
                    $scope.model.itemList = data;
                }
            };
        })(),
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * 获取菜单定义分页数据
                 */
                getPageMenuSet: function () {
                    applicationServiceSet.internalServiceApi.menuManagement.GetPageMenuSet.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.orgType, $scope.model.checkedId, $scope.model.name, $scope.model.pMenuName, $scope.model.pSize, $scope.model.pIndex]).then(function (data) {
                        if (data.Ret == 0) {
                            addMenuJurisdiction.setting.dataHandle(data.Data.ViewModelList);//数据处理
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                },
                /**
                 * 获取父级菜单（所有菜单）
                 * @param orgType
                 * @param name
                 * @param callBack
                 */
                getParentMenu: function (orgType, name, callBack) {
                    applicationServiceSet.internalServiceApi.menuManagement.GetPageMenuSet.send([APPMODEL.Storage.getItem('copPage_token'), orgType, 0, name, undefined, 10, 1]).then(function (data) {
                        if (data.Ret == 0) {
                            callBack(data.Data.ViewModelList);
                        }
                    });
                },
                /**
                 * 添加或修改菜单定义
                 * @param id
                 * @param name
                 * @param url
                 * @param level
                 * @param pMenuID
                 * @param orgType
                 * @param seq
                 * @param callBack
                 */
                addOrUpMenu: function (id, name, url, level, pMenuID, orgType, seq, callBack) {
                    applicationServiceSet.internalServiceApi.menuManagement.AddOrUpMenu.send([id, name, 0, url, level, pMenuID, orgType, seq], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('添加成功');
                            callBack();
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
                            applicationServiceSet.internalServiceApi.menuManagement.GetPageMenuSet.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.orgType, $scope.model.checkedId, $scope.model.name, $scope.model.pMenuName, $scope.model.pSize, page.pIndex]).then(function (data) {
                                if (data.Ret == 0) {
                                    addMenuJurisdiction.setting.dataHandle(data.Data.ViewModelList);//数据处理
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
                            applicationServiceSet.internalServiceApi.menuManagement.GetPageMenuSet.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.orgType, $scope.model.checkedId, $scope.model.name, $scope.model.pMenuName, $scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    addMenuJurisdiction.setting.dataHandle(data.Data.ViewModelList);//数据处理
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
                            applicationServiceSet.internalServiceApi.menuManagement.GetPageMenuSet.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.orgType, $scope.model.checkedId, $scope.model.name, $scope.model.pMenuName, $scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    addMenuJurisdiction.setting.dataHandle(data.Data.ViewModelList);//数据处理
                                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                                    $scope.pageIndex.pageindexList(data.Data);//paging
                                }
                            });
                        }
                    };
                }
            };
        })()
    };
    addMenuJurisdiction.init();//入口
}]);

/**
 * newAddMyModalContentCtrl
 */
app.controller('newAddMyModalContentCtrl', ['$scope', '$modalInstance', 'service', 'item', function ($scope, $modalInstance, service, item) {
    $scope.newModel = {
        id: undefined,
        Name: undefined,//菜单名称
        Url: undefined,//菜单路径
        Level: undefined,
        pMenuId: undefined,
        pMenuNameList: [],
        Seq: undefined,
        LevelList: [
            {
                name: '一级菜单',
                id: 1
            },
            {
                name: '二级菜单',
                id: 2
            },
            {
                name: '三级菜单',
                id: 3
            }
        ],
        OrgType: undefined,
        OrgTypeList: [
            {
                name: '内部运营',
                id: 2
            },
            {
                name: '合作伙伴',
                id: 8
            },
            {
                name: '区域云二级管理员',
                id: 64
            }
        ]
    };
    /**
     * 查询
     * @param serach
     */
    $scope.refreshAddresses = function (serach) {
        if (serach) {
            service.getParentMenu($scope.newModel.OrgType, serach, function (data) {
                $scope.newModel.pMenuNameList = data;
            });
        }
    };
    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    /**
     * save
     */
    $scope.save = function () {
        service.addOrUpMenu($scope.newModel.id, $scope.newModel.Name, $scope.newModel.Url, $scope.newModel.Level, $scope.newModel.pMenuId, $scope.newModel.OrgType, $scope.newModel.Seq, function () {
            $modalInstance.dismiss('cancel');
        });
    };
    if (item) {
        $scope.newModel.Name = item.Name;
        $scope.newModel.Url = item.Url;
        $scope.newModel.pMenuId = item.PMenuID;
        $scope.newModel.Level = item.Level;
        $scope.newModel.Seq = item.Seq;
        $scope.newModel.OrgType = item.OrgType;
        $scope.newModel.id = item.ID;
        if (item.PMenuName && item.PMenuName != '') {
            $scope.refreshAddresses(item.PMenuName);
        }
    }
}]);