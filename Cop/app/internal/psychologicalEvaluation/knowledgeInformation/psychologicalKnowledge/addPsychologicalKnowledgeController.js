/**
 * Created by WangQiHan on 2016/9/20.
 * Add Psychological Knowledge Controller
 */
app.controller('AddPsychologicalKnowledgeController', ['$scope', '$filter', '$stateParams', '$location', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $filter, $stateParams, $location, toastr, toastrConfig, applicationServiceSet) {
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
    // 提交信息
    $scope.submitData = {
        id: 0,
        title: undefined,
        period: undefined,
        type: undefined,
        introduction: undefined,
        thumbnail: undefined,
        showDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
        showEndDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
        knowledgeContent: undefined
    };
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

    // --- 时间配置 开始--------------------------------------------------
    $scope.clear = function () {
        $scope.submitData.showDate = null;
    };

    $scope.openShowDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.showEndDateOpened = false;
        $scope.showDateOpened = true;
    };
    $scope.openShowEndDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.showDateOpened = false;
        $scope.showEndDateOpened = true;
    };
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    $scope.format = 'yyyy-MM-dd';
    $scope.changeDate = function () {
        $scope.submitData.showDate = $filter('date')($scope.submitData.showDate, 'yyyy-MM-dd');
    };
    $scope.changeEndDate = function () {
        $scope.submitData.showEndDate = $filter('date')($scope.submitData.showEndDate, 'yyyy-MM-dd');
    };
    //---- 时间配置 结束 -------------------------------------------------------

    // 编辑器初始化
    $scope.context = new Object();
    // 编辑器配置
    /* $scope.config = {
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
    };

    var addPsychologicalKnowledge = (function () {

        var token = APPMODEL.Storage.copPage_token;

        var getService = function (method, arr, list, fn) {
            applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr, list).then(fn);
        };

        // 修改时获取当前ID数据
        var getSingleKnowledge = function (id) {
            getService('getSingleKnowledge', [token, id], undefined, function (data) {
                if (data.Ret === 0) {
                    $scope.submitData = {
                        id: data.Data.ID,
                        title: data.Data.Title,
                        type: data.Data.Type ? 1 : 2,
                        introduction: data.Data.Instro,
                        thumbnail: data.Data.ImgUrl,
                        showDate: data.Data.SDate,
                        knowledgeContent: data.Data.Cont,
                        period: data.Data.EduStage,
                        showEndDate: data.Data.EDate
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

        // 添加修改时保存数据
        var savePsychologicalKnowledge = function () {
            $scope.submitData.type = ($scope.submitData.type == 1) ? true : false;
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
            };
            getService('savePsychKnowledge', [$scope.submitData.id, $scope.submitData.type, $scope.submitData.title, $scope.submitData.introduction, $scope.submitData.thumbnail, $scope.submitData.url, $scope.submitData.knowledgeContent, $scope.submitData.showDate, period, $scope.submitData.showEndDate], undefined, function (data) {
                if (data.Ret === 0) {
                    toastr.success('心理知识添加成功！');
                    $location.path('access/app/internal/knowledgeInformation/psychologicalKnowledge');
                }
            });
        };

        return {
            savePsychologicalKnowledge: savePsychologicalKnowledge,
            getSingleKnowledge: getSingleKnowledge
        }
    })();

    // 修改时获取当前id数据
    $scope.isAdd = parseInt($stateParams.id) ? false : true;
    if (!$scope.isAdd) {
        addPsychologicalKnowledge.getSingleKnowledge($stateParams.id);
    }

    // 确定修改保存
    $scope.confirm = function () {

        $scope.submitData.knowledgeContent = $scope.context.returnUeditText();

        if (!$scope.submitData.title) {
            toastr.error("请填写心理知识维护标题！");
            return;
        }

        if (!$scope.submitData.period) {
            toastr.error("请选择学段！");
            return;
        }

        if (!$scope.submitData.type) {
            toastr.error("请选择心理知识维护类型！");
            return;
        }
        if (!$scope.submitData.introduction) {
            toastr.error("请填写心理知识维护简介！");
            return;
        }
        if (!$scope.submitData.thumbnail) {
            toastr.error("请上传心理知识维护图片！");
            return;
        }
        if (!$scope.submitData.showDate || $scope.submitData.showDate === '0001-01-01') {
            toastr.error("请选择心理知识维护开始时间！");
            return;
        }
        if (!$scope.submitData.showEndDate || $scope.submitData.showEndDate === '0001-01-01') {
            toastr.error("请选择心理知识维护结束时间！");
            return;
        }
        if (!$scope.submitData.knowledgeContent) {
            toastr.error("请编辑心理知识维护内容！");
            return;
        }
        // 提交配置
        addPsychologicalKnowledge.savePsychologicalKnowledge();
    };

    $scope.cancel = function () {
        $location.path('access/app/internal/knowledgeInformation/psychologicalKnowledge');
    };
}]);

