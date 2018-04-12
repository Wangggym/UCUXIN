/**
 * Created by fanweihua on 2016/12/20.
 * scaleTestTaskController
 * scale test task
 */
app.controller('scaleTestTaskController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    /**
     * 测试任务
     * @type {{init: init, variable: variable, operation: operation, setting, service}}
     */
    var scaleTestTask = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
            this.service.pageIndex();//page index
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                schoolList: [],
                selectedGid: undefined,
                status: undefined,
                statusI: undefined,
                statusList: [
                    {
                        "name": "未开始",
                        "id": 0,
                        "sid": -1
                    },
                    {
                        "name": "进行中",
                        "id": 1,
                        "sid": 1
                    },
                    {
                        "name": "已完成",
                        "id": 2,
                        "sid": 2
                    },
                    {
                        "name": "全部",
                        "id": 3,
                        "sid": 3
                    }
                ],
                pSize: 20,
                pIndex: 1
            }
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * refresh service get school list
             * @param selectedGid
             */
            $scope.refreshAddresses = function (selectedGid) {
                if (selectedGid) {
                    scaleTestTask.service.getOrgSchoolPage(selectedGid);//get school org pages list
                }
            };
            /**
             * 状态选择
             */
            $scope.selectStatus = function () {
                for (var i in $scope.model.statusList) {
                    if ($scope.model.status == $scope.model.statusList[i].id) {
                        $scope.model.statusI = $scope.model.statusList[i].id;
                        break;
                    }
                }
            };
            /**
             * 查询
             */
            $scope.search = function () {
                scaleTestTask.service.getTestTask();//get school org pages list
            };
          /**
           * 下载PC测试任务
           */
          $scope.loadPcTest = function (item) {
            var url = urlConfig + 'Nutri/v3/Test/DownloadPCTestFile?token=' + APPMODEL.Storage.getItem("copPage_token") + '&id=' + item.ID;
            window.open(url);
          };
          /**
             * 发送消息提醒
             * @param item
             */
            $scope.sendNotifications = function (item) {
                if (item.ID) {
                    //var date = new Date();
                   // var bDate = parseFloat(item.BDate.split("-")[0]) + parseFloat(item.BDate.split("-")[1]) + parseFloat(item.BDate.split("-")[2]);
                    var bDate = new Date(item.BDate).getTime();
                    var nowDate = new Date().getTime();
                    if (bDate <= nowDate) {
                        item.IsOwn = true;
                        item.IsOwnName = "正在发送中";
                        scaleTestTask.service.getNotifications(item);
                    } else {
                        toastr.error("测试任务还未开始，不能发送！");
                    }
                }
            };
            /**
             * 删除未开始的任务（订单）
             * @param item
             */
            $scope.deleteMine = function (item) {
                var date = new Date();
                var bDate = parseFloat(item.BDate.split("-")[0]) + parseFloat(item.BDate.split("-")[1]) + parseFloat(item.BDate.split("-")[2]);
                var nowDate = date.getFullYear() + date.getMonth() + 1 + date.getDate();
                if (bDate > nowDate) {
                    scaleTestTask.service.removeSchoolOrder(item);//删除未开始的任务（订单）
                } else {
                    toastr.error("测试任务已经开始，不能删除！");
                }
            };
            /**
             * 数据导出
             * @param item
             */
            $scope.exportData = function (item) {
                var url = urlConfig + 'Nutri/v3/Test/GetDownloadFile?token=' + APPMODEL.Storage.getItem("copPage_token") + '&orderId=' + item.ID;
                $window.open(url);
            };
            $scope.search();
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 数据处理
                 * @param data
                 */
                dataHandle: function (data) {
                    $scope.model.itemList = data.ViewModelList;
                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
                }
            };
        })(),
        /**
         * 服务
         */
        service: (function () {
            return {
                /**
                 * get school org pages list
                 * @param selectedGid
                 */
                getOrgSchoolPage: function (selectedGid) {
                    applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList = data.Data;
                        }
                    });
                },
                /**
                 * 获取学校测试任务
                 */
                getTestTask: function () {
                    applicationServiceSet.internalServiceApi.nutritionHealth.GetTestTask.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid, $scope.model.isSchool, $scope.model.name, $scope.model.statusI, $scope.model.pSize, $scope.model.pIndex,$scope.model.taskName]).then(function (data) {
                        if (data.Ret == 0) {
                            scaleTestTask.setting.dataHandle(data.Data);//数据处理
                        }
                    });
                },
                /**
                 * 发送消息提醒
                 * @param item
                 */
                getNotifications: function (item) {
                    applicationServiceSet.internalServiceApi.nutritionHealth.GetNotifications.send([APPMODEL.Storage.getItem('copPage_token'), item.ID]).then(function (data) {
                        if (data.Ret == 0) {
                            setTimeout(function () {
                                toastr.success("发送成功");
                                item.IsOwn = false;
                                item.IsOwnName = "发送提醒";
                            }, 2000);
                        }
                    });
                },
                /**
                 * 删除未开始的任务（订单）
                 * @param item
                 */
                removeSchoolOrder: function (item) {
                    applicationServiceSet.internalServiceApi.nutritionHealth.RemoveSchoolOrder.send(undefined, [APPMODEL.Storage.getItem('copPage_token'), item.ID]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("删除成功");
                            $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
                        }
                    });
                },
                /**
                 * paging function
                 */
                pageIndex: function () {
                    /**
                     * paging index send
                     */
                    $scope.pageIndex = {
                        /**
                         * click paging
                         * @param page
                         */
                        fliPage: function (page) {
                            applicationServiceSet.internalServiceApi.nutritionHealth.GetTestTask.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid, $scope.model.isSchool, $scope.model.name, $scope.model.statusI, $scope.model.pSize, page.pIndex]).then(function (data) {
                                if (data.Ret == 0) {
                                    scaleTestTask.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.nutritionHealth.GetTestTask.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid, $scope.model.isSchool, $scope.model.name, $scope.model.statusI, $scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    scaleTestTask.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.nutritionHealth.GetTestTask.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid, $scope.model.isSchool, $scope.model.name, $scope.model.statusI, $scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    scaleTestTask.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        }
                    };
                }
            };
        })()
    };
    scaleTestTask.init();//方法入口
}]);
