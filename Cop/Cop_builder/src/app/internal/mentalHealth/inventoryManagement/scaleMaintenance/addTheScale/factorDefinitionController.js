/**
 * Created by fanweihua on 2017/7/19.
 * 因子定义
 */
app.controller('factorDefinitionController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var factorDefinition = {
        //入口
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
        },
        //变量声明
        variable: function () {
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
            //新增或编辑因子
            $scope.newEditFactor = function (item) {
                var url = 'access/app/internal/inventoryManagement/addTheScale/addFactorDefinition';
                $location.url(item ? url + '?factorID=' + item.ID : url);
            };
            //删除
            $scope.deleteMine = function (item) {
                this.service._deleteFactor(item);//删除因子及规则、解释、心理属性标签
            }.bind(this);
            this.service._getFactorList();//获取因子列表
            $scope.publishFactor = function () {
                this.service._SetScalePublishStatus(true);
            }.bind(this);
            $scope.submitFactor = function () {
                this.service._SetScalePublishStatus(false);
            }.bind(this);
        },
        //服务
        service: {
            //获取因子列表
            _getFactorList: function () {
                applicationServiceSet.mentalHealthService._InventoryManagement._GetFactorList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.ID]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.model.itemList = data.Data;
                    }
                });
            },
            //删除因子及规则、解释、心理属性标签
            _deleteFactor: function (item) {
                applicationServiceSet.mentalHealthService._InventoryManagement._DeleteFactor.send(undefined, [APPMODEL.Storage.getItem('copPage_token'), item.ID]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success('删除成功');
                        $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
                    }
                });
            },
            //提交，发布
            _SetScalePublishStatus:function (publish) {
                applicationServiceSet.mentalHealthService._InventoryManagement._SetScalePublishStatus.send(undefined,[APPMODEL.Storage.getItem("copPage_token"),APPMODEL.Storage.getItem("scaleID"),publish]).then(function (data) {
                    if(data.Ret == 0){
                        $state.go('access.app.internal.inventoryManagement.scaleMaintenance')
                    }
                })
            }
        }
    };
    factorDefinition.init();//入口
}]);