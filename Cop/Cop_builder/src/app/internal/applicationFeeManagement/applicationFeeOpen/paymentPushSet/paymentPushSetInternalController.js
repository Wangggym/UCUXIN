/**
 * Created by fanweihua on 2016/9/8.
 * paymentPushSetController
 * payment push set
 */
app.controller('paymentPushSetInternalController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet) {
    /**
     * payment push set
     */
    var paymentPushSet = (function () {
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
                selectedGid: 0
            };
            $scope.itemList = [];
            // 分页指令配置
            $scope.pagination = {
                currentPage: 1,
                itemsPerPage: 30, // 默认查询10条
                maxSize: 5,
                previousText: "上页",
                nextText: "下页",
                firstText: "首页",
                lastText: "末页"
            };
        };
        /**
         * service aggregate
         * @type {{getOrgSchoolPage: getOrgSchoolPage}}
         */
        var serviceApi = {
            /**
             * get school org pages list
             * @param selectedGid
             */
            getOrgSchoolPage: function (selectedGid) {
                if (selectedGid) {
                    $("ul[aria-labelledby='dLabel'] li").eq(0).hide();
                    applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.schoolList = data.Data;
                            $("ul[aria-labelledby='dLabel'] li").eq(0).show();
                        }
                    });
                }
            },
            /**
             * get all school configuration records
             */
            getAllGroupConfig: function () {
                applicationServiceSet.internalServiceApi.applicationFeeOpen.GetPageGroupConfig.send([APPMODEL.Storage.getItem('copPage_token'),$scope.queryFields.selectedGid,0,$scope.pagination.itemsPerPage,$scope.pagination.currentPage]).then(function (data) {
                    if (data.Ret == 0) {
                        for (var i in data.Data.ViewModelList) {
                            if (data.Data.ViewModelList[i].IsShowFixEntry) {
                                data.Data.ViewModelList[i].IsShowFixEntryName = "是";
                            } else {
                                data.Data.ViewModelList[i].IsShowFixEntryName = "否";
                            }
                            if(data.Data.ViewModelList[i].FixEntryUrlType == 1){
                                data.Data.ViewModelList[i].FixEntryUrlTypeName = "缴费文章";
                            }else {
                                data.Data.ViewModelList[i].FixEntryUrlTypeName = "直接进入收费页面";
                            }
                        }
                        $scope.pagination.totalItems = data.Data.TotalRecords;
                        $scope.itemList = data.Data.ViewModelList;
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
                    APPMODEL.Storage.setItem('selectedGid', $scope.queryFields.selectedGid);
                    $scope.search();//get all school configuration records
                };
                /**
                 * refresh service get school list
                 * @param selectedGid
                 */
                $scope.refreshAddresses = function (selectedGid) {
                    if (selectedGid) {
                        APPMODEL.Storage.setItem('gidName', selectedGid);
                    }
                    serviceApi.getOrgSchoolPage(selectedGid);//get school org pages list
                };
                // 切换页码
                $scope.pageQuery = function () {
                    $scope.search();
                };
                /**
                 * delete school choice
                 */
                $scope.deleteSelectedGid = function () {
                    $scope.queryFields.selectedGid = undefined;
                    $scope.itemList = [];
                    delete APPMODEL.Storage.selectedGid;
                    delete APPMODEL.Storage.gidName;
                };
                /**
                 * search
                 */
                $scope.search = function () {
                    serviceApi.getAllGroupConfig();//get all school configuration records
                };
                if ($stateParams.gid) {
                    operation.judgeStateParams();
                } else {
                    $scope.search();
                }
            },
            /**
             * judge parameters
             */
            judgeStateParams: function () {
                if (APPMODEL.Storage.getItem('selectedGid')) {
                    $scope.queryFields.selectedGid = $stateParams.gid;
                    var gidName = APPMODEL.Storage.getItem('gidName');
                    $scope.search();
                    serviceApi.getOrgSchoolPage(gidName);//get school org pages list
                    delete APPMODEL.Storage.selectedGid;
                    delete APPMODEL.Storage.gidName;
                } else {
                    $scope.search();
                }
            }
        };
        /**
         * return init
         */
        return {
            init: init
        };
    })();
    paymentPushSet.init();//payment push set function init
}]);