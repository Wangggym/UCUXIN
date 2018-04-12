/**
 * Created by xj on 2017/3/10.
 */
app.controller('addPackageServiceController', ['$scope', '$modal', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', function ($scope, $modal, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet) {
    // --- 时间配置 开始--------------------------------------------------
    $scope.clear = function () {
        $scope.sDate = null;
        $scope.eDate = null;
    };

    $scope.minDate = $scope.minDate ? null : new Date();

    $scope.openStartDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened = true;
        $scope.endOpened = false;
    };

    $scope.openEndDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened = false;
        $scope.endOpened = true;
    };
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    $scope.format = 'yyyy-MM-dd';
    //---- 时间配置 结束 -------------------------------------------------------

    /**
     * Second Add ServivePackage
     *
     */
    var SecondAddServicePackage = {
        /**
         * function init
         */
        init: function () {
            this.variable();//variable declaration
            this.serviceApi.getOrgSchoolPage();//get school org pages list
            this.serviceApi.getProductListByGid();//get product name by id
            this.operation.basic();//search bank transfer registration list
        },
        /**
         * variable declaration
         */
        variable: function () {
            $scope.queryFields = {
                selectedGid: 0,
                selectProductPackageID: 0
            };
            $scope.itemList = [];
            // 分页指令配置
            $scope.pagination = {
                currentPage: 1,
                itemsPerPage: 10, // 默认查询10条
                totalItems: undefined,
                maxSize: 5,
                previousText: "上页",
                nextText: "下页",
                firstText: "首页",
                lastText: "末页"
            };
        },
        /**
         * service aggregate
         * @type {{getOrgSchoolPage: getOrgSchoolPage}}
         */
        serviceApi: (function () {
            return {
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
                        $scope.formPackDisabled = false;
                        applicationServiceSet.chargeServiceApi.chargeService.getProductList.send([APPMODEL.Storage.getItem('copPage_token'), gid]).then(function (data) {
                            if (data.Ret == 0) {
                                $scope.productPackageList = data.Data;
                            }
                        });
                    }
                },
                /**
                 * get all school configuration records
                 */
                getAllGroupConfig: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetServicePageGroupData.send([APPMODEL.Storage.getItem('copPage_token'), $scope.pagination.currentPage, $scope.pagination.itemsPerPage, APPMODEL.Storage.getItem('orgid'), $scope.queryFields.selectedGid, $scope.queryFields.selectProductPackageID, SecondAddServicePackage.dateChange($scope.sDate), SecondAddServicePackage.dateChange($scope.eDate)]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.pagination.totalItems = data.Data.TotalRecords;
                            $scope.itemList = data.Data.ViewModelList;
                        }
                    });
                },
                /**
                 * 删除服务包
                 * @param item
                 */
                removeServicePackage: function (item) {
                    applicationServiceSet.chargeServiceApi.chargeService.RemoveServicePackageByChargeid.send(undefined, [APPMODEL.Storage.getItem('copPage_token'), item.ID]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('删除成功');
                            $scope.itemList.splice($scope.itemList.indexOf(item), 1);
                        }
                    });
                },
                /**
                 * 下架服务包
                 * @param item
                 */
                soldOutServicePackage: function (item) {
                    applicationServiceSet.chargeServiceApi.chargeService.soldOutServicePackageByChargeid.send(undefined, [APPMODEL.Storage.getItem('copPage_token'), item.ID]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('下架成功');
                        }
                    });
                }
            }
        })(),
        /**
         * operation
         * @type {{basic: basic}}
         */
        operation: {
            basic: function () {
                /**
                 * school change get gid
                 */
                $scope.changeGid = function () {
                    $scope.queryFields.selectProductPackageID = undefined;
                    SecondAddServicePackage.serviceApi.getProductListByGid($scope.queryFields.selectedGid);
                    $scope.search();//get all school configuration records
                };
                /**
                 * search
                 */
                $scope.search = function () {
                    SecondAddServicePackage.serviceApi.getAllGroupConfig();//get all school configuration records
                };
                /**
                 * 分页配置
                 */
                $scope.pageQuery = function () {
                    SecondAddServicePackage.serviceApi.getAllGroupConfig();//get all school configuration records
                };
                /**
                 * 删除服务包
                 * @param item
                 */
                $scope.deleteMine = function (item) {
                    SecondAddServicePackage.serviceApi.removeServicePackage(item);//删除产品列表
                };
                /**
                 * 下架服务包
                 * @param item
                 */
                $scope.soldOut = function (item) {
                    var modalInstance = $modal.open({
                        templateUrl: 'removeScale.html',
                        size: 'sm',
                        controller: 'RemoveScaleCtrl',
                        resolve: {
                            items: function () {
                                return item
                            }
                        }
                    });
                    modalInstance.result.then(function (item) {
                        SecondAddServicePackage.serviceApi.soldOutServicePackage(item);//下架服务包
                    }, function () {
                        // 取消时作出操作
                    });
                };
                //添加服务包
                $scope.addServicePackage = function(schoolID,productID){
                    $state.go('access.app.partner.applicationFeeOpen.NewServicePackage', {schoolID: schoolID,productID:productID});
                };
                $scope.save = function (id) {
                    $state.go('access.app.partner.applicationFeeOpen.NewServicePackage', {id: id});
                };
                // 切换页码
                $scope.pageQuery = function () {
                    SecondAddServicePackage.serviceApi.getAllGroupConfig();
                };
                if ($stateParams.gid) {
                    operation.judgeStateParams();
                } else {
                    $scope.search();
                }
            }
        },
        //时间格式化
        dateChange: function (date) {
            var isEffective = date instanceof Date ? true : false;
            if (isEffective) {
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            } else {
                return date;
            }
        }
    };
    SecondAddServicePackage.init();//Add ServicePackage function init
}]);
// 删除问卷的模态框
app.controller('RemoveScaleCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    'use strict';
    $scope.scale = items;
    $scope.comfirm = function () {
        $modalInstance.close($scope.scale);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
