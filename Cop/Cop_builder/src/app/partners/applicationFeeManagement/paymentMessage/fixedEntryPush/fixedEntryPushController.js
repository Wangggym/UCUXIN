/**
 * Created by WangQiHan on 2016/8/31.
 * SMS Push Controller
 */
app.controller('FixedEntryPushController', ['$scope','$modal', '$location', 'applicationServiceSet', function ($scope,$modal, $location, applicationServiceSet) {
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
    var fixedEntryPush = (function () {
        // 取出当前token 与 orgid值
        var token = APPMODEL.Storage.copPage_token,
            orgid = APPMODEL.Storage.orgid;

        var getService = function (method, arr, fn) {
            applicationServiceSet.parAppServiceApi.paymentMessage[method].send(arr).then(fn);
        };

        // 获取当前用户学校
        var getSchool = function () {
            getService('getSchoolList', [token, orgid], function (data) {
                if (data.Ret == 0) {
                    $scope.schoolList = data.Data.length ? data.Data : undefined;
                }
            });
        };

        // 获取已推送信息记录
        var getPushRecord = function () {
            var schoolId = $scope.queryFields.school || 0;
            getService('getPushRecordPage', [token, $scope.pagination.currentPage, $scope.pagination.itemsPerPage, 3, orgid, schoolId], function (data) {

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

    // 获取学校
    fixedEntryPush.getSchoolList();
    fixedEntryPush.getPushRecordList();

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
        fixedEntryPush.getPushRecordList();
    };

    // 添加推送
    $scope.addPush = function () {
        $location.path('/access/app/partner/paymentMessage/addFixedEntryPush');
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
