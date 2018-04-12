/**
 * Created by fanweihua on 2016/7/14.
 * teacherBatchCodeController
 * 老师批量发卡
 */
app.controller('teacherBatchCodeController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    /**
     * 入口，获取老师数量，操作
     * @type {{init: init, getTeacherNum: getTeacherNum, operation: operation}}
     */
    var teacherBatchCode = {
        /**
         * 入口
         */
        init: function () {
            teacherBatchCode.getTeacherNum();//获取机构下的所有班级
        },
        /**
         * 获取老师数量
         */
        getTeacherNum: function () {
            if (APPMODEL.Storage.getItem("searchObj")) {
                $scope.searchObj = JSON.parse(APPMODEL.Storage.getItem("searchObj"));
                applicationServiceSet.internalServiceApi.cardManagement.checkStaffCardInfo.send([APPMODEL.Storage.getItem("copPage_token"), $scope.searchObj.selectedGid]).then(function (data) {
                    if (data.Ret == 0) {
                        classInfoBind(data.Data);//数据绑定
                    }
                });
            }
            /**
             * 数据绑定
             * @param data
             */
            var classInfoBind = function (data) {
                $scope.totalNum = data.TotalNum;//老师总人数
                $scope.bindNum = data.BindNum;//已经绑卡人数
                $scope.unBindNum = data.UnBindNum;//未绑卡人数
                $scope.noPhoneNum = data.NoPhoneNum;//未录入老师电话
                if ($scope.noPhoneNum != 0) {
                    $scope.visible = true;
                    /**
                     * 去录入家长电话
                     */
                    $scope.inputTelephone = function () {
                        window.location.href = "http://m.ucuxin.com/";
                    };
                }
                teacherBatchCode.operation();//操作
            };
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * 失去焦点
             */
            $scope.ngBluer = function (startCard) {
                isStartCard(startCard);
            };
            /**
             * 判断数据是否够位数
             * @param startCard
             */
            var isStartCard = function (startCard) {
                if (!startCard) {
                    $scope.visibleCard = true;
                    $("*[ng-model='startCard']").focus();
                    $scope.reStaffBatchCardInfo = '卡号必须是10位有效数字';
                    return false;
                }
                if (startCard.toString().length < 10 || startCard.toString().length > 10) {
                    $scope.visibleCard = true;
                    $("*[ng-model='startCard']").focus();
                    $scope.reStaffBatchCardInfo = '卡号必须是10位有效数字';
                    return false;
                } else {
                    $scope.visibleCard = false;
                    return true;
                }
            };
            /**
             * 确定发卡
             */
            $scope.preservationBatch = function () {
                var isCardLength = isStartCard($scope.startCard);
                if (!$scope.totalNum || $scope.totalNum == "" || $scope.unBindNum == 0) {
                    toastr.error("请确定可绑卡人数");
                    return;
                }
                if (isCardLength) {
                    applicationServiceSet.internalServiceApi.cardManagement.addStaffBatchCardInfo.send([APPMODEL.Storage.getItem("copPage_token"), $scope.searchObj.selectedGid, $scope.startCard]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("发卡成功");
                        } else {
                            $scope.visibleCard = true;
                            $scope.reStaffBatchCardInfo = data.Msg;
                        }
                    });
                }
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
    teacherBatchCode.init();
}]);