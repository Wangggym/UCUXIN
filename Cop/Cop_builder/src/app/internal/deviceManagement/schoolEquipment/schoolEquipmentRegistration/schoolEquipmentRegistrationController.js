/**
 * Created by fanweihua on 2016/9/13.
 * schoolEquipmentRegistrationController
 * school equipment registration
 */
app.controller('schoolEquipmentRegistrationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    /**
     * school equipment registration
     */
    var schoolEquipmentRegistration = (function () {
        /**
         * function init
         */
        var init = function () {
            variableState.basic();//basic variable
            operation.basic();//basic operation
        };
        /**
         * variable state
         * @type {{basic: basic}}
         */
        var variableState = {
            /**
             * basic variable
             */
            basic: function () {
                $scope.model = {
                    schoolList: [],
                    selectGidName: undefined,
                    selectedGid: undefined,
                    itemList: [],
                    itemNumber: undefined,
                    checkAll: undefined,
                    enumEquipmentType: [
                        {
                            'name': 'IC近距离考勤机',
                            'equipmentType': 1
                        },
                        {
                            'name': '2.4G远距离考勤机',
                            'equipmentType': 2
                        },
                        {
                            'name': '电话机',
                            'equipmentType': 3
                        }
                    ],
                    stType: [
                        {
                            'name': '停用',
                            'st': -1
                        },
                        {
                            'name': '正常',
                            'st': 0
                        },
                        {
                            'name': '脱机',
                            'st': 1
                        }
                    ],
                    searchDisable: false
                };
            }
        };
        /**
         * service aggregate
         * @type {{getOrgSchoolPage: getOrgSchoolPage, getEquipmentList: getEquipmentList}}
         */
        var serviceApiAggregate = {
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
             * get equipment list
             */
            getEquipmentList: function () {
                applicationServiceSet.internalServiceApi.schoolEquipment.GetEquipmentList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectedGid]).then(function (data) {
                    if (data.Ret == 0) {
                        operation.dataArrangement(data.Data);//data arrangement
                    }
                });
            },
            /**
             * 发起App更新升级
             * @param ids
             * @param url
             * @param func
             */
            upgradeApp: function (ids, url, func) {
                applicationServiceSet.internalServiceApi.schoolEquipment.UpgradeApp.send([ids, url], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success('发起成功');
                        func();
                    }
                });
            },
            /**
             * 根据设备ID删除设备
             */
            deleteEquipment: function (item) {
                applicationServiceSet.internalServiceApi.schoolEquipment.DeleteEquipment.send(undefined, [APPMODEL.Storage.getItem('copPage_token'), item.ID]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success('删除成功');
                        $scope.model.itemList.splice($scope.model.itemList.indexOf(item), 1);
                    }
                });
            }
        };
        /**
         * basic operation
         * @type {{basic: basic, judgeStateParams: judgeStateParams, dataArrangement: dataArrangement, tip: tip}}
         */
        var operation = {
            /**
             * basic operation
             */
            basic: function () {
                /**
                 * refresh service get school list
                 * @param selectedGid
                 */
                $scope.refreshAddresses = function (selectedGid) {
                    if (selectedGid) {
                        $scope.model.selectGidName = selectedGid;
                        APPMODEL.Storage.setItem('gidName', selectedGid);
                        serviceApiAggregate.getOrgSchoolPage(selectedGid);//get school org pages list
                    }
                };
                /**
                 * select school
                 */
                $scope.changeGid = function () {
                    APPMODEL.Storage.setItem('selectedGid', $scope.model.selectedGid);
                    $scope.search();//search
                };
                /**
                 * delete gid
                 */
                $scope.deleteSelectedGid = function () {
                    $scope.model.selectedGid = undefined;
                    $scope.model.itemList = [];
                };
                /**
                 * 根据设备ID删除设备
                 * @param item
                 */
                $scope.deleteConfirm = function (item) {
                    serviceApiAggregate.deleteEquipment(item);//根据设备ID删除设备
                };
                /**
                 * search
                 */
                $scope.search = function () {
                    if ($scope.model.selectedGid) {
                        serviceApiAggregate.getEquipmentList();//get equipment list
                    } else {
                        toastr.error('请选择学校');
                    }
                };
                /**
                 * app升级地址
                 */
                $scope.appAddress = function () {
                    var itemSelectedNum = [];
                    for (var i in $scope.model.itemList) {
                        if ($scope.model.itemList[i].checked) {
                            itemSelectedNum.push($scope.model.itemList[i].ID);
                        }
                    }
                    if (itemSelectedNum.length == 0) {
                        toastr.error('请勾选学校');
                        return;
                    }
                    $modal.open({
                        templateUrl: 'appAddressContent.html',
                        controller: 'appAddressContentCtrl',
                        keyboard: false,
                        backdrop: false,
                        resolve: {
                            service: function () {
                                return serviceApiAggregate
                            },
                            items: function () {
                                return itemSelectedNum
                            }
                        }
                    });
                };
                /**
                 * input checkbox change
                 * @param itemList
                 * @param index
                 */
                $scope.checkedOne = function (itemList, index) {
                    angular.forEach(itemList, function (value, key) {
                        if (key == index) {
                            if (value.checked) {
                                value.checked = false;
                                itemSelected();
                            } else {
                                value.checked = true;
                                itemSelected();
                            }
                        }
                    });
                };
                /**
                 * select all
                 */
                $scope.checkAll = function () {
                    angular.forEach($scope.model.itemList, function (value) {
                        if (value.checked) {
                            value.checked = false;
                            itemSelected();
                        } else {
                            value.checked = true;
                            itemSelected();
                        }
                    });
                };
                var itemSelected = function () {
                    var item = [];
                    for (var i in $scope.model.itemList) {
                        if ($scope.model.itemList[i].checked == true) {
                            item.push($scope.model.itemList[i]);
                        }
                    }
                    $scope.model.itemNumber = item.length;
                };
                this.tip();//tip
                if ($stateParams.id || $stateParams.newModel) {
                    operation.judgeStateParams();//judge parameters
                }
            },
            /**
             * judge parameters
             */
            judgeStateParams: function () {
                if (APPMODEL.Storage.getItem('gidName')) {
                    if (APPMODEL.Storage.getItem('selectedGid') == 'undefined') {
                        return;
                    }
                    $scope.model.selectedGid = APPMODEL.Storage.getItem('selectedGid');
                    $scope.refreshAddresses(APPMODEL.Storage.getItem('gidName'));
                    $scope.search();
                }
            },
            /**
             * data arrangement
             */
            dataArrangement: function (data) {
                for (var i in data) {
                    for (var s in $scope.model.enumEquipmentType) {
                        if (data[i].EquipmentType == $scope.model.enumEquipmentType[s].equipmentType) {
                            data[i].EquipmentTypeName = $scope.model.enumEquipmentType[s].name;
                            break;
                        }
                    }
                }
                for (var i in data) {
                    for (var s in $scope.model.stType) {
                        if (data[i].ST == $scope.model.stType[s].st) {
                            data[i].STName = $scope.model.stType[s].name;
                            break;
                        }
                    }
                }
                $scope.model.itemList = data;
            },
            /**
             * tip
             */
            tip: function () {
                toastr.toastrConfig.positionClass = 'toast-top-center';
                toastr.toastrConfig.timeOut = 2000;
            }
        };
        /**
         * return function init
         */
        return {
            init: init
        }
    })();
    schoolEquipmentRegistration.init();//school equipment registration init function
}]);
/**
 * appAddressContentCtrl
 */
app.controller('appAddressContentCtrl', ['$scope', '$modalInstance', 'service', 'items', function ($scope, $modalInstance, service, items) {
    $scope.newModel = {
        address: undefined
    };
    /**
     * 选择确定
     */
    $scope.confirm = function () {
        service.upgradeApp(items, $scope.newModel.address, function () {
            $modalInstance.dismiss('cancel');
        });
    };
    /**
     * cancel
     */
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);