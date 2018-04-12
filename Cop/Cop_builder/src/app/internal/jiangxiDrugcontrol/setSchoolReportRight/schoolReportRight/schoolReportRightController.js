/**
 * Created by wangbin on 2017/5/9.
 */
app.controller('schoolReportRightController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    var schoolReportRight = {
        /**
         * 入口
         */
        init : function () {
            schoolReportRight.pageData();
            schoolReportRight.onEvent();
        },
        /**
         * 页面数据初始化
         */
        pageData : function () {
            $scope.schoolList = [];
            $scope.teacherList = [];
            $scope.entrance = [
                {
                    id : APPMODEL.jxjdAPPID,
                    name : '校参与报表'
                }
            ];
            $scope.model = {
                schoolId : undefined,
                teacherId : undefined,
                appId : undefined
            };
        },
        /**
         * 绑定页面相关的事件
         */
        onEvent : function () {

          // 选择学校
            $scope.selectSchool = function () {
                schoolReportRight.getTeacherList();
            };
            //学校模糊查询
            $scope.refreshSchool  = function (name) {
              if(name){
                schoolReportRight.getSchoolList(name);
              }
            };
            // 设置权限
            $scope.confirm = function (state) {
                if(!$scope.model.schoolId){
                    toastr.error('请选择学校！');
                    return;
                }
                if(!$scope.model.teacherId){
                    toastr.error('请选择教师！');
                    return;
                }
                if(!$scope.model.appId){
                    toastr.error('请选择APP入口！');
                    return;
                }
                schoolReportRight.setRight(state);
            };
        },
        /**
         * 获取学校
         */
        getSchoolList: function (name) {
            applicationServiceSet.internalServiceApi.jiangxiDrugcontrol.GetSchools.send([APPMODEL.Storage.getItem('copPage_token'),name]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.schoolList = data.Data;
                }
            });
        },
        /**
         * 获取老师list
         */
        getTeacherList : function (state) {
            applicationServiceSet.internalServiceApi.jiangxiDrugcontrol.GetStaff.send([APPMODEL.Storage.getItem("copPage_token"), $scope.model.schoolId,state]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.teacherList = data.Data;
                }
            });
        },
        /**
         * 权限分配
         */
        setRight : function (state) {
            applicationServiceSet.internalServiceApi.jiangxiDrugcontrol.SetAppAuth.send([APPMODEL.Storage.getItem("copPage_token"), $scope.model.schoolId,$scope.model.teacherId,$scope.model.appId,state]).then(function (data) {
                if (data.Ret == 0) {
                    toastr.success('操作成功!');
                    $scope.model = {
                        schoolId : undefined,
                        teacherId : undefined,
                        appId : undefined
                    };
                    $scope.teacherList = [];
                }
            });
        }
    };
    schoolReportRight.init();
}]);
