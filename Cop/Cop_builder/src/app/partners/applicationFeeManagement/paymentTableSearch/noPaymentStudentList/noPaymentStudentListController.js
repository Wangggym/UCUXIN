/**
 * Created by wangqihan on 2016/8/22.
 */
app.controller('noPaymentStudentListController', ['$scope', '$modal', 'applicationServiceSet', function ($scope, $modal, applicationServiceSet) {
    'use strict';

    // 查询字段默认配置
    $scope.queryFields = {
        school: undefined,
        studentName: undefined,
        funcServiceProduct: undefined
    };

    // 分页指令配置
    $scope.pagination = {
        currentPage: 1,
        itemsPerPage: 10, // 默认查询10条
        maxSize: 5,
        previousText: "上页",
        nextText: "下页",
        firstText: "首页",
        lastText: "末页"
    };

    var noPayment = (function () {

        // 取出当前token 与 orgid值
        var token = APPMODEL.Storage.copPage_token,
            orgid = APPMODEL.Storage.orgid;

        var queryFields = $scope.queryFields,
            pagination = $scope.pagination;


        var getService = function (method, arr, fn) {
            applicationServiceSet.parAppServiceApi.paymentTableSearch[method].send(arr).then(fn);
        };

        // 获取当前用户学校
        var getSchool = function () {
            getService('getSchoolList', [token, orgid], function (data) {
                if (data.Ret == 0) {
                    $scope.schoolList = data.Data.length ? data.Data : undefined;
                }
            });
        };


        // 获取服务包
        var getProductPackage = function () {
            if (queryFields.school == '' || queryFields.school == undefined) return;
            getService('getProductList', [token, queryFields.school], function (data) {
                if (data.Ret == 0) {
                    $scope.productPackageList = data.Data.length ? data.Data : undefined;
                }
            });
        };

        // 默认查询未缴费学生名单
        var initNoPayment = function () {
            var schoolID = queryFields.school || 0;
            var funcServiceProductID = queryFields.funcServiceProduct || 0;
            var studentName = queryFields.studentName;

            getService('getNoPaymentStudentList', [token, pagination.itemsPerPage, pagination.currentPage, schoolID, studentName, funcServiceProductID], function (data) {
                if (data.Ret == 0) {
                    $scope.dataList = data.Data.ViewModelList.length ? data.Data.ViewModelList : undefined;

                    // 分页配置项更新
                    pagination.totalItems = data.Data.TotalRecords;
                    pagination.numPages = data.Data.Pages;
                }
            });
        };

        // 示缴费学生明细
        var getNoPayment = function (umId, funcServiceProductID, fn) {
            getService('getNoPaymentStudentDetail', [token, umId, funcServiceProductID], function (data) {
                if (data.Ret == 0) {
                    $scope.dataDetail = data.Data.length ? data.Data : undefined;
                    fn($scope.dataDetail);
                }
            });
        };

        return {
            getSchoolList: getSchool,
            getProductList: getProductPackage,
            getNoPaymentDetail: getNoPayment,
            initNoPaymentList: initNoPayment
        }
    })();


    // 初始化学校列表
    noPayment.getSchoolList();

    // 根据学校id 查询服务包
    $scope.changeSchool = function () {
        $scope.queryFields.funcServiceProduct ? $scope.queryFields.funcServiceProduct = undefined : '';
        $scope.productPackageList = undefined;
        noPayment.getProductList();
    };

    // 提交查询与分页查询
    $scope.submitQuery = $scope.pageQuery = function (event) {
        if(event){
          // 当点击查询时重置当页为首页
          var event = event || window.event;
          var target = event.target || window.srcElement;
          if (target.tagName.toLocaleLowerCase() == "button") {
            $scope.pagination.currentPage = 1;
          }
        }
        noPayment.initNoPaymentList();
    };

    // 未缴费学生明细
    $scope.detail = function (umId, funcServiceProductID, event) {
        event.preventDefault();

        var model = function (data) {
            var modalInstance = $modal.open({
                templateUrl: 'noPaymentStudentDetailContent.html',
                controller: 'ModalNoPaymentDetailCtrl',
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

        noPayment.getNoPaymentDetail(umId, funcServiceProductID, model);
    };
}]);

app.controller('ModalNoPaymentDetailCtrl', ['$scope','$modalInstance','items',function ($scope, $modalInstance, items) {
    $scope.dataDetail = items;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
