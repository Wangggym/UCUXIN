/**
 * Created by WangQiHan on 2016/8/31.
 * Add SMS Push Controller
 */

app.controller('AddSmsPushController', ['$scope', '$location', 'applicationServiceSet', '$modal', 'toastr', 'toastrConfig', function ($scope, $location, applicationServiceSet, $modal, toastr, toastrConfig) {
    'use strict';
    // 查询字段
    $scope.queryFields = {
        school: undefined,
        className: undefined,
        funcServiceProduct: undefined
    };

    $scope.pushFields = {
        OrgID: 0,
        GID: 0,
        CUID: 0,
        ProductID: 0,
        PayStatus: {UnPay: 2},          // 全选时传字段3
        ReceiveArea: 1,
        Msg: undefined,
        ReceiveObj: 2,
        AppStatus: {UnInstall: 2},    // 全选时传字段3
        PushObjList: {}                 // 全校时推为当前学校所有学生， 班级时为选中班级数组，学生时为选中学生数组
    };


    // 数据交互
    var addSmsPush = (function () {
        // 取出当前token 与 orgid值
        var token = APPMODEL.Storage.copPage_token,
            orgid = APPMODEL.Storage.orgid;

        var getService = function (method, arr, fn) {
            applicationServiceSet.parAppServiceApi.paymentMessage[method].send(arr).then(fn);
        };

        // 获取当前用户学校
        var getSchool = function () {
            getService('getSchoolList', [token, orgid], function (data) {
                if (data.Ret == 0) {
                    $scope.schoolList = data.Data.length ? data.Data : undefined;
                }
            });
        };

        // 根据学校ID当前用户班级
        var getClass = function () {
            if ($scope.queryFields.school == '' || $scope.queryFields.school == undefined) return;
            getService('getClassList', [token, $scope.queryFields.school], function (data) {
                if (data.Ret == 0) {
                    $scope.classNameList = data.Data.length ? data.Data : undefined;
                }
            });
        };
        // 根据学校ID与班级ID（班级非必须）获取服务包
        var getProductPackage = function () {
            if ($scope.queryFields.school == '' || $scope.queryFields.school == undefined) return;
            applicationServiceSet.chargeServiceApi.chargeService.GetProductListByGid.send([APPMODEL.Storage.getItem('copPage_token'), $scope.queryFields.school]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.productPackageList = data.Data.length ? data.Data : undefined;
                }
            });
        };

        // 根据学校ID和班级ID查询学生列表
        var getStudent = function () {
            if (!$scope.queryFields.school || !$scope.queryFields.className) return;
            getService('getStudentList', [token, $scope.queryFields.school, $scope.queryFields.className], function (data) {
                if (data.Ret == 0) {
                    var studentData = data.Data;
                    if (!$scope.pushFields.studentSelectedList.length) {
                        $scope.studentList = studentData.length ? studentData : undefined;
                    } else {
                        angular.forEach($scope.pushFields.studentSelectedList, function (studentSelected) {
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
        //根据产品Id获取服务包列表
        var getChargeListByProductId = function () {
            applicationServiceSet.chargeServiceApi.chargeService.GetChargeListByProductId.send([APPMODEL.Storage.getItem('copPage_token'), $scope.queryFields.funcServiceProduct]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.servicePackList = data.Data;
                }
            });
        };

        // 确定添加推送
        var postSms = function () {
            // arr.unshift(orgid);
            // getService('pushMessageTask', arr, function (data) {
            //     if (data.Ret == 0) {
            //         toastr.success('推送成功！');
            //         $location.path('/access/app/partner/paymentMessage/smsPush');
            //     }
            // });
            applicationServiceSet.chargeServiceApi.chargeService.PushMessageNewTask.send([$scope.queryFields.school, $scope.queryFields.funcServiceProduct, $scope.queryFields.servicePack, $scope.model.payStatus, $scope.pushFields.ReceiveArea, $scope.pushFields.Msg, $scope.pushFields.ReceiveObj, $scope.model.appStatus, $scope.model.pushObjList], [APPMODEL.Storage.getItem('copPage_token'), $scope.model.pushObjList]).then(function (data) {
                if (data.Ret == 0) {
                    toastr.success('推送成功');
                    window.history.back();
                }
            });
        };


        return {
            getSchoolList: getSchool,
            getClassNameList: getClass,
            getProductList: getProductPackage,
            getStudentList: getStudent,
            postSmsPush: postSms,
            getChargeListByProductId: getChargeListByProductId
        }
    })();

    // 获取学校
    addSmsPush.getSchoolList();

    // 根据学校ID获取班级列表、服务包列表
    $scope.changeSchool = function () {

        // 重置已选中要推送信息的单位
        $scope.pushFields.classNameList = [];                   // 选中 要推送的班级列表
        $scope.pushFields.studentList = [];                   // 选中 要推送的班级列表

        // 重置子级查询条件
        $scope.queryFields.className = undefined;               // 当前选中单个班级
        $scope.queryFields.funcServiceProduct = undefined;      // 当前选中单个产品包

        // 清除上一次由学校ID查询出来的 班级 服务包 学生数据
        $scope.classNameList = undefined;                       // 由学校ID查询出来的班级列表
        $scope.studentList = undefined;                         // 由学校ID及班级ID查询出的学生列表
        $scope.productPackageList = undefined;                  // 由学校ID查询出的服务包列表


        addSmsPush.getClassNameList();                          // 取出班级列表
        addSmsPush.getProductList();                            // 取出服务包列表

    };
    /**
     * 选择产品包
     */
    $scope.productChange = function () {
        addSmsPush.getChargeListByProductId();
    };

    // 根据班级ID获取学生列表
    $scope.changeClassName = function () {
        $scope.studentList = undefined;
        addSmsPush.getStudentList();
    };

    // -------------------------------------------------------


    $scope.filterStudentName = '';    // 推送学生名单检索
    $scope.pushFields.studentSelectedList = [];  // 推送学生名单列表

    // 向右添加选中学生
    $scope.addStudent = function (student) {
        $scope.pushFields.studentSelectedList.push(student);
        $scope.studentList.splice($scope.studentList.indexOf(student), 1);
    };

    // 移除不推送的学生
    $scope.deleteSelected = function (student) {
        if (student.ClassID === $scope.queryFields.className) {
            $scope.studentList.push(student);
        }
        $scope.pushFields.studentSelectedList.splice($scope.pushFields.studentSelectedList.indexOf(student), 1);
    };

    // 重置推送学生名单
    $scope.clearStudentSelected = function () {
        angular.forEach($scope.pushFields.studentSelectedList, function (student) {
            if (student.ClassID === $scope.queryFields.className) {
                $scope.studentList.push(student);
            }
        });

        $scope.pushFields.studentSelectedList = [];
    };


    var checkboxStatus = function (arr) {
        var res = [];
        angular.forEach(arr, function (item) {
            if (item) {
                res.push(item);
            }
        });

        if (res.length === 0) {
            return 0;
        } else if (res.length === 1) {
            return res[0];
        } else {
            return 3;
        }
    };
    $scope.model = {};
    // 提交表单
    $scope.confirm = function () {
        var gid = $scope.queryFields.school,
            cuid = JSON.parse(APPMODEL.Storage.copPage_user).UID,
            productid = $scope.queryFields.funcServiceProduct,
            payStatus = checkboxStatus($scope.pushFields.PayStatus),
            receiveArea = $scope.pushFields.ReceiveArea,
            msg = $scope.pushFields.Msg,
            receiveObj = $scope.pushFields.ReceiveObj,
            appStatus = checkboxStatus($scope.pushFields.AppStatus),
            pushObjList = $scope.pushFields.PushObjList;
        $scope.model.payStatus = payStatus;
        $scope.model.appStatus = appStatus;
        if (!gid) {
            toastr.error('请选择学校！');
            return;
        }

        if (!productid) {
            toastr.error('请选择产品包！');
            return;
        }
        if (!$scope.queryFields.servicePack) {
            toastr.error('请选择服务包！');
            return;
        }
        if (!payStatus) {
            toastr.error('请选择缴费情况！');
            return;
        }

        if (!appStatus) {
            toastr.error('请选择APP安状态！');
            return;
        }

        if (!msg) {
            toastr.error('请填写要推送的信息！');
            return;
        }

        if (receiveArea == 1) {
            pushObjList = $scope.pushFields.PushObjList;
        } else if (receiveArea == 2) {
            if ($scope.pushFields.classNameList.length) {
                pushObjList = $scope.pushFields.classNameList;
            } else {
                toastr.error('请选择要推送的班级！');
                return;
            }

        } else if (receiveArea == 3) {
            if ($scope.pushFields.studentSelectedList.length) {
                var studentIdList = [];
                angular.forEach($scope.pushFields.studentSelectedList, function (item) {
                    studentIdList.push(item.UMID);
                });
                pushObjList = studentIdList;
            } else {
                toastr.error('请选择要推送的学生！');
                return;
            }
        }
        $scope.model.pushObjList = pushObjList;
        $modal.open({
            templateUrl: 'detailsModal.html',
            controller: 'detailsModalCtrl',
            keyboard: false,
            backdrop: false,
            resolve: {
                service: function () {
                    return addSmsPush;
                }
            }
        });
    };

    $scope.cancel = function () {
        $location.path('/access/app/partner/paymentMessage/smsPush');
    };

}]);
app.controller('detailsModalCtrl', ['$scope', '$modalInstance', 'service', function ($scope, $modalInstance, service) {
    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.confirmMsg = function () {
        service.postSmsPush();
        $modalInstance.dismiss('cancel')
    };
}]);