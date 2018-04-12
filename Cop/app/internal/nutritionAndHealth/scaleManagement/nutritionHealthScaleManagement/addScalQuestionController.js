/**
 * Created by wangbin on 2016/12/14.
 */
app.controller('addScalQuestionController', ['$scope', 'toastr','$location', '$modal', 'applicationServiceSet','editableThemes','editableOptions', function ($scope, toastr,$location, $modal, applicationServiceSet,editableThemes,editableOptions) {
    'use strict';
    var question;
    function questionFunction() {
        this.init = function () {
            var scaleId = sessionStorage.getItem('nutritionScaleId');
            question.pageData();
            if(scaleId){
                $scope.pageData.scaleId = scaleId;
            }
            question.getScaleQuestions();
            question.onEvent();
        };
        this.pageData = function () {
            // angular xeditable configure样式配置
            editableThemes.bs3.inputClass = 'input-sm';
            editableThemes.bs3.buttonsClass = 'btn-sm';
            editableOptions.theme = 'bs3';
            $scope.pageData = {
                scaleId:'',
                title: sessionStorage.getItem('pageTitle')
            }
        };
        this.onEvent = function () {
            // 查看答案详细
            $scope.open = function (index) {
                if ($scope.isOpen == index) {
                    $scope.isOpen = undefined;
                } else {
                    $scope.isOpen = index
                }
            };
            // 删除问题
            $scope.delQuestion = function (item) {
                var modalInstance = $modal.open({
                    templateUrl: 'removeConfirm.html',
                    size: 'sm',
                    controller: 'RemoveConfirmCtrl',
                    resolve: {
                        items: function () {
                            return {
                                data: item,
                                name: '测试题'
                            }
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    // 删除当前题
                    if(res.ID != 0){
                        question.deletQuestion(res.ID);
                    }else{
                        toastr.success('删除成功！');
                    }
                    $scope.questionList.splice($scope.questionList.indexOf(res), 1);
                }, function () {
                    // 取消时作出操作
                });
            };
            // 跳转到因子定义
            $scope.next = function () {
                if($scope.questionList.length == 0){
                    toastr.error('还没有添加测试题！');
                    return;
                }
                question.addQuestions();
            };
            //跳转到用户属性
            $scope.prev = function () {
                $location.path('access/app/internal/nutritionScalMannage/addScaleUserAttribute');
            };
            // 编辑问题 当参数存在时表示修改
            $scope.addQuestion = $scope.editQuestion = function (item) {
                var modalInstance,seqNoArr = [];
                var oldQuestion = angular.copy(item) || '';
                // 取出当题库题号
                for(var i in $scope.questionList){
                    seqNoArr.push(parseInt($scope.questionList[i].SeqNo));
                }
                // 弹出模态框配置
                modalInstance = $modal.open({
                    templateUrl: 'addQuestion.html',
                    controller: 'AddQuestionCtrl',
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return {
                                target: item ? item : $scope.pageData.scaleId,
                                seqNoArr : seqNoArr
                            };
                        }
                    }
                });
                modalInstance.result.then(function (addQuestionItem) {
                    if (item) {
                        for (var i in $scope.questionList) {
                            if ($scope.questionList[i].SeqNo === addQuestionItem.SeqNo) {
                                $scope.questionList.splice(i, 1, addQuestionItem);
                                // 如果当前ID不为0则表示修改数据库数据
                                if(!!item.ID){
                                    question.updateQuestion(item);
                                }
                                return;
                            }
                        }
                    } else {
                        $scope.questionList.push(addQuestionItem);
                    }
                }, function () {
                    // 取消时还原当前题
                    if(item) angular.extend(item,oldQuestion);
                    // 取消操作
                    if(!$scope.questionList.length) return;
                    angular.forEach($scope.questionList, function (question) {
                        var newQuestion = angular.copy(question.Options);
                        angular.forEach(question.Options, function (answer) {
                            if(answer.Cont == undefined){
                                newQuestion.splice(newQuestion.indexOf(answer), 1);
                            }
                        });
                        question.Options = newQuestion;
                    });
                });
            }
        };
    }
    // 获取所有题
    questionFunction.prototype.getScaleQuestions = function () {
        applicationServiceSet.internalServiceApi.nutritionHealth.getScaleQuestions.send([$scope.pageData.scaleId]).then(function (data) {
            if(data.Ret == '0'){
                $scope.questionList = data.Data;
            }
        });
    };
    // 增加题
    questionFunction.prototype.addQuestions = function () {
        var questionList = [];
        $.each($scope.questionList,function (e,item) {
            if(item.ID == 0){
                questionList.push(item);
            }
        });
        if(questionList.length==0){
            $location.path('access/app/internal/nutritionScalMannage/addScaleFactor');
        }else {
            applicationServiceSet.internalServiceApi.nutritionHealth.addQuestions.send([questionList]).then(function (data) {
                if(data.Ret == '0'){
                    toastr.success('添加题库成功！');
                    $location.path('access/app/internal/nutritionScalMannage/addScaleFactor');
                }
            });
        }
    };
    // 修改已存在的题
    questionFunction.prototype.updateQuestion = function (question) {
        applicationServiceSet.internalServiceApi.nutritionHealth.updateQuestions.send([question.ID,$scope.pageData.scaleId,question.SeqNo,question.Title,question.ImgUrl,question.MinAnswer,question.MaxAnswer,question.Options]).then(function (data) {
            if(data.Ret == '0'){
                toastr.success('修改成功！');
            }
        });
    };
    // 删除题目
    questionFunction.prototype.deletQuestion = function (id) {
        applicationServiceSet.internalServiceApi.nutritionHealth.deletQuestion.send([id]).then(function (data) {
            if(data.Ret == '0'){
                toastr.success('删除成功！');
            }
        });
    };
    question = new questionFunction();
    question.init();
}]);

