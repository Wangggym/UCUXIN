/**
 * Created by fanweihua on 2017/3/13.
 * openChargeController
 * 收费开通
 */
app.controller('openChargeController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    /**
     * @type {{init: init, variable: variable, operation: operation, serviceApi}}
     */
    var openCharge = {
        /**
         * 入口
         */
        init: function () {
            this.variable();
            this.operation();
            this.serviceApi.pageIndex();//page function
            this.serviceApi.getOrgSchoolPage();//get school org pages list
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                gidName: undefined,
                productPackageName: undefined,
                schoolList: [],
                selectedGid: undefined,
                productPackageID: undefined,
                productPackageList: [],
                pageSize: 20,
                pageIndex: 1,
                classList: [],//班级
                classId: undefined,
                studentPack: false,//可购买服务包学生
                studentName: undefined,//学生名称
                dateStart: undefined,//开始时间
                dateOver: undefined,//结束时间
                openProductId: undefined,//开通的服务包
                openProductList: []//开通的服务包列表
            };
            this.setting.timeData();//init time
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * 学校选择
             */
            $scope.changeGid = function () {
                $scope.model.productPackageID = undefined;
                $scope.model.openProductId = undefined;
                openCharge.serviceApi.getProductListByGid();
                openCharge.serviceApi.getClassList();//get class list
            };
            /**
             * 删除学校选择
             */
            $scope.deleteSelectedGid = function () {
                $scope.model.selectedGid = undefined;
                $scope.model.productPackageID = undefined;
            };
            /**
             * 删除产品
             */
            $scope.deleteProductPackageID = function () {
                $scope.model.productPackageID = undefined;
                $scope.model.openProductId = undefined;
            };
            /**
             * 查询
             */
            $scope.search = function () {
                openCharge.serviceApi.getChargeStuPage();//获取学生开通服务包的分页数据
            };
            /**
             * 选择服务包
             */
            $scope.productPackageChange = function () {
                $scope.model.openProductId = undefined;
                openCharge.serviceApi.getChargeListByProductId();//根据产品Id获取服务包列表
            };
            /**
             * 导出
             */
            $scope.export = function () {
                if (!$scope.model.studentName) {
                    $scope.model.studentName = ''
                }
                $window.location.href = urlConfig + 'Charge/v3/Charge/ExportChargeStu' + '?token=' + APPMODEL.Storage.getItem("copPage_token") + '&gid=' + $scope.model.selectedGid + '&productid=' + $scope.model.productPackageID + '&classid=' + $scope.model.classId + '&name=' + $scope.model.studentName + '&isNoCharge=' + $scope.model.studentPack + '&chargeid=' + $scope.model.openProductId + '&sdate=' + openCharge.setting.dateChange($scope.model.dateStart) + '&edate=' + openCharge.setting.dateChange($scope.model.dateOver);
            };
            /**
             * 按班级批量开启试用
             */
            $scope.openTrial = function () {
                openCharge.setting.getGidName();//获取选择的学校名称
                openCharge.setting.getProductPackageName();//获取选择的产品包
                for (var i in openCharge) {
                    delete openCharge[i];
                }
                $location.url('access/app/partner/applicationFeeOpen/openTrialClass?gid=' + $scope.model.selectedGid + '&productPackageID=' + $scope.model.productPackageID + '&gidName=' + $scope.model.gidName + '&productPackageName=' + $scope.model.productPackageName);
            };
            /**
             * 按班级批量取消试用
             */
            $scope.cancelTrial = function () {
                openCharge.setting.getGidName();//获取选择的学校名称
                openCharge.setting.getProductPackageName();//获取选择的产品包
                for (var i in openCharge) {
                    delete openCharge[i];
                }
                $location.url('access/app/partner/applicationFeeOpen/cancelTrialClass?gid=' + $scope.model.selectedGid + '&productPackageID=' + $scope.model.productPackageID + '&gidName=' + $scope.model.gidName + '&productPackageName=' + $scope.model.productPackageName);
            };
            /**
             * 按班级批量开启服务包
             */
            $scope.openServicePack = function () {
                openCharge.setting.getGidName();//获取选择的学校名称
                openCharge.setting.getProductPackageName();//获取选择的产品包
                for (var i in openCharge) {
                    delete openCharge[i];
                }
                $location.url('access/app/partner/applicationFeeOpen/openServicePack?gid=' + $scope.model.selectedGid + '&productPackageID=' + $scope.model.productPackageID + '&gidName=' + $scope.model.gidName + '&productPackageName=' + $scope.model.productPackageName);
            };
            /**
             * 取消开通
             * @param item
             */
            $scope.cancelOpening = function (item) {
                $modal.open({
                    templateUrl: 'cancelOpeningModalContent.html',
                    controller: 'cancelOpeningModalContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        item: function () {
                            return item;
                        },
                        service: function () {
                            return openCharge.serviceApi;
                        }
                    }
                });
            };
            /**
             * 开通
             * @param item
             */
            $scope.opening = function (item) {
                $modal.open({
                    templateUrl: 'openingModalContent.html',
                    controller: 'openingModalContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        item: function () {
                            return item;
                        },
                        service: function () {
                            return openCharge.serviceApi;
                        }
                    }
                });
            };
            /**
             * 给学生开启试用
             * @param item
             */
            $scope.openTrialModal = function (item) {
                $modal.open({
                    templateUrl: 'openTrialModalContent.html',
                    controller: 'openTrialModalContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        item: function () {
                            return item;
                        },
                        service: function () {
                            return openCharge.serviceApi;
                        }
                    }
                });
            };
            /**
             * 取消试用
             * @param item
             */
            $scope.cancelTrialModal = function (item) {
                $modal.open({
                    templateUrl: 'cancelTrialModal.html',
                    controller: 'cancelTrialModalCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        item: function () {
                            return item;
                        },
                        service: function () {
                            return openCharge.serviceApi;
                        }
                    }
                });
            };
            if ($stateParams.gid) {
                $scope.model.selectedGid = $stateParams.gid;
                openCharge.serviceApi.getProductListByGid();
                if ($stateParams.productPackageID) {
                    $scope.model.productPackageID = $stateParams.productPackageID;
                    $scope.search();
                    $scope.productPackageChange();
                    openCharge.serviceApi.getClassList();//get class list
                }
            }
        },
        setting: (function () {
            return {
                /**
                 * 获取选择的学校名称
                 */
                getGidName: function () {
                    for (var i in $scope.model.schoolList) {
                        if ($scope.model.schoolList[i].ID == $scope.model.selectedGid) {
                            $scope.model.gidName = $scope.model.schoolList[i].FName;
                            break;
                        }
                    }
                },
                /**
                 * 获取选择的产品包
                 */
                getProductPackageName: function () {
                    for (var i in $scope.model.productPackageList) {
                        if ($scope.model.productPackageList[i].ID == $scope.model.productPackageID) {
                            $scope.model.productPackageName = $scope.model.productPackageList[i].Name;
                            break;
                        }
                    }
                },
                /**
                 * date change
                 * @param date
                 * @returns {*}
                 */
                dateChange: function (date) {
                    var isEffective = date instanceof Date ? true : false;
                    if (isEffective) {
                        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                    } else {
                        return date;
                    }
                },
                /**
                 * init time
                 */
                timeData: function () {
                    $scope.today = function () {
                        $scope.model.dateStart = undefined;
                        $scope.model.dateOver = undefined;
                    };
                    $scope.today();
                    $scope.clear = function () {
                        $scope.dt = null;
                    };
                    // Disable weekend selection
                    $scope.disabled = function (date, mode) {
                        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
                    };
                    $scope.toggleMin = function () {
                        $scope.minDate = $scope.minDate ? null : new Date();
                    };
                    $scope.toggleMin();
                    $scope.openStart = function ($event) {
                        $scope.openedOver = false;
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.openedStart = true;
                    };
                    $scope.openOver = function ($event) {
                        $scope.openedStart = false;
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.openedOver = true;
                    };
                    $scope.dateOptions = {
                        formatYear: 'yy',
                        startingDay: 1,
                        class: 'datepicker'
                    };
                    $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
                    $scope.format = $scope.formats[1];
                },
                /**
                 * 数据处理
                 */
                dataHandle: function (data) {
                    if (data.ViewModelList) {
                        for (var i in data.ViewModelList) {
                            if (data.ViewModelList[i].IsTry) {
                                data.ViewModelList[i].TrySDateTryEDate = data.ViewModelList[i].TrySDate + '~' + data.ViewModelList[i].TryEDate;
                                data.ViewModelList[i].IsTryName = '是';
                            } else {
                                data.ViewModelList[i].IsTryName = '否';
                                data.ViewModelList[i].TrySDateTryEDate = '';
                            }
                            if (!data.ViewModelList[i].BuyCharge) {
                                data.ViewModelList[i].EDate = '';
                            }
                        }
                        $scope.model.itemList = data.ViewModelList;//transformation Data
                        $scope.pageIndex.pages = data.Pages;//paging pages
                        $scope.pageIndex.pageindexList(data);//paging
                    } else {
                        $scope.model.itemList = [];
                        $scope.pageIndex.pages = data.Pages;//paging pages
                        $scope.pageIndex.pageindexList(data);//paging
                    }
                }
            };
        })(),
        serviceApi: (function () {
            return {
                /**
                 * get school org pages list
                 */
                getOrgSchoolPage: function () {
                    applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList = data.Data;
                        }
                    });
                },
                /**
                 * 根据学校GID获取产品包列表
                 */
                getProductListByGid: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetProductListByGid.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.productPackageList = data.Data;
                        }
                    });
                },
                /**
                 * get class list
                 */
                getClassList: function () {
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.getClassList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.classList = data.Data;
                        }
                    });
                },
                /**
                 * 获取学生开通服务包的分页数据
                 */
                getChargeStuPage: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetChargeStuPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid, $scope.model.productPackageID, $scope.model.classId, $scope.model.studentName, $scope.model.studentPack, $scope.model.openProductId, openCharge.setting.dateChange($scope.model.dateStart), openCharge.setting.dateChange($scope.model.dateOver), $scope.model.pageIndex, $scope.model.pageSize]).then(function (data) {
                        if (data.Ret == 0) {
                            openCharge.setting.dataHandle(data.Data);
                        }
                    });
                },
                /**
                 * 根据产品Id获取服务包列表
                 */
                getChargeListByProductId: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetChargeListByProductId.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.productPackageID]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.openProductList = data.Data;
                        }
                    });
                },
                /**
                 * 根据产品Id和学生id获取服务包
                 * @param ProductId
                 * @param umid
                 * @param callBack
                 */
                getChargeList: function (ProductId, umid, callBack) {
                    applicationServiceSet.chargeServiceApi.chargeService.GetChargeList.send([APPMODEL.Storage.getItem('copPage_token'), ProductId, umid]).then(function (data) {
                        if (data.Ret == 0) {
                            callBack(data.Data);
                        }
                    });
                },
                /**
                 * 根据产品ID umid 获取可能开通服务包
                 * @param ProductID
                 * @param umid
                 * @param callBack
                 */
                getCanOpenChargeList: function (ProductID, umid, callBack) {
                    applicationServiceSet.chargeServiceApi.chargeService.GetCanOpenChargeList.send([APPMODEL.Storage.getItem('copPage_token'), ProductID, umid]).then(function (data) {
                        if (data.Ret == 0) {
                            callBack(data.Data);
                        }
                    });
                },
                /**
                 * 按学生开启试用
                 * @param GID
                 * @param ProductID
                 * @param UMIDs
                 * @param TrySDate
                 * @param TryEDate
                 * @param callBack
                 */
                openTry: function (GID, ProductID, UMIDs, TrySDate, TryEDate, callBack) {
                    applicationServiceSet.chargeServiceApi.chargeService.OpenTry.send([GID, ProductID, UMIDs, TrySDate, TryEDate], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('开启试用');
                            callBack(data);
                        }
                    });
                },
                /**
                 * 取消开通服务包
                 * @param GID
                 * @param ProductID
                 * @param UMIDs
                 * @param ChargeIDs
                 * @param callBack
                 */
                cancelChargeStu: function (GID, ProductID, UMIDs, ChargeIDs, callBack) {
                    if (ChargeIDs.length == 0) {
                        toastr.error('请选择需要取消的服务包');
                        return;
                    }
                    applicationServiceSet.chargeServiceApi.chargeService.CancelChargeStu.send([GID, ProductID, UMIDs, ChargeIDs], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('取消开通服务包');
                            callBack(data);
                        }
                    });
                },
                /**
                 * 取消试用
                 * @param GID
                 * @param ProductID
                 * @param UMIDs
                 * @param TrySDate
                 * @param TryEDate
                 * @param callBack
                 * @constructor
                 */
                cancelTry: function (GID, ProductID, UMIDs, TrySDate, TryEDate, callBack) {
                    applicationServiceSet.chargeServiceApi.chargeService.CancelTry.send([GID, ProductID, UMIDs, TrySDate, TryEDate], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('取消试用');
                            callBack(data.Ret);
                        }
                    });
                },
                /**
                 * 按学生开启服务包
                 * @param GID
                 * @param ProductID
                 * @param UMIDs
                 * @param ChargeIDs
                 * @param callBack
                 */
                openChargeStu: function (GID, ProductID, UMIDs, ChargeIDs, callBack) {
                    if (ChargeIDs.length == 0) {
                        toastr.error('请选择需要开通的服务包');
                        return;
                    }
                    applicationServiceSet.chargeServiceApi.chargeService.OpenChargeStu.send([GID, ProductID, UMIDs, ChargeIDs], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('开通服务包');
                            callBack(data);
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
                            applicationServiceSet.chargeServiceApi.chargeService.GetChargeStuPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid, $scope.model.productPackageID, $scope.model.classId, $scope.model.studentName, $scope.model.studentPack, $scope.model.openProductId, openCharge.setting.dateChange($scope.model.dateStart), openCharge.setting.dateChange($scope.model.dateOver), page.pIndex, $scope.model.pageSize]).then(function (data) {
                                if (data.Ret == 0) {
                                    openCharge.setting.dataHandle(data.Data);
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.chargeServiceApi.chargeService.GetChargeStuPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid, $scope.model.productPackageID, $scope.model.classId, $scope.model.studentName, $scope.model.studentPack, $scope.model.openProductId, openCharge.setting.dateChange($scope.model.dateStart), openCharge.setting.dateChange($scope.model.dateOver), pageNext, $scope.model.pageSize]).then(function (data) {
                                if (data.Ret == 0) {
                                    openCharge.setting.dataHandle(data.Data);
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.chargeServiceApi.chargeService.GetChargeStuPage.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid, $scope.model.productPackageID, $scope.model.classId, $scope.model.studentName, $scope.model.studentPack, $scope.model.openProductId, openCharge.setting.dateChange($scope.model.dateStart), openCharge.setting.dateChange($scope.model.dateOver), pageNext, $scope.model.pageSize]).then(function (data) {
                                if (data.Ret == 0) {
                                    openCharge.setting.dataHandle(data.Data);
                                }
                            });
                        }
                    };
                }
            };
        })()
    };
    openCharge.init();//入口
}]);
/**
 * 取消学生开通服务包
 */
