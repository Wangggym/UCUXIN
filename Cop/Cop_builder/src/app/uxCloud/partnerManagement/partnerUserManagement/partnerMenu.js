
app.controller('partnerMenu', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    $scope.userName = $stateParams.Name;
    $scope.orgName = $stateParams.orgName;

    /*
    *  用户菜单权限列表
    * */
    getList();
    function getList() {
        applicationServiceSet.internalServiceApi.userManagement.GetMenusByOrgUIDNew.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.orgID,$stateParams.UID,$stateParams.level]).then(function (data) {
            if (data.Ret == 0) {
                $scope.itemList = data.Data;
            }
        });
    }

    /*添加*/
    $scope.add = function (item) {
        applicationServiceSet.internalServiceApi.userManagement.AddUserMenuNew.send( [item.MenuID,$stateParams.orgID,$stateParams.UID, $stateParams.level],[]).then(function (data) {
            if (data.Ret == 0) {
                toastr.success('添加成功');
                getList();
            }
        });
    }
    /*删除*/
    $scope.del = function (item) {
        applicationServiceSet.internalServiceApi.userManagement.DeleteUserMenuNew.send([item.MenuID,$stateParams.orgID,$stateParams.UID, $stateParams.level],[]).then(function (data) {
            if (data.Ret == 0) {
                toastr.success('删除成功');
                getList();
            }
        });
    }
}]);