/**
 * Created by xj on 2018/1/17.
 */
app.controller('classReportController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {

    var ClassReport = {
        /**
         * function init
         */
        init: function () {
            this.variable();
            this.serviceApi.getProvinceList();
            this.operation.basic();
        },
        /**
         * basic variable
         */
        variable: function () {
            $scope.model = {
                reportList: [],
                province: undefined,//省
                provinceList: [],//省list
                city: undefined,//市
                cityList: [],//市list
                county: undefined,//县
                countyList: [],//县list
                rid:null,
                keyword:null,
                json: 'internal/applicationFeeManagement/paymentTableSearch/paymentBySchoolStatistics/city.json',
                dateStart: null,
                dateOver: null
            }
        },
        /**
         * service gather
         */
        serviceApi: (function () {
            return {
                /**
                 * get province list
                 */
                getProvinceList: function () {
                    $http.get($scope.model.json).success(function (data) {

                        $scope.model.provinceList = data;
                    })
                },
                /**
                 * get city list
                 * @param provinceId
                 */
                getCityList: function (provinceId) {
                    $http.get($scope.model.json).success(function (data) {
                        for (var i in data) {
                            if (data[i].id == provinceId) {
                                $scope.model.cityList = data[i].sub;
                                break;
                            }
                        }
                    })
                },
                /**
                 * get county list
                 * @param cityId
                 */
                getCountyList: function (cityId) {
                    $http.get($scope.model.json).success(function (data) {
                        for (var i in data) {
                            if (data[i].id == $scope.model.province) {
                                for (var s in data[i].sub) {
                                    if (data[i].sub[s].id == cityId) {
                                        $scope.model.countyList = data[i].sub[s].sub;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    })
                },
                /**
                 * 班级圈发帖统计
                 */
                getClassReport: function () {
                    $scope.dateStart = ClassReport.operation.dateChange($scope.model.dateStart) || null;
                    $scope.dateOver = ClassReport.operation.dateChange($scope.model.dateOver) || null;
                    $scope.model.rid = $scope.model.county || $scope.model.city || $scope.model.province || null;
                    $scope.keyword = $scope.keyword || null;
                    applicationServiceSet.internalServiceApi.friendCircle.GetClassRpt.send([APPMODEL.Storage.getItem('copPage_token'),$scope.dateStart,$scope.dateOver, $scope.model.rid, $scope.model.keyword]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.reportList = data.Data;
                        }
                    });
                }
            }
        })(),
        /**
         * basic operation
         */
        operation: (function () {
            return {
                /**
                 * basic operation
                 */
                basic: function () {
                    /**
                     * change province
                     * @param provinceId
                     */
                    $scope.province = function (provinceId) {
                        // console.log(provinceId);
                        ClassReport.serviceApi.getCityList(provinceId);//get city list
                        $scope.model.city = undefined;
                        $scope.model.county = undefined;
                    };
                    /**
                     * change city
                     * @param cityId
                     */
                    $scope.selectCity = function (cityId) {
                        console.log(cityId);
                        ClassReport.serviceApi.getCountyList(cityId);//get county list
                        $scope.model.county = undefined;
                    };
                    /**
                     * delete province
                     */
                    $scope.deleteProvince = function () {
                        $scope.model.province = undefined;
                        $scope.model.city = undefined;
                        $scope.model.county = undefined;
                    };
                    /**
                     * delete city
                     */
                    $scope.deleteCity = function () {
                        $scope.model.city = undefined;
                        $scope.model.county = undefined;
                    };
                    /**
                     * search
                     */
                    $scope.search = function () {
                        $scope.model.rid = $scope.model.county || $scope.model.city || $scope.model.province || null;
                        if(!$scope.model.rid){
                            toastr.error("请选择查询区域");
                            return;
                        }
                        if(!$scope.model.dateStart || !$scope.model.dateOver){
                            toastr.error("请选择查询时间");
                            return;
                        }
                        ClassReport.serviceApi.getClassReport();//get school pay information statistic
                    };
                    /**
                     * 导出
                     */
                    $scope.export = function () {
                        $scope.model.rid = $scope.model.county || $scope.model.city || $scope.model.province || null;
                        $scope.dateStart = ClassReport.operation.dateChange($scope.model.dateStart) || null;
                        $scope.dateOver = ClassReport.operation.dateChange($scope.model.dateOver) || null;
                        $scope.model.keyword = $scope.model.keyword || null;
                        if (!$scope.model.rid) {
                            toastr.error("请选择导出区域");
                            return;
                        }
                        if (!$scope.model.dateStart || !$scope.model.dateOver) {
                            toastr.error("请选择时间");
                            return;
                        }
                        if (!$scope.model.keyword) {
                            $window.location.href = urlConfig + 'fblog/v3/FBlogWeb/ExportClassTopics' + '?token=' + APPMODEL.Storage.getItem("copPage_token") + '&dtFrm=' + ClassReport.operation.dateChange($scope.model.dateStart) + '&dtTo=' + ClassReport.operation.dateChange($scope.model.dateOver) + '&rid=' + $scope.model.rid + '&keyword=';
                        } else {
                            $window.location.href = urlConfig + 'fblog/v3/FBlogWeb/ExportClassTopics' + '?token=' + APPMODEL.Storage.getItem("copPage_token") + '&dtFrm=' + ClassReport.operation.dateChange($scope.model.dateStart) + '&dtTo=' + ClassReport.operation.dateChange($scope.model.dateOver) + '&rid=' + $scope.model.rid + '&keyword=' + $scope.model.keyword;
                        }
                    };
                    this.timeData();//time controls
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
                 * time controls
                 */
                timeData: function () {
                    $scope.today = function () {
                        var date = new Date();
                        $scope.model.dateStart = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                        $scope.model.dateOver = $scope.model.dateStart;
                    };
                    var date = new Date();
                    var dateStart = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + (date.getDate() - 7);
                    var dateOver = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
                    $scope.model.dateStart = dateStart;
                    $scope.model.dateOver = dateOver;
//                    $scope.today();
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
        })()
    };
    ClassReport.init();//payment by school statistics model function init
}]);