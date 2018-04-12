/**
 * Created by fanweihua on 2016/9/13.
 * editAddEquipmentRegistrationController
 * edit or add equipment registration basic information
 */
app.controller('editAddEquipmentRegistrationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    /**
     * edit or add equipment registration
     */
    var editAddEquipmentRegistration = (function () {
        /**
         * model init
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
                    head: undefined,
                    selectedGid: undefined,
                    id: undefined,
                    Name: undefined,
                    ENO: undefined,
                    appAddress: undefined,//App升级地址
                    schoolList: [],
                    Supplier: undefined,//供应商
                    EquipmentTypeList: [
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
                    checkList: [
                        {
                            'id': 1,
                            'name': '校园模式'
                        },
                        {
                            'id': 2,
                            'name': '校车模式'
                        }
                    ],
                    judgeList: [
                        {
                            'id': 'true',
                            'name': '是'
                        },
                        {
                            'id': 'false',
                            'name': '否'
                        }
                    ],
                    SupplierList: [
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
                        },
                        {
                            'id': 1013,
                            'name': '海振邦'
                        },
                        {
                            'id': 1014,
                            'name': '木兰'
                        }
                    ]
//                    NewParamVersion: undefined,//最新参数版本号
//                    Version: undefined,//当前App版本号
//                    CurParamVersion: undefined,//当前参数版本号
                };
                /**
                 * 设备参数信息
                 * @type {{check: undefined, judgePic: undefined, judgeRecipes: undefined, H5address: undefined, judgeAttendancePicture: undefined, startTime: undefined, appAddress: undefined, weatherCode: undefined}}
                 */
                $scope.equipment = {
                    check: undefined,//考勤模式
                    judgePic: undefined,//预留照片
                    judgeRecipes: undefined,//食谱
                    H5address: undefined,//考勤机界面显示H5地址
                    judgeAttendancePicture: undefined,//考勤图片
                    startTime: undefined,//定时重启考勤机时间
                    weatherCode: undefined//天气代码
                };
                $scope.enumEquipmentParamList = [
                    {
                        "enum": 1,
                        "name": "check"
                    },
//                    {
//                        "enum": 2,
//                        "name": "appAddress"
//                    },
                    {
                        "enum": 3,
                        "name": "judgeAttendancePicture"
                    },
                    {
                        "enum": 4,
                        "name": "H5address"
                    },
                    {
                        "enum": 5,
                        "name": "startTime"
                    },
                    {
                        "enum": 6,
                        "name": "judgePic"
                    },
                    {
                        "enum": 7,
                        "name": "judgeRecipes"
                    },
                    {
                        "enum": 8,
                        "name": "weatherCode"
                    }
                ]
            }
        };
        /**
         * service aggregate
         * @type {{getOrgSchoolPage: getOrgSchoolPage}}
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
             * add or update equipment
             * @param EquipmentSetList
             * @param func
             */
            addOrUpEquipment: function (EquipmentSetList, func) {
                if ($stateParams.id) {
                    $scope.model.id = $stateParams.id;
                }
                applicationServiceSet.internalServiceApi.schoolEquipment.AddOrUpEquipment.send([$scope.model.id, $scope.model.selectedGid, $scope.model.Name, $scope.model.ENO, $scope.model.EquipmentType, $scope.model.Supplier, EquipmentSetList]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success('保存成功');
                        func($location);
                    }
                });
            },
            /**
             * get equipment
             */
            getEquipment: function () {
                applicationServiceSet.internalServiceApi.schoolEquipment.getEquipment.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.id]).then(function (data) {
                    if (data.Ret == 0) {
                        operation.dataOperation(data.Data);//data operation
                    }
                });
            }
        };
        /**
         * operation basic
         * @type {{basic: basic, accordingToGetBasicInformation: accordingToGetBasicInformation, dataOperation: dataOperation}}
         */
        var operation = {
            basic: function () {
                /**
                 * refresh service get school list
                 * @param selectedGid
                 */
                $scope.refreshAddresses = function (selectedGid) {
                    if (selectedGid) {
                        APPMODEL.Storage.setItem('gidName', selectedGid);
                        serviceApiAggregate.getOrgSchoolPage(selectedGid);//get school org pages list
                    }
                };
                $scope.changeGid = function () {
                    APPMODEL.Storage.setItem('selectedGid', $scope.model.selectedGid);
                };
                /**
                 * delete gid
                 */
                $scope.deleteGid = function () {
                    $scope.model.selectedGid = undefined;
                };
                /**
                 * 查询天气代码
                 */
                $scope.searchWeatherCode = function () {
                    $modal.open({
                        templateUrl: 'searchWeatherCodeContent.html',
                        controller: 'searchWeatherCtrl',
                        keyboard: false,
                        backdrop: false,
                        resolve: {
                            equipment: function () {
                                return $scope.equipment
                            }
                        }
                    });
                };
                /**
                 * save
                 */
                $scope.save = function () {
                    if (!$scope.model.selectedGid) {
                        toastr.error('请选择学校');
                        return;
                    }
                    if (!$scope.model.EquipmentType) {
                        toastr.error('请选择设备类型');
                        return;
                    }
                    if (!$scope.model.Name) {
                        toastr.error('请填写设备名称/设备地点');
                        return;
                    }
                    if (!$scope.model.ENO) {
                        toastr.error('请填写编码');
                        return;
                    }
                    if (!$scope.model.Supplier) {
                        toastr.error('请选择供应商');
                        return;
                    }
                    if (!$scope.equipment.check) {
                        toastr.error('请选择考勤模式');
                        return;
                    }
                    if (!$scope.equipment.judgePic) {
                        toastr.error('请选择是否展示预留照片');
                        return;
                    }
                    if (!$scope.equipment.judgeRecipes) {
                        toastr.error('请选择是否展示食谱模块');
                        return;
                    }
                    if (!$scope.equipment.H5address) {
                        toastr.error('请填写考勤机界面显示H5地址');
                        return;
                    }
                    if (!$scope.equipment.judgeAttendancePicture) {
                        toastr.error('请选择是否上传考勤图片');
                        return;
                    }
                    if (!$scope.equipment.startTime) {
                        toastr.error('请填写定时重启考勤机时间');
                        return;
                    }
                    if (!$scope.equipment.weatherCode) {
                        toastr.error('请填写天气代码');
                        return;
                    }
                    $modal.open({
                        templateUrl: 'confirmMyModalContent.html',
                        controller: 'confirmMyModalContentCtrl',
                        keyboard: false,
                        backdrop: false,
                        resolve: {
                            service: function () {
                                return serviceApiAggregate;
                            },
                            equipment: function () {
                                return $scope
                            }
                        }
                    });
                };
                if ($stateParams.id) {
                    $scope.model.head = '编辑设备';
                    this.accordingToGetBasicInformation();//according to get basic information
                } else {
                    $scope.model.head = '新增设备';
                }
            },
            /**
             * according to get basic information
             */
            accordingToGetBasicInformation: function () {
                serviceApiAggregate.getEquipment();//get equipment
            },
            /**
             * data operation
             */
            dataOperation: function (data) {
                $scope.refreshAddresses(data.GFName);
                $scope.model.selectedGid = data.GID;
                $scope.model.Name = data.Name;
                $scope.model.ENO = data.ENO;
                $scope.model.EquipmentType = data.EquipmentType;
                $scope.model.Supplier = data.AppID;
                if (data.EquipmentSetList) {
                    for (var i in data.EquipmentSetList) {
                        if (data.EquipmentSetList[i].Param == 2) {
                            $scope.model.appAddress = data.EquipmentSetList[i].Val;
                            continue;
                        }
                        for (var s in $scope.enumEquipmentParamList) {
                            if (data.EquipmentSetList[i].Param == $scope.enumEquipmentParamList[s].enum) {
                                $scope.enumEquipmentParamList[s].ID = data.EquipmentSetList[i].ID;
                                for (var n in $scope.equipment) {
                                    if (n == $scope.enumEquipmentParamList[s].name) {
                                        $scope.equipment[n] = data.EquipmentSetList[i].Val;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    $scope.equipment.check = parseInt($scope.equipment.check);
                }
            }
        };
        /**
         * return init function
         */
        return {
            init: init
        };
    })();
    editAddEquipmentRegistration.init();//edit or add equipment registration init function
}]);
/**
 * confirmMyModalContentCtrl
 */
