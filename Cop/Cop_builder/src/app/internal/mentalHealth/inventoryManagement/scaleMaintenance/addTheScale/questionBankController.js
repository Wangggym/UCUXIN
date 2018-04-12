/**
 * Created by fanweihua on 2017/7/14.
 * 题库
 */
app.controller('questionBankController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var questionBank = {
        //入口
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
        },
        //变量声明
        variable: function () {
            $scope.scaleID = APPMODEL.Storage.getItem("scaleID");
            $scope.model = {
                ID: undefined,
                itemList: []
            };
            if ($stateParams.scaleID || APPMODEL.Storage.getItem("scaleID")) {
                $scope.model.ID = $stateParams.scaleID || APPMODEL.Storage.getItem("scaleID");
            }
        },
        //操作
        operation: function () {
            //新增
            $scope.new = function () {
                this.setting.modal();//模态框
            }.bind(this);
            //修改
            $scope.modification = function (item) {
                this.setting.modal(item);//模态框
            }.bind(this);
            //删除
            $scope.deleteMine = function (item) {
                this.service._deleteQuestion(item);//删除题目及选项
            }.bind(this);
            //打开
            $scope.toggleOpen = function (item) {
                item.open = !item.open;
            };
            //下一步
            $scope.questionNext = function () {
                $location.url('access/app/internal/inventoryManagement/addTheScale/factorDefinition?scaleID=' + $scope.model.ID);
            };
            this.service._getQuestionListWithOptions();//获取包含题目选项的题目列表
        },
        //设置
        setting: {
            //模态框
            modal: function (item) {
                $modal.open({
                    templateUrl: 'questionBankController.html',
                    controller: 'questionBankControllerCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        item: function () {
                            return item;
                        },
                        variable: function () {
                            return $scope.model;
                        },
                        service: function () {
                            return questionBank.service;
                        }
                    }
                });
            }
        },
        //服务
        service: {
            //获取包含题目选项的题目列表
            _getQuestionListWithOptions: function () {
                applicationServiceSet.mentalHealthService._InventoryManagement._GetQuestionListWithOptions.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.ID]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.model.itemList = data.Data;
                    }
                });
            },
            //删除题目及选项
            _deleteQuestion: function (item) {
                applicationServiceSet.mentalHealthService._InventoryManagement._DeleteQuestion.send(undefined, [APPMODEL.Storage.getItem('copPage_token'), item.Question.ID]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.error('删除成功');
                        $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
                    }
                });
            },
            //获取单条量表题目信息
            _getQuestionWithOptions: function (id, callBack) {
                applicationServiceSet.mentalHealthService._InventoryManagement._GetQuestionWithOptions.send([APPMODEL.Storage.getItem('copPage_token'), id]).then(function (data) {
                    if (data.Ret == 0) {
                        if (data.Data) {
                            callBack(data.Data);
                        }
                    }
                });
            },
            //新增或修改量表题目并添加选项
            _addOrUpdateQuestionWithOptions: function (params, callBack) {
                applicationServiceSet.mentalHealthService._InventoryManagement._AddOrUpdateQuestionWithOptions.send(params, [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                    if (data.Ret == 0) {
                        callBack();
                    }
                });
            }
        }
    };
    questionBank.init();//入口
}]);
app.controller('questionBankControllerCtrl', ['$scope', 'toastr', '$modalInstance', 'item', 'variable', 'service', function ($scope, toastr, $modalInstance, item, variable, service) {
    $scope.modelCtrl = {
        qid: variable.itemList.length + 1,
        questionStem: undefined,
        status: false,
        itemList: [],
        QuestionType: [{
            name: '单选题型',
            id: 0
        }
        // , {
        //     name: '多选题型',
        //     id: 1
        // }, {
        //     name: '主观题型',
        //     id: 2
        // }, {
        //     name: '投射题型',
        //     id: 3
        // }
        ],
        questionId: undefined,
        SignList: ['A', 'B', 'C', 'D', 'E', 'F', 'J', 'H', 'I', 'G', 'K'],
        copyAnswer: variable.copyAnswer || undefined,
        returnSign: function (item) {
            if (!item) {
                return 'A';
            }
            var Sign = undefined;
            for (var i in this.SignList) {
                if (item.Sign == this.SignList[i]) {
                    Sign = this.SignList[parseInt(i) + 1 == this.SignList.length ? this.SignList.length - 1 : parseInt(i) + 1];
                    break;
                }
            }
            return Sign;
        }
    };
    //单选
    $scope.clickRadio = function (crowd) {
        $scope.modelCtrl.questionId = crowd.id;
        $scope.modelCtrl.status = !$scope.modelCtrl.status;
    };
    //取消
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    //修改
    $scope.modificationModel = function (item) {
        item.State = true;
    };
    //取消修改
    $scope.cancelModel = function (item) {
        item.State = false;
    };
    //删除
    $scope.deleteItem = function (item) {
        $scope.modelCtrl.itemList.splice($scope.modelCtrl.itemList.indexOf(item), 1);
    };
    //新增答案
    $scope.newAnswer = function () {
        if ($scope.modelCtrl.itemList.length > 10) {
            return;
        }
        var item = {
            Content: undefined,
            Score: undefined,
            Sign: $scope.modelCtrl.returnSign($scope.modelCtrl.itemList[$scope.modelCtrl.itemList.length - 1]),
            ID: undefined,
            State: true
        };
        $scope.modelCtrl.itemList.push(item);
    };
    //复制答案
    $scope.copyAnswer = function () {
        variable.copyAnswer = angular.copy($scope.modelCtrl.itemList);
        $scope.modelCtrl.copyAnswer = variable.copyAnswer;
    };
    //粘贴答案
    $scope.pasteAnswer = function () {
        $scope.modelCtrl.itemList = $scope.modelCtrl.copyAnswer;
    };
    //保存
    $scope.save = function () {
        if(!$scope.modelCtrl.qid){
            toastr.error('题号不能为空');
            return;
        }
        if(!$scope.modelCtrl.questionId){
            if($scope.modelCtrl.questionId != 0){
                toastr.error('请选择题型');
                return;
            }
        }
        var params = {
            Question: {
                ID: item ? item.Question.ID : 0,
                ScaleID: variable.ID,
                SeqNo: $scope.modelCtrl.qid,
                QuestionType: $scope.modelCtrl.questionId,
                Title: $scope.modelCtrl.questionStem
            },
            Options: $scope.modelCtrl.itemList
        };
        service._addOrUpdateQuestionWithOptions(params, function () {
            toastr.success('保存成功');
            $modalInstance.dismiss('cancel');
            service._getQuestionListWithOptions();
        });//新增或修改量表题目并添加选项
    };
    if (typeof item === "object") {
        service._getQuestionWithOptions(item.Question.ID, function (data) {
            $scope.modelCtrl.itemList = data.Options;
            $scope.modelCtrl.qid = data.Question.SeqNo;
            $scope.modelCtrl.questionStem = data.Question.Title;
            for (var i in $scope.modelCtrl.QuestionType) {
                if (data.Question.QuestionType == $scope.modelCtrl.QuestionType[i].id) {
                    $scope.modelCtrl.questionId = data.Question.QuestionType;
                    $scope.modelCtrl.QuestionType[i].check = true;
                    break;
                }
            }
        });//获取单条量表题目信息
    }
}]);