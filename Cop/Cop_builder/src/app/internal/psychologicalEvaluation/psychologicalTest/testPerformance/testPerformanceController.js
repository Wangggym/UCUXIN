
app.controller('performanceController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    var performance = {
        /**
         * 入口
         */
        init : function () {
            performance.pageData();
            performance.onEvent();
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
                choiceSchool:0
            };
            // 任务
            $scope.task = {
                allList:[],
                choiceTask:undefined
            };
            // 数据allList
            $scope.allList = [];
        },
        /**
         * 绑定页面相关的事件
         */
        onEvent : function () {
            // 模糊搜索学校
            $scope.refreshSchool = function (name) {
                if(name){
                    performance.getAllSchool(name);
                }
            };
            // 获取测试任务名称
            $scope.getTask = function () {
                performance.getAllTaskName();
            };
            // 查询
            $scope.search = function () {
                if($scope.school.choiceSchool == 0){
                    toastr.error('请先选择学校');
                    return;
                }
                if(!$scope.task.choiceTask){
                    toastr.error('请先选择量表！');
                    return;
                }
                performance.getAllList();
            };
            // 导出名单
            $scope.export = function () {
                if($scope.school.choiceSchool == 0){
                    toastr.error('请先选择学校');
                    return;
                }
                if(!$scope.task.choiceTask){
                    toastr.error('请先选择量表！');
                    return;
                }
                window.open(urlConfig+'Psy/v3/ScaleTestTask/ExportScaleTestTaskFinishList?token='+sessionStorage.getItem('copPage_token')+'&scaleTestTaskID='+$scope.task.choiceTask);
            };
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
         * 获取所有测试任务名称
         */
        getAllTaskName : function(){
            applicationServiceSet.mentalHealthService._psyTestTask._GetSchoolScaleTestTaskList.send([sessionStorage.getItem('copPage_token'),$scope.school.choiceSchool]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.task.allList  = data.Data;
                }
            });
        },
        /**
         * 获取学校测试的所有list
         */
        getAllList:function () {
            applicationServiceSet.mentalHealthService._psyTestTask._QueryScaleTestTaskFinishReport.send([sessionStorage.getItem('copPage_token'),$scope.school.choiceSchool,
                $scope.task.choiceTask]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.allList = data.Data;
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
    performance.init();
}]);
