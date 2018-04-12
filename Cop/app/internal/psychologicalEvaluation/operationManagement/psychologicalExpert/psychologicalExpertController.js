/**
 * Created by Wang QiHan on 2016/10/09.
 * Psychological Expert Controller
 */
app.controller('PsychologicalExpertController', ['$scope', '$location', '$modal', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $location, $modal, toastr, toastrConfig, applicationServiceSet) {
  'use strict';

  toastrConfig.preventOpenDuplicates = true;

  $scope.queryFields = {
    name: undefined
  }

  // 分页指令配置
  $scope.pagination = {
    currentPage: 1,
    itemsPerPage: 50, // 默认查询10条
    maxSize: 5,
    previousText: "上页",
    nextText: "下页",
    firstText: "首页",
    lastText: "末页"
  };


  var  pschologicalExpert = (function () {
    var token = APPMODEL.Storage.copPage_token,
      applicationToken = APPMODEL.Storage.applicationToken;

    var getService = function (method, arr, list, fn) {
      applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr, list).then(fn);
    }



    // 获取学校测试订单列表
    var getPsychologicalExperts = function () {
      var name = $scope.queryFields.name || '';
      getService('getPsychologicalExperts', [token, $scope.pagination.currentPage, $scope.pagination.itemsPerPage, name], undefined, function (data) {
        if (data.Ret === 0) {
          if(data.Data){
            $scope.dataList = data.Data.ViewModelList;
            // 分页配置项更新
            $scope.pagination.totalItems = data.Data.TotalRecords;
            $scope.pagination.numPages = data.Data.Pages;
          }else{
            $scope.dataList = $scope.pagination.totalItems = $scope.pagination.numPages = undefined;
          }
        }
      });
    };

    var removePsychologicalExperts =  function (id) {
      getService('removePsychologicalExperts',undefined, [id], function (data) {
        if (data.Ret == 0) {
          toastr.success('专家删除成功！');
          getPsychologicalExperts();
        }
      });
    };

    var setPsychKnowledge =  function (id, sort) {
      getService('setPsychKnowledge',undefined, [id, sort], function (data) {
        if (data.Ret == 0) {
          toastr.success('排序值设置成功！');
          getPsychologicalExperts();
        }
      });
    };


    return {
      getPsychologicalExperts: getPsychologicalExperts,
      removePsychologicalExperts: removePsychologicalExperts,
      setPsychKnowledge: setPsychKnowledge
    }
  })();

  pschologicalExpert.getPsychologicalExperts();



  // 提交查询与分页查询
  $scope.submitQuery = $scope.pageQuery = function (event) {
    if (event) {
      // 当点击查询时重置当页为首页
      var event = event || window.event;
      var target = event.target || window.srcElement;
      if (target.tagName.toLocaleLowerCase() == "button") {
        $scope.pagination.currentPage = 1;
      }
    }
    pschologicalExpert.getPsychologicalExperts();
  };

  // 新增
  $scope.add = function (id) {
    $location.path('access/app/internal/operationManagement/addPsychologicalExpert/' + (id || 0));
  }

  // 删除
  $scope.del = function (item) {
    var modalInstance = $modal.open({
      templateUrl: 'removeConfirm.html',
      size: 'sm',
      controller:'RemoveConfirmCtrl',
      resolve: {
        items: function () {
          return item
        }
      }
    });

    modalInstance.result.then(function (id) {
      pschologicalExpert.removePsychologicalExperts(id);
    }, function () {
      // 取消时作出操作
    });
  };

  $scope.sort = function (id, sort) {

    var modalInstance = $modal.open({
      templateUrl: 'settingSort.html',
      controller: 'SettingSortCtrl',
      size:'sm',
      resolve: {
        items: function () {
          return sort;
        }
      }
    });

    modalInstance.result.then(function (newSort) {
      pschologicalExpert.setPsychKnowledge(id, newSort);

    }, function () {
      // 取消操作
    });
  }
}]);

app.controller('SettingSortCtrl', ['$scope', '$filter', '$modalInstance', 'items', 'toastr', 'toastrConfig', function ($scope,$filter, $modalInstance, items, toastr, toastrConfig) {
  'use strict';

  // 配置提示消息框
  toastrConfig.preventOpenDuplicates = true;
  $scope.setSort = items;

  // 提交因子解释
  $scope.confirm = function () {

    if($scope.setSort == undefined){
      toastr.error('请填写排序值！');
      return;
    }

    $modalInstance.close($scope.setSort);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);


app.controller('RemoveConfirmCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
  'use strict';
  $scope.item = items;
  $scope.comfirm = function () {
    $modalInstance.close($scope.item.ID);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
