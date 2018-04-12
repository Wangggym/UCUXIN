/**
 * Created by fanweihua on 2016/8/24.
 * serviceProductOpenPageController
 * service packages judge open page
 */
app.controller('serviceProductOpenPageController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet) {
    /**
     * service product open
     * @type {{init: init, getOrgList: getOrgList, getOrgSchoolPage: getOrgSchoolPage, getProductListByGid: getProductListByGid, getProductOpenPage: getProductOpenPage, pageIndex: pageIndex, listDataOperation: listDataOperation, operation: operation, paramsCollection: paramsCollection, formDisabled: formDisabled}}
     */
    var serviceProductOpenPage = {
        /**
         * function init
         */
        init: function () {
            this.pageIndex();//paging function
            this.formDisabled();//form disabled init true
            this.getOrgList();//get partner list
        },
        /**
         * get partner list
         */
        getOrgList: function () {
            serviceProductOpenPage.operation(function () {//func operation
                serviceProductOpenPage.getOrgSchoolPage(APPMODEL.Storage.getItem("orgid"));//get school org pages list
            });
        },
        /**
         * get school org pages list
         */
        getOrgSchoolPage: function (orgID) {
            if (orgID) {
                $scope.formDisabled = false;
                applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), orgID]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.schoolList = data.Data;
                        var school = {
                            FName: "所有",
                            ID: 0
                        };
                        $scope.schoolList.unshift(school);
                    }
                });
            }
        },
        /**
         * according to the school ID get product package
         * @param gid
         */
        getProductListByGid: function (gid) {
            if (gid) {
                $scope.formPackDisabled = false;
                applicationServiceSet.parAppServiceApi.paymentTableSearch.getProductList.send([APPMODEL.Storage.getItem('copPage_token'), gid]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.productPackageList = data.Data;
                    }
                });
            }
        },
        /**
         * product package opened the query
         * @param callBack
         */
        getProductOpenPage: function (callBack) {
            var params = serviceProductOpenPage.paramsCollection();
            applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetProductOpenPage.send([APPMODEL.Storage.getItem('copPage_token'), params.pageSize, params.pageIndex, params.orgid, params.gid, params.funcServiceProductID]).then(function (data) {
                if (data.Ret == 0) {
                    serviceProductOpenPage.listDataOperation(data.Data.ViewModelList);//data list operation
                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data.Data);//paging
                    callBack();
                }
            });
        },
        /**
         * paging function
         */
        pageIndex: function () {
            /**
             * paging
             */
            $scope.pageIndex = {
                /**
                 * click paging
                 * @param page
                 */
                fliPage: function (page) {
                    var params = serviceProductOpenPage.paramsCollection();
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetProductOpenPage.send([APPMODEL.Storage.getItem('copPage_token'), params.pageSize, page.pIndex, params.orgid, params.gid, params.funcServiceProductID]).then(function (data) {
                        if (data.Ret == 0) {
                            serviceProductOpenPage.listDataOperation(data.Data.ViewModelList);//data list operation
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                },
                /**
                 * nextPage
                 * @param pageNext
                 */
                nextPage: function (pageNext) {
                    var params = serviceProductOpenPage.paramsCollection();
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetProductOpenPage.send([APPMODEL.Storage.getItem('copPage_token'), params.pageSize, pageNext, params.orgid, params.gid, params.funcServiceProductID]).then(function (data) {
                        if (data.Ret == 0) {
                            serviceProductOpenPage.listDataOperation(data.Data.ViewModelList);//data list operation
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                },
                /**
                 * previousPage
                 * @param pageNext
                 */
                previousPage: function (pageNext) {
                    var params = serviceProductOpenPage.paramsCollection();
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetProductOpenPage.send([APPMODEL.Storage.getItem('copPage_token'), params.pageSize, pageNext, params.orgid, params.gid, params.funcServiceProductID]).then(function (data) {
                        if (data.Ret == 0) {
                            serviceProductOpenPage.listDataOperation(data.Data.ViewModelList);//data list operation
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                }
            }
        },
        /**
         * data list operation
         * @param data
         */
        listDataOperation: function (data) {
            if (data) {
                for (var i in data) {
                    if (data[i].ProductType == 1) {
                        data[i].GroupOpenTypeName = "正式个人购买包";
                    } else if (data[i].ProductType == 2) {
                        data[i].GroupOpenTypeName = "试用包";
                    } else {
                        data[i].GroupOpenTypeName = "正式整体开通包";
                    }
                }
                $scope.productOpenModelList = data;
            } else {
                $scope.productOpenModelList = data;
            }
        },
        /**
         * func operation
         * @param callBack
         */
        operation: function (callBack) {
            $scope.queryFields = {
                selectedGid: undefined,
                selectProductPackageID: undefined
            };
            /**
             * choose school ID get product package
             */
            $scope.changeGid = function () {
                serviceProductOpenPage.getProductListByGid($scope.queryFields.selectedGid);//according to the school ID get product package
                $scope.search();
            };
            /**
             * change product gid
             */
            $scope.changeProductGid = function () {
                $scope.search();
            };
            /**
             * search
             */
            $scope.search = function () {
                serviceProductOpenPage.getProductOpenPage(callBack);//product package opened the query
            };
            $scope.search();
        },
        /**
         * product package opened need params
         * @returns {{pageSize: number, pageIndex: number, orgid: *, gid: *, funcServiceProductID: *}}
         */
        paramsCollection: function () {
            var params = {
                pageSize: 20,
                pageIndex: 1,
                orgid: APPMODEL.Storage.getItem("orgid"),
                gid: $scope.queryFields.selectedGid,
                funcServiceProductID: $scope.queryFields.selectProductPackageID
            };
            return params;
        },
        /**
         * form disabled init true
         */
        formDisabled: function () {
            $scope.formDisabled = true;
            $scope.formPackDisabled = true;
        }
    };
    serviceProductOpenPage.init();//function init
}]);