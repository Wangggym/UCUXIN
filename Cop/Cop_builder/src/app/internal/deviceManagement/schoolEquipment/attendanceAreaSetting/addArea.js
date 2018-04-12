/**
 * Created by Administrator on 2017/6/6.
 */
app.controller('addArea', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var ctrl = {
        init: function () {
            this.basic();
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
        //获取班级
        GetClassGrades:function (gid) {
            applicationServiceSet.attendanceService.basicDataControlService.GetClassGrades.send([gid]).then(function (data) {
                if (data.Ret == 0) {
                    //修改数据结构用于ng-option
                    var array = [];
                    for(var i = 0;i< data.Data.length ;i++){
                        data.Data[i].ClassList.forEach(function (e, index) {
                            array.push(e);
                        })
                    }
                    $scope.model.classList = array;
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
        //添加或更新刷卡区域
        AddOrUpClockArea: function () {

            var _isSend= $scope.model.isSendData == 1? true:false;
            var _isteacher =undefined,_isMen=undefined;

            $scope.model.isMen=$scope.model.isMen==-11?undefined:$scope.model.isMen;
            $scope.model.isteacher=$scope.model.isteacher==-11?undefined:$scope.model.isteacher;

            if(!_isSend){
                $scope.model.isMen=undefined;
                $scope.model.isteacher=undefined;
            }

            applicationServiceSet.attendanceService.basicDataControlService.AddOrUpClockArea.send(["",
                $scope.model.selectedGid,$scope.model.areaName,$scope.model.clockType,$scope.model.attendanceTarget,$scope.selectedClassList,
                _isSend,$scope.model.isMen,$scope.model.isteacher

            ]).then(function (data) {
                if (data.Ret == 0) {
                    toastr.success("添加成功");
                    $state.go("access.app.internal.schoolEquipment.attendanceAreaSetting");
                }
            })
        },

        basic: function () {
            $scope.selectedClassList = []; //待提交班级
            $scope.model = {
                schoolList: [],
                selectGidName: undefined,
                selectedGid: undefined,
                attendanceTarget:undefined,
                selectedClassList:[],
                clockType:undefined,
                isSendData:1,
                isteacher:3,
                isMen:3

            };
            //切换打卡对象，清空原有选项
            $scope.clear = function () {
                $scope.model.selectedClassList = undefined;
                $scope.selectedClassList = []; //待提交班级
            };
          /*模糊查询学校*/
            $scope.refreshAddresses = function (selectedGid) {
                if (selectedGid) {
                    $scope.model.selectGidName = selectedGid;
                    ctrl.getSchoolList(selectedGid);
                }
            };
            //清空gid
            $scope.deleteSelectedGid = function () {
                $scope.model.selectedGid = undefined;
            };
            $scope.changeGid =function () {
                ctrl.GetClassGrades($scope.model.selectedGid)
            };
          /*----------------模糊查询学校-end--------------*/

            //保存
            $scope.save = function () {

                if(!$scope.model.selectedGid){
                    toastr.error("请选择学校");
                    return;
                }
                if(!$scope.model.clockType){
                    toastr.error("请选择刷卡场景");
                    return;
                }
                if(!$scope.model.areaName){
                    toastr.error("请输入区域名称");
                    return;
                }
                if(!$scope.model.attendanceTarget){
                    toastr.error("请选择刷卡对象");
                    return;
                }else if($scope.model.attendanceTarget == 2 && $scope.model.selectedClassList.length == 0){
                    toastr.error("请选择刷卡班级");
                    return;
                }
                if($scope.model.attendanceTarget == 1){
                    //为全校时，清空选择班级
                    $scope.model.selectedClassList = [];
                }
                if($scope.model.attendanceTarget == 2){
                    $scope.model.selectedClassList.forEach(function (e, i) {
                        var obj = {
                            ObjID:e.ClassID,
                            ObjName:e.ClassName
                        };
                        $scope.selectedClassList.push(obj)
                    })
                }
                ctrl.AddOrUpClockArea();
            };

            $scope.removed = function (a, b) {
                $scope.model.selectedClassList = $scope.model.selectedClassList.filter(function (e, i) {
                    return e.ClassID !== b;
                })
            };
        }
    };
    ctrl.init();
}]);
