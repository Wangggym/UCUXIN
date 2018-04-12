/**
 * Created by wangbin on 2016/12/14.
 /**
 */
app.controller('nutritionHealthScaleListController', ['$scope', 'toastr','$location', '$modal', 'applicationServiceSet',  function ($scope, toastr,$location, $modal, applicationServiceSet) {
    'use strict';
    var scaleList;
    function scaleListFunction() {
        this.init = function () {
            this.pageData();
            this.getScaleList();
            this.onEvent();
        };
        this.pageData = function () {
            // 分页参数配置
            $scope.pagination = {
                currentPage: 1,
                itemsPerPage: 20, // 默认查询10条
                maxSize: 5,
                totalItems: undefined,
                previousText: "上页",
                nextText: "下页",
                firstText: "首页",
                lastText: "末页"
            };
            // 选择已发布或者未发布初始化参数
            $scope.checkedA = false;
            $scope.checkedB = false;
            // 查询数据初始化
            $scope.queryData = {
                scaleName:'',
                scaleSource:'',
                state:3
            }
        };
        this.onEvent = function () {
            // 选择已发布
            $scope.statusA = function () {
                if(!$scope.checkedA){
                    $scope.checkedA = false;
                    return;
                }
                $scope.checkedA = true;
                $scope.checkedB = false;
                $scope.queryData.state = 1;
            };
            // 选择未发布
            $scope.statusB = function () {
                if(!$scope.checkedB){
                    $scope.checkedB = false;
                    return;
                }
                $scope.checkedB = true;
                $scope.checkedA = false;
                $scope.queryData.state = 0;
            };
            // 新增问卷跳转
            $scope.addScale = function () {
                sessionStorage.removeItem('nutritionScaleId');
                sessionStorage.setItem('pageTitle','新增问卷');
                // 用户选择默认属性标记
                sessionStorage.setItem('userAttr','true');
                $location.path('access/app/internal/nutritionScalMannage/addScaleBasicInfo');
            };
            // 查询、获取问卷list
            $scope.getScaleList = function () {
                if(!$scope.checkedA && !$scope.checkedB){
                    $scope.queryData.state = 3;
                }
                scaleList.getScaleList();
            };
            // 修改问卷
            $scope.updateScale = function (item) {
                if(item.ST){
                    toastr.error('问卷正在使用中，不能修改！');
                    return;
                }
                sessionStorage.setItem('nutritionScaleId',item.ID);
                sessionStorage.setItem('pageTitle','修改问卷');
                $location.path('access/app/internal/nutritionScalMannage/addScaleBasicInfo');
            };
            // 问卷静态化
            $scope.static = function (item) {
                if(item.ST){
                    toastr.error('问卷正在使用中，不能生成！');
                    return;
                }
                scaleList.checkScalePerfect(item);
            };
            // 问卷撤销或者发布
            $scope.release = function (item) {
                scaleList.judgeUpdateScale(item,item.ST);
            };
            // 删除问卷
            $scope.del =  function (item) {
                if(item.ST){
                    toastr.error('问卷正在使用中，不能删除！');
                    return;
                }
                var modalInstance = $modal.open({
                    templateUrl: 'removeScale.html',
                    size: 'sm',
                    controller:'RemoveScaleCtrl',
                    resolve: {
                        items: function () {
                            return item
                        }
                    }
                });
                modalInstance.result.then(function (item) {
                    scaleList.removeScale(item);
                }, function () {
                    // 取消时作出操作
                });
            };
            // 问卷预览
            $scope.test =  function (item) {
                if(!item.IsProduct){
                    toastr.error('还没有生成问卷，不能测试！');
                    return;
                }
                if(item.Url == null){
                    toastr.error('不存在可用的url，不能测试！');
                    return;
                }
                var modalInstance = $modal.open({
                    templateUrl: 'testScale.html',
                    size: 'sm',
                    controller:'testScaleCtrl',
                    resolve: {
                        items: function () {
                            return item
                        }
                    }
                });
                modalInstance.result.then(function () {
                }, function () {
                    // 取消时作出操作
                });
            };
        }
    }
    // 获取所有问卷
    scaleListFunction.prototype.getScaleList = function () {
        applicationServiceSet.internalServiceApi.nutritionHealth.getScaleList.send([$scope.pagination.currentPage,$scope.pagination.itemsPerPage,$scope.queryData.scaleName,$scope.queryData.scaleSource,$scope.queryData.state]).then(function (data) {
            if(data.Ret == '0'){
                $scope.dataList = data.Data.ViewModelList;
                $scope.pagination.totalItems = data.Data.TotalRecords;
            }
        });
    };
    // 提交时检测问卷的完整性
    scaleListFunction.prototype.checkScalePerfect = function (item) {
        applicationServiceSet.internalServiceApi.nutritionHealth.checkScalePerfect.send([item.ID]).then(function (data) {
            if(data.Ret == '0'){
                if(data.Data.length > 0){
                    toastr.error(data.Data[0]);
                }else {
                    scaleList.scaleStatic(item);
                }
            }
        });
    };
    // 问卷静态化
    scaleListFunction.prototype.scaleStatic = function (item) {
        applicationServiceSet.internalServiceApi.nutritionHealth.scaleStatic.send([item.ID]).then(function (data) {
            if(data.Ret == '0'){
                toastr.success('问卷静态化成功！');
                item.IsProduct = true;
                item.Url = data.Data;
            }else {
                toastr.error(data.Msg);
            }
        });
    };
    // 删除问卷
    scaleListFunction.prototype.removeScale = function (item) {
        applicationServiceSet.internalServiceApi.nutritionHealth.deletScale.send([item.ID]).then(function (data) {
            if(data.Ret == '0'){
                toastr.success('问卷静删除成功！');
                $scope.dataList.splice($scope.dataList.indexOf(item), 1);
                $scope.pagination.totalItems--;
            }else {
                toastr.error(data.Msg);
            }
        });
    };
    // 判断问卷是否能被修改
    scaleListFunction.prototype.judgeUpdateScale = function (item,oldState) {
        applicationServiceSet.internalServiceApi.nutritionHealth.judgeUpdateScale.send([item.ID]).then(function (data) {
            if(data.Ret == '0'){
                if(data.Data == true){
                    scaleList.publishScale(item);
                }else {
                    item.ST = !oldState;
                    toastr.error(data.Msg);
                    return;
                }
            }else {
                toastr.error(data.Msg);
            }
        });
    };
    // 撤销或者发布问卷
    scaleListFunction.prototype.publishScale = function (item) {
        if(item.IsProduct){
            applicationServiceSet.internalServiceApi.nutritionHealth.publishScale.send([item.ID,item.ST]).then(function (data) {
                if(data.Ret == 0){
                    if(item.ST){
                        toastr.success('问卷发布成功！');
                    }else {
                        toastr.success('问卷撤销成功！');
                    }
                }
            });
        }else {
            item.ST = false;
            toastr.error('问卷还没有静态化！');
            return;
        }
    };
    scaleList = new scaleListFunction();
    scaleList.init();
}]);

// 删除问卷的模态框
app.controller('RemoveScaleCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    'use strict';
    $scope.scale = items;
    $scope.comfirm = function () {
        $modalInstance.close($scope.scale);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

// 测试问卷
app.controller('testScaleCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    'use strict';
    $scope.scale = items;
    setTimeout(function () {
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            width: 200,
            height: 200
        });
        qrcode.makeCode($scope.scale.Url+'?data='+encodeURI('pc'));
    }, 100);
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

