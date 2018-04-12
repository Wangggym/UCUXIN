/**
 * Created by fanweihua on 2016/7/13.
 * classHairpinController
 * 异常数据检查
 */
app.controller('abnormalDataCheckController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    /**
     * 异常数据检查入口函数声明
     */
    var getErrorStuCardInfo = (function () {
        /**
         * 入口
         */
        var init = function () {
            errorStuCardInfo.errorInfo();
        };
        /**
         * 异常数据
         * @type {{errorInfo: errorInfo}}
         */
        var errorStuCardInfo = {
            /**
             * 数据请求
             */
            errorInfo: function () {
                if (APPMODEL.Storage.getItem("searchObj")) {
                    $scope.searchObj = JSON.parse(APPMODEL.Storage.getItem("searchObj"));
                    applicationServiceSet.internalServiceApi.cardManagement.getErrorStuCardInfo.send([APPMODEL.Storage.getItem("copPage_token"), $scope.searchObj.gid]).then(function (data) {
                        if (data.Ret == 0) {
                            errorStuCardInfo.bindData(data.Data);
                        }
                    });
                }
            },
            /**
             * 数据绑定
             * @param data
             */
            bindData: function (data) {
                for (var i in data) {
                    data[i].card = data[i].CardNoList[0].CardNo;
                }
                $scope.studentList = data;
                /**
                 * 注销
                 * @param card
                 */
                $scope.deleteCardInfo = function (card) {
                    $scope.studentList.splice($scope.studentList.indexOf(card), 1);
                    applicationServiceSet.internalServiceApi.cardManagement.deleteCardInfo.send([APPMODEL.Storage.getItem("copPage_token"), id]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("注销成功");
                        }
                    });
                };
            },
            /**
             * tip
             */
            tip: function () {
                toastr.toastrConfig.positionClass = 'toast-top-center';
                toastr.toastrConfig.timeOut = 2000;
            }
        };
        /**
         * 返回
         */
        return{
            init: init
        };
    })();
    getErrorStuCardInfo.init();
}]);