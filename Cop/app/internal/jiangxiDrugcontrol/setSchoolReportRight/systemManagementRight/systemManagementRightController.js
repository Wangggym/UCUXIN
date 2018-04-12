/**
 * Created by wangbin on 2017/5/9.
 */
app.controller('systemManagementRightController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    var systemManage = {
        /**
         * 入口
         */
        init : function () {
            systemManage.pageData();
            systemManage.onEvent();
            systemManage.getGroupList();
        },
        /**
         * 页面数据初始化
         */
        pageData : function () {
            $scope.groupList = [];
            $scope.model = {
                groupId : undefined,
                managerName : '',
                managerPhone : '',
                isGroupManager: false,
                isAccountManager: false,
                isADEManager: false
            };
        },
        /**
         * 绑定页面相关的事件
         */
        onEvent : function () {
            // 分配权限
            $scope.confirm = function () {
                if(!$scope.model.groupId){
                    toastr.error('请先选择禁毒机构！');
                    return;
                }
                if($scope.model.managerName == ''){
                    toastr.error('请输入管理员姓名！');
                    return;
                }
                if($scope.model.managerPhone == ''){
                    toastr.error('请输入管理员电话！');
                    return;
                }
                systemManage.setGroupAdmin();
            };
        },
        /**
         * 获取禁毒机构list
         */
        getGroupList : function () {
            applicationServiceSet.internalServiceApi.jiangxiDrugcontrol.GetGroups.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.groupList = data.Data;
                }
            });
        },
        /**
         * 分配权限
         */
        setGroupAdmin : function () {
            applicationServiceSet.internalServiceApi.jiangxiDrugcontrol.InitManager.send([
                $scope.model.groupId,$scope.model.managerName,$scope.model.managerPhone,$scope.model.isGroupManager,
                $scope.model.isAccountManager, $scope.model.isADEManager
            ]).then(function (data) {
                if(data.Ret == 0){
                    toastr.success('分配成功！');
                    $scope.model = {
                        groupId : undefined,
                        managerName : '',
                        managerPhone : '',
                        isGroupManager: false,
                        isAccountManager: false,
                        isADEManager: false
                    };
                }
            });
        }
    };
    systemManage.init();
}]);