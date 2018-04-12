/**
 * Created by wangqihan on 2016/8/22.
 * permissionsController
 * user permissions management
 */
app.controller('alreadyPaymentStudentListController', ['$scope', '$filter', '$modal', 'applicationServiceSet', function ($scope, $filter, $modal, applicationServiceSet) {
    'use strict';
    // --- 时间配置 开始--------------------------------------------------
    /*var currentDay = $filter('date')(new Date(), 'yyyy-MM-dd');
     $scope.sDate = currentDay;
     $scope.eDate = currentDay;*/

    $scope.clear = function () {
        $scope.sDate = null;
        $scope.eDate = null;
    };

    $scope.minDate = $scope.minDate ? null : new Date();

    $scope.openStartDate = function ($event) {
        $scope.endOpened = false;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedStart = true;
    };

    $scope.openEndDate = function ($event) {
        $scope.openedStart = false;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endOpened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    $scope.format = 'yyyy-MM-dd';
    //---- 时间配置 结束 -------------------------------------------------------

    // 查询字段
    $scope.queryFields = {
        school: undefined,
        selectProductPackageID: 0,
        funcServiceProduct: 0,
        className: undefined,
        studnetName: undefined,
        payStatus: 0
    };

    // 分页指令配置
    $scope.pagination = {
        currentPage: 1,
        itemsPerPage: 50, // 默认查询10条
        maxSize: 5,
        previousText: "上页",
        nextText: "下页",
        firstText: "首页",
        lastText: "末页"
    };

    // 数据交互
    var alreadyPayment = (function () {
        // 取出当前token 与 orgid值
        var token = APPMODEL.Storage.copPage_token,
            orgid = APPMODEL.Storage.orgid,
            applicationToken = APPMODEL.Storage.applicationToken;

        var getService = function (method, arr, fn) {
            applicationServiceSet.internalServiceApi.paymentTableSearch[method].send(arr).then(fn);
        };

        // 获取当前用户学校 （ 模糊查询 ）
        var getSchool = function (keyword) {
            getService('getFuzzySchoolList', [applicationToken, keyword], function (data) {
                if (data.Ret == 0) {
                    $scope.schoolList = data.Data.length ? data.Data : undefined;
                }
            });
        };

        // 根据学校ID获取班级
        var getClass = function () {
            if (!$scope.queryFields.school) return;
            getService('getClassList', [token, $scope.queryFields.school], function (data) {
                if (data.Ret == 0) {
                    $scope.classNameList = data.Data.length ? data.Data : undefined;
                }
            });
        };

        // 根据学校ID与班级ID（班级非必须）获取服务包, 0：表示班级不伟值
        var getServiceList = function () {
            applicationServiceSet.chargeServiceApi.chargeService.GetChargeListByProductId.send([APPMODEL.Storage.getItem('copPage_token'),$scope.queryFields.selectProductPackageID]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.serviceList = data.Data;
                }
            });
        };

        // 缴费明细
        var getPaymentDeatilStu = function (umId,chargID, fn) {
            applicationServiceSet.chargeServiceApi.chargeService.GetOderCountList.send([umId,chargID]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.dataDetail = data.Data;
                    fn($scope.dataDetail);
                }
            });
        };

        // 默认查询已缴费学生名单
        var initAlreadyPayment = function (isExcel) {
            var schoolID = $scope.queryFields.school || 0,
                classNameID = $scope.queryFields.className || 0,
                funcServiceID = $scope.queryFields.funcServiceProduct || 0,
                funcServiceProductID = $scope.queryFields.selectProductPackageID || 0,
                studentName = $scope.queryFields.studentName || '',
                startDate = $filter('date')($scope.sDate, 'yyyy-MM-dd') || '',
                endDate = $filter('date')($scope.eDate, 'yyyy-MM-dd') || '';

            if (isExcel) {
                window.location.href = urlConfig + 'Charge/v3/ChargeManage/ExportPayList?token=' + token + '&pageSize=' + $scope.pagination.itemsPerPage + '&pageIndex=' + $scope.pagination.currentPage + '&gid=' + schoolID + '&productID=' + funcServiceProductID + '&classID=' + classNameID + '&stu=' + studentName+'&chargeId='+funcServiceID;
            } else {
                applicationServiceSet.chargeServiceApi.chargeService.GetPayListPage.send([ $scope.pagination.itemsPerPage, $scope.pagination.currentPage,schoolID,$scope.queryFields.selectProductPackageID,$scope.queryFields.funcServiceProduct,startDate,endDate,classNameID,studentName,$scope.queryFields.payStatus]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.dataSource = data.Data;
                        $scope.dataList = data.Data.ViewModelList;
                        // 分页配置项更新
                        $scope.pagination.totalItems = data.Data.TotalRecords;
                        $scope.pagination.numPages = data.Data.Pages;
                    }
                });
            }
        };
        // 获取相应的产品包
        var getProductListByGid = function () {
            if ($scope.queryFields.school && $scope.queryFields.school != '') {
                applicationServiceSet.chargeServiceApi.chargeService.GetProductListByGid.send([APPMODEL.Storage.getItem('copPage_token'), $scope.queryFields.school]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.productPackageList = data.Data;
                    }
                });
            }
        };
        return {
            getSchoolList: getSchool,
            getClassNameList: getClass,
            getServiceList: getServiceList,
            getPaymentDeatilStudent: getPaymentDeatilStu,
            initAlreadyPayList: initAlreadyPayment,
            getProductListByGid: getProductListByGid
        }
    })();
    // 模糊查询相关的产品list
    $scope.refreshProduct = function () {
        $scope.productPackageList = [];
        alreadyPayment.getProductListByGid();
    };
    // 模糊查询服务包
    $scope.changeProductGid = function () {
        $scope.queryFields.funcServiceProduct = undefined;
        $scope.serviceList = [];
        alreadyPayment.getServiceList();
    };
    // 模糊查询学校列表
    $scope.refreshSchool = function (keyword) {
        if (!keyword) return;
        alreadyPayment.getSchoolList(keyword);
    };


    // 根据学校ID获取班级列表与服务包列表
    $scope.changeSchool = function () {
        $scope.queryFields.className = undefined;
        $scope.queryFields.funcServiceProduct = undefined;

        $scope.classNameList = undefined;
        $scope.productPackageList = undefined;

        alreadyPayment.getClassNameList();
         alreadyPayment.getProductListByGid();
    };

    /**
     * 选择缴费状态
     */
    $scope.selectUnOpen = function () {
        if(!$scope.checkedUnOpen && !$scope.checkedPayment && !$scope.checkedUnPayment){
            $scope.queryFields.payStatus = 0;
            return;
        }
        if (!$scope.checkedUnOpen) {
            $scope.checkedUnOpen = false;
            return;
        }
        $scope.checkedUnOpen = true;
        $scope.checkedPayment = false;
        $scope.checkedUnPayment = false;
        $scope.queryFields.payStatus = 1;
    };
    $scope.checkedPay = function () {
        if(!$scope.checkedUnOpen && !$scope.checkedPayment && !$scope.checkedUnPayment){
            $scope.queryFields.payStatus = 0;
            return;
        }
        if (!$scope.checkedPayment) {
            $scope.checkedPayment = false;
            return;
        }
        $scope.checkedPayment = true;
        $scope.checkedUnPayment = false;
        $scope.checkedUnOpen = false;
        $scope.queryFields.payStatus = 3;
    };
    $scope.checkedUnPay = function () {
        if(!$scope.checkedUnOpen && !$scope.checkedPayment && !$scope.checkedUnPayment){
            $scope.queryFields.payStatus = 0;
            return;
        }
        if (!$scope.checkedUnPayment) {
            $scope.checkedUnPayment = false;
            return;
        }
        $scope.checkedUnPayment = true;
        $scope.checkedUnOpen = false;
        $scope.checkedPayment = false;
        $scope.queryFields.payStatus = 2;
    };


    // 提交查询与分页查询
    $scope.submitQuery = $scope.pageQuery = function (event) {
        if (event) {
            // 当点击查询时重置当页为首页
            var event = event || window.event;
            var target = event.target || window.srcElement;
            if (target.tagName.toLocaleLowerCase() == "button") {
                $scope.pagination.currentPage = 1;
            }
        }
        alreadyPayment.initAlreadyPayList();
    };

    // 导出
    $scope.exportExcel = function () {
        alreadyPayment.initAlreadyPayList(1);
    };

    // 明细
    $scope.detail = function (umId,chargID,event) {
        event.preventDefault();

        var model = function (data) {
            var modalInstance = $modal.open({
                templateUrl: 'paymentDetail.html',
                controller: 'ModalPaymentDetailCtrl',
                size: 'lg',
                resolve: {
                    items: function () {
                        return data;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
        alreadyPayment.getPaymentDeatilStudent(umId,chargID , model);
    };
}]);

app.controller('ModalPaymentDetailCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.dataDetail = items;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);