/**
 * Created by wangqihan on 2016/8/29.
 */
app.controller('paymentAnomalyController', ['$scope', '$location', 'applicationServiceSet', function ($scope, $location, applicationServiceSet) {
    'use strict';

    $scope.queryFields = {
        school: undefined,
        st: 0
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

    var paymentAnomaly = (function () {
        // 取出当前token 与 orgid值
        var token = APPMODEL.Storage.copPage_token,
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
        // 根据学校ID获取班级列表
        var getClassName = function (gid) {
            getService('getClassList', [token, gid], function (data) {
                if (data.Ret == 0) {
                    $scope.classNameList = data.Data.length ? data.Data : undefined;
                }
            });
        };

        // 缴费异常数据查询
        var initPaymentAnomaly = function () {
            var schoolId = $scope.queryFields.school || 0;
            var st = parseInt($scope.queryFields.st) ? true : false;
            applicationServiceSet.chargeServiceApi.chargeService.GetExceptionStuPageNew.send([token, $scope.pagination.itemsPerPage, $scope.pagination.currentPage,0,schoolId, st]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.dataList = data.Data.ViewModelList.length ? data.Data.ViewModelList : undefined;

                    // 分页配置项更新
                    $scope.pagination.totalItems = data.Data.TotalRecords;
                    $scope.pagination.numPages = data.Data.Pages;
                }
            });
        };

        return {
            getSchoolList: getSchool,
            getClassNameList: getClassName,
            initPaymentAnomalyList: initPaymentAnomaly
        }
    })();

    $scope.refreshSchool = function (keyword) {
        if (!keyword) return;
        paymentAnomaly.getSchoolList(keyword);
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
        paymentAnomaly.initPaymentAnomalyList();
    };

    $scope.modify = function (data) {
        APPMODEL.Storage.paymentAnomaly = JSON.stringify(data);
        $location.path('/access/app/internal/paymentAnomalyHandle/modifyPaymentAnomaly');
    }
}]);
