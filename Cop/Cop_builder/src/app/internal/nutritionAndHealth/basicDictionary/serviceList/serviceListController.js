/**
 * Created by QiHan Wang on 2017/2/8.
 * Service List Controller
 */
app.controller('ServiceListController', ['$scope', '$state', 'EzConfirmConfig', 'EzConfirm', 'toastr', 'toastrConfig','applicationServiceSet',  function ($scope, $state, EzConfirmConfig, EzConfirm, toastr, toastrConfig,applicationServiceSet) {
  'use strict';
  /*EzConfirmConfig.heading = 'My site-wide confirm heading';
  EzConfirmConfig.text = 'My site-wide confirm heading';
  EzConfirmConfig.confirmBtn = 'Yes yes';
  EzConfirmConfig.cancelBtn = 'No no';*/
 EzConfirmConfig.size = 'sm';
 toastrConfig.preventOpenDuplicates = true;

  var ctrl = (function () {
    var token = APPMODEL.Storage.copPage_token;

    var service = function (method, arr, list, fn) {
      if(Object.prototype.toString.call(list) === '[object Function]'){
        fn = list;
        list = undefined;
      }
      applicationServiceSet.internalServiceApi.nutritionHealth[method].send(arr, list).then(fn);
    };

    var getServicePages = function () {
      var  name = vm.queryFields.name || '';
      service('getServicePages',[token, vm.pagination.PageIndex, vm.pagination.PageSize,vm.queryFields.st, name], function (data) {
        if(data.Ret === 0){

          if(data.Data.ViewModelList.length){
            vm.dataList = data.Data.ViewModelList;
            console.log(vm.dataList)

            vm.pagination.Pages = data.Data.Pages;
            vm.pagination.TotalRecords = data.Data.TotalRecords;
          }else {
            vm.dataList = vm.pagination.Pages = vm.pagination.TotalRecords = undefined;
          }
        }
      });
    };

    var delService =  function (id) {
      service('delService', undefined, [token, id], function (data) {
        if(data.Ret === 0){
          toastr.success('数据删除成功！');
          getServicePages();
        }
      });
    }

    return {
      getServicePages: getServicePages,
      delService: delService
    }
  })();

  var vm = $scope.vm = {
    // 查询字段
    queryFields : {
      st: 0,
      name: undefined
    },
    // 分页指令配置
    pagination : {
      PageIndex: 1,
      PageSize: 50, // 默认查询10条
      MaxSize: 5
    },
    // 状态切换
    checkedA: function () {
      if(!this.checkedStA){
        this.checkedStA = false;
        this.queryFields.st = 0;
      }else {
        this.checkedStB = false;
        this.queryFields.st = 2;
      }
    },
    checkedB: function () {
      if(!this.checkedStB){
        this.checkedStB = false;
        this.queryFields.st = 0;
      }else{
        this.checkedStA = false;
        this.queryFields.st = 1;
      }
    },
    init: function () {
      ctrl.getServicePages();
    },
    // 查询 分页
    search : function (event) {
      if (event) {
        // 当点击查询时重置当页为首页
        var event = event || window.event;
        var target = event.target || window.srcElement;
        if (target.tagName.toLocaleLowerCase() == "button") {
          this.pagination.pageIndex = 1;
        }
      }
      this.init();
    },
    save: function (id) {
      $state.go('access.app.internal.nutritionBasicDictionary.saveService', {id:id});
    },
    del: function (id) {
      EzConfirm.create().then(function() {
        ctrl.delService(id);
      }, function() {});
    }
  };
  vm.init();
}]);