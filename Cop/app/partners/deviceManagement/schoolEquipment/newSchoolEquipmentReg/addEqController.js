/**
 * Created by Administrator on 2017/6/6.
 */
app.controller('addEqController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var EC = {
        init:function () {
            this.basic();
            this.getAllEq();
            this.GetClockTypeList();
            this.getSchoolList();
        },
      //根据token prgid获取学校列表
        getSchoolList: function () {
            applicationServiceSet.attendanceService.basicDataControlService.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.schoolList = data.Data;
                }
            });
        },
        //获取所有供应商设备
        getAllEq:function () {
            applicationServiceSet.attendanceService.basicDataControlService.GetSupplierEqList.send([]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.eqList = data.Data;
                }
            })
        },
        //获取学校刷卡区域
        GetClockAreaSimpleList:function (id,typeId) {
            applicationServiceSet.attendanceService.basicDataControlService.GetClockAreaSimpleList.send([id,typeId]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.areaList = data.Data;
                }
            })
        },
        //获取所有刷卡场景
        GetClockTypeList:function () {
          applicationServiceSet.attendanceService.basicDataControlService.GetClockTypeList.send([APPMODEL.Storage.getItem("copPage_token")]).then(function (data) {
              if(data.Ret == 0){
                  $scope.model.ClockTypeList = data.Data;

              }
          })
        },
        //新增
        addEq:function (e) {
            var a = e.argList;
            if(e.argList.length !== 0){
                a = a.map(function (item, index) {
                    delete item.SupplierEqID;
                    delete item.ID;
                    delete item.$$hashKey;
                    item.ParamName = item.ParamTypeName;
                    delete item.ParamTypeName;
                    if(!item.Val){
                        item.Val = "";
                    }
                    return item;
                });
            }
            applicationServiceSet.attendanceService.basicDataControlService.AddOrUpEq.send([e.id,e.selectedGid,e.ENO,e.ClockAreaID,e.SupplierEqID,e.inOutModel,e.inOut,e.Desc,e.EqReaders,a,e.ClockTypeID]).then(function (data) {
                if (data.Ret == 0) {
                    toastr.success("添加成功！");
                    $state.go("access.app.partner.schoolEquipment.newSchoolEquipmentReg",{ID:e.selectedGid})
                }
            })
        },
        //获取设备参数
        getEqArgument:function (id) {
            applicationServiceSet.attendanceService.basicDataControlService.GetSupplierEqParamList.send([id]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.argList = data.Data;
                }
            })
        },
        basic:function () {
            $scope.model = {
                ClockTypeList:[],
                areaList:[], //设备参数
                argList:[],
                eqList:[],
                schoolList: [],
                selectGidName: undefined,
                id:"",
                selectedGid: undefined,
                ENO:undefined,
                inOutModel:undefined,
                inOut:undefined,
                SupplierEqID:undefined,  //设备id
                EqReaders:[],
                ClockAreaID:undefined,
                ClockTypeID:undefined
            };
            $scope.changeGid = function () {
                EC.GetClockAreaSimpleList($scope.model.selectedGid,$scope.model.ClockTypeID);
            };
            $scope.changeClockTypeID = function () {
                if($scope.model.selectedGid){
                    EC.GetClockAreaSimpleList($scope.model.selectedGid,$scope.model.ClockTypeID);
                }
            };
            //清空gid
            $scope.deleteSelectedGid = function () {
                $scope.model.selectedGid = undefined;
            };
            //选择进出区分模式
            $scope.selectInOutModel= function () {
                $scope.model.EqReaders = [];
                $scope.model.inOut = undefined;
            };

            /*----------------模糊查询学校-end--------------*/

            //选择设备 查询参数
            $scope.selectEqId = function (id) {
                EC.getEqArgument(id);
            };
            //保存
            $scope.save = function () {
                if(!$scope.model.selectedGid || !$scope.model.ENO || !$scope.model.SupplierEqID || !$scope.model.inOutModel || !$scope.model.Desc){
                    toastr.error("请填写带*选项！");
                    return;
                }
                if($scope.model.inOutModel == 3){
                    if(!$scope.model.inOut){
                        toastr.error("请选择进出类型");
                        return;
                    }
                }
                if($scope.model.inOutModel == 4){
                    if($scope.model.EqReaders.length == 0){
                        toastr.error("请至少添加一个读头");
                        return;
                    }
                }
                EC.addEq($scope.model)
            };
            //添加读头
            $scope.addReader = function () {
                $scope.model.EqReaders.push({
                    ReaderNo:"",
                    InOutType:""
                })
            };
            //删除读头
            $scope.del = function (index) {
                $scope.model.EqReaders.splice(index,1);
            };
            //打开天气选择
            $scope.openWeatherModal = function (item) {
                var modal = $modal.open({
                    templateUrl: 'newAddEqPartner.html',
                    controller: 'newAddEqPartnerCtr',
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
app.controller('newAddEqPartnerCtr', ['$scope', '$modalInstance', 'item', function ($scope, $modalInstance, item) {
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
