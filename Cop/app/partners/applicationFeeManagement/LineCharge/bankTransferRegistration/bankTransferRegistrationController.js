/**
 * Created by fanweihua on 2016/9/6.
 * bankTransferRegistrationController
 * bank transfer registration
 */
app.controller('bankTransferRegistrationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet) {
    /**
     * bank transfer registration object
     */
    var bankTransferRegistration = (function () {
        /**
         * function init
         */
        var init = function () {
            variable();//variable declaration
            serviceApi.getOrgSchoolPage();//get school org pages list
            operation.basic();//search bank transfer registration list
        };
        /**
         * variable declaration
         */
        var variable = function () {
            $scope.queryFields = {
                selectedGid: undefined
            };
            $scope.formPackDisabled = true;
            $scope.itemList = [];
            $scope.orgidModel = APPMODEL.Storage.getItem("orgid");
        };
        /**
         * service aggregate
         * @type {{getOrgSchoolPage: getOrgSchoolPage, getBankTraList: getBankTraList}}
         */
        var serviceApi = {
            /**
             * get school org pages list
             */
            getOrgSchoolPage: function () {
                applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.schoolList = data.Data;
                        var school = {
                            FName: "所有",
                            ID: 0
                        };
                        $scope.schoolList.unshift(school);
                    }
                });
            },
            /**
             * get bank list
             */
            getBankTraList: function () {
                applicationServiceSet.parAppServiceApi.LineCharge.GetBankTraList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid"), $scope.queryFields.selectedGid]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.itemList = data.Data;
                    }
                });
            }
        };
        /**
         * operation
         * @type {{basic: basic}}
         */
        var operation = {
            basic: function () {
                /**
                 * school change get gid
                 */
                $scope.changeGid = function () {
                    $scope.formPackDisabled = false;
                    $scope.search();//search bank transfer registration list
                };
                /**
                 * delete school choice
                 */
                $scope.deleteSelectedGid = function () {
                    $scope.formPackDisabled = true;
                    $scope.queryFields.selectedGid = undefined;
                    $scope.itemList = [];
                };
                /**
                 * search bank transfer registration list
                 */
                $scope.search = function () {
                    serviceApi.getBankTraList();//get bank list
                };
                $scope.search();//search bank transfer registration list
            }
        };
        /**
         * return init
         */
        return {
            init: init
        };
    })();
    bankTransferRegistration.init();//bank transfer registration object function init
}]);