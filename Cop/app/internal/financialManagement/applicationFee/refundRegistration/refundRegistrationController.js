/**
 * Created by wangbin on 2016/12/23.
 */
app.controller('refundRegistrationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    var refund;
    function refundFunction() {
        this.init = function () {
            refund.pageData();
            refund.onEvent();
        };
        this.pageData = function () {
            // 分页参数配置
            $scope.pagination = {
                currentPage: 1,
                itemsPerPage: 35, // 默认查询35条
                maxSize: 5,
                totalItems: undefined,
                previousText: "上页",
                nextText: "下页",
                firstText: "首页",
                lastText: "末页"
            };
            // 页面初始化数据
            $scope.pageData  = {
                stuentName: '',
                parentTel:'',
                school:'',
                orderIdContent:'',
                orderId:''
            };
            // 订单列表数据初始化
            $scope.orderlList = [];
        };
        this.onEvent = function () {
            // 模糊查询学校
            $scope.refreshSchool = function (keyword) {
                if (!keyword) return;
                refund.getSchoolList(keyword);
            };
            $scope.search = function () {
                if(!$scope.pageData.school.GID){
                    toastr.error('必须填写学校');
                    return;
                }
                if($scope.pageData.orderIdContent == ''){
                    $scope.pageData.orderId = 0;
                }else {
                    $scope.pageData.orderId = $scope.pageData.orderIdContent;
                }
               refund.getOrderList();
            };
            //选择服务包
            $scope.selectService = function (item) {

            };
            // 退款模态框
            $scope.reFund = function (item) {
                var modalInstance = $modal.open({
                    templateUrl: 'refund.html',
                    // size: 'sm',
                    controller:'refundController',
                    resolve: {
                        items: function () {
                            return item
                        }
                    }
                });
                modalInstance.result.then(function (item) {
                    refund.refundRegist(item);
                }, function () {
                    // 取消时作出操作
                });
            };
            // 更换服务包模态框
            $scope.reService = function (item) {
                refund.getProductList(item);
                var modalInstance = $modal.open({
                    templateUrl: 'reservice.html',
                    // size: 'sm',
                    controller:'reserviceController',
                    resolve: {
                        items: function () {
                            return item
                        }
                    }
                });
                modalInstance.result.then(function (item) {
                    refund.reserviceRegist(item);
                }, function () {
                    // 取消时作出操作
                });
            };
        };
    }
    refundFunction.prototype = {
        // 获取学校列表
        getSchoolList : function (keyword) {
            applicationServiceSet.internalServiceApi.applicationFee.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'),keyword]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.schoolList = data.Data;
                }
            });
        },
        // 获取订单列表
        getOrderList : function () {
            applicationServiceSet.internalServiceApi.applicationFee.GetOrderDetailPage.send([APPMODEL.Storage.getItem('copPage_token'),$scope.pageData.school.GID,$scope.pageData.stuentName,$scope.pageData.parentTel,$scope.pagination.itemsPerPage,$scope.pagination.currentPage,$scope.pageData.orderId]).then(function (data) {
                if (data.Ret == 0) {
                    $.each(data.Data.ViewModelList,function (e,item) {
                        if(item.ST == '1'){
                            item.stName = '未付款';
                        }else if(item.ST == '2'){
                            item.stName = '已付款';
                        }else {
                            item.stName = '已退款';
                        }
                    });
                    $scope.orderlList = data.Data.ViewModelList;
                    $scope.pagination.totalItems = data.Data.TotalRecords;
                    
                }
            });
        },
        // 退款发送
        refundRegist : function (item) {
            applicationServiceSet.chargeServiceApi.chargeService.refundOderAmount.send([item.ID,item.ChargeID,item.money,false,item.Desc]).then(function (data) {
                if (data.Ret == 0) {
                    var num = parseFloat(item.RefundAmount)+parseFloat(item.money);
                    toastr.success('退款成功！');
                    item.RefundAmount = Math.round(num*100)/100;
                    if(item.RefundAmount == item.ProductAmount){
                        item.ST = 3;
                        item.stName = '已退款';
                    }
                }
            });
        },
        // 获取所有服务包
        getProductList : function(item){
            applicationServiceSet.chargeServiceApi.chargeService.GetAllProductList.send([item.ProductID,item.UMID]).then(function (data) {
                if (data.Ret == 0) {
                    item.productInfo = data.Data;
                }
            });
        },
        // 更换服务包
        reserviceRegist : function (item) {
            applicationServiceSet.chargeServiceApi.chargeService.changeProduct.send([item.ID,item.serviceProduct.ID,item.RefundAmount,false,item.Desc]).then(function (data) {
                if (data.Ret == 0) {
                    toastr.success('更换成功！');
                    item.ProductName = item.serviceProduct.Name;
                }
            });
        }
    };
    refund = new refundFunction();
    refund.init();
}]);

// 退款的模态框
app.controller('refundController', ['$scope', '$modalInstance', 'items','toastr',function ($scope, $modalInstance, items,toastr) {
    'use strict';
    $scope.order = items;
    $scope.order.money = undefined;
    $scope.order.Desc = undefined;
    $scope.comfirm = function () {
        var num = parseFloat($scope.order.money) + parseFloat($scope.order.RefundAmount);
        if($scope.order.money == '' || $scope.order.money == undefined){
            toastr.error('请填写正确的退款金额！');
            return;
        }
        if($scope.order.money <= 0 || $scope.order.ProductAmount < (Math.round(num*100)/100)){
            toastr.error('请填写正确的退款金额！');
            return;
        }
        if($scope.order.Desc == undefined || $scope.order.Desc == ''){
            toastr.error('必须填写退款理由！');
            return;
        }
        $modalInstance.close($scope.order);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

// 更换服务包的模态框
app.controller('reserviceController', ['$scope', '$modalInstance', 'items','toastr',function ($scope, $modalInstance, items,toastr) {
    'use strict';
    $scope.order = items;
    $scope.order.serviceProduct = undefined;
    $scope.order.Desc = undefined;
    $scope.comfirm = function () {
        if($scope.order.serviceProduct == undefined || $scope.order.serviceProduct == ''){
            toastr.error('必须选择更换服务包名称！');
            return;
        }
        if($scope.order.Desc == undefined || $scope.order.Desc == ''){
            toastr.error('必须填写更换理由！');
            return;
        }
        $modalInstance.close($scope.order);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);