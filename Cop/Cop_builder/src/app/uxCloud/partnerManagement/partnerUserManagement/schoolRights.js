
app.controller('schoolRights', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    $scope.userName = $stateParams.Name;
    $scope.orgName = $stateParams.orgName;

    $scope.hasRight = 'false';
    $scope.schoolName = '';
    $scope.check = false;
    /**
    *  获取省
    * */
    getProvinceList();
    pageIndex();
    function getProvinceList() {
        applicationServiceSet.internalServiceApi.userManagement.GetRegionList.send([APPMODEL.Storage.getItem('copPage_token'),0]).then(function (data) {
            if (data.Ret == 0) {
                $scope.provinceList = data.Data;
            }
        });
    }
    $scope.getCityList = function (rid) {
        applicationServiceSet.internalServiceApi.userManagement.GetRegionList.send([APPMODEL.Storage.getItem('copPage_token'),rid]).then(function (data) {
            if (data.Ret == 0) {
                $scope.cityList = data.Data;
            }
        });
    };
    $scope.search = function () {
        $scope.getList()
    };
    $scope.getList = function () {
        $scope.check = false;
        $scope.selectedArray = [];
        var rid = $scope.area || $scope.city || $scope.province || 0;
        applicationServiceSet.internalServiceApi.userManagement.GetPageAdminAccessGroups.send([APPMODEL.Storage.getItem('copPage_token'),
            $stateParams.orgID,$stateParams.UID,rid,$scope.schoolName,$scope.hasRight,15,1]).then(function (data) {
            if (data.Ret == 0) {
                data.Data.ViewModelList.forEach(function (e) {
                    e.checked = false;
                });
                if(data.Data.TotalRecords==0){
                    toastr.success('暂未查询到数据,请重新选择条件查询');
                }
                $scope.list = data.Data.ViewModelList;
                $scope.pageIndex.pages = data.Data.Pages;//paging pages
                $scope.pageIndex.pageindexList(data.Data);//paging
            }
        });
    };
    //默认调取未分配权限列表
    Default();
    function Default(){
        $scope.getList()
    }
    $scope.checkAll = function () {
        $scope.check = !$scope.check;
        $scope.selectedArray = $scope.check ? $scope.list : [];
        $scope.list.forEach(function (e) {
              if($scope.check){
                  e.checked = true;
              }else{
                  e.checked = false;
              }
          })
    };
    $scope.select = function (item) {
        item.checked = !item.checked;
        $scope.selectedArray = $scope.list.filter(function (e) {
            return e.checked == true
        });
        console.log($scope.selectedArray)
    };
    /*分页*/
    function pageIndex () {
        /**
         * paging index send
         */
        $scope.pageIndex = {
            /**
             * click paging
             * @param page
             */
            fliPage: function (page) {
                applicationServiceSet.internalServiceApi.userManagement.GetPageAdminAccessGroups.send([APPMODEL.Storage.getItem('copPage_token'),
                    $stateParams.orgID,$stateParams.UID,rid,$scope.schoolName,$scope.hasRight,15,page.pIndex]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.list = data.Data.ViewModelList;
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
                applicationServiceSet.internalServiceApi.userManagement.GetPageAdminAccessGroups.send([APPMODEL.Storage.getItem('copPage_token'),
                    $stateParams.orgID,$stateParams.UID,rid,$scope.schoolName,$scope.hasRight,15,pageNext]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.list = data.Data.ViewModelList;
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
                applicationServiceSet.internalServiceApi.userManagement.GetPageAdminAccessGroups.send([APPMODEL.Storage.getItem('copPage_token'),
                    $stateParams.orgID,$stateParams.UID,rid,$scope.schoolName,$scope.hasRight,15,pageNext]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.list = data.Data.ViewModelList;
                        $scope.pageIndex.pages = data.Data.Pages;//paging pages
                        $scope.pageIndex.pageindexList(data.Data);//paging
                    }
                });
            }
        };
    }

    $scope.getAreaList = function (rid) {
        applicationServiceSet.internalServiceApi.userManagement.GetRegionList.send([APPMODEL.Storage.getItem('copPage_token'),rid]).then(function (data) {
            if (data.Ret == 0) {
                $scope.areaList = data.Data;
            }
        });
    };
    /*添加*/
    $scope.add = function (item) {
        if(!$scope.selectedArray || $scope.selectedArray.length == 0){
            toastr.info('请至少选中一个')
            return;
        }
        var add_array = [];
        $scope.selectedArray.forEach(function (e) {
            delete e.checked;
            add_array.push(e.ID)
        });
        applicationServiceSet.internalServiceApi.userManagement.AddGroupAdmins.send([add_array],[$stateParams.orgID,$stateParams.UID]).then(function (data) {
            if (data.Ret == 0) {
                toastr.success('添加成功');
                $scope.getList();
            }
        });
    }
    /*删除*/
    $scope.del = function (item) {
        if(!$scope.selectedArray || $scope.selectedArray.length == 0){
            toastr.info('请至少选中一个')
            return;
        }
        var add_array = [];
        $scope.selectedArray.forEach(function (e) {
            delete e.checked;
            add_array.push(e.ID)
        });
        applicationServiceSet.internalServiceApi.userManagement.DeleteOrgAdminGroup.send([add_array],[$stateParams.orgID,$stateParams.UID]).then(function (data) {
            if (data.Ret == 0) {
                toastr.success('删除成功');
                $scope.getList();
            }
        });
    }
}]);