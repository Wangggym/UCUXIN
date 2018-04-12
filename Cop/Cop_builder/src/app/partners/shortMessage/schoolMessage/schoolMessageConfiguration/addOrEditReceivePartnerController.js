/**
 * Created by fanweihua on 2016/9/19.
 * addOrEditReceivePartnerController
 * add or edit receive controller
 */
app.controller('addOrEditReceivePartnerController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr, $modal) {
    /**
     * add or edit receive
     */
    var addOrEditReceive = (function () {
        /**
         * model init function
         */
        var init = function () {
            operation.tip();//tip
            variable.basic();//basic variable
            serviceApi.getOrgSchoolPage();//get school org pages list
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
                    selectedGidName: undefined,
                    schoolList: [],
                    uid: undefined,
                    SendUID: undefined,
                    allSaveDisabled: false
                };
                $scope.model.user = JSON.parse(APPMODEL.Storage.getItem('copPage_user'));
                $scope.model.uid = $scope.model.user.UID;
                $scope.model.allSaveDisabled = true;
                if ($stateParams.gid) {
                    $scope.model.head = '编辑短信接收规则';
                } else {
                    $scope.model.head = '新增短信接收规则';
                }
            }
        };
        /**
         * service set
         * @type {{saveInfoSmsSendRulesForTopGrp: saveInfoSmsSendRulesForTopGrp, getMembers: getMembers, getInfoSmsRvRulesByTopGrp: getInfoSmsRvRulesByTopGrp}}
         */
        var serviceApi = {
            /**
             * get school org pages list
             */
            getOrgSchoolPage: function () {
                applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.model.schoolList = data.Data;
                        operation.basic();//basic operation
                    }
                });
            },
            /**
             * save information a school message sending rules
             */
            saveInfoSmsSendRulesForTopGrp: function () {
                var judge = operation.errorPrompt($scope.model.commonList, $scope.model.specialList, $scope.model.selectedGid);//error prompt
                if (!judge) {
                    return;
                }
                applicationServiceSet.internalServiceApi.message.SaveInfoSmsRvRulesForTopGrp.send([$scope.model.commonList, $scope.model.specialList], [$scope.model.selectedGid, $scope.model.uid]).then(function (data) {
                    if (data.Ret == 0) {
                        if ($stateParams.gid) {
                            toastr.success('编辑短信接收规则成功');
                            $location.path('access/app/partner/schoolMessage/schoolMessageConfiguration');
                        } else {
                            toastr.success('新增短信接收规则成功');
                            $location.url('access/app/partner/schoolMessage/schoolMessageConfiguration?type=' + $stateParams.type + '&gid=' + $scope.model.selectedGid);
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
                applicationServiceSet.internalServiceApi.message.getSchClasses.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.selectedGid]).then(function (data) {
                    if (data.Ret == 0) {
                        object.classList = data.Data;
                        callBack(object);
                    }
                });
            },
            /**
             * get receive rules
             */
            getInfoSmsRvRulesByTopGrp: function () {
                applicationServiceSet.internalServiceApi.message.GetInfoSmsRvRulesByTopGrp.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.selectedGid]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.model.selectedGidName = data.Data.CommRules[0].TopGrpName;
                        operation.editRules(data.Data);//edit rules
                    }
                });
            },
            /**
             * get preview info
             */
            getPreviewInfoSms: function (suffCont, contSmsCnt, mainCont, grpName, scope) {
                applicationServiceSet.internalServiceApi.message.GetPreviewInfoSms.send([APPMODEL.Storage.getItem('applicationToken'), suffCont, contSmsCnt, mainCont, grpName]).then(function (data) {
                    if (data.Ret == 0) {
                        scope.model.generateSample = data.Data;
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
                    identityList: ['教师', '家长'],
                    PerDayLimit: 0,
                    ContSmsCnt: 0,
                    Begin: undefined,
                    End: undefined,
                    ID: undefined,
                    classList: []
                };
                var itemSpecialObject = {
                    session: undefined,
                    period: undefined,
                    identityList: ['家长', '学生'],
                    PerDayLimit: 0,
                    ContSmsCnt: 0,
                    Begin: undefined,
                    End: undefined,
                    ID: undefined,
                    classList: [],
                    TopGrpName: undefined
                };
                /**
                 * commonList Relate
                 * @param commonList
                 * @param index
                 */
                $scope.checkedRelateStatus = function (commonList, index) {
                    angular.forEach(commonList, function (value, key) {
                        if (key == index) {
                            if (value.RelateStatus) {
                                value.RelateStatus = false;
                            } else {
                                value.RelateStatus = true;
                            }
                        }
                    });
                };
                /**
                 * commonList Func
                 * @param commonList
                 * @param index
                 */
                $scope.checkedFuncStatus = function (commonList, index) {
                    angular.forEach(commonList, function (value, key) {
                        if (key == index) {
                            if (value.FuncStatus) {
                                value.FuncStatus = false;
                            } else {
                                value.FuncStatus = true;
                            }
                        }
                    });
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
                    serviceApi.getInfoSmsRvRulesByTopGrp();//get receive rules
                    $scope.model.allSaveDisabled = false;
                };
                /**
                 * edit special
                 * @param special
                 */
                $scope.editSpecial = function (special) {
                    $modal.open({
                        templateUrl: 'myModalContent.html',
                        controller: 'myModalContentCtrl',
                        keyboard: false,
                        backdrop: false,
                        resolve: {
                            items: function () {
                                return [serviceApi, special, toastr];
                            }
                        }
                    });
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
                    itemSpecialObject.TopGrpName = $scope.model.selectedGidName;
                    var object = $.extend({}, itemSpecialObject);
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
                    object.PerDayLimit = params.PerDayLimit;
                    object.ContSmsCnt = params.ContSmsCnt;
                    object.Begin = params.Begin;
                    object.End = params.End;
                    object.SuffCont = params.SuffCont;
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
                    identityList: ['教师', '家长'],
                    identitySpecialList: ['家长', '学生']
                };
                serviceApi.getMembers(itemObject, function (itemObject) {//select members
                    for (var i in data.CommRules) {
                        for (var s in operation.sessionType) {
                            if (data.CommRules[i].SType == operation.sessionType[s].id) {
                                data.CommRules[i].session = operation.sessionType[s].name;
                                break;
                            }
                        }
                        for (var l in operation.identityType) {
                            if (data.CommRules[i].MTypeID == operation.identityType[l].id) {
                                data.CommRules[i].MTypeName = operation.identityType[l].name;
                                break;
                            }
                        }
                        if (data.CommRules[i].MTypeID == 11) {
                            data.CommRules[i].MTypeDisable = false;
                        } else {
                            data.CommRules[i].MTypeDisable = true;
                        }
                        if (data.CommRules[i].RelateStatus) {
                            data.CommRules[i].RelateStatusColor = {
                                'color': 'green'
                            }
                        } else {
                            data.CommRules[i].RelateStatusColor = {
                                'color': 'coral'
                            }
                        }
                        if (data.CommRules[i].FuncStatus) {
                            data.CommRules[i].FuncStatusColor = {
                                'color': 'green'
                            }
                        } else {
                            data.CommRules[i].FuncStatusColor = {
                                'color': 'coral'
                            }
                        }
                        data.CommRules[i].sessionList = itemObject.sessionList;
                        data.CommRules[i].identityList = itemObject.identityList;
                    }
                    var id = 'RvRuleID';
                    for (var i in data.CommRules) {
                        data.CommRules[i].rvID = data.CommRules[i].RvRuleID;
                        if (data.CommRules[i].rvID == "0") {
                            id += i;
                            data.CommRules[i].rvID = id;
                        }
                    }
                    $scope.model.commonList = data.CommRules;
                    for (var i in data.SpecRules) {
                        for (var s in operation.identityType) {
                            if (data.SpecRules[i].MTypeID == operation.identityType[s].id) {
                                data.SpecRules[i].MTypeName = operation.identityType[s].name;
                                break;
                            }
                        }
                        data.SpecRules[i].identityList = itemObject.identitySpecialList;
                        data.SpecRules[i].classList = itemObject.classList;
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
                    $scope.model.selectedGidName = APPMODEL.Storage.TopGrpName;
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
                        $("#" + this.id).mobiscroll().date({
                            demo: "date",
                            theme: 'ios',
                            display: 'bubble',
                            lang: 'zh'
                        });
                    });
                    $("tbody[name='special'] input[name='time']").each(function () {
                        $("#" + this.id).mobiscroll().date({
                            demo: "date",
                            theme: 'ios',
                            display: 'bubble',
                            lang: 'zh'
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
                ];
            })(),
            identityType: (function () {
                return [
                    {
                        id: 11,
                        name: '教师'
                    },
                    {
                        id: 12,
                        name: '家长'
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
                            $scope.model.commonList[i].TopGID = $scope.model.selectedGid;
                            for (var s in operation.sessionType) {
                                if ($scope.model.commonList[i].session == operation.sessionType[s].name) {
                                    $scope.model.commonList[i].SType = operation.sessionType[s].id;
                                    break;
                                }
                            }
                            for (var l in operation.identityType) {
                                if ($scope.model.commonList[i].MTypeName == operation.identityType[l].name) {
                                    $scope.model.commonList[i].MTypeID = operation.identityType[l].id;
                                    break;
                                }
                            }
                        }
                        for (var i in $scope.model.specialList) {
                            $scope.model.specialList[i].TopGID = $scope.model.selectedGid;
                            $scope.model.specialList[i].SType = 2;
                            $scope.model.specialList[i].MTypeID = 12;
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
                    $("#" + itemObject.ID + "start input").mobiscroll().date({
                        demo: "date",
                        theme: 'ios',
                        display: 'bubble',
                        lang: 'zh'
                    });
                    $("#" + itemObject.ID + "end input").mobiscroll().date({
                        demo: "date",
                        theme: 'ios',
                        display: 'bubble',
                        lang: 'zh'
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
                    if (!commonList[i].MTypeID) {
                        toastr.error('全校规则：请选择身份类型');
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
                    if (!specialList[i].ClassID) {
                        toastr.error('特殊班级规则：请选择班级');
                        judge = false;
                        return;
                    }
                    if (!specialList[i].MTypeID) {
                        toastr.error('特殊班级规则：请选择身份类型');
                        judge = false;
                        return;
                    }
                    if (specialList[i].ContSmsCnt < 0) {
                        toastr.error('特殊班级规则：单次条数不可为负数');
                        judge = false;
                        return;
                    }
                    if (!specialList[i].Begin) {
                        toastr.error('特殊班级规则：请选择开始日期');
                        judge = false;
                        return;
                    }
                    if (!specialList[i].End) {
                        toastr.error('特殊班级规则：请选择结束日期');
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
    addOrEditReceive.init();//add or edit configuration model function init
}]);
/**
 * modal
 */
app.controller('myModalContentCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.model = {
        suffCont: items[1].SuffCont ? items[1].SuffCont : '{学校}{发送者}：{内容}',
        contSmsCnt: items[1].ContSmsCnt ? items[1].ContSmsCnt : 0,
        mainCont: '今天的语文作业是：课本第23页，背诵课文，明天课堂上抽查',
        generateSample: undefined
    };
    $scope.clickSchool = function () {
        $("#textarea").insertAtCaret("{学校}");
    };
    $scope.clickSend = function () {
        $("#textarea").insertAtCaret("{发送者}");
    };
    $scope.clickContent = function () {
        $("#textarea").insertAtCaret("{内容}");
    };
    $scope.detailsContent = function () {
        $("#textarea").insertAtCaret("{详情链接}");
    };
    $scope.return = function () {
        $("#textarea").val('{学校}{发送者}：{内容}');
    };
    /**
     * comfirm
     */
    $scope.comfirm = function () {
        items[1].SuffCont = $("#textarea").val();
        items[1].ContSmsCnt = $scope.model.contSmsCnt;
        $modalInstance.dismiss('cancel');
    };
    /**
     * cancel
     */
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    /**
     * generate sample
     */
    $scope.generateSample = function () {
        var textarea = $("#textarea").val();
        if (!textarea) {
            textarea = undefined;
        }
        if (!$scope.model.contSmsCnt) {
            items[2].error('请输入短信条数');
            return;
        }
        var returnTemplate = smsTemplate(textarea, items[2]);
        if (!returnTemplate) {
            return;
        }
        items[0].getPreviewInfoSms(textarea, $scope.model.contSmsCnt, $scope.model.mainCont, items[1].TopGrpName, $scope);//get preview info
    };
    var smsTemplate = function (content, tip) {
        if (!content || content == '') {
            return '';
        }
        var list = [];
        var du = false;
        var conent = '';
        for (var i in content) {
            if (content[i] == "{") {
                if (du) {
                    conent = '';
                } else {
                    du = true;
                    continue;
                }
            } else if (content[i] == "}") {
                if (conent.length > 0) {
                    list.push(conent);
                }
                du = false;
                conent = '';
                continue;
            }
            if (du) {
                conent += content[i];
            }
        }
        var returnTemplate = true;
        var nary = list.sort();
        for (var i = 0; i < list.length; i++) {
            if (nary[i] == nary[i + 1]) {
                tip.error('短信模板中有重复：' + nary[i]);
                returnTemplate = false;
            }
        }
        return returnTemplate;
    };
}]);
(function ($) {
    $.fn.extend({
        insertAtCaret: function (myValue) {
            var $t = $(this)[0];
            if (document.selection) {
                this.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            }
            else if ($t.selectionStart || $t.selectionStart == '0') {
                var startPos = $t.selectionStart;
                var endPos = $t.selectionEnd;
                var scrollTop = $t.scrollTop;
                $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
                this.focus();
                $t.selectionStart = startPos + myValue.length;
                $t.selectionEnd = startPos + myValue.length;
                $t.scrollTop = scrollTop;
            }
            else {
                this.value += myValue;
                this.focus();
            }
        }
    })
})(jQuery);