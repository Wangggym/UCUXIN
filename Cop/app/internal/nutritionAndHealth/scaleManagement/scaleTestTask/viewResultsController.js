/**
 * Created by fanweihua on 2016/12/21.
 * viewResultsController
 * view results
 */
app.controller('viewResultsScaleController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
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
                AnswerSigns: [],
                WeiOrHeiDescs:[]
            };
        },
        /**
         * 操作
         */
        operation: function () {
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
                 * 获取测试人员结果，LstFactorScore，因子结果为空
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
                            $scope.model.Height = data.Data.WeiOrHeiDescs[0].Name;
                            $scope.model.HeightscoreValue = data.Data.WeiOrHeiDescs[0].Value;
                            $scope.model.HeightDesc = data.Data.WeiOrHeiDescs[0].Desc;
                            $scope.model.Weight = data.Data.WeiOrHeiDescs[1].Name;
                            $scope.model.WeightscoreValue = data.Data.WeiOrHeiDescs[1].Value;
                            $scope.model.WeightDesc = data.Data.WeiOrHeiDescs[1].Desc;

                            $scope.model.resultData = data.Data.LstFactorScore;
                        }
                    });
                }

            };
        })()
    };
    viewResults.init();//函数入口
}]);