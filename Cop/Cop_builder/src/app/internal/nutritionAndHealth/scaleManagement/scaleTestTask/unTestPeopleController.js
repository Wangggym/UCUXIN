/**
 * Created by WangQiHan on 2017/3/16.
 * UnTest People Controller
 */
app.controller('UnTestPeopleController', ['$scope', '$location', '$filter', '$stateParams', 'applicationServiceSet', function ($scope, $location, $filter, $stateParams, applicationServiceSet) {
  'use strict';

  $scope.queryFields = {
    className: undefined,
    studentName: undefined
  }

  // 分页指令配置
  $scope.pagination = {
    currentPage: 1,
    itemsPerPage: 20, // 默认查询10条
    maxSize: 5,
    previousText: "上页",
    nextText: "下页",
    firstText: "首页",
    lastText: "末页"
  };

  var ctrl = (function () {
    var token = APPMODEL.Storage.copPage_token,
      applicationToken = APPMODEL.Storage.applicationToken,
      gid = $stateParams.TopGID,
      orderID = $stateParams.orderID;

    var getService = function (method, arr, fn) {
      applicationServiceSet.internalServiceApi.nutritionHealth[method].send(arr).then(fn);
    }

    // 根据学校ID获取班级列表
    var getClassList = function () {
      getService('getClassList', [token, gid], function (data) {
        if (data.Ret === 0) {
          $scope.classNameList = data.Data || undefined;
        }
      })
    };

    // 根据班级ID获取学生列表

    var getStudentList = function () {
      var classID = $scope.queryFields.className || 0;
      getService('getStudentList', [token, gid, classID], function (data) {
        if (data.Ret === 0) {
          $scope.studentList = data.Data || undefined;
        }
      });
    };

    var getUnTestPeople = function () {
      var classID = $scope.queryFields.className || 0,
        umid = $scope.queryFields.studentName || 0;

      getService('getUnTestPeople', [token, $scope.pagination.currentPage, $scope.pagination.itemsPerPage, gid, orderID, classID, umid], function (data) {
        if (data.Ret === 0) {
          if (data.Data && data.Data.ViewModelList.length) {
            $scope.dataList = data.Data.ViewModelList;
            $scope.pagination.totalItems = data.Data.TotalRecords;
            $scope.pagination.numPages = data.Data.Pages;
          } else {
            $scope.dataList = $scope.pagination.totalItems = $scope.pagination.numPages = undefined;
          }
        }
      });
    }

    return {
      getClassList: getClassList,
      getStudentList: getStudentList,
      getUnTestPeople: getUnTestPeople
    }
  })();

  // 默认查出数据
  ctrl.getUnTestPeople();

  // 获取班级列表
  ctrl.getClassList();

  // 获取学生列表

  $scope.$watch('queryFields.className', function (nv, ov) {
    if(ov === nv) return;
    if(nv === undefined){
      $scope.studentList = undefined;
      $scope.queryFields.studentName = undefined;
      return;
    }
    ctrl.getStudentList();
  }, true)
  /*$scope.changeClass = function () {
    if(!$scope.queryFields.className){
      $scope.studentList = undefined;
      $scope.queryFields.studentName = undefined;
      return;
    }
    ctrl.getStudentList();
  }*/

  // 查询出列表
  $scope.submitQuery = $scope.pageQuery = function (event) {
    if (event) {
      // 当点击查询时重置当页为首页
      var event = event || window.event;
      var target = event.target || window.srcElement;
      if (target.tagName.toLocaleLowerCase() == "button") {
        $scope.pagination.currentPage = 1;
      }
    }
    ctrl.getUnTestPeople();
  };

  $scope.cancel = function () {
    window.history.back();
  }
}]);
