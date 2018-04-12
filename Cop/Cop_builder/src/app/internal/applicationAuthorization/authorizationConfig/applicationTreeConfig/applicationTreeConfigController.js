/**
 * Created by Administrator on 2017/7/13.
 */
/**
 * Created by lqw on 2017/07/21.
 * applicationTreeConfigController
 * list of organizations
 */
app.controller('applicationTreeConfigController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
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

  var applicationTreeConfig = {
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
          keyWord: undefined,
          cloudID:0,
          pSize: 20,
          imgUrl:undefined,
          pIndex: 1,
          itemListGroups:[],
          itemList:[],
          roleList:[],
          bodyRoleList:[],
          bizDomainList:[{id:0,name:'基础教育'},{id:1,name:'师资培训'},{id:'null',name:'所有领域'}],
          entrTypeList:[
            {id:1,name:'应用首页'},
            {id:2,name:'会话夹应用'},
            {id:3,name:'选项卡应用'},
            {id:4,name:'web端应用'},
            {id:'null',name:'所有入口'},
          ],
          bizDomain:'null',
          entrType:'null',
          rTypeID:0,
          selectedCatgID:0,
          bodyrTypeID:0,

        };
      },
      /**
       * 服务集合
       */
      serviceApi: (function () {
        return {
          /**
           * 获取应用分组
           */
          GetSubAppCatgList: function () {

            applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppCatgList.send([APPMODEL.Storage.getItem('applicationToken'),$scope.model.bizDomain, $scope.model.entrType,  $scope.model.rTypeID ]).then(function (data) {
              if (data.Ret == 0) {
                $scope.model.itemListGroups=data.Data;


                if($scope.model.selectedCatgID==0) {
                    $scope.model.selectedCatgID = data.Data[0].ID;
                    $scope.model.itemListGroups[0].active = 'active';
                }

                for (var i = 0 ; i< $scope.model.itemListGroups.length; i++){
                     if( $scope.model.itemListGroups[i].ID==  $scope.model.selectedCatgID) {
                         $scope.model.itemListGroups[i].active = 'active';
                         break;
                     }
                }

                applicationTreeConfig.serviceApi.GetSubAppList();  //获取应用
              }
            });
          },
          /**
           * 获取应用单个分组
           * ***/
          GetSubAppCatg:function (catid,func) {

            applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppCatg.send([APPMODEL.Storage.getItem('applicationToken'),catid  ]).then(function (data) {
              if (data.Ret == 0) {
                     func(data.Data)
              }
            });
          },
          /**
           * 获取应用
           */
          GetSubAppList: function () {

            applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppList.send([APPMODEL.Storage.getItem('applicationToken'),$scope.model.selectedCatgID,$scope.model.bodyrTypeID ]).then(function (data) {
              if (data.Ret == 0) {
                $scope.model.itemList=data.Data;
              }
            });
          },
          /**
           * 上下架
           */
          SetSubAppOnOffShelf:function (subAppID,isOnShelf) {
            applicationServiceSet.themeSkinServiceApi.Authorization.SetSubAppOnOffShelf.send(
              [APPMODEL.Storage.getItem('applicationToken'),subAppID,isOnShelf],
              [APPMODEL.Storage.getItem('applicationToken'),subAppID,isOnShelf]
            ).then(function (data) {
              if (data.Ret == 0) {
                applicationTreeConfig.serviceApi.GetSubAppList();
              }
            });
          },
          /**
           * 保存应用
           */
          SaveSubAppCatg:function (item,model,func) {
            applicationServiceSet.themeSkinServiceApi.Authorization.SaveSubAppCatg.send(
              [item.ID, item.Name, item.EntrType, item.SNO, item.IsShowName,],
              [APPMODEL.Storage.getItem('applicationToken')]
            ).then(function (data) {
              if (data.Ret == 0) {
                if (model.isEdit) {
                  model.ID=item.ID;
                  model.Name=item.Name;
                  model.EntrType=item.EntrType;
                  model.SNO=item.SNO;
                  model.IsShowName=item.IsShowName;
                }
                else  {
                  var arr = {
                    "ID": item.ID,
                    "Name": item.Name,
                    "EntrType": item.EntrType,
                    "SNO": item.SNO,
                    "IsShowName": item.IsShowName,

                  };
                  $scope.model.itemListGroups.unshift(arr);
                    applicationTreeConfig.serviceApi.GetSubAppCatgList();
                }
                func();
              }
            });
          },

          /**
           * 保存应用分组排序
           */
          SaveSubAppCatgSort:function (ids) {
            applicationServiceSet.themeSkinServiceApi.Authorization.SaveSubAppCatgSort.send(
              [ids],
              [APPMODEL.Storage.getItem('applicationToken'),$scope.model.entrType]
            ).then(function (data) {
              if (data.Ret == 0) {
                applicationTreeConfig.serviceApi.GetSubAppCatgList();
                }

            });
          },

          /**
           * 保存应用排序
           */
          SaveSubAppSort:function (ids) {
            applicationServiceSet.themeSkinServiceApi.Authorization.SaveSubAppSort.send(
              [ids],
              [APPMODEL.Storage.getItem('applicationToken'),$scope.model.selectedCatgID]
            ).then(function (data) {
              if (data.Ret == 0) {
                applicationTreeConfig.serviceApi.GetSubAppList();
              }

            });
          },
          /**
           * 获取应用分页数据
           */
          GetSubAppInit1List: function () {

            applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppInit1List.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.keyWord, $scope.model.type,  $scope.model.pSize, $scope.model.pIndex]).then(function (data) {
              if (data.Ret == 0) {

                applicationTreeConfig.setting.dataChange(data.Data);//类型转换
              }
            });
          },
          /**
           * 根据组织ID获取组织信息
           * @param item
           * @param func
           */
          GetSkinPack: function (item, func) {
            applicationServiceSet.themeSkinServiceApi.Authorization.GetSkinPack.send([APPMODEL.Storage.getItem('copPage_token'), item.ID]).then(function (data) {
              if (data.Ret == 0) {

                func(data.Data);
              }
            });
          },
          /**
           * 添加或更新组织信息
           * @param item
           * @param model
           * @param func
           */
          AddSkinPack: function (item, model, func) {
            applicationServiceSet.themeSkinServiceApi.Authorization.AddSkinPack.send(
              [item.ID,item.No,item.IconSetID,item.ColorID,item.FontID, item.Name, item.Desc, item.PreviewImg, item.AndroidUrl,item.IosUrl],
              [APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
              if (data.Ret == 0) {

                toastr.success("保存成功");
                if (model.isEdit) {
                  model.Name = item.Name;
                  model.Desc=item.Desc;
                  model.PreviewImg = item.PreviewImg
                  model.AndroidUrl= item.AndroidUrl
                  model.IosUrl=item.IosUrl;
                } else {
                  var arr = {
                    "Name": item.Name,
                    "Desc":item.Desc,
                    "PreviewImg":item.PreviewImg,
                    "AndroidUrl": item.AndroidUrl,
                    "IosUrl": item.IosUrl,

                  };


                  $scope.model.itemList.unshift(arr);
                }
                func();
              }
            });
          },
          /**
           * 获取角色列表
           */
          GetRoleTypeTree:function () {
            applicationServiceSet.commonService.schoolApi.GetRoleTypeTree.send([APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
              if (data.Ret == 0) {
                var __roles=[];
                for(var i = 0; i<data.Data.length;i++){
                  var obj={};
                  obj.id=data.Data[i].ID;
                  obj.name=data.Data[i].Name;
                  __roles.push(obj);
                }
                __roles.push({id:0,name:'全部角色'})
                $scope.model.roleList=__roles;
                $scope.model.bodyRoleList=__roles;
              }
            });
          },
            //推送
            ManualPushForSubApp:function (ids) {

                applicationServiceSet.themeSkinServiceApi.Authorization.ManualPushForSubApp.send([ids], [APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
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
                applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.keyWord, $scope.model.type, $scope.model.pSize, page.pIndex,223]).then(function (data) {
                  if (data.Ret == 0) {

                    applicationTreeConfig.setting.dataChange(data.Data);//类型转换
                  }
                });
              },
              /**
               * nextPage
               * @param pageNext
               */
              nextPage: function (pageNext) {
                applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.keyWord, $scope.model.type, $scope.model.pSize, pageNext,223]).then(function (data) {
                  if (data.Ret == 0) {
                    applicationTreeConfig.setting.dataChange(data.Data);//类型转换
                  }
                });
              },
              /**
               * previousPage
               * @param pageNext
               */
              previousPage: function (pageNext) {
                applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.keyWord, $scope.model.type, $scope.model.pSize, pageNext,223 ]).then(function (data) {
                  if (data.Ret == 0) {
                    applicationTreeConfig.setting.dataChange(data.Data);//类型转换
                  }
                });
              }
            };
          },

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
          applicationTreeConfig.serviceApi.GetSubAppCatgList();//应用分组
          applicationTreeConfig.serviceApi.GetRoleTypeTree();//获取角色列表

        };



          //推送消息
          $scope.pushMessage=function () {
              var ids=[];
              for (var i = 0; i < $scope.model.itemList.length; i++) {
                  var ni = $scope.model.itemList[i];
                  if (ni.checked) {
                      ids.push(ni.SubAppID);
                  }
              }
              console.log(ids);
              applicationTreeConfig.serviceApi.ManualPushForSubApp(ids);
          }
        /**
         * 添加或编辑
         * @param item
         */
        $scope.addOrEdit = function (item) {

         $location.url('access/app/internal/authorizationConfig/addApplicationTree?selectedGid='+item.SubAppID+'&SubAppID=' +item.SubAppID);

        };

        /*
        * 上下架
        * */
       $scope.SetSubAppOnOffShelf=function (item,subAppID) {
         var isOnShelf= true;
          if(item.ST==0){  }
          else if(item.ST==1){ isOnShelf =false;}
         if(item.ST==-1){isOnShelf =true;}
            applicationTreeConfig.serviceApi.SetSubAppOnOffShelf(item.SubAppID,isOnShelf);
       }


       //应用分组排序
        settingGroupDrag();
        function settingGroupDrag()
        {
          var fixHelper = function (e, ui) {

            ui.children().each(function () {
              $(this).width($(this).width());     //在拖动时，拖动行的cell（单元格）宽度会发生改变。在这里做了处理就没问题了
            });
            return ui;
          };


          $(function () {
            var ui_help;
            $('#vbox_group').find(" table tbody").sortable({                //这里是talbe tbody，绑定 了sortable
              helper: fixHelper,                  //调用fixHelper
              axis: "y",
              start: function (e, ui) {
                //ui.helper.css({ "background": "#87CEFF" });  //拖动时的行，要用ui.helper
               // ui.helper.addClass('setHover');

                return ui;
              },
              stop: function (e, ui) {
                if($scope.model.entrType=='null'){
                  toastr.error("请先选择入口再进行排序");
                  applicationTreeConfig.serviceApi.GetSubAppCatgList();
                }
                else {
                  var ids=[];

                  $('#vbox_group').find(" table tbody tr").each(function (e) {
                    var id=$(this).find('td:first').attr('gid');
                    ids.push(id);
                  });
                  applicationTreeConfig.serviceApi. SaveSubAppCatgSort(ids);

                }
                return ui;
              }
            }).disableSelection();
          });
        }



        //应用排序
        settingDrag();
        function settingDrag()
        {
          var fixHelper = function (e, ui) {

            ui.children().each(function () {
              $(this).width($(this).width());     //在拖动时，拖动行的cell（单元格）宽度会发生改变。在这里做了处理就没问题了
            });
            return ui;
          };


          $(function () {
            var startSubAppID=0;
            var elemSize = 0;
            var ui_help;
            $('#vbox_application').find(" table tbody").sortable({                //这里是talbe tbody，绑定 了sortable
              helper: fixHelper,                  //调用fixHelper
              axis: "y",
              start: function (e, ui) {
                //ui.helper.css({ "background": "#87CEFF" });  //拖动时的行，要用ui.helper
                // ui.helper.addClass('setHover');

                startSubAppID = $(ui.item[0]).find('td:first').attr('gid');
               // elemSize = $(ui.item[0]).find('td:first').attr('ElemSize');
                return ui;
              },
              stop: function (e, ui) {

                  var ids=[];

                  $('#vbox_application').find(" table tbody tr").each(function (e) {
                    var id=$(this).find('td:first').attr('gid');
                      ids.push(id);
                  });


                  applicationTreeConfig.serviceApi.SaveSubAppSort(ids);



                return ui;
              }
            }).disableSelection();
          });
        }

        /**
         * 改变分组的查询条件
         * **/
        $scope.changeGroup=function () {
          applicationTreeConfig.serviceApi.GetSubAppCatgList();
        }



        /**
         * 添加应用分组
         * **/
        $scope.addGroup=function () {
          $modal.open({
            templateUrl: 'addGroupType.html',
            controller: 'newAddGroupMyModalContentCtrl',
            keyboard: false,
            backdrop: false,
            resolve: {
              items: function () {
                return [$scope.model];
              },
              service: function () {
                return applicationTreeConfig.serviceApi;
              }
            }
          });
        }

        /**
         * 修改应用分组
         * **/
        $scope.editGroup=function (item) {
          if (item) {
            applicationTreeConfig.serviceApi.GetSubAppCatg(item.ID, function (data) {
              $modal.open({
                templateUrl: 'addGroupType.html',
                controller: 'newAddGroupMyModalContentCtrl',
                keyboard: false,
                backdrop: false,
                resolve: {
                  items: function () {
                    return [data, item, $scope.model];
                  },
                  service: function () {
                    return applicationTreeConfig.serviceApi;
                  }
                }
              });
            });//根据组织ID获取组织信息
          }
        }

        //应用分组点击事件
        $scope.clickType=function (itemlist,item,ctID) {
          for(var i=0; i<itemlist.length;i++){
            itemlist[i].active='';
          }
          item.active='active';
          $scope.model.selectedCatgID=ctID;

          applicationTreeConfig.serviceApi.GetSubAppList();
        }

        //查找应用分组
        $scope.changeGroupSearch=function(){

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
              for (var s in $scope.model.typeList) {
                if ($scope.model.typeList[s].id == data.ViewModelList[i].OrgType) {
                  data.ViewModelList[i].typeName = $scope.model.typeList[s].name;
                  break;
                }
              }

            }
            $scope.model.itemList = data.ViewModelList;
            $scope.pageIndex.pages = data.Pages;//paging pages
            $scope.pageIndex.pageindexList(data);//paging
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
  applicationTreeConfig.init();//函数入口
}]);
/**
 * newAddMyModalContentCtrl
 */
