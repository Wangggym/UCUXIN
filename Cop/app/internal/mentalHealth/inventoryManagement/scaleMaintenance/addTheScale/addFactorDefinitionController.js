/**
 * Created by fanweihua on 2017/7/19.
 * 定义因子内容
 */
app.controller('addFactorDefinitionController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var addFactorDefinition = {
        //入口
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
            if($stateParams.factorID){
                this.getDetail();  //如果带有id，则获取默认数据
            }
        },
        getDetail:function () {
            applicationServiceSet.mentalHealthService._InventoryManagement._GetFactorWithRuleAndDescription.send([APPMODEL.Storage.getItem('copPage_token'),$stateParams.factorID]).then(function (data) {
                if(data.Ret == 0){
                    var s = data.Data;
                    $scope.model.factorName = s.Factor.Name;
                    $scope.model.Remark = s.Factor.Remark;
                    //因子规则
                    s.FactorRuleModelList.forEach(function (t) {
                        var a = {
                            ID: t.ID,
                            gender: t.Sex,
                            MinAge: t.MinAge,
                            MaxAge: t.MaxAge,
                            calculate: t.Rule,
                            genderName:""
                        };
                        if (a.gender == -1) {
                            a.genderName = '无';
                        } else if (a.gender == 0) {
                            a.genderName = '女';
                        } else if (a.gender == 1) {
                            a.genderName = '男';
                        } else {
                            a.genderName = '无';
                        }
                        a.age = a.MinAge + '~' + a.MaxAge;
                        $scope.model.factorRulesList.push(a);
                    });
                    //因子解释
                    s.FactorDescModelList.forEach(function (t) {
                        var arr = t.FactorDescAttrs.map(function (t2) {
                            var b = {
                                ID:t2.ID,
                                PsyAreaID:t2.PsyAttrID,
                                Name:t2.PsyAttrName
                            };
                            return b;

                        });
                        //因子属性展示
                        var factorProperty = arr.map(function (t) {
                           return t.Name
                        });
                        var a = {
                            MinScore: t.FactorDesc.MinScore,
                            MaxScore: t.FactorDesc.MaxScore,
                            gender : t.FactorDesc.Sex,
                            MinAge: t.FactorDesc.MinAge,
                            MaxAge: t.FactorDesc.MaxAge,
                            factorExplain: t.FactorDesc.Description,
                            IsAnomaly: t.FactorDesc.IsAnomaly,
                            IsAnomalyName:t.FactorDesc.IsAnomaly == true ? "是":"否",
                            reasonList:arr,
                            factorProperty:factorProperty.join(",")
                        };
                        if (a.gender == -1) {
                            a.genderName = '不限';
                        } else if (a.gender == 0) {
                            a.genderName = '女';
                        } else if (a.gender == 1) {
                            a.genderName = '男';
                        } else {
                            a.genderName = '不限';
                        }
                        a.ageRange = a.MinAge + '~' + a.MaxAge;
                        a.scoreRange = a.MinScore + '~' + a.MaxScore;

                        $scope.model.factorExplainList.push(a);
                    });
                }
            })
        },
        //变量声明
        variable: function () {
            $scope.model = {
                factorName: undefined,//因子名称
                Remark:"",//备注
                factorRulesList: [],//因子计算规则列表
                factorExplainList: [],//因子解释规则列表
            };
        },
        //操作
        operation: function () {
            //新增因子计算规则
            $scope.addFactorRules = function () {
                this.setting.modal();//新增因子计算规则模态框
            }.bind(this);
            $scope.editFactorRules = function (item,index) {
                // if(!item.calculate){
                //     toastr.error('请填写完整111');
                //     return;
                // }
                if(!item.gender && !item.MinAge && !item.MaxAge && !item.calculate){
                    toastr.error('请填写完整');
                    return;
                }
                this.setting.modal(item,index);//编辑因子计算规则模态框
            }.bind(this);
            //新增因子解释
            $scope.addExplain = function () {
                this.setting.modalExplain();//新增因子解释模态框
            }.bind(this);
            $scope.editExplain = function (item,index) {
                this.setting.modalExplain(item,index);//编辑因子解释模态框
            }.bind(this);

            //取消
            $scope.cancel = function () {
                $location.url('access/app/internal/inventoryManagement/addTheScale/factorDefinition');
            };
            $scope.deleteMine = function (item,index) {
              $scope.model.factorRulesList.splice(index,1);
            };
            $scope.deleteExplain = function (item,index) {
                $scope.model.factorExplainList.splice(index,1);
            };
            // 保存
            $scope.onSaveFactor = function () {
                $scope.submit = {
                    Factor:{
                        ID:$stateParams.factorID ? $stateParams.factorID : 0,
                        ScaleID:APPMODEL.Storage.getItem('scaleID'),
                        Name:$scope.model.factorName,
                        Remark:$scope.model.Remark,
                    },
                    FactorRuleModelList:[],
                    FactorDescModelList:[]
                };
                if($scope.model.factorRulesList.length == 0){
                    toastr.error("请添加因子规则");
                    return;
                }
                if($scope.model.factorExplainList.length == 0){
                    toastr.error("请添加因子解释");
                    return;
                }
                $scope.model.factorRulesList.forEach(function (t) {
                    var a = {
                        ID: t.ID,
                        Sex: t.gender,
                        MinAge: t.MinAge,
                        MaxAge: t.MaxAge,
                        Rule: t.calculate
                    };
                    $scope.submit.FactorRuleModelList.push(a);
                })
                $scope.model.factorExplainList.forEach(function (t) {
                    var arr = t.reasonList.map(function (t2) {
                       var b = {
                           ID:t2.ID,
                           PsyAttrID:t2.PsyAreaID,
                           PsyAttrName:t2.Name
                       };
                       return b;

                    });
                    var a = {
                        FactorDesc:{
                            MinScore: t.MinScore,
                            MaxScore: t.MaxScore,
                            Sex: t.gender,
                            MinAge: t.MinAge,
                            MaxAge: t.MaxAge,
                            Description: t.factorExplain,
                            IsAnomaly: t.IsAnomaly
                        },
                        FactorDescAttrs:arr
                    };
                    $scope.submit.FactorDescModelList.push(a);
                })
                applicationServiceSet.mentalHealthService._InventoryManagement._AddOrUpdateFactorWithRuleAndDescription.send($scope.submit,[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                    if(data.Ret == 0){
                        toastr.success("保存成功");
                        $location.url('access/app/internal/inventoryManagement/addTheScale/factorDefinition');
                    }
                })
            }
        },
        //服务
        service: {},
        //设置
        setting: {
            //新增因子计算规则模态框
            modal: function (item,index) {
                $modal.open({
                    templateUrl: 'factorRulesController.html',
                    controller: 'factorRulesControllerCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        item: function () {
                            return item;
                        },
                        setting: function () {
                            return addFactorDefinition.setting
                        },
                        index:function () {
                            return index;
                        }
                    }
                });
            },
            //因子计算规则列表
            factorRulesList: function (item,index, callBack) {
                if (item.gender == -1) {
                    item.genderName = '无';
                } else if (item.gender == 0) {
                    item.genderName = '女';
                } else if (item.gender == 1) {
                    item.genderName = '男';
                } else {
                    item.genderName = '无';
                }
                item.age = item.MinAge + '~' + item.MaxAge;
                if(!index && index !== 0){
                    $scope.model.factorRulesList.push(item);
                }else {
                    $scope.model.factorRulesList[index] = item;
                }
                callBack();
            },
            modalExplain:function (item,index) {
                $modal.open({
                    templateUrl: 'factorExplainController.html',
                    controller: 'factorExplainControllerCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        item: function () {
                            return item;
                        },
                        setting: function () {
                            return addFactorDefinition.setting
                        },
                        index:function () {
                            return index;
                        }
                    }
                });

            },
            //因子解释列表
            factorExplainList: function (item,index, callBack) {
                if (item.gender == -1) {
                    item.genderName = '不限';
                } else if (item.gender == 0) {
                    item.genderName = '女';
                } else if (item.gender == 1) {
                    item.genderName = '男';
                } else {
                    item.genderName = '不限';
                }
                item.ageRange = item.MinAge + '~' + item.MaxAge;
                item.scoreRange = item.MinScore + '~' + item.MaxScore;
                item.factorProperty = item.reasonList.map(function (t) { return t.Name }).join(",");
                if(!index && index !== 0){
                    $scope.model.factorExplainList.push(item);
                }else {
                    $scope.model.factorExplainList[index] = item;
                }
                callBack();
            },
        }
    };
    addFactorDefinition.init();//入口
}]);
//新增或修改因子计算规则模态框
app.controller('factorRulesControllerCtrl', ['$scope', 'toastr', '$modalInstance', 'item', 'setting','index', function ($scope, toastr, $modalInstance, item, setting,index) {
    $scope.modelGender = {
        genderList: [{
            id: -1,
            name: '无'
        }, {
            id: 0,
            name: '女'
        }, {
            id: 1,
            name: '男'
        }]
    };
    if(item){
        var temp = $.extend(true,{},item);
        $scope.modelRules = item;
        $scope.modelGender.genderList.forEach(function (t) {
            if(t.id == $scope.modelRules.gender){
                t.check = true;
            }
        });
        //取消
        $scope.factorRulesClose = function () {
            $scope.modelRules = item = temp;
            setting.factorRulesList($scope.modelRules,index, function () {
                $modalInstance.dismiss('cancel');
            });
        };
    }else{
        $scope.modelRules = {
            gender: undefined,
            MinAge: undefined,//最小年龄
            MaxAge: undefined,//最大年龄
            calculate: undefined//计算公式
        };
        //取消
        $scope.factorRulesClose = function () {
            $modalInstance.dismiss('cancel');
        };
    }
    //保存
    $scope.factorRulesSave = function () {
        if($scope.modelRules.MaxAge === "" || $scope.modelRules.MinAge === ""){
            toastr.error('请填写完整');
            return;
        }
        for(var a in $scope.modelRules ){
            if($scope.modelRules[a] == undefined){
                toastr.error('请填写完整');
                return;
            }
        }
        setting.factorRulesList($scope.modelRules,index, function () {
            $modalInstance.dismiss('cancel');
        });
    };
    //性别选择
    $scope.clickRadioRule = function (rule) {
        rule.check = !rule.check;
        $scope.modelRules.gender = rule.id;
    };

}]);
//新增修改因子解释modal
app.controller('factorExplainControllerCtrl', ['$scope', 'toastr', '$modalInstance', 'item', 'setting','applicationServiceSet','index', function ($scope, toastr, $modalInstance, item, setting,applicationServiceSet,index) {
    //获取所有心理属性
    //修改
    if(item){
        var temp = $.extend(true,{},item);
        $scope.modelRules = item;
        $scope.IsAnomalyList = [{
            value:true,
            label:"是"
        },{
            value:false,
            label:"否"
        }];
        $scope.modelGender = {
            genderList: [{
                id: -1,
                name: '无'
            }, {
                id: 0,
                name: '女'
            }, {
                id: 1,
                name: '男'
            }]
        };
        $scope.IsAnomalyList.forEach(function (t) {
            if(t.value == $scope.modelRules.IsAnomaly){
                t.check = true;
            }
        });
        $scope.modelGender.genderList.forEach(function (t) {
            if(t.id == $scope.modelRules.gender){
                t.check = true;
            }
        });
        //保存
        $scope.factorExplainRulesSave = function () {
            if($scope.modelRules.MaxAge === "" || $scope.modelRules.MinAge === "" || $scope.modelRules.MaxScore === "" || $scope.modelRules.MinScore === ""){
                toastr.error('请填写完整');
                return;
            }
            for(var a in $scope.modelRules ){
                if($scope.modelRules[a] == undefined || !$scope.modelRules.factorExplain){
                    toastr.error('请填写完整');
                    return;
                }
            }

            setting.factorExplainList($scope.modelRules,index, function () {
                $modalInstance.dismiss('cancel');
            });
        };
        //取消
        $scope.factorRulesClose = function () {
            $scope.modelRules = item = temp;

            setting.factorExplainList($scope.modelRules,index, function () {
                $modalInstance.dismiss('cancel');
            });
        };
    }else{
        //新增
        $scope.modelRules = {
            gender: undefined,
            MinAge: undefined,//最小年龄
            MaxAge: undefined,//最大年龄
            MinScore: undefined,//最小分
            MaxScore:undefined,//最大分
            IsAnomaly:undefined,//是否异常
            factorExplain:"",//因子解释
            reasonList:[]//因子属性
        };
        $scope.IsAnomalyList = [{
            value:true,
            label:"是"
        },{
            value:false,
            label:"否"
        }];
        $scope.modelGender = {
            genderList: [{
                id: -1,
                name: '无'
            }, {
                id: 0,
                name: '女'
            }, {
                id: 1,
                name: '男'
            }]
        };
        //保存
        $scope.factorExplainRulesSave = function () {
            for(var a in $scope.modelRules ){
                if($scope.modelRules[a] == undefined){
                    toastr.error('请填写完整');
                    return;
                }
            }
            if(!$scope.modelRules.factorExplain){

                toastr.error('请填写完整');
                return;
            }
            setting.factorExplainList($scope.modelRules,index, function () {
                $modalInstance.dismiss('cancel');
            });
        };

        //取消
        $scope.factorRulesClose = function () {
            $modalInstance.dismiss('ok');
        };
    }

    applicationServiceSet.mentalHealthService._PsychologicalAttribute._GetPsyAttrList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
        if(data.Ret == 0){
            $scope.factorReasnList = data.Data;
            $scope.factorReasnList.forEach(function (t) {
                $scope.modelRules.reasonList.forEach(function (t2) {
                    if(t.PsyAreaID == t2.PsyAreaID){
                        t.check = true;
                    }
                })
            });
        }
    });
    //性别选择
    $scope.clickRadioRule = function (rule) {
        // rule.check = !rule.check;
        $scope.modelRules.gender = rule.id;
    };
    //因子选择
    $scope.clickRadioReason = function (rule,index) {
        if(!rule.check){
            $scope.modelRules.reasonList.push(rule);
        }else{
            $scope.modelRules.reasonList = $scope.modelRules.reasonList.filter(function (t) { return t.PsyAreaID !== rule.PsyAreaID })
        }
        rule.check = !rule.check;
    };

    //异常选择
    $scope.clickRadioIsAnomaly = function (rule) {
        rule.check = !rule.check;
        $scope.modelRules.IsAnomaly = rule.value;
        $scope.modelRules.IsAnomalyName = rule.label;
    };


}]);