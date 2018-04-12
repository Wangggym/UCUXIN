app.controller('mentalServicePackage', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var ctr = {
        init:function () {
            ctr.basic();
            ctr.pageIndex();
            ctr.getList(1);
        },
        basic:function () {
            $scope.model = {
                school:undefined,
                schoolName:undefined,
            };
            /*学校模糊查询*/
            $scope.deleteSelectedGid = function () {
                $scope.model.school = undefined;
            };
            $scope.changeSchool = function () {
                $scope.model.schoolName = this.$select.selected.FName;
            };
            $scope.refreshAddresses = function (schoolName) {
                if (schoolName) {
                    $scope.model.schoolName = schoolName;
                    ctr.getSchoolList(schoolName);//get school org pages list
                }
            };

            //search
            $scope.searchKey = "";
            $scope.search = function () {
                ctr.getList(1);
            };
            $scope.openEdit = function (item) {
                $modal.open({
                    templateUrl: 'mentalFunctionOpenEdit.html',
                    controller: 'mentalFunctionOpenEdit',
                    keyboard: false,
                    backdrop: false,
                    size:'md',
                    resolve: {
                        item: function () {
                            return item;
                        }
                    }
                });
            };
            //删除
            $scope.deleteMine = function (item) {
                ctr._DeleteQuestion(item.ID);
            }.bind(this);
            //设置心理包发布状态
            $scope.setStype = function (item,type) {
                if(item.ST == 0 && type == 0){
                    toastr.error("未发布，不能取消");
                    return;
                }
                if(item.ST == 1 && type == 1){
                    toastr.error("已发布，不能再次发布");
                    return;
                }
                if(type == 1){
                    $scope.setSuccessText = "发布成功";
                }else{
                    $scope.setSuccessText = "取消成功";
                }
                ctr._SetPsyChargePublishStatue(item.ID,type);
            }.bind(this);

        },
        //模糊查询 根据token获取学校列表
        getSchoolList: function (schoolName) {
            applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), schoolName]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.schoolList = data.Data;
                }
            });
        },
        //删除心理包
        _DeleteQuestion: function (mid) {
            applicationServiceSet.mentalHealthService._MentalOpen._DeletePsyCharge.send(undefined,[APPMODEL.Storage.getItem('copPage_token'),mid]).then(function (data) {
                if (data.Ret == 0) {
                    ctr.getList(1);
                    toastr.success("删除成功");
                }
            });
        },
        //设置心理包发布状态
        _SetPsyChargePublishStatue: function (mid,status) {
            applicationServiceSet.mentalHealthService._MentalOpen._SetPsyChargePublishStatue.send(undefined,[APPMODEL.Storage.getItem('copPage_token'),mid,status]).then(function (data) {
                if (data.Ret == 0) {
                    ctr.getList(1);
                    toastr.success($scope.setSuccessText);
                }
            });
        },
        //获取列表分页
        getList:function (index) {
            applicationServiceSet.mentalHealthService._MentalOpen._GetPsyChargePage.send([APPMODEL.Storage.getItem('copPage_token'),20,index,$scope.searchKey]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.viewList = data.Data.ViewModelList;//transformation Data
                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data.Data);//paging
                }
            })
        },
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
                    applicationServiceSet.mentalHealthService._MentalOpen._GetPsyChargePage.send([APPMODEL.Storage.getItem('copPage_token'),20,page.pIndex,$scope.searchKey]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.viewList = data.Data.ViewModelList;//transformation Data
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
                    applicationServiceSet.mentalHealthService._MentalOpen._GetPsyChargePage.send([APPMODEL.Storage.getItem('copPage_token'),20,pageNext,$scope.searchKey]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.viewList = data.Data.ViewModelList;//transformation Data
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
                    applicationServiceSet.mentalHealthService._MentalOpen._GetPsyChargePage.send([APPMODEL.Storage.getItem('copPage_token'),20,pageNext,$scope.searchKey]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.viewList = data.Data.ViewModelList;//transformation Data

                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                }
            };
        },
    };
    ctr.init();
}]);

