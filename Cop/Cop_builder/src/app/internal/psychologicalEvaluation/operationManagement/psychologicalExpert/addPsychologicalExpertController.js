/**
 * Created by WangQiHan on 2016/9/20.
 * Add Psychological Information Controller
 */
app.controller('AddPsychologicalExpertController', ['$scope', '$filter', '$http', 'Upload', '$timeout', '$stateParams', '$location', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $filter, $http, Upload, $timeout, $stateParams, $location, toastr, toastrConfig, applicationServiceSet) {
    'use strict';

    toastrConfig.preventOpenDuplicates = true;
    // 提交信息
    $scope.submitData = {
        ID: 0,
        Name: undefined,
        Instro: undefined,
        Label: undefined,
        HeadPicUrl: undefined,
        Cont: undefined,
        Sort: undefined
    };

    // 编辑器初始化
    $scope.context = new Object();
    // 编辑器配置
    /*$scope.config = {
     ucu:{
     url: urlConfig + 'base/v3/OpenApp/UploadAttachment',
     params: {'token': APPMODEL.Storage.applicationToken, 'attachmentStr' :{"Path":"charge","AttachType":1,"ExtName":".png","ResizeMode":1,"SImgResizeMode":2}}
     }
     };*/

    // 图片缩略图
    $scope.uploadPic = function (file) {
        if (!file) return;
        applicationServiceSet.parAppServiceApi.applicationFeeOpen.imageFileUpload.fileUpload(file).then(function (data) {
            if (data.Ret == 0) {
                $scope.submitData.HeadPicUrl = data.Data.Url;
            } else {
                toastr.error("图片上传失败");
            }
        });
    }

    /*$scope.upload = function (dataUrl, name) {
     console.log(dataUrl, name);
     /!*Upload.http({
     url: urlConfig +'base/v3/OpenApp/UploadAttachment?attachmentStr={"Path":"charge","AttachType":1,"ExtName":".png","ResizeMode":1,"SImgResizeMode":2}&token='+ APPMODEL.Storage.applicationToken,
     headers : {
     'Content-Type': dataUrl.type
     },
     data: dataUrl
     })*!/
     var fr = new FileReader();
     var fd = new FormData();
     if(dataUrl){
     fr.readAsDataURL(dataUrl);
     fd.append('filename', dataUrl);
     }

     $http.post(urlConfig +'base/v3/OpenApp/UploadAttachment?attachmentStr={"Path":"charge","AttachType":1,"ExtName":".png","ResizeMode":1,"SImgResizeMode":2}&token='+ APPMODEL.Storage.applicationToken);

     /!*var fr = new FileReader();
     var fd = new FormData();
     if (file) {
     fr.readAsDataURL(file);
     fd.append('filename', file);
     }
     var serviceApiObj = this;
     var defer = $q.defer();
     var httpRequest = {
     url: serviceApiObj.requestUrl,
     type: serviceApiObj.method,
     data: serviceApiObj.requestParams(fd),
     cache: false,
     processData: false,
     contentType: false,
     dataType: 'json'
     };*!/


     /!*Upload.upload({
     url: urlConfig +'base/v3/OpenApp/UploadAttachment?attachmentStr={"Path":"charge","AttachType":1,"ExtName":".png","ResizeMode":1,"SImgResizeMode":2}&token='+ APPMODEL.Storage.applicationToken,
     headers : {
     'Content-Type': 'image/jpeg'
     },
     data: {
     file: Upload.dataUrltoBlob(dataUrl, name)
     }
     }).then(function (response) {
     $timeout(function () {
     $scope.result = response.data;
     });
     }, function (response) {
     if (response.status > 0) $scope.errorMsg = response.status
     + ': ' + response.data;
     }, function (evt) {
     $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
     });*!/
     }*/


    // 服务
    var addPsychologicalExpert = (function () {
        var token = APPMODEL.Storage.copPage_token;

        var getService = function (method, arr, fn) {
            applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr).then(fn);
        };

        var getSinglePsychologicalExperts = function (id) {
            getService('getSinglePsychologicalExperts', [token, id], function (data) {
                if (data.Ret === 0) {
                    $scope.submitData = data.Data;
                    setTimeout(function () {
                        $scope.context.receiveUeditText(data.Data.Cont);
                    }, 500);
                }
            });
        };
        var savePsychologicalExpert = function () {
            getService('savePsychologicalExpert', [$scope.submitData.ID, $scope.submitData.Name, $scope.submitData.Instro, $scope.submitData.Label, $scope.submitData.HeadPicUrl, $scope.submitData.Cont, $scope.submitData.Sort], function (data) {
                if (data.Ret === 0) {
                    var testMsg = $scope.submitData.ID ? '修改' : '添加';
                    toastr.success('心理专家' + testMsg + '成功！');
                    $location.path('access/app/internal/operationManagement/psychologicalExpert');
                }
            });
        };

        return{
            savePsychologicalExpert: savePsychologicalExpert,
            getSinglePsychologicalExperts: getSinglePsychologicalExperts
        }
    })();

    $scope.isAdd = parseInt($stateParams.id) ? false : true;
    // 绑定修改的的数据值
    if (!$scope.isAdd) {
        addPsychologicalExpert.getSinglePsychologicalExperts($stateParams.id);
    }

    $scope.confirm = function () {
        $scope.submitData.Cont = $scope.context.returnUeditText();
        if (!$scope.submitData.Name) {
            toastr.error("请填写心理专家名称！");
            return;
        }
        if (!$scope.submitData.HeadPicUrl) {
            toastr.error("请上传心理专家头像！");
            return;
        }
        if (!$scope.submitData.Label) {
            toastr.error("请填写心理专家标签！");
            return;
        }
        if (!$scope.submitData.Instro) {
            toastr.error("请填写心理专家简介！");
            return;
        }
        if (!$scope.submitData.Cont) {
            toastr.error("请填写心理专家详细介绍！");
            return;
        }
        if ($scope.submitData.Sort === undefined || $scope.submitData.Sort === '') {
            toastr.error("请填写排序值！");
            return;
        }

        addPsychologicalExpert.savePsychologicalExpert();
    }

    $scope.cancel = function () {
        $location.path('access/app/internal/operationManagement/psychologicalExpert');
    }
}]);
