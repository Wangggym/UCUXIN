app.controller('hasTestDetailController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
  var hasTest = {
    /**
     * 入口
     */
    init : function () {
      hasTest.pageData();
      hasTest.onEvent();
      hasTest.getAllClass();
      hasTest.getAllList();
    },
    /**
     * 页面数据初始化
     */
    pageData : function () {
        hasTest.timeInit();
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
        // 任务id
        $scope.taskId =  $stateParams.id;
        // 学校id
        $scope.gid = $stateParams.gid;
        //学生姓名或者老师姓名判断
        $scope.nType = $stateParams.nType;
        console.log($stateParams.nType);
        if($scope.nType == 1){
            $scope.nName = "教师：";
            $scope.showClass = false;
        }else{
            $scope.nName = "学生：";
            $scope.showClass = true;
        }
        // ba班级
        $scope.class = {
            allList:[],
            choiceClass:0
        };
        // 学生姓名
        $scope.stuName = '';
        // 任务状态
        $scope.taskState = $stateParams.state;
        // 所有已测试list
        $scope.hasTestList = [];
    },
    /**
     * 绑定页面相关的事件
     */
    onEvent : function () {
        //设置简单报告
        $scope.setSimpleReport = function (item) {
          applicationServiceSet.mentalHealthService._psyTestTask._SetTestedRecordShowSimpleReuslt.send([],[sessionStorage.getItem('copPage_token'),item.TestRecordID,!item.IsShowSimple]).then(function (data) {
            if(data.Ret==0){
                item.IsShowSimple = !item.IsShowSimple;
            }else{
                toastr.error(data.Msg);
            }
          })
        };
        // 查询
        $scope.pageQuery = $scope.search = function () {
            hasTest.getAllList();
        };
        // 查看详细报告
        $scope.showDetail = function (item) {
            $location.path('access/app/internal/psychologicalTest/testReport').search({id:item.TestRecordID});
        };
        // 导出名单
        $scope.export = function () {
            window.open(urlConfig+'Psy/v3/ScaleTestTask/ExportTestRecordUserInfoList?token='+sessionStorage.getItem('copPage_token')+'&scaleTestTaskID='+$scope.taskId+
                '&exportType=true&classID='+$scope.class.choiceClass+'&studentName='+$scope.stuName+'&testStartTime='+$scope.sDate+'&testEndTime='+$scope.eDate)
        };
        $scope.exportDetail = function () {
            window.open(urlConfig+'Psy/v3/ScaleTestTask/ExportTestRecordResultList?token='+sessionStorage.getItem('copPage_token')+'&scaleTestTaskID='+$scope.taskId)
        };
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
          $scope.sDate = decodeURIComponent($stateParams.sDate).split(' ')[0];
          $scope.eDate = decodeURIComponent($stateParams.eDate).split(' ')[0];
    },
      /**
       * 获取所有分类
       */
      getAllClass:function(){
          applicationServiceSet.commonService.schoolApi.GetSchClassesNew.send([sessionStorage.getItem('applicationToken'),$scope.gid]).then(function (data) {
              if (data.Ret == 0) {
                  $scope.class.allList  = data.Data;
              }
          });
      },
      /**
       * 获取所有list
       */
      getAllList:function () {
          applicationServiceSet.mentalHealthService._psyTestTask._GetTestedUserInfoPage.send([sessionStorage.getItem('copPage_token'),$scope.pagination.currentPage,$scope.pagination.itemsPerPage,
              $scope.taskId,$scope.class.choiceClass,$scope.stuName]).then(function (data) {
              if (data.Ret == 0) {
                  $scope.hasTestList = data.Data.ViewModelList;
                  $scope.pagination.totalItems = data.Data.TotalRecords;
                  if($scope.hasTestList && $scope.hasTestList.length>0){
                      $.each($scope.hasTestList,function (e,item) {
                          if(item.MType == 12){
                              item.mTypeName = '家长';
                          }else if(item.MType == 11){
                              item.mTypeName = '教师';
                          }else {
                              item.mTypeName = '学生';
                          }
                      });

                  }
              }
          });
      }
  };
  hasTest.init();
}]);
