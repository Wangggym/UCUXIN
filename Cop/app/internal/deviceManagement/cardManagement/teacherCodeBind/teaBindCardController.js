/**
 * Created by LXF on 2017/6/9.
 */
app.controller('teaBindCardController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var ctr = {
        init: function () {
            this.basic();
            this.getDetail();
        },
        //获取老师绑卡详情
        getDetail: function () {
            applicationServiceSet.attendanceService.basicDataControlService.GetTeaCardByUMID.send([$stateParams.ID]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model = data.Data;
                }
            })
        },
        //保存老师信息
        SaveStuInfo: function (name, address) {
            applicationServiceSet.attendanceService.basicDataControlService.SaveStuInfo.send([$stateParams.ID, name, address]).then(function (data) {
                if(data.Ret == 0){
                    toastr.success("保存成功")
                }
            })
        },
        //删除图片
        DeleteStuImage: function (item) {
            applicationServiceSet.attendanceService.basicDataControlService.DeleteStuImage.send(undefined, [item.ID]).then(function (data) {
                if (data.Ret == 0) {
                    ctr.getDetail();
                }
            })
        },
        //添加图片
        AddStuImage: function (item) {
            applicationServiceSet.attendanceService.basicDataControlService.AddStuImage.send([$stateParams.ID, item.Pic, item.MType]).then(function (data) {
                if (data.Ret == 0) {
                    ctr.getDetail();
                }
            })
        },
        //图片上传 -=> 添加图片
        imgFileUpload: function (file, item) {
            applicationServiceSet.parAppServiceApi.corporateRegistrationIcon.ImageRegistrationUpload.fileUpload(file).then(function (data) {
                if (data.Ret == 0) {
                    item.Pic = data.Data.Url;
                    ctr.AddStuImage(item);
                }
            });
        },
        basic: function () {
            $scope.model = {
                Address: ""
            };
            //返回
            $scope.back = function () {
                $state.go("access.app.internal.cardManagement.teacherCodeBind");
            };
            //保存老师信息
            $scope.save = function () {
                ctr.SaveStuInfo($scope.model.StuType, $scope.model.Address);
            };
            //照片选择
            $scope.fileChange = function (file, item) {
                if (file) {
                    ctr.imgFileUpload(file, item);//图标上传
                }
            };
            //删除照片
            $scope.deleteImg = function (item) {
                ctr.DeleteStuImage(item);
            };
            //绑定卡号
            $scope.bind = function () {
                if (!$scope.model.newCard) {
                    toastr.error("请输入卡号");
                    return;
                }
                applicationServiceSet.attendanceService.basicDataControlService.BindCard.send([$stateParams.ID, $scope.model.newCard]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success("绑卡成功");
                        ctr.getDetail();
                        $scope.model.newCard = undefined;
                    }
                })
            };
            //解绑卡号
            $scope.unbind = function (item) {
                applicationServiceSet.attendanceService.basicDataControlService.UnBindCardNo.send(undefined,[item.ID]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success("解绑卡号成功");
                        ctr.getDetail();
                    }
                })
            };
            //注销卡号
            $scope.logout = function (item) {
                applicationServiceSet.attendanceService.basicDataControlService.CancelCard.send(undefined,[item.ID]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success("注销卡号成功");
                        ctr.getDetail();
                    }
                })
            }
        }
    };
    ctr.init();
}]);