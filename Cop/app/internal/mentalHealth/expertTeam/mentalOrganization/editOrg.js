/**
 * Created by lxf on 2017/7/14.
 */
app.controller('editOrg', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
  var token = APPMODEL.Storage.getItem("copPage_token");

  var ctr = {
    init:function () {
      ctr.basic();
      ctr.getDetail();
    },
    basic:function () {
      $scope.status = [{
        label:"无效",
        value:-1,
      },{
        label:"正常",
        value:1,
      }];
      $scope.province;
      $scope.onChangePro = function () {
        ctr.getArea($scope.province,1);
      };
      $scope.cancel = function () {
        $state.go("access.app.internal.expertTeam.mentalOrganization");
      };
      $scope.ok = function () {
        if(!$scope.Name){
            toastr.error('机构名称为必填');
            return;
        }
        var city = $scope.cityList.filter(function (data) {
          return data.RID === $scope.city;
        });
        city = city[0];
        applicationServiceSet.mentalHealthService._ExpertTeam._AddOrUpPsyOrg.send([$scope.ID,$scope.Name,$scope.Desc,city.RID,city.Name,city.PRID,city.PName,$scope.ST],[token]).then(function (data) {
          if(data.Ret == 0){
            toastr.success("编辑成功");
            $scope.cancel();
          }
        })
      }
    },
    getDetail:function () {
      applicationServiceSet.mentalHealthService._ExpertTeam._GetPsyOrg.send([token,$stateParams.id]).then(function (data) {
        if(data.Ret == 0){
          $scope.ID = data.Data.ID;
          $scope.ST = data.Data.ST;
          $scope.province = data.Data.PRID;
          $scope.city = data.Data.CRID;
          $scope.Name = data.Data.Name;
          $scope.Desc = data.Data.Desc;
          $scope.ST = data.Data.ST;
          ctr.getArea(0,0);
        }
      })
    },
    //根据type类型判断 获取省==0 ,获取市==1
    getArea:function (rid,type) {
      if(type === 0){
        applicationServiceSet.mentalHealthService._ExpertTeam._GetRegionList.send([token,rid]).then(function (data) {
          if(data.Ret==0){
            $scope.provinceList = data.Data;
            ctr.getArea($scope.province,1);
          }
        })
      }else{
        applicationServiceSet.mentalHealthService._ExpertTeam._GetRegionList.send([token,rid]).then(function (data) {
          if(data.Ret==0){
            $scope.cityList = data.Data;
          }
        })
      }
    }
  };
  ctr.init();
}]);
