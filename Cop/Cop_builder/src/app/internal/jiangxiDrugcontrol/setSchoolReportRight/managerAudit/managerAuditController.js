/**
 * Created by wangbin on 2017/5/12.
 */
app.controller('managerAuditController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    var managerAudit = {
        /**
         * 入口
         */
        init : function () {
            managerAudit.pageData();
            managerAudit.onEvent();
        },
        /**
         * 页面数据初始化
         */
        pageData : function () {
            $scope.stateList = [
                {
                    name : '未处理',
                    state : 0
                },
                {
                    name : '审核通过',
                    state : 1
                },
                {
                    name : '审核失败',
                    state : 2
                },
                {
                    name : '全部',
                    state : 3
                }
            ]; // 状态list
            $scope.dataList = []; // 查询数据list
            $scope.schoolList = []; // 学校list
            $scope.model = {
                schoolName: '',
                state: 3
            }; // 学校名称
            $scope.managerName = ''; // 管理员姓名
            $scope.managerPhone = '';  // 管理员电话
            // 分页指令配置
            $scope.pagination = {
                totalItems: 0,
                currentPage: 1,
                itemsPerPage: 30, // 默认查询10条
                maxSize: 5,
                previousText: "上页",
                nextText: "下页",
                firstText: "首页",
                lastText: "末页"
            };
        },
        /**
         * 绑定页面相关的事件
         */
        onEvent : function () {

            // 查询
          $scope.pageQuery = $scope.serch = function () {
               managerAudit.getSerchDataList();
          };

            //展示Img
            $scope.confirm = function (item) {
                item.method = managerAudit.confirmJudge;
                $modal.open({
                    templateUrl: 'confirm.html',
                    controller: 'confirmCtrl',
                    size: 'md',
                    resolve: {
                        items: function () {
                            return item;
                        }
                    }
                });
            };
            // 导出
          $scope.export = function () {
            window.open(urlConfig+'ADE/v3/OnLineInit/ExportManager?token='+APPMODEL.Storage.getItem('copPage_token'))
          }
        },

        /**
         * 获取查询数据
         */
        getSerchDataList : function () {
            applicationServiceSet.internalServiceApi.jiangxiDrugcontrol.GetRegisterList.send([APPMODEL.Storage.getItem('copPage_token'),
                $scope.pagination.itemsPerPage,$scope.pagination.currentPage,$scope.model.schoolName,$scope.managerName,$scope.managerPhone,
                $scope.model.state
            ]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.pagination.totalItems = data.Data.TotalRecords;
                    $.each(data.Data.ViewModelList,function (e,item) {
                        if(item.Status == 0){
                            item.stateName = '未处理';
                        }else if(item.Status == 1){
                            item.stateName = '审核通过';
                        }else {
                            item.stateName = '审核不通过';
                        }
                    });
                    $scope.dataList = data.Data.ViewModelList;
                }
            });
        },
      /**
         *审核
         */
        confirmJudge : function (item) {
            applicationServiceSet.internalServiceApi.jiangxiDrugcontrol.ManagerJudge.send(undefined,[item.id,item.status,item.remark]).then(function (data) {
                if (data.Ret == 0) {
                    toastr.success('操作成功！');
                    managerAudit.getSerchDataList();
                }
            });
        }
    };
    managerAudit.init();
}]);

app.controller('confirmCtrl', ['$scope', '$modalInstance', 'items','toastr','applicationServiceSet',function ($scope, $modalInstance, items,toastr,applicationServiceSet) {
    $scope.data = items;
    $scope.data.remark = '';
    $scope.data.status = undefined;
  /**
   * 获取审核提示
   */
    var showTip = function(){
      applicationServiceSet.internalServiceApi.jiangxiDrugcontrol.BeforeCheck.send([APPMODEL.Storage.getItem('copPage_token'),$scope.data.ID]).then(function (data) {
        if (data.Ret == 0) {
          $scope.showTip = data.Data;
        }
      });
    };
  showTip();
    $scope.sure = function () {
        var object = {};
        if(!$scope.data.remark || $scope.data.remark == ''){
            toastr.error('请填写备注！');
            return;
        }
        if(!$scope.data.status || $scope.data.status == ''){
            toastr.error('请选择审核状态！');
            return;
        }
        object.id = $scope.data.ID;
        object.status = $scope.data.status;
        object.remark = $scope.data.remark;
        items.method(object);
        $modalInstance.dismiss('cancel');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
