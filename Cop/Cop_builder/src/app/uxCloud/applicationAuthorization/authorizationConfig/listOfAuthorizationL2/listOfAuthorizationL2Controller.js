/**
 * Created by lqw on 2017/7/21.
 * listOfAuthorizationL2Controller
 * list of organizations
 */
app.controller('listOfAuthorizationL2Contoller', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
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
  var listOfAuthorizationL2 = {
    /**
     * 入口
     */
    init: function () {
      this.variable();//变量声明
      this.serviceApi.pageIndex();//分页服务
      this.operation();//操作
      this.setting.tip();
      this.setting.setCloudList();
    },
    /**
     * 变量声明
     */
    variable: function () {
      $scope.model = {
        keyWord: undefined,
        cloudID:0,
        subAppName:'',
        pSize: 20,
        imgUrl:undefined,
        pIndex: 1,
        itemList:[],
        scopeTypeList:[
          {id:'null',name:'全部'},
          {id:1,name:'区域云'},
          {id:2,name:'合作伙伴'},
          // {id:3,name:'学校'},
          // {id:4,name:'年级'},
          // {id:5,name:'班级'},
          // {id:6,name:'个人'},
        ],
        isScope:true,
        scopeType:'null',
        scopeList:[],   //规则集合
        scopeID:'null',
        keyword:'',
        cnt:50,

      };

    var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
      $scope.model.cloudID = orgModel.CloudID;


    },
    /**
     * 服务集合
     */
    serviceApi: (function () {
      return {
        /**
         * 获取L2分页数据
         */
        GetSubAppConfigForCloud2: function () {
          applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppConfigForCloud2.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.cloudID, $scope.model.scopeType, $scope.model.scopeID,$scope.model.subAppName ,$scope.model.pSize, $scope.model.pIndex]).then(function (data) {
            if (data.Ret == 0) {
              listOfAuthorizationL2.setting.dataChange(data.Data);//类型转换
            }
            else {
              //toastr.error(data.Msg)
            }
          });
        },

        /**
         * 获取L2规则范围
         */
        GetPartnersByKeyWord: function (keyword) {
          applicationServiceSet.themeSkinServiceApi.Authorization.GetPartnersByKeyWord.send([APPMODEL.Storage.getItem('applicationToken'), keyword, $scope.model.cnt, $scope.model.cloudID]).then(function (data) {
            if (data.Ret == 0) {

              var __scopeList = [];
              for (var i = 0; i < data.Data.length; i++) {
                var obj = {};
                obj.id = data.Data[i].ID;
                obj.name = data.Data[i].Name;
                __scopeList.push(obj);
              }
              $scope.model.scopeList = __scopeList;
            }
            else {
              //toastr.error(data.Msg)
            }
          });
        },

        /**
         *获取L2配置应用编辑控制（添加和修改前调用）
         */
        GetSubAppEditGrantForCloud: function (subAppGrantID,operType,func) {
          applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppEditGrantForCloud.send([APPMODEL.Storage.getItem('applicationToken'),subAppGrantID,operType]).then(function (data) {
            if (data.Ret == 0) {
                   func(data.Data);
            }
            else {
              //toastr.error(data.Msg)
            }
          });
        },

        /***
         * 获取区域云****/
        GetCloudList: function () {
          applicationServiceSet.commonService.schoolApi.GetCloudList.send([APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
            if (data.Ret == 0) {
              var __coludlist = [];
              for (var i = 0; i < data.Data.length; i++) {
                var obj = {};
                obj.id = data.Data[i].ID;
                obj.name = data.Data[i].Name;
                __coludlist.push(obj);
              }
              $scope.model.cloudList = __coludlist;
            }
          });
        },
        /**
         * 保存L2配置
         */
        SaveSubAppEditGrantForCloud:function (data,item,func) {
          applicationServiceSet.themeSkinServiceApi.Authorization.SaveSubAppEditGrantForCloud.send([
            data.SubAppGrantID,
            data.SubAppID,
            data.AclType,
            data.ScopeType,
            data.ScopeID,
            data.OpenType,
            data.GTypeList,
            data.RTypeList,
            data.PhaseList,
            data.GrdTypeList,
              data.GTypeIsPub,
              data.RTypeIsPub,
              data.PhaseIsPub,
              data.GrdTypeIsPub
          ],[APPMODEL.Storage.getItem('applicationToken'),data.cloudID ]).then(function (data) {
            if (data.Ret == 0) {

              toastr.success('新增成功');
                 if(func) func();
              $scope.search();
            }
            else {
              //toastr.error(data.Msg);
            }
          });
        },
        /**
         * 移除L2配置
         */
        RemoveSubAppConfigForCloud:function (gid,item) {



            var data = {};
            data.msg = item.EntrTypeName+'-'+item.CatgName+'-'+item.SubAppName;
            data.delet = function () {
                applicationServiceSet.themeSkinServiceApi.Authorization.RemoveSubAppConfigForCloud.send([APPMODEL.Storage.getItem('applicationToken'),gid,$scope.model.cloudID ],[APPMODEL.Storage.getItem('applicationToken'),gid,$scope.model.cloudID ]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success('移除成功');
                        $scope.search();
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


          //推送
          ManualPushSubAppGrantForCloud:function (ids) {
              applicationServiceSet.themeSkinServiceApi.Authorization.ManualPushSubAppGrantForCloud.send([ids], [APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
                  if (data.Ret == 0) {
                      if (data.Ret == 0) toastr.success("推送成功");
                  } else {
                      // toastr.success(data.InfoMsg)
                  }
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
              applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppConfigForCloud2.send([APPMODEL.Storage.getItem('applicationToken'),$scope.model.cloudID, $scope.model.scopeType, $scope.model.scopeID,$scope.model.subAppName, $scope.model.pSize,page.pIndex, 223]).then(function (data) {
                if (data.Ret == 0) {
                  listOfAuthorizationL2.setting.dataChange(data.Data);//类型转换
                }
              });
            },
            /**
             * nextPage
             * @param pageNext
             */
            nextPage: function (pageNext) {
              applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppConfigForCloud2.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.cloudID, $scope.model.scopeType, $scope.model.scopeID,$scope.model.subAppName,$scope.model.pSize,  pageNext, 223]).then(function (data) {
                if (data.Ret == 0) {
                  listOfAuthorizationL2.setting.dataChange(data.Data);//类型转换
                }
              });
            },
            /**
             * previousPage
             * @param pageNext
             */
            previousPage: function (pageNext) {
              applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppConfigForCloud2.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.cloudID, $scope.model.scopeType, $scope.model.scopeID,$scope.model.subAppName,$scope.model.pSize, pageNext, 223]).then(function (data) {
                if (data.Ret == 0) {
                  listOfAuthorizationL2.setting.dataChange(data.Data);//类型转换
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
        listOfAuthorizationL2.serviceApi.GetSubAppConfigForCloud2();//服务集合
      };


        //推送消息
        $scope.pushMessage=function () {
            var ids=[];
            for (var i = 0; i < $scope.model.itemList.length; i++) {
                var ni = $scope.model.itemList[i];
                if (ni.checked) {
                    ids.push(ni.ID);
                }
            }
            listOfAuthorizationL2.serviceApi.ManualPushSubAppGrantForCloud(ids);
        }


        /**
       * refresh service get GetPartnersByKeyWord list
       * @param selectedGid
       */
      $scope.refreshAddresses = function (selectedGid) {
        if (selectedGid) {
          $scope.model.keyWord=selectedGid;
          listOfAuthorizationL2.serviceApi.GetPartnersByKeyWord(selectedGid);//get GetPartnersByKeyWord   pages list
        }
      };

      /***
       * 删除选择的学校
       * **/
      $scope.delChangePartners = function () {
        $scope.model.scopeList = undefined;
        $scope.model.scopeID = undefined;
      };

      /**
       * 改变规则规范类型
       */
      $scope.changeScopeType=function () {
             if($scope.model.scopeType== 2)
               $scope.model.isScope=false;
             else
               $scope.model.isScope=true;
      }

      /*****
       *  add  L2  Config
       * ***********/
      $scope.addOrEdit=function (item,type) {

        listOfAuthorizationL2.serviceApi.GetSubAppEditGrantForCloud(item.ID,type,function (data) {

             item.operType=type;
              $modal.open({
                templateUrl: 'newAddConfigL2Content.html',
                controller: 'newAddConfigL2ContentCtrl',
                keyboard: false,
                backdrop: false,
                resolve: {
                  items: function () {

                    return [item,$scope.model,data];
                  },
                  service: function () {
                    return listOfAuthorizationL2.serviceApi;
                  }
                }

              });


        });
      }

      /********
       *  移除
       * ******/
      $scope.remove=function (item) {
        listOfAuthorizationL2.serviceApi.RemoveSubAppConfigForCloud(item.ID,item);
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
          for (var i in data.ViewModelList) {
            if (data.ViewModelList[i].OpenType == 0) {
              data.ViewModelList[i].OpenTypeName = "暂不配置";
            } else if (data.ViewModelList[i].OpenType == 1) {
              data.ViewModelList[i].OpenTypeName = "开启";
            }else if (data.ViewModelList[i].OpenType == -1) {
              data.ViewModelList[i].OpenTypeName = "禁止";
            }

              if(data.ViewModelList[i].AclType==1){

                  data.ViewModelList[i].bcolor='#f9f9f9';
              }
              else{
                  data.ViewModelList[i].bcolor='#fff';
              }
          }
          $scope.model.itemList = data.ViewModelList;
          $scope.pageIndex.pages = data.Pages;//paging pages
          $scope.pageIndex.pageindexList(data);//paging
        },
        /**
         * 获取教育阶段、云集合、学校基础数据源的接口
         * ***/
        setCloudList: function () {
          listOfAuthorizationL2.serviceApi.GetCloudList();
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
  listOfAuthorizationL2.init();//函数入口
}]);
/**
 * newAddMyModalContentCtrl
 */
app.controller('newAddConfigL2ContentCtrl', ['$scope', '$modalInstance', 'items', 'service', 'applicationServiceSet', function ($scope, $modalInstance, items, service, applicationServiceSet) {
  $scope.newModel = {
    SubAppGrantID:0,
    cloudID:0,
    operType:1, // 1新增  2编辑
    SubAppName:'',
    ID: undefined,
    ScopeTypeList:[],
    ScopeType:undefined,
    ScopeTypeEdit:true,
    ScopeTypeShow:true,
    isScope:true,
    ScopeList:[],
    ScopeID:undefined,
    ScopeEdit:true,
    ScopeShow:true,
    ScopeName:'',
    OpenTypeList:[],
    OpenType:undefined,
    OpenTypeEdit:true,
    OpenTypeShow:true,

    GTypeListAll:[],  //机构类型
    GTypeList:[],
    GTypeListEdit:true,
    GTypeListShow:true,
    RTypeListAll:[],//角色列表
    RTypeList:[],
    RTypeListEdit:true,
    RTypeListShow:true,
    PhaseListAll:[], //教育阶段
    PhaseList:[],
    PhaseListEdit:true,
    PhaseListShow:true,
    GrdTypeListAll:[], //年级段列表
    GrdTypeList:[],
    GrdTypeListEdit:true,
    GrdTypeListShow:true,

      GTypeIsPub:true,
      RTypeIsPub:true,
      PhaseIsPub:true,
      GrdTypeIsPub:true,

    noEdit:true,
    cnt:50,
  };

  var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
  $scope.newModel.cloudID = orgModel.CloudID;


  var newModelServiceApi = {
    /**
     * 获取L2规则范围
     */
    GetPartnersByKeyWord: function (keyword) {
      applicationServiceSet.themeSkinServiceApi.Authorization.GetPartnersByKeyWord.send([APPMODEL.Storage.getItem('applicationToken'), keyword, $scope.newModel.cnt, $scope.newModel.cloudID]).then(function (data) {
        if (data.Ret == 0) {

          var __scopeList = [];
          for (var i = 0; i < data.Data.length; i++) {
            var obj = {};
            obj.id = data.Data[i].ID;
            obj.name = data.Data[i].Name;
            __scopeList.push(obj);
          }
          $scope.newModel.ScopeList = __scopeList;
        }
        else {
          //toastr.error(data.Msg)
        }
      });
    },
  };

  /**
   * 改变规则规范类型
   */
  $scope.changeScopeType=function () {
    if($scope.model.scopeType== 2)
      $scope.newModel.isScope=false;
    else
      $scope.newModel.isScope=true;
  }

  /**
   * refresh service get GetPartnersByKeyWord list
   * @param selectedGid
   */
  $scope.refreshAddresses = function (selectedGid) {
    if (selectedGid) {
      $scope.newModel.keyWord=selectedGid;
      newModelServiceApi.GetPartnersByKeyWord(selectedGid);//get GetPartnersByKeyWord   pages list
    }
  };
  /**
   * 勾选开启的业务
   */
  $scope.addCheckedOne = function (itemList, index) {
    angular.forEach(itemList, function (value, key) {
      if (key == index) {
        if (value.checked) {
          value.checked = false;
        } else {
          value.checked = true;
        }
      }
    });
  };


   //控制label
    $scope.gTypeStyle=function ($event)  {
        var $lb= $($event.target).closest('td').find('label.lb');
        if($scope.newModel.GTypeIsPub){
            $lb.css({color:'#cccccc'});
        }
        else{
            $lb.css({color:'#58666e'});
        }
        $scope.newModel.GTypeIsPub=!$scope.newModel.GTypeIsPub;
    }
    $scope.rTypeStyle=function ($event)  {
        var $lb= $($event.target).closest('td').find('label.lb');
        if($scope.newModel.RTypeIsPub){
            $lb.css({color:'#cccccc'});
        }
        else{
            $lb.css({color:'#58666e'});
        }
        $scope.newModel.RTypeIsPub=!$scope.newModel.RTypeIsPub;
    }
    $scope.phaseListStyle=function ($event)  {
        var $lb= $($event.target).closest('td').find('label.lb');
        if($scope.newModel.PhaseIsPub){
            $lb.css({color:'#cccccc'});
        }
        else{
            $lb.css({color:'#58666e'});
        }
        $scope.newModel.PhaseIsPub=!$scope.newModel.PhaseIsPub;
    }
    $scope.grdTypeStyle=function ($event)  {
        var $lb= $($event.target).closest('td').find('label.lb');
        if($scope.newModel.GrdTypeIsPub){
            $lb.css({color:'#cccccc'});
        }
        else{
            $lb.css({color:'#58666e'});
        }
        $scope.newModel.GrdTypeIsPub=!$scope.newModel.GrdTypeIsPub;
    }

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
    if (items[1]) {
      items[1].isEdit = true;


      $scope.newModel.GTypeList=[];
      for(var i=0; i<$scope.newModel.GTypeListAll.length;i++){
        if($scope.newModel.GTypeListAll[i].checked){
          $scope.newModel.GTypeList.push($scope.newModel.GTypeListAll[i].id)
        }
      }

      $scope.newModel.RTypeList=[];
      for(var i=0; i<$scope.newModel.RTypeListAll.length;i++){
        if($scope.newModel.RTypeListAll[i].checked){
          $scope.newModel.RTypeList.push($scope.newModel.RTypeListAll[i].id)
        }
      }

      $scope.newModel.PhaseList=[];
      for(var i=0; i<$scope.newModel.PhaseListAll.length;i++){
        if($scope.newModel.PhaseListAll[i].checked){
          $scope.newModel.PhaseList.push($scope.newModel.PhaseListAll[i].id)
        }
      }

      $scope.newModel.GrdTypeList=[];
      for(var i=0; i<$scope.newModel.GrdTypeListAll.length;i++){
        if($scope.newModel.GrdTypeListAll[i].checked){
          $scope.newModel.GrdTypeList[$scope.newModel.GrdTypeList.length]=$scope.newModel.GrdTypeListAll[i].id;

        }
      }


      service.SaveSubAppEditGrantForCloud($scope.newModel, items[1], function () {
        $modalInstance.dismiss('cancel');
      });//添加或更新组织信息
    } else {
      items[0].isEdit = false;

      service.SaveSubAppEditGrantForCloud($scope.newModel, items[0], function () {
        $modalInstance.dismiss('cancel');
      });//添加或更新组织信息
    }
  };
  setTimeout(function () {
    $(".modal-content").draggable({containment: "#app", scroll: false});
  }, 100);


  $scope.newModel.operType = items[0].operType;
  if (items[1]) {
    $scope.newModel.scopeTypeList= items[1].scopeTypeList;

    $scope.newModel.disabled = true;
    $scope.newModel.onlyreadInput = true;

  } else {

    $scope.newModel.scopeTypeList= items[1].scopeTypeList;
    $scope.newModel.onlyreadInput = true;
  }

  if(items[2]){
    $scope.newModel.ScopeType=items[2].ScopeType;
    $scope.newModel.ScopeID=items[2].ScopeID;
    $scope.newModel.OpenType=items[2].OpenType;
    $scope.newModel.GTypeList= items[2].GTypeList ?items[2].GTypeList :[];
    $scope.newModel.PhaseList= items[2].PhaseList?items[2].PhaseList:[] ;
    $scope.newModel.RTypeList= items[2].RTypeList?items[2].RTypeList:[] ;
    $scope.newModel.GrdTypeList= items[2].GrdTypeList?items[2].GrdTypeList:[] ;
    $scope.newModel.ID=  items[2].ID ;
    $scope.newModel.ScopeName=  items[2].ScopeName ;
    $scope.newModel.SubAppID=  items[2].SubAppID ;
    $scope.newModel.SubAppName=  items[2].SubAppName ;
    $scope.newModel.SubAppGrantID=  items[2].SubAppGrantID;
    $scope.newModel.GTypeIsPub=items[2].GTypeIsPub;
      $scope.newModel.RTypeIsPub=items[2].RTypeIsPub;
      $scope.newModel.PhaseIsPub=items[2].PhaseIsPub;
      $scope.newModel.GrdTypeIsPub=items[2].GrdTypeIsPub;

    //规则范围类型
    for(var stikey in items[2].UICtrl.ScopeTypeItem.DataSource)
    {
      var _sti=items[2].UICtrl.ScopeTypeItem.DataSource[stikey];
      $scope.newModel.ScopeTypeList.push({id:parseInt(stikey),name:_sti});
    }

    //规则范围类型
    for(var otikey in items[2].UICtrl.OpenTypeItem.DataSource)
    {
      var _oti=items[2].UICtrl.OpenTypeItem.DataSource[otikey];
      $scope.newModel.OpenTypeList.push({id:parseInt(otikey),name:_oti});
    }

    //机构类型
    for (var i=0; i<items[2].UICtrl.GTypeItem.DataSource.length;i++){
      var gti=items[2].UICtrl.GTypeItem.DataSource[i];
       $scope.newModel.GTypeListAll.push({id:gti.ID,name:gti.Name});
    }

    //教育阶段
    for (var i=0; i<items[2].UICtrl.PhaseItem.DataSource.length;i++){
      var gti=items[2].UICtrl.PhaseItem.DataSource[i];
      $scope.newModel.PhaseListAll.push({id:gti.ID,name:gti.Name});
    }

    //角色
    for (var i=0; i<items[2].UICtrl.RTypeItem.DataSource.length;i++) {
      var gti = items[2].UICtrl.RTypeItem.DataSource[i];
      $scope.newModel.RTypeListAll.push({id: gti.ID, name: gti.Name});
          if (items[2].UICtrl.RTypeItem.DataSource[i].Childs) {
              for (var j = 0; j < items[2].UICtrl.RTypeItem.DataSource[i].Childs.length; j++) {
                var cti = items[2].UICtrl.RTypeItem.DataSource[i].Childs[j]
                $scope.newModel.RTypeListAll.push({id: cti.ID, name: cti.Name});
              }
        }
    }

    //	 年级段列表
    for (var i=0; i<items[2].UICtrl.GrdTypeItem.DataSource.length;i++){
      var gti=items[2].UICtrl.GrdTypeItem.DataSource[i];
      $scope.newModel.GrdTypeListAll.push({id:gti.ID,name:gti.Name});
    }

    //规则范围默认值
    if(!items[2].UICtrl.ScopeItem.DataSource)
    {
          $scope.newModel.ScopeList=[{id:$scope.newModel.ScopeID,name:$scope.newModel.ScopeName}] ;
    }
    else{

    }

    switch (items[2].UICtrl.ScopeTypeItem.ControlType)
    {
      case 0:
        $scope.newModel.ScopeTypeEdit = false;
        $scope.newModel.ScopeTypeShow = false;
        break;
      case 1:
        $scope.newModel.ScopeTypeEdit = true;
        $scope.newModel.ScopeTypeShow = true;
        break;
      case 2:
        $scope.newModel.ScopeTypeEdit = false;
        $scope.newModel.ScopeTypeShow = true;
        break;
    }
    switch (items[2].UICtrl.OpenTypeItem.ControlType)
    {
      case 0:
        $scope.newModel.OpenTypeEdit = false;
        $scope.newModel.OpenTypeShow = false;
        break;
      case 1:
        $scope.newModel.OpenTypeEdit = true;
        $scope.newModel.OpenTypeShow = true;
        break;
      case 2:
        $scope.newModel.OpenTypeEdit = false;
        $scope.newModel.OpenTypeShow = true;
        break;
    }
    switch (items[2].UICtrl.GTypeItem.ControlType)
    {
      case 0:
        $scope.newModel.GTypeListEditEdit = false;
        $scope.newModel.GTypeListShow = false;
        break;
      case 1:
        $scope.newModel.GTypeListEditEdit = true;
        $scope.newModel.GTypeListShow = true;
        break;
      case 2:
        $scope.newModel.GTypeListEditEdit = false;
        $scope.newModel.GTypeListShow = true;
        break;
    }
    switch (items[2].UICtrl.PhaseItem.ControlType)
    {
      case 0:
        $scope.newModel.PhaseListEdit = false;
        $scope.newModel.PhaseListShow = false;
        break;
      case 1:
        $scope.newModel.PhaseListEdit = true;
        $scope.newModel.PhaseListShow = true;
        break;
      case 2:
        $scope.newModel.PhaseListEdit = false;
        $scope.newModel.PhaseListShow = true;
        break;
    }

    switch (items[2].UICtrl.RTypeItem.ControlType)
    {
      case 0:
        $scope.newModel.RTypeListEdit = false;
        $scope.newModel.RTypeListShow = false;
        break;
      case 1:
        $scope.newModel.RTypeListEdit = true;
        $scope.newModel.RTypeListShow = true;
        break;
      case 2:
        $scope.newModel.RTypeListEdit = false;
        $scope.newModel.RTypeListShow = true;
        break;
    }

    switch (items[2].UICtrl.GrdTypeItem.ControlType)
    {
      case 0:
        $scope.newModel.GrdTypeListEdit = false;
        $scope.newModel.GrdTypeListShow = false;
        break;
      case 1:
        $scope.newModel.GrdTypeListEdit = true;
        $scope.newModel.GrdTypeListShow = true;
        break;
      case 2:
        $scope.newModel.GrdTypeListEdit = false;
        $scope.newModel.GrdTypeListShow = true;
        break;
    }


    switch (items[2].UICtrl.ScopeItem.ControlType)
    {
      case 0:
        $scope.newModel.ScopeEdit = false;
        $scope.newModel.ScopeShow = false;
        break;
      case 1:
        $scope.newModel.ScopeEdit = true;
        $scope.newModel.ScopeShow = true;
        break;
      case 2:
        $scope.newModel.ScopeEdit = false;
        $scope.newModel.ScopeShow = true;
        break;
    }


    //初始化复选框
    for(var i=0; i<$scope.newModel.GTypeListAll.length;i++){
      for(var j=0 ; j<$scope.newModel.GTypeList.length; j++)
      {
        if($scope.newModel.GTypeListAll[i].id==$scope.newModel.GTypeList[j]){
          $scope.newModel.GTypeListAll[i].checked=true;
        }
      }
    }

    for(var i=0; i<$scope.newModel.RTypeListAll.length;i++){
      for(var j=0 ; j<$scope.newModel.RTypeList.length; j++)
      {
        if($scope.newModel.RTypeListAll[i].id==$scope.newModel.RTypeList[j]){
          $scope.newModel.RTypeListAll[i].checked=true;
        }
      }
    }

    for(var i=0; i<$scope.newModel.PhaseListAll.length;i++){
      for(var j=0 ; j<$scope.newModel.PhaseList.length; j++)
      {
        if($scope.newModel.PhaseListAll[i].id==$scope.newModel.PhaseList[j]){
          $scope.newModel.PhaseListAll[i].checked=true;
        }
      }
    }


    for(var i=0; i<$scope.newModel.GrdTypeListAll.length;i++){
      for(var j=0 ; j<$scope.newModel.GrdTypeList.length; j++)
      {
        if(parseInt($scope.newModel.GrdTypeListAll[i].id) ==parseInt($scope.newModel.GrdTypeList[j])){
          $scope.newModel.GrdTypeListAll[i].checked=true;
        }
      }
    }


  }
}]);

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
