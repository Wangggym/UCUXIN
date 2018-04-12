/**
 * Created by QiHan Wang on 2017/2/8.
 * Height Reference Controller
 */
app.controller('WeightReferenceController', ['$scope', '$state', 'EzConfirmConfig', 'EzConfirm', 'toastr', 'toastrConfig','applicationServiceSet',  function ($scope, $state, EzConfirmConfig, EzConfirm, toastr, toastrConfig,applicationServiceSet) {
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

    var getDictWeightPages = function () {

      var monthAge = vm.queryFields.monthAge || 0,
        sex = vm.queryFields.sex || 0;
      service('getDictWeightPages',[token, vm.pagination.PageIndex, vm.pagination.PageSize, monthAge, sex], function (data) {
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

    var delDictWeight =  function (id) {
      service('delDictWeight', undefined, [token, id], function (data) {
        if(data.Ret === 0){
          toastr.success('数据删除成功！');
          getDictWeightPages();
        }
      });
    }

    return {
      getDictWeightPages: getDictWeightPages,
      delDictWeight: delDictWeight
    }
  })();

  var vm = $scope.vm = {
    // 查询字段
    queryFields : {
      sex: undefined,
      monthAge: undefined
    },
    // 分页指令配置
    pagination : {
      PageIndex: 1,
      PageSize: 50, // 默认查询10条
      MaxSize: 5
    },
    // 性别
    sex: [
      { id: 1, name:'男' },
      { id: 2, name:'女' },
      { id: 3, name:'未知' }
    ],
    init: function () {
      ctrl.getDictWeightPages();
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
      $state.go('access.app.internal.nutritionBasicDictionary.saveWeightDictionary', {id:id});
    },
    del: function (id) {
      EzConfirm.create().then(function() {
        ctrl.delDictWeight(id);
      }, function() {});
    }
  };
  vm.init();
}]);
app.filter('sexFormat', function () {
  return function (value) {
    switch (parseInt(value)){
      case 0:
        return '女';
        break;
      case 1:
        return '男';
        break;
      case -1:
        return '不限';
        break;
    };
  }
});