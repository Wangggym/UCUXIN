/**
 * Created by wangbin on 2017/7/14.
 */
/**
 * Created by wangbin on 2017/7/13.
 */
app.controller('psychologicalAttributeController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
  var attribute = {
    /**
     * 入口
     */
    init : function () {
      attribute.pageData();
      attribute.onEvent();
      attribute.getAttribute();
      attribute.getDomain();
    },
    /**
     * 页面数据初始化
     */
    pageData : function () {
      $scope.allAttribute = [];
      $scope.areaList = [];
    },
    /**
     * 绑定页面相关的事件
     */
    onEvent : function () {
      //新增或修改属性
      $scope.change = $scope.addItem = function (item) {
        if(!item){
          item = {
            ID : 0,
            Name :'',
            PsyAreaName:undefined,
            PsyAreaID:undefined
          }
        }
        item.method = attribute.changeData;
        item.cancel = attribute.getAttribute;
        item.areaList = $scope.areaList;
        var modalInstance = $modal.open({
          templateUrl: 'changeItem.html',
          controller: 'changeItemCtrl',
          size: 'md',
          resolve: {
            items: function () {
              return item;
            }
          }
        });
        modalInstance.result.then(function (data) {
        }, function () {
        });
      };
    },
    /**
     * 获取所有属性
     */
    getAttribute : function () {
      applicationServiceSet.mentalHealthService._PsychologicalAttribute._GetPsyAttrList.send([sessionStorage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
          $scope.allAttribute = data.Data;
        }
      });
    },
    /**
     *获取所有领域
     */
    getDomain : function () {
      applicationServiceSet.mentalHealthService._PsychologicalDomain._GetPsyAreaList.send([sessionStorage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
          $scope.areaList = data.Data;
        }
      });
    },
    /**
     *增加或者修改领域
     */
    changeData:function (item) {
      applicationServiceSet.mentalHealthService._PsychologicalAttribute._AddOrUpPsyAttr.send([item.ID,item.Name,item.PsyAreaID,item.PsyAreaName],[sessionStorage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
          if(item.ID==0){
            toastr.success('新增成功！')
          }else {
            toastr.success('修改成功！')
          }
          item.method();
          attribute.getAttribute();
        }
      });
    }
  };
  attribute.init();
}]);
app.controller('changeItemCtrl', ['$scope', '$modalInstance', 'items','toastr', function ($scope, $modalInstance, items,toastr) {
  $scope.data = items;
  $scope.areaList = items.areaList;
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
    if($scope.data.Name == ''){
        $scope.data.cancel();
    }
  };
  $scope.sure = function () {
    var areaName;
    if($scope.data.Name == ''){
      toastr.error('请输入属性名称！');
      return;
    }
    if(!$scope.data.PsyAreaID||$scope.data.PsyAreaID == ''){
      toastr.error('请选择属性领域！');
      return;
    }
    $.each($scope.areaList,function (e,item) {
      if(item.ID == $scope.data.PsyAreaID){
        areaName = item.Name;
      }
    });
    var obj = {
      ID : $scope.data.ID,
      Name : $scope.data.Name,
      PsyAreaName:areaName,
      PsyAreaID:$scope.data.PsyAreaID,
      method: $scope.cancel
    };
    $scope.data.method(obj)
  }
}]);
