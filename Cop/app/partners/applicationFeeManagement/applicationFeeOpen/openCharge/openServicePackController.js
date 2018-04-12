/**
 * Created by fanweihua on 2017/3/13.
 * openServicePackController
 * 开通服务包
 */
app.controller('openServicePackController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * @type {{init: init, variable: variable, operation: operation, serviceApi}}
     */
    var openServicePack = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
            this.setting.timeData();//init time
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                gidName: $stateParams.gidName,
                productPackageName: $stateParams.productPackageName,
                classList: [],
                studentName: undefined,
                classId: undefined,
                studentSelectedList: [],
                studentList: [],
                openProductList: []
            };
            this.serviceApi.getClassList();//get class list
            this.serviceApi.getChargeListByProductId();//根据产品Id获取服务包列表
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * 返回
             */
            $scope.historyBack = function () {
                for (var i in openServicePack) {
                    delete openServicePack[i];
                }
                $location.url('access/app/partner/applicationFeeOpen/openCharge?gid=' + $stateParams.gid + '&productPackageID=' + $stateParams.productPackageID);
            };
            /**
             * 选择班级
             */
            $scope.changeClass = function () {
                openServicePack.serviceApi.getStudentList();//获取学生列表
            };
            /**
             * 添加学生
             * @param item
             * @param index
             */
            $scope.addStudent = function (item, index) {
                $scope.model.classList.splice(index, 1);
                $scope.model.studentSelectedList.push(item);
            };
            /**
             * 删除学生列表
             * @param item
             * @param index
             */
            $scope.deleteSelected = function (item, index) {
                $scope.model.studentSelectedList.splice(index, 1);
                $scope.model.classList.push(item);
            };
            /**
             * 重置
             */
            $scope.clearStudentSelected = function () {
                for (var i in $scope.model.studentSelectedList) {
                    $scope.model.classList.push($scope.model.studentSelectedList[i]);
                }
                $scope.model.studentSelectedList = [];
            };
            /**
             * input checkbox change
             * @param openProductList
             * @param index
             */
            $scope.checkedOne = function (openProductList, index) {
                angular.forEach(openProductList, function (value, key) {
                    if (key == index) {
                        value.checked = true;
                    } else {
                        value.checked = false;
                    }
                });
            };
            /**
             * 保存
             */
            $scope.save = function () {
                //按班级批量开启服务包之前的的校验
                openServicePack.serviceApi.openBatchChargeStuBefore(function (data) {
                    $modal.open({
                        templateUrl: 'openServicePackModalContent.html',
                        controller: 'openServicePackModalContentCtrl',
                        keyboard: false,
                        backdrop: false,
                        resolve: {
                            data: function () {
                                return data;
                            },
                            service: function () {
                                return openServicePack.serviceApi;
                            }
                        }
                    });
                });
            };
        },
        setting: (function () {
            return {
                classIDs: function () {
                    var classIds = [];
                    for (var i in $scope.model.studentSelectedList) {
                        classIds.push($scope.model.studentSelectedList[i].ClassID);
                    }
                    return classIds;
                },
                chargeIDs: function () {
                    var chargeIds = [];
                    for (var i in $scope.model.openProductList) {
                        if ($scope.model.openProductList[i].checked) {
                            chargeIds.push($scope.model.openProductList[i].ID)
                        }
                    }
                    return chargeIds;
                },
                /**
                 * date change
                 * @param date
                 * @returns {*}
                 */
                dateChange: function (date) {
                    var isEffective = date instanceof Date ? true : false;
                    if (isEffective) {
                        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                    } else {
                        return date;
                    }
                },
                /**
                 * init time
                 */
                timeData: function () {
                    $scope.today = function () {
                        var date = new Date();
                        $scope.model.dateStart = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                        $scope.model.dateOver = $scope.model.dateStart;
                    };
                    $scope.today();
                    $scope.clear = function () {
                        $scope.dt = null;
                    };
                    // Disable weekend selection
                    $scope.disabled = function (date, mode) {
                        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
                    };
                    $scope.toggleMin = function () {
                        $scope.minDate = $scope.minDate ? null : new Date();
                    };
                    $scope.toggleMin();
                    $scope.openStart = function ($event) {
                        $scope.openedOver = false;
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.openedStart = true;
                    };
                    $scope.openOver = function ($event) {
                        $scope.openedStart = false;
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.openedOver = true;
                    };
                    $scope.dateOptions = {
                        formatYear: 'yy',
                        startingDay: 1,
                        class: 'datepicker'
                    };
                    $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
                    $scope.format = $scope.formats[1];
                }
            };
        })(),
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * get class list
                 */
                getClassList: function () {
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.getClassList.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.gid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.classList = data.Data;
                        }
                    });
                },
                /**
                 * 根据产品Id获取服务包列表
                 */
                getChargeListByProductId: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetChargeListByProductId.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.productPackageID]).then(function (data) {
                        if (data.Ret == 0) {
                            for (var i in data.Data) {
                                data.Data[i].SDateEDate = data.Data[i].SDate + '~' + data.Data[i].EDate;
                                data.Data[i].BuySDateBuyEDate = data.Data[i].BuySDate + '~' + data.Data[i].BuyEDate;
                            }
                            $scope.model.openProductList = data.Data;
                        }
                    });
                },
                /**
                 * 按班级批量开启服务包之前的的校验
                 */
                openBatchChargeStuBefore: function (callBack) {
                    if (openServicePack.setting.classIDs().length == 0) {
                        toastr.error('请选择班级');
                        return;
                    }
                    if (openServicePack.setting.chargeIDs().length == 0) {
                        toastr.error('请选择服务包');
                        return;
                    }
                    applicationServiceSet.chargeServiceApi.chargeService.OpenBatchChargeStuBefore.send([$stateParams.gid, $stateParams.productPackageID, openServicePack.setting.classIDs(), openServicePack.setting.chargeIDs(), openServicePack.setting.dateChange($scope.model.dateStart), openServicePack.setting.dateChange($scope.model.dateOver)], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            callBack(data.Data);
                        }
                    });
                },
                /**
                 * 按班级批量开启服务包
                 */
                openBatchChargeStu: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.OpenBatchChargeStu.send([$stateParams.gid, $stateParams.productPackageID, openServicePack.setting.classIDs(), openServicePack.setting.chargeIDs(), openServicePack.setting.dateChange($scope.model.dateStart), openServicePack.setting.dateChange($scope.model.dateOver)], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('开启成功');
                            for (var i in openServicePack) {
                                delete openServicePack[i];
                            }
                            $location.url('access/app/partner/applicationFeeOpen/openCharge?gid=' + $stateParams.gid + '&productPackageID=' + $stateParams.productPackageID);
                        }
                    });
                }
            };
        })()
    };
    openServicePack.init();//入口
}]);
app.controller('openServicePackModalContentCtrl', ['$scope', '$modalInstance', 'data', 'service', function ($scope, $modalInstance, data, service) {
    $scope.modelModal = {
        AllCnt: data.AllCnt,
        AccordCnt: data.AccordCnt
    };
    /**
     * 确定
     */
    $scope.save = function () {
        service.openBatchChargeStu();//按班级批量开启服务包
        $modalInstance.dismiss('cancel');
    };
    /**
     * 取消
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
}]);