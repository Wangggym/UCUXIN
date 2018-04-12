/**
 * Created by WangQiHan on 2016/9/19.
 * Add School Test Task Controller
 */
app.controller('DetailSchoolTestTaskController',['$scope', '$location', function ($scope, $location ) {
  'use strict';

  // 数据交互
  $scope.detailData = JSON.parse(APPMODEL.Storage.testTask);
  console.log($scope.detailData)
  $scope.cancel = function () {
    $location.path('/access/app/internal/operationManagement/schoolTestTask');
    APPMODEL.Storage.removeItem('testTask');
  };
}]);
