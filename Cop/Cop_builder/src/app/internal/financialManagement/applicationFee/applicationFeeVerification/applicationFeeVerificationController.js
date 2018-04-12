/**
 * Created by fanweihua on 2016/9/7.
 * applicationFeeVerificationController
 * application fee verification
 */
app.controller('applicationFeeVerificationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * application fee verification function init
     */
    var applicationFeeVerification = (function () {
        /**
         * init function
         */
        var init = function () {
            variable();//variable declaration
            serviceApi.getOrgList();//get org list from service aggregate
            operation.basic();
            serviceApi.pageIndex();//paging function
        };
        /**
         * variable declaration
         */
        var variable = function () {
            $scope.model = {
                partners: undefined,
                typeId: undefined,
                disableConfirm: undefined,
                applicationFeeList: [],
                typeList: [],
                partnersList: [],
                arrIdList: [],
                pageIndex: 25
            };
            $scope.model.typeList = [
                {
                    'name': '已核销',
                    'id': 1
                },
                {
                    'name': '未核销',
                    'id': 2
                }
            ];
            $scope.model.typeId = 2;
            $scope.disableComfirm = true;
            $scope.model.disableConfirm = true;
        };
        /**
         * service aggregate
         */
        var serviceApi = {
            /**
             * get org list
             */
            getOrgList: function () {
                applicationServiceSet.internalServiceApi.paymentTableSearch.getOrganization.send([APPMODEL.Storage.getItem('copPage_token'), 8]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.model.partnersList = data.Data;
                    }
                });
            },
            /**
             * get write off list
             */
            getWriteOffList: function () {
                if (!$scope.model.typeId) {
                    $scope.model.typeId = 0;
                }
                applicationServiceSet.internalServiceApi.applicationFee.GetWriteOffList.send([APPMODEL.Storage.getItem('copPage_token'), operation.dateChange($scope.dateStart), operation.dateChange($scope.dateOver), $scope.model.typeId, $scope.model.partners, $scope.model.pageIndex, 1]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.model.applicationFeeList = data.Data.ViewModelList;//transformation Data
                        $scope.pageIndex.pages = data.Data.Pages;//paging pages
                        $scope.pageIndex.pageindexList(data.Data);//paging
                    }
                });
            },
            /**
             * confirm write off
             */
            confirmWriteOff: function () {
                applicationServiceSet.internalServiceApi.applicationFee.ConfirmWriteOffByCondition.send([APPMODEL.Storage.getItem('copPage_token'), operation.dateChange($scope.dateStart), operation.dateChange($scope.dateOver), $scope.model.partners]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success("确认核销成功");
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
                        applicationServiceSet.internalServiceApi.applicationFee.GetWriteOffList.send([APPMODEL.Storage.getItem('copPage_token'), operation.dateChange($scope.dateStart), operation.dateChange($scope.dateOver), $scope.model.typeId, $scope.model.partners, $scope.model.pageIndex, page.pIndex]).then(function (data) {
                            if (data.Ret == 0) {
                                $scope.model.applicationFeeList = data.Data.ViewModelList;//transformation Data
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
                        applicationServiceSet.internalServiceApi.applicationFee.GetWriteOffList.send([APPMODEL.Storage.getItem('copPage_token'), operation.dateChange($scope.dateStart), operation.dateChange($scope.dateOver), $scope.model.typeId, $scope.model.partners, $scope.model.pageIndex, pageNext]).then(function (data) {
                            if (data.Ret == 0) {
                                $scope.model.applicationFeeList = data.Data.ViewModelList;//transformation Data
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
                        applicationServiceSet.internalServiceApi.applicationFee.GetWriteOffList.send([APPMODEL.Storage.getItem('copPage_token'), operation.dateChange($scope.dateStart), operation.dateChange($scope.dateOver), $scope.model.typeId, $scope.model.partners, $scope.model.pageIndex, pageNext]).then(function (data) {
                            if (data.Ret == 0) {
                                $scope.model.applicationFeeList = data.Data.ViewModelList;//transformation Data
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
                /**
                 * select partner
                 */
                $scope.selectPartner = function () {
                    $scope.model.disableConfirm = false;
                };
                /**
                 * delete partners
                 */
                $scope.deletePartners = function () {
                    $scope.model.partners = undefined;
                    $scope.model.applicationFeeList = [];
                    $scope.model.disableConfirm = true;
                };
                /**
                 * search
                 */
                $scope.search = function () {
                    serviceApi.getWriteOffList();//get write off list
                };
                /**
                 * confirm
                 */
                $scope.confirmWrite = function () {
                    operation.transformationConfirmWriteOff();//transformation confirm write off data
                    if ($scope.model.arrIdList.length == 0) {
                        toastr.error("请查询合作伙伴");
                        return;
                    }
                    $modal.open({
                        templateUrl: 'myModalContent.html',
                        controller: 'myModalContentCtrl',
                        resolve: {
                            items: function () {
                                return [serviceApi, operation.dateChange($scope.dateStart), operation.dateChange($scope.dateOver), $scope.model];
                            }
                        }
                    });
                };
                /**
                 * export
                 */
                $scope.export = function () {
                    $window.location.href = urlConfig + 'Charge/v3/ChargeManage/ExportWriteOff' + '?token=' + APPMODEL.Storage.getItem("copPage_token") + '&SDate=' + operation.dateChange($scope.dateStart) + '&EDate=' + operation.dateChange($scope.dateOver) + '&writeOff=' + $scope.model.typeId + '&orgID=' + $scope.model.partners;
                };
                controls.timeData();//time controls
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
    applicationFeeVerification.init();//application fee verification function init
}]);
/**
 * modal
 */
app.controller('myModalContentCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.modal = {
        partners: undefined,
        startDate: undefined,
        overDate: undefined
    };
    for (var i in items[3].partnersList) {
        if (!items[3].partners) {
            break;
        }
        if (items[3].partners == items[3].partnersList[i].OrgID) {
            $scope.modal.partners = items[3].partnersList[i].Name;
            break;
        }
    }
    $scope.modal.startDate = items[1];
    $scope.modal.overDate = items[2];
    /**
     * confirm
     */
    $scope.confirm = function () {
        items[0].confirmWriteOff();
        $modalInstance.dismiss('cancel');
    };
    /**
     * cancel
     */
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);