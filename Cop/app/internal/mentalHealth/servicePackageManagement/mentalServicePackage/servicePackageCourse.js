app.controller('servicePackageCourseController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var ctr = {
        init:function () {
            ctr.basic();
            ctr.pageIndex();
            ctr.getList(1);
        },
        basic:function () {
            $scope.model = {
                // courseName:undefined,
            };
            //新增或修改
            $scope.change =  $scope.openAdd = function (item) {
                if(!item){
                    item = {
                        ID:0
                    }
                }
                var modalInstance = $modal.open({
                    templateUrl: 'servicePackageCourseAddController.html',
                    controller: 'servicePackageCourseAddController',
                    keyboard: false,
                    backdrop: false,
                    size:'md',
                    resolve: {
                         items: function () {
                             return item
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
        _DeletePsyChargeItem: function (id) {
            applicationServiceSet.mentalHealthService._MentalOpen._DeletePsyChargeItem.send(undefined,[APPMODEL.Storage.getItem('copPage_token'),id]).then(function (data) {
                if (data.Ret == 0) {
                    ctr.getList(1);
                    toastr.success("删除成功");
                }
            });
        },
        //获取服务项详情
        getList:function (index) {
            applicationServiceSet.mentalHealthService._MentalOpen._GetPsyChargeAndItems.send([APPMODEL.Storage.getItem('copPage_token'),$scope.psyChargeID,4]).then(function (data) {
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



app.controller('servicePackageCourseAddController', ['$scope', 'toastr','items', '$stateParams', '$modalInstance','applicationServiceSet', function ($scope, toastr, items, $stateParams, $modalInstance, applicationServiceSet) {
    $scope.data = items;
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.model = {

    };

    $scope.ok = function () {
        if(!$scope.model.course.Name){
            toastr.error("请选择课程");
            return;
        }
        if(!$scope.courseOrder){
            toastr.error("请填写课程顺序");
            return;
        }
        //新增或修改心理服务包服务项
        applicationServiceSet.mentalHealthService._MentalOpen._AddOrUpdatePsyChargeItems.send([items.ID,$stateParams.id,$scope.courseOrder,$scope.model.course.ID,4,$scope.model.course.Name,$scope.model.course.Pic],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
            if (data.Ret == 0) {
                $modalInstance.close(true);
                toastr.success("添加成功");
            }
        });
    };
    //获取课程列
    applicationServiceSet.mentalHealthService._CourseClassify._GetCourseList.send([APPMODEL.Storage.getItem('copPage_token'), undefined]).then(function (data) {
        if (data.Ret == 0) {
            $scope.webList = data.Data;
            $scope.pageDataInit = function(){
                // 课程
                $.each($scope.webList,function (e,item) {
                    if(item.ID == $scope.data.ServiceID){
                        $scope.model.course = $scope.webList[e];
                    }
                });
                // 顺序
                $scope.courseOrder = items.Seq;
            };
            $scope.pageDataInit();
        }
    });

}]);
