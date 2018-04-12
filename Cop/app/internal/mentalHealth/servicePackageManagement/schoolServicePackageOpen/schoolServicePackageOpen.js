app.controller('schoolServicePackageOpen', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var ctr = {
        init:function () {
            ctr.basic();
            ctr.pageIndex();
            ctr.getList(1);
            ctr.getPackageList();
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
            $scope.search = function () {
                $scope.model.school = $scope.model.school === undefined ? 0 : $scope.model.school;
                ctr.getList(1);
            };
            $scope.openAdd = function () {

                var modal =  $modal.open({
                    templateUrl: 'schoolServicePackageOpenAdd.html',
                    controller: 'schoolServicePackageOpenAdd',
                    keyboard: false,
                    backdrop: false,
                    size:'md',
                    resolve: {
                        item: function () {
                            return;
                        }
                    }
                });
                modal.result.then(function (msg) {

                }, function (msg) {
                    if(msg){
                        ctr.getList(1);
                    }
                });
            };
            $scope.deleteMine = function (item) {
                ctr._DeletePsyChargeItem(item.ID);
            }.bind(this);
        },
        //删除心理服务包开通规则
        _DeletePsyChargeItem: function (mid) {
            applicationServiceSet.mentalHealthService._SchoolPackageOpen._DeletePsyChargeRule.send(undefined,[APPMODEL.Storage.getItem('copPage_token'),mid]).then(function (data) {
                if (data.Ret == 0) {
                    ctr.getList(1);
                    toastr.success("删除成功");
                }
            });
        },
        //模糊查询 根据token获取学校列表_DeletePsyChargeRule
        getSchoolList: function (schoolName) {
            applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), schoolName]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.schoolList = data.Data;
                }
            });
        },
        //获取已发布心理服务包列表
        getPackageList:function () {
            applicationServiceSet.mentalHealthService._SchoolPackageOpen._GetPublishedPsyChargeItemList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.packageList = data.Data;//transformation Data
                }
            });
        },
        //获取列表分页
        getList:function (index) {
            applicationServiceSet.mentalHealthService._SchoolPackageOpen._GetPsyChargeRulePage.send([APPMODEL.Storage.getItem('copPage_token'),index,20,$scope.model.school]).then(function (data) {
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
                    applicationServiceSet.mentalHealthService._SchoolPackageOpen._GetPsyChargeRulePage.send([APPMODEL.Storage.getItem("copPage_token"),page.pIndex,20,$scope.model.school]).then(function (data) {
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
                    applicationServiceSet.mentalHealthService._SchoolPackageOpen._GetPsyChargeRulePage.send([APPMODEL.Storage.getItem("copPage_token"),pageNext,20,$scope.model.school]).then(function (data) {
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
                    applicationServiceSet.mentalHealthService._SchoolPackageOpen._GetPsyChargeRulePage.send([APPMODEL.Storage.getItem("copPage_token"),pageNext,20,$scope.model.school]).then(function (data) {
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

app.controller('schoolServicePackageOpenAdd', ['$scope', 'toastr', '$modalInstance','applicationServiceSet', function ($scope, toastr, $modalInstance,applicationServiceSet) {
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.model = {
    };

    $scope.ok = function () {
        if(!$scope.model.school){
            toastr.error("请选择学校");
            return;
        };
        if(!$scope.model.mentalPackage){
            toastr.error("请选择心理服务包");
            return;
        }
        if(!$scope.model.chargePackage){
            toastr.error("请选择优信收费服务包");
            return;
        }
        applicationServiceSet.mentalHealthService._SchoolPackageOpen._AddPsyChargeRule.send([$scope.model.mentalPackage.ID,
            $scope.model.mentalPackage.Name,$scope.model.chargePackage.ID,$scope.model.chargePackage.Name,$scope.model.school.GID,$scope.model.school.FName,undefined],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
            if(data.Ret == 0){
                $modalInstance.dismiss(true);
                toastr.success("新增成功");
            }
        })
    };
    //获取心理服务包
    applicationServiceSet.mentalHealthService._SchoolPackageOpen._GetPublishedPsyChargeItemList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
            $scope.packageList = data.Data;//transformation Data
        }
    });
    //获取优信收费服务包
    $scope.chooseCharge = function () {
        if($scope.model.school){
            applicationServiceSet.mentalHealthService._SchoolPackageOpen._GetChargeListByFuncID.send([APPMODEL.Storage.getItem('copPage_token'),$scope.model.school.GID,15]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.chargeList = data.Data;//transformation Data
                }
            });
        }
    };
    //模糊查询 根据token获取学校列表
    var getSchoolList = function (schoolName) {
        applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), schoolName]).then(function (data) {
            if (data.Ret == 0) {
                $scope.model.schoolList = data.Data;
            }
        });
    };
    /*学校模糊查询*/
    $scope.deleteSelectedGid = function () {
        $scope.model.school = undefined;
    };
    $scope.changeSchool = function () {
        $scope.model.schoolName = this.$select.selected.FName;
        $scope.changeSchool();

    };
    $scope.refreshAddresses = function (schoolName) {
        if (schoolName) {
            $scope.model.schoolName = schoolName;
            getSchoolList(schoolName);//get school org pages list
        }
    };
}]);