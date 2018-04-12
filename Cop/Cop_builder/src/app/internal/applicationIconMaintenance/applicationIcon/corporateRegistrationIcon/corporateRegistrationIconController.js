/**
 * Created by fanweihua on 2017/5/25.
 * 图标维护
 */
app.controller('corporateRegistrationIconController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    var corporateRegistrationIcon = {
        //入口
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
        },
        //变量声明
        variable: function () {
            $scope.model = {
                id: undefined,
                imgUrl: undefined,
                imgUrlPath: undefined,
                imageDesc: undefined,//图标描述
                imageList: []
            };
        },
        //操作
        operation: function () {
            //图标选择
            $scope.fileChange = function (file) {
                if (file) {
                    corporateRegistrationIcon.service.imageUpload(file);//图标上传
                }
            };
            //保存
            $scope.save = function () {
                corporateRegistrationIcon.service.uploadIcon();//图标上传保存
            };
            //删除
            $scope.deleteIcon = function (item) {
                corporateRegistrationIcon.service.deleteByIcon(item);//删除
            };
            this.service.getIconList();//获取图标列表
        },
        //服务
        service: (function () {
            return {
                //图标上传
                imageUpload: function (file) {
                    applicationServiceSet.parAppServiceApi.corporateRegistrationIcon.ImageRegistrationUpload.fileUpload(file).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.imgUrlPath = data.Data.Url;
                        }
                    });
                },
                //图标上传保存
                uploadIcon: function () {
                    applicationServiceSet.parAppServiceApi.corporateRegistrationIcon.UploadIcon.send([$scope.model.id, $scope.model.imageDesc, $scope.model.imgUrlPath], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('保存成功');
                            corporateRegistrationIcon.service.getIconList();//获取图标列表
                        }
                    });
                },
                //获取图标列表
                getIconList: function () {
                    applicationServiceSet.parAppServiceApi.corporateRegistrationIcon.GetIconList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.imageList = data.Data;
                        }
                    });
                },
                //删除图标
                deleteByIcon: function (item) {
                    applicationServiceSet.parAppServiceApi.corporateRegistrationIcon.DeleteByIcon.send([item.Id, item.Des, item.Path], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('删除成功');
                            corporateRegistrationIcon.service.getIconList();//获取图标列表
                        }
                    });
                }
            }
        })()
    };
    corporateRegistrationIcon.init();//入口
}]);
