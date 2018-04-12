
app.controller('userMenuListController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    $scope.userName = $stateParams.Name;

    var user = JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
    /*
    *  用户菜单权限列表
    * */
    getList();
    function getList() {
        applicationServiceSet.internalServiceApi.userManagement.GetMenusByOrgUIDNew.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem('orgid'),$stateParams.UID,user.OrgLevel]).then(function (data) {
            if (data.Ret == 0) {
                $scope.itemList = data.Data;
            }
        });
    }

    /*添加*/
    $scope.add = function (item) {
        applicationServiceSet.internalServiceApi.userManagement.AddUserMenuNew.send( [item.MenuID, user.OrgID,$stateParams.UID, user.OrgLevel],[]).then(function (data) {
            if (data.Ret == 0) {
                toastr.success('添加成功');
                getList();
            }
        });
    }
    /*删除*/
    $scope.del = function (item) {
        applicationServiceSet.internalServiceApi.userManagement.DeleteUserMenuNew.send([item.MenuID, user.OrgID,$stateParams.UID, user.OrgLevel],[]).then(function (data) {
            if (data.Ret == 0) {
                toastr.success('删除成功');
                getList();
            }
        });
    }
}]);