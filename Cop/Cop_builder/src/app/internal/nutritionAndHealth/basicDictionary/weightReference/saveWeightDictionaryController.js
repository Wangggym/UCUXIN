/**
 * Created by QiHan Wang on 2017/2/9.
 * Save Weight Dictionary Controller
 */
app.controller('SaveWeightDictionaryController', ['$scope', '$state', 'toastr', 'toastrConfig', 'EzConfirm','applicationServiceSet',  function ($scope, $state, toastr,toastrConfig, EzConfirm,applicationServiceSet) {
  'use strict';
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

    var saveDictWeight = function () {

      service('saveDictWeight', vm.submitData, function (data) {
        if(data.Ret === 0){
          toastr.success('添加成功！');
          $state.go('access.app.internal.nutritionBasicDictionary.weightReference');
        }
      });
    };

    var getSingleDictWeight =  function (id) {
      service('getSingleDictWeight', [token, id], function (data) {
        if(data.Ret === 0){
          angular.extend(vm.submitData, data.Data);
        }
      })
    }

    return {
      getSingleDictWeight: getSingleDictWeight,
      saveDictWeight: saveDictWeight
    }
  })();

  var vm = $scope.vm = {
    submitData:{
      ID: undefined,
      Sex: undefined,
      Age: undefined,
      MonthAge: undefined,
      Median: undefined,
      FirstMin: undefined,
      FirstMax: undefined,
      SecondMin: undefined,
      SecondMax: undefined,
      ThirdMin: undefined,
      ThirdMax: undefined
    },
    // 新增 or 修改
    isAdd: $state.params.id,
    init: function () {
      this.isAdd && ctrl.getSingleDictWeight(this.isAdd);
    },
    computeAge: function(){
      this.submitData.Age =0 || Math.floor(this.submitData.MonthAge / 12);
    },
    save: function () {
      if(this.submitData.MonthAge<0){ toastr.error('请正确填写体重参考月龄！'); return; }
      if(this.submitData.Age<0){ toastr.error('请填写体重参考年龄！'); return; }
      if(!this.submitData.Sex){ toastr.error('请选择体重参考性别！'); return; }
      if(this.submitData.Median<0){ toastr.error('请填写体重参考中位数！'); return; }

      if(this.submitData.FirstMin<0){ toastr.error('请填写第一范围最小值！'); return; }
      if(this.submitData.FirstMax<0){ toastr.error('请填写第一范围最大值！'); return; }
      if((this.submitData.FirstMax - this.submitData.FirstMin) <0){ toastr.error('第一范围最大值不能小于最小值！'); return;}

      if(this.submitData.SecondMin<0){ toastr.error('请填写第二范围最小值！'); return; }
      if(this.submitData.SecondMax<0){ toastr.error('请填写第二范围最大值！'); return; }
      if((this.submitData.SecondMax - this.submitData.SecondMin) <0){ toastr.error('第二范围最大值不能小于最小值！'); return;}

      if(this.submitData.ThirdMin<0){ toastr.error('请填写第三范围最小值！'); return; }
      if(this.submitData.ThirdMax<0){ toastr.error('请填写第三范围最大值！'); return; }
      if((this.submitData.ThirdMax - this.submitData.ThirdMin) <0){ toastr.error('第三范围最大值不能小于最小值！'); return;}

      ctrl.saveDictWeight();
    },
    cancel: function () {
      $state.go('access.app.internal.nutritionBasicDictionary.weightReference');
    }
  };
  vm.init();
}]);