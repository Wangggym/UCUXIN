/**
 * Created by WangQiHan on 2016/8/31.
 * Add SMS Push Controller
 */
app.controller('AddFixedEntryPushController', ['$scope', '$location', 'applicationServiceSet', 'toastr', 'toastrConfig', function ($scope, $location, applicationServiceSet, toastr, toastrConfig) {
    'use strict';
    // 查询字段
    $scope.queryFields = {
        school: undefined,
        className: undefined
    };

    $scope.pushFields = {
        OrgID: 0,
        GID: 0,
        CUID: 0,
        //ProductID: 0,
        //PayStatus: {UnPay: 2},          // 全选时传字段3
        ReceiveArea: 1,
        Msg: undefined,
        PushUrl: undefined,
        ReceiveObj: 2,
        // AppStatus:{ UnInstall : 2},    // 全选时传字段3
        PushObjList: {}                 // 全校时推为当前学校所有学生， 班级时为选中班级数组，学生时为选中学生数组
    };


    // 数据交互
    var addFixedEntryPush = (function () {
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
      // 根据学校ID获取推送配置信息
      var getPushMessageConfig = function () {
        if(!$scope.queryFields.school) return;
        getService('getPushMessageConfig', [token, $scope.queryFields.school], function (data) {
          if (data.Ret == 0) {
            if(!data.Data){
              toastr.error('请选进行缴费推送设置！');
              $scope.pushInfoConfig = undefined;
              return;
            }
            $scope.pushInfoConfig = data.Data;
            $scope.pushFields.Msg     = $scope.pushInfoConfig.FixEntryDesc;
            $scope.pushFields.PushUrl = $scope.pushInfoConfig.FixEntryUrl;
          }
        });
      };

        // 确定添加推送
        var postSms = function (arr) {
            arr.unshift(orgid);
            getService('pushFixedEntryTask', arr, function (data) {
                if (data.Ret == 0) {
                    toastr.success('推送成功！');
                    $location.path('/access/app/partner/paymentMessage/fixedEntryPush');
                }
            });
        };

        return {
            getSchoolList: getSchool,
            getClassNameList: getClass,
            getStudentList: getStudent,
            getPushMessageConfigDetail:getPushMessageConfig,
            postSmsPush: postSms
        }
    })();

    // 获取学校
    addFixedEntryPush.getSchoolList();

    // 根据学校ID获取班级列表、服务包列表
    $scope.changeSchool = function () {
        // 重置已选中要推送信息的单位
        $scope.pushFields.classNameList = [];                   // 选中 要推送的班级列表
        $scope.pushFields.studentList = [];                   // 选中 要推送的班级列表

        // 重置子级查询条件
        $scope.queryFields.className = undefined;               // 当前选中单个班级

        // 清除上一次由学校ID查询出来的 班级 服务包 学生数据
        $scope.classNameList = undefined;                       // 由学校ID查询出来的班级列表
        $scope.studentList = undefined;                         // 由学校ID及班级ID查询出的学生列表

        $scope.pushInfoConfig = undefined;                      // 由学校ID查询出来的推送配置信息

        addFixedEntryPush.getClassNameList();                          // 取出班级列表
        addFixedEntryPush.getPushMessageConfigDetail();                // 取出前学校推送配置信息
    };

    // 根据班级ID获取学生列表
    $scope.changeClassName = function () {
        $scope.studentList = undefined;
        addFixedEntryPush.getStudentList();
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

    // 字符串长度判断
    /*  var characterLength = function (character) {
     var b = 0, l = character.length;
     if(l){
     for( var i = 0; i < l; i ++ ){
     var c = character.charAt( i );
     if ( /^[\u0000-\u00ff]$/.test(c) ) {
     b ++ ;
     }else {
     b += 2;
     }
     }
     return b;
     }else {
     return 0;
     }
     }

     // 推送简介信息字数
     $scope.wordAllLength = 3;
     $scope.wordLength = $scope.wordAllLength;
     $scope.changeMsg = function (msg) {
     $scope.wordLength = $scope.wordAllLength - Math.ceil(characterLength(msg)/2);

     if($scope.wordLength <= 0){
     $scope.wordLength = 0;
     $scope.pushFields.Msg = msg.substring(0, $scope.wordAllLength);
     }
     };*/

    $scope.wordAllLength = 20;
    $scope.wordLength = $scope.wordAllLength;
    $scope.changeMsg = function (msg) {
        $scope.wordLength = $scope.wordAllLength - msg.length;

        if ($scope.wordLength <= 0) {
            $scope.wordLength = 0;
            $scope.pushFields.Msg = msg.substring(0, $scope.wordAllLength);
            toastrConfig.preventOpenDuplicates = true;
            toastr.error('简介字数已达到上限！');
        }
    };

    // 提交表单
    $scope.confirm = function () {
        var gid = $scope.queryFields.school,
            cuid = JSON.parse(APPMODEL.Storage.copPage_user).UID,
            receiveArea = $scope.pushFields.ReceiveArea,
            msg = $scope.pushFields.Msg,
            receiveObj = $scope.pushFields.ReceiveObj,
            pushUrl = $scope.pushFields.PushUrl,
            pushObjList = $scope.pushFields.PushObjList;

        if (!gid) {
            toastr.error('请选择学校！');
            return;
        }

        if(!msg && !pushUrl){
          toastr.error('请选进行缴费推送设置！');
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

        addFixedEntryPush.postSmsPush([gid, cuid, receiveArea, msg, pushUrl, receiveObj, pushObjList]);
    };

    $scope.cancel = function () {
        $location.path('/access/app/partner/paymentMessage/fixedEntryPush');
    };

}]);
