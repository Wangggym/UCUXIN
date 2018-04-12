/**
 * Created by Wang QiHan on 2016/11/22.
 * Save New School Controller
 */

app.controller('SaveNewPartnerSchoolController', ['$scope', '$modal', '$location', 'cityList','toastr', 'toastrConfig', 'applicationServiceSet',  function ($scope, $modal, $location, cityList, toastr, toastrConfig, applicationServiceSet) {
  'use strict';
  toastrConfig.preventOpenDuplicates = true;
  $scope.cityList = cityList;

  $scope.submitData = {
    OrgID:   undefined,
    GIDList: undefined
  };

  $scope.queryFields = {
    school:   undefined,
    province: undefined,
    city:     undefined,
    district: undefined
  };

  $scope.config = {
    province: undefined,
    city:     undefined,
    district: undefined,
    partner:  undefined,
    selected: undefined,
    checkAll: false
  };

  // 分页指令配置
  $scope.pagination = {
    currentPage: 1,
    itemsPerPage: 50, // 默认查询10条
    maxSize: 5,
    previousText: "上页",
    nextText: "下页",
    firstText: "首页",
    lastText: "末页"
  };

  $scope.$watch('queryFields.province', function (nv, ov) {
    if(nv === ov) return;
    $scope.queryFields.city = $scope.queryFields.district = undefined;
    $scope.config.city = $scope.config.district = undefined;

    if(nv === undefined) return;

    $scope.config.city = cityList.filter(function (item, index, isArray) {
      return item.id === $scope.queryFields.province
    })[0]['sub'];
  });

  $scope.$watch('queryFields.city', function (nv, ov) {
    if(nv === ov) return;
    $scope.queryFields.district = undefined;
    $scope.config.district = undefined;

    if(nv === undefined) return;

    $scope.config.district = $scope.config.city.filter(function (item, index, isArray) {
      return item.id === $scope.queryFields.city
    })[0]['sub'];
  });

  // -----  服务方法配置开始  -------------------------------------------------------------------

  var partnerSchools =  (function () {

    var token = APPMODEL.Storage.copPage_token,
        orgid = APPMODEL.Storage.orgid;

    var service = function (method, arr, fn) {
      applicationServiceSet.internalServiceApi.organizationalInstitution[method].send(arr).then(fn);
    };

    var getOrgList =  function () {
      service('getOrgList', [token, 8], function (data) {
        if(data.Ret === 0){
          $scope.config.partner = data.Data || undefined;
        }
      });
    };

    // 左右侧选中元素比对
    var compareSelected = function (targetArr, compareArr) {
      var selectedNumber = 0;
      if(Array.isArray(targetArr)){
        angular.forEach(targetArr, function (item) {
          item.IsCheck = false;
          angular.forEach(compareArr, function (sub) {
            if(item.ID === sub.ID){
              item.IsCheck = true;
              selectedNumber++;
            }
          });
        });
        if(targetArr.length){
          $scope.config.checkAll = selectedNumber === targetArr.length ? true: false;
        }
      }
    };

    var getAllGroupByRidOrName =  function () {
      if(!$scope.submitData.OrgID) return;
/*      $scope.queryFields.rid =  (function () {
        if($scope.queryFields.district && $scope.queryFields.city && $scope.queryFields.province){
          return $scope.queryFields.district;
        }

        if($scope.queryFields.city && $scope.queryFields.province && !$scope.queryFields.district){
          return $scope.queryFields.city;
        }

        if(!$scope.queryFields.city && $scope.queryFields.province && !$scope.queryFields.district){
          return $scope.queryFields.province;
        }
        return 0;
      })();*/

      var school = $scope.queryFields.school || '',
        rid = $scope.queryFields.rid = $scope.queryFields.district || 0;
      service('getAllGroupByRidOrName', [token, $scope.submitData.OrgID, school, rid], function (data) {
        if(data.Ret === 0){
          $scope.dataList = data.Data || undefined;

          compareSelected($scope.dataList, $scope.config.selected);
        }
      });
    };

    var getSchoolList = function () {
      if(!$scope.submitData.OrgID) return;
      service('getSchoolList', [token, $scope.submitData.OrgID], function (data) {
        if(data.Ret === 0){
          $scope.config.selected = data.Data || undefined;
          compareSelected($scope.dataList, $scope.config.selected);
        }
      });
    };

    var saveOrgGroup = function () {
      service('saveOrgGroup', $scope.submitData, function (data) {
        if(data.Ret === 0){
          toastr.success('学校分配成功');
          $location.path('access/app/internal/organizationalInstitution/listOfPartnerSchools');
        }
      });
    };

    return {
      getOrgList: getOrgList,
      getAllGroupByRidOrName: getAllGroupByRidOrName,
      saveOrgGroup: saveOrgGroup,
      getSchoolList: getSchoolList
    }
  })();
  // 获取组织列表
  partnerSchools.getOrgList();

  // 查询出列表
  $scope.submitQuery = function () {
    partnerSchools.getAllGroupByRidOrName();
  };

  // 合作伙伴改变时 重置所有选项
  $scope.changePartner = function () {
    // 获取选中组织下的学校列表
    // partnerSchools.getSchoolList();


    if($scope.submitData.OrgID && ($scope.queryFields.district || $scope.queryFields.school)){
      partnerSchools.getAllGroupByRidOrName();
    }else{
      $scope.dataList = undefined;
      $scope.config.checkAll = false;
    }

  };

  //  校验是否全选
  var checkedAll = function () {
    var selectedNumber = $scope.dataList.filter(function (item, index, array) {
      return item.IsCheck === true;
    }).length;
    $scope.config.checkAll = selectedNumber === $scope.dataList.length ? true: false;
  };


  $scope.selectedSchool = function (item) {
    if(!Array.isArray($scope.config.selected)){
      $scope.config.selected = [];
    }

    if(item.IsCheck){
      if($scope.config.selected.length){
        var isHas = $scope.config.selected.every(function (data) {
          return data.ID === item.ID;
        });

        if(!isHas) $scope.config.selected.push(item);
      }else{
        $scope.config.selected.push(item);
      }

    }else{
      $scope.config.selected.forEach(function (data, index, array) {
        if(data.ID === item.ID){
          array.splice(index, 1)
        }
      });
    }

    checkedAll();
  };
  
  $scope.delSelected = function (item,index) {
    $scope.config.selected.splice(index, 1);

    if(Array.isArray($scope.dataList)){
      var selected = $scope.dataList.filter(function (list, index, array) {
        return list.ID === item.ID;
      });

      if(selected.length){
        selected[0].IsCheck = false;
        checkedAll();
      }
    }

  };
  
  $scope.selectedAll = function () {
    if($scope.config.checkAll){
      angular.forEach($scope.dataList, function (item) {
        item.IsCheck = true;
      });

      var addList = angular.copy($scope.dataList);
      angular.forEach($scope.config.selected, function (item) {
        addList = addList.filter(function (data) {
          return item.ID !== data.ID;
        });
      });
      $scope.config.selected = Array.isArray($scope.config.selected) ? $scope.config.selected.concat(addList): [].concat(addList);


    }else{
      angular.forEach($scope.dataList, function (item) {
        item.IsCheck = false;
        angular.forEach($scope.config.selected, function (data, index) {
          if(item.ID === data.ID){
            $scope.config.selected.splice(index,1);
          }
        });
      });
      //$scope.config.selected = [];
    }
  };

  $scope.confirm = function () {
    $scope.submitData.GIDList = [];
    angular.forEach($scope.config.selected, function (item) {
      $scope.submitData.GIDList.push(item.ID);
    });

    if(!$scope.submitData.OrgID){
      toastr.error('请选择合作伙伴！');
      return;
    }
    if(!$scope.submitData.GIDList.length){
      toastr.error('请选择学校！');
      return;
    }
    partnerSchools.saveOrgGroup();
  };
  
  $scope.cancel = function () {
    $location.path('access/app/internal/organizationalInstitution/listOfPartnerSchools');
  }
}]);
