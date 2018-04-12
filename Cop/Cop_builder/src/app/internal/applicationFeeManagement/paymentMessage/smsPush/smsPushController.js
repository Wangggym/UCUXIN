/**
 * Created by WangQiHan on 2016/8/31.
 * SMS Push Controller
 */
app.controller('SmsPushController', ['$scope','$modal', '$location', 'applicationServiceSet', function ($scope,$modal, $location, applicationServiceSet) {
    'use strict';

    // 查询字段
    $scope.queryFields = {
        school: undefined
    };

    // 分页指令配置
    $scope.pagination = {
        currentPage: 1,
        itemsPerPage: 10, // 默认查询10条
        maxSize: 5,
        previousText: "上页",
        nextText: "下页",
        firstText: "首页",
        lastText: "末页"
    };

    // 数据交互
    var smsPush = (function () {
        // 取出当前token 与 orgid值
        var token = APPMODEL.Storage.copPage_token,
            applicationToken = APPMODEL.Storage.applicationToken,
            orgid = 0;

        var getService = function (method, arr, fn) {
            applicationServiceSet.internalServiceApi.paymentMessage[method].send(arr).then(fn);
        };

      // 获取当前用户学校 （ 模糊查询 ）
      var getSchool = function (keyword) {
        getService('getFuzzySchoolList', [applicationToken, keyword], function (data) {
          if (data.Ret == 0) {
            $scope.schoolList = data.Data.length ? data.Data : undefined;
          }
        });
      };

        // 获取当前用户学校
        var getPushRecord = function () {
            var schoolId = $scope.queryFields.school || 0;
            getService('getPushRecordPage', [token, $scope.pagination.currentPage, $scope.pagination.itemsPerPage, 2, 0, schoolId], function (data) {
                if (data.Ret == 0) {
                    $scope.dataList = (data.Data.ViewModelList != null) ? data.Data.ViewModelList : undefined;

                    // 分页配置项更新
                    $scope.pagination.totalItems = data.Data.TotalRecords;
                    $scope.pagination.numPages = data.Data.Pages;
                }
            });
        };

        return {
            getSchoolList: getSchool,
            getPushRecordList: getPushRecord
        }
    })();

    // 查询学校
    $scope.refreshSchool = function (keyword) {
      if (!keyword) return;
      smsPush.getSchoolList(keyword);
    };
    smsPush.getPushRecordList();
    // 导出报告
    $scope.export = function () {
        var url = urlConfig+'Charge/v3/Charge/ExportPushRecord?pushType=2&'+'token='+sessionStorage.getItem('copPage_token');
        window.location.href = url;
    };
    // 提交查询与分页查询
    $scope.submitQuery = $scope.pageQuery = function (event) {
        if(event){
          // 当点击查询时重置当页为首页
          var event = event || window.event;
          var target = event.target || window.srcElement;
          if (target.tagName.toLocaleLowerCase() == "button") {
            $scope.pagination.currentPage = 1;
          }
        }
        smsPush.getPushRecordList();
    };

    // 添加推送
    $scope.addPush = function () {
        $location.path('/access/app/internal/paymentMessage/addSmsPush');
    };

  // 接收对象详细
  $scope.detailReceive = function (school, objList, event) {
    event.preventDefault();
    event.stopPropagation();

    var modalInstance = $modal.open({
      templateUrl: 'receiveObjList.html',
      controller: 'ModalReceiveObjListCtrl',
      resolve: {
        items: function () {
          return [school, objList];
        }
      }
    });

    modalInstance.result.then(function (data) {
      $scope.data = data;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };

  $scope.detailMsg = function (msg, event) {
    event.preventDefault();
    event.stopPropagation();

    var modalInstance = $modal.open({
      templateUrl: 'pushMsgDetail.html',
      controller: 'ModalPushMsgDetailCtrl',
      resolve: {
        items: function () {
          return msg;
        }
      }
    });

    modalInstance.result.then(function (data) {
      $scope.data = data;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };

}]);

app.controller('ModalReceiveObjListCtrl', ['$scope','$modalInstance','items',function ($scope, $modalInstance, items) {
  $scope.school = items[0];
  $scope.receiveList = items[1].split(',');
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

app.controller('ModalPushMsgDetailCtrl', ['$scope','$modalInstance','items',function ($scope, $modalInstance, items) {
  $scope.msgDetail = items;
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

