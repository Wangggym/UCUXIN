/**
 * Created by WangQiHan on 2016/9/20.
 * Add Psychological Information Controller
 */
app.controller('AddPsychologicalInformationController', ['$scope', '$filter', '$stateParams', '$location', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $filter, $stateParams, $location, toastr, toastrConfig, applicationServiceSet) {
    'use strict';
    $scope.imgName = '未上传图片';
    $('#jqfileupload').fileupload({
        dataType: 'json',
        add: function (e, data) {
            $scope.uploadPic(data.files[0]);
            $scope.imgName = data.files[0].name;
        }
    });
    toastrConfig.preventOpenDuplicates = true;
    // --- 学段配置 Start--------------------------------------------------
    $scope.periodConfig = [
        {name: '学前', value: 2},
        {name: '小学', value: 4},
        {name: '初中', value: 8},
        {name: '高中', value: 16},
        {name: '职校', value: 32},
        {name: '大学', value: 64}
    ];

    $scope.$watch('periodConfig', function (nv, ov) {
        if (nv === ov) return;
        var periodList = [];
        angular.forEach($scope.periodConfig, function (item) {
            if (item.IsCheck) {
                periodList.push(item.value);
            }
        });
        if (periodList.length) {
            $scope.submitData.period = periodList;
        } else {
            $scope.submitData.period = typeof $scope.submitData.period === 'number' ? $scope.submitData.period : undefined;
        }
    }, true);

    $scope.changeAllPeriod = function (allPeriod) {
        if (allPeriod) {
            angular.forEach($scope.periodConfig, function (item) {
                if (item.IsCheck) item.IsCheck = false;
            });
        }
        $scope.submitData.period = allPeriod ? 1024 : undefined;
    };
    // --- 学段配置 End--------------------------------------------------
    // 提交信息
    $scope.submitData = {
        id: 0,
        title: undefined,
        period: undefined,
        type: true,
        status: 2,
        introduction: undefined,
        origin: undefined,
        thumbnail: undefined,
        content: undefined,
        schoolId: undefined
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
                $scope.submitData.thumbnail = data.Data.Url;
            } else {
                toastr.error("图片上传失败");
            }
        });
    }

    // 服务
    var addPsychologicalInformation = (function () {

        var token = APPMODEL.Storage.copPage_token;

        var getService = function (method, arr, fn) {
            applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr).then(fn);
        };

        var getSinglePsychInformation = function (id) {
            getService('getSinglePsychInformation', [token, id], function (data) {
                if (data.Ret === 0) {
                    $scope.submitData = {
                        id: data.Data.ID,
                        title: data.Data.Title,
                        type: data.Data.Type,
                        status: data.Data.ST ? 1 : 2,
                        introduction: data.Data.Instro,
                        origin: data.Data.Origin,
                        thumbnail: data.Data.ImgUrl,
                        content: data.Data.Cont,
                        schoolId: data.Data.TopGID,
                        period: data.Data.EduStage
                    };

                    if (data.Data.EduStage === 1024) {
                        $scope.allPeriod = true;
                    } else {
                        angular.forEach($scope.periodConfig, function (item) {
                            if (data.Data.EduStage & item.value) {
                                item.IsCheck = true;
                            }
                        });
                    }

                    $scope.context.receiveUeditText(data.Data.Cont);
                }
            });
        };

        var savePsychInformation = function () {
            $scope.submitData.schoolId = $scope.submitData.schoolId || 0;
            $scope.submitData.status = ($scope.submitData.status == 1) ? true : false;
            var period = function () {
                var value = undefined;
                if (typeof $scope.submitData.period === 'number') {
                    return $scope.submitData.period;
                } else {
                    angular.forEach($scope.submitData.period, function (item) {
                        value = value ? value | item : item;
                    });
                    return value;
                }
            }

            getService('savePsychInformation', [$scope.submitData.id, $scope.submitData.type, $scope.submitData.title, $scope.submitData.introduction, $scope.submitData.thumbnail, $scope.submitData.origin, $scope.submitData.content, $scope.submitData.status, $scope.submitData.schoolId, period], function (data) {
                if (data.Ret === 0) {
                    var textMsg = $scope.submitData.id ? '修改' : '添加';
                    toastr.success('全网心理资讯' + textMsg + '成功！');
                    $location.path('access/app/internal/knowledgeInformation/psychologicalInformation');
                }
            });
        };


        return{
            savePsychInformation: savePsychInformation,
            getSinglePsychInformation: getSinglePsychInformation
        }
    })();

    $scope.isAdd = parseInt($stateParams.id) ? false : true;
    // 绑定修改的的数据值
    if (!$scope.isAdd) {
        addPsychologicalInformation.getSinglePsychInformation($stateParams.id);
    }

    $scope.confirm = function () {
        $scope.submitData.content = $scope.context.returnUeditText();

        if (!$scope.submitData.title) {
            toastr.error("请填写全网心理资讯维护标题！");
            return;
        }
        if (!$scope.submitData.period && !$scope.submitData.period.length) {
            toastr.error("请选择学段！");
            return;
        }
        if (!$scope.submitData.introduction) {
            toastr.error("请填写全网心理资讯维护简介！");
            return;
        }
        if (!$scope.submitData.thumbnail) {
            toastr.error("请上传全网心理资讯维护图片！");
            return;
        }
        if (!$scope.submitData.status) {
            toastr.error("请选择全网心理资讯维护状态！");
            return;
        }
        if (!$scope.submitData.content) {
            toastr.error("请编辑择全网心理资讯维护内容！");
            return;
        }

        addPsychologicalInformation.savePsychInformation();
    }

    $scope.cancel = function () {
        $location.path('access/app/internal/knowledgeInformation/psychologicalInformation');
    }
}]);
