/**
 * Created by QiHan Wang on 2017/2/8.
 * User Test Question Controller
 */
app.controller('UserTestQuestionController', ['$scope', '$filter', '$stateParams', 'applicationServiceSet', function ($scope, $filter, $stateParams, applicationServiceSet) {
  'use strict';

  var ctrl = (function () {
    var token = APPMODEL.Storage.copPage_token;

    var service = function (method, arr, list, fn) {
      if (Object.prototype.toString.call(list) === '[object Function]') {
        fn = list;
        list = undefined;
      }
      applicationServiceSet.internalServiceApi.nutritionHealth[method].send(arr, list).then(fn);
    };

    var getTestQuestion = function () {
      service('getTestQuestion', [token, $stateParams.id], function (data) {
        if(data.Ret === 0){
          if(data.Data){
            vm.data = data.Data;
          }
        }
      })
    }

    return {
      getTestQuestion: getTestQuestion
    }
  })();

  var vm = $scope.vm = {
    init: function () {
      ctrl.getTestQuestion();
    }
  };
  vm.init();
}]);