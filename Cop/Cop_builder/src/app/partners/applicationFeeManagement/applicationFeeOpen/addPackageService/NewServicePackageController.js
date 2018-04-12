/**
 * Created by xj on 2017/3/10.
 */
app.controller('NewServicePackageController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet) {
    // --- 购买时间时间配置 开始--------------------------------------------------
    $scope.clear = function () {
        $scope.BuySDate = null;
        $scope.BuyEDate = null;
    };

    $scope.minDate = $scope.minDate ? null : new Date();

    $scope.openStartDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened1 = true;
        $scope.endOpened1 = false;
    };

    $scope.openEndDate1 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened1 = false;
        $scope.endOpened1 = true;
    };
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    $scope.format = 'yyyy-MM-dd';
    //---- 购买时间配置 结束 -------------------------------------------------------

    // --- 服务有效期时间配置 开始--------------------------------------------------
    $scope.clear = function () {
        $scope.SDate = null;
        $scope.EDate = null;
    };

    $scope.minDate = $scope.minDate ? null : new Date();

    $scope.openStartDate2 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened2 = true;
        $scope.endOpened2 = false;
    };

    $scope.openEndDate2 = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened2 = false;
        $scope.endOpened2 = true;
    };
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    $scope.format = 'yyyy-MM-dd';
    //---- 服务有效期时间配置 结束 -------------------------------------------------------
    /**
     * Add ServicePackage
     */
    $scope.id = $state.params.id;
    $scope.aa=$stateParams.productID
    var addStuFuncService = {
        /**
         * function init
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
            this.serviceApi.getOrgSchoolPage();//get school org pages list
            this.serviceApi.getProductListByGid();//初始页面根据学校ID获取产品名字
            this.serviceApi.getServiceItemList();//获取所有功能项及对应的业务领域
            if ($stateParams.id) {
                this.serviceApi.getSingleServicePackage();//根据ID获取单个服务包信息
            }
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.queryFields = {
                selectedGid: $stateParams.schoolID,
                selectProductPackageID: $stateParams.productID,
                schoolList: []
            };
            $scope.model = {
                id: 0,
                Amount: undefined,
                ProductName: undefined,
                Name: undefined,
                BuySDate: undefined,
                BuyEDate: undefined,
                EDate: undefined,
                MDate: undefined,
                selectedGid: undefined,
                productName: undefined
            };

        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * school change get gid
             */
            $scope.changeGid = function () {
                $scope.queryFields.selectProductPackageID = undefined;
                addStuFuncService.serviceApi.getProductListByGid();//获取产品包
            };
            $scope.saveAll = function () {
                if(!$scope.queryFields.selectedGid){
                    toastr.error('请选择学校！');
                    return;
                }
                if (!$scope.queryFields.selectProductPackageID) {
                    toastr.error('请选择产品！');
                    return;
                }
                if (!$scope.model.Name) {
                    toastr.error('请填写服务包名称！');
                    return;
                }
                if (!$scope.model.Amount) {
                    toastr.error('请填写服务包金额！');
                    return;
                }
                if (!$scope.model.BuySDate) {
                    toastr.error('请选择购买开始时间！');
                    return;
                }
                if (!$scope.model.BuyEDate) {
                    toastr.error('请选择购买结束时间！');
                    return;
                }
                if (!$scope.model.SDate) {
                    toastr.error('请选择服务开始时间！');
                    return;
                }
                if (!$scope.model.EDate) {
                    toastr.error('请选择服务结束时间！');
                    return;
                }

                addStuFuncService.serviceApi.addServicePackageByGive();//保存
            };
            $scope.cancel = function () {
                $state.go('access.app.partner.applicationFeeOpen.addPackageService');//取消
            };
        },
        dateChange: function (date) {
            var isEffective = date instanceof Date ? true : false;
            if (isEffective) {
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            } else {
                return date;
            }
        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * get school org pages list
                 */
                getOrgSchoolPage: function () {
                    $scope.formServiceDisabled = false;
                    applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.queryFields.schoolList = data.Data;
                        }
                    });
                },
                /**
                 * 根据学校GID获取服务包
                 */
                getProductListByGid: function () {
                    $scope.formPackDisabled = false;
                    if(!$scope.queryFields.selectedGid){
                        return;
                    }
                    applicationServiceSet.chargeServiceApi.chargeService.GetProductListByGid.send([APPMODEL.Storage.getItem('copPage_token'), $scope.queryFields.selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.productPackageList = data.Data;
                        }
                    });
                },
                /**
                 * add Service Package
                 */
                addServicePackageByGive: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.AddOrUpCharge.send([$scope.id, $scope.queryFields.selectedGid, $scope.queryFields.selectProductPackageID, $scope.model.Name, $scope.model.Amount, addStuFuncService.dateChange($scope.model.BuySDate), addStuFuncService.dateChange($scope.model.BuyEDate), addStuFuncService.dateChange($scope.model.SDate), addStuFuncService.dateChange($scope.model.EDate)], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("保存成功");
                            $state.go('access.app.partner.applicationFeeOpen.addPackageService');
                        }
                    });
                },
                /**
                 *根据ID获取单个服务包信息
                 */
                getSingleServicePackage: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetSigleServicePackageInfo.send([APPMODEL.Storage.getItem('copPage_token'), $scope.id]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model = data.Data;
                            $scope.queryFields.selectedGid = data.Data.GID;
                            $scope.queryFields.selectProductPackageID = data.Data.ProductID;
                            addStuFuncService.serviceApi.getProductListByGid();
                        }
                    });
                },
                /**
                 * 获取所有功能项及对应的业务领域
                 */
                getServiceItemList: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetFuncAppList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            // $scope.itemList = data.Data;
                        }
                    });
                }
            };
        })()
    };
    addStuFuncService.init();//function init
}]);