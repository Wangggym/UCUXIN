/**
 * Created by fanweihua on 2016/11/21.
 * listOfOrganizationsController
 * list of organizations
 */
app.controller('listOfOrganizationsController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * 组织机构列表
     * @type {{init: init, variable: variable, serviceApi, operation: operation, setting}}
     */
    var listOfOrganizations = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.serviceApi.pageIndex();//分页服务
            this.operation();//操作
            this.setting.tip();
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                nameId: undefined,
                type: undefined,
                pSize: 20,
                pIndex: 1,
                typeList: [
                    {
                        "id": 2,
                        "name": "内部运营"
                    },
                    {
                        "id": 4,
                        "name": "家校共育基金"
                    },
                    {
                        "id": 8,
                        "name": "合作伙伴"
                    },
                    {
                        "id": 16,
                        "name": "商家"
                    },
                    {
                        "id": 32,
                        "name": "教师"
                    }
                ]
            };
        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * 获取组织分页数据
                 */
                getOrgPage: function () {
                    applicationServiceSet.internalServiceApi.organizationalInstitution.GetOrgPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.nameId, $scope.model.type, $scope.model.pSize, $scope.model.pIndex]).then(function (data) {
                        if (data.Ret == 0) {
                            listOfOrganizations.setting.dataChange(data.Data);//类型转换
                        }
                    });
                },
                /**
                 * 根据组织ID获取组织信息
                 * @param item
                 * @param func
                 */
                getOrg: function (item, func) {
                    applicationServiceSet.internalServiceApi.organizationalInstitution.GetOrg.send([APPMODEL.Storage.getItem('copPage_token'), item.OrgID]).then(function (data) {
                        if (data.Ret == 0) {
                            func(data.Data);
                        }
                    });
                },
                /**
                 * 添加或更新组织信息
                 * @param item
                 * @param model
                 * @param func
                 */
                addOrUpOrg: function (item, model, func) {
                    applicationServiceSet.internalServiceApi.organizationalInstitution.AddOrUpOrg.send([item.OrgID, item.name, item.typeId, item.STType, item.Desc], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            if (item.ST == 1) {
                                item.ST = 0;
                            }
                            toastr.success("保存成功");
                            if (model.isEdit) {
                                model.Name = item.name;
                                if (!item.ST) {
                                    model.STName = "正常";
                                } else {
                                    model.STName = "失效";
                                }
                                model.ST = item.ST;
                            } else {
                                var arr = {
                                    "Name": data.Data.Name,
                                    "OrgType": data.Data.OrgType,
                                    "typeName": undefined,
                                    "OrgID": "" + data.Data.OrgID,
                                    "ST": item.ST,
                                    "STName": undefined,
                                    "CDate": data.Data.CDate,
                                    "Desc": data.Data.Desc
                                };
                                if (!item.ST) {
                                    arr.STName = "正常";
                                } else {
                                    arr.STName = "失效";
                                }
                                for (var i in item.typeList) {
                                    if (item.typeList[i].id == data.Data.OrgType) {
                                        arr.typeName = item.typeList[i].name;
                                        break;
                                    }
                                }
                                for (var s in item.STList) {
                                    if (item.STList[s].id == data.Data.ST) {
                                        arr.STName = item.STList[s].name;
                                        break;
                                    }
                                }
                                $scope.model.itemList.unshift(arr);
                            }
                            func();
                        }
                    });
                },
                /**
                 * paging function
                 */
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
                            applicationServiceSet.internalServiceApi.organizationalInstitution.GetOrgPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.nameId, $scope.model.type, $scope.model.pSize, page.pIndex]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfOrganizations.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.organizationalInstitution.GetOrgPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.nameId, $scope.model.type, $scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfOrganizations.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.organizationalInstitution.GetOrgPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.nameId, $scope.model.type, $scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfOrganizations.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        }
                    };
                }
            };
        })(),
        /**
         * 操作
         */
        operation: function () {
            /**
             * 查询
             */
            $scope.search = function () {
                listOfOrganizations.serviceApi.getOrgPage();//服务集合
            };
            /**
             * 编辑
             * @param item
             */
            $scope.edit = function (item) {
                if (item) {
                    listOfOrganizations.serviceApi.getOrg(item, function (data) {
                        $modal.open({
                            templateUrl: 'newAddMyModalContent.html',
                            controller: 'newAddMyModalContentCtrl',
                            keyboard: false,
                            backdrop: false,
                            resolve: {
                                items: function () {
                                    return [data, item, $scope.model.typeList];
                                },
                                service: function () {
                                    return listOfOrganizations.serviceApi;
                                }
                            }
                        });
                    });//根据组织ID获取组织信息
                }
            };
            /**
             * 添加组织
             */
            $scope.add = function () {
                $modal.open({
                    templateUrl: 'newAddMyModalContent.html',
                    controller: 'newAddMyModalContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [$scope.model.typeList];
                        },
                        service: function () {
                            return listOfOrganizations.serviceApi;
                        }
                    }
                });
            };
            $scope.search();//查询
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 类型转换
                 * @param data
                 */
                dataChange: function (data) {
                    for (var i in data.ViewModelList) {
                        for (var s in $scope.model.typeList) {
                            if ($scope.model.typeList[s].id == data.ViewModelList[i].OrgType) {
                                data.ViewModelList[i].typeName = $scope.model.typeList[s].name;
                                break;
                            }
                        }
                        if (data.ViewModelList[i].ST == -1) {
                            data.ViewModelList[i].STName = "失效";
                        } else {
                            data.ViewModelList[i].STName = "正常";
                        }
                    }
                    $scope.model.itemList = data.ViewModelList;
                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
                },
                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                }
            };
        })()
    };
    listOfOrganizations.init();//函数入口
}]);
/**
 * newAddMyModalContentCtrl
 */
