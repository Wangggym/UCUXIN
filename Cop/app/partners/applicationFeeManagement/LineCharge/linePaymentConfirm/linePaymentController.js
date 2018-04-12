/**
 * Created by fanweihua on 2016/9/5.
 * linePaymentController
 * line payment service
 */
app.controller('linePaymentController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet) {
    /**
     * line payment
     */
    var linePayment = (function () {
        /**
         * function init
         */
        var init = function () {
            variable();
            getList.init();
        };
        /**
         * variable declaration
         */
        var variable = function () {
            $scope.queryFields = {
                selectedGid: undefined,
                selectProductPackageID: undefined,
                selectedService: undefined,
                selectClass: undefined,
                checked:1,
                studentList: [],
                StuIDList: [],
                ProductIDList: [],
                studentNumber: undefined
            };
            $scope.studentName = undefined;
            $scope.checked = false;
        };
        /**
         * get basic list
         * @type {{init: init, getOrgSchoolPage: getOrgSchoolPage, getProductListByGid: getProductListByGid, getClassList: getClassList, getOfflinePayList: getOfflinePayList, confirmOfflinePay: confirmOfflinePay}}
         */
        var getList = {
            init: function () {
                this.getOrgSchoolPage();//get school org pages list
                operation.basicOperation();//operation
            },
            /**
             * get school org pages list
             */
            getOrgSchoolPage: function () {
                applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.schoolList = data.Data;
                    }
                });
            },
            /**
             * according to the school ID get product package
             * @param gid
             */
            getProductListByGid: function (gid) {
                if (gid) {
                    applicationServiceSet.chargeServiceApi.chargeService.GetProductListByGid.send([APPMODEL.Storage.getItem('copPage_token'), gid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.productPackageList = data.Data;
                        }
                    });
                }
            },
            /**
             * 获取产品服务包list
             */
            getServiceList: function (productId) {
                applicationServiceSet.chargeServiceApi.chargeService.GetChargeListByProductId.send([APPMODEL.Storage.getItem('copPage_token'),productId]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.serviceList = data.Data;
                        if(!$scope.serviceList || $scope.serviceList.length == 0){
                            $scope.queryFields.selectedService = undefined;
                        }
                    }
                });
            },
            /**
             * get class list
             * @param gid
             */
            getClassList: function (gid) {
                if (gid) {
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.getClassList.send([APPMODEL.Storage.getItem('copPage_token'), gid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.classList = data.Data;
                        }
                    });
                }
            },
            /**
             * get the line under the charge of the student list
             */
            getOfflinePayList: function () {
                if(!$scope.queryFields.selectedService || $scope.queryFields.selectedService  == ''){
                    toastr.error('请选择服务包！');
                    return;
                }
                applicationServiceSet.chargeServiceApi.chargeService.GetStudents.send([APPMODEL.Storage.getItem('copPage_token'), $scope.queryFields.selectedGid,$scope.queryFields.selectedService,$scope.queryFields.selectClass,$scope.studentName]).then(function (data) {
                    if (data.Ret == 0) {
                        for (var i in data.Data) {
                            data.Data[i].PayDate = 0;
                            data.Data[i].checked = false;
                            if (!data.Data[i].Channel) {
                                data.Data[i].Channel = "未付款";
                                data.Data[i].alreadyPay = true;
                                data.Data[i].PayDate = undefined;
                            } else {
                                data.Data[i].alreadyPay = false;
                                data.Data[i].alreadyPayName = "已缴费";
                            }
                        }
                        $scope.studentModelList = data.Data;
                    }
                });
            },
            /**
             * confirmation of payment under the line
             */
            confirmOfflinePay: function () {
                $scope.queryFields.StuIDList = [];
                if(!$scope.queryFields.selectedService || $scope.queryFields.selectedService == ''){
                    toastr.error("请选择服务包");
                    return;
                }
                if ($scope.queryFields.studentList.length == 0) {
                    toastr.error("请选择学生");
                    return;
                }
                for (var i in $scope.queryFields.studentList) {
                    $scope.queryFields.StuIDList.push($scope.queryFields.studentList[i].UMID);
                };
                applicationServiceSet.chargeServiceApi.chargeService.AddNewOrder.send([$scope.queryFields.selectedGid,[$scope.queryFields.selectedService], $scope.queryFields.StuIDList]).then(function (data) {
                    if (data.Ret == 0) {
                        $location.url('access/app/partner/LineCharge/confirmPayment?id=' + data.Data);
                    }
                });
            }
        };
        /**
         * operation
         * @type {{basicOperation: basicOperation}}
         */
        var operation = {
            basicOperation: function () {
                /**
                 * school change get gid
                 */
                $scope.changeGid = function () {
                    $scope.productPackageList = [];
                    if (!$stateParams.id) {
                        $scope.queryFields.selectProductPackageID = undefined;
                        $scope.queryFields.selectProductPackageID = undefined;
                        $scope.studentName = undefined;
                        $scope.checked = false;
                    }
                    getList.getProductListByGid($scope.queryFields.selectedGid);//according to the school ID get product package
                    getList.getClassList($scope.queryFields.selectedGid);//get class list
                };
                /**
                 * change product get service
                 */
                $scope.changeProductGid = function () {
                    getList.getServiceList($scope.queryFields.selectProductPackageID);//get class list
                };
                /**
                 * delete numerical value already exists
                 */
                $scope.deleteSelectedGid = function () {
                    delete APPMODEL.Storage.linePaymentObj;
                    $scope.queryFields.selectedGid = undefined;
                    $scope.studentModelList = [];
                    $scope.queryFields.selectProductPackageID = undefined;
                    $scope.queryFields.selectProductPackageID = undefined;
                    $scope.studentName = undefined;
                    $scope.checked = false;
                    operation.initType();//data initialization
                };
                /**
                 * delete product item
                 */
                $scope.deleteSelectProduct = function () {
                    $scope.queryFields.selectClass = undefined;
                    $scope.queryFields.selectedGid = undefined;
                    $scope.serviceList = [];
                    $scope.queryFields.selectedService = undefined;
                };
                /**
                 * select class
                 */
                $scope.classChange = function () {
                    $scope.search();
                };
                /**
                 * checked payment
                 */
                $scope.checkedPay = function () {
                    if ($scope.checked) {
                        $scope.queryFields.checked = 1;
                    } else {
                        $scope.queryFields.checked = 0;
                    }
                };
                /**
                 * input checkbox change
                 * @param studentModelList
                 * @param index
                 */
                $scope.checkedOne = function (studentModelList, index) {
                    angular.forEach(studentModelList, function (value, key) {
                        if (key == index) {
                            if (value.checked) {
                                value.checked = false;
                                studentNumber();
                            } else {
                                value.checked = true;
                                studentNumber();
                            }
                        }
                    });
                };
                var studentNumber = function () {
                    var student = [];
                    for (var i in $scope.studentModelList) {
                        if ($scope.studentModelList[i].checked == true) {
                            student.push($scope.studentModelList[i]);
                        }
                    }
                    $scope.queryFields.studentNumber = student.length;
                };
                /**
                 * select all
                 */
                $scope.checkAll = function () {
                    angular.forEach($scope.studentModelList, function (value) {
                        if (value.checked) {
                            value.checked = false;
                            studentNumber();
                        } else if (value.alreadyPay) {
                            value.checked = true;
                            studentNumber();
                        }
                    });
                };
                /**
                 * delete select class list
                 */
                $scope.deleteSelectClass = function () {
                    $scope.queryFields.selectClass = undefined;
                };
                /**
                 * search
                 */
                $scope.search = function () {
                    $scope.queryFields.checkAll = false;
                    getList.getOfflinePayList($scope.queryFields.selectedGid);
                    var linePayment = {
                        selectedGid: $scope.queryFields.selectedGid,
                        selectProductPackageID: $scope.queryFields.selectProductPackageID,
                        selectedService: $scope.queryFields.selectedService,
                        selectClass: $scope.queryFields.selectClass,
                        checked: $scope.checked,
                        studentName: $scope.studentName
                    };
                    APPMODEL.Storage.setItem('linePaymentObj', JSON.stringify(linePayment));
                };
//                /**
//                 * export excel
//                 */
//                $scope.export = function () {
//                    if ($scope.queryFields.selectedGid) {
//                        $window.open(urlConfig + 'OCS/v3/CardInfo/ExportStu' + '?token=' + APPMODEL.Storage.getItem("copPage_token") + '&gid=' + $scope.queryFields.selectedGid, 'C-Sharpcorner');
//                    }
//                };
                /**
                 * confirmation payment
                 */
                $scope.confirmOfflinePay = function () {
                    $scope.queryFields.studentList = [];
                    for (var i in $scope.studentModelList) {
                        if ($scope.studentModelList[i].checked) {
                            $scope.queryFields.studentList.push($scope.studentModelList[i]);
                        }
                    }
                    getList.confirmOfflinePay();//confirmation of payment under the line
                };
                if ($stateParams.id) {
                    operation.judgeParams();//judge params
                } else {
                    delete APPMODEL.Storage.linePaymentObj;
                }
            },
            /**
             * judge params
             */
            judgeParams: function () {
                if (APPMODEL.Storage.getItem('linePaymentObj')) {
                    var payObj = JSON.parse(APPMODEL.Storage.getItem('linePaymentObj'));
                    if (payObj.selectedGid && payObj.selectProductPackageID) {
                        $scope.queryFields.selectedGid = payObj.selectedGid;
                        $scope.queryFields.selectProductPackageID = payObj.selectProductPackageID;
                        $scope.queryFields.selectClass = payObj.selectClass;
                        $scope.checked = payObj.checked;
                        $scope.studentName = payObj.studentName;
                        getList.getServiceList($scope.queryFields.selectProductPackageID);
                        $scope.queryFields.selectedService = payObj.selectedService;
                        $scope.checkedPay();
                        $scope.changeGid();
                        $scope.search();
                    } else {
                        delete APPMODEL.Storage.linePaymentObj;
                    }
                }
            },
            /**
             * data initialization
             */
            initType: function () {
                $scope.productPackageList = [];
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
         * return
         */
        return {
            init: init
        };
    })();
    linePayment.init();//function init
}]);