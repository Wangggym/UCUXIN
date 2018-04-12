/**
 * Created by wangbin on 2016/12/14.
 */
app.controller('addScaleUserAttributeController', ['$scope', 'toastr', '$modal', 'applicationServiceSet', '$window','$location', function ($scope, toastr, $modal, applicationServiceSet, $window ,$location) {
    'use strict';
    var attribute;
    function attributeFunction() {
        this.change = false;
        this.init = function () {
            attribute.pageData();
            attribute.onEvent();
            attribute.getScaleAttribute();
        };
        this.pageData = function () {
            $scope.pageData = {
                ScaleId: sessionStorage.getItem('nutritionScaleId') || '',
                title: sessionStorage.getItem('pageTitle'),
                oldSubData:''
            }
        };
        this.onEvent = function () {
            // 跳转到基本信息
            $scope.prev = function () {
                $location.path('access/app/internal/nutritionScalMannage/addScaleBasicInfo');
            };
            // 跳转到题库
            $scope.next = function () {
                sessionStorage.removeItem('userAttr');
                attribute.addScaleAttribute();
            }
        }
    }
    // 获取用户属性列表
    attributeFunction.prototype.getScaleAttribute = function () {
        applicationServiceSet.internalServiceApi.nutritionHealth.getScaleAttribute.send([$scope.pageData.ScaleId]).then(function (data) {
            if(data.Ret == '0'){
                $scope.userAttrList = data.Data;
                if($scope.pageData.title == '新增问卷' && sessionStorage.getItem('userAttr')){
                    $.each($scope.userAttrList,function (e,item) {
                        if(item.ID == '103829953655010663' || item.ID == '103829953656010437' || item.ID == '103829953656010438' || item.ID == '103829953656010439'){
                            item.IsCheck = true;
                        }else {
                            item.IsCheck = false;
                        }
                    });
                    attribute.change = true;
                }
                $scope.pageData.oldSubData = angular.copy($scope.userAttrList);
            }
        });
    };
    // 增加或者修改用户属性
    attributeFunction.prototype.addScaleAttribute = function () {
        var userAttrList = [];
        var nullData = {};
        $.each($scope.userAttrList,function (e,item) {
            if(item.IsCheck){
                item.ScaID = $scope.pageData.ScaleId;
                item.PropID = item.ID;
                item.ID = 0;
                userAttrList.push(item);
            }
            if(item.IsCheck != $scope.pageData.oldSubData[e].IsCheck){
                attribute.change = true;
            }
        });
        if(userAttrList.length == 0){
            nullData.ID = 0;
            nullData.ScaID = $scope.pageData.ScaleId;
            nullData.PropID = 0;
            userAttrList.push(nullData);
        }
        if(attribute.change == true){
            applicationServiceSet.internalServiceApi.nutritionHealth.addScaleAttribute.send([userAttrList]).then(function (data) {
                if(data.Ret == '0'){
                    toastr.success('用户属性保存成功！');
                    $location.path('access/app/internal/nutritionScalMannage/addScalQuestion');
                }
            });
        }else {
            $location.path('access/app/internal/nutritionScalMannage/addScalQuestion');
        }
    };
    attribute = new attributeFunction();
    attribute.init();
}]);