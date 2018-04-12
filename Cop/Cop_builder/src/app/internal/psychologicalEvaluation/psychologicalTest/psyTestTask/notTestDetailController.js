app.controller('notTestDetailController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
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
                $scope.nName = "教师姓名：";
                $scope.showClass = false;
            }else{
                $scope.nName = "学生姓名：";
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
            // 开始和结束时间
            $scope.time = {
                sDate:decodeURIComponent($stateParams.sDate),
                eDate:decodeURIComponent($stateParams.eDate)
            };
            // 信息List
            $scope.allInfo = [];
        },
        /**
         * 绑定页面相关的事件
         */
        onEvent : function () {
            // 查询
            $scope.pageQuery = $scope.search = function () {
                hasTest.getAllList();
            };
            // 导出名单
            $scope.export = function () {
                window.open(urlConfig+'Psy/v3/ScaleTestTask/ExportTestRecordUserInfoList?token='+sessionStorage.getItem('copPage_token')+'&scaleTestTaskID='+$scope.taskId+
                    '&exportType=false&classID='+$scope.class.choiceClass+'&studentName='+$scope.stuName+'&testStartTime='+$scope.sDate+'&testEndTime='+$scope.eDate)
            }
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
            applicationServiceSet.mentalHealthService._psyTestTask._GetUnTestedUserInfoPage.send([sessionStorage.getItem('copPage_token'),$scope.pagination.currentPage,$scope.pagination.itemsPerPage,
                $scope.taskId,$scope.class.choiceClass,$scope.stuName]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.allInfo = data.Data.ViewModelList;
                    $scope.pagination.totalItems = data.Data.TotalRecords;
                    if($scope.allInfo && $scope.allInfo.length>0){
                        $.each($scope.allInfo,function (e,item) {
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
