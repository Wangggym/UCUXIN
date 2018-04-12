/**
 * Created by fanweihua on 2016/12/20.
 * addScaleTestTaskController
 * add scale test task
 */
app.controller('addScaleTestTaskController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    /**
     * 新增测试任务
     * @type {{init: init, variable: variable, operation: operation, setting, service}}
     */
    var addScaleTestTask = {
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
                modelName: "新增测试任务",
                schoolList: [],
                selectedGid: undefined,
                name: undefined,
                scaleName: undefined,
                desc: undefined
            };
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
                    addScaleTestTask.service.getOrgSchoolPage(selectedGid);//get school org pages list
                }
            };
            /**
             * 保存
             */
            $scope.save = function () {
                addScaleTestTask.service.addSchoolOrder();//添加测试任务（订单）
            };
            this.setting.timeData();//时间设置
            this.service.getScales();//获取量表清单
            this.setting.stateParams();//参数设置
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 参数设置
                 */
                stateParams: function () {
                    if ($stateParams.Name) {
                        $scope.model.modelName = "查看详情";
                        $scope.model.selectedGid = $stateParams.TopGID;
                        $scope.model.scaleName = $stateParams.ScaID;
                        $scope.model.desc = $stateParams.Desc;
                        $scope.model.dateStart = $stateParams.BDate;
                        $scope.model.dateOver = $stateParams.EDate;
                        $scope.model.name = $stateParams.Name;
                        $scope.refreshAddresses($stateParams.TopGName);//refresh service get school list
                    }
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
                 * 时间设置
                 */
                timeData: function () {
                    $scope.today = function () {
                        var date = new Date();
                        $scope.model.dateStart = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                        $scope.model.dateOver = addScaleTestTask.setting.getNextDateTime();
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
                },
                /**
                 * 获取下一个时间日期
                 */
                getNextDateTime: function () {
                    var myDate = new Date();
                    var nextDateTime = {
                        year: myDate.getFullYear(),//年
                        month: myDate.getMonth() + 1,//月
                        day: myDate.getDate()//日
                    };
                    nextDateTime.month++;
                    if (nextDateTime.month == 13) {
                        nextDateTime.year++;
                        nextDateTime.month = 1;
                    }
                    return nextDateTime.year + "-" + nextDateTime.month + "-" + nextDateTime.day;
                }
            };
        })(),
        /**
         * 服务集合
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
                 * 添加测试任务（订单）
                 */
                addSchoolOrder: function () {
                    applicationServiceSet.internalServiceApi.nutritionHealth.AddSchoolOrder.send([$scope.model.name, $scope.model.selectedGid, $scope.model.scaleName, addScaleTestTask.setting.dateChange($scope.model.dateStart), addScaleTestTask.setting.dateChange($scope.model.dateOver), $scope.model.desc], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("添加成功");
                            $location.path('access/app/internal/nutritionHealth/scaleTestTask');
                        }
                    });
                },
                //获取量表清单
                getScales: function () {
                    applicationServiceSet.internalServiceApi.nutritionHealth.GetScales.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.scaleNameList = data.Data;
                        }
                    });
                }
            };
        })()
    };
    addScaleTestTask.init();//方法入口
}]);