/**
 * Created by Wang QiHan on 2016/11/22.
 * Save User School Authority Controller
 */

app.controller('SaveUserSchoolAuthorityPartnersController', ['$scope', '$modal', '$location', '$state', '$stateParams', 'cityList','toastr', 'toastrConfig', 'applicationServiceSet',  function ($scope, $modal, $location, $state, $stateParams, cityList, toastr, toastrConfig, applicationServiceSet) {
  'use strict';
  toastrConfig.preventOpenDuplicates = true;
  $scope.cityList = cityList;
  $scope.queryFields = {
    school:   '',
    user:     $stateParams.UID || undefined,
    province: undefined,
    city:     undefined,
    district: undefined
  };

  $scope.config = {
    province: undefined,
    city:     undefined,
    district: undefined,
    user:     undefined,
    choiceAll:false,
    title:$stateParams.Name.split(' ')[0]+'/'+$stateParams.Name.split(' ')[1]
  };
    // 分页指令配置
    $scope.pagination = {
        currentPage: 1,
        itemsPerPage: 30, // 默认查询30条
        totalItems:0,
        maxSize: 5,
        previousText: "上页",
        nextText: "下页",
        firstText: "首页",
        lastText: "末页"
    };
    /**
     * 返回
     */
    $scope.go = function () {
        window.history.go(-1);
    };
    /**
     *获取查询列表
     */
  $scope.search = function () {
      applicationServiceSet.couldRegionServiceApi.couldRegion.GetPageAdminAccessGroups.send([APPMODEL.Storage.getItem('copPage_token'),
          $scope.pagination.itemsPerPage,$scope.pagination.currentPage,APPMODEL.Storage.getItem('cloudId'),APPMODEL.Storage.getItem('orgid'),
          $stateParams.UID,$scope.queryFields.province?$scope.queryFields.province:0,$scope.queryFields.school,false]).then(function (data) {
          if(data.Ret==0){
              $scope.dataList = data.Data.ViewModelList;
              $.each($scope.dataList,function (e,item) {
                  item.check = false;
              });
              $scope.pagination.totalItems = data.Data.TotalRecords;
          }
      });
  };
    /**
     * 批量添加权限
     */
    $scope.addRight = function () {
        var list = [];
        $.each($scope.dataList,function (e,item) {
            if(item.check == true){
                list.push(item.ID);
            }
        });
        if(list.length == 0){
            toastr.error('请先选择要分配的学校！');
            return;
        }
        applicationServiceSet.couldRegionServiceApi.couldRegion.AddGroupAdmins.send([list],[APPMODEL.Storage.getItem('copPage_token'),APPMODEL.Storage.getItem('orgid'),$stateParams.UID]).then(function (data) {
            if(data.Ret==0){
                toastr.success('添加成功！');
                $scope.search();
            }
        });
    };
    /**
     * 全选
     */
  $scope.checkAll = function () {
    if(!$scope.config.checkAll){
        $.each($scope.dataList,function (e,item) {
            item.check = true;
        });
        $scope.config.checkAll = true;
    }else {
        $.each($scope.dataList,function (e,item) {
            item.check = false;
        });
        $scope.config.checkAll = false;
    }
  };
    /**
     *选择
     */
    $scope.check = function (item) {
        if(item.check==true){
            item.check = false;
        }else {
            item.check = true;
        }
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
      applicationServiceSet.parAppServiceApi.userManagementInstitution[method].send(arr, list).then(fn);
    };


    var getSimpleOrgUsers =  function () {
      service('getSimpleOrgUsers', [token, orgid], function (data) {
        if(data.Ret === 0){
          $scope.config.user = data.Data && data.Data.length ? data.Data : undefined;
        }
      });
    };

    // 根据合作伙伴、用户、省市县、学校获取学校列表
    var getSchoolsByOrgUID = function () {
      var rid = $scope.queryFields.district || 0,
        gname = $scope.queryFields.school || '';
      service('getSchoolsByOrgUID', [token, $scope.queryFields.user, orgid, rid, gname], function (data) {
        if(data.Ret === 0){
          $scope.dataList = data.Data && data.Data.length ? data.Data : undefined;
        }
      });
    }

    var addUserSchool =  function (gid, index) {
      service('addUserSchool', undefined, [token, $scope.queryFields.user, orgid, gid], function (data) {
        if(data.Ret === 0){
          toastr.success('分配权限成功！');
          $scope.dataList[index].IsOwn = true;
        }
      });
    }

    var addUserSchoolByCondition = function () {
      var rid = $scope.queryFields.district || 0,
        gname = $scope.queryFields.school || '';
      service('addUserSchoolByCondition', undefined, [token, $scope.queryFields.user, orgid, rid, gname], function (data) {
        if(data.Ret === 0){
          toastr.success('按查询条件分配成功');
          getSchoolsByOrgUID();
        }
      });
    }

    var deleteUserSchool = function (gid, index) {
      service('deleteUserSchool', undefined, [token, orgid, $scope.queryFields.user,  gid], function (data) {
        if(data.Ret === 0){
          toastr.success('权限删除成功！');
          $scope.dataList[index].IsOwn = false;
        }
      });
    }


    return {
      getSimpleOrgUsers: getSimpleOrgUsers,
      getSchoolsByOrgUID: getSchoolsByOrgUID,
      addUserSchool: addUserSchool,
      addUserSchoolByCondition: addUserSchoolByCondition,
      deleteUserSchool: deleteUserSchool
    }
  })();
  // userSchools.getSimpleOrgUsers();

  $scope.add = function (item, index) {
    userSchools.addUserSchool(item.GID, index);
  }
  $scope.del = function (item, index) {
    userSchools.deleteUserSchool(item.GID, index);
  }

  // 分配查询条件下的学校权限
  $scope.addCondition = function () {
    if(!($scope.queryFields.school || $scope.queryFields.district)){
      toastr.error('学校与地址必须选填一个！');
      return
    }
    userSchools.addUserSchoolByCondition();
  }

  // 查询出列表
    $scope.pageQuery = $scope.submitQuery = function () {
    // if(!($scope.queryFields.school || $scope.queryFields.province)){
    //   toastr.error('学校与地址必须选填一个！');
    //   return
    // }
      $scope.search();
  };

  $scope.cancel = function () {
    var params = '';
    if($stateParams.UID || $scope.queryFields.user){
      params = {
        UID: $stateParams.UID || $scope.queryFields.user
      }
    }
    $state.go('access.app.partner.userManagementPartner.userSchoolAuthorityPartners', params);
  }
}]);
