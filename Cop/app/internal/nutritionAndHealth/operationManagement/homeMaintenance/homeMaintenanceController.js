/**
 * Created by fanweihua on 2017/2/7.
 * homeMaintenanceController
 * home Maintenance
 */
'use strict';
app.controller('homeMaintenanceController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * 首页维护
     * @type {{init: init, variable: variable, operation: operation, setting, serviceApi}}
     */
    var homeMaintenance = {
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
                title: undefined,//标题
                columnList: [],//栏目列表
                columnId: undefined,//栏目ID
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
                homeMaintenance.serviceApi.getHomeContentPages();//获取所有主页列表信息
            };
            /**
             * 预览
             * @param item
             */
            $scope.detailedTemplate = function (item) {
                $modal.open({
                    templateUrl: 'detailedTemplate.html',
                    controller: 'detailedTemplateCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return item;
                        }
                    }
                });
            };
            /**
             * 删除
             * @param item
             */
            $scope.confirm = function (item) {
                if (item.CMSID) {
                    homeMaintenance.serviceApi.removeHomeContent(item);//删除记录
                }
            };
            $scope.search();
            homeMaintenance.serviceApi.getColumnList();//获取营养健康下所有栏目列表
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
                    if (data && data.length > 0) {
                        $scope.model.itemList = data;
                    } else {
                        $scope.model.itemList = [];
                    }
                }
            };
        })(),
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * 获取所有主页列表信息
                 */
                getHomeContentPages: function () {
                    applicationServiceSet.internalServiceApi.nutritionHealth.GetHomeContentPages.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.title, $scope.model.columnId, $scope.model.pIndex, $scope.model.pSize]).then(function (data) {
                        if (data.Ret == 0) {
                            homeMaintenance.setting.dataHandle(data.Data.ViewModelList);//数据处理
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                },
                /**
                 * 获取营养健康下所有栏目列表
                 */
                getColumnList: function () {
                    applicationServiceSet.internalServiceApi.nutritionHealth.GetColumnList.send([APPMODEL.Storage.getItem('copPage_token'), 13]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.columnList = data.Data;
                        }
                    });
                },
                /**
                 * 删除记录
                 * @param item
                 */
                removeHomeContent: function (item) {
                    applicationServiceSet.internalServiceApi.nutritionHealth.RemoveHomeContent.send([APPMODEL.Storage.getItem('copPage_token'), item.CMSID]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
                            toastr.success('删除成功');
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
                                    homeMaintenance.setting.dataHandle(data.Data.ViewModelList);//数据处理
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
                                    homeMaintenance.setting.dataHandle(data.Data.ViewModelList);//数据处理
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
                                    homeMaintenance.setting.dataHandle(data.Data.ViewModelList);//数据处理
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
    homeMaintenance.init();//函数入口
}]);
/**
 * 效果预览
 */
app.controller('detailedTemplateCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    'use strict';
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    setTimeout(function () {
        new QRCode(document.getElementById("qrCode"), {
            width: 200,
            height: 200
        }).makeCode(items.Url);
    }, 100);
}]);