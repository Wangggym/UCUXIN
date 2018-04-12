/**
 * Created by fanweihua on 2016/7/14.
 * teacherHairpinController
 * 单个发卡
 */
app.controller('teacherHairpinController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    /**
     * 入口,获取老师信息,新增,批量处理cardList
     * @type {{init: init, getTeacherInfo: getTeacherInfo, addCard: addCard, checkedList: checkedList}}
     */
    var teacherHairpin = {
        /**
         * 入口
         */
        init: function () {
            teacherHairpin.getTeacherInfo();
        },
        /**
         * 获取老师信息
         */
        getTeacherInfo: function () {
            if (APPMODEL.Storage.getItem("searchObj")) {
                $scope.searchObj = JSON.parse(APPMODEL.Storage.getItem("searchObj"));
            }
            /**
             * 个人信息
             * @param data
             */
            var personal = function (data) {
                if (data) {
                    $scope.name = data.MName;
                    $scope.gender = data.Gender;
                    teacherHairpin.addCard();//新增
                    if (data.CardNoList) {
                        for (var i in data.CardNoList) {
                            if (data.CardNoList[i].CardType == 1) {
                                data.CardNoList[i].noOperation = true;
                                data.CardNoList[i].operation = false;
                            } else {
                                data.CardNoList[i].noOperation = false;
                                data.CardNoList[i].operation = true;
                            }
                        }
                        teacherHairpin.checkedList(data.CardNoList);
                    }
                }
            };
            $scope.checked = false;
            if ($stateParams.umid == 0) {
                $stateParams.umid = 0;
            }
            $scope.isEearch = $stateParams.isEearch;
            if ($scope.searchObj.selectedGid) {
                applicationServiceSet.internalServiceApi.cardManagement.getUserCardInfoByUMID.send([APPMODEL.Storage.getItem("copPage_token"), $scope.searchObj.selectedGid, $stateParams.umid, $scope.checked]).then(function (data) {
                    personal(data.Data);
                });
            }
        },
        /**
         * 新增
         */
        addCard: function () {
            $scope.cardList = [];
            /**
             * 新增卡号
             */
            $scope.addCard = function () {
                var cardLength = isStartCard($scope.card);
                if ($scope.card && cardLength) {
                    applicationServiceSet.internalServiceApi.cardManagement.addSignCardInfo.send([APPMODEL.Storage.getItem("gid"), $stateParams.umid, $scope.card, 11, ""]).then(function (data) {
                        if (data.Ret == 0) {
                            list(data.Data);
                        }
                    });
                }
            };
            /**
             * 失去焦点
             */
            $scope.ngBluer = function (startCard) {
                isStartCard(startCard);
            };
            /**
             * 判断数据是否够位数
             * @param card
             */
            var isStartCard = function (card) {
//                if (!card) {
//                    $scope.visibleCard = true;
//                    $("*[ng-model='card']").focus();
//                    return false;
//                }
//                if (card.length < 10) {
//                    $scope.visibleCard = true;
//                    $("*[ng-model='card']").focus();
//                    return false;
//                } else {
//                    $scope.visibleCard = false;
//                    return true;
//                }
                return true;
            };
            /**
             * 实例化列表
             * @param data
             */
            var list = function (data) {
                if (data.ST == 0) {
                    data.status = "正常";
                    data.visible = true;
                    data.visibleStatus = false;
                    data.operation = true;
                } else if (data.ST == -1) {
                    data.status = "删除/不可用";
                    data.visible = false;
                    data.visibleStatus = true;
                    data.isStatus = "已注销";
                }
                $scope.cardList.push(data);
            };
            /**
             * 注销卡号
             * @param card
             */
            $scope.deleteCardInfo = function (card) {
                $scope.cardList.splice($scope.cardList.indexOf(card), 1);
                applicationServiceSet.internalServiceApi.cardManagement.deleteCardInfo.send([APPMODEL.Storage.getItem("copPage_token"), card.ID]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success("注销成功");
                    }
                });
            };
            /**
             * cancel card
             * @param card
             */
            $scope.cancelBind = function (card) {
                if (card.CardNo) {
                    applicationServiceSet.internalServiceApi.cardManagement.UnBindCardNo.send([APPMODEL.Storage.getItem("copPage_token"), card.CardNo]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("解除卡号绑定");
                            $scope.cardList.splice($scope.cardList.indexOf(card), 1)
                        }
                    });
                }
            };
            /**
             * 是否显示已注销卡号
             */
            $scope.checkedOne = function () {
                if ($scope.checked) {
                    $scope.checked = true;
                } else {
                    $scope.checked = false;
                }
                applicationServiceSet.internalServiceApi.cardManagement.getUserCardInfoByUMID.send([APPMODEL.Storage.getItem("copPage_token"), APPMODEL.Storage.getItem("gid"), $stateParams.umid, $scope.checked]).then(function (data) {
                    teacherHairpin.checkedList(data.Data.CardNoList);
                });
            };
        },
        /**
         * 批量处理cardList
         * @param data
         */
        checkedList: function (data) {
            var arr = [];
            if ($scope.checked) {
                for (var i in data) {
                    if (data[i].ST == -1) {
                        data[i].status = "删除/不可用";
                        data[i].visible = false;
                        data[i].visibleStatus = true;
                        data[i].isStatus = "已注销";
                        arr.push(data[i]);
                    }
                }
            } else {
                for (var i in data) {
                    if (data[i].ST == 0) {
                        data[i].status = "正常";
                        data[i].visible = true;
                        data[i].visibleStatus = false;
                        data[i].operation = true;
                        arr.push(data[i]);
                    }
                }
            }
            $scope.cardList = arr;
        },
        /**
         * tip
         */
        tip: function () {
            toastr.toastrConfig.positionClass = 'toast-top-center';
            toastr.toastrConfig.timeOut = 2000;
        }
    };
    teacherHairpin.init();//发卡实例化
}]);