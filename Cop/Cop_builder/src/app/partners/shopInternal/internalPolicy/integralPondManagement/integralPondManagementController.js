/**
 * Created by fanweihua on 2017/9/7.
 * 关爱使管理
 */
app.controller('integralPondManagementController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr, $modal) {
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
            if (sessionStorage.getItem('sessionObj')) {
                var obj = JSON.parse(sessionStorage.getItem('sessionObj'));
                $scope.params.schId = obj.schId;
                $scope.params.search = obj.search;
                $scope.params.pageIndex = obj.pageIndex;
                delete sessionStorage.sessionObj;
            }
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
                var sessionObj = {
                    schId: $scope.params.schId,
                    search: $scope.params.search,
                    pageIndex: $scope.params.pageIndex
                };
                sessionStorage.setItem('sessionObj', JSON.stringify(sessionObj));
                $location.path('/access/app/partner/internalPolicy/setPolicy').search({
                    UName: item.UName,
                    GName: item.GName,
                    UID: item.UID,
                    GID: item.GID
                });
            };
            //搜索
            $scope.search = function () {
                $scope.params.pageIndex = 1;
                this.service.getGAiUserPoints();//分页数据
            }.bind(this);
            //创建关爱使
            $scope.create = function () {
                $location.url('/access/app/partner/internalPolicy/createIntegral')
            };
            //删除关爱使
            $scope.delete = function () {
                this.service.removeRoleMember();//删除关爱使
            }.bind(this);
            //积分调整
            $scope.regulate = function (item) {
                $modal.open({
                    templateUrl: 'integralRegulate.html',
                    controller: 'integralRegulateCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        model: function () {
                            return {
                                service: integralPondManagement.service,
                                item: item
                            };
                        }
                    }
                });
            };
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
        //服务
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
                if (mids.length === 0) {
                    toastr.error('请选择要删除的关爱使');
                    return;
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
            //增加积分
            incPointAsync: function (model, callBack) {
                applicationServiceSet.shopInternalServiceApi.integralPondManagement.IncPointAsync.send(undefined, model).then(function (data) {
                    if (data.Ret === 0) {
                        toastr.success('调整成功');
                        callBack();
                    }
                });
            },
            //消耗积分
            decPoint: function (model, callBack) {
                applicationServiceSet.shopInternalServiceApi.integralPondManagement.DecPoint.send(undefined, model).then(function (data) {
                    if (data.Ret === 0) {
                        toastr.success('调整成功');
                        callBack();
                    }
                });
            },
            //分页
            pageIndex: function () {
                $scope.pageIndex = {
                    fliPage: function (page) {
                        $scope.params.pageIndex = page.pIndex;
                        $scope.model.checkAll = false;
                        applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetGAiUserPoints.send($scope.params).then(function (data) {
                            if (data.Ret === 0) {
                                integralPondManagement.setting.dataHandle(data.Data);//数据处理
                            }
                        });
                    },
                    nextPage: function (pageNext) {
                        $scope.params.pageIndex = pageNext;
                        $scope.model.checkAll = false;
                        applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetGAiUserPoints.send($scope.params).then(function (data) {
                            if (data.Ret === 0) {
                                integralPondManagement.setting.dataHandle(data.Data);//数据处理
                            }
                        });
                    },
                    previousPage: function (pageNext) {
                        $scope.params.pageIndex = pageNext;
                        $scope.model.checkAll = false;
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
//积分调整
app.controller('integralRegulateCtrl', ['$scope', '$modalInstance','toastr', 'model', function ($scope, $modalInstance,toastr, model) {
    $scope.ctrl = {
        AppID: model.item.AppID,
        uID: model.item.UID,
        actionCode: 'presentpoint',
        pointVal: '',
        desc: '',
        name: model.item.UName,
        itemList: [],
        plusState: true,
        score: model.item.Score
    };
    //添加积分
    $scope.plus = function () {
        $scope.ctrl.plusState = true;
    };
    //扣减积分
    $scope.minus = function () {
        $scope.ctrl.plusState = false;
    };
    //确认调整
    $scope.confirm = function () {

         if(!(/^[0-9]+$/).test($scope.ctrl.pointVal)){
             toastr.error('请输入正整数');
             return false;
         }

        var parmas = {
            token: APPMODEL.Storage.getItem('copPage_token'),
            appID: $scope.ctrl.AppID,
            uID: $scope.ctrl.uID,
            actionCode: $scope.ctrl.plusState ? 'presentpoint' : 'deductpoint',
            pointVal: $scope.ctrl.pointVal,
            desc: $scope.ctrl.desc
        };
        if ($scope.ctrl.plusState) {
            model.item.Score = model.item.Score + $scope.ctrl.pointVal;
            //增加积分
            model.service.incPointAsync(parmas, function () {
                $modalInstance.dismiss('cancel');
            })
        } else {
            model.item.Score = model.item.Score - $scope.ctrl.pointVal;
            //消耗积分
            model.service.decPoint(parmas, function () {
                $modalInstance.dismiss('cancel');
            })
        }
    };
    //取消调整
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);