/**
 * Created by WangQiHna on 2016/9/7.
 * ModifyPaymentAnomalyController
 */
app.controller('ModifyPaymentAnomalyController', ['$scope', '$rootScope', '$modal', '$location', 'toastr', 'applicationServiceSet', function ($scope, $rootScope, $modal, $location, toastr, applicationServiceSet) {
    'use strict';
    // 查询字段
    $scope.queryFields = {
        school: undefined,
        newService: undefined,
        classId: undefined,
        text: undefined
    };

    $scope.modifyData = JSON.parse(APPMODEL.Storage.paymentAnomaly);

    var modifyPaymentAnomaly = (function () {
        // 取出当前token 与 orgid值
        var token = APPMODEL.Storage.copPage_token;

        var getService = function (method, arr, fn) {
            applicationServiceSet.internalServiceApi.paymentTableSearch[method].send(arr).then(fn);
        };

        // 根据学校ID获取班级列表
        var getClassName = function (gid) {
            getService('getClassList', [token, gid], function (data) {
                if (data.Ret == 0) {
                    $scope.classNameList = data.Data.length ? data.Data : undefined;
                }
            });
        };

        var getStuList = function (classId, text) {
            getService('getStudentInfoList', [token, $scope.modifyData.GID, classId, text], function (data) {
                // 此处
                if (data.Ret === 0) {
                    $scope.studentInfoListCopy = data.Data.length ? data.Data : undefined;
                    $rootScope.$emit('studentInfoList', $scope.studentInfoListCopy);
                }
            });
        };


        // 更新缴费异常
        var upHandleExceptionStu = function (arr) {
            getService('upHandleExceptionStu', arr, function (data) {
                if (data.Ret == 0) {
                    toastr.success('修改成功！');
                    APPMODEL.Storage.removeItem('paymentAnomaly');
                    $location.path('/access/app/internal/paymentAnomalyHandle/paymentAnomaly');
                }
            });
        };

        return {
            getClassNameList: getClassName,
            getStuList: getStuList,
            upHandleExceptionStudent: upHandleExceptionStu
        }
    })();

    modifyPaymentAnomaly.getClassNameList($scope.modifyData.GID);

    /*var queryStudent = function (classId, text) {
     modifyPaymentAnomaly.getStuList(classId, text);
     }*/

    $scope.query = function () {
        var modalInstance = $modal.open({
            templateUrl: 'studentList.html',
            controller: 'ModalStudentListCtrl',
            size: 'lg',
            resolve: {
                items: function () {
                    return {
                        queryFields: $scope.queryFields,
                        classList: $scope.classNameList,
                        studentInfoList: $scope.studentInfoListCopy,
                        queryStudent: modifyPaymentAnomaly.getStuList
                    };
                }
            }
        });

        modalInstance.result.then(function (data) {
            angular.extend($scope.modifyData, {
                NewGid: data.GID,
                NewChargeID: $scope.queryFields.newService ? $scope.queryFields.newService : 0,
                NewClassID: data.ClassID,
                NewClassName: data.ClassName,
                NewUMID: data.UMID,
                NewUName: data.MName,
                NewMID: data.MID,
                NewTel: data.Tel
            });
        }, function () {
        });
    };

    $scope.confirm = function () {
        var md = $scope.modifyData;

        if (!parseInt(md.NewUMID)) {
            toastr.error('还未选择要更换的学生，不能修改！');
            return;
        }
        applicationServiceSet.chargeServiceApi.chargeService.HandleExceptionStuNew.send([md.ID, md.NewGid, md.NewUName, md.NewMID, md.NewTel, md.NewClassName, md.NewUMID, md.NewClassID, md.Desc,md.NewChargeID]).then(function (data) {
            if (data.Ret == 0) {
                toastr.success('修改成功！');
            }
        });
    };
    $scope.cancel = function () {
        $location.path('access/app/internal/paymentAnomalyHandle/paymentAnomaly');
    };
    // 修改
    var modify = {
        /**
         * 入口
         */
        init : function () {
            modify.onEvent();
            // modify.getSchoolList();
        },
        /**
         * 页面操作
         */
        onEvent : function () {
            // 输入学校
            $scope.fillShoolKeyword =  function (name) {
                if(name && name != ''){
                    modify.getSchoolList(name);
                }
            };
            // 选择新学校
            $scope.changeSchool = function () {
                $scope.queryFields.newService = undefined;
                modify.getServiceList();
                modifyPaymentAnomaly.getClassNameList($scope.queryFields.school);
            };
        },
        /**
         * 获取学校列表
         */
        getSchoolList : function (keyword) {
            applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.applicationToken, keyword]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.schoolList = data.Data.length ? data.Data : undefined;
                    if($scope.schoolList){
                        $.each($scope.schoolList,function (e,item) {
                            if($scope.modifyData.NewGID == item.ID){
                                $scope.queryFields.school = item.ID;
                                modifyPaymentAnomaly.getClassNameList($scope.queryFields.school);
                                modify.getServiceList();
                            }
                        })
                    }
                }
            });
        },
        /**
         * 获取服务包
         */
        getServiceList : function () {
            applicationServiceSet.chargeServiceApi.chargeService.GetChargeByGid.send([APPMODEL.Storage.getItem('copPage_token'), $scope.queryFields.school]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.serviceList = data.Data;
                }
            });
        }
    };
    modify.init();


}]);
app.controller('ModalStudentListCtrl', ['$scope', '$modalInstance', 'items', '$rootScope', function ($scope, $modalInstance, items, $rootScope) {
    'use strict';
    $scope.classNameList = items.classList;
    $scope.queryFields = items.queryFields;
    $scope.dataList = items.studentInfoList;
    $rootScope.$on('studentInfoList', function (event, data) {
        $scope.dataList = data;
    });
    items.queryStudent($scope.queryFields.classId, $scope.queryFields.text);
    $scope.comfirmSelected = function (data) {
        $modalInstance.close(data);
    };

    $scope.queryStudent = function () {
        items.queryStudent($scope.queryFields.classId, $scope.queryFields.text);
    }
}]);