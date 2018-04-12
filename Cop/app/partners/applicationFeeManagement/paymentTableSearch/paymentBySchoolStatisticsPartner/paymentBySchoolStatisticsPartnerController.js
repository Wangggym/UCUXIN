/**
 * Created by xj on 2016/3/17.
 */
app.controller('paymentBySchoolStatisticsPartnerController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * payment by school statistics
     * @type {{init: init, variable, serviceApi, operation: operation}}
     */
    var paymentBySchoolStatistics = {
        /**
         * function init
         */
        init: function () {
            this.variable();//basic variable
            this.serviceApi.getOrgList();//get org list
            this.getOrgSchoolPage();//get school org pages list
            this.operation.basic();//basic operation
        },
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
         * basic variable
         */
        variable: function () {
            $scope.model = {
                itemList: [],
                partners: undefined,
                partnersList: [],
                selectedGid: undefined,
                pageSize: 20,
                pageIndex: 1,
                province: undefined,//省
                provinceList: [],//省list
                city: undefined,//市
                cityList: [],//市list
                county: undefined,//县
                countyList: [],//县list
                json: 'internal/applicationFeeManagement/paymentTableSearch/paymentBySchoolStatistics/city.json',
                openProductId: undefined,//开通的服务包
                dateStart: undefined,
                dateOver: undefined
            },
                $scope.pagination = {
                    currentPage: 1,
                    totalItems: undefined,
                    itemsPerPage: 15, // 默认查询10条
                    maxSize: 5,
                    previousText: "上页",
                    nextText: "下页",
                    firstText: "首页",
                    lastText: "末页"
                };
        },
        /**
         * service gather
         */
        serviceApi: (function () {
            return {
                /**
                 * according to the school ID get product package
                 */
                getProductListByGid: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetProductListByGid.send([APPMODEL.Storage.getItem('copPage_token'), $scope.queryFields.selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.productPackageList = data.Data;
                        }
                    });
                },
                /**
                 * 根据产品Id获取服务包列表
                 */
                getChargeListByProductId: function (callBack) {
                    applicationServiceSet.chargeServiceApi.chargeService.GetChargeListByProductId.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectProductPackageID]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.openProductList = data.Data;
                            if (callBack) {
                                callBack(data.Data);
                            }
                        }
                    });
                },
                /**
                 * get org list
                 */
                getOrgList: function () {
                    applicationServiceSet.internalServiceApi.paymentTableSearch.getOrganization.send([APPMODEL.Storage.getItem('copPage_token'), 8]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.partnersList = data.Data;
                        }
                    });
                    this.getProvinceList();//get province list
                },

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
                 * get school pay information statistic
                 */
                getPayStatisticBySchool: function () {
                applicationServiceSet.chargeServiceApi.chargeService.GetPayStatisticBySchool.send([APPMODEL.Storage.getItem('copPage_token'), $scope.pagination.itemsPerPage, $scope.pagination.currentPage,APPMODEL.Storage.getItem("orgid"),$scope.queryFields.selectedGid, $scope.model.province, $scope.model.city, $scope.model.county, $scope.model.selectProductPackageID,$scope.model.openProductId,paymentBySchoolStatistics.operation.dateChange($scope.model.dateStart),paymentBySchoolStatistics.operation.dateChange($scope.model.dateOver)]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.pagination.totalItems = data.Data.TotalRecords;
                        $scope.model.itemList = data.Data.ViewModelList;
                    }
                });
                }
            }
        })(),
        /**
         * basic operation
         */
        operation: (function () {
            $scope.queryFields = {
                selectedGid: undefined
            };
            /**
             * choose school
             */
            $scope.changeGid = function () {
                for (var i in $scope.model.schoolList) {
                    if ($scope.model.schoolList[i].ID == $scope.model.selectedGid) {
                        $scope.model.gidName = $scope.model.schoolList[i].FName;
                        break;
                    }
                }
                $scope.model.selectProductPackageID = undefined;
                $scope.model.openProductId = undefined;
                paymentBySchoolStatistics.serviceApi.getProductListByGid();
            };
            /**
             * 选择服务包
             */
            $scope.productPackageChange = function () {
                for (var i in $scope.model.productPackageList) {
                    if ($scope.model.productPackageList[i].ID == $scope.model.productPackageID) {
                        $scope.model.productPackageName = $scope.model.productPackageList[i].Name;
                        break;
                    }
                }
                $scope.model.openProductId = undefined;
                paymentBySchoolStatistics.serviceApi.getChargeListByProductId();//根据产品Id获取服务包列表
            };
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
                        paymentBySchoolStatistics.serviceApi.getCityList(provinceId);//get city list
                        $scope.model.city = undefined;
                        $scope.model.county = undefined;
                    };
                    /**
                     * change city
                     * @param cityId
                     */
                    $scope.selectCity = function (cityId) {
                        paymentBySchoolStatistics.serviceApi.getCountyList(cityId);//get county list
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
                        paymentBySchoolStatistics.serviceApi.getPayStatisticBySchool();//get school pay information statistic
                    };
                    /**
                     * 分页配置
                     */
                    $scope.pageQuery = function () {
                        paymentBySchoolStatistics.serviceApi.getPayStatisticBySchool();//get school pay information statistic
                    };
                    /**
                     * export
                     */
                    $scope.export = function () {
                        $window.location.href = urlConfig + 'Charge/v3/ChargeManage/ExportStatisticBySchool' + '?token=' + APPMODEL.Storage.getItem("copPage_token") + '&orgid=' + APPMODEL.Storage.getItem("orgid") + '&gid=' + $scope.queryFields.selectedGid + '&ProvinceId=' + $scope.model.province + '&CityId=' + $scope.model.city + '&CountyId=' + $scope.model.county + '&productId='+$scope.model.selectProductPackageID+'&chargeId='+$scope.model.openProductId+'&sDate=' + paymentBySchoolStatistics.operation.dateChange($scope.model.dateStart) + '&eDate=' + paymentBySchoolStatistics.operation.dateChange($scope.model.dateOver);
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
    paymentBySchoolStatistics.init();//payment by school statistics model function init
}]);