/**
 * Created by wangbin on 2017/7/14.
 */
app.controller('courseClassifyController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
  var classify = {
    /**
     * 入口
     */
    init : function () {
      classify.pageData();
      classify.onEvent();
      classify.getClassify();
    },
    /**
     * 页面数据初始化
     */
    pageData : function () {
      $scope.allClassify = [];
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
            Pic:undefined
          }
        }
        item.method = classify.changeData;
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
     * 获取所有分类
     */
    getClassify : function () {
      applicationServiceSet.mentalHealthService._CourseClassify._GetAllClassify.send([sessionStorage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
          $scope.allClassify = data.Data;
        }
      });
    },
    /**
     *增加或者修改领域
     */
    changeData:function (item) {
      applicationServiceSet.mentalHealthService._CourseClassify._AddOrUpClassify.send([item.ID,item.Name,item.Pic],[sessionStorage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
          if(item.ID==0){
            toastr.success('新增成功！')
          }else {
            toastr.success('修改成功！')
          }
          item.method();
          classify.getClassify();
        }
      });
    }
  };
  classify.init();
}]);
app.controller('changeItemCtrl', ['$scope', '$modalInstance', 'items','toastr','applicationServiceSet', function ($scope, $modalInstance, items,toastr,applicationServiceSet) {
  $scope.data = {
    ID : items.ID,
    Name :items.Name,
    Pic : items.Pic,
    method:items.method
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  /**
   * 图片上传
   */
  $scope.fileChange = function (file) {
    if (file) {
      applicationServiceSet.mentalHealthService._CourseClassify._ImageRegistrationUpload.fileUpload(file).then(function (data) {
          if(data.Ret == 0){
            $scope.data.Pic = data.Data.Url;
          }
      });
    }
  };
  /**
   * 确定事件
   */
  $scope.sure = function () {
    if($scope.data.Name == ''){
      toastr.error('请输入属性名称！');
      return;
    }
    if(!$scope.data.Pic||$scope.data.Pic == ''){
      toastr.error('请上传图标！');
      return;
    }
    var obj = {
      ID : $scope.data.ID,
      Name : $scope.data.Name,
      Pic : $scope.data.Pic,
      method: $scope.cancel
    };
    $scope.data.method(obj)
  }
}]);