app.controller('cancelOpeningModalContentCtrl', ['$scope', '$modalInstance', 'item', 'service', function ($scope, $modalInstance, item, service) {
    $scope.modal = {
        GName: item.GName,
        ProductName: item.ProductName,
        MName: item.MName,
        openProductList: [],
        UMIDs: [item.UMID]
    };
    service.getChargeList(item.ProductID, item.UMID, function (data) {
        for (var i in data) {
            data[i].BuyDate = data[i].BuySDate + ' ~ ' + data[i].BuyEDate;
            data[i].Date = data[i].SDate + ' ~ ' + data[i].EDate;
        }
        $scope.modal.openProductList = data;
    });
    /**
     * input checkbox change
     * @param openProductList
     * @param index
     */
    $scope.checkedOne = function (openProductList, index) {
        angular.forEach(openProductList, function (value, key) {
            if (key == index) {
                if (value.checked) {
                    value.checked = false;
                } else {
                    value.checked = true;
                }
            }
        });
    };
    function productList() {
        var product = [];
        for (var i in $scope.modal.openProductList) {
            if ($scope.modal.openProductList[i].checked) {
                product.push($scope.modal.openProductList[i].ID);
            }
        }
        return product;
    }

    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    /**
     * 确认取消开通
     */
    $scope.confirmCancel = function () {
        service.cancelChargeStu(item.GID, item.ProductID, $scope.modal.UMIDs, productList(), function (data) {
            if (data.Ret == 0) {
                $modalInstance.dismiss('cancel');
                item.OpenCharge = data.Data[0].OpenCharge;
                item.CanBuyCharge = data.Data[0].CanBuyCharge;
            }
        });
    };
}]);
/**
 * 开通服务包
 */
