/**
 * Created by WangQiHan on 2016/9/29.
 * Already Test Personnel Controller
 */
app.controller('AlreadyTestPersonnelController', ['$scope', '$location', '$filter', '$stateParams', 'applicationServiceSet', function ($scope, $location, $filter, $stateParams, applicationServiceSet) {
    'use strict';

    $scope.queryFields = {
        className: undefined,
        studentName: undefined
    }

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


    var alreadyTestPersonnel = (function () {
        var token = APPMODEL.Storage.copPage_token,
            applicationToken = APPMODEL.Storage.applicationToken,
            gid = $stateParams.gid,
            orderID = $stateParams.id;

        var getService = function (method, arr, fn) {
            applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr).then(fn);
        }

        // 根据学校ID获取班级列表
        var getClassList = function () {
            getService('getClassList', [token, gid], function (data) {
                if (data.Ret === 0) {
                    $scope.classNameList = data.Data || undefined;
                }
            })
        };

        // 根据班级ID获取学生列表

        var getStudentList = function () {
            var classID = $scope.queryFields.className || 0;
            getService('getStudentList', [token, gid, classID], function (data) {
                if (data.Ret === 0) {
                    $scope.studentList = data.Data || undefined;
                }
            });
        };

        var getAlreadyPersonnelTestTask = function () {
            var classID = $scope.queryFields.className || 0,
                startDate = $filter('date')($scope.sDate, 'yyyy-MM-dd') || null,
                endDate = $filter('date')($scope.eDate, 'yyyy-MM-dd') || null,
                umid = $scope.queryFields.studentName || 0;

            getService('getAlreadyPersonnelTestTask', [token, $scope.pagination.currentPage, $scope.pagination.itemsPerPage, gid, orderID, classID, umid, startDate, endDate], function (data) {
                if (data.Ret === 0) {
                    if (data.Data && data.Data.ViewModelList.length) {
                        $scope.dataList = data.Data.ViewModelList;
                        $scope.pagination.totalItems = data.Data.TotalRecords;
                        $scope.pagination.numPages = data.Data.Pages;
                    } else {
                        $scope.dataList = $scope.pagination.totalItems = $scope.pagination.numPages = undefined;
                    }
                }
            });
        }

        return {
            getClassList: getClassList,
            getStudentList: getStudentList,
            getAlreadyPersonnelTestTask: getAlreadyPersonnelTestTask
        }
    })();

    // 默认查出数据
    alreadyTestPersonnel.getAlreadyPersonnelTestTask();

    // 获取班级列表
    alreadyTestPersonnel.getClassList();

    // 获取学生列表
    $scope.changeClass = function () {
        alreadyTestPersonnel.getStudentList();
    }

    // 查询出列表
    $scope.submitQuery = $scope.pageQuery = function (event) {
        if (event) {
            // 当点击查询时重置当页为首页
            var event = event || window.event;
            var target = event.target || window.srcElement;
            if (target.tagName.toLocaleLowerCase() == "button") {
                $scope.pagination.currentPage = 1;
            }
        }
        alreadyTestPersonnel.getAlreadyPersonnelTestTask();
    };

    $scope.lookResult = function (id) {
        $location.path('access/app/internal/operationManagement/testPersonnelResult/' + id);
    };

    $scope.cancel = function () {
        window.history.back();
    }
}]);
