/**
 * Created by Wang QiHan on 2016/11/22.
 * Save User School Authority Controller
 */

app.controller('SaveUserSchoolAuthorityController', ['$scope', '$modal', '$location', '$state', '$stateParams', 'cityList','toastr', 'toastrConfig', 'applicationServiceSet',  function ($scope, $modal, $location, $state, $stateParams, cityList, toastr, toastrConfig, applicationServiceSet) {
  'use strict';
  toastrConfig.preventOpenDuplicates = true;
  $scope.cityList = cityList;

  $scope.queryFields = {
    partner:  $stateParams.OrgID || undefined,
    school:   undefined,
    user:     $stateParams.UID || undefined,
    province: undefined,
    city:     undefined,
    district: undefined
  };

  $scope.config = {
    province: undefined,
    city:     undefined,
    district: undefined,
    partner:  undefined,
    user:     undefined
  };

  $scope.$watch('queryFields.province', function (nv, ov) {
    if(nv === ov) return;
    $scope.queryFields.city = $scope.queryFields.district = undefined;
    $scope.config.city = $scope.config.district = undefined;

    $scope.config.city = cityList.filter(function (item, index, isArray) {
      return item.id === $scope.queryFields.province
    })[0]['sub'];
  });

  $scope.$watch('queryFields.city', function (nv, ov) {
    if(nv === ov) return;
    $scope.queryFields.district = undefined;
    $scope.config.district = undefined;

    $scope.config.district = $scope.config.city.filter(function (item, index, isArray) {
      return item.id === $scope.queryFields.city
    })[0]['sub'];
  });

  // -----  服务方法配置开始  -------------------------------------------------------------------

  var userSchools =  (function () {

    var token = APPMODEL.Storage.copPage_token,
        orgid = APPMODEL.Storage.orgid;

    var service = function (method, arr, list, fn) {
      if(Object.prototype.toString.call(list) === '[object Function]'){
        fn = list;
        list = undefined;
      }
      applicationServiceSet.internalServiceApi.userManagementInstitution[method].send(arr, list).then(fn);
    };

    var getOrgList =  function () {
      service('GetOrgList', [token, 8], function (data) {
        if(data.Ret === 0){
          $scope.config.partner = data.Data || undefined;
        }
      });
    };

    var getSimpleOrgUsers =  function () {
      service('getSimpleOrgUsers', [token, $scope.queryFields.partner], function (data) {
        if(data.Ret === 0){
          if($scope.queryFields.partner !== $stateParams.OrgID){
            $scope.config.user = undefined;
            $scope.queryFields.user = undefined;
          }
          $scope.config.user = data.Data && data.Data.length ? data.Data : undefined;
        }
      });
    };

    // 根据合作伙伴、用户、省市县、学校获取学校列表
    var getSchoolsByOrgUID = function () {
      var rid = $scope.queryFields.district || 0,
          gname = $scope.queryFields.school || '';
      service('getSchoolsByOrgUID', [token, $scope.queryFields.user, $scope.queryFields.partner, rid, gname], function (data) {
        if(data.Ret === 0){
          $scope.dataList = data.Data && data.Data.length ? data.Data : undefined;
        }
      });
    }

    var addUserSchool =  function (gid, index) {
      service('addUserSchool', undefined, [token, $scope.queryFields.user, $scope.queryFields.partner, gid], function (data) {
        if(data.Ret === 0){
          toastr.success('分配权限成功！');
          $scope.dataList[index].IsOwn = true;
        }
      });
    }

    var addUserSchoolByCondition = function () {
      var rid = $scope.queryFields.district || 0,
        gname = $scope.queryFields.school || '';
      service('addUserSchoolByCondition', undefined, [token, $scope.queryFields.user, $scope.queryFields.partner, rid, gname], function (data) {
        if(data.Ret === 0){
          toastr.success('按查询条件分配成功');
          getSchoolsByOrgUID();
        }
      });
    }

    var deleteUserSchool = function (gid, index) {
      service('deleteUserSchool', undefined, [token,$scope.queryFields.partner, $scope.queryFields.user, gid], function (data) {
        if(data.Ret === 0){
          toastr.success('权限删除成功！');
          $scope.dataList[index].IsOwn = false;
        }
      });
    }


    return {
      getOrgList: getOrgList,
      getSimpleOrgUsers: getSimpleOrgUsers,
      getSchoolsByOrgUID: getSchoolsByOrgUID,
      addUserSchool: addUserSchool,
      addUserSchoolByCondition: addUserSchoolByCondition,
      deleteUserSchool: deleteUserSchool
    }
  })();
  // 获取组织列表
  userSchools.getOrgList();

  // 查询出列表
  $scope.submitQuery = function () {
    if(!($scope.queryFields.school || $scope.queryFields.district)){
      toastr.error('学校与地址必须选填一个！');
      return
    }
    userSchools.getSchoolsByOrgUID();
  };

  // 合作伙伴改变时 重置所有选项
  $scope.$watch('queryFields.partner', function (nv, ov) {
    if(nv === ov) return;
    // 根据合作伙伴获取用户列表
    userSchools.getSimpleOrgUsers();
  });

  if($stateParams.OrgID){
    userSchools.getSimpleOrgUsers();
  }

  $scope.add = function (item, index) {
    userSchools.addUserSchool(item.GID, index);
  }

  $scope.addCondition = function () {
    if(!($scope.queryFields.school || $scope.queryFields.district)){
      toastr.error('学校与地址必须选填一个！');
      return
    }
    userSchools.addUserSchoolByCondition();
  }

  $scope.del = function (item, index) {
    userSchools.deleteUserSchool(item.GID, index);
  }

  $scope.cancel = function () {
    //$location.path('access/app/internal/userManagementInternal/userSchoolAuthority');
    var params = '';
    if(($stateParams.OrgID && $stateParams.UID) || ($scope.queryFields.partner && $scope.queryFields.user)){
      params = {
        OrgID: $stateParams.OrgID || $scope.queryFields.partner,
        UID: $stateParams.UID || $scope.queryFields.user
      }
    }
    $state.go('access.app.internal.userManagementInternal.userSchoolAuthority',params);
  }
}]);
