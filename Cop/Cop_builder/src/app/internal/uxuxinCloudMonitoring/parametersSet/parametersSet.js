/**
 * Created by xj on 2017/5/11.
 *
 */
app.controller('parametersSetController', ['$scope', '$http', '$window', 'toastr', 'toastrConfig', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', function ($scope, $http, $window, toastr, toastrConfig, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet) {
    /**
     * 参数设置
     */
    var parametersSet = {
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
                selectedGid: undefined,
                schoolList: [],
                TryMinutes: undefined
            };
            toastrConfig.preventOpenDuplicates = true;
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
                    parametersSet.serviceApi.getOrgSchoolPage(selectedGid);//get school org pages list
                }
            };
            /**
             * 选择学校
             */
            $scope.changeGid = function () {
                parametersSet.serviceApi.getParameters();//according to the school ID get parameters
            };
            /**
             * 删除学校
             */
            $scope.deleteSelectedGid = function () {
                $scope.model.selectedGid = undefined;
            };
            $scope.save = function () {
                parametersSet.serviceApi.saveGrpSetting()//保存云监控参数
            }
        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * get school org pages list
                 * @param selectedGid
                 */
                getOrgSchoolPage: function (selectedGid) {
                    applicationServiceSet.commonService.schoolApi.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList = data.Data;
                        }
                    });
                },
                /**
                 * according to the school ID get parameters
                 */
                getParameters: function () {
                    applicationServiceSet.cloudWatchService.cloudWatchApi.GetGrpSetting.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.TryMinutes = data.Data.TryMinutes;
                        }
                    });
                },
                /**
                 * according to the school ID get parameters
                 */
                saveGrpSetting: function () {
                    applicationServiceSet.cloudWatchService.cloudWatchApi.SaveGrpSetting.send([$scope.model.TryMinutes], [APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid], undefined).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('修改成功！');
                        }
                    });
                }
            };
        })()
    };
    parametersSet.init();//入口函数
}]);
