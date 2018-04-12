/**
 * Created by QiHan Wang on 2017/2/8.
 * Save Service Controller
 */
app.controller('SaveServiceController', ['$scope', '$state', 'toastr', 'toastrConfig', 'EzConfirm', 'applicationServiceSet', function ($scope, $state, toastr, toastrConfig, EzConfirm, applicationServiceSet) {
    'use strict';
    toastrConfig.preventOpenDuplicates = true;
    var imgName = '未上传图片';
    var ctrl = (function () {
        var token = APPMODEL.Storage.copPage_token;

        var service = function (method, arr, list, fn) {
            if (Object.prototype.toString.call(list) === '[object Function]') {
                fn = list;
                list = undefined;
            }
            applicationServiceSet.internalServiceApi.nutritionHealth[method].send(arr, list).then(fn);
        };

        var saveService = function () {

            service('saveService', vm.submitData, function (data) {
                if (data.Ret === 0) {
                    toastr.success('添加成功！');
                    $state.go('access.app.internal.nutritionBasicDictionary.serviceList');
                }
            });
        };

        var getSingleService = function (id) {
            service('getSingleService', [token, id], function (data) {
                if (data.Ret === 0) {
                    angular.extend(vm.submitData, data.Data);
                    vm.submitData.ST = vm.submitData.ST ? 1 : 2;
                }
            });
        };

        //获取量表清单
        var getScales = function () {
            service('GetScales', [token], function (data) {
                if (data.Ret == 0) {
                    vm.scaleNameList = data.Data;
                }
            })
        };

        return {
            getSingleService: getSingleService,
            saveService: saveService,
            getScales: getScales
        }
    })();

    var vm = $scope.vm = {
        submitData: {
            ID: undefined,
            Name: undefined,
            Category: undefined,
            Money: undefined,
            Instro: undefined,
            Url: undefined,
            ImgUrl: undefined,
            ST: 2,
            CDate: undefined,
            ValidDays: undefined,
            ScaleID: undefined,
            ScaleName: undefined,
            Notes: undefined
        },
        // 新增 or 修改
        isAdd: $state.params.id,
        init: function () {
            ctrl.getScales();
            this.isAdd && ctrl.getSingleService(this.isAdd);
        },

        save: function () {
            if (!this.submitData.Name) {
                toastr.error('请填写服务标题！');
                return;
            }
            if (!this.submitData.Category) {
                toastr.error('请选择类别！');
                return;
            }
            if (!this.submitData.Money) {
                toastr.error('请填写服 务金额！');
                return;
            }
            if (!this.submitData.Instro) {
                toastr.error('请填写服务介绍！');
                return;
            }
            if (!this.submitData.ImgUrl) {
                toastr.error('请选择服务缩略图！');
                return;
            }
            if (!this.submitData.Url) {
                toastr.error('请填写服务链接！');
                return;
            }
            if (!this.submitData.ST) {
                toastr.error('请填写服务状态！');
                return;
            }
            this.submitData.ST = (+this.submitData.ST === 1) ? true : false;

            ctrl.saveService();
        },
        cancel: function () {
            $state.go('access.app.internal.nutritionBasicDictionary.serviceList');
        },
        // 缩略图
        uploadPic: function (file) {
            if (!file) {
                $scope.vm.picFile = imgName;
                return;
            } else {
                imgName = $scope.vm.picFile;
            }
            applicationServiceSet.parAppServiceApi.applicationFeeOpen.imageFileUpload.fileUpload(file).then(function (data) {
                if (data.Ret == 0) {
                    vm.submitData.ImgUrl = data.Data.Url;
                } else {
                    toastr.error("图片上传失败");
                }
            });
        }
    };
    vm.init();
}]);