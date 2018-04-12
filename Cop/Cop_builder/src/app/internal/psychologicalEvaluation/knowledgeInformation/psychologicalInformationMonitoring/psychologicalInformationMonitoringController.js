/**
 * Created by WangQiHan on 2016/9/20.
 * Psychological Information Controller
 */
app.controller('PsychologicalInformationMonitoringController', ['$scope', '$filter', '$location', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $filter, $location, toastr, toastrConfig, applicationServiceSet) {
    'use strict';
    $scope.queryFields = {
        title: undefined,
        period: undefined,
        status: undefined
    };
    $scope.periodConfig = [
        {name: '学前', value: 2},
        {name: '小学', value: 4},
        {name: '初中', value: 8},
        {name: '高中', value: 16},
        {name: '职校', value: 32},
        {name: '大学', value: 64},
        {name: '全学段', value: 1024}
    ];

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
    };

    $scope.openEndDate = function ($event) {
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

    //---- 状态配置 开始 -------------------------------------------------------
    $scope.statusA = function () {
        if (!$scope.checkedA && !$scope.checkedB) {
            $scope.queryFields.status = 0;
        }

        if (!$scope.checkedA) {
            $scope.checkedA = false
            return;
        }

        $scope.checkedA = true;
        $scope.checkedB = false;
        $scope.queryFields.status = 1;

    };
    $scope.statusB = function () {
        if (!$scope.checkedA && !$scope.checkedB) {
            $scope.queryFields.status = 0;
        }

        if (!$scope.checkedB) {
            $scope.checkedB = false
            return;
        }
        $scope.checkedB = true;
        $scope.checkedA = false;
        $scope.queryFields.status = 2;
    };
    //---- 状态配置 结束 -------------------------------------------------------

    var psychologicalInformation = (function () {

        // 取出当前token 与 orgid值
        var token = APPMODEL.Storage.copPage_token;

        var getService = function (method, arr, list, fn) {
            applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr, list).then(fn);
        }

        // 获取心理资讯列表
        var getPsychInformation = function () {

            var pageIndex = $scope.pagination.currentPage,
                pageSize = $scope.pagination.itemsPerPage,
                sDate = $filter('date')($scope.sDate, 'yyyy-MM-dd') || null,
                eDate = $filter('date')($scope.eDate, 'yyyy-MM-dd') || null,
                gid = $scope.queryFields.gid || 0,
                title = $scope.queryFields.title || '',
                state = $scope.queryFields.status || 0,
                type = 2,
                period = $scope.queryFields.period || 0;

            getService('getPsychInformation', [token, pageIndex, pageSize, sDate, eDate, gid, title, state, type, period], undefined, function (data) {
                if (data.Ret === 0) {

                    if (data.Data) {
                        $scope.dataList = data.Data.ViewModelList;
                        $scope.pagination.totalItems = data.Data.TotalRecords;
                        $scope.pagination.numPages = data.Data.Pages;
                    } else {
                        $scope.dataList = $scope.pagination.totalItems = $scope.pagination.numPages = undefined;
                    }
                }
            });
        };
        return {
            getPsychInformationList: getPsychInformation
        }
    })();

    psychologicalInformation.getPsychInformationList();

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
        psychologicalInformation.getPsychInformationList();
    };

    // 查看
    $scope.save = function (id) {
        $location.path('access/app/internal/knowledgeInformation/detailPsychologicalInformationMonitoring/' + (id || 0));
    };

}]);
