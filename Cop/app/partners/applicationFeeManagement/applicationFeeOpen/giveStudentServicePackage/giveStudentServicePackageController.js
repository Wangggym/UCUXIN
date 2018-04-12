/**
 * Created by fanweihua on 2016/8/25.
 * addStuFuncServiceByGiveController
 * give student service package
 */
app.controller('giveStudentServicePackageController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet','toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet,toastr) {
    var addStuFuncServiceByGive = {
        /**
         * function init
         */
        init: function () {
            this.pageIndex();
            addStuFuncServiceByGive.variable();
            this.getOrgSchoolPage();//get school org pages list
        },
        /**
         * 变量声明
         */
        variable: function () {
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
                ID: undefined,
                deletList:[],
                checkAll: false
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
                    addStuFuncServiceByGive.operation();//search service package list
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
                            addStuFuncServiceByGive.dealWithData(data.Data.ViewModelList);//to ideal with student list data
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
                            addStuFuncServiceByGive.dealWithData(data.Data.ViewModelList);//to ideal with student list data
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
                            addStuFuncServiceByGive.dealWithData(data.Data.ViewModelList);//to ideal with student list data
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
                data[i].checked = false;
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
             *单选删除
             */
            $scope.check = function (item) {
                if(item.checked == false){
                    item.checked = true;
                    $scope.model.deletList.push(item.OrderDetailsID);
                    if($scope.model.deletList.length == $scope.studentList.length){
                        $scope.model.checkAll = true;
                    }
                }else {
                    item.checked = false;
                    $scope.model.checkAll = false;
                    $.each($scope.model.deletList,function (e,element) {
                        if( element == item.OrderDetailsID){
                            $scope.model.deletList.splice(e,1);
                        }
                    })
                }
            };
            /**
             *全选删除
             */
            $scope.checkAll = function () {
                if($scope.model.checkAll){
                    $.each($scope.studentList,function (e,item) {
                        item.checked = true;
                        $scope.model.deletList.push(item.OrderDetailsID);
                    });
                }else {
                    $.each($scope.studentList,function (e,item) {
                        item.checked = false;
                    });
                    $scope.model.deletList = [];
                }
            };
            /**
             * 点击删除
             */
            $scope.delet = function () {
                if($scope.model.deletList.length == 0){
                    toastr.error('请先选择要删除的学生！');
                }else {
                    addStuFuncServiceByGive.serviceApi.deletGive();
                }
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
                addStuFuncServiceByGive.serviceApi.getProductListByGid();
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
                addStuFuncServiceByGive.serviceApi.getChargeListByProductId();//根据产品Id获取服务包列表
            };
            /**
             * search
             */
            $scope.search = function () {
                addStuFuncServiceByGive.serviceApi.getGiveList();//get student give list information
            };
            $scope.search();
        },
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
                 * get student give list information
                 */
                getGiveList: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetGiveList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.pageSize, $scope.model.pageIndex, APPMODEL.Storage.getItem("orgid"), $scope.queryFields.selectedGid, $scope.model.selectProductPackageID, $scope.model.openProductId]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                            addStuFuncServiceByGive.dealWithData(data.Data.ViewModelList);//to ideal with student list data
                        }
                    });
                },
                /**
                 * 删除
                 */
                deletGive : function () {
                    applicationServiceSet.chargeServiceApi.chargeService.DeleteGiveOrder.send([APPMODEL.Storage.getItem('orgid'),$scope.model.deletList]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('删除成功！');
                            $scope.model.deletList = [];
                            $scope.model.checkAll = false;
                            addStuFuncServiceByGive.serviceApi.getGiveList();
                        }
                    });
                }
            }
        })()
    };
    addStuFuncServiceByGive.init();//function init
}]);