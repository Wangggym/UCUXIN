/**
 * Created by fanweihua on 2016/7/13.
 * classBatchCodeController
 * 班级批量发卡
 */
app.controller('classBatchCodeController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    /**
     * 班级批量发卡入口
     * @type {{init: init, schNameChange: schNameChange, getSchClass: getSchClass}}
     */
    var classBatchCode = {
        /**
         * 入口
         */
        init: function () {
            classBatchCode.getSchClass();//获取机构下的所有班级
        },
        /**
         * 选择班级
         */
        schNameChange: function () {
            $scope.person = {
                selected: undefined
            };
            $scope.deletePerson = function () {
                $scope.person.selected = undefined;
                $scope.totalNum = undefined;
                $scope.bindNum = undefined;
                $scope.startCard = undefined;
                $scope.unBindNum = undefined;
                $scope.endCard = undefined;
            };
            $scope.schNameChange = function () {
                applicationServiceSet.internalServiceApi.cardManagement.searchSchNameChange.send([APPMODEL.Storage.getItem("copPage_token"), $scope.searchObj.gid, $scope.person.selected.SchoolClassID]).then(function (data) {
                    if (data.Ret == 0) {
                        classInfoBind(data.Data);//数据绑定
                    }
                });
            };
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
                    return false;
                }
                if (startCard.length < 10) {
                    $scope.visibleCard = true;
                    $("*[ng-model='startCard']").focus();
                    return false;
                } else {
                    $scope.visibleCard = false;
                    return true;
                }
            };
            /**
             * 数据绑定
             * @param data
             */
            var classInfoBind = function (data) {
                $scope.totalNum = data.TotalNum;//班级总人数
                $scope.bindNum = data.BindNum;//已经绑卡人数
                $scope.unBindNum = data.UnBindNum;//未绑卡人数
                $scope.noPhoneNum = data.NoPhoneNum;//未录入家长电话
                if ($scope.noPhoneNum != 0) {
                    $scope.visible = true;
                    /**
                     * 去录入家长电话
                     */
                    $scope.inputTelephone = function () {
                        window.location.href = "http://m.ucuxin.com/";
                    };
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
                    applicationServiceSet.internalServiceApi.cardManagement.addStuBatchCardInfo.send([APPMODEL.Storage.getItem("copPage_token"), $scope.searchObj.gid, $scope.person.selected.SchoolClassID, $scope.startCard]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("绑卡成功");
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
        },
        /**
         * 获取机构下的所有班级
         */
        getSchClass: function () {
            if (APPMODEL.Storage.getItem("searchObj")) {
                $scope.searchObj = JSON.parse(APPMODEL.Storage.getItem("searchObj"));
                applicationServiceSet.internalServiceApi.cardManagement.getSchClassInfo.send([APPMODEL.Storage.getItem("copPage_token"), $scope.searchObj.gid]).then(function (data) {
                    //对数据进行整合
                    bindData.bindSelect(data.Data);
                    classBatchCode.schNameChange();
                });
            }
            /**
             * 数据绑定
             * @type {{bindSelect: bindSelect}}
             */
            var bindData = {
                bindSelect: function (arr) {
                    for (var i in arr) {
                        for (var s in arr) {
                            if (parseInt(arr[s].GradeName.replace(/[^0-9]/ig, "")) < parseInt(arr[i].GradeName.replace(/[^0-9]/ig, ""))) {
                                var middle = arr[s];
                                arr[s] = arr[i];
                                arr[i] = middle;
                            }
                        }
                    }
                    $scope.classes = arr;
                }
            }
        }
    };
    classBatchCode.init();//function init
}]);