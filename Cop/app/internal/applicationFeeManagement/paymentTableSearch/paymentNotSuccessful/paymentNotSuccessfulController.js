/**
 * Created by fanweihua on 2016/12/7.
 * paymentNotSuccessfulController
 * payment is not successful
 */
app.controller('paymentNotSuccessfulController', ['$scope', '$http', '$window', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', function ($scope, $http, $window, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet) {
    /**
     * 缴费未成功查询
     * @type {{init: init, variable: variable, operation: operation, setting, serviceApi}}
     */
    var paymentNotSuccessful = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
            this.serviceApi.pageIndex();//page function
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                selectedGid: undefined,
                schoolList: [],
                selectProductPackageID: undefined,
                productPackageList: [],
                pageSize: 20,
                pageIndex: 1
            };
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * refresh service get school list
             * @param selectedGid
             */
            $scope.refreshAddresses = function (selectedGid) {
                if (selectedGid) {
                    paymentNotSuccessful.serviceApi.getOrgSchoolPage(selectedGid);//get school org pages list
                }
            };
            /**
             * 选择学校
             */
            $scope.changeGid = function () {
                paymentNotSuccessful.serviceApi.getProductListByGid();//according to the school ID get product package
            };
            /**
             * 删除学校
             */
            $scope.deleteSelectedGid = function () {
                $scope.model.selectedGid = undefined;
                $scope.model.selectProductPackageID = undefined;
            };
            /**
             * 查询
             */
            $scope.search = function () {
                paymentNotSuccessful.serviceApi.getPayUnSuccessPage();//缴费未成功明细查询
            };
            /**
             * 导出
             */
            $scope.export = function () {
                $window.location.href = urlConfig + 'Charge/v3/ChargeManage/ExportPayUnSuccess' + '?token=' + APPMODEL.Storage.getItem("copPage_token") + '&gid=' + $scope.model.selectedGid + '&productID=' + $scope.model.selectProductPackageID + '&sDate=' + paymentNotSuccessful.setting.dateChange($scope.dateStart) + '&eDate=' + paymentNotSuccessful.setting.dateChange($scope.dateOver);
            };
            this.setting.timeData();
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * date change
                 * @param date
                 * @returns {*}
                 */
                dateChange: function (date) {
                    var isEffective = date instanceof Date ? true : false;
                    if (isEffective) {
                        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                    } else {
                        return date;
                    }
                },
                timeData: function () {
                    $scope.today = function () {
                        var date = new Date();
                        $scope.dateStart = undefined;
                        $scope.dateOver = undefined;
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
                    $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
                    $scope.format = $scope.formats[1];
                },
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
            };
        })(),
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * get school org pages list
                 * @param selectedGid
                 */
                getOrgSchoolPage: function (selectedGid) {
                    applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList = data.Data;
                        }
                    });
                },
                /**
                 * according to the school ID get product package
                 */
                getProductListByGid: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetProductListByGid.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.productPackageList = data.Data;
                        }
                    });
                },
                /**
                 * 缴费未成功明细查询
                 */
                getPayUnSuccessPage: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetPayUnSuccessPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.pageSize, $scope.model.pageIndex, $scope.model.selectedGid, $scope.model.selectProductPackageID, paymentNotSuccessful.setting.dateChange($scope.dateStart), paymentNotSuccessful.setting.dateChange($scope.dateOver)]).then(function (data) {
                        if (data.Ret == 0) {
                            paymentNotSuccessful.setting.dataHandle(data.Data);//数据处理
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
                            applicationServiceSet.chargeServiceApi.chargeService.GetPayUnSuccessPage.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.pageSize, page.pIndex, $scope.model.selectedGid, $scope.model.selectProductPackageID, paymentNotSuccessful.setting.dateChange($scope.dateStart), paymentNotSuccessful.setting.dateChange($scope.dateOver)]).then(function (data) {
                                if (data.Ret == 0) {
                                    paymentNotSuccessful.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.chargeServiceApi.chargeService.GetPayUnSuccessPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.pageSize, pageNext, $scope.model.selectedGid, $scope.model.selectProductPackageID, paymentNotSuccessful.setting.dateChange($scope.dateStart), paymentNotSuccessful.setting.dateChange($scope.dateOver)]).then(function (data) {
                                if (data.Ret == 0) {
                                    paymentNotSuccessful.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.chargeServiceApi.chargeService.GetPayUnSuccessPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.pageSize, pageNext, $scope.model.selectedGid, $scope.model.selectProductPackageID, paymentNotSuccessful.setting.dateChange($scope.dateStart), paymentNotSuccessful.setting.dateChange($scope.dateOver)]).then(function (data) {
                                if (data.Ret == 0) {
                                    paymentNotSuccessful.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        }
                    };
                }
            };
        })()
    };
    paymentNotSuccessful.init();//入口函数
}]);