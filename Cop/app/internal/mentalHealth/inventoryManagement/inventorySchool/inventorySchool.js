app.controller('inventorySchool', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var ctr = {
        init:function () {
            ctr.basic();
            ctr.pageIndex();
            ctr.getScale();
            ctr.getList();
        },
        basic:function () {
            $scope.model ={
                viewList:[],
                school:undefined
            };
            $scope.toDelList = [];
            $scope.scale = undefined;
            /*学校模糊查询*/
            $scope.deleteSelectedGid = function () {
                $scope.model.school = undefined;
            };
            $scope.changeSchool = function () {
                $scope.schoolName = this.$select.selected.FName;
            };
            $scope.refreshAddresses = function (schoolName) {
                if (schoolName) {
                    $scope.schoolName = schoolName;
                    ctr.getSchoolList(schoolName);//get school org pages list
                }
            };
            $scope.openAdd = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'AccreditSchool.html',
                    controller: 'AccreditSchool',
                    keyboard: false,
                    backdrop: false,
                    size:'lg',
                    resolve: {
                        item: function () {
                            return ;
                        },
                        list:function () {
                            return $scope.scaleList;
                        }
                    }
                });
                modalInstance.result.then(function (msg) {
                    if(msg){
                        $scope.ref();
                    }
                }, function (msg) {

                });
            };
            $scope.openDel = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'delAll.html',
                    controller: 'delAll',
                    keyboard: false,
                    backdrop: false,
                    size:'sm',
                    resolve: {
                        item: function () {
                            return $scope.toDelList;
                        },
                        del:function () {
                            return $scope.delete;
                        }
                    }
                });
                modalInstance.result.then(function () {

                }, function (msg) {
                    if(msg== 'ok'){
                        $scope.delete();
                    }
                });
            };
            $scope.search = function () {
                ctr.getList();
            };
            //批量删除
            $scope.delete = function () {
                if($scope.toDelList.length !== 0){
                    ctr._DeleteScaleAccreditList($scope.toDelList);
                }else{
                    toastr.error('请至少选中一个量表');
                    return;
                }
            };
            $scope.del = function (item) {
                var arr = [];
                arr.push(item.ID);
                ctr._DeleteScaleAccreditList(arr);
            };
            $scope.ref = function () {
                ctr.getList();
            };
            //全选
            $scope.checkAll = function () {
                $scope.model.viewList.forEach(function (t) {
                    if($scope.isAll){
                        t.check = true;
                        $scope.toDelList = $scope.model.viewList.map(function (t) {
                            return t.ID;
                        })
                    }else{
                        t.check = false;
                        $scope.toDelList = [];
                    }
                })
            };
            //单选
            $scope.checkItem = function (item,index) {
                if(item.check){
                    $scope.toDelList.push(item.ID);
                }else{
                    $scope.toDelList.splice(index,1);
                }
            };
        },
        //模糊查询 根据token获取学校列表
        getSchoolList: function (schoolName) {
            applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), schoolName]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.schoolList = data.Data;
                }
            });
        },
        getScale:function () {
            applicationServiceSet.mentalHealthService._InventoryManagement._GetPublishScaleModelList.send([APPMODEL.Storage.getItem("copPage_token")]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.scaleList = data.Data;//transformation Data
                }
            });
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
                    applicationServiceSet.mentalHealthService._InventoryManagement._GetScaleAccreditPageForSchool.send([APPMODEL.Storage.getItem("copPage_token"),20,page.pIndex,$scope.school,$scope.scale]).then(function (data) {
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
                    applicationServiceSet.mentalHealthService._InventoryManagement._GetScaleAccreditPageForSchool.send([APPMODEL.Storage.getItem("copPage_token"),20,pageNext,$scope.school,$scope.scale]).then(function (data) {
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
                    applicationServiceSet.mentalHealthService._InventoryManagement._GetScaleAccreditPageForSchool.send([APPMODEL.Storage.getItem("copPage_token"),20,pageNext,$scope.school,$scope.scale]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.viewList = data.Data.ViewModelList;//transformation Data
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                }
            };
        },
        getList:function () {
            applicationServiceSet.mentalHealthService._InventoryManagement._GetScaleAccreditPageForSchool.send([APPMODEL.Storage.getItem("copPage_token"),20,1,$scope.model.school,$scope.scale]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.viewList = data.Data.ViewModelList;//transformation Data
                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data.Data);//paging
                }
            });
        },
        _DeleteScaleAccreditList:function (arr) {
            applicationServiceSet.mentalHealthService._InventoryManagement._DeleteScaleAccreditList.send([arr],[APPMODEL.Storage.getItem("copPage_token")]).then(function (data) {
                if (data.Ret == 0) {
                    toastr.success("删除成功");
                    $scope.toDelList = "";
                    $scope.isAll = false;
                    ctr.getList();
                }
            });
        }

    };
    ctr.init();
}]);
app.controller('delAll', ['$scope', 'toastr', '$modalInstance', 'item','del','applicationServiceSet', function ($scope, toastr, $modalInstance, item,del,applicationServiceSet) {

    $scope.ok = function () {
        $modalInstance.dismiss('ok');
    };
    //取消
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

}]);
app.controller('AccreditSchool', ['$scope', 'toastr', '$modalInstance', 'list','applicationServiceSet', function ($scope, toastr, $modalInstance, list,applicationServiceSet) {
    $scope.list = list;
    $scope.addModal = {
        scale:[],
        school:undefined
    };
    /*学校模糊查询*/
    $scope.deleteSelectedGid = function () {
        $scope.addModal.school = undefined;
    };
    $scope.changeSchool = function () {
        $scope.schoolName = this.$select.selected.FName;
    };
    $scope.refreshAddresses = function (schoolName) {
        if (schoolName) {
            $scope.schoolName = schoolName;
            getSchoolList(schoolName);//get school org pages list
        }
    };
    //模糊查询 根据token获取学校列表
    var getSchoolList = function (schoolName) {
        applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), schoolName]).then(function (data) {
            if (data.Ret == 0) {
                $scope.schoolList = data.Data;
            }
        });
    };

    $scope.ok = function () {
        var arr = $scope.addModal.scale.map(function (t) {
            return t.ID;
        });
        var schoolName = $scope.schoolList.filter(function (t) {
            return t.GID == $scope.addModal.school;
        });
        $scope.submit = {
            ScaleIDList:arr,
            SchoolID:$scope.addModal.school,
            SchoolName:schoolName[0].Name,
        };
        if($scope.submit.ScaleIDList.length == 0){
            toastr.error("请选择量表");
            return;
        }
        applicationServiceSet.mentalHealthService._InventoryManagement._AddScaleAccreditList.send($scope.submit,[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
            if(data.Ret == 0){
                $modalInstance.close(true);
                toastr.success("添加成功");
                // $modalInstance.dismiss('cancel');
            }
        })
    };
    //取消
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

}]);