/**
 * Created by fanweihua on 2017/7/13.
 * 基本信息
 */
app.controller('basicInformationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var basicInformation = {
        //入口
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
        },
        //变量声明
        variable: function () {
            $scope.model = {
                ID: 0,
                Name: undefined,//量表名称
                PsyOrgID: undefined,//来源机构ID
                PsyOrgName: undefined,//来源机构名称
                Notice: undefined,//测试须知
                Intro: undefined,//量表介绍
                ST: undefined,//状态
                MType: undefined,//测试人群
                Remark: undefined,//备注
                CDateTime: undefined,//创建时间
                UDateTime: undefined,//修改时间
                SellName:undefined//量表销售名称
            };
            $scope.params = {
                institutionList: [],
                crowdList: [{
                    id: 11,
                    name: '教师'
                }, {
                    id: 12,
                    name: '家长'
                }, {
                    id: 13,
                    name: '学生'
                }, {
                    id: 15,
                    name: '公共'
                }]
            };
            if ($stateParams.scaleID || APPMODEL.Storage.getItem("scaleID")) {
                $scope.model.ID = $stateParams.scaleID || APPMODEL.Storage.getItem("scaleID");
                this.service._getScale();//查询单条量表信息
            }
        },
        //操作
        operation: function () {
            //选择来源机构
            $scope.changePsyOrgID = function (item) {
                $scope.model.PsyOrgName =item.Name
            };
            $scope.clickCheckList = function (crowd) {
                $scope.model.MType = crowd.id;
            };
            //下一步
            $scope.next = function () {
                if(!$scope.model.MType){
                    toastr.error("请选择测试人群");
                    return;
                }
                if(!$scope.model.Intro){
                    toastr.error("量表介绍不能为空");
                    return;
                }
                this.service._addOrUpdateScale();//新增或修改量表基础数据
            }.bind(this);
            //返回
            $scope.goBack = function () {
                $state.go("access.app.internal.inventoryManagement.scaleMaintenance");
            };
            this.service._getAllPsyOrgList();//获取全部的心理机构，查询条件使用
        },
        //服务
        service: (function () {
            return {
                //获取全部的心理机构，查询条件使用
                _getAllPsyOrgList: function () {
                    applicationServiceSet.mentalHealthService._InventoryManagement._GetAllPsyOrgList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.params.institutionList = data.Data;
                        }
                    });
                },
                //新增或修改量表基础数据
                _addOrUpdateScale: function () {
                    applicationServiceSet.mentalHealthService._InventoryManagement._AddOrUpdateScale.send($scope.model, [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            APPMODEL.Storage.setItem("scaleID", data.Data);
                            $location.url("access/app/internal/inventoryManagement/addTheScale/userAttributes?scaleID=" + data.Data);
                        }
                    });
                },
                //查询单条量表信息
                _getScale: function () {
                    applicationServiceSet.mentalHealthService._InventoryManagement._GetScale.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.ID]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model = data.Data;
                        }
                    });
                }
            };
        })()
    };
    basicInformation.init();//入口
}]);