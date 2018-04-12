app.controller('inventoryPartner', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var ctr = {
        init:function () {
            ctr.basic();
            ctr.pageIndex();
            ctr.getScale();
            ctr.getSchoolList();
            ctr.getList();
        },
        basic:function () {
            $scope.model ={
                viewList:[]
            };
            $scope.toDelList = [];
            $scope.scale = undefined;

            $scope.deletePartner = function () {
              $scope.model.partner = undefined;
            };
            $scope.openAdd = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'AccreditPartner.html',
                    controller: 'AccreditPartner',
                    keyboard: false,
                    backdrop: false,
                    size:'lg',
                    resolve: {
                        item: function () {
                            return ;
                        },
                        list:function () {
                            return $scope.scaleList;
                        },
                        partnerList:function () {
                            return $scope.partnerList;
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
                    controller: 'delPartner',
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
        //获取合作伙伴
        getSchoolList: function (schoolName) {
            applicationServiceSet.internalServiceApi.organizationalInstitution.getOrgList.send([APPMODEL.Storage.getItem('copPage_token'),8]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.partnerList = data.Data;
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
                    applicationServiceSet.mentalHealthService._InventoryManagement._GetScaleAccreditPageForOrg.send([APPMODEL.Storage.getItem("copPage_token"),20,page.pIndex,$scope.model.partner,$scope.scale]).then(function (data) {
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
                    applicationServiceSet.mentalHealthService._InventoryManagement._GetScaleAccreditPageForOrg.send([APPMODEL.Storage.getItem("copPage_token"),20,pageNext,$scope.model.partner,$scope.scale]).then(function (data) {
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
                    applicationServiceSet.mentalHealthService._InventoryManagement._GetScaleAccreditPageForOrg.send([APPMODEL.Storage.getItem("copPage_token"),20,pageNext,$scope.model.partner,$scope.scale]).then(function (data) {
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
            applicationServiceSet.mentalHealthService._InventoryManagement._GetScaleAccreditPageForOrg.send([APPMODEL.Storage.getItem("copPage_token"),20,1,$scope.model.partner,$scope.scale]).then(function (data) {
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

app.controller('delPartner', ['$scope', 'toastr', '$modalInstance', 'item','del','applicationServiceSet', function ($scope, toastr, $modalInstance, item,del,applicationServiceSet) {

    $scope.ok = function () {
        $modalInstance.dismiss('ok');
    };
    //取消
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

}]);

app.controller('AccreditPartner', ['$scope', 'toastr', '$modalInstance', 'list','partnerList','applicationServiceSet', function ($scope, toastr, $modalInstance, list,partnerList,applicationServiceSet) {
    $scope.list = list;
    $scope.addModal = {
        scale:[],
        partnerList:partnerList,
        partner:undefined,
    };
    $scope.ok = function () {
        var arr = $scope.addModal.scale.map(function (t) {
            return t.ID;
        });
        $scope.submit = {
            OrgID:$scope.addModal.partner,
            ScaleIDList:arr
        };
        if($scope.submit.ScaleIDList.length == 0){
            toastr.error("请选择合作伙伴");
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