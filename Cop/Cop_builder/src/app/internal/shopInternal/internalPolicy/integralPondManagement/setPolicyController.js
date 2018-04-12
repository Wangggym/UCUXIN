/**
 * Created by fanweihua on 2017/9/9.
 * 配置策略集
 */
app.controller('setPolicyController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr, $modal) {
    var setPolicy = {
        //入口
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
        },
        //变量声明
        variable: function () {
            $scope.model = {
                itemList: []
            };
            $scope.params = {
                token: APPMODEL.Storage.getItem('copPage_token'),
                appID: 207,
                parterID: APPMODEL.Storage.getItem("orgid"),
                uid: $stateParams.UID
            };
        },
        //操作
        operation: function () {
            //新增间接策略集
            $scope.addInDirect = function () {
                $modal.open({
                    templateUrl: 'addInDirectContent.html',
                    controller: 'addInDirectContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        model: function () {
                            return {
                                service: setPolicy.service
                            };
                        }
                    }
                });
            };
            //新增直接策略集
            $scope.addDirect = function () {
                $modal.open({
                    templateUrl: 'addDirectContent.html',
                    controller: 'addDirectContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        model: function () {
                            return {
                                service: setPolicy.service
                            };
                        }
                    }
                });
            };
            //返回
            $scope.back = function () {
                history.back();
            };
            //删除
            $scope.delete = function (item) {
                this.service.deleteUserStrategy(item)
            }.bind(this);
            //查看
            $scope.view = function (item) {
                var url = '', controller = '';
                if (item.SType === 1) {
                    url = 'directContent.html';
                    controller = 'directContentCtrl';
                } else {
                    url = 'inDirectContent.html';
                    controller = 'inDirectContentCtrl';
                }
                $modal.open({
                    templateUrl: url,
                    controller: controller,
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        model: function () {
                            return {
                                service: setPolicy.service,
                                item: item,
                                GName: $stateParams.GName
                            };
                        }
                    }
                });
            };
            this.service.getUserStrategies();//获取当前关爱使适用的策略列表集合
        },
        //服务
        service: {
            //获取当前关爱使适用的策略列表集合
            getUserStrategies: function () {
                applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetUserStrategies.send($scope.params).then(function (data) {
                    if (data.Ret === 0) {
                        $scope.model.itemList = data.Data;
                    }
                });
            },
            //删除策略集
            deleteUserStrategy: function (item) {
                applicationServiceSet.shopInternalServiceApi.integralPondManagement.DeleteUserStrategy.send(undefined, [APPMODEL.Storage.getItem('copPage_token'), $scope.params.uid, item.ID]).then(function (data) {
                    if (data.Ret === 0) {
                        $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
                    }
                });
            },
            //获取直接策略的规则清单
            getBaseRules: function (item, callBack) {
                applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetBaseRules.send([APPMODEL.Storage.getItem('copPage_token'), 207, item.ID]).then(function (data) {
                    if (data.Ret === 0) {
                        callBack(data.Data)
                    }
                });
            },
            //获取间接行为策略下的规则清单
            getMinRules: function (item, callBack) {
                applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetMinRules.send([APPMODEL.Storage.getItem('copPage_token'), 207, item.ID]).then(function (data) {
                    if (data.Ret === 0) {
                        callBack(data.Data)
                    }
                });
            },
            //获取未被当前关爱使设置的策略列表
            getStrategyBySelect: function (callBack) {
                applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetStrategyBySelect.send([APPMODEL.Storage.getItem('copPage_token'), 207, APPMODEL.Storage.getItem("orgid"), $stateParams.UID]).then(function (data) {
                    if (data.Ret === 0) {
                        callBack(data.Data)
                    }
                });
            },
            //获取当前用户任教的班级列表清单
            getUserTeachClasses: function (callBack) {
                applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetUserTeachClasses.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.UID, $stateParams.GID]).then(function (data) {
                    if (data.Ret === 0) {
                        callBack(data.Data)
                    }
                });
            },
            //新增用户适用的策略集
            setUserStrategy: function (item, callBack) {
                // var calIds=[item.classID];
                // var gids={};
                // for(var i= 0; i<calIds.length;i++){
                //     gids['gids['+i+']'] = calIds[i];
                // }

                applicationServiceSet.shopInternalServiceApi.integralPondManagement.SetUserStrategy.send([[item.classID]], [APPMODEL.Storage.getItem('copPage_token'), item.ID, $stateParams.GID, $stateParams.UID]).then(function (data) {
                    if (data.Ret === 0) {
                        toastr.success('新增成功');
                        setPolicy.service.getUserStrategies();//获取当前关爱使适用的策略列表集合
                        callBack()
                    }
                });
            }
        }
    };
    setPolicy.init();//入口
}]);
//查看直接行为规则
app.controller('directContentCtrl', ['$scope', '$modalInstance', 'model', function ($scope, $modalInstance, model) {
    $scope.ctrl = {
        name: model.GName + '直接行为规则',
        itemList: []
    };
    model.service.getBaseRules(model.item, function (data) {
        $scope.ctrl.itemList = data;
    });
    $scope.closeDirect = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
//查看间接行为规则
app.controller('inDirectContentCtrl', ['$scope', '$modalInstance', 'model', function ($scope, $modalInstance, model) {
    $scope.ctrl = {
        name: model.GName + '间接行为规则',
        itemList: []
    };
    model.service.getMinRules(model.item, function (data) {
        $scope.ctrl.itemList = data;
    });
    $scope.closeInDirect = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
//新增直接策略集
app.controller('addDirectContentCtrl', ['$scope', '$modalInstance', 'model', function ($scope, $modalInstance, model) {
    $scope.ctrl = {
        itemList: [],
        sidList: [],
        sid: undefined
    };
    model.service.getStrategyBySelect(function (data) {
        for (var i in data) {
            if (data[i].SType === 1) {
                $scope.ctrl.sidList.push(data[i])
            }
        }
    });
    $scope.changeSid = function () {
        model.service.getBaseRules({
            ID: $scope.ctrl.sid
        }, function (data) {
            $scope.ctrl.itemList = data;
        });
    };
    $scope.AddDirect = function () {
        if ($scope.ctrl.sid) {
            model.service.setUserStrategy({ID: $scope.ctrl.sid, classID: []}, function () {
                $modalInstance.dismiss('cancel');
            })
        }
    };
    $scope.closeAddDirect = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
//新增间接策略集
app.controller('addInDirectContentCtrl', ['$scope', '$modalInstance', 'model', function ($scope, $modalInstance, model) {
    $scope.ctrl = {
        itemList: [],
        sidList: [],
        sid: undefined,
        classID: undefined,
        classList: []
    };
    model.service.getStrategyBySelect(function (data) {
        for (var i in data) {
            if (data[i].SType !== 1) {
                $scope.ctrl.sidList.push(data[i])
            }
        }
    });
    model.service.getUserTeachClasses(function (data) {
        $scope.ctrl.classList = data;
    });
    //选择策略集
    $scope.changeSid = function () {
        model.service.getMinRules({
            ID: $scope.ctrl.sid
        }, function (data) {
            $scope.ctrl.itemList = data;
        });
    };
    //保存
    $scope.AddInDirect = function () {
        if ($scope.ctrl.sid) {
            model.service.setUserStrategy({ID: $scope.ctrl.sid, classID: [$scope.ctrl.classID]})
        }
    };
    //关闭
    $scope.closeAddInDirect = function () {
        $modalInstance.dismiss('cancel');
    };
}]);