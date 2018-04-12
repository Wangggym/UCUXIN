/**
 * Created by fanweihua on 2016/11/28.
 * addOrEditSchoolApplicationOpeningController
 * add or edit school application opening
 */
app.controller('addOrEditSchoolApplicationOpeningController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * 新增后者编辑学校应用开通
     * @type {{init: init, variable: variable, operation: operation, setting, serviceApi}}
     */
    var addOrEditSchoolApplicationOpening = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
            this.serviceApi.getBusinessType();//获取业务类型
            this.setting.tip();//tip
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                head: undefined,
                selectedGid: undefined,
                GType: undefined,
                GName: undefined,
                schoolList: [],
                companyCode: undefined,
                hoursPerHour: undefined,
                selectedSupplier: undefined,
                schoolName: undefined,
                OpenBusiness: 0,
                GroupBusiness: 0,
                inputJudge: true,
                messageJudge: undefined,
                sendJudge: false,
                itemList: [],
                schoolItemList: [],
                isEditJudge: false,//判断是否要新增或者编辑
                supplierList: [
                    {
                        'id': 1010,
                        'name': '惠州贝安'
                    },
                    {
                        'id': 1009,
                        'name': '成都吉联'
                    },
                    {
                        'id': 1011,
                        'name': '深圳佳维思'
                    },
                    {
                        'id': 1012,
                        'name': '深圳汉维视'
                    }
                ],
                noteTypeList:[
                    {
                        'id': 0,
                        'name': '不发短信'
                    },
                    {
                        'id': 1,
                        'name': '未注册主监护人'
                    },
                    {
                        'id': 2,
                        'name': '所有主监护人'
                    }
                ]
            };
            if ($stateParams.GID) {
                $scope.model.isEditJudge = true;
                $scope.model.head = '编辑';
                $scope.model.selectedGid = $stateParams.GID;
                $scope.model.schoolName = $stateParams.GName;
                $scope.model.GType = $stateParams.GType;
                if($stateParams.ClockSmsType == 0){
                    $scope.model.messageJudge = 0;
                }else if($stateParams.ClockSmsType == 1) {
                    $scope.model.messageJudge = 1;
                }else if($stateParams.ClockSmsType == 2) {
                    $scope.model.messageJudge = 2;
                }
                if($stateParams.IsOpenExceptionClcok == 'false'){
                    $scope.model.sendJudge = false;
                }else if($stateParams.IsOpenExceptionClcok == 'true') {
                    $scope.model.sendJudge = true;
                }
                if ($stateParams.IsTel == 'false') {
                    $scope.model.inputJudge = false;
                } else if ($stateParams.IsTel == 'true') {
                    $scope.model.inputJudge = true;
                }
                $scope.model.hoursPerHour = parseInt($stateParams.Timeout);
                $scope.model.selectedSupplier = parseInt($stateParams.MorningSupply);
                $scope.model.companyCode = parseInt($stateParams.CompanyToken);
            } else {
                $scope.model.head = '新增';
            }
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * refresh service get school list
             * @param selectedGid
             */
            $scope.refreshAddresses = function (selectedGid) {
                if (selectedGid) {
                    addOrEditSchoolApplicationOpening.serviceApi.getOrgSchoolPage(selectedGid);//get school org pages list
                }
            };
            /**
             * 学校选择
             */
            $scope.schoolChange = function () {
                addOrEditSchoolApplicationOpening.serviceApi.getGroupSet();//获取单个学校数据
            };
            /**
             * 保存
             */
            $scope.save = function () {
                if (!addOrEditSchoolApplicationOpening.setting.dataJudge()) {
                    return;
                }
                if ($scope.model.isEditJudge) {
                    addOrEditSchoolApplicationOpening.serviceApi.updateGroupSet();//提供给运营平台 2、修改学校开通业务
                } else {
                    addOrEditSchoolApplicationOpening.serviceApi.addGroupSet();//提供给运营平台 1、开通新学校
                }
            };
            /**
             * 勾选开启的业务
             */
            $scope.addCheckedOne = function (itemList, index) {
                angular.forEach(itemList, function (value, key) {
                    if (key == index) {
                        if (value.checked) {
                            value.checked = false;
                        } else {
                            value.checked = true;
                        }
                    }
                });
            };
            /**
             * 是否开启晨检打电话功能
             * @param check
             */
            $scope.clickInput = function (check) {
                $scope.model.inputJudge = !check ? false : true;
            };
            /**
             * 异常刷卡是否推送
             */
            $scope.clickSendInput = function (check) {
                $scope.model.sendJudge = !check ? false : true;
            };
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 数据处理
                 * @param data
                 */
                dataHandle: function (data) {
                    var itemList = [];
                    for (var i in data) {
                        var item = {
                            "ProductName": data[i].ProductName,
                            "ProductID": data[i].ProductID,
                            "children": []
                        };
                        if (itemList.length == 0) {
                            var itemChildF = {
                                "Name": data[i].Name,
                                "Value": data[i].Value
                            };
                            item.children.push(itemChildF);
                            itemList.push(item);
                        } else {
                            var isProduct = false;
                            for (var s in itemList) {
                                if (data[i].ProductID == itemList[s].ProductID) {
                                    var itemChild = {
                                        "Name": data[i].Name,
                                        "Value": data[i].Value
                                    };
                                    itemList[s].children.push(itemChild);
                                    isProduct = true;
                                }
                            }
                            if (!isProduct) {
                                var itemChildS = {
                                    "Name": data[i].Name,
                                    "Value": data[i].Value
                                };
                                item.children.push(itemChildS);
                                itemList.push(item);
                            }
                        }
                    }
                    return itemList;
                },
                /**
                 * 开启的业务设置
                 * @param OpenBusiness
                 */
                openBusinessSetting: function (OpenBusiness) {
                    for (var i in $scope.model.itemList) {
                        for (var s in $scope.model.itemList[i].children) {
                            var Y = $scope.model.itemList[i].children[s].Value & parseInt(OpenBusiness);
                            if (Y > 0) {
                                $scope.model.itemList[i].children[s].checked = true;
                            } else {
                                $scope.model.itemList[i].children[s].checked = false;
                            }
                        }
                    }
                },
                /**
                 * 开启的学校业务设置
                 * @param GroupBusiness
                 */
                groupBusinessSetting: function (GroupBusiness) {
                    for (var i in $scope.model.schoolItemList) {
                        for (var s in $scope.model.schoolItemList[i].children) {
                            var Y = $scope.model.schoolItemList[i].children[s].Value & parseInt(GroupBusiness);
                            if (Y > 0) {
                                $scope.model.schoolItemList[i].children[s].checked = true;
                            } else {
                                $scope.model.schoolItemList[i].children[s].checked = false;
                            }
                        }
                    }
                },
                /**
                 * 数据判断
                 */
                dataJudge: function () {
                    var dataJu = true;
                    if (!$scope.model.selectedGid) {
                        toastr.error("请选择学校");
                        return false;
                    } else {
                        for (var i in $scope.model.schoolList) {
                            if ($scope.model.schoolList[i].GID == $scope.model.selectedGid) {
                                $scope.model.GType = $scope.model.schoolList[i].GTypeID;
                                $scope.model.GName = $scope.model.schoolList[i].FName;
                                break;
                            }
                        }
                    }
                    if (!$scope.model.hoursPerHour) {
                        toastr.error("请填写允许推送消息超时小时数");
                        return false;
                    }
                    $scope.model.OpenBusiness = 0;
                    for (var i in $scope.model.itemList) {
                        for (var s in $scope.model.itemList[i].children) {
                            if ($scope.model.itemList[i].children[s].checked) {
                                $scope.model.OpenBusiness += $scope.model.itemList[i].children[s].Value;
                            }
                        }
                    }
                    $scope.model.GroupBusiness = 0;
                    for (var i in $scope.model.schoolItemList) {
                        for (var s in $scope.model.schoolItemList[i].children) {
                            if ($scope.model.schoolItemList[i].children[s].checked) {
                                $scope.model.GroupBusiness += $scope.model.schoolItemList[i].children[s].Value;
                            }
                        }
                    }
                    return dataJu;
                },
                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                }
            };
        })(),
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * get school org pages list
                 * @param selectedGid
                 */
                getOrgSchoolPage: function (selectedGid) {
                    applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList = data.Data;
                        }
                    });
                },
                /**
                 * 获取单个学校数据
                 */
                getGroupSet: function () {
                    applicationServiceSet.internalServiceApi.schoolApplicationManagement.GetGroupSet.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            if (data.Data) {
                                $scope.model.selectedGid = data.Data.GID;
                                $scope.model.schoolName = data.Data.GName;
                                $scope.model.GType = data.Data.GType;
                                $scope.model.hoursPerHour = parseInt(data.Data.Timeout);
                                $scope.model.selectedSupplier = parseInt(data.Data.MorningSupply);
                                $scope.model.companyCode = parseInt(data.Data.CompanyToken);
                                addOrEditSchoolApplicationOpening.setting.openBusinessSetting(data.Data.OpenBusiness);//开启的业务设置
                                addOrEditSchoolApplicationOpening.setting.groupBusinessSetting(data.Data.GroupBusiness);//开启的学校业务设置
                                $scope.model.isEditJudge = true;
                            } else {
                                $scope.model.schoolName = undefined;
                                $scope.model.GType = undefined;
                                $scope.model.hoursPerHour = undefined;
                                $scope.model.selectedSupplier = undefined;
                                $scope.model.companyCode = undefined;
                                $scope.model.isEditJudge = false;
                                addOrEditSchoolApplicationOpening.setting.openBusinessSetting(undefined);//开启的业务设置
                                addOrEditSchoolApplicationOpening.setting.groupBusinessSetting(undefined);//开启的学校业务设置
                            }
                        }
                    });
                },
                /**
                 * 获取业务类型
                 */
                getBusinessType: function () {
                    applicationServiceSet.internalServiceApi.schoolApplicationManagement.GetBusinessType.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.itemList = addOrEditSchoolApplicationOpening.setting.dataHandle(data.Data);//数据处理
                            $scope.model.schoolItemList = addOrEditSchoolApplicationOpening.setting.dataHandle(data.Data);//数据处理
                            if ($stateParams.GID) {
                                addOrEditSchoolApplicationOpening.setting.openBusinessSetting($stateParams.OpenBusiness);//开启的业务设置
                                addOrEditSchoolApplicationOpening.setting.groupBusinessSetting($stateParams.GroupBusiness);//开启的学校业务设置
                            }
                        }
                    });
                },
                /**
                 * 提供给运营平台 1、开通新学校
                 */
                addGroupSet: function () {
                    applicationServiceSet.internalServiceApi.schoolApplicationManagement.AddGroupSet.send([$scope.model.selectedGid, $scope.model.GType, $scope.model.GName, $scope.model.hoursPerHour, $scope.model.OpenBusiness,$scope.model.selectedSupplier, $scope.model.inputJudge,$scope.model.messageJudge,$scope.model.sendJudge], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('新增成功');
                            $location.url('access/app/internal/schoolApplicationManagement/schoolApplicationOpening');
                        }
                    });
                },
                /**
                 * 提供给运营平台 2、修改学校开通业务
                 */
                updateGroupSet: function () {
                    applicationServiceSet.internalServiceApi.schoolApplicationManagement.UpdateGroupSet.send([$scope.model.selectedGid, $scope.model.GType, $scope.model.GName, $scope.model.hoursPerHour, $scope.model.OpenBusiness, $scope.model.selectedSupplier, $scope.model.inputJudge,$scope.model.messageJudge,$scope.model.sendJudge], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('保存成功');
                            $location.url('access/app/internal/schoolApplicationManagement/schoolApplicationOpening?selectedGid=' + $stateParams.selectedGid + '&selectedGidName=' + $stateParams.selectedGidName);
                        }
                    });
                }
            };
        })()
    };
    addOrEditSchoolApplicationOpening.init();//函数入口
}]);