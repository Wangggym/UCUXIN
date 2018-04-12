/**
 * Created by fanweihua on 2016/7/10
 * rewrite by lxf 2017/6/8
 * strCodeBindController
 * 老师卡号绑定
 */
app.controller('checkCard', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'applicationServiceSet', 'toastr','$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, applicationServiceSet, toastr,$modal) {
    /**
     * 老师卡号绑定：查询老师绑卡情况，获取机构下的所有班级
     */

    var controller = {
        init: function () {
            this.basic();
            this.pageIndex();
          this.getSchoolList();
        },
      //根据token prgid获取学校列表
      getSchoolList: function () {
        applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
          if (data.Ret == 0) {
            $scope.model.schoolList = data.Data;
          }
        });
      },

        //根据gid，umid获取绑卡审核列表
        GetOrgCardApplyPage: function (size,index,orgid,gid) {
            applicationServiceSet.attendanceService.basicDataControlService.GetOrgCardApplyPage.send([size,index,orgid,gid]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.list = data.Data.ViewModelList;
                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data.Data);//paging
                    $scope.model.pageIndex = data.Data.PageIndex;
                }
            })
        },
        //下载模版ExportStuCardList
        ExportStuCardList: function () {
            window.open(urlConfig + "OCS/v3/CardInfo/DownLoadCardTemplate?token=" + APPMODEL.Storage.getItem('copPage_token'), "_parent")
        },
        //导入学生卡号关系
        upLoad: function (files) {
            applicationServiceSet.attendanceService.basicDataControlService.ImportTeaCardList.fileUpload(files).then(function (data) {
            })
        },
        /**
         * paging function
         */
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
                    controller.GetOrgCardApplyPage($scope.model.size,page.pIndex,APPMODEL.Storage.getItem("orgid"),$scope.model.school)
                },
                /**
                 * nextPage
                 * @param pageNext
                 */
                nextPage: function (pageNext) {
                    controller.GetOrgCardApplyPage($scope.model.size,pageNext,APPMODEL.Storage.getItem("orgid"),$scope.model.school)

                },
                /**
                 * previousPage
                 * @param pageNext
                 */
                previousPage: function (pageNext) {
                    controller.GetOrgCardApplyPage($scope.model.size,pageNext,APPMODEL.Storage.getItem("orgid"),$scope.model.school)

                }
            };
        },
        //基础操作集合
        basic: function () {

            $scope.model = {
                schoolList: [],
                school: undefined,
                class: {
                    ClassID: undefined
                },
                name: undefined,
                checked: false,
                list: [],
                size:20,
                pageIndex:1
            };
            $scope.pageIndex = {
                pages:{}
            };
            //导入
            $scope.fileUpload = function (files) {
                controller.upLoad(files);
            };
            /*导出*/
            $scope.exportExcel = function () {
                controller.ExportStuCardList();
            };

            /*查询btn*/
            $scope.search = function () {
               controller.GetOrgCardApplyPage($scope.model.size,$scope.model.pageIndex,APPMODEL.Storage.getItem("orgid"),$scope.model.school);
            };
            /*学校模糊查询*/
            $scope.deleteSchool = function () {
                $scope.model.school = undefined;
            };
            $scope.changeSchool = function () {

            };
            $scope.refreshAddresses = function (schoolName) {
                if (schoolName) {
                    $scope.schoolName = schoolName;
                    controller.getSchoolList(schoolName);//get school org pages list
                }
            };
          //删除申请
          //   $scope.openDel = function (x) {
          //
          //     var modalInstance = $modal.open({
          //       templateUrl: 'myModalDel.html',
          //       controller: 'delCtrl',
          //       size: "sm",
          //       resolve: {
          //         items: function () {
          //           return x;
          //         }
          //       }
          //     });
          //     modalInstance.result.then(function (selectedItem) {
          //     }, function (res) {
          //       if(res == "ok"){
          //         controller.GetOrgCardApplyPage($scope.model.size,$scope.model.pageIndex,APPMODEL.Storage.getItem("orgid"),$scope.model.school);
          //       }
          //     });
          //   };
          //审核申请
          //   $scope.openCheck = function (x) {
          //
          //     var modalInstance = $modal.open({
          //       templateUrl: 'myModalCheck.html',
          //       controller: 'checkCtrl',
          //       size: "md",
          //       resolve: {
          //         items: function () {
          //           return x;
          //         }
          //       }
          //     });
          //     modalInstance.result.then(function (selectedItem) {
          //     }, function (res) {
          //       if(res == "ok"){
          //       }
          //     });
          //   };
            //导出未使用卡号modal
            $scope.openUnUseCardModal = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'openUnUseCardModal.html',
                    controller: 'openUnUseCardModal',
                    size: "md",
                    resolve: {
                        items: function () {
                            return ;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function (res) {
                    if(res == "ok"){
                        controller.GetOrgCardApplyPage($scope.model.size,$scope.model.pageIndex,APPMODEL.Storage.getItem("orgid"),$scope.model.school);
                    }
                });
            }
          //打开modal添加号段
          $scope.add = function (list) {
            var modalInstance = $modal.open({
              templateUrl: 'myModalContentCheckCardPartner.html',
              controller: 'myModalContentCheckCardPartnerCtrl',
              size: "md",
              resolve: {
                items: function () {
                  return list;
                }
              }
            });
            modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
            }, function (res) {
              if(res == "ok"){
                controller.GetOrgCardApplyPage($scope.model.size,$scope.model.pageIndex,APPMODEL.Storage.getItem("orgid"),$scope.model.school);
              }
            });
          };
        }
    };
    controller.init();//学生卡号绑定
}]);
//添加modal
app.controller('myModalContentCheckCardPartnerCtrl', ['$scope', '$modal', '$modalInstance', 'applicationServiceSet', 'items','toastr', function ($scope, $modal, $modalInstance, applicationServiceSet, items,toastr) {
  $scope.newModel = {

    cardNum: undefined,
    schoolList:[],
    school:"",
    notes:""
  };
    $scope.deleteSelectedGid= function () {
      $scope.newModel.school = undefined;
    };
  var OrgCardApply = function (orgId,gid,cnt,notes) {
    applicationServiceSet.attendanceService.basicDataControlService.OrgCardApply.send([orgId,gid,cnt,notes]).then(function (data) {
      if(data.Ret == 0){
        toastr.success("添加成功！");
        $modalInstance.dismiss('ok');
      }
    });
  };

  //根据token prgid获取学校列表
  getSchoolList();

  function getSchoolList() {
    applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
      if (data.Ret == 0) {
        $scope.newModel.schoolList = data.Data;
      }
    });
  };


  $scope.ok = function () {
      OrgCardApply(APPMODEL.Storage.getItem("orgid"),$scope.newModel.school,parseInt($scope.newModel.cardNum),$scope.newModel.notes);
  }
}]);

//导出modal
app.controller('openUnUseCardModal', ['$scope', '$modal', '$modalInstance', 'applicationServiceSet', 'items','toastr', function ($scope, $modal, $modalInstance, applicationServiceSet, items,toastr) {
  exportUnUseCard = function (num) {
      window.open(urlConfig + "OCS/v3/OrgCard/ExportUnUseCard?token=" + APPMODEL.Storage.getItem('copPage_token') + "&orgid=" + APPMODEL.Storage.getItem("orgid")+"&cnt=" + num, "_parent")
  };
    $scope.newModel = {
        cardNum:undefined
    };

  $scope.ok = function () {
      if(!$scope.newModel.cardNum){
          toastr.error("请填写导出数量");
          return;
      }
      exportUnUseCard($scope.newModel.cardNum)
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  }
}]);
