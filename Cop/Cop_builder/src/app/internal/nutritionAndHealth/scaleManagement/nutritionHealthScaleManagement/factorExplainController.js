/**
 * Created by wangbin on 2016/12/14.
 */
app.controller('factorExplainController', ['$scope', 'toastr', '$modal', 'applicationServiceSet', '$window','$location', function ($scope, toastr, $modal, applicationServiceSet, $window ,$location) {
    'use strict';
    var explain;
    function explainFunction() {
        this.init = function () {
            explain.pageData();
            explain.getFactors();
            explain.getFactorExplain();
            explain.onEvent();
        };
        this.pageData = function () {
            // 页面初始化参数
            $scope.pageData = {
                scaleId: sessionStorage.getItem('nutritionScaleId') || '',
                title: sessionStorage.getItem('pageTitle')
            };
            // 分页参数配置
            $scope.pagination = {
                currentPage: 1,
                itemsPerPage: 100, // 默认查询10条
                maxSize: 5,
                previousText: "上页",
                nextText: "下页",
                firstText: "首页",
                lastText: "末页"
            };
        };
        this.onEvent = function () {
            // 跳转到因子定义
            $scope.prev = function () {
                $location.path('access/app/internal/nutritionScalMannage/addScaleFactor');
            };
            // 添加因子定义
            $scope.addFactorInterpretation = $scope.editFactorInterpretation = function (interpretation) {
                var oldInterpretation = angular.copy(interpretation) || '';
                var modalInstance = $modal.open({
                    templateUrl: 'addFactorInterpretation.html',
                    controller: 'AddFactorInterpretationCtrl',
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return {
                                interpretation: interpretation ? interpretation :  $scope.pageData.scaleId,
                                factor : $scope.factorDataList
                            }
                        }
                    }
                });
                modalInstance.result.then(function (addInterpretationItem) {
                    if (interpretation) {
                        // 如果ID不为0，则表示更新数据库数据
                        if(interpretation.ID){
                            explain.updateFactorExplain(addInterpretationItem);
                        }
                        var sign = interpretation.ID ? 'ID' : 'Sign';
                        for (var i in $scope.interpretationList) {
                            if ($scope.interpretationList[i][sign] === addInterpretationItem[sign]) {
                                $scope.interpretationList.splice(i, 1, addInterpretationItem);
                                return;
                            }
                        }
                    } else {
                        angular.extend(addInterpretationItem, {Sign: $scope.interpretationList.length ? $scope.interpretationList[$scope.interpretationList.length - 1].Sign + 1 : 1, ScaID: $scope.pageData.scaleId});
                        explain.addFactorExplain(addInterpretationItem);
                    }
                }, function () {
                    // 取消时作出操作
                    if(interpretation) angular.extend(interpretation,oldInterpretation);
                });
            };
            // 删除因子解释
            $scope.delFactorInterpretation = function (interpretation) {
                var modalInstance = $modal.open({
                    templateUrl: 'removeConfirm.html',
                    size: 'sm',
                    controller:'RemoveConfirmCtrl',
                    resolve: {
                        items: function () {
                            return {
                                data: interpretation,
                                name: '因子解释'
                            }
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    if(res.ID){
                        explain.deletFactorExplain(res.ID);
                    }
                }, function () {
                    // 取消时作出操作
                });
            };
            // 提交时检测问卷的完整性
            $scope.submitFactorExplain = function () {
                explain.checkScalePerfect();
            };
            // 问卷静态化
            $scope.scaleStatic = function () {
                explain.scaleStatic();
            };
            // 分页查询
            $scope.pageQuery = function () {
                explain.getFactorExplain();
            };
        }
    }
    // 获取因子标题列表
    explainFunction.prototype.getFactors = function () {
        applicationServiceSet.internalServiceApi.nutritionHealth.getScaleFactors.send([$scope.pageData.scaleId]).then(function (data) {
            if(data.Ret == '0'){
                $scope.factorDataList  = data.Data;
            }
        });
    };
    // 获取问卷因子解释清单
    explainFunction.prototype.getFactorExplain = function () {
        applicationServiceSet.internalServiceApi.nutritionHealth.getFactorsExplain.send([$scope.pageData.scaleId,$scope.pagination.currentPage,$scope.pagination.itemsPerPage]).then(function (data) {
            if(data.Ret == '0'){
                $scope.interpretationList = data.Data.ViewModelList;
                $scope.pagination.totalItems = data.Data.TotalRecords;
            }
        });
    };
    // 添加因子解释
    explainFunction.prototype.addFactorExplain = function (explain) {
        applicationServiceSet.internalServiceApi.nutritionHealth.addFactorExplain.send([[explain]]).then(function (data) {
            if(data.Ret == '0'){
                $scope.interpretationList.push(explain);
                toastr.success('提交成功！');
            }
        });
    };
    // 修改因子解释
    explainFunction.prototype.updateFactorExplain = function (item) {
        applicationServiceSet.internalServiceApi.nutritionHealth.updateFactorExplain.send([item.ID,item.ScaID,item.FactorID,item.FactorName,item.MinScore,item.MaxScore,item.Sex,item.MinAge,item.MaxAge,item.Desc]).then(function (data) {
            if(data.Ret == '0'){
                toastr.success('修改成功！');
            }
        });
    };
    // 删除因子解释
    explainFunction.prototype.deletFactorExplain = function (id) {
        applicationServiceSet.internalServiceApi.nutritionHealth.deletFactorExplain.send([id]).then(function (data) {
            if(data.Ret == '0'){
                toastr.success('删除成功！');
                $scope.interpretationList.splice($scope.interpretationList.indexOf(id), 1);
            }
        });
    };
    // 提交时检测问卷的完整性
    explainFunction.prototype.checkScalePerfect = function () {
        applicationServiceSet.internalServiceApi.nutritionHealth.checkScalePerfect.send([$scope.pageData.scaleId]).then(function (data) {
            if(data.Ret == '0'){
                toastr.success('问卷提交成功！');
            }else {
                toastr.error(data.Msg);
            }
        });
    };
    // 问卷静态化
    explainFunction.prototype.scaleStatic = function () {
        applicationServiceSet.internalServiceApi.nutritionHealth.scaleStatic.send([$scope.pageData.scaleId]).then(function (data) {
            if(data.Ret == '0'){
                toastr.success('问卷静态化成功！');
                $location.path('access/app/internal/nutritionScalMannage/scaleList');
            }else {
                toastr.error(data.Msg);
            }
        });
    };
    explain = new explainFunction();
    explain.init();
}]);

