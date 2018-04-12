/**
 * Created by xj on 2017/3/16.
 */

app.controller('addStudentSaleController', ['$scope', '$http', 'toastr', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', function ($scope, $http, toastr, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet) {
    var addStudentSale = {
        /**
         * function init
         */
        init: function () {
            this.pageIndex();
            addStudentSale.variable();
            this.getOrgSchoolPage();//get school org pages list
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.itemList = [];
            $scope.model = {
                gidName: undefined,
                productPackageName: undefined,
                schoolList: [],
                selectedGid: undefined,
                productPackageID: undefined,
                productPackageList: [],
                pageSize: 10,
                pageIndex: 1,
                classList: [],//班级
                classId: undefined,
                studentPack: false,//可购买服务包学生
                studentName: undefined,//学生名称
                dateStart: undefined,//开始时间
                dateOver: undefined,//结束时间
                openProductId: undefined,//开通的服务包
                openProductList: [],//开通的服务包列表
                ID: undefined
            };
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
                    addStudentSale.operation();//search service package list
                }
            });
        },

        /**
         * paging function
         */
        pageIndex: function () {
            /**
             * paging index send
             */
            $scope.pageIndex = {
                /**
                 * click paging
                 * @param page
                 */
                fliPage: function (page) {
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetGiveList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.queryFields.selectedGid, APPMODEL.Storage.getItem("orgid"), $scope.model.pageSize, page.pIndex]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                            addStudentSale.dealWithData(data.Data.ViewModelList);//to ideal with student list data
                        }
                    });
                },
                /**
                 * nextPage
                 * @param pageNext
                 */
                nextPage: function (pageNext) {
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetGiveList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.queryFields.selectedGid, APPMODEL.Storage.getItem("orgid"), $scope.model.pageSize, pageNext]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                            addStudentSale.dealWithData(data.Data.ViewModelList);//to ideal with student list data
                        }
                    });
                },
                /**
                 * previousPage
                 * @param pageNext
                 */
                previousPage: function (pageNext) {
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.GetGiveList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.queryFields.selectedGid, APPMODEL.Storage.getItem("orgid"), $scope.model.pageSize, pageNext]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                            addStudentSale.dealWithData(data.Data.ViewModelList);//to ideal with student list data
                        }
                    });
                }
            };
        },
        /**
         * to ideal with student list data
         * @param data
         */
        dealWithData: function (data) {
            for (var i in data) {
                data[i].SDateEDate = data[i].SDate + '~' + data[i].EDate;
            }
            $scope.studentList = data;
        },
        /**
         * search service package list
         */
        operation: function () {
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
                $scope.queryFields.selectedClassID=undefined;
                $scope.model.selectProductPackageID=undefined;
                $scope.model.openProductId=undefined;
                addStudentSale.serviceApi.getClassList($scope.queryFields.selectedGid);//get class list
                addStudentSale.serviceApi.getProductListByGid();
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
                $scope.model.openProductId=undefined;
                addStudentSale.serviceApi.getChargeListByProductId();//根据产品Id获取服务包列表
            };
            /**
             * 根据ID删除学生优惠信息
             */
            $scope.deleteMine = function (item) {
                addStudentSale.serviceApi.removeStudentSaleInfo(item);
            };
            /**
             * search
             */
            $scope.search = function () {
                addStudentSale.serviceApi.getStudentSaleList();//get student give list information
            };
            $scope.search();
        },
        serviceApi: (function () {
            return {
                /**
                 * get class list
                 * @param gid
                 */
                getClassList: function (gid) {
                    if (gid) {
                        $scope.formClassDisabled = false;
                        applicationServiceSet.parAppServiceApi.applicationFeeOpen.getClassList.send([APPMODEL.Storage.getItem('copPage_token'), gid]).then(function (data) {
                            if (data.Ret == 0) {
                                $scope.classList = data.Data;
                            }
                        });
                    }
                },
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
                 * 根据ID删除学生优惠信息
                 */
                removeStudentSaleInfo: function (item) {
                    applicationServiceSet.chargeServiceApi.chargeService.RemoveStudentSaleById.send(undefined, [APPMODEL.Storage.getItem('copPage_token'), item.ID]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('删除成功');
                            $scope.itemList.splice($scope.itemList.indexOf(item), 1);
                        }
                    });
                },
                /**
                 * get student Sale list information
                 */
                getStudentSaleList: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetStudentSaleList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.pageSize, $scope.model.pageIndex, APPMODEL.Storage.getItem("orgid"), $scope.queryFields.selectedGid, $scope.queryFields.selectedClassID, $scope.studentName, $scope.model.selectProductPackageID, $scope.model.openProductId]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                            $scope.itemList = data.Data.ViewModelList;
                            addStudentSale.dealWithData(data.Data.ViewModelList);//to ideal with student list data
                        }
                    });
                }
            }
        })()
    };
    addStudentSale.init();//function init
}]);