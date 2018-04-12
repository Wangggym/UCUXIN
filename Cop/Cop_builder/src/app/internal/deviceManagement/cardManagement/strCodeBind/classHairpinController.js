/**
 * Created by fanweihua on 2016/7/13.
 * classHairpinController
 * 发卡
 */
app.controller('classHairpinController', ['$scope', '$http', '$state', '$stateParams', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, applicationServiceSet, toastr) {
    /**
     * 发卡对象声明,入口,获取学生信息,新增,批量处理cardList
     * @type {{init: init, getStudentInfo: getStudentInfo, addCard: addCard, checkedList: checkedList}}
     */
    var classHairpin = {
        /**
         * 入口
         */
        init: function () {
            classHairpin.getStudentInfo();
        },
        /**
         * 获取学生信息
         */
        getStudentInfo: function () {
            if (APPMODEL.Storage.getItem("searchObj")) {
                $scope.searchObj = JSON.parse(APPMODEL.Storage.getItem("searchObj"));
            }
            /**
             * 个人信息
             * @param data
             */
            var personal = function (data) {
                if (!data) {
                    return;
                }
                $scope.name = data.MName;
                $scope.className = data.ClassName;
                $scope.gender = data.Gender;
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
                    classHairpin.checkedList(data.CardNoList);
                }
            };
            $scope.checked = false;
            $scope.isEearch = $stateParams.isEearch;
            if ($scope.searchObj.gid) {
                applicationServiceSet.internalServiceApi.cardManagement.getUserCardInfoByUMID.send([APPMODEL.Storage.getItem("copPage_token"), $scope.searchObj.gid, $stateParams.umid, $scope.checked]).then(function (data) {
                    if (data.Ret == 0) {
                        personal(data.Data);//个人信息
                        classHairpin.addCard();//新增
                    }
                });
            }
        },
        /**
         * 新增
         */
        addCard: function () {
            /**
             * 新增卡号
             */
            $scope.addCard = function () {
                var card = $scope.card;
                var cardLength = isStartCard(card);
                if (card && cardLength) {
                    applicationServiceSet.internalServiceApi.cardManagement.addSignCardInfo.send([$scope.searchObj.gid, $stateParams.umid, card, 13, ""]).then(function (data) {
                        if (data.Ret == 0) {
                            list(data.Data);
                        }
                    });
                } else {
                    toastr.error("请填写卡号");
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
                applicationServiceSet.internalServiceApi.cardManagement.getUserCardInfoByUMID.send([APPMODEL.Storage.getItem("copPage_token"), $scope.searchObj.gid, $stateParams.umid, $scope.checked]).then(function (data) {
                    classHairpin.checkedList(data.Data.CardNoList);
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
    classHairpin.init();//发卡实例化
}]);