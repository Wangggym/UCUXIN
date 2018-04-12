/**
 * Created by fanweihua on 2016/12/21.
 * getTestPeopleController
 * get test people
 */
app.controller('getTestPeopleController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    /**
     * 已测试人员清单
     * @type {{init: init, variable: variable, operation: operation, setting: setting, service}}
     */
    var getTestPeople = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.service.pageIndex();//page index
            this.operation();//操作
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                topGID: undefined,
                orderID: undefined,
                classID: undefined,
                umid: undefined,
                pSize: 20,
                pIndex: 1,
                classList: [],
                studentList: []
            };
            if ($stateParams.orderID) {
                $scope.model.orderID = $stateParams.orderID;
                $scope.model.topGID = $stateParams.TopGID;
                this.setting.timeData();
            }
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * 学生选择
             */
            $scope.selectClassId = function () {
                if ($scope.model.classID) {
                    getTestPeople.service.getStudents();//根据班级获取学生列表
                }
            };
            /**
             * 查询
             */
            $scope.search = function () {
                getTestPeople.service.getTestPeople();//获取已测试人员清单
            };
            /**
             * 查看结果
             * @param item
             */
            $scope.viewResults = function (item) {
                $location.url('access/app/internal/nutritionScalMannage/viewResults?recordID=' + item.ID);
            };
            this.service.getSchClass();//获取机构下的所有班级
            $scope.search();//查询
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 数据整理
                 * @returns {{classID: undefined, umid: undefined}}
                 */
                dataArrangement: function () {
                    var data = {
                        classID: undefined,
                        umid: undefined
                    };
                    if (!$scope.model.classID) {
                        data.classID = 0;
                    } else {
                        data.classID = $scope.model.classID;
                    }
                    if (!$scope.model.umid) {
                        data.umid = 0;
                    } else {
                        data.umid = $scope.model.umid;
                    }
                    return data;
                },
                /**
                 * 数据处理
                 * @param data
                 */
                dataHandle: function (data) {
                    $scope.model.itemList = data.ViewModelList;
                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
                },
                timeData: function () {
                    $scope.today = function () {
                        var date = new Date();
                        $scope.dateStart = undefined;
                        $scope.dateOver = undefined;
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
                    $scope.initDate = new Date('2016-15-20');
                    $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
                    $scope.format = $scope.formats[1];
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
                }
            };
        })(),
        /**
         * 服务集合
         */
        service: (function () {
            return {
                /**
                 * 获取已测试人员清单
                 */
                getTestPeople: function () {
                    var data = getTestPeople.setting.dataArrangement();//数据整理
                    applicationServiceSet.internalServiceApi.nutritionHealth.GetTestPeople.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.topGID, $scope.model.orderID, data.classID, data.umid, getTestPeople.setting.dateChange($scope.dateStart), getTestPeople.setting.dateChange($scope.dateOver), $scope.model.pSize, $scope.model.pIndex]).then(function (data) {
                        if (data.Ret == 0) {
                            getTestPeople.setting.dataHandle(data.Data);//数据处理
                        }
                    });
                },
                /**
                 * 获取机构下的所有班级
                 * @constructor
                 */
                getSchClass: function () {
                    applicationServiceSet.internalServiceApi.cardManagement.getSchClassInfo.send([APPMODEL.Storage.getItem("copPage_token"), $scope.model.topGID]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.classList = data.Data;
                        }
                    });
                },
                /**
                 * 根据班级获取学生列表
                 */
                getStudents: function () {
                    applicationServiceSet.internalServiceApi.nutritionHealth.GetStudents.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.topGID, $scope.model.classID]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.studentList = data.Data;
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
                            var data = getTestPeople.setting.dataArrangement();//数据整理
                            applicationServiceSet.internalServiceApi.nutritionHealth.GetTestPeople.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.topGID, $scope.model.orderID, data.classID, data.umid, getTestPeople.setting.dateChange($scope.dateStart), getTestPeople.setting.dateChange($scope.dateOver), $scope.model.pSize, page.pIndex]).then(function (data) {
                                if (data.Ret == 0) {
                                    getTestPeople.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            var data = getTestPeople.setting.dataArrangement();//数据整理
                            applicationServiceSet.internalServiceApi.nutritionHealth.GetTestPeople.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.topGID, $scope.model.orderID, data.classID, data.umid, getTestPeople.setting.dateChange($scope.dateStart), getTestPeople.setting.dateChange($scope.dateOver), $scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    getTestPeople.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            var data = getTestPeople.setting.dataArrangement();//数据整理
                            applicationServiceSet.internalServiceApi.nutritionHealth.GetTestPeople.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.topGID, $scope.model.orderID, data.classID, data.umid, getTestPeople.setting.dateChange($scope.dateStart), getTestPeople.setting.dateChange($scope.dateOver), $scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    getTestPeople.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        }
                    };
                }
            };
        })()
    };
    getTestPeople.init();//函数入口
}]);