app.controller('newAddMyModalContentCtrl', ['$scope', '$modalInstance', 'items', 'service', function ($scope, $modalInstance, items, service) {
    $scope.newModel = {
        OrgID: undefined,
        name: undefined,
        typeId: undefined,
        typeList: [],
        ST: undefined,
        disabled: false,
        STList: [
            {
                "STid": 1,
                "id": 0,
                "name": "正常"
            },
            {
                "STid": -1,
                "id": -1,
                "name": "失效"
            }
        ],
        Desc: undefined
    };
    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    /**
     * save
     */
    $scope.save = function () {
        if (items[1]) {
            items[1].isEdit = true;
            if ($scope.newModel.ST == 1) {
                $scope.newModel.STType = 0;
            } else if ($scope.newModel.ST == -1) {
                $scope.newModel.STType = -1;
            }
            service.addOrUpOrg($scope.newModel, items[1], function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        } else {
            items[0].isEdit = false;
            if ($scope.newModel.ST == 1) {
                $scope.newModel.STType = 0;
            } else if ($scope.newModel.ST == -1) {
                $scope.newModel.STType = -1;
            }
            service.addOrUpOrg($scope.newModel, items[0], function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        }

    };
    setTimeout(function () {
        $(".modal-content").draggable({ containment: "#app", scroll: false });
    }, 100);
    if (items[1]) {
        for (var i in $scope.newModel.STList) {
            if (items[1].ST == 0) {
                items[1].STid = 1;
            } else {
                items[1].STid = -1;
            }
        }
        $scope.newModel.Desc = items[0].Desc;
        $scope.newModel.typeList = items[2];
        $scope.newModel.OrgID = items[0].OrgID;
        $scope.newModel.typeId = items[1].OrgType;
        $scope.newModel.disabled = true;
        $scope.newModel.ST = items[1].STid;
        $scope.newModel.name = items[1].Name;
    } else {
        $scope.newModel.typeList = items[0];
    }
}]);
