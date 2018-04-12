/**
 * Created by fanweihua on 2016/10/13.
 * paymentCenterOrderController
 * payment center order
 */
app.controller('paymentCenterOrderController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * payment center order function init
     */
    var paymentCenterOrder = (function () {
        /**
         * init function
         */
        var init = function () {
            variable();//variable declaration
            operation.basic();
            serviceApi.pageIndex();//paging function
        };
        /**
         * variable declaration
         */
        var variable = function () {
            $scope.model = {
                chargeID: undefined,
                orderNo: undefined,
                payStatus: undefined,
                payStatusList: [
                    {
                        "id": 0,
                        "name": '成功'
                    },
                    {
                        "id": 1,
                        "name": '失败'
                    },
                    {
                        "id": 2,
                        "name": '全部'
                    }
                ],
                callbackStatusList: [
                    {
                        "id": 0,
                        "name": '成功'
                    },
                    {
                        "id": 1,
                        "name": '失败'
                    },
                    {
                        "id": 2,
                        "name": '全部'
                    }
                ],
                callbackStatus: undefined,
                itemList: [],
                pageSize: 20
            };
        };
        /**
         * service aggregate
         */
        var serviceApi = {
            /**
             * get pages charge
             */
            getPagesCharge: function () {
                operation.dataJudge();//data judge handle
                applicationServiceSet.internalServiceApi.applicationFee.GetPagesCharge.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.chargeID, $scope.model.orderNo, operation.dateChange($scope.dateStart), operation.dateChange($scope.dateOver), $scope.model.pageSize, 1, $scope.model.payStatus, $scope.model.callbackStatus]).then(function (data) {
                    if (data.Ret == 0) {
                        operation.dataHandle(data.Data.ViewModelList);//data handle
                        $scope.pageIndex.pages = data.Data.Pages;//paging pages
                        $scope.pageIndex.pageindexList(data.Data);//paging
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
                        operation.dataJudge();//data judge handle
                        applicationServiceSet.internalServiceApi.applicationFee.GetPagesCharge.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.chargeID, $scope.model.orderNo, operation.dateChange($scope.dateStart), operation.dateChange($scope.dateOver), $scope.model.pageSize, page.pIndex, $scope.model.payStatus, $scope.model.callbackStatus]).then(function (data) {
                            if (data.Ret == 0) {
                                operation.dataHandle(data.Data.ViewModelList);//data handle
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
                        operation.dataJudge();//data judge handle
                        applicationServiceSet.internalServiceApi.applicationFee.GetPagesCharge.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.chargeID, $scope.model.orderNo, operation.dateChange($scope.dateStart), operation.dateChange($scope.dateOver), $scope.model.pageSize, pageNext, $scope.model.payStatus, $scope.model.callbackStatus]).then(function (data) {
                            if (data.Ret == 0) {
                                operation.dataHandle(data.Data.ViewModelList);//data handle
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
                        operation.dataJudge();//data judge handle
                        applicationServiceSet.internalServiceApi.applicationFee.GetPagesCharge.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.chargeID, $scope.model.orderNo, operation.dateChange($scope.dateStart), operation.dateChange($scope.dateOver), $scope.model.pageSize, pageNext, $scope.model.payStatus, $scope.model.callbackStatus]).then(function (data) {
                            if (data.Ret == 0) {
                                operation.dataHandle(data.Data.ViewModelList);//data handle
                                $scope.pageIndex.pages = data.Data.Pages;//paging pages
                                $scope.pageIndex.pageindexList(data.Data);//paging
                            }
                        });
                    }
                };
            }
        };
        /**
         * basic operation
         * @type {{basic: basic, dateChange: dateChange, tip: tip}}
         */
        var operation = {
            basic: function () {
                controls.timeData();//time controls
                /**
                 * search
                 */
                $scope.search = function () {
                    serviceApi.getPagesCharge();//get pages charge
                };
            },
            /**
             * data handle
             * @param data
             */
            dataHandle: function (data) {
                for (var i in data) {
                    if (data[i].PayStatus) {
                        data[i].PayStatusName = '成功';
                    } else {
                        data[i].PayStatusName = '失败';
                    }
                    if (data[i].CallBackStatus) {
                        data[i].CallBackStatusName = '成功';
                    } else {
                        data[i].CallBackStatusName = '失败';
                    }
                }
                $scope.model.itemList = data;
            },
            /**
             * data judge handle
             */
            dataJudge: function () {
                $scope.model.chargeID = $scope.model.chargeID ? $scope.model.chargeID : undefined;
                $scope.model.orderNo = $scope.model.orderNo ? $scope.model.orderNo : undefined;
            },
            /**
             * transformation confirm write off data
             */
            transformationConfirmWriteOff: function () {
                $scope.model.arrIdList = [];
                if ($scope.model.applicationFeeList) {
                    for (var i in $scope.model.applicationFeeList) {
                        $scope.model.arrIdList.push($scope.model.applicationFeeList[i].ID);
                    }
                }
            },
            /**
             * date change
             * @param date
             * @returns {string}
             */
            dateChange: function (date) {
                var isEffective = date instanceof Date ? true : false;
                if (isEffective) {
                    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                } else {
                    return date;
                }
            },
            /**
             * tip
             */
            tip: function () {
                toastr.toastrConfig.positionClass = 'toast-top-center';
                toastr.toastrConfig.timeOut = 2000;
            }
        };
        /**
         * plug-in unit
         * @type {{timeData: timeData}}
         */
        var controls = {
            /**
             * time controls
             */
            timeData: function () {
                $scope.today = function () {
                    var date = new Date();
                    $scope.dateStart = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                    $scope.dateOver = $scope.dateStart;
                };
                $scope.today();
                $scope.clear = function () {
                    $scope.dt = null;
                };
                // Disable weekend selection
                $scope.disabled = function (date, mode) {
                    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
                };
                $scope.toggleMin = function () {
                    $scope.minDate = $scope.minDate ? null : new Date();
                };
                $scope.toggleMin();
                $scope.openStart = function ($event) {
                    $scope.openedOver = false;
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.openedStart = true;
                };
                $scope.openOver = function ($event) {
                    $scope.openedStart = false;
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.openedOver = true;
                };
                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1,
                    class: 'datepicker'
                };
                $scope.initDate = new Date('2016-15-20');
                $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = $scope.formats[1];
            }
        };
        /**
         * return function init
         */
        return {
            init: init
        }
    })();
    paymentCenterOrder.init();//application fee verification function init
}]);