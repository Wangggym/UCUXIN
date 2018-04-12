/**
 * Created by Wang QiHan on 2016/9/29.
 * Test Personnel Result Controller
 */
app.controller('TestPersonnelResultController', ['$scope', '$stateParams', 'applicationServiceSet', function ($scope, $stateParams, applicationServiceSet) {
  'use strict';

  var testPersonnelResult = (function () {
    var token = APPMODEL.Storage.copPage_token;

    var getService = function (method, arr, fn) {
      applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr).then(fn);
    };
    var getPersonnelTestResult = function () {
      getService('getPersonnelTestResult', [token, $stateParams.id], function (data) {
        if (data.Ret === 0) {
          /*var sortFormat = function (data) {
            var i, index = 0, arr = [], len = data.length;
            for (i = 0; i < len; i++) {
              arr[index] = arr[index] || [];
              arr[index].push(data[i]);
              if (arr[index].length == 10) index++;
            }
            return arr;
          };*/

          $scope.resultData = data.Data || undefined;
          //$scope.resultData.AnswerScores = sortFormat(data.Data.AnswerScores);
        }
      });
    };

    return {
      getPersonnelTestResult: getPersonnelTestResult
    }
  })();

  testPersonnelResult.getPersonnelTestResult();

  $scope.cancel = function () {
    window.history.back();
  }
}]);
