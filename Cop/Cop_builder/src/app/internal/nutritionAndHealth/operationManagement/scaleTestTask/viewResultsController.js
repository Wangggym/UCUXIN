/**
 * Created by fanweihua on 2016/12/21.
 * viewResultsController
 * view results
 */
app.controller('viewResultsController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var viewResults = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                recordID: $stateParams.recordID,
                topGName: undefined,
                className: undefined,
                name: undefined,
                height: undefined,
                weight: undefined,
                age: undefined,
                AnswerScores: [],
                AnswerSigns: []
            };
        },
        /**
         * 操作
         */
        operation: function () {
            alert(0);
            /**
             * 返回
             */
            $scope.return = function () {
                $window.history.back();
            };
            this.service.getTestResult();//获取测试人员结果
        },
        /**
         * 服务结合
         */
        service: (function () {
            return {
                /**
                 * 获取测试人员结果
                 */
                getTestResult: function () {
                    applicationServiceSet.internalServiceApi.nutritionHealth.GetTestResult.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.recordID]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.topGName = data.Data.TopGName;
                            $scope.model.className = data.Data.ClassName;
                            $scope.model.name = data.Data.UName;
                            var AnswerSignsList = [];
                            for (var i in data.Data.AnswerScores) {
                                var AnswerSigns = {
                                    "num": data.Data.AnswerScores[i],
                                    "name": data.Data.AnswerSigns[i]
                                };
                                AnswerSignsList.push(AnswerSigns);
                            }
                            $scope.model.AnswerSignsList = AnswerSignsList;
                            $scope.model.Properties = data.Data.Properties;
                        }
                    });
                }
            };
        })()
    };
    viewResults.init();//函数入口
}]);