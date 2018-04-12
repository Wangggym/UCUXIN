/**
 * Created by wangqihan on 2016/8/22.
 */
app.controller('noPaymentStudentListController', ['$scope', '$modal', 'applicationServiceSet', function ($scope, $modal, applicationServiceSet) {
    'use strict';
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
            applicationToken = APPMODEL.Storage.applicationToken,
            orgid = APPMODEL.Storage.orgid;

        var queryFields = $scope.queryFields,
            pagination = $scope.pagination;

        var getService = function (method, arr, fn) {
            applicationServiceSet.internalServiceApi.paymentTableSearch[method].send(arr).then(fn);
        };

        // 获取当前用户学校
        /*var getSchool = function () {
         getService('getSchoolList', [token, orgid], function (data) {
         if (data.Ret == 0) {
         $scope.schoolList = data.Data.length ? data.Data : undefined;
         }
         });
         };*/

        // 获取当前用户学校 （ 模糊查询 ）
        var getSchool = function (keyword) {
            getService('getFuzzySchoolList', [applicationToken, keyword], function (data) {
                if (data.Ret == 0) {
                    $scope.schoolList = data.Data.length ? data.Data : undefined;
                }
            });
        };


        // 获取服务包
        var getProductPackage = function () {
            if ($scope.queryFields.school == '' || $scope.queryFields.school == undefined) return;
            getService('getProductList', [token, $scope.queryFields.school], function (data) {
                if (data.Ret == 0) {
                    $scope.productPackageList = data.Data.length ? data.Data : undefined;
                }
            });
        };

        // 默认查询未缴费学生名单
        var initNoPayment = function () {
            var schoolID = queryFields.school || 0,
                studentNameID = queryFields.studentName || undefined,
                funcServiceProductID = queryFields.funcServiceProduct || 0;

            getService('getNoPaymentStudentList', [token, pagination.itemsPerPage, pagination.currentPage, schoolID, studentNameID, funcServiceProductID], function (data) {
                if (data.Ret == 0) {
                  $scope.dataSource = data.Data;
                  $scope.dataList = data.Data.PayPage.ViewModelList.length ? data.Data.PayPage.ViewModelList : undefined;

                  // 分页配置项更新
                  $scope.pagination.totalItems = data.Data.PayPage.TotalRecords;
                  $scope.pagination.numPages = data.Data.PayPage.Pages;
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

    // 查询学校
    $scope.refreshSchool = function (keyword) {
        if (!keyword) return;
        noPayment.getSchoolList(keyword);
    };

    // 查询服务包
    $scope.changeSchool = function () {
        $scope.queryFields.funcServiceProduct = undefined;
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
    $scope.detail = function (umId, funcServiceProductID,event) {
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
