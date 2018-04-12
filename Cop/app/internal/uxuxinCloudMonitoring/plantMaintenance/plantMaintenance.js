/**
 * Created by QiHan Wang on 2017/5/11.
 * ParametersSetController
 *
 */
app.controller('ParametersSetController', ['$scope', '$state', '$modal', '$stateParams', '$location', 'toastr', 'toastrConfig', 'EzConfirmConfig', 'EzConfirm', 'applicationServiceSet', function ($scope, $state, $modal, $stateParams, $location, toastr, toastrConfig, EzConfirmConfig, EzConfirm, applicationServiceSet) {
    'use strict';
    toastrConfig.preventOpenDuplicates = true;
    EzConfirmConfig.size = 'sm';

    var ctrl = (function () {

        var token = APPMODEL.Storage.copPage_token,
            appToken = APPMODEL.Storage.applicationToken;

        var service = function (method, params, body, fn) {
            if (Object.prototype.toString.call(body) === '[object Function]') {
                fn = body;
                body = undefined;
            }
            applicationServiceSet.cloudWatchService.cloudWatchApi[method].send(params, body).then(fn);
        };

        // 获取学列表
        var getSchoolList = function (keyword) {
            applicationServiceSet.commonService.schoolApi.getFuzzySchoolList.send([appToken, keyword]).then(function (data) {
                if (data.Ret === 0) {
                    vm.model.school = data.Data;
                }
            })
        }

        // 获取设备列表
        var getCopCameraList = function (gid, searchKey) {
            var school = vm.queryFields.school,
                searchKey = vm.queryFields.searchKey || '';

            service('getCopCameraList', [token, school, searchKey], function (data) {
                if (data.Ret === 0) {
                    vm.model.dataList = data.Data
                }
            });
        }

        // 删除
        var deleteCopCameras = function (arr) {
            if (!arr.length) {
                toastr.error('请先选择要删除的设备！');
                return;
            }
            service('deleteCopCameras', {GID: vm.queryFields.school, IDs: arr}, [token], function (data) {
                if (data.Ret === 0) {
                    toastr.success('删除成功！');
                    getCopCameraList();
                }
            });
        }

        // 批量添加时间段
        var batchSetCopCameraPubTime = function (submitData) {
            service('batchSetCopCameraPubTime', submitData, [token], function (data) {
                if (data.Ret === 0) {
                    toastr.success('批量添加成功！')
                }
            });
        }

        return {
            getSchoolList: getSchoolList,
            getCopCameraList: getCopCameraList,
            deleteCopCameras: deleteCopCameras,
            batchSetCopCameraPubTime: batchSetCopCameraPubTime
        }
    })();

    var vm = $scope.vm = {
        // 查询字段
        queryFields: {
            school: undefined,
            searchKey: undefined
        },
        // 提交数据
        submitData: {
            IDs: []
        },
        // 页面绑定数据模型
        model: {
            school: undefined,
            dataList: []
        },
        init: function () {
            //ctrl.getCopCameraList();

        },
        allClickSelected: function () {
            vm.submitData.IDs = [];
            if (vm.model.dataList.length) {
                angular.forEach(vm.model.dataList, function (item) {
                    item.selected = vm.allSelected;
                    if (vm.allSelected) vm.submitData.IDs.push(item.ID);
                });
            }
        },
        singleSelected: function (item) {
            if (item.selected) {
                vm.submitData.IDs.push(item.ID)
            } else {
                vm.submitData.IDs.splice(vm.submitData.IDs.indexOf(item.ID), 1);
            }

            if (vm.submitData.IDs.length === vm.model.dataList.length) {
                vm.allSelected = true;
            } else {
                vm.allSelected = false;
            }

        },
        refreshSearchKey: function (keyword) {
            if (!keyword) return;
            ctrl.getSchoolList(keyword)
        },
        // 查询 分页
        search: function () {
            ctrl.getCopCameraList();
        },
        save: function (item) {
            $state.go('access.app.internal.ucuxinCloudMonitoring.savePlantMaintenance', {
                id: item.ID,
                gid: vm.queryFields.school
            });
        },
        batchSet: function () {
            var modalInstance = $modal.open({
                templateUrl: 'batchSetCopCameraPubTime.html',
                controller: 'batchSetCopCameraPubTimeCtrl',
                //size: '',
                resolve: {
                    items: function () {
                        return {
                            GID: vm.queryFields.school,
                            IDs: vm.submitData.IDs
                        }
                    }
                }
            });

            modalInstance.result.then(function (data) {
                ctrl.batchSetCopCameraPubTime(data);

            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        },
        del: function (arr) {
            EzConfirm.create().then(function () {
                ctrl.deleteCopCameras(arr);
            }, function () {
            });
        },
        download: function () {
            window.location.href = urlConfig + 'nvr/v3/OpenCop/GetCopCamerasImportTemplate?token=' + APPMODEL.Storage.copPage_token;
        },
        upload: function (file) {
            if (!file) return;
            applicationServiceSet.cloudWatchService.cloudWatchApi.importCopCameras.fileUpload(file, [APPMODEL.Storage.copPage_token, vm.queryFields.school]).then(function (data) {
                if (data.Ret === 0) {
                    toastr.success('上传成功！');
                    ctrl.getCopCameraList();
                }
            });
        }
    };
    vm.init();
}]);


app.controller('batchSetCopCameraPubTimeCtrl', ['$scope', '$modalInstance', 'items', 'toastr', 'toastrConfig', function ($scope, $modalInstance, items, toastr, toastrConfig) {
    'use strict';
    toastrConfig.preventOpenDuplicates = true;


    var vm = $scope.vm = {
        submitData: {},
        model: {
            week: [
                {day: 0, text: '日', selected: false},
                {day: 1, text: '一', selected: false},
                {day: 2, text: '二', selected: false},
                {day: 3, text: '三', selected: false},
                {day: 4, text: '四', selected: false},
                {day: 5, text: '五', selected: false},
                {day: 6, text: '六', selected: false}
            ],
            timeSlots: [{startHours: undefined, startMinutes: undefined, endHours: undefined, endMinutes: undefined}]
        },
        delRule: function (index) {
            vm.model.timeSlots.splice(index, 1);
            if (!vm.model.timeSlots.length) {
                vm.model.timeSlots.push({
                    startHours: undefined,
                    startMinutes: undefined,
                    endHours: undefined,
                    endMinutes: undefined
                });
            }
        },
        addRule: function () {
            vm.model.timeSlots.push({
                startHours: undefined,
                startMinutes: undefined,
                endHours: undefined,
                endMinutes: undefined
            });
        },
        completionTime: function (value) {
            return value < 10 ? ('0' + value) : value;
        }
    }

    angular.extend(vm.submitData, items);

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.confirm = function () {
        // 当开启推流时配置推流数据
        if (vm.submitData.EIsPub) {
            // 提交星期数
            vm.submitData.EPubWeekDays = [];
            angular.forEach(vm.model.week, function (day) {
                if (day.selected) {
                    vm.submitData.EPubWeekDays.push(day.day)
                }
            });
            //if (!vm.submitData.EPubWeekDays.length) vm.submitData.EPubWeekDays = null;
            // 提交时间区间
            vm.submitData.EPubTimeSlots = [];


            for (var i = 0; i < vm.model.timeSlots.length; i++) {

                if (!/^\d+$/.test(vm.model.timeSlots[i].startHours) && vm.model.timeSlots[i].startHours !== undefined) {
                    toastr.error('第' + (i + 1) + '条时间段开始时间小时必须为小于24的正整数！');
                    return false;
                }
                if (!/^\d+$/.test(vm.model.timeSlots[i].startMinutes) && vm.model.timeSlots[i].startMinutes !== undefined) {
                    toastr.error('第' + (i + 1) + '条时间段开始时间分钟必须为小于60的正整数！');
                    return false;
                }
                if (!/^\d+$/.test(vm.model.timeSlots[i].endHours) && vm.model.timeSlots[i].endHours !== undefined) {
                    toastr.error('第' + (i + 1) + '条时间段结束时间小时必须为小于24的正整数！');
                    return false;
                }
                if (!/^\d+$/.test(vm.model.timeSlots[i].endMinutes) && vm.model.timeSlots[i].endMinutes !== undefined) {
                    toastr.error('第' + (i + 1) + '条时间段结束时间分钟必须为小于60的正整数！');
                    return false;
                }

                if (vm.model.timeSlots[i].startHours + 1) {
                    var newRange = {
                        startHours: vm.completionTime(parseInt(vm.model.timeSlots[i].startHours) || 0),
                        startMinutes: vm.completionTime(parseInt(vm.model.timeSlots[i].startMinutes) || 0),
                        endHours: vm.completionTime(parseInt(vm.model.timeSlots[i].endHours) || 0),
                        endMinutes: vm.completionTime(parseInt(vm.model.timeSlots[i].endMinutes) || 0)
                    };

                    // 验证小时与分钟
                    if (newRange.startHours > 24) {
                        toastr.error('第' + (i + 1) + '条时间段开始时间小时不能大于24！');
                        return false;
                    }
                    if (newRange.startMinutes > 60) {
                        toastr.error('第' + (i + 1) + '条时间段开始时间分钟不能大于60！');
                        return false;
                    }
                    if (newRange.endHours > 24) {
                        toastr.error('第' + (i + 1) + '条时间段结束时间小时不能大于24！');
                        return false;
                    }
                    if (newRange.endMinutes > 60) {
                        toastr.error('第' + (i + 1) + '条时间段结束时间分钟不能大于60！');
                        return false;
                    }

                    vm.model.timeSlots[i] = newRange;

                    var sTime = (+newRange.startHours) * 60 + (+newRange.startMinutes);
                    var eTime = (+newRange.endHours || 24) * 60 + (+newRange.endMinutes);

                    if (sTime > eTime) {
                        toastr.error('第' + (i + 1) + '条时间段开始时间不能大天结束时间！');
                        return false;
                    }
                    vm.submitData.EPubTimeSlots.push({
                        StartDayMinutes: sTime,
                        EndDayMinutes: eTime
                    });

                } else {
                    toastr.error('第' + (i + 1) + '条时间段未填写完整！');
                    return false;
                }
            }

            //if (!vm.submitData.EPubTimeSlots.length) vm.submitData.EPubTimeSlots = null;

            // 验证推流数据
            // 星期验证
            if (!vm.submitData.EPubWeekDays.length) {
                toastr.error('请选择推送星期！');
                return false;
            }

            // 星期验证
            if (!vm.submitData.EPubTimeSlots.length) {
                toastr.error('请填写推送时间段！');
                return false;
            }
        }

        $modalInstance.close(vm.submitData)
    }
}]);