// 添加和修改因子解释的模态框
app.controller('AddFactorInterpretationCtrl', ['$scope', '$filter', '$modalInstance', 'items', 'toastr', 'toastrConfig', function ($scope,$filter, $modalInstance, items, toastr, toastrConfig) {
    'use strict';
    // 配置提示消息框
    toastrConfig.preventOpenDuplicates = true;
    $scope.factorList = items.factor;
    $scope.interpretData = {
        ID: 0,
        FactorID: undefined,
        FactorName: undefined,
        ScaID: undefined,
        MinAge: undefined,
        MaxAge: undefined,
        MaxScore: undefined,
        MinScore: undefined,
        Sex: -1,
        Desc: undefined,
        PositiveRule: undefined,
        Age: true
    };
    $scope.$watch('interpretData.Age', function (nv, ov) {
        if (nv){
            $scope.interpretData.MinAge = $scope.interpretData.MaxAge = 0;
        }
    });
    $scope.changeFactor = function () {
        var selected = $filter('propsFilter')($scope.factorList, {ID:$scope.interpretData.FactorID});
        $scope.interpretData.FactorName = selected[0].Name;
    };
    if((typeof items.interpretation) === 'object'){
        if(!items.interpretation.MinAge && !items.interpretation.MinAge){
            $scope.interpretData = angular.extend(items.interpretation,{Age: true});
        }else{
            $scope.interpretData = angular.extend(items.interpretation,{Age: false});
        }
        $scope.addInterpretationTitle = '修改';
    }else {
        $scope.addInterpretationTitle = '新增';
        $scope.interpretData.ScaID = items.interpretation;
    }
    // 提交因子解释
    $scope.confirmInterpret = function () {
        if (!$scope.interpretData.FactorID) {
            toastr.error('请选择因子！');
            return;
        }
        if ($scope.interpretData.MinAge == undefined || $scope.interpretData.MaxAge == undefined) {
            toastr.error('请填写年龄范围！');
            return;
        }else{
            if(($scope.interpretData.MinAge - $scope.interpretData.MaxAge) > 0){
                toastr.error('最小年龄不能大于最大年龄！');
                return;
            }
        }
        if ($scope.interpretData.MinScore == undefined || $scope.interpretData.MaxScore == undefined) {
            toastr.error('请填写得分范围！');
            return;
        }else{
            if(($scope.interpretData.MinScore - $scope.interpretData.MaxScore) > 0){
                toastr.error('最小得分不能大于最大得分！');
                return;
            }
        }
        if (!$scope.interpretData.Desc) {
            toastr.error('请填写因子解释内空！');
            return;
        }
        $modalInstance.close($scope.interpretData);
    };
    $scope.cancelInterpret = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

// 删除因子解释的模态框
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
app.filter('sexFormat', function () {
    return function (value) {
        switch (parseInt(value)){
            case 0:
                return '女';
                break;
            case 1:
                return '男';
                break;
            case -1:
                return '不限';
                break;
        };
    }
});