app.controller('openingModalContentCtrl', ['$scope', '$modalInstance', 'item', 'service', function ($scope, $modalInstance, item, service) {
    $scope.modal = {
        GName: item.GName,
        ProductName: item.ProductName,
        MName: item.MName,
        openProductList: [],
        UMIDs: [item.UMID]
    };
    service.getCanOpenChargeList(item.ProductID, item.UMID, function (data) {
        for (var i in data) {
            data[i].BuySDateEDate = data[i].BuySDate + '~' + data[i].BuyEDate;
            data[i].SDateDate = data[i].SDate + '~' + data[i].EDate;
        }
        $scope.modal.openProductList = data;
    });
    /**
     * input checkbox change
     * @param openProductList
     * @param index
     */
    $scope.checkedOne = function (openProductList, index) {
        angular.forEach(openProductList, function (value, key) {
            if (key == index) {
                if (value.checked) {
                    value.checked = false;
                } else {
                    value.checked = true;
                }
            }
        });
    };
    function productList() {
        var product = [];
        for (var i in $scope.modal.openProductList) {
            if ($scope.modal.openProductList[i].checked) {
                product.push($scope.modal.openProductList[i].ID);
            }
        }
        return product;
    }

    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    /**
     * 确认开通
     */
    $scope.confirmCancel = function () {
        service.openChargeStu(item.GID, item.ProductID, $scope.modal.UMIDs, productList(), function (data) {
            if (data.Ret == 0) {
                item.CanBuyCharge = data.Data[0].CanBuyCharge;
                item.OpenCharge = data.Data[0].OpenCharge;
                $modalInstance.dismiss('cancel');
            }
        });
    };
}]);
/**
 * 给学生开启试用
 */
