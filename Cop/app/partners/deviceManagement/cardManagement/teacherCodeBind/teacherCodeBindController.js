/**
 * Created by fanweihua on 2016/7/10
 * rewrite by lxf 2017/6/8
 * strCodeBindController
 * 老师卡号绑定
 */
app.controller('teacherCodeBindController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, applicationServiceSet, toastr) {
    /**
     * 老师卡号绑定：查询老师绑卡情况，获取机构下的所有班级
     */
    var controller = {
        init: function () {
            this.basic();
            this.getSchoolList();
        },
      //根据token prgid获取学校列表
      getSchoolList: function () {
        applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
          if (data.Ret == 0) {
            $scope.model.schoolList = data.Data;
          }
        });
      },

        //根据gid，name获取教师绑卡列表
        GetTeaCardList: function (gid) {
            applicationServiceSet.attendanceService.basicDataControlService.GetTeaCardList.send([gid,$scope.model.name, $scope.model.checked]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.list = data.Data;
                }
            })
        },
        //导出模版ExportStuCardList
        ExportStuCardList: function () {
            window.open(urlConfig + "OCS/v3/CardInfo/ExportTeaCardList?token=" + APPMODEL.Storage.getItem('copPage_token') + "&gid=" + $scope.model.school, "_parent")
        },
        //导入学生卡号关系
        upLoad: function (files) {
            applicationServiceSet.attendanceService.basicDataControlService.ImportTeaCardList.fileUpload(files).then(function (data) {
                if(data.Ret==0){
                    toastr.success("导入成功！");
                    $scope.model.exportError = '';
                }else {
                    $scope.model.exportError = data.Msg;
                }
            })
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
            //导入
            $scope.fileUpload = function (files) {
                console.log(files)
                if(files){
                    controller.upLoad(files);
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
            /*查询btn*/
            $scope.search = function () {
                if ($scope.model.school) {
                    controller.GetTeaCardList($scope.model.school);
                }
            };

            $scope.changeSchool = function () {
                $scope.model.class.ClassID = undefined;
            };
            $scope.goToBindCard = function (umid) {
                $state.go("access.app.partner.cardManagement.teaBindCard", {ID: umid})
            }
        }
    };
    controller.init();//学生卡号绑定
}]);
