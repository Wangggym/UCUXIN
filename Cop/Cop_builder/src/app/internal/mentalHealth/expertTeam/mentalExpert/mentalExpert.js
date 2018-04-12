/**
 * Created by Administrator on 2017/7/13.
 */
app.controller('mentalExpert', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
  $scope.token = APPMODEL.Storage.getItem("copPage_token");
  var ctr = {
    init:function () {
      ctr.basic();
      ctr.pageIndex();
      ctr._GetAllPsyOrgList();
      ctr._GetExpertPage();
    },
    pageIndex: function () {
      /**
       * paging index send
       */
      $scope.pageIndex = {
        /**
         * click paging
         * @param page
         */
        fliPage: function (page) {

          applicationServiceSet.mentalHealthService._ExpertTeam._GetExpertPage.send([$scope.token,$scope.pageSize,page.pIndex,$scope.name,$scope.psyOrgID]).then(function (data) {
            if (data.Ret == 0) {
              $scope.viewList = data.Data.ViewModelList;//transformation Data
              $scope.pageIndex.pages = data.Data.Pages;//paging pages
              $scope.pageIndex.pageindexList(data.Data);//paging
            }
          });
        },
        /**
         * nextPage
         * @param pageNext
         */
        nextPage: function (pageNext) {

          applicationServiceSet.mentalHealthService._ExpertTeam._GetExpertPage.send([$scope.token,$scope.pageSize,pageNext,$scope.name,$scope.psyOrgID]).then(function (data) {
            if (data.Ret == 0) {
              $scope.viewList = data.Data.ViewModelList;//transformation Data
              $scope.pageIndex.pages = data.Data.Pages;//paging pages
              $scope.pageIndex.pageindexList(data.Data);//paging
            }
          });
        },
        /**
         * previousPage
         * @param pageNext
         */
        previousPage: function (pageNext) {

          applicationServiceSet.mentalHealthService._ExpertTeam._GetExpertPage.send([$scope.token,$scope.pageSize,pageNext,$scope.name,$scope.psyOrgID]).then(function (data) {
            if (data.Ret == 0) {
              $scope.viewList = data.Data.ViewModelList;//transformation Data
              $scope.pageIndex.pages = data.Data.Pages;//paging pages
              $scope.pageIndex.pageindexList(data.Data);//paging
            }
          });
        }
      };
    },
    //删除
    delete:function (id) {
      // applicationServiceSet.mentalHealthService._ExpertTeam._DeletePsyOrg.send(undefined,[$scope.token,id]).then(function (data) {
      //   if(data.Ret==0){
      //     toastr.success("删除成功");
      //     ctr._GetExpertPage();
      //   }
      // })
    },
    //获取分页
    _GetExpertPage:function () {
      applicationServiceSet.mentalHealthService._ExpertTeam._GetExpertPage.send([$scope.token,$scope.pageSize,1,$scope.name,$scope.psyOrgID]).then(function (data) {
        if(data.Ret==0){
          $scope.pageIndex.pages = data.Data.Pages;//paging pages
          $scope.pageIndex.pageindexList(data.Data);//paging
          $scope.viewList = data.Data.ViewModelList;
        }
      })
    },
    //获取心理机构
    _GetAllPsyOrgList:function () {
      applicationServiceSet.mentalHealthService._ExpertTeam._GetAllPsyOrgList.send([$scope.token]).then(function (data) {
        if(data.Ret==0){
          // $scope.psyList = data.Data;
          data.Data.forEach(function (e) {
            $scope.psyList.push(e);
          });
        }
      })
    },
    basic:function () {
      $scope.pageSize = 20;
      $scope.name = "";
      $scope.psyOrgID = 0;
      $scope.psyList = [{ID:0,Name:"所有机构"}];
      $scope.search = function () {
        if(!$scope.psyOrgID){
          $scope.psyOrgID = 0;
        }
        ctr._GetExpertPage();
      };
      $scope.del = function (item) {
        ctr.delete(item.ID);
      };
    }
  };
  ctr.init();


}]);
