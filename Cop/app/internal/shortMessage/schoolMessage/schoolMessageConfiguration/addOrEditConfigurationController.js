/**
 * Created by fanweihua on 2016/9/14.
 * addOrEditConfigurationController
 * add or edit configuration
 */
app.controller('addOrEditConfigurationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    /**
     * add or edit configuration
     */
    var addOrEditConfiguration = (function () {
        /**
         * model init function
         */
        var init = function () {
            operation.tip();//tip
            variable.basic();//basic variable
            operation.basic();//basic operation
        };
        var variable = {
            /**
             * basic variable
             */
            basic: function () {
                $scope.model = {
                    head: undefined,
                    user: undefined,
                    commonList: [],
                    commonListLength: undefined,
                    specialList: [],
                    specialLength: undefined,
                    selectedGid: undefined,
                    schoolList: [],
                    uid: undefined,
                    SendUID: undefined,
                    allSaveDisabled: false
                };
                $scope.model.user = JSON.parse(APPMODEL.Storage.getItem('copPage_user'));
                $scope.model.uid = $scope.model.user.UID;
                $scope.model.allSaveDisabled = true;
                if ($stateParams.gid) {
                    $scope.model.head = '编辑短信发送规则';
                } else {
                    $scope.model.head = '新增短信发送规则';
                }
            }
        };
        /**
         * service set
         * @type {{getOrgSchoolPage: getOrgSchoolPage, saveInfoSmsSendRulesForTopGrp: saveInfoSmsSendRulesForTopGrp, getMembers: getMembers, getInfoSmsSendRulesByTopGrp: getInfoSmsSendRulesByTopGrp}}
         */
        var serviceApi = {
            /**
             * get school org pages list
             * @param selectedGid
             */
            getOrgSchoolPage: function (selectedGid) {
                if (selectedGid) {
                    applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.schoolList = data.Data;
                        }
                    });
                }
            },
            /**
             * save information a school message sending rules
             */
            saveInfoSmsSendRulesForTopGrp: function () {
                var judge = operation.errorPrompt($scope.model.commonList, $scope.model.specialList, $scope.model.selectedGid);//error prompt
                if (!judge) {
                    return;
                }
                for (var i in $scope.model.specialList) {
                    delete $scope.model.specialList[i].teacherList;
                }
                applicationServiceSet.internalServiceApi.message.SaveInfoSmsSendRulesForTopGrp.send([$scope.model.commonList, $scope.model.specialList], [$scope.model.selectedGid, $scope.model.uid]).then(function (data) {
                    if (data.Ret == 0) {
                        if ($stateParams.gid) {
                            toastr.success('编辑短信发送规则成功');
                            $location.path('access/app/internal/schoolMessage/schoolMessageConfiguration');
                        } else {
                            toastr.success('新增短信发送规则成功');
                            $location.url('access/app/internal/schoolMessage/schoolMessageConfiguration?type=' + $stateParams.type + '&gid=' + $scope.model.selectedGid);
                        }
                    }
                });
            },
            /**
             * select members
             * @param object
             * @param callBack
             */
            getMembers: function (object, callBack) {
                applicationServiceSet.internalServiceApi.message.GetMembers.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.selectedGid]).then(function (data) {
                    if (data.Ret == 0) {
                        object.teacherList = data.Data;
                        callBack(object);
                    }
                });
            },
            /**
             * get send rules
             */
            getInfoSmsSendRulesByTopGrp: function () {
                applicationServiceSet.internalServiceApi.message.GetInfoSmsSendRulesByTopGrp.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.selectedGid]).then(function (data) {
                    if (data.Ret == 0) {
                        operation.editRules(data.Data);//edit rules
                    }
                });
            }
        };
        /**
         * operation
         * @type {{basic: basic, editRules: editRules, editOperation: editOperation, editTimeSetting: editTimeSetting, sessionType, periodType, dataOperation: dataOperation, timeSetting: timeSetting, tip: tip}}
         */
        var operation = {
            /**
             * basic operation
             */
            basic: function () {
                operation.tip();//tip
                var itemObject = {
                    session: undefined,
                    period: undefined,
                    sessionList: ['学校通知', '班级通知/作业'],
                    periodList: ['天', '周', '月'],
                    PerDayLimit: 0,
                    ContSmsCnt: 0,
                    Begin: undefined,
                    End: undefined,
                    ID: undefined,
                    teacherList: []
                };
                /**
                 * select schoolList
                 * @param selectedGid
                 */
                $scope.refreshAddresses = function (selectedGid) {
                    if (selectedGid) {
                        if ($stateParams.type == 'send') {
                            APPMODEL.Storage.setItem('refreshAddressesSend', selectedGid);
                        } else if ($stateParams.type == 'receive') {
                            APPMODEL.Storage.setItem('refreshAddressesReceive', selectedGid);
                        }
                        serviceApi.getOrgSchoolPage(selectedGid);//get school org pages list
                    }
                };
                /**
                 * change gid
                 */
                $scope.changeGid = function () {
                    serviceApi.getInfoSmsSendRulesByTopGrp();//get send rules
                    $scope.model.allSaveDisabled = false;
                };
                /**
                 * change teacher id
                 * @param special
                 */
                $scope.changeTeacher = function (special) {
                    if (special.SendUID == 0) {
                        special.SendUID = undefined;
                        toastr.error('老师还没激活，无法设置');
                    }
                };
                /**
                 * common
                 */
                $scope.addCommon = function () {
                    if (!$scope.model.selectedGid) {
                        toastr.error('请选择学校');
                        return;
                    }
                    var object = $.extend({}, itemObject);
                    $scope.model.commonListLength = $scope.model.commonList.length;
                    object.ID = "common" + $scope.model.commonListLength + 1;
                    $scope.model.commonList.push(object);
                    operation.timeSetting(object);//setting time controls
                };
                /**
                 * special
                 */
                $scope.addSpecial = function (addSpecial) {
                    if (!$scope.model.selectedGid) {
                        toastr.error('请选择学校');
                        return;
                    }
                    var object = $.extend({}, itemObject);
                    serviceApi.getMembers(object, function (object) {//select members
                        $scope.model.specialLength = $scope.model.specialList.length;
                        object.ID = "special" + $scope.model.specialLength + 1;
                        var specialLength = $scope.model.specialList.length;
                        if (specialLength) {
                            //object = objectSpecial(object, $scope.model.specialList[specialLength - 1]);
                            object = objectSpecial(object, addSpecial);
                        }
                        $scope.model.specialList.push(object);
                        operation.timeSetting(object);//setting time controls
                    });
                };
                var objectSpecial = function (object, params) {
                    object.SType = params.SType;
                    object.STypeName = params.STypeName;
                    object.LimitPeriodType = params.LimitPeriodType;
                    object.LimitPrdTypeName = params.LimitPrdTypeName;
                    object.PerDayLimit = params.PerDayLimit;
                    object.SType = params.SType;
                    object.period = params.period;
                    object.session = params.session;
                    object.ContSmsCnt = params.ContSmsCnt;
                    object.Begin = params.Begin;
                    object.End = params.End;
                    return object;
                };
                /**
                 * remove commonList
                 * @param item
                 */
                $scope.remove = function (item) {
                    $scope.model.commonList.splice($scope.model.commonList.indexOf(item), 1);
                };
                /**
                 * remove specialList
                 * @param item
                 */
                $scope.specialRemove = function (item) {
                    $scope.model.specialList.splice($scope.model.specialList.indexOf(item), 1);
                };
                /**
                 * save
                 */
                $scope.save = function () {
                    operation.dataOperation();//data operation
                    serviceApi.saveInfoSmsSendRulesForTopGrp();//save information a school message sending rules
                };
                if ($stateParams.gid) {
                    operation.editOperation();//edit
                }
            },
            /**
             * edit rules
             */
            editRules: function (data) {
                var itemObject = {
                    sessionList: ['学校通知', '班级通知/作业'],
                    periodList: ['天', '周', '月']
                };
                serviceApi.getMembers(itemObject, function (itemObject) {//select members
                    for (var i in data.CommRules) {
                        for (var s in operation.sessionType) {
                            if (data.CommRules[i].SType == operation.sessionType[s].id) {
                                data.CommRules[i].session = operation.sessionType[s].name;
                                break;
                            }
                        }
                        for (var l in operation.periodType) {
                            if (data.CommRules[i].LimitPeriodType == operation.periodType[l].id) {
                                data.CommRules[i].period = operation.periodType[l].name;
                                break;
                            }
                        }
                        data.CommRules[i].sessionList = itemObject.sessionList;
                        data.CommRules[i].periodList = itemObject.periodList;
                    }
                    var id = 'RvRuleID';
                    for (var i in data.CommRules) {
                        data.CommRules[i].rvID = data.CommRules[i].SendRuleID;
                        if (data.CommRules[i].rvID == "0") {
                            id += i;
                            data.CommRules[i].rvID = id;
                        }
                    }
                    $scope.model.commonList = data.CommRules;
                    for (var i in data.SpecRules) {
                        for (var s in operation.sessionType) {
                            if (data.SpecRules[i].SType == operation.sessionType[s].id) {
                                data.SpecRules[i].session = operation.sessionType[s].name;
                                break;
                            }
                        }
                        for (var l in operation.periodType) {
                            if (data.SpecRules[i].LimitPeriodType == operation.periodType[l].id) {
                                data.SpecRules[i].period = operation.periodType[l].name;
                                break;
                            }
                        }
                        data.SpecRules[i].sessionList = itemObject.sessionList;
                        data.SpecRules[i].periodList = itemObject.periodList;
                        data.SpecRules[i].teacherList = itemObject.teacherList;
                    }
                    $scope.model.specialList = data.SpecRules;
                    operation.editTimeSetting();//edit time
                });
            },
            /**
             * edit
             */
            editOperation: function () {
                if (APPMODEL.Storage.TopGrpName) {
                    $scope.refreshAddresses(APPMODEL.Storage.TopGrpName);
                }
                $scope.model.selectedGid = $stateParams.gid;
                $scope.changeGid();//change gid
            },
            /**
             * edit time
             */
            editTimeSetting: function () {
                setTimeout(function () {
                    $("tbody[name='common'] input[name='time']").each(function () {
//                        $("#" + this.id).mobiscroll().date({
//                            demo: "date",
//                            theme: 'ios',
//                            display: 'bubble',
//                            lang: 'zh'
//                        });
                        laydate({
                            elem: "#" + this.id
                        });
                    });
                    $("tbody[name='special'] input[name='time']").each(function () {
//                        $("#" + this.id).mobiscroll().date({
//                            demo: "date",
//                            theme: 'ios',
//                            display: 'bubble',
//                            lang: 'zh'
//                        });
                        laydate({
                            elem: "#" + this.id
                        });
                    });
                }, 300);
            },
            sessionType: (function () {
                return [
                    {
                        id: 1,
                        name: '学校通知'

                    },
                    {
                        id: 2,
                        name: '班级通知/作业'
                    }
                ]
            })(),
            periodType: (function () {
                return [
                    {
                        id: 1,
                        name: '天'
                    },
                    {
                        id: 2,
                        name: '周'
                    },
                    {
                        id: 3,
                        name: '月'
                    }
                ]
            })(),
            /**
             * data operation
             */
            dataOperation: function () {
                var model = {
                    data: function () {
                        for (var i in $scope.model.commonList) {
                            $scope.model.commonList[i].Begin = $("input[id=" + $scope.model.commonList[i].rvID + "start]").val();
                            $scope.model.commonList[i].End = $("input[id=" + $scope.model.commonList[i].rvID + "end]").val();
                            $scope.model.commonList[i].TopGID = $scope.model.selectedGid;
                            for (var s in operation.sessionType) {
                                if ($scope.model.commonList[i].session == operation.sessionType[s].name) {
                                    $scope.model.commonList[i].SType = operation.sessionType[s].id;
                                    break;
                                }
                            }
                            for (var l in operation.periodType) {
                                if ($scope.model.commonList[i].period == operation.periodType[l].name) {
                                    $scope.model.commonList[i].LimitPeriodType = operation.periodType[l].id;
                                    break;
                                }
                            }
                        }
                        for (var i in $scope.model.specialList) {
                            if ($scope.model.specialList[i].SendRuleID) {
                                $scope.model.specialList[i].Begin = $("input[id=" + $scope.model.specialList[i].SendRuleID + "start]").val();
                                $scope.model.specialList[i].End = $("input[id=" + $scope.model.specialList[i].SendRuleID + "end]").val();
                            } else if ($scope.model.specialList[i].ID) {
                                $scope.model.specialList[i].Begin = $("input[id=" + $scope.model.specialList[i].ID + "start]").val();
                                $scope.model.specialList[i].End = $("input[id=" + $scope.model.specialList[i].ID + "end]").val();
                            }
                            $scope.model.specialList[i].TopGID = $scope.model.selectedGid;
                            for (var s in operation.sessionType) {
                                if ($scope.model.specialList[i].session == operation.sessionType[s].name) {
                                    $scope.model.specialList[i].SType = operation.sessionType[s].id;
                                    break;
                                }
                            }
                            for (var l in operation.periodType) {
                                if ($scope.model.specialList[i].period == operation.periodType[l].name) {
                                    $scope.model.specialList[i].LimitPeriodType = operation.periodType[l].id;
                                    break;
                                }
                            }
                        }
                    }
                };
                model.data();
            },
            /**
             * setting time controls
             * @param itemObject
             */
            timeSetting: function (itemObject) {
                setTimeout(function () {
//                    $("#" + itemObject.ID + "start input").mobiscroll().date({
//                        demo: "date",
//                        theme: 'ios',
//                        display: 'bubble',
//                        lang: 'zh'
//                    });
                    laydate({
                        elem: "#" + itemObject.ID + "start input"
                    });
//                    $("#" + itemObject.ID + "end input").mobiscroll().date({
//                        demo: "date",
//                        theme: 'ios',
//                        display: 'bubble',
//                        lang: 'zh'
//                    });
                    laydate({
                        elem: "#" + itemObject.ID + "end input"
                    });
                }, 300);
            },
            /**
             * tip
             */
            tip: function () {
                toastr.toastrConfig.positionClass = 'toast-top-center';
                toastr.toastrConfig.timeOut = 2000;
            },
            /**
             * error prompt
             * @param commonList
             * @param specialList
             * @param selectedGid
             */
            errorPrompt: function (commonList, specialList, selectedGid) {
                var judge = true;
                if (!selectedGid) {
                    toastr.error('请选择学校');
                    judge = false;
                    return;
                }
                if (commonList.length == 0) {
                    toastr.error('请增加全校规则');
                    judge = false;
                    return;
                }
                for (var i in commonList) {
                    if (!commonList[i].SType) {
                        toastr.error('全校规则：请选择会话类型');
                        judge = false;
                        return;
                    }
                    if (!commonList[i].LimitPeriodType) {
                        toastr.error('全校规则：请选择控制周期');
                        judge = false;
                        return;
                    }
                    if (commonList[i].PerDayLimit < 0) {
                        toastr.error('全校规则：周期内限制次数不可为负数');
                        judge = false;
                        return;
                    }
                    if (commonList[i].ContSmsCnt < 0) {
                        toastr.error('全校规则：单次条数不可为负数');
                        judge = false;
                        return;
                    }
                    if (!commonList[i].Begin) {
                        toastr.error('全校规则：请选择开始日期');
                        judge = false;
                        return;
                    }
                    if (!commonList[i].End) {
                        toastr.error('全校规则：请选择结束日期');
                        judge = false;
                        return;
                    }
                }
                for (var i in specialList) {
                    if (!specialList[i].SendUID) {
                        toastr.error('特殊教师规则：请选择老师');
                        judge = false;
                        return;
                    }
                    if (!specialList[i].SType) {
                        toastr.error('特殊教师规则：请选择会话类型');
                        judge = false;
                        return;
                    }
                    if (!specialList[i].LimitPeriodType) {
                        toastr.error('特殊教师规则：请选择控制周期');
                        judge = false;
                        return;
                    }
                    if (specialList[i].PerDayLimit < 0) {
                        toastr.error('特殊教师规则：周期内限制次数不可为负数');
                        judge = false;
                        return;
                    }
                    if (specialList[i].ContSmsCnt < 0) {
                        toastr.error('特殊教师规则：单次条数不可为负数');
                        judge = false;
                        return;
                    }
                    if (!specialList[i].Begin) {
                        toastr.error('特殊教师规则：请选择开始日期');
                        judge = false;
                        return;
                    }
                    if (!specialList[i].End) {
                        toastr.error('特殊教师规则：请选择结束日期');
                        judge = false;
                        return;
                    }
                }
                return judge;
            }
        };
        /**
         * return init model function
         */
        return {
            init: init
        }
    })();
    addOrEditConfiguration.init();//add or edit configuration model function init
}]);