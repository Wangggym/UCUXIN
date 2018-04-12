/**
 * Created by WangQiHan on 2016/9/20.
 * Add Psychological Information Controller
 */
app.controller('DetailPsychologicalInformationMonitoringController', ['$scope','$stateParams','$location', 'applicationServiceSet', function ($scope, $stateParams, $location, applicationServiceSet) {
  'use strict';
  // 服务
  var addPsychologicalInformation = (function () {
    var token = APPMODEL.Storage.copPage_token;
    var getService = function (method, arr, fn) {
      applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr).then(fn);
    };
    var getSinglePsychInformation = function (id) {
      getService('getSinglePsychInformation', [token, id], function (data) {
        if(data.Ret === 0){
          $scope.submitData = {
            id: data.Data.ID,
            title: data.Data.Title || '未填写',
            type: data.Data.Type,
            status: data.Data.ST ,
            introduction: data.Data.Instro || '未填写',
            origin: data.Data.Origin || '未填写',
            thumbnail: data.Data.ImgUrl || '未上传',
            content: data.Data.Cont || '未填写',
            schoolId :data.Data.TopGID,
            EduStage: data.Data.EduStage
          };
        }
      });
    };

    return{
      getSinglePsychInformation: getSinglePsychInformation
    }
  })();

  addPsychologicalInformation.getSinglePsychInformation($stateParams.id);

  $scope.cancel = function () {
    $location.path('access/app/internal/knowledgeInformation/psychologicalInformationMonitoring');
  }
}]);
