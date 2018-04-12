/**
 * Created by fanweihua on 2017/3/14.
 * openTrialClassController
 * 开启试用的班级
 */
app.controller('openTrialClassController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * @type {{init: init, variable: variable, operation: operation, setting, serviceApi}}
     */
    var openTrialClass = {
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
                studentList: []
            };
            this.serviceApi.getClassList();//get class list
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * 返回
             */
            $scope.historyBack = function () {
                for (var i in openTrialClass) {
                    delete openTrialClass[i];
                }
                $location.url('access/app/partner/applicationFeeOpen/openCharge?gid=' + $stateParams.gid + '&productPackageID=' + $stateParams.productPackageID);
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
             * 确定
             */
            $scope.save = function () {
                openTrialClass.serviceApi.openBatchTry();//按班级批量开启试用
            };
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                classIDs: function () {
                    var classIds = [];
                    for (var i in $scope.model.studentSelectedList) {
                        classIds.push($scope.model.studentSelectedList[i].ClassID);
                    }
                    return classIds;
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
                 * 按班级批量开启试用
                 */
                openBatchTry: function () {
                    if (openTrialClass.setting.classIDs().length == 0) {
                        toastr.error('请选择班级');
                        return;
                    }
                    applicationServiceSet.chargeServiceApi.chargeService.OpenBatchTry.send([$stateParams.gid, $stateParams.productPackageID, openTrialClass.setting.classIDs(), openTrialClass.setting.dateChange($scope.model.dateStart), openTrialClass.setting.dateChange($scope.model.dateOver)], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('开启成功');
                            for (var i in openTrialClass) {
                                delete openTrialClass[i];
                            }
                            $location.url('access/app/partner/applicationFeeOpen/openCharge?gid=' + $stateParams.gid + '&productPackageID=' + $stateParams.productPackageID);
                        }
                    });
                }
            }
        })()
    };
    openTrialClass.init();//入口
}]);