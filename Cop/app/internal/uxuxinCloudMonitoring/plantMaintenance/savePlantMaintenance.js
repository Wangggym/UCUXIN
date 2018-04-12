/**
 * Created by QiHan Wang on 2017/5/16.
 * Save Height Dictionary Controller
 */
app.controller('SavePlantMaintenanceController', ['$scope', '$state', 'toastr', 'toastrConfig', 'EzConfirm', 'applicationServiceSet', function ($scope, $state, toastr, toastrConfig, EzConfirm, applicationServiceSet) {
    'use strict';
    toastrConfig.preventOpenDuplicates = true;

    var ctrl = (function () {
        var token = APPMODEL.Storage.copPage_token;

        var service = function (method, arr, list, fn) {
            if (Object.prototype.toString.call(list) === '[object Function]') {
                fn = list;
                list = undefined;
            }
            applicationServiceSet.cloudWatchService.cloudWatchApi[method].send(arr, list).then(fn);
        };

        var getCopCamera = function (id) {
            service('getCopCamera', [token, id], function (data) {
                if (data.Ret === 0) {
                    if (!(+data.Data.ClassID)) {
                        angular.extend(data.Data, {ClassID: null});
                    }

                    // 绑定星期区间
                    var ePubWeekDays = data.Data.EPubWeekDays || [];
                    if (ePubWeekDays.length) {
                        for (var i = 0; i < ePubWeekDays.length; i++) {
                            vm.model.week[ePubWeekDays[i]].selected = true;
                        }
                    }

                    // 陈情绑定时间区间
                    var ePubTimeSlots = data.Data.EPubTimeSlots || [];

                    if (ePubTimeSlots.length) {
                        if (vm.model.timeSlots.length) vm.model.timeSlots = [];

                        for (var i = 0; i < ePubTimeSlots.length; i++) {
                            vm.model.timeSlots.push({
                                startHours: vm.completionTime(parseInt(ePubTimeSlots[i].StartDayMinutes / 60)),
                                startMinutes: vm.completionTime(ePubTimeSlots[i].StartDayMinutes % 60),
                                endHours: vm.completionTime(parseInt(ePubTimeSlots[i].EndDayMinutes / 60)),
                                endMinutes: vm.completionTime(ePubTimeSlots[i].EndDayMinutes % 60)
                            });
                        }
                    }

                    angular.extend(vm.submitData, data.Data);

                }
            })
        }

        // 获取班级列表
        var getSchClasses = function () {
            applicationServiceSet.commonService.schoolApi.getSchClasses.send([token, $state.params.gid], undefined).then(function (data) {
                if (data.Ret === 0) {
                    vm.model.classList = data.Data;
                }
            });

        }

        // 运营平台保存学校单个设备
        var saveCopCamera = function () {
            console.log($scope.vm.submitData.EName);
            service('saveCopCamera', vm.submitData, [token, $state.params.gid,$scope.vm.submitData.EName], function (data) {
                if (data.Ret === 0) {
                    toastr.success('保存成功！');
                }
            })
        }

        return {
            getCopCamera: getCopCamera,
            getSchClasses: getSchClasses,
            saveCopCamera: saveCopCamera
        }
    })();

    var vm = $scope.vm = {
        submitData: {},
        model: {
            posType: [
                {id: 0, value: '公共'},
                {id: 1, value: '班级'}
            ],
            classList: [],
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
        // 新增 or 修改
        isAdd: $state.params.id,
        init: function () {
            this.isAdd && ctrl.getCopCamera(this.isAdd);
            ctrl.getSchClasses();
        },
        completionTime: function (value) {
            //if(value < 10)

            return value < 10 ? ('0' + value) : value;
        },
        save: function () {

            // 当位置类型为班级时，验证是否选择班级
            if (+vm.submitData.PosType === 1 && !vm.submitData.ClassID) {
                toastr.error('请选择所属班级！');
                return false;
            }

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


            ctrl.saveCopCamera();
        },
        cancel: function () {
            $state.go('access.app.internal.ucuxinCloudMonitoring.plantMaintenance');
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
        }
    };
    vm.init();
}]);
