/**
 * Created by fanweihua on 2017/7/12.
 * 量表维护
 */
app.controller('scaleMaintenanceController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var scaleMaintenance = {
        //入口
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
            this.service.pageIndex();//page index
        },
        //变量声明
        variable: function () {
            $scope.model = {
                name: undefined,
                institution: undefined,
                institutionList: [],//来源机构
                itemList: [],
                state: 2,
                stateList: [{
                    Name: '未发布',
                    ID: 0
                }, {
                    Name: '发布',
                    ID: 1
                }, {
                    Name: '全部',
                    ID: 2
                }],
                pSize: 15,
                pIndex: 1
            };
            $scope.params = {
                token: APPMODEL.Storage.getItem('copPage_token'),
                pageIndex: $scope.model.pIndex,
                pageSize: $scope.model.pSize,
                scaleName: $scope.model.name,
                psyOrgID: 0,
                publishStatus: $scope.model.state
            };
        },
        //操作
        operation: function () {
            //查询
            $scope.search = function () {
                if($scope.model.institution != ""){
                    $scope.params.psyOrgID = $scope.model.institution;
                }
                scaleMaintenance.service._getScalePage();//获取量表分页列表
            };
            //新增
            $scope.new = function () {
                delete APPMODEL.Storage.scaleID;
                $location.url('access/app/internal/inventoryManagement/addTheScale/basicInformation');
            };
            //修改
            $scope.modification = function (item) {
                $location.url('access/app/internal/inventoryManagement/addTheScale/basicInformation?scaleID=' + item.Scale.ID);
            };
            //删除
            $scope.deleteMine = function (item) {
                this.service._deleteScale(item);//删除量表
            }.bind(this);
            //发布
            $scope.release = function (item) {
                if(item.Scale.ST == 1){
                    toastr.error("已发布");
                    return;
                }
                this.service._SetScalePublishStatus(true,item);
            }.bind(this);
            this.service._getAllPsyOrgList();//获取全部的心理机构，查询条件使用
            $scope.search();
        },
        //设置
        setting: (function () {
            return {
                //数据处理
                dataHandle: function (data) {
                    // for (var i in data.ViewModelList) {
                    //     if (data.ViewModelList[i].FactorDescAttrs.length == 0) {
                    //         continue;
                    //     }
                    //     for (var s in data.ViewModelList[i].FactorDescAttrs) {
                    //         data.ViewModelList[i].Scale.PsyAttrName += (s == 0 ? '' : ',') + data.ViewModelList[i].FactorDescAttrs[s].PsyAttrName;
                    //     }
                    // }

                    $scope.model.itemList = data.ViewModelList;
                    $scope.model.itemList.map(function (e, i) {
                       var s = e.FactorDescAttrs.map(function (t) {
                           return t.PsyAttrName;
                       });
                        e.PsyAttrName = s.join(",");
                    });

                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
                },
                paramsData: function () {
                    $scope.params.publishStatus = $scope.model.state;
                    $scope.params.scaleName = $scope.model.name;
                }
            };
        })(),
        //服务集合
        service: (function () {
            return {
                //获取全部的心理机构，查询条件使用
                _getAllPsyOrgList: function () {
                    applicationServiceSet.mentalHealthService._InventoryManagement._GetAllPsyOrgList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.institutionList = data.Data;
                        }
                    });
                },
                //删除量表
                _deleteScale: function (item) {
                    applicationServiceSet.mentalHealthService._InventoryManagement._DeleteScale.send(undefined, [APPMODEL.Storage.getItem('copPage_token'), item.Scale.ID]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
                            toastr.success('删除成功');
                        }
                    });
                },
                //获取量表分页列表
                _getScalePage: function () {
                    scaleMaintenance.setting.paramsData();
                    applicationServiceSet.mentalHealthService._InventoryManagement._GetScalePage.send($scope.params).then(function (data) {
                        if (data.Ret == 0) {
                            scaleMaintenance.setting.dataHandle(data.Data);//数据处理
                        }
                    });
                },
                //提交，发布
                _SetScalePublishStatus:function (publish,item) {
                    applicationServiceSet.mentalHealthService._InventoryManagement._SetScalePublishStatus.send(undefined,[APPMODEL.Storage.getItem("copPage_token"), item.Scale.ID, publish]).then(function (data) {
                        if(data.Ret == 0){
                            toastr.success("发布成功");
                            $scope.search();
                        }
                    })
                },
                //分页服务
                pageIndex: function () {
                    $scope.pageIndex = {
                        fliPage: function (page) {
                            $scope.params.pageIndex = page.pIndex;
                            scaleMaintenance.setting.paramsData();
                            applicationServiceSet.mentalHealthService._InventoryManagement._GetScalePage.send($scope.params).then(function (data) {
                                if (data.Ret == 0) {
                                    scaleMaintenance.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        },
                        nextPage: function (pageNext) {
                            $scope.params.pageIndex = pageNext;
                            scaleMaintenance.setting.paramsData();
                            applicationServiceSet.mentalHealthService._InventoryManagement._GetScalePage.send($scope.params).then(function (data) {
                                if (data.Ret == 0) {
                                    scaleMaintenance.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        },
                        previousPage: function (pageNext) {
                            $scope.params.pageIndex = pageNext;
                            scaleMaintenance.setting.paramsData();
                            applicationServiceSet.mentalHealthService._InventoryManagement._GetScalePage.send($scope.params).then(function (data) {
                                if (data.Ret == 0) {
                                    scaleMaintenance.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        }
                    };
                }
            };
        })()
    };
    scaleMaintenance.init();//方法入口
}]);