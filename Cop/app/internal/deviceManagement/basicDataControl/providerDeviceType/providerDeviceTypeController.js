/**
 * Created by lxf on 2017/6/1.
 */
app.controller('providerDeviceTypeController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    var PDC = {
        init: function () {
            //基本数据
            this.data();
            //获取列表
            this.GetSupplierEqList();
        },
        GetSupplierEqList: function () {
            applicationServiceSet.attendanceService.basicDataControlService.GetSupplierEqList.send([]).then(function (data) {
                console.log(data);
                if (data.Ret == 0) {
                    $scope.list = data.Data;
                }
            })
        },
        data: function () {
            $scope.getDetail = function (item) {
                $state.go('access.app.internal.basicDataControl.deviceArgumentsList', {ID: item.ID});
            }
        }
    };
    PDC.init();
}]);
