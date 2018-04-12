/**
 * Created by Administrator on 2017/6/6.
 */
app.controller('editArea', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
  var ctrl = {
    init: function () {
      this.basic();
      this.GetClockTypeList();
      this.GetClockArea($stateParams.ID);
    },
    //刷卡区域详情
    GetClockArea: function (gid) {
      applicationServiceSet.attendanceService.basicDataControlService.GetClockArea.send([gid]).then(function (data) {
        if (data.Ret == 0) {
          $scope.model.school = data.Data.Name;
          $scope.model.selectedGid = data.Data.GID;
          $scope.model.clockType = data.Data.ClockTypeID;
          $scope.model.areaName = data.Data.Name;
          $scope.model.ID = data.Data.ID;
          $scope.model.attendanceTarget = data.Data.ClockObjType;
          $scope.selectedClassList = data.Data.ObjList;
          ctrl.GetClassGrades(data.Data.GID);

          $scope.selectedClassList.forEach(function (e, i) {
            var obj = {
              ClassID:e.ObjID,
              ClassName:e.ObjName
            };
            $scope.model.selectedClassList.push(obj)
          })
        }
      })
    },
    //获取班级
    GetClassGrades:function (gid) {
      applicationServiceSet.attendanceService.basicDataControlService.GetClassGrades.send([gid]).then(function (data) {
        if (data.Ret == 0) {
          //修改数据结构用于ng-option
          var array = [];
          for(var i = 0;i< data.Data.length ;i++){
            data.Data[i].ClassList.forEach(function (e, index) {
              array.push(e);
            })
          }
          $scope.model.classList = array;
        }
      })
    },
    //获取所有刷卡场景
    GetClockTypeList: function () {
      applicationServiceSet.attendanceService.basicDataControlService.GetClockTypeList.send([APPMODEL.Storage.getItem("copPage_token")]).then(function (data) {
        if (data.Ret == 0) {
          $scope.model.ClockTypeList = data.Data;
        }
      })
    },
    //添加或更新刷卡区域
    AddOrUpClockArea: function () {
      applicationServiceSet.attendanceService.basicDataControlService.AddOrUpClockArea.send([$scope.model.ID,$scope.model.selectedGid,$scope.model.areaName,$scope.model.clockType,$scope.model.attendanceTarget,$scope.selectedClassList]).then(function (data) {
        if (data.Ret == 0) {
          toastr.success("添加成功");
          $state.go("access.app.partner.schoolEquipment.attendanceAreaSetting",{GID:$scope.model.selectedGid});
        }
      })
    },

    basic: function () {
      $scope.selectedClassList = []; //待提交班级
      $scope.model = {
        ID:$stateParams.ID,
        selectedGid: undefined,
        attendanceTarget:undefined,
        selectedClassList:[],
        clockType:undefined,
        classList:[]
      };
      //切换打卡对象，清空原有选项
      $scope.clear = function () {
        $scope.model.selectedClassList = [];
        $scope.selectedClassList = []; //待提交班级
      };
      //保存
      $scope.save = function () {
        if(!$scope.model.selectedGid){
          toastr.error("请选择学校");
          return;
        }
        if(!$scope.model.clockType){
          toastr.error("请选择刷卡场景");
          return;
        }
        if(!$scope.model.areaName){
          toastr.error("请输入区域名称");
          return;
        }
        if(!$scope.model.attendanceTarget){
          toastr.error("请选择刷卡对象");
          return;
        }else if($scope.model.attendanceTarget == 2 && $scope.model.selectedClassList.length == 0){
          toastr.error("请选择刷卡班级");
          return;
        }
        if($scope.model.attendanceTarget == 1){
          //为全校时，清空选择班级
          $scope.model.selectedClassList = [];
        }
        if($scope.model.attendanceTarget == 2){
          $scope.selectedClassList = [];
          $scope.model.selectedClassList.forEach(function (e, i) {
            if(e.ClassID == $scope.model.selectedGid){
              return;
            }
            var obj = {
              ObjID:e.ClassID,
              ObjName:e.ClassName
            };
            $scope.selectedClassList.push(obj)
          })
        }
        console.log($scope.model.selectedClassList);
        ctrl.AddOrUpClockArea();
      };

      $scope.removed = function (a, b) {
        $scope.model.selectedClassList = $scope.model.selectedClassList.filter(function (e, i) {
          return e.ClassID !== b;
        })
      };
    }
  };
  ctrl.init();
}]);
