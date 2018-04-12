/**
 * Created by Wang QiHan on 2016/11/21.
 * User School Authority Controller
 */

app.controller('UserSchoolAuthorityController', ['$scope', '$modal','$state','$stateParams', 'cityList','toastr', 'toastrConfig', 'applicationServiceSet',  function ($scope, $modal,$state,$stateParams, cityList, toastr, toastrConfig, applicationServiceSet) {
  'use strict';

  toastrConfig.preventOpenDuplicates = true;
  $scope.cityList = cityList;

  $scope.queryFields = {
    partner:  undefined,
    school:   undefined,
    user:     undefined
  };

  $scope.config = {
    school: undefined,
    user:     undefined
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

  // -----  服务方法配置开始  -------------------------------------------------------------------

  var userSchools =  (function () {

    var token = APPMODEL.Storage.copPage_token,
        appToken = APPMODEL.Storage.applicationToken;

    var service = function (method, arr, list, fn) {
      if(Object.prototype.toString.call(list) === '[object Function]'){
        fn = list;
        list = undefined;
      }
      applicationServiceSet.internalServiceApi.userManagementInstitution[method].send(arr,list).then(fn);
    };

    var getOrgList =  function () {
      service('GetOrgList', [token, 8], function (data) {
        if(data.Ret === 0){
          $scope.config.partner = data.Data || undefined;
        }
      });
    };

    var getSimpleOrgUsers =  function () {

      var partner = $scope.queryFields.partner || $stateParams.OrgID;
      service('getSimpleOrgUsers', [token, partner], function (data) {
        if(data.Ret === 0){
          if($scope.queryFields.partner !== $stateParams.OrgID){
            $scope.config.user = undefined;
            $scope.queryFields.user = undefined;
          }
          $scope.config.user = data.Data || undefined;
        }
      });
    };

    var getFuzzyQuerySchool = function (keyword) {
      service('getFuzzyQuerySchool', [appToken, keyword], function (data) {
        if(data.Ret === 0){
          $scope.config.school = data.Data || undefined;
        }
      });
    };

    var getUserGroupPage =  function () {
      if(!$scope.queryFields.partner || !$scope.queryFields.user) return;

      var school = $scope.queryFields.school || 0;
      service('getUserGroupPage', [token, $scope.pagination.currentPage, $scope.pagination.itemsPerPage, $scope.queryFields.partner, $scope.queryFields.user, school], function (data) {
        if(data.Ret === 0){
          if (data.Data) {
            $scope.dataList = data.Data.ViewModelList;
            $scope.pagination.totalItems = data.Data.TotalRecords;
            $scope.pagination.numPages = data.Data.Pages;
          } else {
            $scope.dataList = $scope.pagination.totalItems = $scope.pagination.numPages = undefined;
          }
        }
      });
    };

    // 删除用户学校
    var deleteUserSchool =  function (orgid, uid, gid) {
      service('deleteUserSchool', undefined, [token, orgid, uid, gid], function (data) {
        if(data.Ret === 0){
          toastr.success('删除成功！');
          getUserGroupPage();
        };
      });
    };

    return {
      getOrgList: getOrgList,
      getUserGroupPage: getUserGroupPage,
      deleteUserSchool: deleteUserSchool,
      getSimpleOrgUsers: getSimpleOrgUsers,
      getFuzzyQuerySchool: getFuzzyQuerySchool
    }
  })();

// 获取组织列表
  userSchools.getOrgList();

  if($stateParams.OrgID && $stateParams.UID){
      $scope.queryFields.partner = $stateParams.OrgID;
      $scope.queryFields.user = $stateParams.UID;
      userSchools.getUserGroupPage();
  }

  // 合作伙伴改变时 重置所有选项
  $scope.$watch('queryFields.partner', function (nv, ov) {
    if(nv === ov) return;
    // 根据合作伙伴获取用户列表
    userSchools.getSimpleOrgUsers();
  });

  if($stateParams.OrgID){
    userSchools.getSimpleOrgUsers();
  }

  /*$scope.changePartner = function () {
    $scope.config.user = undefined;
    $scope.queryFields.user = undefined;
    userSchools.getSimpleOrgUsers();
  }*/

  // 查询学校
  $scope.refreshSchool = function (keyword) {
    if (!keyword) return;
    userSchools.getFuzzyQuerySchool(keyword);
  };

  // 查询出列表
  $scope.submitQuery = $scope.pageQuery = function (event) {
    if (event) {
      // 当点击查询时重置当页为首页
      var event = event || window.event;
      var target = event.target || window.srcElement;
      if (target.tagName.toLocaleLowerCase() == "button") {
        $scope.pagination.currentPage = 1;
      }
    }
    userSchools.getUserGroupPage();
  };

  $scope.save = function (orgid, uid) {
    $state.go('access.app.internal.userManagementInternal.saveUserSchoolAuthority',(orgid && uid) ?{OrgID:orgid,UID:uid}: '');
  };

  $scope.del = function (item) {
    var modalInstance = $modal.open({
      templateUrl: 'removeConfirm.html',
      size: 'sm',
      controller:'RemoveConfirmCtrl',
      resolve: {
        items: function () {
          return item
        }
      }
    });

    modalInstance.result.then(function (data) {
      userSchools.deleteUserSchool(data.OrgID, data.UID, data.GID);
    }, function () {
      // 取消时作出操作
    });
  }

}]);

app.controller('RemoveConfirmCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
  'use strict';
  $scope.item = items;
  $scope.comfirm = function () {
    $modalInstance.close($scope.item);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
