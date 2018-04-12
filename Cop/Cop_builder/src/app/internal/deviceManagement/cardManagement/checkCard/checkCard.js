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
            this.partnerList();
        },
        //合作伙伴下拉选择
        partnerList:function () {
            applicationServiceSet.attendanceService.basicDataControlService.GetOrgList.send([]).then(function (data) {
                if(data.Ret == 0){
                    $scope.model.partnerList = data.Data;
                }
            });
        },
        //模糊查询 根据token获取学校列表
        getSchoolList: function (schoolName) {
            applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), schoolName]).then(function (data) {
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
        //导出模版ExportStuCardList
        ExportStuCardList: function () {
            window.open(urlConfig + "OCS/v3/CardInfo/DownLoadCardTemplate?token=" + APPMODEL.Storage.getItem('copPage_token'), "_parent")
        },
        //导入卡号关系
        upLoad: function (files) {
            // applicationServiceSet.attendanceService.basicDataControlService.ImportCard.fileUpload(files.[]).then(function (data) {
            // })
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
                    controller.GetOrgCardApplyPage($scope.model.size,page.pIndex,$scope.model.partner,$scope.model.school)
                },
                /**
                 * nextPage
                 * @param pageNext
                 */
                nextPage: function (pageNext) {
                    controller.GetOrgCardApplyPage($scope.model.size,pageNext,$scope.model.partner,$scope.model.school)

                },
                /**
                 * previousPage
                 * @param pageNext
                 */
                previousPage: function (pageNext) {
                    controller.GetOrgCardApplyPage($scope.model.size,pageNext,$scope.model.partner,$scope.model.school)

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
            $scope.delModel = undefined;
            $scope.pageIndex = {
                pages:{}
            };
            //
            $scope.changePartner =function () {
                $scope.delModel = $scope.model.partnerList.filter(function (e, i) {
                  return e.OrgID == $scope.model.partner;
              });
            };
            //导入
            $scope.fileUpload = function (files) {
                controller.upLoad(files);
            };
            /*导出*/
            $scope.exportExcel = function () {
                // if (!$scope.model.school) {
                //     toastr.error("请选择一所学校");
                //     return;
                // }
                controller.ExportStuCardList();
            };
            /*查询btn*/
            $scope.search = function () {
               controller.GetOrgCardApplyPage($scope.model.size,$scope.model.pageIndex,$scope.model.partner,$scope.model.school);
            };
            /*学校模糊查询*/
            $scope.deleteSchool = function () {
                $scope.model.school = undefined;
            };
            $scope.changeSchool = function () {
                $scope.schoolName = this.$select.selected.FName;
            };
            $scope.refreshAddresses = function (schoolName) {
                if (schoolName) {
                    $scope.schoolName = schoolName;
                    controller.getSchoolList(schoolName);//get school org pages list
                }
            };
            /*合作伙伴模糊查询*/
            $scope.deleteModelGid = function () {
                $scope.model.partner = undefined;
            };
          //删除申请
            $scope.openDel = function () {

              var modalInstance = $modal.open({
                templateUrl: 'myModalDelCheckCard.html',
                controller: 'myModalDelCheckCardCtrl',
                size: "md",
                resolve: {
                  items: function () {
                    return {
                        orgid:$scope.model.partner,
                        obj:$scope.delModel[0]
                    };
                  }
                }
              });
              modalInstance.result.then(function (selectedItem) {
              }, function (res) {
                if(res == "ok"){
                  controller.GetOrgCardApplyPage($scope.model.size,$scope.model.pageIndex,$scope.model.partner,$scope.model.school);
                }
              });
            };
          //审核申请
            $scope.openCheck = function (x) {

              var modalInstance = $modal.open({
                templateUrl: 'myModalCheckCheckCard.html',
                controller: 'myModalCheckCheckCardCtrl',
                size: "md",
                resolve: {
                  items: function () {
                    return x;
                  }
                }
              });
              modalInstance.result.then(function (selectedItem) {
              }, function (res) {
                if(res == "ok"){
                }
              });
            };

          //打开modal添加号段
          $scope.add = function (list) {
            var modalInstance = $modal.open({
              templateUrl: 'ModalInstanceCtrlCheckInternal.html',
              controller: 'ModalInstanceCtrlCheckInternal',
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
                controller.GetOrgCardApplyPage($scope.model.size,$scope.model.pageIndex,$scope.model.partner,$scope.model.school);
              }
            });
          };
        }
    };
    controller.init();//学生卡号绑定
}]);
//添加modal
app.controller('ModalInstanceCtrlCheckInternal', ['$scope', '$modal', '$modalInstance', 'applicationServiceSet', 'items','toastr', function ($scope, $modal, $modalInstance, applicationServiceSet, items,toastr) {
  $scope.newModel = {
    partner: undefined,
    partnerList: [],
    cardNum: undefined,
    schoolList:[],
    school:"",
    notes:""
  };
  var AddOrgCardApply = function (orgId,gid,cnt,notes) {
      if(!orgId){
          toastr.error("请选择合作伙伴");
          return;
      }
      if(!cnt){
          toastr.error("请填写申请卡号数量");
          return;
      }
    applicationServiceSet.attendanceService.basicDataControlService.AddOrgCardApply.send([orgId,gid,cnt,notes]).then(function (data) {
      if(data.Ret == 0){
        toastr.success("添加成功！");
        $modalInstance.dismiss('ok');

      }
    });
  };
  var getSchoolList = function (schoolName) {
    applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), schoolName]).then(function (data) {
      if (data.Ret == 0) {
        $scope.newModel.schoolList = data.Data;
      }
    });
  }
  //获取合作伙伴列表
  applicationServiceSet.attendanceService.basicDataControlService.GetOrgList.send([]).then(function (data) {
    if(data.Ret == 0){
      $scope.newModel.partnerList = data.Data;
    }
  });
  /*学校模糊查询*/
  $scope.deleteSchoolInModal = function () {
    $scope.model.school = undefined;
  };

  $scope.refreshAddressesInModal = function (schoolName) {
    if (schoolName) {
      getSchoolList(schoolName);
    }
  };
  $scope.ok = function () {
      AddOrgCardApply($scope.newModel.partner,$scope.newModel.school,parseInt($scope.newModel.cardNum),$scope.newModel.notes);
  }
}]);

