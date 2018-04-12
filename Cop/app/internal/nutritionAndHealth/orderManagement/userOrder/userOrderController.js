/**
 * Created by QiHan Wang on 2017/2/8.
 * User Order Controller
 */
app.controller('UserOrderController', ['$scope', '$filter', '$state', 'EzConfirmConfig', 'EzConfirm', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $filter, $state, EzConfirmConfig, EzConfirm, toastr, toastrConfig, applicationServiceSet) {
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
      if (Object.prototype.toString.call(list) === '[object Function]') {
        fn = list;
        list = undefined;
      }
      applicationServiceSet.internalServiceApi.nutritionHealth[method].send(arr, list).then(fn);
    };

    var getUserOrderPages = function () {

      var tel = vm.queryFields.tel || undefined,
        payST = vm.queryFields.payST || 0,
        serviceID = vm.queryFields.serviceID || 0;
      service('getUserOrderPages', [token, vm.pagination.PageIndex, vm.pagination.PageSize, $filter('date')(vm.queryFields.sDate, 'yyyy-MM-dd'), $filter('date')(vm.queryFields.eDate, 'yyyy-MM-dd'), tel, payST, serviceID], function (data) {
        if (data.Ret === 0) {

          if (data.Data.ViewModelList) {
            vm.dataList = data.Data.ViewModelList;

            vm.pagination.Pages = data.Data.Pages;
            vm.pagination.TotalRecords = data.Data.TotalRecords;
          } else {
            vm.dataList = vm.pagination.Pages = vm.pagination.TotalRecords = undefined;
          }
        }
      });
    };

    var delDictHeight = function (id) {
      service('delDictHeight', undefined, [token, id], function (data) {
        if (data.Ret === 0) {
          toastr.success('数据删除成功！');
          getUserOrderPages();
        }
      });
    }

    return {
      getUserOrderPages: getUserOrderPages,
      delDictHeight: delDictHeight
    }
  })();

  var vm = $scope.vm = {
    // 时间配置
    datePicker: {
      format: 'yyyy-MM-dd',
      startOpened: false,
      endOpened: false,
      openStartDate: function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.datePicker.startOpened = true;
        vm.datePicker.endOpened = false;
      },
      openEndDate: function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.datePicker.startOpened = false;
        vm.datePicker.endOpened = true;
      },
      clear: function () {
        vm.queryFields.sDate = null;
        vm.queryFields.eDate = null;
      }
    },
    // 查询字段
    queryFields: {
      sDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
      eDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
      tel: undefined,
      payST: undefined,
      serviceID: undefined
    },
    // 分页指令配置
    pagination: {
      PageIndex: 1,
      PageSize: 50, // 默认查询10条
      MaxSize: 5
    },
    // 服务
    service: [
      {id: 1, name: '免费提问'},
      {id: 2, name: '标准测试'},
      {id: 3, name: '专家导测'},
      {id: 4, name: '营养管家'}
    ],
    // 状态切换
    checkedA: function () {
      if (!this.checkedStA) {
        this.checkedStA = false;
        this.queryFields.payST = 0;
      } else {
        this.checkedStB = false;
        this.queryFields.payST = 1;
      }
    },
    checkedB: function () {
      if (!this.checkedStB) {
        this.checkedStB = false;
        this.queryFields.payST = 0;
      } else {
        this.checkedStA = false;
        this.queryFields.payST = 2;
      }
    },
    init: function () {
      ctrl.getUserOrderPages();
      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
      };
    },
    // 查询 分页
    search: function (event) {
      if (event) {
        // 当点击查询时重置当页为首页
        var event = event || window.event;
        var target = event.target || window.srcElement;
        if (target.tagName.toLocaleLowerCase() == "button") {
          this.pagination.pageIndex = 1;
        }
      }
      if (!$scope.vm.queryFields.eDate || !$scope.vm.queryFields.sDate) {
        toastr.error('请选择下单时间');
        return;
      }
      this.init();
    },
    result: function (id) {
      $state.go('access.app.internal.nutritionOrderManagement.userTestResult', {id: id});
    },
    userQuestion: function (id) {
      $state.go('access.app.internal.nutritionOrderManagement.userTestQuestion', {id: id})
    }
  };
  vm.init();
}]);