/**
 * Created by Administrator on 2017/8/9.
 */
/**
 * Created by lqw on 2017/8/202
 * listOfCloudRegion
 * list of organizations
 */
app.controller('listOfCloudRegionContoller', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * 组织机构列表
     * @type {{init: init, variable: variable, serviceApi, operation: operation, setting}}
     */
    // --- 表格全选功能 开始 --------------------------------------------------
    $scope.selectedList = [];
    $scope.checkedAll = false;
    $scope.checkAll = function () {
        $scope.selectedList = [];
        angular.forEach($scope.model.itemList, function (item) {
            if ($scope.checkedAll) {
                item.checked = true;
                $scope.selectedList.push(item.ID);
            } else {
                item.checked = false;
            }
        });
    };
    $scope.checkedSingle = function (checked, id) {
        if (checked) {
            $scope.selectedList.push(id);
            if ($scope.selectedList.length === $scope.model.itemList.length) {
                $scope.checkedAll = true;
            }
        } else {
            $scope.checkedAll = false;
            $scope.selectedList.splice($scope.selectedList.indexOf(id), 1);
        }
    };
    // --- 表格全选功能 结束 --------------------------------------------------
    var listOfCloudRegion = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.serviceApi.pageIndex();//分页服务
            this.operation();//操作
            this.setting.tip();
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {

            };
        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * 获取组织分页数据
                 */
                GetCloudList: function () {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.GetCloudList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {
                             listOfCloudRegion.setting.dataChange(data.Data);//类型转换
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                //添加区域云
                AddCloud:function (data,callBack) {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.AddCloud.send([
                        data.Code,data.Name,data.Desc,data.UXUri,data.CopyRight,data.iOSPackName,data.AndroidPackName,data.WebUrl
                    ],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {

                            if(callBack)callBack();
                            $scope.search();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                //修改区域云
                UpdateCloud:function (data,callBack) {
                    applicationServiceSet.couldRegionServiceApi.couldRegion.UpdateCloud.send([
                        data.ID,data.Code,data.Name,data.Desc,data.UXUri,data.CopyRight,data.iOSPackName,data.AndroidPackName,data.WebUrl
                    ],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                        if (data.Ret == 0) {

                            if(callBack)callBack();
                            $scope.search();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                DeleteCloud:function (dataT,callBack) {

                    var data = {};
                    data.msg = dataT.Name;
                    data.delet = function () {

                        applicationServiceSet.couldRegionServiceApi.couldRegion.DeleteCloud.send([
                            dataT.ID
                        ],[APPMODEL.Storage.getItem('copPage_token'), dataT.ID]).then(function (data) {

                            if (data.Ret == 0) {

                                if(callBack)callBack();
                                $scope.search();
                            }
                            else {
                                // toastr.error(data.Msg)
                            }
                        });
                    };
                    var modalInstance = $modal.open({
                        templateUrl: 'pushMsgDetail.html',
                        controller: 'ModalPushMsgDetailCtrl',
                        size: 'sm',
                        resolve: {
                            items: function () {
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (data) {
                        $scope.data = data;
                    }, function () {
                        // console.log('Modal dismissed at: ' + new Date());
                    });

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
                            applicationServiceSet.couldRegionServiceApi.couldRegion.GetCloudList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                                if (data.Ret == 0) {

                                    listOfCloudRegion.setting.dataChange(data.Data);//类型转换
                                }
                                else {
                                    // toastr.error(data.Msg)
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.couldRegionServiceApi.couldRegion.GetCloudList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                                if (data.Ret == 0) {

                                    listOfCloudRegion.setting.dataChange(data.Data);//类型转换
                                }
                                else {
                                    // toastr.error(data.Msg)
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.couldRegionServiceApi.couldRegion.GetCloudList.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                                if (data.Ret == 0) {

                                    listOfCloudRegion.setting.dataChange(data.Data);//类型转换
                                }
                                else {
                                    // toastr.error(data.Msg)
                                }
                            });
                        }
                    };
                }
            };
        })(),
        /**
         * 操作
         */
        operation: function () {
            /**
             * 查询
             */
            $scope.search = function () {
                listOfCloudRegion.serviceApi.GetCloudList();//服务集合
            };

            //设置管理员
            $scope.setAdmin=function (item) {
                $modal.open({
                    templateUrl: 'newAddMangeUsers.html',
                    controller: 'newAddMangeUsersCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [item];
                        },
                        service: function () {
                            return listOfCloudRegion.serviceApi;
                        }
                    }
                });
            }


            //添加区域云
            $scope.add=function () {
                $modal.open({
                    templateUrl: 'newAddCloudContent.html',
                    controller: 'newAddCloudRegionContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [{isEdit:false}];
                        },
                        service: function () {
                            return listOfCloudRegion.serviceApi;
                        }
                    }
                });
            }

            //添加区域云
            $scope.edit=function (item) {
                item.isEdit=true;
                $modal.open({
                    templateUrl: 'newAddCloudContent.html',
                    controller: 'newAddCloudRegionContentCtrl',
                    keyboard: false,
                    backdrop: false,
                    resolve: {
                        items: function () {
                            return [item];
                        },
                        service: function () {
                            return listOfCloudRegion.serviceApi;
                        }
                    }
                });
            }

            /********
             *  移除区域云
             * ******/
            $scope.remove=function (item) {
                listOfCloudRegion.serviceApi.DeleteCloud(item);
            }

             $scope.search();//查询
        },



        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 类型转换
                 * @param data
                 */
                dataChange: function (data) {
                    var data={ViewModelList:data,Pages:20000000};
                    $scope.model.itemList = data.ViewModelList;
                    $scope.pageIndex.pages = data.Pages;//paging pages
                   // $scope.pageIndex.pageindexList(data);//paging
                },

                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                },
            };
        })()
    };
    listOfCloudRegion.init();//函数入口
}]);
/**
 * newAddCloudRegionContentCtrl
 */
