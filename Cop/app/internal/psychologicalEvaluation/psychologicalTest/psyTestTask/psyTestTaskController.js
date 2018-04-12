app.controller('psyTestTaskController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
  var testTask = {
    /**
     * 入口
     */
    init : function () {
      testTask.pageData();
      testTask.onEvent();
      testTask.getAllTask();
    },
    /**
     * 页面数据初始化
     */
    pageData : function () {
      // 分页指令配置
      $scope.pagination = {
        currentPage: 1,
        itemsPerPage: 35, // 默认查询10条
        maxSize: 5,
        totalItems: undefined,
        previousText: "上页",
        nextText: "下页",
        firstText: "首页",
        lastText: "末页"
      };
      // 学校
        $scope.school = {
            allList:[],
            choiceSchool:0,
        };
      // 任务名称
      $scope.name = '';
      // 测试任务状态
      $scope.taskState = 3;
      // 所有测试任务
      $scope.allTaskList = [];
    },
    /**
     * 绑定页面相关的事件
     */
    onEvent : function () {
      // 新增学校测试任务
      $scope.add = function (data) {
        var item;
        if(data){
            item = data;
        }else {
            item={
                ScaleTestTask:{
                    ID:0
                }
            }
        }
        var modalInstance = $modal.open({
          templateUrl: 'changeItem.html',
          controller: 'changeItemCtrl',
          backdrop:false,
          size: 'lg',
          resolve: {
            items: function () {
              return item;
            }
          }
        });
        modalInstance.result.then(function (data) {
            $scope.school.choiceSchool = 0;
            $scope.name = '';
            $scope.taskState = 3;
            testTask.getAllTask();
        }, function () {});
      };
      //查询学校list
      $scope.refreshSchool = function (name) {
        if(name){
            testTask.getAllSchool(name);
        }
      };
      // 查询任务list
      $scope.pageQuery = $scope.search = function () {
          testTask.getAllTask();
      };
      // 发布任务
      $scope.publish = function (item) {
          testTask.setPublish(item,1);
      };
      // 暂停任务
      $scope.pause = function (item) {
          testTask.setPublish(item,2);
      };
      //修改任务
      $scope.changeTask = function (item) {
          $scope.add(item);
      };
      // 删除任务
      $scope.delet = function (item) {
          testTask.jadgeDeletTask(item.ID);
      };
      // 跳转未测试
      $scope.goNotTest = function (item) {
          if(item.mTypeName == "教师"){
              var nType = 1;
          }else{
              nType = 0;
          }
          $location.path('access/app/internal/psychologicalTest/notTestDetail').search({id:item.ID,gid:item.SchoolID,state:item.ST,nType:nType,sDate:encodeURIComponent(item.BDateTime),eDate:encodeURIComponent(item.EDateTime)});
      };
      // 跳转到已测试
        $scope.goHasTest = function (item) {
            if(item.mTypeName == "教师"){
                var nType = 1;
            }else{
                nType = 0;
            }
            $location.path('access/app/internal/psychologicalTest/hasTestDetail').search({id:item.ID,gid:item.SchoolID,state:item.ST,nType:nType,sDate:encodeURIComponent(item.BDateTime),eDate:encodeURIComponent(item.EDateTime)});
        };
        // 下载PC测试任务
        $scope.download = function (item) {
            window.open(urlConfig+'Psy/v3/ScaleTestTask/DownloadPCTestHtml?token='+sessionStorage.getItem('copPage_token')+'&scaleTestTaskID='+item.ID)
        }
    },
    /**
    * 获取学校
    */
    getAllSchool:function (name) {
       applicationServiceSet.commonService.schoolApi.getFuzzySchoolList.send([sessionStorage.getItem('applicationToken'),name]).then(function (data) {
           if (data.Ret == 0) {
               $scope.school.allList  = data.Data;
           }
       });
    },
    /**
     * 获取所有测试任务
     */
    getAllTask : function () {
      applicationServiceSet.mentalHealthService._psyTestTask._GetScaleTestTaskPage.send([sessionStorage.getItem('copPage_token'),$scope.pagination.currentPage,$scope.pagination.itemsPerPage,$scope.school.choiceSchool,$scope.name,$scope.taskState]).then(function (data) {
        if (data.Ret == 0) {
          $scope.allTaskList = data.Data.ViewModelList;
          $.each($scope.allTaskList ,function (e,item) {
              if(item.ScaleTestTask.SendType == 0){
                  item.ScaleTestTask.sendTypeName = '全校';
              }else if(item.ScaleTestTask.SendType == 1){
                  item.ScaleTestTask.sendTypeName = '班级';
              }else if(item.ScaleTestTask.SendType == 2){
                  item.ScaleTestTask.sendTypeName = '个人';
              }else {
                  item.ScaleTestTask.sendTypeName = '学校组织';
              }
              if(item.ScaleTestTask.MType == 12){
                  item.ScaleTestTask.mTypeName = '家长';
              }else if(item.ScaleTestTask.MType == 11){
                  item.ScaleTestTask.mTypeName = '教师';
              }else {
                  item.ScaleTestTask.mTypeName = '学生';
              }
              if(item.ScaleTestTask.ST == 0){
                  item.ScaleTestTask.stName = '未发布';
              }else if(item.ScaleTestTask.ST == 1){
                  item.ScaleTestTask.stName = '已发布';
              }else{
                  item.ScaleTestTask.stName = '已结束';
              }
          });
          $scope.pagination.totalItems = data.Data.TotalRecords;
        }
      });
    },
      /**
       * 设置任务发布状态
       */
    setPublish : function(item,state){
          applicationServiceSet.mentalHealthService._psyTestTask._SetScaleTestTaskPublishStatus.send(undefined,[sessionStorage.getItem('copPage_token'),item.ScaleTestTask.ID,state]).then(function (data) {
              if (data.Ret == 0) {
                  if(state == 1){
                      toastr.success('发布成功!');
                      item.ScaleTestTask.ST = 1;
                      item.ScaleTestTask.stName = '已发布';
                  }else {
                      toastr.success('结束成功!');
                      item.ScaleTestTask.ST = 2;
                      item.ScaleTestTask.stName = '已结束';
                  }
              }
          });
     },

      /**
       * 判断是否能删除
       */
      jadgeDeletTask : function(id){
          applicationServiceSet.mentalHealthService._psyTestTask._JudgeScaleTestTaskCanDelete.send(undefined,[sessionStorage.getItem('copPage_token'),id]).then(function (data) {
              if (data.Ret == 0) {
                  testTask.deletTask(id);
              }
          });
      },
  /**
   * 删除测试任务
   */
     deletTask : function (id) {
          applicationServiceSet.mentalHealthService._psyTestTask._DeleteScaleTestTask.send(undefined,[sessionStorage.getItem('copPage_token'),id]).then(function (data) {
              if (data.Ret == 0) {
                  toastr.success('删除成功!');
                  testTask.getAllTask();
              }
          });
      }

  };
  testTask.init();
}]);


