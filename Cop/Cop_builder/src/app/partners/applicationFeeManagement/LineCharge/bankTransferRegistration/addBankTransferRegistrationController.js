/**
 * Created by fanweihua on 2016/9/7.
 * addBankTransferRegistrationController
 * add bank transfer registration
 */
app.controller('addBankTransferRegistrationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet) {
    /**
     * add bank transfer registration function entrance
     */
    var addBankTransferRegistration = (function () {
        /**
         * init function
         */
        var init = function () {
            initialization();//initialization
        };
        /**
         * initialization
         */
        var initialization = function () {
            /**
             * function init
             */
            var init = function () {
                variable();//variable declaration
                controls.timeData();//time controls
                serviceApi.getOrgSchoolPage();//get school org pages list
                operation.basic();//operation
            };
            /**
             * variable declaration
             */
            var variable = function () {
                $scope.model = {
                    partnerID: undefined,
                    partnerName: undefined,
                    selectedGid: undefined,
                    amount: undefined,
                    date: undefined,
                    payCenterOrderNo: undefined,
                    remark: undefined,
                    schoolList: []
                };
                var org = JSON.parse(APPMODEL.Storage.getItem("copPage_orgid"));
                $scope.model.partnerName = org.OrgName;
                $scope.model.partnerID = org.OrgID;
            };
            /**
             * service aggregate
             * @type {{getOrgSchoolPage: getOrgSchoolPage, confirmbankTra: confirmbankTra}}
             */
            var serviceApi = {
                /**
                 * get school org pages list
                 */
                getOrgSchoolPage: function () {
                    applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList = data.Data;
                        }
                    });
                },
                /**
                 * bank transfer
                 */
                confirmbankTra: function () {
                    applicationServiceSet.parAppServiceApi.LineCharge.ConfirmbankTra.send([$scope.model.partnerID, $scope.model.selectedGid, $scope.model.amount, operation.dateChange($scope.model.date), $scope.model.payCenterOrderNo, $scope.model.remark]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("保存成功");
                            $location.path("/access/app/partner/LineCharge/bankTransferRegistration");
                        }
                    });
                }
            };
            /**
             * operation
             * @type {{basic: basic, dateChange: dateChange, tip: tip}}
             */
            var operation = {
                basic: function () {
                    $scope.save = function () {
                        serviceApi.confirmbankTra();//bank transfer
                    };
                },
                /**
                 * date change
                 * @param date
                 * @returns {string}
                 */
                dateChange: function (date) {
                    var isEffective = date instanceof Date ? true : false;
                    if (isEffective) {
                        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                    } else {
                        return date;
                    }
                },
                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                }
            };
            /**
             * plug-in unit
             * @type {{timeData: timeData}}
             */
            var controls = {
                /**
                 * time controls
                 */
                timeData: function () {
                    $scope.today = function () {
                        var date = new Date();
                        $scope.model.date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                    };
                    $scope.today();
                    $scope.clear = function () {
                        $scope.dt = null;
                    };
                    // Disable weekend selection
                    $scope.disabled = function (date, mode) {
                        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
                    };
                    $scope.toggleMin = function () {
                        $scope.minDate = $scope.minDate ? null : new Date();
                    };
                    $scope.toggleMin();
                    $scope.openStart = function ($event) {
                        $scope.openedOver = false;
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.openedStart = true;
                    };
                    $scope.openOver = function ($event) {
                        $scope.openedStart = false;
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.openedOver = true;
                    };
                    $scope.dateOptions = {
                        formatYear: 'yy',
                        startingDay: 1,
                        class: 'datepicker'
                    };
                    $scope.initDate = new Date('2016-15-20');
                    $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
                    $scope.format = $scope.formats[1];
                }
            };
            init();//function init
        };
        /**
         * return
         */
        return {
            init: init
        };
    })();
    addBankTransferRegistration.init();//add bank transfer registration function entrance
}]);