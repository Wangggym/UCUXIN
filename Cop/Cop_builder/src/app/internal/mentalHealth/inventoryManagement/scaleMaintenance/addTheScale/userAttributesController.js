/**
 * Created by fanweihua on 2017/7/13.
 * 用户属性
 */
app.controller('userAttributesController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var userAttributes = {
        //入口
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
        },
        //变量声明
        variable: function () {
            $scope.model = {
                ID: undefined,
                itemList: [],
                propList: [],
                propIDList: []
            };
            if ($stateParams.scaleID || APPMODEL.Storage.getItem("scaleID")) {
                $scope.model.ID = $stateParams.scaleID || APPMODEL.Storage.getItem("scaleID");
                this.service.__getScaleUserPropList();//获取量表已选用户属性列表
            }
        },
        //操作
        operation: function () {
            //上一步
            $scope.goBack = function () {
                $location.url('access/app/internal/inventoryManagement/addTheScale/basicInformation?scaleID=' + $scope.model.ID);
            };
            //下一步
            $scope.next = function () {
                // for (var i in $scope.model.itemList) {
                //     if ($scope.model.itemList[i].check) {
                //         $scope.model.propIDList.push($scope.model.itemList[i].ID);
                //     }
                // }
                $scope.model.propIDList = [];
                $scope.model.itemList.forEach(function (e, i) {
                   if(e.check){
                       $scope.model.propIDList.push(e.ID)
                   }
                });
                if ($scope.model.propIDList.length == 0) {
                    toastr.error('请选择用户属性');
                    return;
                }
                this.service.__addScaleUserPropFirstClear();//清除后批量新增量表已选用户属性
            }.bind(this);
            //选择用户属性
            $scope.clickItem = function (item) {
                item.check = !item.check;
                // if(item.check){
                //     $scope.model.propIDList.push(item)
                // }
                console.log($scope.model.propList)
            };
        },
        //服务集合
        service: {
            //获取量表用户属性库列表
            _getScalePropertyList: function () {
                applicationServiceSet.mentalHealthService._InventoryManagement._GetScalePropertyList.send(APPMODEL.Storage.getItem('copPage_token')).then(function (data) {
                    if (data.Ret == 0) {
                        userAttributes.setting.dataHandle(data.Data);
                    }
                });
            },
            //获取量表已选用户属性列表
            __getScaleUserPropList: function () {
                applicationServiceSet.mentalHealthService._InventoryManagement._GetScaleUserPropList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.ID]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.model.propList = data.Data.Props;
                        console.log(data.Data.Props);
                        this._getScalePropertyList();//获取量表用户属性库列表
                    }
                }.bind(this));
            },
            //清除后批量新增量表已选用户属性
            __addScaleUserPropFirstClear: function () {
                applicationServiceSet.mentalHealthService._InventoryManagement._AddScaleUserPropFirstClear.send([$scope.model.ID, $scope.model.propIDList], APPMODEL.Storage.getItem('copPage_token')).then(function (data) {
                    if (data.Ret == 0) {
                        $location.url('access/app/internal/inventoryManagement/addTheScale/questionBank?scaleID=' + $scope.model.ID);
                    }
                });
            }
        },
        //服务
        setting: {
            //数据处理
            dataHandle: function (data) {
                $scope.model.propList.forEach(function (item, index) {
                   data.forEach(function (e,i) {
                       if(item == e.ID){
                           e.check = true;
                       }
                   })
                });
                $scope.model.itemList = data;
            }
        }
    };
    userAttributes.init();
}]);