/**
 *新增或者修改测试任务
*/
app.controller('changeItemCtrl', ['$scope', '$modalInstance', 'items','toastr','applicationServiceSet', function ($scope, $modalInstance, items,toastr,applicationServiceSet) {
    var change = {
        /**
         * 入口
         */
        init : function () {
            change.pageData();
            change.onEvent();
            change.timeInit();
            change.getScalNameList();
            if($scope.id && $scope.id != 0){
                change.getTestTaskDetail();
            }
        },
        /**
         * 页面数据初始化
         */
        pageData : function () {
            // 已存在的推送范围
            $scope.hasRangList = [];
            // 任务id
            $scope.id = items.ScaleTestTask.ID;
            // 测试名称
            $scope.name = '';
            // 学校
            $scope.school = {
                allList: [],
                choiceSchool: undefined
            };
            // 量表
            $scope.scale = {
                allList: [],
                choiceScale: undefined
            };
            // 测试身份
            $scope.mType = undefined;
            // 测试范围
            $scope.range = undefined;
            // 选择是否展示简单报告
            $scope.sReport = undefined;
            //班级
            $scope.class = {
                allList : [],
                choiceClass:[]
            };
            // 老师个人
            $scope.teacher = {
                allList:[],
                choiceTeacher:[]
            };
            // 老师群组
            $scope.teacherGroup = {
                allList:[],
                choiceGroup:[]
            };
            // 备注
            $scope.desc = undefined;
        },
        /**
         * 绑定页面相关的事件
         */
        onEvent : function () {
          // 模糊插叙学校
            $scope.refreshSchool = function (name) {
                if(name){
                    change.getAllSchool(name);
                }
            };
            // 选择学校
            $scope.choiceSchool = function () {
                change.getAllClass();
                change.getAllTeacher();
                change.getTeacherGroup();
                $scope.class.allList = [];
            };
            // 选择测试身份
            $scope.choiceMtype = function () {
                $scope.range = undefined;
            };
            // 选择是否展示简单报告
            // $scope.choiceSReport = function () {
            //     $scope.range = undefined;
            // };
            // 取消
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.confirm = function () {
                change.confirm();
            }
        },
        /**
         * 时间控件初始化
         */
        timeInit:function () {
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
                $scope.endOpened = true;
                $scope.startOpened = false;
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                class: 'datepicker'
            };
            $scope.format = 'yyyy-MM-dd';
        },
        /**
         * 获取单条学校测试任务
         */
        getTestTaskDetail : function () {
            applicationServiceSet.mentalHealthService._psyTestTask._GetScaleTestTask.send([sessionStorage.getItem('copPage_token'),$scope.id]).then(function (data) {
                if (data.Ret == 0) {
                    var  info = data.Data.ScaleTestTask;
                    $scope.hasRangList = data.Data.TaskSendRangList;
                    $scope.name = info.Name;
                    $scope.school.choiceSchool = {GID:info.SchoolID,FName:info.SchoolName};
                    $scope.choiceSchool();
                    $scope.scale.choiceScale = {ID:info.ScaleID,Name:info.ScaleName};
                    $scope.sDate = info.BDateTime.split(' ')[0];
                    $scope.eDate = info.EDateTime.split(' ')[0];
                    $scope.mType = info.MType;
                    $scope.sReport = info.IsShowSimpleReport + "";
                    $scope.range = info.SendType;
                    $scope.desc = info.Remark;
                    // if(info.SendType == 0){  //全校
                    //
                    // }else if(info.SendType == 1){ //按班级
                    //     $(rang,function (e,item) {
                    //         var obj = {
                    //             GID : item.SendID,
                    //             FName : item.SendName
                    //         };
                    //         $scope.class.choiceClass.push(obj);
                    //     });
                    // }else if(info.SendType == 10){  //按个人
                    //     $(rang,function (e,item) {
                    //         var obj = {
                    //             SendID : item.SendID,
                    //             MName : item.SendName
                    //         };
                    //         $scope.teacher.choiceTeacher.push(obj);
                    //     });
                    // }else if(info.SendType == 3){    //按老师群组
                    //     $(rang,function (e, item) {
                    //         var obj = {
                    //             GID: item.SendID,
                    //             FName: item.SendName
                    //         };
                    //         $scope.teacherGroup.choiceGroup.push(obj);
                    //     });
                    // }
                }
            });
        },
        /**
         * 获取当前用户学校列表
         */
        getAllSchool:function (name) {
            applicationServiceSet.commonService.schoolApi.getFuzzySchoolList.send([sessionStorage.getItem('applicationToken'),name]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.school.allList  = data.Data;
                }
            });
        },
        /**
         *获取所有班级
         */
        getAllClass:function(){
            applicationServiceSet.commonService.schoolApi.GetSchClassesNew.send([sessionStorage.getItem('applicationToken'),$scope.school.choiceSchool.GID]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.class.allList  = data.Data;
                    if($scope.id && $scope.id != 0){
                        $.each($scope.class.allList,function (e,item) {
                            $.each( $scope.hasRangList,function (e,elet) {
                                if(item.GID == elet.SendID){
                                    $scope.class.choiceClass.push(item);
                                }
                            });
                        });
                    }
                }
            });
        },
        /**
         * 获取所有测试量表
         */
        getScalNameList : function () {
            //获取量表
            applicationServiceSet.mentalHealthService._InventoryManagement._GetPublishScaleModelList.send([APPMODEL.Storage.getItem('copPage_token'),true]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.scale.allList = data.Data;
                }
            });
        },
        /**
         * 获取学校下面的老师
         */
        getAllTeacher : function () {
            applicationServiceSet.mentalHealthService._psyTestTask._GetGroupStaffs.send([sessionStorage.getItem('copPage_token'),$scope.school.choiceSchool.GID]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.teacher.allList = data.Data;
                    if($scope.id && $scope.id != 0){
                        $.each($scope.teacher.allList,function (e,item) {
                            $.each( $scope.hasRangList,function (e,elet) {
                                if(item.UMID == elet.SendID){
                                    $scope.teacher.choiceTeacher.push(item);
                                }
                            });
                        });
                    }
                }
            });
        },
        /**
         *获取老师群组
         */
        getTeacherGroup:function () {
            applicationServiceSet.commonService.schoolApi.GetStaffGroups.send([sessionStorage.getItem('applicationToken'),$scope.school.choiceSchool.GID]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.teacherGroup.allList  = data.Data;
                    if($scope.id && $scope.id != 0){
                        $.each($scope.teacherGroup.allList,function (e,item) {
                            $.each( $scope.hasRangList,function (e,elet) {
                                if(item.GID == elet.SendID){
                                    $scope.teacherGroup.choiceGroup.push(item);
                                }
                            });
                        });
                    }
                }
            });
        },
        /**
         * 确认
         */
        confirm:function () {
            var tip1 = false,tip2 = false,tip3 = false;
            if($scope.name == ''){
                toastr.error('请填写测试名称！');
                return;
            }
            if(!$scope.school.choiceSchool || $scope.school.choiceSchool == ''){
                toastr.error('请选择学校！');
                return;
            }
            if(!$scope.scale.choiceScale || $scope.scale.choiceScale == ''){
                toastr.error('请选择量表！');
                return;
            }
            if(!$scope.sDate || !$scope.eDate){
                toastr.error('请选择测试时间！');
                return;
            }
            if(!$scope.sReport||$scope.sReport == ''){
                toastr.error('请选择是否显示测试报告！');
                return;
            }
            if(!$scope.mType || $scope.mType == ''){
                toastr.error('请选择测试身份！');
                return;
            }
            if((!$scope.range || $scope.range == '')&&$scope.range!=0){
                toastr.error('请选择测试范围！');
                return;
            }
            if($scope.range==1){
                if(!$scope.class.choiceClass ||$scope.class.choiceClass.length==0){
                    tip1 = true;
                }
            }
            if(tip1){
                toastr.error('请选择要推送的班级！');
                return;
            }
            if($scope.range==2){
                if(!$scope.teacher.choiceTeacher ||$scope.teacher.choiceTeacher.length==0){
                    tip2 = true;
                }
            }
            if(tip2){
                toastr.error('请选择要进行测试的老师！');
                return;
            }
            if($scope.range==3){
                if(!$scope.teacherGroup.choiceGroup || $scope.teacherGroup.choiceGroup.length==0){
                    tip3 = true;
                }
            }
            if(tip3){
                toastr.error('请选择要推送的老师群组！');
                return;
            }
            change.add();
        },
        /**
         * 日期格式化
         */
         timeFormat:function (time) {
            var year,month,date;
            time = new Date(time);
            year = time.getFullYear();
            month = (time.getMonth()<9)?'0'+(time.getMonth()+1):time.getMonth()+1;
            date = (time.getDate()<10)?'0'+time.getDate():time.getDate();
            return year+'-'+month+'-'+date;
        },
        /**
         * 新增或者修改测试任务
         */
        add:function () {
            var rangModel = [],scaleInfo;
            switch(parseInt($scope.range))
            {
                case 1:
                    $.each($scope.class.choiceClass,function (e,item) {
                        var rangObj = {
                            SendID:item.GID,
                            SendName:item.FName
                        };
                        rangModel.push(rangObj);
                    });
                    break;
                case 10:
                    $.each($scope.teacher.choiceTeacher,function (e,item) {
                        var rangObj = {
                            SendID:item.UMID,
                            SendName:item.MName
                        };
                        rangModel.push(rangObj);
                    });
                    break;
                case 3:
                    $.each($scope.teacherGroup.choiceGroup,function (e,item) {
                        var rangObj = {
                            SendID:item.GID,
                            SendName:item.FName
                        };
                        rangModel.push(rangObj);
                    });
                    break;
                default:
                    var rangObj = {
                        SendID:$scope.school.choiceSchool.GID,
                        SendName:$scope.school.choiceSchool.FName
                    };
                    rangModel.push(rangObj);
            }

            scaleInfo = {
                ID:$scope.id,
                Name:$scope.name,
                SchoolID:$scope.school.choiceSchool.GID,
                SchoolName:$scope.school.choiceSchool.FName,
                ScaleID:$scope.scale.choiceScale.ID,
                ScaleName:$scope.scale.choiceScale.Name,
                BDateTime:change.timeFormat($scope.sDate),
                EDateTime:change.timeFormat($scope.eDate),
                Remark:$scope.desc,
                MType:$scope.mType,
                SendType:$scope.range,
                IsShowSimpleReport:$scope.sReport.toString()
            };
            applicationServiceSet.mentalHealthService._psyTestTask._AddOrUpdateScaleTestTask.send([scaleInfo,rangModel],[sessionStorage.getItem('copPage_token')]).then(function (data) {
                if (data.Ret == 0) {
                    if($scope.id == 0){
                        toastr.success('添加成功！');
                    }else {
                        toastr.success('修改成功！');
                    }
                    $modalInstance.close();
                }
            });
        }
    };
    change.init();
}]);

