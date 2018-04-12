/**
 * Created by fanweihua on 2017/3/15.
 * addPushSetController
 * 添加推送
 */
app.controller('addPushSetController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    /**
     * @type {{init: init, variable: variable, operation: operation, serviceApi: {}}}
     */
    var addPushSet = {
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
                gidName: $stateParams.gidName,
                ReceiveArea: 1,
                classList: [],
                classNameList: [],
                className: undefined,
                studentList: [],
                studentSelectedList: [],
                filterStudentName: '',
                ReceiveObj: undefined,
                productID: undefined,
                productList: [],
                servicePack: undefined,
                servicePackList: []
            };
            this.serviceApi.getClassList();//get class list
            this.serviceApi.getProductListByGid();//根据学校GID获取产品包列表
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * 返回
             */
            $scope.historyBack = function () {
                for (var i in addPushSet) {
                    delete addPushSet[i];
                }
                $window.history.back();
            };
            /**
             * 班级选择
             */
            $scope.changeClassName = function () {
                addPushSet.serviceApi.getStudentList();//根据班级获取学生列表
            };
            /**
             * 删除产品
             */
            $scope.deleteProduct = function () {
                $scope.model.productID = undefined;
                $scope.model.servicePack = undefined;
                $scope.model.servicePackList = [];
            };
            /**
             * 添加学生
             * @param item
             */
            $scope.addStudent = function (item) {
                $scope.model.studentList.splice($scope.model.studentList.indexOf(item), 1);
                $scope.model.studentSelectedList.push(item);
            };
            /**
             * 删除学生
             * @param item
             */
            $scope.deleteSelected = function (item) {
                $scope.model.studentSelectedList.splice($scope.model.studentSelectedList.indexOf(item), 1);
                $scope.model.studentList.push(item);
            };
            /**
             * 重置
             */
            $scope.clearStudentSelected = function () {
                for (var i in $scope.model.studentSelectedList) {
                    $scope.model.studentList.push($scope.model.studentSelectedList[i]);
                }
                $scope.model.studentSelectedList = [];
            };
            /**
             * 选择产品包
             */
            $scope.productChange = function () {
                addPushSet.serviceApi.getChargeListByProductId();//根据产品Id获取服务包列表
            };
            /**
             * 确定
             */
            $scope.confirm = function () {
                addPushSet.serviceApi.pushFixEntryNewTask();//固定入口推送
            };
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                dataHandle: function () {
                    if ($scope.model.ReceiveArea == 2) {
                        return $scope.model.classNameList;
                    } else if ($scope.model.ReceiveArea == 3) {
                        var arr = [];
                        for (var i in $scope.model.studentSelectedList) {
                            arr.push($scope.model.studentSelectedList[i].UMID);
                        }
                        return arr;
                    }
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
                 * 根据班级获取学生列表
                 */
                getStudentList: function () {
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetStudentList.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.gid, $scope.model.className]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.studentList = data.Data;
                        }
                    });
                },
                /**
                 * 根据学校GID获取产品包列表
                 */
                getProductListByGid: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetProductListByGid.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.gid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.productList = data.Data;
                        }
                    });
                },
                /**
                 * 根据产品Id获取服务包列表
                 */
                getChargeListByProductId: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetChargeListByProductId.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.productID]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.servicePackList = data.Data;
                        }
                    });
                },
                /**
                 * 固定入口推送
                 */
                pushFixEntryNewTask: function () {
                    var addPushSetMsg = [];
                    if ($scope.model.ReceiveArea == 2) {
                        addPushSetMsg = addPushSet.setting.dataHandle();
                        if (!addPushSetMsg || addPushSetMsg.length == 0) {
                            toastr.error('请选择班级');
                            return;
                        }
                    } else if ($scope.model.ReceiveArea == 3) {
                        addPushSetMsg = addPushSet.setting.dataHandle();
                        if (!addPushSetMsg || addPushSetMsg.length == 0) {
                            toastr.error('请选择学生');
                            return;
                        }
                    }
                    applicationServiceSet.chargeServiceApi.chargeService.PushFixEntryNewTask.send([$stateParams.gid, $scope.model.productID, $scope.model.ReceiveArea, $scope.model.ReceiveObj, addPushSet.setting.dataHandle(), $scope.model.servicePack], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('推送成功');
                            $scope.historyBack();
                        }
                    });
                }
            };
        })()
    };
    addPushSet.init();//入口
}]);