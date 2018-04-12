/**
 * Created by QiHan Wang on 2017/2/7.
 * Family Controller
 * Including mother, father, Grandmother, GrandFather, brother, sister and so on members
 */
app.controller('FamilyController', ['$scope', 'applicationServiceSet',  function ($scope, applicationServiceSet) {
  'use strict';
  var ctrl = (function () {
    var token = APPMODEL.Storage.copPage_token;

    var service = function (method, arr, fn) {
      applicationServiceSet.internalServiceApi.nutritionHealth[method].send(arr).then(fn);
    };

    var getFamilyMember = function () {
      var tel = vm.queryFields.tel || '',
        name = vm.queryFields.name || '';
      service('getFamilyMember',[token, vm.pagination.PageIndex, vm.pagination.PageSize,tel, name], function (data) {
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
      getFamilyMember: getFamilyMember
    }
  })();

  var vm = $scope.vm  = {
    // 查询字段
    queryFields : {
      tel: undefined,
      name: undefined
    },
    // 分页指令配置
    pagination : {
      PageIndex: 1,
      PageSize: 50, // 默认查询10条
      MaxSize: 5
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
      ctrl.getFamilyMember();
    },
    init: function () {
      ctrl.getFamilyMember();
    }
  };
  vm.init();
}]);

