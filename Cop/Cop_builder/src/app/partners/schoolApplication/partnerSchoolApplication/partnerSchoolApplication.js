/**
 * Created by fanweihua on 2016/11/25.
 * schoolApplicationOpeningController
 * school application opening
 */
app.controller('schoolApplicationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * 学校应用开通
     * @type {{init: init, variable: variable, operation: operation, setting, serviceApi}}
     */
    var schoolApplicationOpening = {
        /**
         * 入口
         */
        init: function () {
            this.serviceApi.getOrgSchoolPage();
            this.variable();//变量声明
            this.operation();//操作
            this.serviceApi.pageIndex();//page index
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                selectedGid: 0,
                selectedGidName: undefined,
                schoolList: [],
                pSize: 20,
                pIndex: 1,
                itemList: [],
                MorningSupply: [
                    {
                        "id": 1010,
                        "name": "惠州贝安"
                    },
                    {
                        "id": 1009,
                        "name": "成都吉联"
                    },
                    {
                        "id": 1011,
                        "name": "深圳佳维思"
                    },
                    {
                        "id": 1012,
                        "name": "深圳汉维视"
                    }
                ]
            };
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
                    $scope.model.selectedGidName = selectedGid;
                    schoolApplicationOpening.serviceApi.getOrgSchoolPage(selectedGid);//get school org pages list
                }
            };
            /**
             * 查询
             */
            // $scope.search = function () {
            //     schoolApplicationOpening.serviceApi.getGroupSetList();//获取已开通学校列表分页(运营平台设置学校开通功能使用)
            // };
            /**
             * 学校选择
             */
            // $scope.changeGid = function () {
            //     console.log($scope.model.selectedGid)
            //     $scope.search();
            // };
            /**
             * 删除学校
             */
            $scope.deleteSelectedGid = function () {
                $scope.model.selectedGid = undefined;
            };
            /**
             * 查看业务
             * @param item
             * @param num
             */
            $scope.checkItem = function (item, num) {
                var head = {
                    "name": undefined,
                    "num": undefined
                };
                if (num == 1) {
                    head.num = 1;
                    head.name = '开启的业务';
                } else if (num == 2) {
                    head.num = 2;
                    head.name = '学校自定义开启的业务';
                }
                $modal.open({
                    templateUrl: 'schoolApplicationModalContent.html',
                    controller: 'schoolApplicationModalContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return item;
                        },
                        head: function () {
                            return head;
                        },
                        service: function () {
                            return schoolApplicationOpening.serviceApi;
                        },
                        setting: function () {
                            return schoolApplicationOpening.setting;
                        }
                    }
                });
            };
            /**
             * 添加或编辑
             * @param item
             */
            $scope.addOrEdit = function (item) {
                if ($scope.model.selectedGid == 0 || $scope.model.selectedGid == 'undefined' || $scope.model.selectedGid == undefined) {
                    $scope.model.selectedGid = 0;
                    $scope.model.selectedGidName = 0;
                }
                console.log(item)
                $location.url('access/app/internal/schoolApplicationManagement/addOrEditSchoolApplicationOpening?selectedGid=' + $scope.model.selectedGid + '&selectedGidName=' + $scope.model.selectedGidName + '&GID=' + item.GID + '&GName=' + item.GName + '&GType=' + item.GType + '&OpenBusiness=' + item.OpenBusiness + '&IsTel=' + item.IsTel + '&Timeout=' + item.Timeout + '&MorningSupply=' + item.MorningSupply + '&CompanyToken=' + item.CompanyToken + '&GroupBusiness=' + item.GroupBusiness+'&ClockSmsType='+item.ClockSmsType+'&IsOpenExceptionClcok='+item.IsOpenExceptionClcok);
            };
            if ($stateParams.selectedGid && $stateParams.selectedGid != '0' && $stateParams.selectedGid != 0) {
                $scope.model.selectedGid = $stateParams.selectedGid;
                $scope.refreshAddresses($stateParams.selectedGidName);
            }
            // $scope.search();
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
                    for (var i in data.ViewModelList) {
                        if (!data.ViewModelList[i].IsTel) {
                            data.ViewModelList[i].IsTelName = '否';
                        } else {
                            data.ViewModelList[i].IsTelName = '是';
                        }
                        if (data.ViewModelList[i].ClockSmsType == 0) {
                            data.ViewModelList[i].IsOpenClockName = '不发短信';
                        }else if(data.ViewModelList[i].ClockSmsType == 1) {
                            data.ViewModelList[i].IsOpenClockName = '未注册主监护人';
                        }else {
                            data.ViewModelList[i].IsOpenClockName = '所有主监护人';
                        }
                        if (!data.ViewModelList[i].IsOpenExceptionClcok) {
                            data.ViewModelList[i].IsexceptionName = '否';
                        } else {
                            data.ViewModelList[i].IsexceptionName = '是';
                        }
                        if (data.ViewModelList[i].MorningSupply == 0) {
                            data.ViewModelList[i].MorningSupplyName = undefined
                        } else {
                            for (var s in $scope.model.MorningSupply) {
                                if ($scope.model.MorningSupply[s].id == data.ViewModelList[i].MorningSupply) {
                                    data.ViewModelList[i].MorningSupplyName = $scope.model.MorningSupply[s].name;
                                    break;
                                }
                            }
                        }
                    }
                    $scope.model.itemList = data.ViewModelList;
                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
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
                getOrgSchoolPage: function () {
                    applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'),APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.schoolList = data.Data;
                        }
                    });
                },
                /**
                 * 获取已开通学校列表分页(运营平台设置学校开通功能使用)
                 */
                getGroupSetList: function () {
                    applicationServiceSet.internalServiceApi.schoolApplicationManagement.GetGroup.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid, $scope.model.pSize, $scope.model.pIndex,APPMODEL.Storage.getItem('orgid')]).then(function (data) {
                        if (data.Ret == 0) {
                            schoolApplicationOpening.setting.dataHandle(data.Data);//数据处理
                        }
                    });
                },
                /**
                 * 获取业务类型
                 * @param func
                 */
                getBusinessType: function (func) {
                    applicationServiceSet.internalServiceApi.schoolApplicationManagement.GetBusinessTypeByPartner.send([APPMODEL.Storage.getItem('copPage_token'),APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            func(data.Data);//数据处理
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
                            applicationServiceSet.internalServiceApi.schoolApplicationManagement.GetGroup.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid, $scope.model.pSize, page.pIndex,APPMODEL.Storage.getItem('orgid')]).then(function (data) {
                                if (data.Ret == 0) {
                                    schoolApplicationOpening.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.schoolApplicationManagement.GetGroup.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid, $scope.model.pSize,pageNext,APPMODEL.Storage.getItem('orgid')]).then(function (data) {
                                if (data.Ret == 0) {
                                    schoolApplicationOpening.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.internalServiceApi.schoolApplicationManagement.GetGroup.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid, $scope.model.pSize,pageNext,APPMODEL.Storage.getItem('orgid')]).then(function (data) {
                                if (data.Ret == 0) {
                                    schoolApplicationOpening.setting.dataHandle(data.Data);//数据处理
                                }
                            });
                        }
                    };
                }
            }
        })()
    };
    schoolApplicationOpening.init();//函数入口
    /**
     * 查询
     */
    $scope.search = function () {
        schoolApplicationOpening.serviceApi.getGroupSetList();//获取已开通学校列表分页(运营平台设置学校开通功能使用)
    };
    $scope.changeGid = function () {
        $scope.search();
    };
}]);
/**
 * schoolApplicationModalContentCtrl
 */
app.controller('schoolApplicationModalContentCtrl', ['$scope', '$modalInstance', 'toastr', 'items', 'head', 'service', function ($scope, $modalInstance, toastr, items, head, service) {
    $scope.newModel = {
        head: head.name,
        itemList: []
    };
    service.getBusinessType(function (data) {
        var business = undefined;
        if (head.num == 1) {
            business = items.OpenBusiness;
        } else if (head.num == 2) {
            business = items.GroupBusiness;
        }
        setting.YOpeartion(data, business);
    });
    var setting = {
        YOpeartion: function (data, business) {
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
            $scope.newModel.itemList = itemList;
            if (business) {
                for (var i in $scope.newModel.itemList) {
                    for (var s in $scope.newModel.itemList[i].children) {
                        var Y = $scope.newModel.itemList[i].children[s].Value & business;
                        if (Y > 0) {
                            $scope.newModel.itemList[i].children[s].checked = true;
                        } else {
                            $scope.newModel.itemList[i].children[s].checked = false;
                        }
                    }
                }
            }
        }
    };
    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    setTimeout(function () {
        $(".modal-content").draggable({ containment: "#app", scroll: false });
    }, 100);
}]);