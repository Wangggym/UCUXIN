/**
 * Created by wangbin on 2016/12/14.
 */
app.controller('addScaleFactorController', ['$scope', 'toastr', '$modal', 'applicationServiceSet', '$window','$location', function ($scope, toastr, $modal, applicationServiceSet, $window, $location) {
    'use strict';
    var factor;
    function factorFunction() {
        this.init = function () {
            factor.pageData();
            factor.onEvent();
            factor.getFactors();
        };
        this.pageData = function () {
            $scope.pageData = {
                scaleId: sessionStorage.getItem('nutritionScaleId') || '',
                title: sessionStorage.getItem('pageTitle')
            }
        };
        this.onEvent = function () {
            //跳转到因子解释
            $scope.next = function () {
                if($scope.factorList.length == 0){
                    toastr.error('还没有添加因子定义！');
                    return;
                }
                $location.path('access/app/internal/nutritionHealth/factorExplain');
            };
            // 跳转到题库
            $scope.prev = function () {
                $location.path('access/app/internal/nutritionHealth/addScalQuestion');
            };
            // 编辑问题 当参数存在时表示修改
            $scope.addFactorDefinition = $scope.editFactorDefinition = function (item) {
                var oldFactor = angular.copy(item) || '';
                var modalInstance = $modal.open({
                    templateUrl: 'addFactorDefinition.html',
                    controller: 'AddFactorDefinitionCtrl',
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return {
                                target: item ? item : $scope.pageData.scaleId,
                                factorList: $scope.factorList
                            }
                        }
                    }
                });
                modalInstance.result.then(function (addFactorItem) {
                    factor.upDateFactor(addFactorItem);
                }, function () {
                    // 取消时作出操作
                    if(item) angular.extend(item,oldFactor);
                });
            }
            // 删除因子
            $scope.delFactorDefinition = function (factor) {
                var modalInstance = $modal.open({
                    templateUrl: 'removeConfirm.html',
                    size: 'sm',
                    controller:'RemoveConfirmCtrl',
                    resolve: {
                        items: function () {
                            return {
                                data: factor,
                                name: '因子'
                            }
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    applicationServiceSet.internalServiceApi.nutritionHealth.deletFactor.send([res.ID]).then(function (data) {
                        if(data.Ret == '0'){
                            toastr.success('删除成功！');
                            $scope.factorList.splice($scope.factorList.indexOf(res), 1);
                        }
                    });
                }, function () {
                    // 取消时作出操作
                });
            };
        }
    }
    // 获取所有因子
    factorFunction.prototype.getFactors = function () {
        applicationServiceSet.internalServiceApi.nutritionHealth.getScaleFactors.send([$scope.pageData.scaleId]).then(function (data) {
            if(data.Ret == '0'){
                $scope.factorList  = data.Data;
            }
        });
    };
    // 添加和修改因子
    factorFunction.prototype.upDateFactor = function (item) {
        applicationServiceSet.internalServiceApi.nutritionHealth.updateFactors.send([item.ID,item.ScaID,item.LstSqeNo,item.Name,item.Rule,item.Remark,item.StandardScore]).then(function (data) {
            if(data.Ret == '0'){
                toastr.success(item.addFactorTitle);
                factor.getFactors();
            }
        });
    };
    factor = new factorFunction();
    factor.init();
}]);

// 新增因子模态框
app.controller('AddFactorDefinitionCtrl', ['$scope', '$modalInstance', 'items', 'toastr', 'toastrConfig', function ($scope, $modalInstance, items, toastr, toastrConfig) {
    'use strict';
    $scope.factor = {
        ID: 0,
        ScaID: undefined,
        LstSqeNo:undefined,
        Name: undefined,
        StandardScore: 0,
        Rule: undefined,
        Remark: undefined,
        addFactorTitle: undefined
    };
    $scope.factorList = items.factorList;
    // 配置提示消息框
    toastrConfig.preventOpenDuplicates = true;
    if((typeof items.target) === 'object'){
        $scope.factor = items.target;
        $scope.factor.addFactorTitle = '修改成功';
    }else {
        $scope.factor.addFactorTitle = '新增成功';
        $scope.factor.ScaID = items.target;
    }
    $scope.confirm = function () {
        if (!$scope.factor.Name) {
            toastr.error('请填写因子名称！');
            return;
        }
        if (!$scope.factor.Rule) {
            toastr.error('请填写计算公式！');
            return;
        }
        // 新增因子时验证当前因子是否存在
        if($scope.factorList.length && (typeof items.target) !== 'object'){
            for(var i in $scope.factorList){
                if($scope.factorList[i].Name === $scope.factor.Name){
                    toastr.error('因子已存在，请重新定义！');
                    return;
                }
            }
        };
        $scope.factor.Rule =  $scope.factor.Rule.replace(/\s*/g, '');
        var factorRuleIsTrue = function () {
            try{
                return  new Function('return ' + $scope.factor.Rule.replace(/{\d+}/g, 0)).call();
            }catch (error){
                return false;
            }
        };
        if(!/^[+-]?\d+\.?\d*$/.test(factorRuleIsTrue())){
            toastr.error('请填写正确定的因子公式！');
            return;
        }
        $modalInstance.close($scope.factor);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

// 删除因子的摩太框
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
