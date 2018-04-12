/**
 * Created by Administrator on 2017/6/1.
 */
app.controller('deviceArgumentsListController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    var DAC = {
        init: function () {
            //获取列表
            this.GetSupplierEqParamList($stateParams.ID);
        },
        GetSupplierEqParamList: function (ID) {
            applicationServiceSet.attendanceService.basicDataControlService.GetSupplierEqParamList.send([ID]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.list = data.Data
                }
            })
        }
    };
    DAC.init();
}]);
