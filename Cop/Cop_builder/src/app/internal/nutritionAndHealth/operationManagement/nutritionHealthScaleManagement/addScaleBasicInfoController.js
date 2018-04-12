/**
 * Created by wangbin on 2016/12/14.
 */
app.controller('addScaleBasicInfoController', ['$scope', 'toastr', '$modal', 'applicationServiceSet', '$window','$location', function ($scope, toastr, $modal, applicationServiceSet, $window, $location) {
    'use strict';
    var basicInfo;
    function basicInfoFuncation() {
        this.init = function () {
            basicInfo.pageData();
            basicInfo.onEvent();
            if(sessionStorage.getItem('nutritionScaleId')){
                $scope.subData.scaleId = sessionStorage.getItem('nutritionScaleId');
                basicInfo.getScaleBasicInfo();
            }
        };
        this.pageData  = function () {
            // 页面提交数据初始化
            $scope.subData = {
                scaleId:'',
                scaleName:undefined,
                scaleSource:undefined,
                scaleIntroduce:undefined,
                testNotice:undefined,
                remark:undefined
            };
            $scope.pageData  = {
                title: sessionStorage.getItem('pageTitle'),
                oldSubData:''
            }
        };
        this.onEvent = function () {
            // 点击下一步事件
            $scope.next = function () {
                var state = true;
                $.each($scope.subData,function (e, item) {
                    if(e != 'remark'&& e != 'scaleId' && item == undefined){
                        state = false;
                    }
                });
                if(state == false){
                    toastr.error('还有必填项未填！');
                    return;
                }else {
                    basicInfo.addScaleBasicInfo();
                }
            }
        }
    }
    //  提交问卷基本信息
    basicInfoFuncation.prototype.addScaleBasicInfo = function () {
        applicationServiceSet.internalServiceApi.nutritionHealth.addScaleBasicInfo.send([$scope.subData.scaleId,$scope.subData.scaleName,$scope.subData.scaleSource,$scope.subData.scaleIntroduce,$scope.subData.testNotice,$scope.subData.remark]).then(function (data) {
            if(data.Ret == '0'){
                sessionStorage.setItem('nutritionScaleId',data.Data);
                toastr.success('问卷基本数据保存成功！');
                $location.path('access/app/internal/nutritionHealth/addScaleUserAttribute');
            }
        });
    };
    // 获取问卷基本信息
    basicInfoFuncation.prototype.getScaleBasicInfo = function () {
        applicationServiceSet.internalServiceApi.nutritionHealth.getScaleBasicInfo.send([$scope.subData.scaleId]).then(function (data) {
            if(data.Ret == '0'){
                $scope.subData.scaleName = data.Data.Name;
                $scope.subData.scaleSource = data.Data.Origion;
                $scope.subData.scaleIntroduce = data.Data.Instro;
                $scope.subData.testNotice = data.Data.Notice;
                $scope.subData.remark = data.Data.Remark;
                $scope.pageData.oldSubData = angular.copy($scope.subData);
            }
        });
    };
    basicInfo = new basicInfoFuncation();
    basicInfo.init();
}]);