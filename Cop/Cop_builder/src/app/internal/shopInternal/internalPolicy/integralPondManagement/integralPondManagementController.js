/**
 * Created by fanweihua on 2017/9/7.
 * 关爱使管理
 */
app.controller('integralPondManagementController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    var integralPondManagement = {
        //入口
        init: function () {
            this.variable();//变量声明
            this.service.pageIndex();//分页
            this.service.getCurUserSchool();//获取学校列表
            this.operation();//操作
        },
        //变量声明
        variable: function () {
            $scope.model = {
                itemList: [],
                schoolList: [],
                checkAll: false
            };
            $scope.params = {
                schId: undefined,
                search: undefined,
                appID: 207,
                ParterID: APPMODEL.Storage.getItem("orgid"),
                pageSize: 20,
                pageIndex: 1
            };
        },
        //操作
        operation: function () {
            //全选
            $scope.checkAll = function () {
                $scope.model.checkAll = !$scope.model.checkAll;
                for (var i in $scope.model.itemList) {
                    $scope.model.itemList[i].checked = $scope.model.checkAll;
                }
            };
            //单选
            $scope.check = function (item) {
                item.checked = !item.checked;
            };
            //配置策略集
            $scope.configuration = function (item) {
                $location.path('/access/app/internal/internalPolicy/setPolicy').search({
                    UName: item.UName,
                    GName: item.GName,
                    UID: item.UID,
                    GID: item.GID
                });
            };
            //搜索
            $scope.search = function () {
                this.service.getGAiUserPoints();//分页数据
            }.bind(this);
            //创建关爱使
            $scope.create = function () {
                $location.url('/access/app/internal/internalPolicy/createIntegral')
            };
            //删除关爱使
            $scope.delete = function () {
                this.service.removeRoleMember();//删除关爱使
            }.bind(this);
            this.service.getGAiUserPoints();//分页数据
        },
        //设置
        setting: {
            //数据处理
            dataHandle: function (data) {
                if (data.ViewModelList) {
                    $scope.model.itemList = data.ViewModelList;//transformation Data
                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
                }
            }
        },
        service: {
            //获取学校列表
            getCurUserSchool: function () {
                applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetCurUserSchool.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                    if (data.Ret === 0) {
                        $scope.model.schoolList = data.Data;
                    }
                });
            },
            //分页数据
            getGAiUserPoints: function () {
                applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetGAiUserPoints.send($scope.params).then(function (data) {
                    if (data.Ret === 0) {
                        integralPondManagement.setting.dataHandle(data.Data);//数据处理
                    }
                });
            },
            //删除关爱使
            removeRoleMember: function () {
                var mids = [];
                for (var i in $scope.model.itemList) {
                    if ($scope.model.itemList[i].checked) {
                        mids.push($scope.model.itemList[i].ID)
                    }
                }
                applicationServiceSet.shopInternalServiceApi.integralPondManagement.RemoveRoleMember.send([mids], [APPMODEL.Storage.getItem('copPage_token'), 11003]).then(function (data) {
                    if (data.Ret === 0) {
                        for (var s in mids) {
                            for (var i in $scope.model.itemList) {
                                if (mids[s] === $scope.model.itemList[i].ID) {
                                    $scope.model.itemList.splice($scope.model.itemList.indexOf($scope.model.itemList[i]), 1);
                                    break;
                                }
                            }
                        }
                        toastr.success('删除成功')
                    }
                });
            },
            //分页
            pageIndex: function () {
                $scope.pageIndex = {
                    fliPage: function (page) {
                        $scope.params.pageIndex = page.pIndex;
                        applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetGAiUserPoints.send($scope.params).then(function (data) {
                            if (data.Ret === 0) {
                                integralPondManagement.setting.dataHandle(data.Data);//数据处理
                            }
                        });
                    },
                    nextPage: function (pageNext) {
                        $scope.params.pageIndex = pageNext;
                        applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetGAiUserPoints.send($scope.params).then(function (data) {
                            if (data.Ret === 0) {
                                integralPondManagement.setting.dataHandle(data.Data);//数据处理
                            }
                        });
                    },
                    previousPage: function (pageNext) {
                        $scope.params.pageIndex = pageNext;
                        applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetGAiUserPoints.send($scope.params).then(function (data) {
                            if (data.Ret === 0) {
                                integralPondManagement.setting.dataHandle(data.Data);//数据处理
                            }
                        });
                    }
                };
            }
        }
    };
    integralPondManagement.init();//入口
}]);