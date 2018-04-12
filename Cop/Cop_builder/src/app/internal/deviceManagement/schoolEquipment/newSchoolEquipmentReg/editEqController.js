/**
 * Created by Administrator on 2017/6/6.
 */
app.controller('editEqController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var EC = {
        init: function () {
            this.basic();
            // this.getAllEq();
            this.getDetail($stateParams.ID);
            this.GetClockTypeList();
        },
        //模糊查询 根据token获取学校列表
        getSchoolList: function (selectedGid) {
            applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.schoolList = data.Data;
                }
            });
        },
        //获取所有供应商设备
        getAllEq: function () {
            applicationServiceSet.attendanceService.basicDataControlService.GetSupplierEqList.send([]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.eqList = data.Data;
                }
            })
        },
        //获取设备详情
        getDetail: function (id) {
            applicationServiceSet.attendanceService.basicDataControlService.GetEq.send([id]).then(function (data) {
                if (data.Ret == 0) {
                    var res = data.Data;
                    $scope.model.selectGidName = res.GName;// 学校名
                    $scope.model.selectedGid = res.GID;//学校id
                    $scope.model.ENO = res.ENO;
                    /*打卡区域和设备安装地点*/
                    $scope.model.Desc = res.Desc;
                    $scope.model.ClockTypeID = res.ClockTypeID;
                    EC.GetClockAreaSimpleList(res.GID, res.ClockAreaID, res.ClockTypeID);
                    /*设备名称和参数*/
                    $scope.model.SupplierEqID = res.SupplierEqID;
                    $scope.model.argList = res.EqParams;

                    /*进出区分模式*/
                    $scope.model.inOutModel = res.InOutModel;
                    /*进出*/
                    $scope.model.inOut = res.InOutType;
                    /*读头*/
                    $scope.model.EqReaders = res.EqReaders;
                }
            })
        },
        //获取所有刷卡场景
        GetClockTypeList: function () {
            applicationServiceSet.attendanceService.basicDataControlService.GetClockTypeList.send([APPMODEL.Storage.getItem("copPage_token")]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.ClockTypeList = data.Data;
                }
            })
        },
        //获取学校刷卡区域
        GetClockAreaSimpleList: function (id, areaID, clockTypeID) {
            applicationServiceSet.attendanceService.basicDataControlService.GetClockAreaSimpleList.send([id, clockTypeID]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.areaList = data.Data;
                    if (areaID) {
                        $scope.model.ClockAreaID = areaID;
                    }
                }
            })
        },
        //编辑设备
        editEq: function (e) {

            //判断进出模式类型 清空多余选项。
            if (e.inOutModel == 1 || e.inOutModel == 2) {
                $scope.model.EqReaders = [];
                $scope.model.inOut = undefined;
            } else if (e.inOutModel == 3) {
                $scope.model.EqReaders = [];
            } else if (e.inOutModel == 4) {
                $scope.model.inOut = undefined;
            }
            var a = e.argList;
            if (a.length !== 0) {
                a = a.map(function (item, index) {
                    delete item.$$hashKey;
                    return item;
                })
            }
            applicationServiceSet.attendanceService.basicDataControlService.AddOrUpEq.send([e.id, e.selectedGid, e.ENO, e.ClockAreaID, e.SupplierEqID, e.inOutModel, e.inOut, e.Desc, e.EqReaders, a, e.ClockTypeID]).then(function (data) {
                if (data.Ret == 0) {
                    toastr.success("编辑成功！");
                    $state.go("access.app.internal.schoolEquipment.newSchoolEquipmentReg", {ID: e.selectedGid})
                }
            })
        },

        basic: function () {
            $scope.model = {
                ClockTypeList: [],  //所有刷卡场景
                areaList: [],
                argList: [],
                eqList: [],
                schoolList: [],
                selectGidName: undefined,
                id: $stateParams.ID,
                selectedGid: undefined,
                ENO: undefined,
                inOutModel: undefined,
                inOut: undefined,
                SupplierEqID: undefined,  //设备id
                EqReaders: [],
                ClockAreaID: undefined,
                EqParams: []
            };
            /*模糊查询学校*/
            $scope.refreshAddresses = function (selectedGid) {
                if (selectedGid) {
                    $scope.model.selectGidName = selectedGid;
                    EC.getSchoolList(selectedGid);
                }
            };

            $scope.changeClockTypeID = function () {
                EC.GetClockAreaSimpleList($scope.model.selectedGid, undefined, $scope.model.ClockTypeID);
            };


            //清空gid
            $scope.deleteSelectedGid = function () {
                $scope.model.selectedGid = undefined;
            };

            /*----------------模糊查询学校-end--------------*/

            //添加读头
            $scope.addReader = function () {
                $scope.model.EqReaders.push({
                    ReaderNo: "",
                    InOutType: ""
                })
            };
            //返回
            $scope.back = function () {
                // $state.go("access.app.internal.schoolEquipment.newSchoolEquipmentReg",{ID:$scope.model.selectedGid});
                $state.go("access.app.internal.schoolEquipment.newSchoolEquipmentReg");
            };
            //保存
            $scope.save = function () {
                if (!$scope.model.selectedGid || !$scope.model.ENO || !$scope.model.SupplierEqID || !$scope.model.inOutModel || !$scope.model.Desc) {
                    toastr.error("请填写带*选项！");
                    return;
                }
                if ($scope.model.inOutModel == 3) {
                    if (!$scope.model.inOut) {
                        toastr.error("请选择进出类型");
                        return;
                    }
                }
                if ($scope.model.inOutModel == 4) {
                    if ($scope.model.EqReaders.length == 0) {
                        toastr.error("请至少添加一个读头");
                        return;
                    }
                }
                EC.editEq($scope.model)
            }
            //打开天气选择
            $scope.openWeatherModal = function (item) {
                var modal = $modal.open({
                    templateUrl: 'newEditEq.html',
                    controller: 'newEditEq',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        item: function () {
                            return item
                        }
                    }
                });
                modal.result.then(function () {

                }, function (result) {
                    console.log(item)
                });
            }
        }
    };
    EC.init();
}]);
app.controller('newEditEq', ['$scope', '$modalInstance', 'item', function ($scope, $modalInstance, item) {
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
    $scope.confirm = function (e) {
        item.Val = e.id;
        $modalInstance.dismiss('cancel');
    };
    /**
     * 选择列
     * @param item
     */
    $scope.clickItem = function (e) {
        item.Val = e.id;
        $modalInstance.dismiss('cancel');
    };
    /**
     * cancel
     */
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    // setTimeout(function () {
    //     $(".modal-content").draggable({ containment: "#app", scroll: false });
    // }, 100);
}]);