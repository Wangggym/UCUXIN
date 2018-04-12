/**
 * Created by fanweihua on 2017/2/8.
 * expertMaintenanceController
 * expert Maintenance
 */
'use strict';
app.controller('expertMaintenanceController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * 专家维护
     * @type {{init: init, variable: variable, operation: operation, setting, serviceApi: Function}}
     */
    var expertMaintenance = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
            this.serviceApi.pageIndex();//分页服务
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                name: undefined,
                tel: undefined,
                itemList: [],
                pIndex: 1,
                pSize: 20,
                waiting: false,
                waitSort: true
            };
            if ($stateParams.name) {
                $scope.model.name = $stateParams.name;
            }
            if ($stateParams.tel) {
                $scope.model.tel = parseInt($stateParams.tel);
            }
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * 查询
             */
            $scope.search = function () {
                $scope.model.waiting = false;
                $scope.model.waitSort = true;
                expertMaintenance.serviceApi.getExpertPages();//获取专家列表
            };
            /**
             * 删除
             * @param item
             */
            $scope.confirm = function (item) {
                expertMaintenance.serviceApi.removeExpert(item);//删除专家
            };
            /**
             * 新增
             */
            $scope.addMaintenance = function () {
                $location.url('access/app/internal/nutritionOperationManagement/expertMaintenanceDetailedInformation');
            };
            /**
             * 设置顺序值
             * @param item
             */
            $scope.settingSort = function (item) {
                if (item.ID) {
                    $scope.model.waiting = true;
                    $scope.model.waitSort = false;
                }
            };
            /**
             * 保存顺序值
             * @param item
             */
            $scope.sortSave = function (item) {
                expertMaintenance.serviceApi.setExpertSort(item);//设置专家顺序值
            };
            /**
             * 取消设置顺序值
             */
            $scope.sortCancel = function () {
                $scope.model.waiting = false;
                $scope.model.waitSort = true;
            };
            /**
             * 编辑
             * @param item
             */
            $scope.addOrEdit = function (item) {
                if (item.ID) {
                    var name = '', tel = '', url = 'access/app/internal/nutritionOperationManagement/expertMaintenanceDetailedInformation?id=' + item.ID;
                    if ($scope.model.name) {
                        name = $scope.model.name;
                        url += '&name=' + name;
                    }
                    if ($scope.model.tel) {
                        tel = $scope.model.tel;
                        url += '&tel=' + tel;
                    }
                    $location.url(url);
                }
            };
            /**
             * 关联优课优信
             */
            $scope.relation = function () {
                expertMaintenance.serviceApi.setRelationByTel();
            };
            $scope.search();
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
                 * 关联优客优信
                 */
                setRelationByTel: function () {
                    applicationServiceSet.internalServiceApi.nutritionHealth.SetRelationByTel.send(undefined, [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("关联成功");
                        }
                    });
                },

                /**
                 * 获取专家列表
                 */
                getExpertPages: function () {
                    applicationServiceSet.internalServiceApi.nutritionHealth.GetExpertPages.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.name, $scope.model.tel, $scope.model.pIndex, $scope.model.pSize]).then(function (data) {
                        if (data.Ret == 0) {
                            expertMaintenance.setting.dataHandle(data.Data.ViewModelList);//数据处理
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                },
                /**
                 * 设置专家顺序值
                 * @param item
                 */
                setExpertSort: function (item) {
                    applicationServiceSet.internalServiceApi.nutritionHealth.SetExpertSort.send(undefined, [APPMODEL.Storage.getItem('copPage_token'), item.ID, item.Sort]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.waiting = false;
                            $scope.model.waitSort = true;
                        }
                    });
                },
                /**
                 * 删除专家
                 * @param item
                 */
                removeExpert: function (item) {
                    applicationServiceSet.internalServiceApi.nutritionHealth.RemoveExpert.send(undefined, [APPMODEL.Storage.getItem('copPage_token'), item.ID]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
                            toastr.success("删除成功");
                            if ($scope.model.itemList.length == 0) {
                                $scope.$$childHead.$$nextSibling.pageList = undefined;
                            }
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
                            applicationServiceSet.internalServiceApi.nutritionHealth.GetHomeContentPages.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.title, $scope.model.columnId, page.pIndex, $scope.model.pSize]).then(function (data) {
                                if (data.Ret == 0) {
                                    expertMaintenance.setting.dataHandle(data.Data.ViewModelList);//数据处理
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
                            applicationServiceSet.internalServiceApi.nutritionHealth.GetHomeContentPages.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.title, $scope.model.columnId, pageNext, $scope.model.pSize]).then(function (data) {
                                if (data.Ret == 0) {
                                    expertMaintenance.setting.dataHandle(data.Data.ViewModelList);//数据处理
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
                            applicationServiceSet.internalServiceApi.nutritionHealth.GetHomeContentPages.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.title, $scope.model.columnId, pageNext, $scope.model.pSize]).then(function (data) {
                                if (data.Ret == 0) {
                                    expertMaintenance.setting.dataHandle(data.Data.ViewModelList);//数据处理
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
    expertMaintenance.init();//入口
}]);