/*==============================添加题库操作=============================================*/
app.controller('AddQuestionCtrl', ['$scope', '$modalInstance', 'items', 'toastr', 'toastrConfig', function ($scope, $modalInstance, items,toastr,toastrConfig) {
    toastrConfig.preventOpenDuplicates = true;
    $scope.question = {
        ID:0,
        SeqNo: items.seqNoArr.length ? Math.max.apply(null,items.seqNoArr) + 1 : 1,
        ScaID:undefined,
        Title: undefined,
        MinAnswer: 1,
        MaxAnswer:1,
        ImgUrl: '',
        Options:[]
    };

    if((typeof items.target) === 'object'){
        $scope.addQuestionTitle = '修改';
        // 修改数据获取
        $scope.question = items.target;
        items.seqNoArr.splice(items.seqNoArr.indexOf(parseInt($scope.question.SeqNo)), 1);

    }else{
        $scope.addQuestionTitle = '新增';
        $scope.question.ScaID = items.target;
    }
    // 一道题的完整验证
    $scope.confirm = function () {
        if (!$scope.question.Title) {
            toastr.error('请填写问题题干！');
            return;
        }
        if($scope.question.MinAnswer == undefined || $scope.question.MaxAnswer == undefined){
            toastr.error('请把选项个数填写完整！');
            return;
        }
        if(parseInt($scope.question.MinAnswer) > parseInt($scope.question.MaxAnswer)){
            toastr.error('最少个数不能大于最多个数！');
            return;
        }
        if (!$scope.question.SeqNo) {
            toastr.error('请填写题号！');
            return;
        }
        if(items.seqNoArr.indexOf(parseInt($scope.question.SeqNo)) != -1){
            toastr.error('当前题号已存在，请重新填写！');
            return;
        }
        if(!parseInt($scope.question.SeqNo)) {
            toastr.error('当前题号不能为0，请重新填写！');
            return;
        }

        if (!$scope.question.Options.length) {
            toastr.error('请添加问题答案！');
            return;
        } else {
            var errorRecord = '';
            angular.forEach($scope.question.Options, function (item, i) {
                if (!item.Sign || !item.Cont) {
                    var order = ++i;
                    errorRecord += (!errorRecord ? order : '、' + order);
                }
            });
            if (!!errorRecord) {
                toastr.error('第' + errorRecord + '条答案未填写完整！');
                return;
            }
        }
        $modalInstance.close($scope.question);
    };

    // 填写表单验证
    $scope.checkSign = function (data) {
        if (!(/^[A-Za-z]$/.test(data))) {
            //toastr.error('请填写A-Z的大写字母！');
            return '请填写A-Z的大写字母！';
        }
    };
    $scope.checkCont = function (data) {
        if (!data) {
            //toastr.error('请填写问题答案！');
            return '请填写问题答案！';
        }
    };
    $scope.checkScore = function (data) {
        if (!(/^(\-|\+)?\d+(\.\d+)?$/.test(data))) {
            //toastr.error('请填写小数、负数、正数！');
            return '请填写正正确定的数值！';
        }
    };
    $scope.saveAnswer = function (data, ID) {
        //$scope.user not updated yet
        angular.extend(data, {ID: ID});
        //return $http.post('/saveUser', data);
    };
    // remove user
    $scope.delAnswer = function (index) {
        $scope.question.Options.splice(index, 1);
    };
    // 增加答案
    $scope.addAnswer = function () {
        $scope.inserted = {
            ID:0,
            Sign: String.fromCharCode((65 + $scope.question.Options.length)),
            Cont: undefined,
            Score: undefined
        };
        $scope.question.Options.push($scope.inserted);
    };
    // 关闭模态框
    $scope.cancel = function () {
        $modalInstance.dismiss($scope.question);
    };
}]);

app.controller('RemoveConfirmCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    'use strict';
    $scope.item = items.data;
    $scope.name = items.name;
    $scope.comfirm = function () {
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
