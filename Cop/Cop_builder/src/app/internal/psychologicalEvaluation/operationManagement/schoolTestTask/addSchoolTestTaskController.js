/**
 * Created by WangQiHan on 2016/9/19.
 * Add School Test Task Controller
 */
app.controller('AddSchoolTestTaskController', ['$scope', '$filter' , '$location', '$modal', 'applicationServiceSet', 'toastr', 'toastrConfig', function ($scope, $filter, $location, $modal, applicationServiceSet, toastr, toastrConfig) {
    'use strict';
    // --- 时间配置 开始--------------------------------------------------
    var currentDay = new Date();
    $scope.sDate = $filter('date')(currentDay, 'yyyy-MM-dd');
    $scope.eDate = $filter('date')(currentDay.setDate(currentDay.getDate() + 30), 'yyyy-MM-dd');

    $scope.clear = function () {
        $scope.sDate = null;
        $scope.eDate = null;
    };

    $scope.minDate = $scope.minDate ? null : new Date();

    $scope.openStartDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened = true;
        $scope.endOpened = false;
    };

    $scope.openEndDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startOpened = false;
        $scope.endOpened = true;
    };
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    $scope.format = 'yyyy-MM-dd';
    //---- 时间配置 结束 -------------------------------------------------------
    // 查询字段
    $scope.queryFields = {
        partner: undefined,
        school: undefined,
        className: undefined,
        scale: undefined
    };

    $scope.submitData = {
        ID: 0,
        ScaID: 0,
        OrgID: 0,
        TopGID: 0,
        MType: undefined,
        IsApp: 0,
        Name: undefined,
        Range: 0,
        Desc: undefined,
        BDate: undefined,
        EDate: undefined,
        ClsIds: {}                 // 全校时推为当前学校所有学生， 班级时为选中班级数组，学生时为选中学生数组
    };
    $scope.changeScale = function (item) {
        $scope.submitData.MType = item.MType;
    };
    // 数据交互
    var addSchoolTestTask = (function () {
        // 取出当前token 与 orgid值
        var token = APPMODEL.Storage.copPage_token,
            applicationToken = APPMODEL.Storage.applicationToken;

        var getService = function (method, arr, fn) {
            applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr).then(fn);
        };

        // 获取组织列表
        var getPartnerList = function () {
            getService('getOrganization', [token, 8], function (data) {
                if (data.Ret === 0) {
                    $scope.partnerList = data.Data;
                }
            });
        };

        // 获取量表
        var getPsychScale = function () {
            getService('getScaleList', [token], function (data) {
                if (data.Ret === 0) {
                    $scope.scaleList = data.Data.length ? data.Data : undefined;
                }
            });
        }

        // 获取学校 （ 模糊查询 ）
        /*var getSchool = function (keyword) {
         getService('getFuzzySchoolList', [applicationToken, keyword], function (data) {
         if (data.Ret == 0) {
         $scope.schoolList = data.Data.length ? data.Data : undefined;
         }
         });
         };*/

        // 根据合作伙伴ID获取学校列表
        var getSchoolList = function () {
            getService('getSchoolList', [token, $scope.queryFields.partner], function (data) {
                if (data.Ret == 0) {
                    $scope.schoolList = data.Data.length ? data.Data : undefined;
                    if (!data.Data.length) {
                        toastr.error('当前合作伙伴没有学校存在，测试任务无法添加！');
                    }
                }
            });
        }

        // 根据学校ID当前用户班级
        var getClass = function () {
            if ($scope.queryFields.school == '' || $scope.queryFields.school == undefined) return;
            getService('getClassList', [token, $scope.queryFields.school], function (data) {
                if (data.Ret == 0) {
                    $scope.classNameList = data.Data.length ? data.Data : undefined;
                }
            });
        };

        // 根据学校ID和班级ID查询学生列表
        var getStudent = function () {
            if (!$scope.queryFields.school || !$scope.queryFields.className) return;
            getService('getStudentList', [token, $scope.queryFields.school, $scope.queryFields.className], function (data) {
                if (data.Ret == 0) {
                    var studentData = data.Data;
                    if (!$scope.submitData.studentSelectedList.length) {
                        $scope.studentList = studentData.length ? studentData : undefined;
                    } else {
                        angular.forEach($scope.submitData.studentSelectedList, function (studentSelected) {
                            angular.forEach(studentData, function (student, index) {
                                if (studentSelected.UMID === student.UMID) {
                                    studentData.splice(index, 1);
                                }
                            });
                        });
                        $scope.studentList = studentData;
                    }
                }
            });
        };

        var saveSchoolOrder = function (arr) {
            getService('saveSchoolOrder', arr, function (data) {
                if (data.Ret === 0) {
                    toastr.success('添加任务成功！');
                    $location.path('/access/app/internal/operationManagement/schoolTestTask');
                }
            });
        }

        return {
            getPartnerList: getPartnerList,
            getPsychScale: getPsychScale,
            getSchoolList: getSchoolList,
            getClassNameList: getClass,
            getStudentList: getStudent,
            saveSchoolOrder: saveSchoolOrder
        }
    })();

    // 获取合作伙伴列表
    addSchoolTestTask.getPartnerList();
    // 获取学校
    /*$scope.refreshSchool = function (keyword) {
     if (!keyword) return;
     addSchoolTestTask.getSchoolList(keyword);
     };*/

    $scope.changePartner = function () {
        $scope.queryFields.school = undefined;

        addSchoolTestTask.getSchoolList();
    };


    // 根据学校ID获取班级列表、服务包列表
    $scope.$watch('queryFields.school', function (nv, ov) {
        if (nv === ov) return;

        $scope.submitData.Range = 0;

        // 重置已选中要推送信息的单位
        $scope.submitData.classNameList = [];                   // 选中 要推送的班级列表
        $scope.submitData.studentList = [];                   // 选中 要推送的班级列表

        // 重置子级查询条件
        $scope.queryFields.className = undefined;               // 当前选中单个班级

        // 清除上一次由学校ID查询出来的 班级 服务包 学生数据
        $scope.classNameList = undefined;                       // 由学校ID查询出来的班级列表
        $scope.studentList = undefined;                         // 由学校ID及班级ID查询出的学生列表

        $scope.pushInfoConfig = undefined;                      // 由学校ID查询出来的推送配置信息

        addSchoolTestTask.getClassNameList();                          // 取出班级列表
        //addSchoolTestTask.getPushMessageConfigDetail();                // 取出前学校推送配置信息
    });
    // 根据班级ID获取学生列表
    $scope.changeClassName = function () {
        $scope.studentList = undefined;
        addSchoolTestTask.getStudentList();
    };

    // 获取量表列表
    addSchoolTestTask.getPsychScale();
    // -----  按个人测试范围 START --------------------------------------------------

    $scope.filterStudentName = '';    // 推送学生名单检索
    $scope.submitData.studentSelectedList = [];  // 推送学生名单列表

    // 向右添加选中学生
    $scope.addStudent = function (student) {
        $scope.submitData.studentSelectedList.push(student);
        $scope.studentList.splice($scope.studentList.indexOf(student), 1);
    };

    // 移除不推送的学生
    $scope.deleteSelected = function (student) {
        if (student.ClassID === $scope.queryFields.className) {
            $scope.studentList.push(student);
        }
        $scope.submitData.studentSelectedList.splice($scope.submitData.studentSelectedList.indexOf(student), 1);
    };

    // 重置推送学生名单
    $scope.clearStudentSelected = function () {
        angular.forEach($scope.submitData.studentSelectedList, function (student) {
            if (student.ClassID === $scope.queryFields.className) {
                $scope.studentList.push(student);
            }
        });

        $scope.submitData.studentSelectedList = [];
    };
