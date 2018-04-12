/**
 * Created by fanweihua on 2017/7/13.
 * 添加量表基本信息
 */
app.controller('addTheScaleController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    $scope.model = {
        stateIndex: 1
    };
    //路由监听事件
    $rootScope.$on('$stateChangeStart', function (event, toState) {
        if (toState.url.indexOf('basicInformation') != -1) {
            //基本信息
            $scope.model.stateIndex = 1;
        } else if (toState.url.indexOf('userAttributes') != -1) {
            //用户属性
            $scope.model.stateIndex = 2;
        } else if (toState.url.indexOf('questionBank') != -1) {
            //题库
            $scope.model.stateIndex = 3;
        } else if (toState.url.indexOf('factorDefinition') != -1) {
            //题库
            $scope.model.stateIndex = 4;
        } else if (toState.url.indexOf('addFactorDefinition') != -1) {
            //题库
            $scope.model.stateIndex = 5;
        } else {
            $scope.model.stateIndex = 1;
        }
    });
    var locationOn = function () {
        if ($location.$$url.indexOf('basicInformation') != -1) {
            $scope.model.stateIndex = 1;
            return;
        }
        if ($location.$$url.indexOf('userAttributes') != -1) {
            $scope.model.stateIndex = 2;
            return;
        }
        if ($location.$$url.indexOf('questionBank') != -1) {
            $scope.model.stateIndex = 3;
        }
        if ($location.$$url.indexOf('factorDefinition') != -1) {
            $scope.model.stateIndex = 4;
        }
        if ($location.$$url.indexOf('addFactorDefinition') != -1) {
            $scope.model.stateIndex = 5;
        }
    };
    locationOn();
    //返回首页
    $scope.goBack = function () {
        $location.url('access/app/internal/inventoryManagement/scaleMaintenance');
    };
}]);