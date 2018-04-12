/**
 * Created by fanweihua on 2016/12/14.
 * equipmentOnLineRateController
 * equipment on line rate
 */
app.controller('equipmentOnLineRateController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    /**
     * 设备在线率
     * @type {{init: init, variable: variable, operation: operation, setting, serviceApi}}
     */
    var equipmentOnLineRate = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                schoolList: [],
                selectedGid: undefined,
                itemList: []
            };
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * refresh service get school list
             * @param selectedGid
             */
            $scope.refreshAddresses = function (selectedGid) {
                if (selectedGid) {
                    equipmentOnLineRate.serviceApi.getOrgSchoolPage(selectedGid);//get school org pages list
                }
            };
            /**
             * 选择学校
             */
            $scope.changeGid = function () {
                $scope.search();
            };
            /**
             * 查询
             */
            $scope.search = function () {
                equipmentOnLineRate.serviceApi.getEquipmentOnlineList();//硬件在线率报表,当在线率低于90%的时候红色预警
            };
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 数据处理
                 * @param data
                 */
                dataHandle: function (data) {
                    for (var i in data) {
                        if (parseFloat(data[i].OnlineRate) < 90) {
                            data[i].color = "red";
                        }
                    }
                    $scope.model.itemList = data;
                }
            };
        })(),
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * get school org pages list
                 * @param selectedGid
                 */
                getOrgSchoolPage: function (selectedGid) {
                    applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList = data.Data;
                        }
                    });
                },
                /**
                 * 硬件在线率报表,当在线率低于90%的时候红色预警
                 */
                getEquipmentOnlineList: function () {
                    applicationServiceSet.internalServiceApi.schoolEquipment.GetEquipmentOnlineList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            equipmentOnLineRate.setting.dataHandle(data.Data);//数据处理
                        }
                    });
                }
            }
        })()
    };
    equipmentOnLineRate.init();//函数入口
}]);