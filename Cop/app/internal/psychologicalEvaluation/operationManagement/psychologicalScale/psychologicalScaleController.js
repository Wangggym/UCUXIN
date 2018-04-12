/**
 * Created by WangQiHan on 2016/9/12.
 * Psychological Scale Management
 */
app.controller('PsychologicalScaleController', ['$scope','$state', '$location', '$timeout', '$modal', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $state, $location,$timeout, $modal, toastr, toastrConfig, applicationServiceSet) {
  'use strict';

  // toastr 配置
  toastrConfig.preventOpenDuplicates = true;

  $scope.queryFields = {
    scaleName: undefined,
    scaleSource:undefined,
    status: undefined
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

  //---- 状态配置 开始 -------------------------------------------------------
  $scope.statusA = function () {
    if(!$scope.checkedA && !$scope.checkedB){
      $scope.queryFields.status = 3;
    }

    if(!$scope.checkedA){
      $scope.checkedA = false
      return;
    }

    $scope.checkedA = true;
    $scope.checkedB = false;
    $scope.queryFields.status = 1;

  };
  $scope.statusB = function () {
    if(!$scope.checkedA && !$scope.checkedB){
      $scope.queryFields.status = 3;
    }

    if(!$scope.checkedB){
      $scope.checkedB = false
      return;
    }
    $scope.checkedB = true;
    $scope.checkedA = false;
    $scope.queryFields.status = 0;
  };
  //---- 状态配置 结束 -------------------------------------------------------

  var psychologicalScale = (function () {

    var token = APPMODEL.Storage.copPage_token;

    var getService = function (method, arr, list, fn) {
      if(Object.prototype.toString.call(list) === '[object Function]'){
        fn = list;
        list = undefined;
      }
      applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr, list).then(fn);
    }

    // 获取量表列表
    var getPsychologicalScale =  function () {
      var scaleName = $scope.queryFields.scaleName || '',
          scaleSource = $scope.queryFields.scaleSource || '',
          status      = ($scope.queryFields.status === undefined ) ? 3 : $scope.queryFields.status;

      getService('getPsychScale', [token, $scope.pagination.currentPage, $scope.pagination.itemsPerPage, scaleName, scaleSource, status], function (data) {
        if(data.Ret === 0){
          if(data.Data){
            $scope.dataList = data.Data.ViewModelList;
            $scope.pagination.totalItems = data.Data.TotalRecords;
            $scope.pagination.numPages = data.Data.Pages;
          }else{
            $scope.dataList = $scope.pagination.totalItems = $scope.pagination.numPages = undefined;
          }
        }
      });
    };

    // 发布量表
    var releaseScale =  function (item, index) {
      getService('releaseScale', undefined, [item.ID, item.ST], function (data) {
        if(data.Ret === 0){
          var text = item.ST ? '发布': '撤销';
          toastr.success(text + '成功！');
        }else {
          /*$timeout(function () {
            $scope.dataList[index].ST = $scope.dataList[index].ST ? false: true;
          },300);*/
          $scope.dataList[index].ST = $scope.dataList[index].ST ? false: true;
        }
      });
    };

    // 检测量表维护完整性
    var checkScalePerfect =  function (id, fn) {
      getService('checkScalePerfect',undefined, [id], function (data) {
        if(data.Ret === 0){
          fn();
        }
      });
    };

    // 量表静态化
    var psychologicalScaleStatic =  function (id, index) {
      checkScalePerfect(id, getService('psychologicalScaleStatic',undefined, [id], function (data) {
        if(data.Ret === 0){
          toastr.success('量表静态化成功！');
          $scope.dataList[index].IsProduct = true;
        }
      }));
    };

    // 删除量表
    var removeScale =  function (id) {
      getService('removeScale', undefined, [id], function (data) {
        if(data.Ret === 0){
          toastr.success('量表删除成功！');
          getPsychologicalScale();
        }
      });
    };
    // 判断量表是否能修改
    var judgeScaleModify = function (id, fn) {
      getService('judgeScaleModify',[id],function (data) {
        if(data.Ret === 0){
          fn();
        }else {
          // toastr.error(data.Msg, '当前量表不可修改', {
          //   closeButton: true,
          // //   closeHtml: '<button>×</button>'
          // });
        }
      });
    };

    return {
      getPsychologicalScaleList : getPsychologicalScale,
      psychologicalScaleStatic : psychologicalScaleStatic,
      releaseScale : releaseScale,
      removeScale : removeScale,
      judgeScaleModify: judgeScaleModify
    }
  })();

  // 默认显示数据
  psychologicalScale.getPsychologicalScaleList();

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
    psychologicalScale.getPsychologicalScaleList();
  };

  $scope.save = function (id) {
    var saveScale = function () {
      APPMODEL.Storage.ScaleID = id || 0;
      APPMODEL.Storage.ScaleStep = 1;
      $location.path('access/app/internal/operationManagement/addPsychologicalScale/basicInfo');
    };

    if(!id){
      saveScale();
      return;
    }
    psychologicalScale.judgeScaleModify(id, saveScale);
  }




  $scope.release = function (id, st) {
    psychologicalScale.releaseScale(id, st);
  };

  $scope.static = function (id, index) {
    psychologicalScale.psychologicalScaleStatic(id, index);
  }

  $scope.del =  function (item) {
    var modalInstance = $modal.open({
      templateUrl: 'removeScale.html',
      size: 'sm',
      controller:'RemoveScaleCtrl',
      resolve: {
        items: function () {
          return item
        }
      }
    });

    modalInstance.result.then(function (id) {
      psychologicalScale.removeScale(id);
    }, function () {
      // 取消时作出操作
    });
  };

}]);


app.controller('RemoveScaleCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
  'use strict';

  $scope.scale = items;

  $scope.comfirm = function () {
    $modalInstance.close($scope.scale.ID);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);
