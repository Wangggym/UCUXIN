app.controller('servicePackageScaleController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var ctr = {
        init:function () {
            ctr.basic();
            ctr.pageIndex();
            ctr.getList(1);
        },
        basic:function () {
            $scope.model = {
                courseName:undefined,
            };
            $scope.openAdd = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'servicePackageScaleAddController.html',
                    controller: 'servicePackageScaleAddController',
                    keyboard: false,
                    backdrop: false,
                    size:'md',
                    resolve: {
                        item: function () {
                            return;
                        }
                    }
                });
                modalInstance.result.then(function (msg) {
                    if(msg){
                        ctr.getList(1);
                    }
                }, function (msg) {

                });
            };
            if ($stateParams.id) {
                $scope.psyChargeID = $stateParams.id;
            };
            //删除
            $scope.deleteMine = function (item) {
                ctr._DeletePsyChargeItem(item.ID);
            }.bind(this);
        },

        //删除服务项
        _DeletePsyChargeItem: function (mid) {
            applicationServiceSet.mentalHealthService._MentalOpen._DeletePsyChargeItem.send(undefined,[APPMODEL.Storage.getItem('copPage_token'),mid]).then(function (data) {
                if (data.Ret == 0) {
                    ctr.getList(1);
                    toastr.success("删除成功");
                }
            });
        },
        //获取服务项详情
        getList:function (index) {
            applicationServiceSet.mentalHealthService._MentalOpen._GetPsyChargeAndItems.send([APPMODEL.Storage.getItem('copPage_token'),$scope.psyChargeID,1]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.viewList = data.Data;//transformation Data
                    // $scope.pageIndex.pages = data.Data.Pages;//paging pages
                    // $scope.pageIndex.pageindexList(data.Data);//paging
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
                    applicationServiceSet.mentalHealthService._MentalOpen._GetSchoolPsyManagers.send([APPMODEL.Storage.getItem("copPage_token"),20,page.pIndex,$scope.GID]).then(function (data) {
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
                    applicationServiceSet.mentalHealthService._MentalOpen._GetSchoolPsyManagers.send([APPMODEL.Storage.getItem("copPage_token"),20,pageNext,$scope.GID]).then(function (data) {
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
                    applicationServiceSet.mentalHealthService._MentalOpen._GetSchoolPsyManagers.send([APPMODEL.Storage.getItem("applicationToken"),20,pageNext,$scope.GID]).then(function (data) {
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

app.controller('servicePackageScaleAddController', ['$scope', 'toastr', '$stateParams', '$modalInstance','applicationServiceSet', function ($scope, toastr,  $stateParams, $modalInstance, applicationServiceSet) {
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        //新增或修改心理服务包服务项
        applicationServiceSet.mentalHealthService._MentalOpen._AddOrUpdatePsyChargeItems.send([undefined,$stateParams.id,undefined,$scope.model.scale.ID,1,$scope.model.scale.Name,undefined],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
            if (data.Ret == 0) {
                $modalInstance.close(true);
                toastr.success("添加成功");
            }
        });
    };

    //获取量表
    applicationServiceSet.mentalHealthService._InventoryManagement._GetPublishScaleModelList.send([APPMODEL.Storage.getItem('copPage_token'),true]).then(function (data) {
        if (data.Ret == 0) {
            $scope.webList = data.Data;
        }
    });

}]);