app.controller('openTrialModalContentCtrl', ['$scope', '$modalInstance', 'item', 'service', function ($scope, $modalInstance, item, service) {
    $scope.modal = {
        GName: item.GName,
        ProductName: item.ProductName,
        MName: item.MName,
        GID: item.GID,
        ProductID: item.ProductID,
        UMIDs: [item.UMID],
        dateStart: undefined,
        dateOver: undefined
    };
    var openTrialModal = {
        /**
         * date change
         * @param date
         * @returns {*}
         */
        dateChange: function (date) {
            var isEffective = date instanceof Date ? true : false;
            if (isEffective) {
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            } else {
                return date;
            }
        },
        /**
         * init time
         */
        timeData: function () {
            $scope.today = function () {
                var date = new Date();
                $scope.modal.dateStart = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                $scope.modal.dateOver = $scope.modal.dateStart;
            };
            $scope.today();
            $scope.clear = function () {
                $scope.dt = null;
            };
            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };
            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();
            $scope.openStart = function ($event) {
                $scope.openedOver = false;
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedStart = true;
            };
            $scope.openOver = function ($event) {
                $scope.openedStart = false;
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedOver = true;
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                class: 'datepicker'
            };
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[1];
        }
    };
    openTrialModal.timeData();
    /**
     * cancel
     */
    $scope.modal.close = function () {
        $modalInstance.dismiss('cancel');
    };
    /**
     * 确定
     */
    $scope.modal.save = function () {
        service.openTry($scope.modal.GID, $scope.modal.ProductID, $scope.modal.UMIDs, openTrialModal.dateChange($scope.modal.dateStart), openTrialModal.dateChange($scope.modal.dateOver), function (data) {
            if (data.Ret == 0) {
                $modalInstance.dismiss('cancel');
                item.IsTry = true;
                item.IsTryName = '是';
                item.TrySDateTryEDate = openTrialModal.dateChange($scope.modal.dateStart) + '~' + openTrialModal.dateChange($scope.modal.dateOver);
            }
        });
    };
}]);
/**
 * 给学生取消试用
 */
app.controller('cancelTrialModalCtrl', ['$scope', '$modalInstance', 'item', 'service', function ($scope, $modalInstance, item, service) {
    $scope.modal = {
        UMIDs: [item.UMID]
    };
    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    var dateChange = function (date) {
        var isEffective = date instanceof Date ? true : false;
        if (isEffective) {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        } else {
            return date;
        }
    };
    /**
     * 确定
     */
    $scope.confirm = function () {
        service.cancelTry(item.GID, item.ProductID, $scope.modal.UMIDs, dateChange(item.TrySDate), dateChange(item.TryEDate), function (data) {
            $modalInstance.dismiss('cancel');
            item.IsTry = false;
            item.IsTryName = '否';
            item.TrySDateTryEDate = '';
        });
    };
}]);