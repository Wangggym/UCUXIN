/**
 * Created by fanweihua on 2016/9/8.
 * paymentPushSetController
 * payment push set
 */
app.controller('paymentPushSetController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet) {
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
                selectedGid: undefined
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
             */
            getOrgSchoolPage: function () {
                applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.schoolList = data.Data;
                    }
                });
            },
            /**
             * get all school configuration records
             */
            getAllGroupConfig: function () {
                applicationServiceSet.internalServiceApi.applicationFeeOpen.GetPageGroupConfig.send([APPMODEL.Storage.getItem('copPage_token'), $scope.queryFields.selectedGid, APPMODEL.Storage.getItem('orgid'), $scope.pagination.itemsPerPage, $scope.pagination.currentPage]).then(function (data) {
                    if (data.Ret == 0) {
                        for (var i in data.Data.ViewModelList) {
                            if (data.Data.ViewModelList[i].IsShowFixEntry) {
                                data.Data.ViewModelList[i].IsShowFixEntryName = "是";
                            } else {
                                data.Data.ViewModelList[i].IsShowFixEntryName = "否";
                            }
                            if (data.Data.ViewModelList[i].FixEntryUrlType == 1) {
                                data.Data.ViewModelList[i].FixEntryUrlTypeName = "缴费文章";
                            } else {
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
                 * delete school choice
                 */
                $scope.deleteSelectedGid = function () {
                    $scope.queryFields.selectedGid = undefined;
                    $scope.itemList = [];
                };
                /**
                 * search
                 */
                $scope.search = function () {
                    serviceApi.getAllGroupConfig();//get all school configuration records
                };
                // 切换页码
                $scope.pageQuery = function () {
                    serviceApi.getAllGroupConfig();
                };
                if ($stateParams.gid) {
                    operation.judgeStateParams();
                } else {
                    $scope.search();
                }
                /**
                 * 查看推送日志
                 * @param item
                 */
                $scope.pushLog = function (item) {
                    for (var i in paymentPushSet) {
                        delete paymentPushSet[i];
                    }
                    $location.url('access/app/partner/applicationFeeOpen/pushLogPushSet?gid=' + item.GID);
                };
                /**
                 * 添加推送
                 * @param item
                 */
                $scope.addPush = function (item) {
                    for (var i in paymentPushSet) {
                        delete paymentPushSet[i];
                    }
                    $location.url('access/app/partner/applicationFeeOpen/addPushSet?gid=' + item.GID + '&gidName=' + item.GName);
                };
            },
            /**
             * judge parameters
             */
            judgeStateParams: function () {
                if (APPMODEL.Storage.getItem('selectedGid')) {
                    $scope.queryFields.selectedGid = $stateParams.gid;
                    $scope.search();
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