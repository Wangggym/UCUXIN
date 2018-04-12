/**
 * Created by lxf on 2017/6/1.
 */
app.controller('cardInquireController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    var ctr = {
        init:function () {
            this.basic();
        },
        basic:function () {
            $scope.search = function () {
                if($scope.number){
                    ctr.getDetail($scope.number)
                }else{
                    toastr.info("请输入卡号")
                }
            };
            $scope.ID = undefined;
            $scope.cardDetail = {};
            $scope.unBind = function () {
                if($scope.ID){
                    applicationServiceSet.attendanceService.basicDataControlService.UnBindCardNo.send(undefined,[$scope.ID]).then(function (data) {
                        if(data.Ret == 0){
                            toastr.success("解绑成功！");
                            $scope.ID = undefined;
                            ctr.getDetail($scope.number);
                        }
                    })
                }
            }
        },
        //查询卡号详情
        getDetail:function (number) {
            applicationServiceSet.attendanceService.basicDataControlService.GetCardDetailInfo.send([number]).then(function (data) {
                if(data.Ret == 0){
                    $scope.cardDetail = data.Data;
                    $scope.ID = $scope.cardDetail.ID;
                }
            })
        }
    };
    ctr.init();
}]);