app.controller('getSchoolPsyManagersController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
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

            $scope.openAdd = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'getSchoolPsyManagersAddController.html',
                    controller: 'getSchoolPsyManagersAddController',
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
            if ($stateParams.GID) {
                $scope.GID = $stateParams.GID;
            };
            //删除
            $scope.deleteMine = function (item) {
                ctr._DeleteQuestion(item.MID);
            }.bind(this);
        },

        //删除心理管理员
        _DeleteQuestion: function (mid) {
            applicationServiceSet.mentalHealthService._MentalOpen._DeleteQuestion.send(undefined,[APPMODEL.Storage.getItem('copPage_token'),mid]).then(function (data) {
                if (data.Ret == 0) {
                    ctr.getList(1);
                    toastr.success("删除成功");
                }
            });
        },
        //获取心理管理员列表分页
        getList:function (index) {
            applicationServiceSet.mentalHealthService._MentalOpen._GetSchoolPsyManagers.send([APPMODEL.Storage.getItem('copPage_token'),$scope.GID]).then(function (data) {
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
                    applicationServiceSet.mentalHealthService._MentalOpen._GetSchoolPsyManagers.send([APPMODEL.Storage.getItem("copPage_token"),20,pageNext,$scope.GID]).then(function (data) {
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

app.controller('getSchoolPsyManagersAddController', ['$scope', 'toastr', '$stateParams', '$modalInstance','applicationServiceSet', function ($scope, toastr,  $stateParams, $modalInstance, applicationServiceSet) {
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        if(!$scope.model.mid){
            toastr.error("请选择管理员");
            return;
        }
        //增加心理管理员
        applicationServiceSet.mentalHealthService._MentalOpen._AddPsyManage.send(undefined,[APPMODEL.Storage.getItem('copPage_token'),$scope.model.mid]).then(function (data) {
            if (data.Ret == 0) {
                $modalInstance.close(true);
                toastr.success("添加成功");
            }
        });
    };
    if ($stateParams.GID) {
        $scope.GID = $stateParams.GID;
    }
    //获取机构下员工【学校：老师/企业：职员】集合
    applicationServiceSet.internalServiceApi.message.GetMembers.send([APPMODEL.Storage.getItem('applicationToken'),$scope.GID]).then(function (data) {
        if (data.Ret == 0) {
            $scope.webList = data.Data;
        }
    });

}]);