app.controller('newAddCloudRegionContentCtrl', ['$scope', '$modalInstance', 'items', 'service', 'applicationServiceSet', function ($scope, $modalInstance, items, service, applicationServiceSet) {
    $scope.newModel = {
        ID: undefined,
        Code:undefined,
        Name:undefined,
        Desc:undefined,
        UXUri:undefined,
        CopyRight:undefined,
        iOSPackName:undefined,
        AndroidPackName:undefined,
        WebUrl:undefined,
        CreateDate:undefined,
        CreateUID:undefined,
        title:'',
        isEdit:false,
    };


    $scope.newModel.isEdit=items[0].isEdit;
    if($scope.newModel.isEdit){
        $scope.newModel.title='编辑区域云';
        $scope.newModel.ID= items[0].ID;
        $scope.newModel.Code= items[0].Code;
        $scope.newModel.Name= items[0].Name;
        $scope.newModel.Desc= items[0].Desc;
        $scope.newModel.UXUri= items[0].UXUri;
        $scope.newModel.CopyRight= items[0].CopyRight;
        $scope.newModel.iOSPackName= items[0].iOSPackName;
        $scope.newModel.AndroidPackName= items[0].AndroidPackName;
        $scope.newModel.WebUrl= items[0].WebUrl;
        $scope.newModel.CreateDate= items[0].CreateDate;
    }
    else{
        $scope.newModel.title='添加区域云';
    }



    var newModelServiceApi = {

    };
    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    /**
     * save
     */
    $scope.save = function () {
        if (!$scope.newModel.isEdit) {
            service.AddCloud($scope.newModel, function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
       }
       else{

            service.UpdateCloud($scope.newModel, function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        }
    };
    setTimeout(function () {
        $(".modal-content").draggable({containment: "#app", scroll: false});
    }, 100);

}]);
/**
 * newAddMangeUsersCtrl
 */
app.controller('newAddMangeUsersCtrl', ['$scope', '$modalInstance', 'items', 'service','toastr', 'applicationServiceSet', function ($scope, $modalInstance, items, service, toastr,applicationServiceSet) {
      $scope.adModel={
            admins:[],
            cloudID:undefined,
            telList:[],
            uid:undefined,
            uName:undefined,
      }
      $scope.adModel.cloudID=items[0].ID;

      //api
      var adServiceApi={

          //根据手机号获取用户
          GetUserByTel: function (tel) {
              applicationServiceSet.couldRegionServiceApi.couldRegion.GetUserByTel.send([APPMODEL.Storage.getItem('copPage_token'),tel]).then(function (data) {

                  if (data.Ret == 0) {
                      if(data.Data) {
                          $scope.adModel.telList = [{
                              id: data.Data.UID,
                              name: data.Data.Name + '(' + data.Data.Tel + ')'
                          }];
                          $scope.adModel.uid = data.Data.UID;
                          $scope.adModel.uName = data.Data.Name;
                      }
                  }
                  else {
                      // toastr.error(data.Msg)
                  }
              });
          },

          //管理员列表
          GetOrgAdminByOrgID: function ( ) {
              applicationServiceSet.internalServiceApi.userManagement.GetOrgAdmin.send([APPMODEL.Storage.getItem('copPage_token'), $scope.adModel.cloudID,2]).then(function (data) {
                  if (data.Ret == 0) {
                      if(data.Data) {
                          $scope.adModel.admins=[];
                          for(var i=0 ; i<data.Data.length;i++)
                              $scope.adModel.admins.push(data.Data[i]);
                      }
                  }
              });
          },
          //根据手机号获取用户
          AddOrgAdmin: function (tel) {
              applicationServiceSet.couldRegionServiceApi.couldRegion.AddOrgAdmin.send([{ID:$scope.adModel.cloudID},{UID:$scope.adModel.uid}],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                  if (data.Ret == 0) {

                      if(data.Data ) {
                         $scope.adModel.admins.push(data.Data);
                      }
                  }
                  else {
                      // toastr.error(data.Msg)
                  }
              });
          },
          //移除管理员
          DeleteOrgAdmin:function (item,func) {
              applicationServiceSet.couldRegionServiceApi.couldRegion.DeleteOrgAdmin.send( [],[APPMODEL.Storage.getItem('copPage_token'),item.ID]).then(function (data) {

                  if (data.Ret == 0) {
                      if(func)func();

                  }
                  else {
                      // toastr.error(data.Msg)
                  }
              });
          }
      }

      adServiceApi.GetOrgAdminByOrgID();

    /**
     * refresh service get getOrgSchoolPage list
     * @param selectedGid
     */
    $scope.refreshTelresses = function (tel) {

            // $scope.model.keyWord=selectedGid;
            adServiceApi.GetUserByTel(tel);//get getOrgSchoolPage   pages list

    };

    //添加
    $scope.add=function () {
        if($scope.adModel.uid ) {
            adServiceApi.AddOrgAdmin();
        }
        else{
            toastr.error('请先根据手机号查找用户，然后再添加管理员');
        }
    }
    
    $scope.remove=function (item) {
        adServiceApi.DeleteOrgAdmin(item,function () {
            adServiceApi.GetOrgAdminByOrgID();
        });
    }
    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

//确定删除
app.controller('ModalPushMsgDetailCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.msgDetail = items.msg;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.cancelDelet = function () {
        items.delet();
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('showImgCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.msgDetail = items;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);