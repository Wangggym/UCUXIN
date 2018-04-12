app.controller('testReportController', ['$scope', '$stateParams', 'applicationServiceSet', function ($scope, $stateParams, applicationServiceSet) {
    'use strict';
    var result = {
        /**
         * 入口
         */
        init : function () {
            result.pageData();
            result.onEvent();
            result.getAllList();
        },
        /**
         * 页面数据初始化
         */
        pageData : function () {
            // 任务名称
            $scope.name = '';
            // 基本信息
            $scope.testRecord = {};
            // 答题情况
            $scope.answers = [];
            // 因子得分
            $scope.factors = [];
            // 测试记录ID
            $scope.id = $stateParams.id;
        },
        /**
         * 绑定页面相关的事件
         */
        onEvent : function () {
            // 返回
            $scope.cancel = function () {
                window.history.back();
            }
        },
        /**
         * 获取所有list
         */
        getAllList:function () {
            applicationServiceSet.mentalHealthService._psyTestTask._GetTestRecordResult.send([sessionStorage.getItem('copPage_token'),$scope.id]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.name = data.Data.ScaleTestTaskName;
                    $scope.testRecord = data.Data.TestRecord;
                    switch (parseInt($scope.testRecord.MType)){
                        case 11:
                            $scope.testRecord.mTypeName = '教师';
                            break;
                        case 12:
                            $scope.testRecord.mTypeName = '家长';
                            break;
                        default:
                            $scope.testRecord.mTypeName = '学生';
                    }
                    $scope.answers = data.Data.TestRecordAnswers;
                    $scope.factors = data.Data.TestRecordFactors;
                }
            });
        }
    };
    result.init();
}]);
