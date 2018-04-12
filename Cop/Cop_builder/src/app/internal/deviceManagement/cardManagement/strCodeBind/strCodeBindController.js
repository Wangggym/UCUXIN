/**
 * Created by fanweihua on 2016/7/10
 * rewrite by lxf 2017/6/8
 * strCodeBindController
 * 学生卡号绑定
 */
app.controller('strCodeBindController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, applicationServiceSet, toastr) {
    /**
     * 学生卡号绑定：查询学生绑卡情况，获取机构下的所有班级
     */
    var controller = {
        init: function () {
            this.basic();
        },
        //模糊查询 根据token获取学校列表
        getSchoolList: function (schoolName) {
            applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), schoolName]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.schoolList = data.Data;
                }
            });
        },
        //获取班级列表
        getClassList: function (gid) {
            applicationServiceSet.internalServiceApi.paymentTableSearch.getClassList.send([APPMODEL.Storage.getItem('copPage_token'), gid]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.classList = data.Data;
                }
            });
        },
        //根据gid获取学生绑卡列表
        GetStuCardList: function (gid, name) {
            applicationServiceSet.attendanceService.basicDataControlService.GetStuCardList.send([gid, $scope.model.class.ClassID, $scope.model.name, $scope.model.checked]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.list = data.Data;
                    $scope.showSchoolName = name
                }
            })
        },
        //导出模版ExportStuCardList
        ExportStuCardList: function () {
            window.open(urlConfig + "OCS/v3/CardInfo/ExportStuCardList?token=" + APPMODEL.Storage.getItem('copPage_token') + "&gid=" + $scope.model.school, "_parent")
        },
        //基础操作集合
        basic: function () {
            $scope.model = {
                schoolList: [],
                school: undefined,
                class: {
                    ClassID: undefined
                },
                name: undefined,
                checked: false,
                list: [],
                exportError:'',
            };
            //导入学生卡号关系
            $scope.fileUpload = function (files) {
                if(files){
                    applicationServiceSet.attendanceService.basicDataControlService.ImportStuCardList.fileUpload(files,[APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if(data.Ret==0){
                            toastr.success("导入成功！");
                            $scope.model.exportError = '';
                        }else {
                            $scope.model.exportError = data.Msg;
                        }
                    })
                }
            };
            //导入学生信息
            $scope.fileUploadAddress = function (files) {
                if(files){
                    applicationServiceSet.attendanceService.basicDataControlService.ImportStuInfoList.fileUpload(files).then(function (data) {
                        if(data.Ret==0){
                            toastr.success("导入成功！");
                            $scope.model.exportError = '';
                        }else {
                            $scope.model.exportError = data.Msg;
                        }
                    })
                }
            };
            /*导出*/
            $scope.exportExcel = function () {
                if (!$scope.model.school) {
                    toastr.error("请选择一所学校");
                    return;
                }
                controller.ExportStuCardList();
            };
            /*下载学生住址导入模版*/
            $scope.downLoadStuInfoTemplate = function () {
                if(!$scope.model.school){
                    toastr.error("请选择一所学校");
                    return;
                }
                window.open(urlConfig + "OCS/v3/CardInfo/DownLoadStuInfoTemplate?token=" + APPMODEL.Storage.getItem('copPage_token') + "&gid=" + $scope.model.school, "_parent")
            };
            /*下载学生卡号导入关系*/
            $scope.downLoadStuCardTemplate = function () {
                if(!$scope.model.school){
                    toastr.error("请选择一所学校");
                    return;
                }
                window.open(urlConfig + "OCS/v3/CardInfo/DownLoadStuCardTemplate?token=" + APPMODEL.Storage.getItem('copPage_token') + "&gid=" + $scope.model.school, "_parent")
            };
            /*查询btn*/
            $scope.search = function () {
                if ($scope.model.school) {
                    controller.GetStuCardList($scope.model.school, $scope.schoolName);
                }
            };
            /*学校模糊查询*/
            $scope.deleteSchool = function () {
                $scope.model.school = undefined;
            };
            $scope.changeSchool = function () {
                controller.getClassList($scope.model.school);
            };
            /*班级查询*/
            $scope.deleteClass = function () {
                $scope.model.class = undefined;
            };
            $scope.refreshAddresses = function (schoolName) {
                if (schoolName) {
                    $scope.schoolName = schoolName;
                    controller.getSchoolList(schoolName);//get school org pages list
                }
            };
            $scope.goToBindCard = function (umid) {
                $state.go("access.app.internal.cardManagement.stuBindCard", {ID: umid})
            }
        }
    };
    controller.init();//学生卡号绑定
}]);