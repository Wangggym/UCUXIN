/**
 * Created by QiHan Wang on 2017/5/26.
 * Save Currency SMS Records Controller
 */
app.controller('SaveCurrencySMSRecordsController', ['$scope', '$state', 'EzConfirmConfig', 'EzConfirm', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $state, EzConfirmConfig, EzConfirm, toastr, toastrConfig, applicationServiceSet) {
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
      applicationServiceSet.internalServiceApi.jiangxiDrugcontrol[method].send(arr, list).then(fn);
    };

    var sendCommonSms = function () {
      service('SendCommonSms', vm.submitData, [token], function (data) {
        if (data.Ret === 0) {
          toastr.success('发送成功！');
          $state.go('access.app.internal.antiDrugSMS.currencySMSRecords');
        }
      });
    };
    return {
      sendCommonSms: sendCommonSms
    }
  })();

  var vm = $scope.vm = {
    // 查询字段
    submitData: {
      Tel: undefined,
      Cont: undefined
    },
    model: {count: 0},
    save: function () {
      if (!vm.submitData.Tel) {
        toastr.error('请填写短信接收电话号码！');
        return false;
      }

      if (!vm.submitData.Cont) {
        toastr.error('请填写短信内容！');
        return false;
      }
      vm.submitData.Tel = vm.submitData.Tel.replace(/，/g, ',');

      ctrl.sendCommonSms();
    },
    cancel: function () {
      $state.go('access.app.internal.antiDrugSMS.currencySMSRecords');
    },
    contChange: function () {
      if (vm.submitData.Cont.length <= 62) {
        vm.model.count = 1;
      } else {
        vm.model.count = Math.ceil((vm.submitData.Cont.length + 8) / 67);
      }
    }
  };
}]);
