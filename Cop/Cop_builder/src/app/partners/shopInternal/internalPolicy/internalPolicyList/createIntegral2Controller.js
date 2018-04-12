/**
 * Created by fanweihua on 2017/9/9.
 * 新建关爱使
 */
app.controller('createIntegralController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    var createIntegral = {
        //入口
        init: function () {
            this.variable();//变量声明
            this.service.getCurUserSchool();//获取学校列表
            this.service.pageIndex();//分页
            this.operation();//操作
        },
        //变量声明
        variable: function () {
            $scope.model = {
                gid: undefined,
                schoolList: [],
                type: undefined,
                typeList: [{
                    name: '全部',
                    id: 'all'
                }, {
                    name: '校长',
                    id: 11100
                }, {
                    name: '班主任',
                    id: 11091
                }, {
                    name: '其他',
                    id: 1
                }],
                name: undefined,
                itemList: []
            };
            $scope.params = {
                token: APPMODEL.Storage.getItem('copPage_token'),
                parterID: APPMODEL.Storage.getItem("orgid"),
                roleID: 11003,
                schID: undefined,
                roleType: undefined,
                search: undefined,
                pageSize: 20,
                pageIndex: 1
            }
        },
        //操作
        operation: function () {
            //返回
            $scope.back = function () {
                history.back();
            };
            //搜索
            $scope.search = function () {
                this.service.getMembersForRoleSelect()//获取合作伙伴学校下非关爱使身份的教职员工分页数据API
            }.bind(this);
            //新增
            $scope.new = function (item) {
                if (item.classType) {
                    return;
                }
                this.service.setMemberRoles(item);//新增关爱使
            }.bind(this);
            this.service.getMembersForRoleSelect()//获取合作伙伴学校下非关爱使身份的教职员工分页数据API
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
            //获取合作伙伴学校下非关爱使身份的教职员工分页数据API
            getMembersForRoleSelect: function () {
                $scope.params.schID = $scope.model.gid ? $scope.model.gid : undefined;
                $scope.params.search = $scope.model.name ? $scope.model.name : undefined;
                if ($scope.model.type === 'all') {
                    $scope.params.roleType = 0;
                } else {
                    $scope.params.roleType = $scope.model.type
                }
                applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetMembersForRoleSelect.send($scope.params).then(function (data) {
                    if (data.Ret === 0) {
                        createIntegral.setting.dataHandle(data.Data);//数据处理
                    }
                });
            },
            //新增关爱使
            setMemberRoles: function (item) {
                applicationServiceSet.shopInternalServiceApi.integralPondManagement.SetMemberRoles.send([[11003]], [APPMODEL.Storage.getItem('copPage_token'), item.MID]).then(function (data) {
                    if (data.Ret === 0) {
                        toastr.success('新增成功');
                        item.classType = true
                    }
                });
            },
            //分页
            pageIndex: function () {
                $scope.pageIndex = {
                    fliPage: function (page) {
                        $scope.params.pageIndex = page.pIndex;
                        $scope.params.schID = $scope.model.gid ? $scope.model.gid : undefined;
                        $scope.params.search = $scope.model.name ? $scope.model.name : undefined;
                        applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetMembersForRoleSelect.send($scope.params).then(function (data) {
                            if (data.Ret === 0) {
                                createIntegral.setting.dataHandle(data.Data);//数据处理
                            }
                        });
                    },
                    nextPage: function (pageNext) {
                        $scope.params.pageIndex = pageNext;
                        $scope.params.schID = $scope.model.gid ? $scope.model.gid : undefined;
                        $scope.params.search = $scope.model.name ? $scope.model.name : undefined;
                        applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetMembersForRoleSelect.send($scope.params).then(function (data) {
                            if (data.Ret === 0) {
                                createIntegral.setting.dataHandle(data.Data);//数据处理
                            }
                        });
                    },
                    previousPage: function (pageNext) {
                        $scope.params.pageIndex = pageNext;
                        $scope.params.schID = $scope.model.gid ? $scope.model.gid : undefined;
                        $scope.params.search = $scope.model.name ? $scope.model.name : undefined;
                        applicationServiceSet.shopInternalServiceApi.integralPondManagement.GetMembersForRoleSelect.send($scope.params).then(function (data) {
                            if (data.Ret === 0) {
                                createIntegral.setting.dataHandle(data.Data);//数据处理
                            }
                        });
                    }
                };
            }
        }
    };
    createIntegral.init();//入口
}]);