/**
 * Created by Wang QiHan on 2016/12/7.
 */
app.controller('openSms', ['$scope', '$location', '$modal', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $location, $modal, toastr, toastrConfig, applicationServiceSet) {
    'use strict';
    // 分页指令配置
    $scope.pagination = {
        currentPage: 1,
        itemsPerPage: 20, // 默认查询10条
        maxSize: 5,
        previousText: "上页",
        nextText: "下页",
        firstText: "首页",
        lastText: "末页"
    };
    /*获取列表*/
    getList();
    function getList() {
        applicationServiceSet.parAppServiceApi.userManagementInstitution.GetWebSmsControlList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid"),$scope.pagination.itemsPerPage,$scope.pagination.currentPage]).then(function (data) {
            if (data.Ret == 0) {
                $scope.dataList = data.Data.ViewModelList;
                $scope.pagination.totalItems = data.Data.TotalRecords;
                $scope.pagination.numPages = data.Data.Pages;
            }
        });
    }
    $scope.pageQuery = function (event) {
        if (event) {
            // 当点击查询时重置当页为首页
            var event = event || window.event;
            var target = event.target || window.srcElement;
            if (target.tagName.toLocaleLowerCase() == "button") {
                $scope.pagination.currentPage = 1;
            }
        }
        getList();
    };
    //打开modal
    $scope.openModal = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'openSmsFunc.html',
            controller: 'openSmsFunc',
            backdrop: false,
            size:'lg',
            resolve: {
                items: function () {
                    return item;
                },
            }
        });

        modalInstance.result.then(function (data) {
            getList();
        }, function () {

        });
    }
}]);

app.controller('openSmsFunc', ['$scope', '$modalInstance', 'items', '$modal', 'applicationServiceSet', 'toastr', 'toastrConfig', function ($scope, $modalInstance, items, $modal, applicationServiceSet, toastr, toastrConfig) {
    'use strict';
    $scope.item = items;
    $scope.model = {
        checkAll:false,
        rights:items ? items.OpenFuncList.map(function (e) {
            return e.ID;
        }) :[],  //待提交的功能
        GID:items ? items.GID : undefined, //展示是否选中的学校
        openFuncList: items ? items.OpenFuncList : [],  //展示是否选中的功能
        SmsOpenControlItemList:items ? items.SmsOpenControlItemList : [],
        ID:items ? items.ID : 0
    };
    /*全选*/
    $scope.selectAll = function () {
      if(!$scope.model.checkAll){
          $scope.model.rights = $scope.model.funcList.map(function (e) {
              e.check = true;
              return e.ID;
          });
          $scope.model.checkAll = !$scope.model.checkAll;
      }else {
          $scope.model.rights = [];
          $scope.model.funcList.forEach(function (e) {
              e.check = false;
          });
          $scope.model.checkAll = !$scope.model.checkAll;

      }

    };
    /*单选*/
    $scope.select = function (item) {
        if(item.check){
            $scope.model.rights = $scope.model.rights.filter(function (t) {
                return t != item.ID
            })
        }else{
            $scope.model.rights.push(item.ID);
        }
        item.check = !item.check;

        console.log($scope.model.rights)

    };
    $scope.ok = function () {
        if(!$scope.model.GID){
            toastr.info('请选择学校');
            return;
        }
        applicationServiceSet.parAppServiceApi.userManagementInstitution.AddOrUpdateSmsControl.send([$scope.model.ID,APPMODEL.Storage.getItem('orgid')
                ,$scope.model.GID,$scope.model.rights]
            ,[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
            if (data.Ret == 0) {
                !items ? toastr.success('添加成功！') : toastr.success('编辑成功！')
                $modalInstance.close();
            }
        });
    };
    $scope.cancel = function () {
        $modalInstance.close();
    };
    /*获取学校列表*/
    applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
        if (data.Ret == 0) {
            $scope.model.schoolList = data.Data;
        }
    });
    /*获取功能列表*/
    applicationServiceSet.parAppServiceApi.message.GetSmsFuncList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
        if (data.Ret == 0) {
            $scope.model.funcList = data.Data;
            for(var i = 0;i < $scope.model.openFuncList.length ;i++){
                for(var j = 0;j < $scope.model.funcList.length ;j++){
                    if($scope.model.openFuncList[i].ID == $scope.model.funcList[j].ID){
                        $scope.model.funcList[j].check = true;
                    }
                }
            }
        }
    })

}]);
