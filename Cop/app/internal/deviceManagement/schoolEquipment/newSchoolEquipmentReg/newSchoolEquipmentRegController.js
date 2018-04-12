/**
 * Created by Administrator on 2017/6/6.
 */
app.controller('newSchoolEquipmentRegController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var SERC = {
        init: function () {
            this.basic();
            if ($stateParams.ID) {
                SERC.GetEqList($stateParams.ID);
            }
        },
        //模糊查询 根据token获取学校列表
        getSchoolList: function (selectedGid) {
            applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.schoolList = data.Data;
                }
            });
        },

        //根据gid获取学校设备列表
        GetEqList: function (gid) {
            applicationServiceSet.attendanceService.basicDataControlService.GetEqList.send([gid]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.list = data.Data;
                    $scope.model.list.forEach(function (e, i) {
                        e.selected = false;
                    })
                }
            })
        },
        basic: function () {
            $scope.model = {
                schoolList: [],
                selectGidName: undefined,
                selectedGid: undefined,
                list: [],
                isAll:false // 是否全选
            };
            $scope.refreshAddresses = function (selectedGid) {
                if (selectedGid) {
                    $scope.model.selectGidName = selectedGid;
                    SERC.getSchoolList(selectedGid);//get school org pages list
                }
            };
            //查询
            $scope.search = function () {
                if ($scope.model.selectedGid) {
                    SERC.GetEqList($scope.model.selectedGid);
                    // $state.go("access.app.internal.schoolEquipment.newSchoolEquipmentReg", {ID: $scope.model.selectedGid})
                }
            };
            // $scope.changeGid = function () {
            //     $scope.search()
            // };
            //编辑
            $scope.goToEdit = function (id) {
                $state.go("access.app.internal.schoolEquipment.editEq", {ID: id})
            };
            //清空gid
            $scope.deleteSelectedGid = function () {
                $scope.model.selectedGid = undefined;
            };
            //打开删除modal
            $scope.openDelModal = function (item) {
                var modal = $modal.open({
                    templateUrl: 'newDelEq.html',
                    controller: 'newDelEq',
                    size: 'sm',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return item
                        }
                    }
                });
                modal.result.then(function () {

                }, function (result) {
                    if (result == "ok") {
                        if ($scope.model.selectedGid) {
                            SERC.GetEqList($scope.model.selectedGid);
                        }else{
                            SERC.GetEqList($stateParams.ID);
                        }
                    }
                });
            };
            //升级appModal
            $scope.appAddress = function () {
                var EqIDs = $scope.model.list.filter(function (e, i) {
                    return e.selected == true;
                });
                EqIDs = EqIDs.map(function (e, i) {
                   return e.ID;
                });
                if(EqIDs.length !== 0){
                    var modal = $modal.open({
                        templateUrl: 'newUpdateApp.html',
                        controller: 'newUpdateApp',
                        size: 'md',
                        keyboard: false,
                        backdrop: false,
                        resolve: {
                            items: function () {
                                return EqIDs
                            }
                        }
                    });
                    modal.result.then(function () {

                    }, function (result) {

                    });
                }else{
                    toastr.error("请至少选中一个设备")
                }
            };
            //导出所有设备
            $scope.export = function () {
                var org = JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
                window.open(urlConfig + "OCS/v3/Eq/ExportEqList?token=" + APPMODEL.Storage.getItem('copPage_token') + "&orgid=" + org.OrgID, "_parent")
            };

            //全选
            $scope.selectAll = function () {
                if($scope.model.isAll){
                    $scope.model.list.forEach(function (e, i) {
                        e.selected = true;
                    })
                }else{
                    $scope.model.list.forEach(function (e, i) {
                        e.selected = false;
                    })
                }
            };
        }
    };
    SERC.init();
}]);

app.controller('newDelEq', ['$scope', '$modalInstance', 'items', 'applicationServiceSet', function ($scope, $modalInstance, items, applicationServiceSet) {
    $scope.item = items;
    /**
     * 选择确定
     */
    $scope.confirm = function () {
        applicationServiceSet.attendanceService.basicDataControlService.DeleteEq.send(undefined, [$scope.item.ID]).then(function (data) {
            if (data.Ret == 0) {
                $modalInstance.dismiss('ok');
            }
        })
    };
    /**
     * cancel
     */
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('newUpdateApp', ['$scope', '$modalInstance', 'items', 'applicationServiceSet', function ($scope, $modalInstance, items, applicationServiceSet) {
    $scope.item = items;
    /**
     * 选择确定
     */
    $scope.appAddress = "";
    $scope.confirm = function () {

        applicationServiceSet.attendanceService.basicDataControlService.UpgradeApp.send([$scope.item,$scope.appAddress]).then(function (data) {
            if(data.Ret == 0){
                $modalInstance.dismiss('ok');
            }
        })
    };
    /**
     * cancel
     */
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
