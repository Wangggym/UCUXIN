/**
 * Created by QiHan Wang on 2017/2/8.
 * User Test Result Controller
 */
app.controller('UserTestResultController', ['$scope', '$filter', '$state', 'applicationServiceSet', function ($scope, $filter, $state, applicationServiceSet) {
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


    var getTestResult = function () {
      service('getTestResult', [token, $state.params.id], function (data) {
        if (data.Ret === 0) {
          if (data.Data) {
            vm.model.topGName = data.Data.TopGName;
            vm.model.className = data.Data.ClassName;
            vm.model.name = data.Data.UName;
            var AnswerSignsList = [];
            for (var i in data.Data.AnswerScores) {
              var AnswerSigns = {
                "num": data.Data.AnswerScores[i],
                "name": data.Data.AnswerSigns[i]
              };
              AnswerSignsList.push(AnswerSigns);
            }
            vm.model.AnswerSignsList = AnswerSignsList;
            vm.model.Properties = data.Data.Properties;
            vm.model.Height = data.Data.WeiOrHeiDescs[0].Name;
            vm.model.HeightscoreValue = data.Data.WeiOrHeiDescs[0].Value;
            vm.model.HeightDesc = data.Data.WeiOrHeiDescs[0].Desc;
            vm.model.Weight = data.Data.WeiOrHeiDescs[1].Name;
            vm.model.WeightscoreValue = data.Data.WeiOrHeiDescs[1].Value;
            vm.model.WeightDesc = data.Data.WeiOrHeiDescs[1].Desc;

            vm.model.resultData = data.Data.LstFactorScore;
          }
        }
      })
    }
    return {
      getTestResult: getTestResult
    }
  })();

  var vm = $scope.vm = {

    model: {
      topGName: undefined,
      className: undefined,
      name: undefined,
      height: undefined,
      weight: undefined,
      age: undefined,
      AnswerScores: [],
      AnswerSigns: [],
      WeiOrHeiDescs: []
    },
    init: function () {
      ctrl.getTestResult();
    },
    cancel: function () {
      $state.go('access.app.internal.nutritionOrderManagement.userOrder');
    }
  };
  vm.init();
}]);