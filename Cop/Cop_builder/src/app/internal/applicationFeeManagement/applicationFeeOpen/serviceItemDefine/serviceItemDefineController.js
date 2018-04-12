/**
 * Created by fanweihua on 2016/8/18.
 * serviceItemDefineController
 * service items define
 */
app.controller('serviceItemDefineController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    var serviceItemDefine = {
        init: function () {
            this.getServiceItemList();//get service items list
        },
        /**
         * get service items list
         */
        getServiceItemList: function () {
            applicationServiceSet.chargeServiceApi.chargeService.GetFuncAppList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                if (data.Ret == 0) {
                    serviceItemDefine.serviceList(data.Data);
                }
            });
        },
        /**
         * service list
         * @param data
         */
        serviceList: function (data) {
            for (var i in data) {
                data[i].visible = true;
            }
            $scope.serviceList = data;
            this.operation();//service list operation
        },
        /**
         * service list operation
         */
        operation: function () {
            /**
             * edit
             * @param service
             */
            $scope.editList = function (service) {
                service.waiting = true;
                service.visible = false;
                var inputDesc = "<input class='form-control' id='" + service.ID + "' value='" + service.Desc + "' ng-model='serviceDesc'>";
                $("span[data-desc='" + service.ID + "']").hide().parent().append(inputDesc);
            };
            /**
             * cancel
             * @param service
             */
            $scope.cancel = function (service) {
                service.waiting = false;
                service.visible = true;
                $("input[id='" + service.ID + "']").remove();
                $("span[data-desc='" + service.ID + "']").show();
            };
        }
    };
    serviceItemDefine.init();//init function
}]);