app.controller('newAddGroupMyModalContentCtrl', ['$scope', '$modalInstance', 'items', 'service','applicationServiceSet', function ($scope, $modalInstance, items, service,applicationServiceSet) {
  $scope.groupModel = {
    ID: undefined,
    Name:'',
    EntrType:1,
    SNO:0,
    IsShowName:true,
    EntrTypeName:'',
  };

  if(items[1]){
      $scope.groupModel.ID=items[0].ID;
      $scope.groupModel.IsShowName=items[0].IsShowName;
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
  $scope.groupSsave = function () {
    if (items[1]) {
      items[1].isEdit = true;

      service.SaveSubAppCatg($scope.groupModel, items[1], function () {
        $modalInstance.dismiss('cancel');
      });//添加或更新组织信息
    } else {
      items[0].isEdit = false;

      service.SaveSubAppCatg($scope.groupModel, items[0], function () {
        $modalInstance.dismiss('cancel');
      });//添加或更新组织信息
    }
    // applicationTreeConfig.serviceApi.GetSubAppInit1List();//服务集合
  };
  setTimeout(function () {
    $(".modal-content").draggable({ containment: "#app", scroll: false });
  }, 100);
  if (items[1]) {

    $scope.groupModel.entrTypeList = items[2].entrTypeList;
    $scope.groupModel.EntrType  = items[0].EntrType;
    $scope.groupModel.Name=items[0].Name;
    $scope.groupModel.disabled = true;
    $scope.groupModel.onlyreadInput=true;

  } else {

    $scope.groupModel.entrTypeList = items[0].entrTypeList;
    $scope.groupModel.onlyreadInput=true;
  }
  var _etlist=[];
  for (var i = 0 ; i< $scope.groupModel.entrTypeList.length;i++){
      if($scope.groupModel.entrTypeList[i].id!='null') _etlist.push($scope.groupModel.entrTypeList[i]);
  }
  $scope.groupModel.entrTypeList=_etlist;
}]);
