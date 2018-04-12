/**
 * Created by fanweihua on 2017/3/15.
 * addPushPaymentPushSetController
 * 查看推送日志
 */
app.controller('addPushPaymentPushSetController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    /**
     * @type {{init: init, variable: variable, operation: operation, serviceApi: {getProductListByGid, pageIndex}}}
     */
    var addPushPaymentPushSet = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
            this.serviceApi.pageIndex();//page function
            this.serviceApi.getPushRecordPage();//获取分页推送日志记录
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                itemList: [],
                pageSize: 20,
                pageIndex: 1
            };
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * 返回
             */
            $scope.historyBack = function () {
                $window.history.back();
            };
            /**
             * 详情
             * @param item
             */
            $scope.details = function (item) {
                $modal.open({
                    templateUrl: 'detailsModal.html',
                    controller: 'detailsModalCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        item: function () {
                            return item;
                        }
                    }
                });
            }
        },
        setting: (function () {
            return {
                /**
                 * 数据处理
                 */
                dataHandle: function (data) {
                    if (data.ViewModelList) {
                        $scope.model.itemList = data.ViewModelList;//transformation Data
                        $scope.pageIndex.pages = data.Pages;//paging pages
                        $scope.pageIndex.pageindexList(data);//paging
                    }
                }
            }
        })(),
        serviceApi: (function () {
            return {
                /**
                 * 获取分页推送日志记录
                 */
                getPushRecordPage: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetPushRecordPage.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.gid, 3, $scope.model.pageIndex, $scope.model.pageSize]).then(function (data) {
                        if (data.Ret == 0) {
                            addPushPaymentPushSet.setting.dataHandle(data.Data);//数据处理
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
                            applicationServiceSet.chargeServiceApi.chargeService.GetPushRecordPage.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.gid, 3, page.pIndex, $scope.model.pageSize]).then(function (data) {
                                if (data.Ret == 0) {
                                    addPushPaymentPushSet.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.chargeServiceApi.chargeService.GetPushRecordPage.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.gid, 3, pageNext, $scope.model.pageSize]).then(function (data) {
                                if (data.Ret == 0) {
                                    addPushPaymentPushSet.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.chargeServiceApi.chargeService.GetPushRecordPage.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.gid, 3, pageNext, $scope.model.pageSize]).then(function (data) {
                                if (data.Ret == 0) {
                                    addPushPaymentPushSet.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        }
                    };
                }
            }
        })()
    };
    addPushPaymentPushSet.init();//入口
}]);
app.controller('detailsModalCtrl', ['$scope', '$modalInstance', 'item', function ($scope, $modalInstance, item) {
    $scope.modal = {
        details: item.Msg
    };
    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
}]);