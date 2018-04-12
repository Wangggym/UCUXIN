/**
 * Created by lxf on 2017/7/14.
 */
app.controller('addOrg', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
  var token = APPMODEL.Storage.getItem("copPage_token");

  var ctr = {
      init:function () {
        ctr.basic();
        ctr.getArea(0,0);
      },
      basic:function () {
        $scope.status = [{
          label:"无效",
          value:"-1",
        },{
          label:"正常",
          value:"1",
        }];
        $scope.province,$scope.city;
        $scope.onChangePro = function () {
          ctr.getArea($scope.province,1);
        };
        $scope.cancel = function () {
          $state.go("access.app.internal.expertTeam.mentalOrganization");
        };
        $scope.ok = function () {
          if(!$scope.city || !$scope.Name || !$scope.ST){
            toastr.error('带*为必填');
            return;
          }
          ctr.add();

        }
      },
      add:function () {
        var city = $scope.cityList.filter(function (data) {
          return data.RID === $scope.city;
        });

        city = city[0];
        applicationServiceSet.mentalHealthService._ExpertTeam._AddOrUpPsyOrg.send([0,$scope.Name,$scope.Desc,city.RID,city.Name,city.PRID,city.PName,$scope.ST],[token]).then(function (data) {
          if(data.Ret == 0){
            toastr.success("添加成功");
            $scope.cancel();
          }
        })
      },
    //根据type类型判断 获取省==0 ,获取市==1
      getArea:function (rid,type) {
        if(type === 0){
          applicationServiceSet.mentalHealthService._ExpertTeam._GetRegionList.send([token,rid]).then(function (data) {
            if(data.Ret==0){
              $scope.provinceList = data.Data;
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
