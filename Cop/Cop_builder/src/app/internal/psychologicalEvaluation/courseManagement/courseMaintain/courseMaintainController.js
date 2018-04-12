app.controller('courseMaintainController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
  var maintain = {
    /**
     * 入口
     */
    init : function () {
      maintain.pageData();
      maintain.onEvent();
      maintain.getClassify();
      maintain.getAllTeacher();
      maintain.getAllCourse();
      maintain.getQINiuToken();
    },
    /**
     * 页面数据初始化
     */
    pageData : function () {
      // 分页指令配置
      $scope.pagination = {
        currentPage: 1,
        itemsPerPage: 20, // 默认查询10条
        maxSize: 5,
        totalItems: undefined,
        previousText: "上页",
        nextText: "下页",
        firstText: "首页",
        lastText: "末页"
      };
      $scope.allClassify = [];
      $scope.teacherList = [];
      $scope.allCourse = [];
      $scope.serchData = {
        courseName:'',
        courseClassfy:0,
        teacher:0
      };
    },
    /**
     * 绑定页面相关的事件
     */
    onEvent : function () {
        $scope.pageQuery = $scope.search = function () {
        maintain.getAllCourse();
      };
      $scope.pageQuery = function () {
        maintain.getAllCourse();
      };
      // 发布课程
      $scope.publish = function (item) {
        maintain.publish(item);
      };
      // 删除课程
      $scope.delet = function (item) {
        maintain.delet(item);
      }
    },
    /**
     * 获取七牛视频上传的Token
     */
    getQINiuToken:function () {
        applicationServiceSet.mentalHealthService._CourseClassify._GetVideoToken.send([sessionStorage.getItem('copPage_token')]).then(function (data) {
            if(data.Ret == 0){
                sessionStorage.setItem('videoToken',data.Data);
            }
        });
    },
    /**
     * 获取所有分类
     */
    getClassify : function () {
      applicationServiceSet.mentalHealthService._CourseClassify._GetAllClassify.send([sessionStorage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
          $scope.allClassify = data.Data;
        }
      });
    },
    /**
     * 获取所有讲师
     */
    getAllTeacher:function () {
      applicationServiceSet.mentalHealthService._CourseClassify._GetExpertList.send([sessionStorage.getItem('copPage_token'),0]).then(function (data) {
        if (data.Ret == 0) {
          $scope.teacherList = data.Data;
        }
      });
    },
    /**
     * 发布课程
     */
    publish:function (item) {
      applicationServiceSet.mentalHealthService._CourseClassify._PublishCourse.send(undefined,[sessionStorage.getItem('copPage_token'),item.ID]).then(function (data) {
        if (data.Ret == 0) {
          toastr.success('发布成功！');
          item.state = '已发布';
          item.ST = 1;
        }
      });
    },
    /**
     * 删除课程
     */
    delet : function(item){
      applicationServiceSet.mentalHealthService._CourseClassify._DeleteCourse.send(undefined,[sessionStorage.getItem('copPage_token'),item.ID]).then(function (data) {
        if (data.Ret == 0) {
          toastr.success('删除成功！');
          maintain.getAllCourse();
        }
      });
    },
    /**
     *获取所有课程
     */
    getAllCourse:function () {
      applicationServiceSet.mentalHealthService._CourseClassify._GetCoursePage.send([sessionStorage.getItem('copPage_token'),$scope.pagination.itemsPerPage,$scope.pagination.currentPage,$scope.serchData.courseName,$scope.serchData.courseClassfy,$scope.serchData.teacher]).then(function (data) {
        if (data.Ret == 0) {
          $scope.pagination.totalItems = data.Data.TotalRecords;
          $scope.allCourse = data.Data.ViewModelList;
          $.each($scope.allCourse,function (e,item) {
            if(item.ST == 0){
              item.state = '未发布';
            }else if(item.ST == 1){
              item.state = '已发布';
            }else{
              item.state = '全部';
            }
          });
        }
      });
    }
  };
  maintain.init();
}]);
