/**
 * Created by wangbin on 2017/7/13.
 */
app.controller('psychologicalDomainController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
  var domain = {
    /**
     * 入口
     */
    init : function () {
      domain.pageData();
      domain.onEvent();
      domain.getDomain();
    },
    /**
     * 页面数据初始化
     */
    pageData : function () {
      $scope.allData = [];
    },
    /**
     * 绑定页面相关的事件
     */
    onEvent : function () {
      //新增领域
      $scope.change = $scope.addItem = function (item) {
        item.method = domain.changeData;
        item.cancel = domain.getDomain;
        var modalInstance = $modal.open({
          templateUrl: 'changeItemDomain.html',
          controller: 'changeItemDomainCtrl',
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
     *获取所有领域
     */
    getDomain : function () {
      applicationServiceSet.mentalHealthService._PsychologicalDomain._GetPsyAreaList.send([sessionStorage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
          $scope.allData = data.Data;
        }
      });
    },
    /**
     *增加或者修改领域
     */
    changeData:function (item) {
      applicationServiceSet.mentalHealthService._PsychologicalDomain._AddOrUpdateScale.send([item.ID,item.Name],[sessionStorage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
          if(item.ID==0){
            toastr.success('新增成功！')
          }else {
            toastr.success('修改成功！')
          }
          item.method();
          domain.getDomain();
        }
      });
    }
  };
  domain.init();
}]);
app.controller('changeItemDomainCtrl', ['$scope', '$modalInstance', 'items','toastr', function ($scope, $modalInstance, items,toastr) {
  $scope.data = items;
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
      if($scope.data.Name == ''){
          $scope.data.cancel();
      }
  };
  $scope.sure = function () {
    if($scope.data.Name == ''){
      toastr.error('请输入标签！');
      return;
    }
    var obj = {
      ID : $scope.data.ID,
      Name : $scope.data.Name,
      method: $scope.cancel
    };
    $scope.data.method(obj)
  }
}]);