app.controller('confirmMyModalContentCtrl', ['$scope', '$modalInstance', '$stateParams', 'service', 'equipment', function ($scope, $modalInstance, $stateParams, service, scope) {
    $scope.confirm = function () {
        var equipmentList = equipment();
        service.addOrUpEquipment(equipmentList, function (localtion) {
            $modalInstance.dismiss('cancel');
            if ($stateParams.newModel) {
                localtion.url('access/app/internal/schoolEquipment/schoolEquipmentRegistration?newModel=' + $stateParams.newModel);
            } else {
                localtion.path('access/app/internal/schoolEquipment/schoolEquipmentRegistration');
            }
        });
    };
    var equipment = function () {
        var EquipmentSetList = [];
        for (var i in scope.equipment) {
            var item = {
                "Param": undefined,
                "Val": undefined,
                "ID": undefined
            };
            for (var s in scope.enumEquipmentParamList) {
                if (scope.enumEquipmentParamList[s].name == i) {
                    item.Param = scope.enumEquipmentParamList[s].enum;
                    item.Val = scope.equipment[i];
                    item.ID = scope.enumEquipmentParamList[s].ID;
                    EquipmentSetList.push(item);
                    break;
                }
            }
        }
        return EquipmentSetList;
    };
    /**
     * cancel
     */
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    setTimeout(function () {
        $(".modal-content").draggable({ containment: "#app", scroll: false });
    }, 100);
}]);
/**
 * searchWeatherCtrl
 */
app.controller('searchWeatherCtrl', ['$scope', '$modalInstance', 'equipment', function ($scope, $modalInstance, equipment) {
    $scope.newWeatherModel = {
        address: undefined,
        itemList: []
    };
    /**
     * 回车事件
     * @param e
     */
    $scope.myKeyUp = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.searchAddress();
        }
    };
    /**
     * 地区名称
     */
    $scope.searchAddress = function () {
        if ($scope.newWeatherModel.address) {
            $scope.newWeatherModel.itemList = [];
            for (var i in chinaCityList) {
                if (chinaCityList[i].cityZh.indexOf($scope.newWeatherModel.address) != -1) {
                    $scope.newWeatherModel.itemList.push(chinaCityList[i]);
                }
            }
        }
    };
    /**
     * 选择确定
     * @param item
     */
    $scope.confirm = function (item) {
        equipment.weatherCode = item.id;
        $modalInstance.dismiss('cancel');
    };
    /**
     * 选择列
     * @param item
     */
    $scope.clickItem = function (item) {
        equipment.weatherCode = item.id;
        $modalInstance.dismiss('cancel');
    };
    /**
     * cancel
     */
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    setTimeout(function () {
        $(".modal-content").draggable({ containment: "#app", scroll: false });
    }, 100);
}]);