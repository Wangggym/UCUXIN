/**
 * Created by lxf on 2017/6/1.
 */
app.controller('partnerCardNumberRangeController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr, $modal) {
    var ctr = {
        init: function () {
            //基本数据
            this.data();
            //获取列表
            this.GetOrgCardList();
        },

        GetOrgCardList: function () {
            applicationServiceSet.attendanceService.basicDataControlService.GetOrgCardList.send([]).then(function (data) {
                console.log(data);
                if (data.Ret == 0) {
                    $scope.list = data.Data;
                }
            })
        },
        data: function () {
            $scope.model = {};

            //打开modal添加号段
            $scope.open = function (list) {
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContentPCNRC.html',
                    controller: 'ModalInstanceCtrlPCNRC',
                    size: "md",
                    resolve: {
                        items: function () {
                            return list;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function (res) {
                    if(res == "ok"){
                        ctr.GetOrgCardList();
                    }
                });
            };
        }
    };
    ctr.init();
}]);
app.controller('ModalInstanceCtrlPCNRC', ['$scope', '$modal', '$modalInstance', 'applicationServiceSet', 'items', function ($scope, $modal, $modalInstance, applicationServiceSet, items) {
    $scope.newModel = {
        partner: undefined,
        partnerList: [],
        cardHead: undefined
    };
    applicationServiceSet.attendanceService.basicDataControlService.GetOrgList.send([]).then(function (data) {
        if(data.Ret == 0){
            $scope.newModel.partnerList = data.Data;
        }
    });
    $scope.ok = function () {
        applicationServiceSet.attendanceService.basicDataControlService.AddOrgCard.send([$scope.newModel.partner, $scope.newModel.cardHead]).then(function (data) {
            if (data.Ret == 0) {
                $modalInstance.dismiss('ok');
            }
        })
    }
}]);