// -----  按个人测试范围 End --------------------------------------------------

    // 提交表单
    $scope.confirm = function () {

        var ID = $scope.submitData.ID,
            ScaID = $scope.queryFields.scale.ID,
            OrgID = $scope.queryFields.partner,
            TopGID = $scope.queryFields.school,

            MType = $scope.submitData.MType,
            IsApp = $scope.submitData.IsApp,
            Range = $scope.submitData.Range,
            BDate = $filter('date')($scope.sDate, 'yyyy-MM-dd'),
            EDate = $filter('date')($scope.eDate, 'yyyy-MM-dd'),
            Name = $scope.submitData.Name,
            Desc = $scope.submitData.Desc,
            ClsIds = $scope.queryFields.ClsIds;


        if (!Name) {
            toastr.error('请填写任务名称！');
            return;
        }

        if (!OrgID) {
            toastr.error('请选择合作伙伴！');
            return;
        }

        if (!TopGID) {
            toastr.error('请选择学校！');
            return;
        }

        if (!ScaID) {
            toastr.error('请选择量表！');
            return;
        }
        if (!MType) {
            toastr.error('请选择测试身份！');
            return;
        }


        if (Range == 0) {
            ClsIds = $scope.submitData.PushObjList;
        } else if (Range == 1) {
            if ($scope.submitData.classNameList.length) {
                ClsIds = $scope.submitData.classNameList;
            } else {
                toastr.error('请选择要推送的班级！');
                return;
            }

        } else if (Range == 2) {
            if ($scope.submitData.studentSelectedList.length) {
                var studentIdList = [];
                angular.forEach($scope.submitData.studentSelectedList, function (item) {
                    studentIdList.push(item.UMID);
                });
                ClsIds = studentIdList;
            } else {
                toastr.error('请选择要推送的学生！');
                return;
            }
        }

        // 提交
        var modalInstance = $modal.open({
            templateUrl: 'submitConfirm.html',
            size: 'sm',
            controller: 'SubmitConfirmCtrl',
            resolve: {
                items: function () {
                    return true;
                }
            }
        });

        modalInstance.result.then(function (boolean) {
            if (!boolean) return;
            addSchoolTestTask.saveSchoolOrder([ID, ScaID, OrgID, TopGID, MType, IsApp, Range, BDate, EDate, Name, Desc, ClsIds]);
        }, function () {
            // 取消时作出操作
        });

    };

    $scope.cancel = function () {
        $location.path('/access/app/internal/operationManagement/schoolTestTask');
    };
}]);

app.controller('SubmitConfirmCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    'use strict';
    $scope.comfirm = function () {
        $modalInstance.close(items);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
