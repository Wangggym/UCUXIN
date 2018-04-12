/**
 * Created by fanweihua on 2017/2/9.
 * expertMaintenanceDetailedInformationController
 * expert Maintenance Detailed Information
 */
'use strict';
app.controller('expertMaintenanceDetailedInformationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', 'cityList', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet, cityList) {
    /**
     * 专家维护详细信息
     * @type {{init: init, variable: variable, operation: operation, setting, serviceApi}}
     */
    var expertMaintenanceDetailedInformation = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.operation();//操作
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                id: $stateParams.id,
                name: undefined,//专家名称
                label: undefined,//标签
                phoneNum: undefined,//手机号
                uid: undefined,
                ImgUrl: undefined,
                imageUrl: undefined,
                Title: undefined,
                Instro: undefined,//简介
                cityDataList: cityList,
                province: undefined,//省
                provinceList: [],
                city: undefined,//市
                cityList: [],
                county: undefined,//县
                countyList: [],
                address: undefined,//地址
                sortValue: undefined,//排序值
                context: undefined//复文本内容
            };
            var provinceList = [];
            for (var i in cityList) {
                provinceList.push(expertMaintenanceDetailedInformation.setting.cityList(cityList[i]));
            }
            $scope.model.provinceList = provinceList;
            // 编辑器初始化
            $scope.context = new Object();
        },
        /**
         * 操作
         */
        operation: function () {
            /**
             * 返回
             */
            $scope.backHistory = function () {
                expertMaintenanceDetailedInformation.setting.backHistory();//返回
            };
            /**
             * 图片选择
             * @param file
             */
            $scope.fileChange = function (file) {
                if (file) {
                    expertMaintenanceDetailedInformation.serviceApi.fileUpload(file);//image file upload
                }
            };
            /**
             * 选择省
             */
            $scope.provinceChange = function () {
                if ($scope.model.province) {
                    $scope.model.city = undefined;
                    $scope.model.county = undefined;
                    for (var i in $scope.model.cityDataList) {
                        if ($scope.model.cityDataList[i].id == $scope.model.province) {
                            $scope.model.cityList = $scope.model.cityDataList[i].sub;
                            break;
                        }
                    }
                }
            };
            /**
             * 选择市
             */
            $scope.cityChange = function () {
                if ($scope.model.city) {
                    $scope.model.county = undefined;
                    for (var i in $scope.model.cityList) {
                        if ($scope.model.city == $scope.model.cityList[i].id) {
                            $scope.model.countyList = $scope.model.cityList[i].sub;
                            break;
                        }
                    }
                }
            };
            /**
             * 保存
             */
            $scope.save = function () {
                $scope.model.context = $scope.context.returnUeditText();
                if (!$scope.model.id || $scope.model.id == '' || typeof $scope.model.id == 'undefined') {
                    $scope.model.id = 0;
                }
                if (!$scope.model.phoneNum) {
                    toastr.error("请填写手机号");
                    return;
                }
                if (!$scope.model.context) {
                    toastr.error("请填写详细介绍");
                    return;
                }
                //根据手机号获取用户信息
                expertMaintenanceDetailedInformation.serviceApi.getUserByTel(function (data) {
                    if (data) {
                        $scope.model.uid = data.UID;
                    }
                    expertMaintenanceDetailedInformation.serviceApi.addOrModifyExpert();//添加或修改专家信息（model.ID为0则为增加）
                });
            };
            /**
             * 取消
             */
            $scope.cancel = function () {
                expertMaintenanceDetailedInformation.setting.backHistory();//返回
            };
            if ($scope.model.id) {
                this.serviceApi.getExpertByID();//根据心理专家ID获取详细信息
            }
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 数据处理
                 * @param data
                 */
                dataHandle: function (data) {
                    $scope.model.imageUrl = data.HeadPicUrl;//头像
                    $scope.model.address = data.Addr;//地址
                    $scope.model.name = data.Name;//专家名称
                    $scope.model.label = data.Label;//标签
                    $scope.model.Instro = data.Instro;//简介
                    $scope.model.Title = data.Title;//认证信息
                    $scope.model.sortValue = data.Sort;//排序值
                    $scope.model.province = data.PrinviceID;//省
                    $scope.model.phoneNum = data.Tel;//手机号
                    $scope.provinceChange();
                    $scope.model.city = data.CityID;//市
                    $scope.cityChange();
                    $scope.model.county = data.AreaID;//县
                    $scope.model.uid = data.UID;
                    $scope.context.receiveUeditText(data.Cont);
                },
                /**
                 * 城市List
                 * @param data
                 */
                cityList: function (data) {
                    return {
                        name: data.name,
                        id: data.id,
                        type: data.type ? data.type : undefined
                    };
                },
                /**
                 * 返回
                 */
                backHistory: function () {
                    var name = '', tel = '', url = 'access/app/internal/nutritionOperationManagement/expertMaintenance?id=' + $stateParams.id;
                    if ($stateParams.name) {
                        name = $stateParams.name;
                        url += '&name=' + name;
                    }
                    if ($stateParams.tel) {
                        tel = $stateParams.tel;
                        url += '&tel=' + tel;
                    }
                    $location.url(url);
                }
            };
        })(),
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * 根据营养专家ID获取详细信息
                 */
                getExpertByID: function () {
                    applicationServiceSet.internalServiceApi.nutritionHealth.GetExpertByID.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.id]).then(function (data) {
                        if (data.Ret == 0) {
                            expertMaintenanceDetailedInformation.setting.dataHandle(data.Data);//数据处理
                        }
                    });
                },
                /**
                 * 添加或修改专家信息（model.ID为0则为增加）
                 */
                addOrModifyExpert: function () {
                    applicationServiceSet.internalServiceApi.nutritionHealth.AddOrModifyExpert.send([$scope.model.id, $scope.model.name, $scope.model.Instro, $scope.model.Title, $scope.model.label, $scope.model.imageUrl, $scope.model.context, $scope.model.sortValue, $scope.model.province, $scope.model.city, $scope.model.county, $scope.model.address, $scope.model.phoneNum, $scope.model.uid], [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("添加成功");
                            $location.url('access/app/internal/nutritionOperationManagement/expertMaintenance');
                        } else {
                            setTimeout(function () {
                                $("#mySmallModalLabel").modal('hide');
                            }, 2000);
                            // toastr.error(data.Msg);
                        }
                    });
                },
                /**
                 * 根据手机号获取用户信息
                 * @param callBack
                 */
                getUserByTel: function (callBack) {
                    applicationServiceSet.internalServiceApi.userManagementInstitution.GetUserByTel.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.phoneNum]).then(function (data) {
                        if (data.Ret == 0) {
                            callBack(data.Data);
                        }
                    });
                },
                /**
                 * image file upload
                 * @param file
                 */
                fileUpload: function (file) {
                    applicationServiceSet.parAppServiceApi.applicationFeeOpen.imageFileUpload.fileUpload(file).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.imageUrl = data.Data.Url;
                        }
                    });
                }
            };
        })()
    };
    expertMaintenanceDetailedInformation.init();//入口
}]);