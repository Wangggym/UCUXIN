/**
 * Created by fanweihua on 2016/12/14.
 * attendanceMachineCreditCardRateController
 * attendance machine credit card rate
 */
app.controller('attendanceMachineCreditCardRateController', ['$compile', '$scope', '$window', function ($compile, $scope, $window) {
    /**
     * 考勤机刷卡率
     * @type {{init: init, creditCardRate: creditCardRate}}
     */
    var attendanceMachineCreditCardRate = {
        /**
         * 入口
         */
        init: function () {
            attendanceMachineCreditCardRate.creditCardRate();//考勤机刷卡率
        },
        /**
         * 考勤机刷卡率
         */
        creditCardRate: function () {
            $scope.openWindowDetailed = function () {
                $window.open('http://112.74.51.208:88/production/ReportServer?reportlet=rpt%2F%5B8003%5D%5B52e4%5D%5B673a%5D%5B5237%5D%5B5361%5D%5B7387%5D.cpt', 'C-Sharpcorner', 'width=900,height=700');
            };
        }
    };
    attendanceMachineCreditCardRate.init();//入口
}]);