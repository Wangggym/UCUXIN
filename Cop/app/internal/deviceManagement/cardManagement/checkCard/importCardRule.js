/**
 * Created by lxf on 2017/6/21.
 */
app.controller('importCardRule', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    var ctr = {
        init:function () {
            this.basic();
        },
        //导入卡号关系
        upLoad: function (files) {
            applicationServiceSet.attendanceService.basicDataControlService.ImportCard.fileUpload(files,[APPMODEL.Storage.getItem("orgid"),$scope.rule]).then(function (data) {
                if(data.Ret == 0){
                    toastr.success("导入成功")
                }else{
                    $scope.errorTips = data.Msg;
                }
            })
        },
        basic:function () {
            $scope.ICRules = [{
                name:"原始物理卡号",
                value:"32"
            },{
                name:"两两交换后转10进制",
                value:"16"
            },{
                name:"10进制卡号",
                value:"8"
            },];
            $scope.rule = "32";
            $scope.errorTips = "";
            //导入
            $scope.fileUpload = function (files) {
                if(files){

                    ctr.upLoad(files);
                }
            };
        },

    };
    ctr.init();
}]);