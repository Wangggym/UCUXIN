/**
 * Created by lxf on 2017/6/6.
 */
app.controller('attendanceAreaSetting', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
  var ctrl = {
    init: function () {
      this.basic();
      if ($stateParams.GID) {
        ctrl.GetAreaList($stateParams.GID);
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
    //根据gid获取学校刷卡区域列表
    GetAreaList: function (gid) {
      applicationServiceSet.attendanceService.basicDataControlService.GetClockAreaList.send([gid]).then(function (data) {
        if (data.Ret == 0) {
          $scope.model.list = data.Data;
        }
      })
    },
    basic: function () {
      $scope.model = {
        schoolList: [],
        selectGidName: undefined,
        selectedGid: undefined,
        list: []
      };
      $scope.refreshAddresses = function (selectedGid) {
        if (selectedGid) {
          $scope.model.selectGidName = selectedGid;
          ctrl.getSchoolList(selectedGid);//get school org pages list
        }
      };
      //查询
      $scope.search = function () {
        if ($scope.model.selectedGid) {
          ctrl.GetAreaList($scope.model.selectedGid);
          // $state.go("access.app.internal.schoolEquipment.attendanceAreaSetting", {GID: $scope.model.selectedGid})
        }
      };
      // $scope.changeGid = function () {
      //   $scope.search()
      // };
      //编辑
      $scope.goToEdit = function (id) {
        $state.go("access.app.internal.schoolEquipment.editArea", {ID: id})
      };
      //清空gid
      $scope.deleteSelectedGid = function () {
        $scope.model.selectedGid = undefined;
      };
      //打开删除modal
      $scope.openDelModal = function (item) {
        var modal = $modal.open({
          templateUrl: 'delModalAreaSetting.html',
          controller: 'delModalAreaSetting',
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
            if($stateParams.GID){
              ctrl.GetAreaList($stateParams.GID);
            }else{
              ctrl.GetAreaList($scope.model.selectedGid)
            }
          }
        });
      }

    }
  };
  ctrl.init();
}]);

app.controller('delModalAreaSetting', ['$scope', '$modalInstance', 'items', 'applicationServiceSet','toastr', function ($scope, $modalInstance, items, applicationServiceSet,toastr) {
  /**
   * 选择确定
   */
  $scope.item = items;

  $scope.confirm = function () {
    applicationServiceSet.attendanceService.basicDataControlService.DeleteClockArea.send(undefined,[items.ID]).then(function (data) {
      if (data.Ret == 0) {
        toastr.success("删除成功");
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