//审核modal
app.controller('myModalCheckCheckCardCtrl', ['$scope', '$modal', '$modalInstance', 'applicationServiceSet', 'items','toastr', function ($scope, $modal, $modalInstance, applicationServiceSet, items,toastr) {
  $scope.items = items;
  var check = function (id,st) {
    applicationServiceSet.attendanceService.basicDataControlService.CheckOrgCardApply.send(undefined,[id,st]).then(function (data) {
      if(data.Ret == 0){
        toastr.success("审批成功");
        $modalInstance.dismiss('ok');

      }
    })
  };

  $scope.ok = function () {
    check(items.ID,$scope.checkModal.isPass);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  }
}]);
//删除modal
app.controller('myModalDelCheckCardCtrl', ['$scope', '$modal', '$modalInstance', 'applicationServiceSet', 'items','toastr', function ($scope, $modal, $modalInstance, applicationServiceSet, items,toastr) {
  $scope.item = items;
    // $scope.item.sCard = undefined;
    // $scope.item.eCard = undefined;
    var del = function (id) {
    applicationServiceSet.attendanceService.basicDataControlService.DeleteOrgCardApply.send(undefined,[id,$scope.item.sCard,$scope.item.eCard]).then(function (data) {
      if(data.Ret == 0){
        toastr.success("成功删除");
        $modalInstance.dismiss('ok');
      }
    })
  };
    
  $scope.ok = function () {
      console.log($scope.item.sCard,$scope.item.eCard)
      if(!$scope.item.sCard || !$scope.item.eCard){
          toastr.error("请填写卡号");
          return;
      }
    del($scope.item.orgid)
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  }
}]);