/**
 * Created by WangQiHan on 2016/9/19.
 * School Test Task Controller
 */
app.controller('SchoolTestTaskController', ['$scope', '$location', '$modal', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $location, $modal, toastr, toastrConfig, applicationServiceSet) {
  'use strict';

  toastrConfig.preventOpenDuplicates = true;

  $scope.queryFields = {
    school: undefined,
    name: undefined,
    status: undefined,
    distributor: undefined
  };

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

  $scope.stateList = [
    {id: 3, value: '全部'},
    {id: 0, value: '未开始'},
    {id: 1, value: '进行中'},
    {id: 2, value: '已结束'}
  ];

  $scope.distributor = [
    {id: 2, value: '全部'},
    {id: 0, value: '运营平台'},
    {id: 1, value: '学校'}
  ];


  var schoolTestTask = (function () {
    var token = APPMODEL.Storage.copPage_token,
      applicationToken = APPMODEL.Storage.applicationToken;

    var getService = function (method, arr, list, fn) {
      applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr, list).then(fn);
    }

    // 获取当前用户学校 （ 模糊查询 ）
    var getSchool = function (keyword) {
      getService('getFuzzySchoolList', [applicationToken, keyword], undefined, function (data) {
        if (data.Ret == 0) {
          $scope.schoolList = data.Data.length ? data.Data : undefined;
        }
      });
    };

    var changeReportWay = function (id, way) {
      getService('changeReportWay', undefined, [id, way], function (data) {
        if (data.Ret === 0) {
          toastr.success('展示状态更改成功！');
        }
      });
    };

    // 获取学校测试订单列表
    var getSchoolTestOrder = function () {
      var gid = $scope.queryFields.school || 0,
        name = $scope.queryFields.name || '',
        state = $scope.queryFields.status === undefined ? 3 : $scope.queryFields.status,
        distributor = (function () {
          switch ($scope.queryFields.distributor) {
            case 0 :
              return false;
              break;
            case 1 :
              return true;
              break;
            case 2 :
              return null;
              break;
          }
        })();
      getService('getTestTask', [token, $scope.pagination.currentPage, $scope.pagination.itemsPerPage, gid, name, state, (distributor == null ? '' : distributor)], undefined, function (data) {
        if (data.Ret === 0) {
          if (data.Data) {
            $.each(data.Data.ViewModelList,function (e, item) {
               if(item.MType == 13){
                   item.MTypeText = '学生';
               }else if(item.MType == 11){
                   item.MTypeText = '教师';
               }else if(item.MType == 12){
                   item.MTypeText = '家长';
               }
            });
            $scope.dataList = data.Data.ViewModelList;
            // 分页配置项更新
            $scope.pagination.totalItems = data.Data.TotalRecords;
            $scope.pagination.numPages = data.Data.Pages;
          } else {
            $scope.dataList = $scope.pagination.totalItems = $scope.pagination.numPages = undefined;
          }
        }
      });
    };

    var delTestTask = function (id) {
      getService('delTestTask', undefined, [id], function (data) {
        if (data.Ret == 0) {
          toastr.success('任务删除成功！')
          getSchoolTestOrder();
        }
      });
    };


    return {
      getSchoolTestOrderList: getSchoolTestOrder,
      getSchoolList: getSchool,
      delTestTask: delTestTask,
      changeReportWay: changeReportWay
    }
  })();

  schoolTestTask.getSchoolTestOrderList();

  // 查询学校
  $scope.refreshSchool = function (keyword) {
    if (!keyword) return;
    schoolTestTask.getSchoolList(keyword);
  };

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
    schoolTestTask.getSchoolTestOrderList();
  };

  // 新增
  $scope.add = function (event) {
    $location.path('access/app/internal/operationManagement/addSchoolTestTask');
  };

  $scope.detail = function (item) {
    APPMODEL.Storage.testTask = JSON.stringify(item);
    $location.path('access/app/internal/operationManagement/detailSchoolTestTask');
  };

  // 删除确认
  $scope.del = function (item) {
    var modalInstance = $modal.open({
      templateUrl: 'removeConfirm.html',
      size: 'sm',
      controller: 'RemoveConfirmCtrl',
      resolve: {
        items: function () {
          return item
        }
      }
    });

    modalInstance.result.then(function (id) {
      schoolTestTask.delTestTask(id);
    }, function () {});
  };

  // 下载当前测试结果     
  $scope.download = function (id) {
    location.href = urlConfig + 'PhyS/v3/Test/GetDownloadResult?token=' + APPMODEL.Storage.copPage_token + '&orderID=' + id;
  };
 // 下载测试入口文件
  $scope.getTestLink = function (id) {
    location.href = urlConfig+'PhyS/v3/Test/GetPcHtml?token=' + APPMODEL.Storage.copPage_token+'&orderid='+id;
  };
  $scope.changeWay = function (id, way) {
    schoolTestTask.changeReportWay(id, way);
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
