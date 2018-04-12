/**
 * Created by QiHan Wang on 2017/5/26.
 * Currency SMS Records Controller
 */
app.controller('CurrencySMSRecordsController', ['$scope', '$state', 'EzConfirmConfig', 'EzConfirm', 'toastr', 'toastrConfig','applicationServiceSet',  function ($scope, $state, EzConfirmConfig, EzConfirm, toastr, toastrConfig,applicationServiceSet) {
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
      applicationServiceSet.internalServiceApi.jiangxiDrugcontrol[method].send(arr, list).then(fn);
    };

    var getCommonSmsPage = function () {
      var tel = vm.queryFields.tel || '';
      service('GetCommonSmsPage',[token, vm.pagination.PageIndex, vm.pagination.PageSize, tel], function (data) {
        if(data.Ret === 0){
          if(data.Data.ViewModelList.length){
            vm.dataList = data.Data.ViewModelList;

            vm.pagination.Pages = data.Data.Pages;
            vm.pagination.TotalRecords = data.Data.TotalRecords;
          }else {
            vm.dataList = vm.pagination.Pages = vm.pagination.TotalRecords = undefined;
          }
        }
      });
    };
    return {
      getCommonSmsPage: getCommonSmsPage
    }
  })();

  var vm = $scope.vm = {
    // 查询字段
    queryFields : {
      tel: undefined
    },
    // 分页指令配置
    pagination : {
      PageIndex: 1,
      PageSize: 50,
      MaxSize: 5
    },
    init: function () {
      ctrl.getCommonSmsPage();
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
      $state.go('access.app.internal.antiDrugSMS.saveCurrencySMSRecords', {id:id});
    }
  };
  vm.init();
}]);
