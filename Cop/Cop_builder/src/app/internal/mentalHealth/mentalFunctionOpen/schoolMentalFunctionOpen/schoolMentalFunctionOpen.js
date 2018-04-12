app.controller('schoolMentalFunctionOpen', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
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
            //更新缓存
            $scope.updateCache = function (item) {
                window.open(item.UpdateCacheUrl);
            };
            //search
            $scope.search = function () {
                $scope.model.school = $scope.model.school === undefined ? 0 : $scope.model.school;
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
            $scope.openAdd = function () {

               var modal =  $modal.open({
                    templateUrl: 'mentalFunctionOpenAdd.html',
                    controller: 'mentalFunctionOpenAdd',
                    keyboard: false,
                    backdrop: false,
                    size:'md',
                    resolve: {
                        item: function () {
                            return;
                        }
                    }
                });
                modal.result.then(function (selectedItem) {

                }, function (mesg) {
                    if(mesg === 'ok'){
                        ctr.getList(1);
                    }
                });
            };
        },
        //模糊查询 根据token获取学校列表
        getSchoolList: function (schoolName) {
            applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), schoolName]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.schoolList = data.Data;
                }
            });
        },
        //获取列表分页
        getList:function (index) {
            applicationServiceSet.mentalHealthService._MentalOpen._GetPsyGroupPage.send([APPMODEL.Storage.getItem('copPage_token'),20,index,$scope.model.school]).then(function (data) {
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
                    applicationServiceSet.mentalHealthService._MentalOpen._GetPsyGroupPage.send([APPMODEL.Storage.getItem("copPage_token"),20,page.pIndex,$scope.model.school]).then(function (data) {
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
                    applicationServiceSet.mentalHealthService._MentalOpen._GetPsyGroupPage.send([APPMODEL.Storage.getItem("copPage_token"),20,pageNext,$scope.model.school]).then(function (data) {
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
                    applicationServiceSet.mentalHealthService._MentalOpen._GetPsyGroupPage.send([APPMODEL.Storage.getItem("copPage_token"),20,pageNext,$scope.model.school]).then(function (data) {
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

app.controller('mentalFunctionOpenEdit', ['$scope', 'toastr', '$modalInstance', 'item','applicationServiceSet', function ($scope, toastr, $modalInstance, item,applicationServiceSet) {
    $scope.item = $.extend(true,{},item);
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function () {
        if(!$scope.item.WebSiteUrl){
            toastr.error("请填写心理网站域名");
            return;
        }
        applicationServiceSet.mentalHealthService._MentalOpen._SavePsyGroup.send([$scope.item.GID,$scope.item.WebSiteUrl],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
            if(data.Ret == 0){
                toastr.success("修改成功");
                $modalInstance.dismiss('cancel');

            }
        })
    };
}]);
app.controller('mentalFunctionOpenAdd', ['$scope', 'toastr', '$modalInstance','applicationServiceSet', function ($scope, toastr, $modalInstance,applicationServiceSet) {
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.model = {
    };
    $scope.ok = function () {
        if(!$scope.model.schoolList){
            toastr.error("请选择学校");
            return;
        }
        var arr = $scope.model.schoolList.filter(function (t) {
            return t.GID == $scope.model.school;
        });
        if(arr.length == 0){
            toastr.error("请选择学校");
            return;
        }
        if($scope.model.WebSitedir == undefined){
            toastr.error("请填写学校字母缩写");
            return;
        }
        $scope.model.schoolName = arr[0].FName;
        applicationServiceSet.mentalHealthService._MentalOpen._OpenPsyGroup.send([$scope.model.school,$scope.model.schoolName,$scope.model.WebSitedir,$scope.model.WebSiteTemplate,$scope.model.WebSiteUrl],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
            if(data.Ret == 0){
                window.open(data.Data.UpdateCacheUrl);
                toastr.success("添加成功");
                $modalInstance.dismiss('ok');

            }
        })
    };
    //获取网站模版
    applicationServiceSet.mentalHealthService._MentalOpen._GetCmsTemplate.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
            $scope.webList = data.Data;
        }
    });
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
    };
    $scope.refreshAddresses = function (schoolName) {
        if (schoolName) {
            $scope.model.schoolName = schoolName;
            getSchoolList(schoolName);//get school org pages list
        }
    };
}]);