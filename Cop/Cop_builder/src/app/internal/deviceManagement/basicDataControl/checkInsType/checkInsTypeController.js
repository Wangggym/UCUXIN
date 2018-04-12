/**
 * Created by Administrator on 2017/6/1.
 */
app.controller('checkInsTypeController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    var cTC = {
        init: function () {
            this.data();
            //获取场景数据
            this.GetClockTypeList()
        },
        GetClockTypeList: function () {
            applicationServiceSet.attendanceService.basicDataControlService.GetClockTypeList.send([APPMODEL.Storage.getItem("copPage_token")]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.list = data.Data;
                    for (var i = 0; i < $scope.list.length; ++i) {
                        if ($scope.editList.length == $scope.list.length) {
                            return;
                        }
                        $scope.editList.push(true);
                    }
                }
            })
        },
        data: function () {
            //展示列表
            $scope.list = [];
            //是否开启编辑 - 对应展示列表，赋予一个开启编辑的数组,一一对应
            $scope.editList = [];
            //保存
            $scope.save = function (item, index) {
                applicationServiceSet.attendanceService.basicDataControlService.UpClockType.send([item.ID, item.Name, item.IsAttendance, item.StuInMsg, item.StuOutMsg, item.TeaInMsg, item.TeaOutMsg]).then(function (data) {
                    $scope.editList[index] = true;
                    if (data.Ret == 0) {
                        cTC.GetClockTypeList();
                    }
                })
            };
            //编辑
            $scope.edit = function (index) {
                $scope.editList[index] = !$scope.editList[index];
            };
            //取消
            $scope.cancel = function (index) {
                $scope.editList[index] = !$scope.editList[index];
                cTC.GetClockTypeList();
            }
        }
    };
    cTC.init();
}]);