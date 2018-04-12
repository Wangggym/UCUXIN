/**
 * Created by lqw on 2017/7/21.
 * listOfAuthorizationL3Contoller
 * list of organizations
 */
app.controller('listOfAuthorizationL3Contoller', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
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

  var listOfAuthorizationL3 = {
      /**
       * 入口
       */
      init: function () {
        this.variable();//变量声明

          this.setting.setCloudList();
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
          subAppName:'',
          pSize: 20,
          imgUrl:undefined,
          pIndex: 1,
          itemList:[],
          scopeTypeList:[
            {id:'null',name:'全部'},
             {id:1,name:'区域云'},
            {id:2,name:'合作伙伴'},
            {id:3,name:'学校'},
            {id:4,name:'年级'},
            {id:5,name:'班级'},
            {id:6,name:'个人'},
          ],

          scopeType:'null',


          scopeList:[],   //规则集合
          scopeID:undefined,
          isScope:true,
          isScopeShow:true,

          schoolList:[], //school list
          schoolID:undefined,
          isSchool:true,
          isSchoolShow:false,

          gradeList:[], //grade list
          gradeID:undefined,
          isGrade:true,
          isGradeShow:false,


          gradeClass:[], //class list
          classID:undefined,
          isClass:true,
          isClassShow:false,

          telList:[],
          tel:'', //手机号
          temNum:'',
          isTel:true,
          isTelShow:false,



          keyword:'',
          cnt:50,
          ptnID:0, //合作伙伴ID
        };

        var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
        $scope.model.cloudID = orgModel.CloudID;
        $scope.model.ptnID= orgModel.OrgID;


      },
      /**
       * 服务集合
       */
      serviceApi: (function () {
        return {
          /**
           * 获取L2分页数据
           */
          GetSubAppConfigForCloud3: function () {

            applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppConfigForPartner.send([APPMODEL.Storage.getItem('applicationToken'),$scope.model.cloudID, $scope.model.ptnID, $scope.model.scopeType, $scope.model.scopeID,$scope.model.subAppName ,$scope.model.pSize, $scope.model.pIndex]).then(function (data) {
              if (data.Ret == 0) {

                listOfAuthorizationL3.setting.dataChange(data.Data);//类型转换
              }
              else {
               // toastr.error(data.Msg)
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
               // toastr.error(data.Msg)
              }
            });
          },

          /**
           *获取L3配置应用编辑控制（添加和修改前调用）
           */
          GetSubAppEditGrantForPartner: function (subAppGrantID,operType,scopeType,func) {

            applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppEditGrantForPartner.send([APPMODEL.Storage.getItem('applicationToken'),subAppGrantID,operType,$scope.model.ptnID, scopeType]).then(function (data) {
              if (data.Ret == 0) {
                func(data.Data);
              }
              else {
               // toastr.error(data.Msg)
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
                console.log(data);
                $scope.model.cloudID=__coludlist[0].id;
                $scope.model.cloudList = __coludlist;
              }
            });
          },
          /**
           * 保存L3配置
           */
          SaveSubAppEditGrantForCloud:function (data,item,func) {
            if(!data.scopeID)data.scopeID = 0;
            applicationServiceSet.themeSkinServiceApi.Authorization.SaveSubAppEditGrantForPartner.send([
              data.SubAppGrantID,
              data.SubAppID,
              data.AclType,
              data.ScopeType,
              data.scopeID,
              data.OpenType,
              data.GTypeList,
              data.RTypeList,
              data.PhaseList,
              data.GrdTypeList,
              data.GTypeIsPub,
                data.RTypeIsPub,
                data.PhaseIsPub,
                data.GrdTypeIsPub
            ],[APPMODEL.Storage.getItem('applicationToken'), $scope.model.cloudID ,$scope.model.ptnID]).then(function (data) {
              if (data.Ret == 0) {

                toastr.success('新增成功');
                listOfAuthorizationL3.serviceApi.GetSubAppConfigForCloud3();
                if(func) func();
              }
              else {
                //toastr.error(data.Msg);
              }
            });
          },
          /**
           * 保存L3配置
           */
          RemoveSubAppConfigForCloud:function (gid,item) {


              var data = {};
              data.msg = item.EntrTypeName+'-'+item.CatgName+'-'+item.SubAppName;
              data.delet = function () {
                  applicationServiceSet.themeSkinServiceApi.Authorization.RemoveSubAppConfigForPartner.send([APPMODEL.Storage.getItem('applicationToken'),gid, $scope.model.cloudID ,$scope.model.ptnID ],[APPMODEL.Storage.getItem('applicationToken'),gid, $scope.model.cloudID,$scope.model.ptnID]).then(function (data) {
                      if (data.Ret == 0) {
                          toastr.success('移除成功');
                          $scope.search();

                      }
                      else {
                          //  toastr.error(data.Msg);
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
           * get school org pages list
           * @param selectedGid
           */
          getOrgSchoolPage: function (selectedGid) {
            applicationServiceSet.commonService.schoolApi.GetCompanysByKeyWord.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid, $scope.model.cloudID, $scope.model.ptnID]).then(function (data) {
              if (data.Ret == 0) {
                $scope.model.schoolList = data.Data;
              }
            });
          },


          /**
           * get Grade org pages list
           */
          GetSchGrades:function () {
            applicationServiceSet.commonService.schoolApi.GetSchGrades.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.schoolID, ]).then(function (data) {
              if (data.Ret == 0) {
                $scope.model.gradeList = data.Data;
              }
            });
          },
          /**
           * get Grade org pages list
           */
          GetSchClasses:function () {
            applicationServiceSet.commonService.schoolApi.GetSchClassesByKey.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.schoolID,'',50 ]).then(function (data) {
              if (data.Ret == 0) {
                $scope.model.classList = data.Data;
              }
            });
          },
          /**
           * get Grade org pages list
           */
          GetUserByTel:function (tel) {
            applicationServiceSet.commonService.schoolApi.GetUserByTel.send([APPMODEL.Storage.getItem('applicationToken'),  tel, ]).then(function (data) {
              if (data.Ret == 0) {
                 //$scope.model.telList=[].push({data.Data.});
                $scope.model.telNum=data.Data.Name+'('+data.Data.Tel+')';
                $scope.model.tel=data.Data.UID;
                $scope.model.scopeID=data.Data.UID;
              }
            });
          },


            //推送
            ManualPushSubAppGrantForPartner:function (ids) {
                applicationServiceSet.themeSkinServiceApi.Authorization.ManualPushSubAppGrantForPartner.send([ids], [APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
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
                applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppConfigForPartner.send([APPMODEL.Storage.getItem('applicationToken'),$scope.model.cloudID, $scope.model.ptnID, $scope.model.scopeType, $scope.model.scopeID,$scope.model.subAppName , $scope.model.pSize,page.pIndex, 223]).then(function (data) {
                  if (data.Ret == 0) {

                    listOfAuthorizationL3.setting.dataChange(data.Data);//类型转换
                  }
                });
              },
              /**
               * nextPage
               * @param pageNext
               */
              nextPage: function (pageNext) {
                applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppConfigForPartner.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.cloudID, $scope.model.ptnID, $scope.model.scopeType, $scope.model.scopeID,$scope.model.subAppName ,$scope.model.pSize,  pageNext, 223]).then(function (data) {
                  if (data.Ret == 0) {
                    listOfAuthorizationL3.setting.dataChange(data.Data);//类型转换
                  }
                });
              },
              /**
               * previousPage
               * @param pageNext
               */
              previousPage: function (pageNext) {
                applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppConfigForPartner.send([APPMODEL.Storage.getItem('applicationToken'),$scope.model.cloudID, $scope.model.ptnID, $scope.model.scopeType, $scope.model.scopeID,$scope.model.subAppName ,$scope.model.pSize, pageNext, 223]).then(function (data) {
                  if (data.Ret == 0) {
                    listOfAuthorizationL3.setting.dataChange(data.Data);//类型转换
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


          if($scope.model.scopeType== 3||$scope.model.scopeType== 4||$scope.model.scopeType== 5||$scope.model.scopeType== 6) {
            if(!$scope.model.scopeID&&$scope.model.scopeID<=0){
              //学校
              if ($scope.model.scopeType == 3) {

              }
              //年级
              else if ($scope.model.scopeType == 4) {
              }
              //班级
              else if ($scope.model.scopeType == 5) {
              }
              //个人
              else if ($scope.model.scopeType == 6) {
              }
              else {
              }
            }

          }

             listOfAuthorizationL3.serviceApi.GetSubAppConfigForCloud3();//服务集合
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
              listOfAuthorizationL3.serviceApi.ManualPushSubAppGrantForPartner(ids);
          }


          /**
         * refresh service get getOrgSchoolPage list
         * @param selectedGid
         */
        $scope.refreshAddresses = function (selectedGid) {
          if (selectedGid) {
           // $scope.model.keyWord=selectedGid;
            listOfAuthorizationL3.serviceApi.getOrgSchoolPage(selectedGid);//get getOrgSchoolPage   pages list
          }
        };

        /***
         * 删除选择的学校
         * **/
        $scope.delChangeSchool = function () {
          $scope.model.schoolList = undefined;
          $scope.model.schoolID = undefined;

          $scope.model.gradeList=[];
          $scope.model.gradeID=undefined;

          $scope.model.classID=undefined;
          $scope.model.classList=[];

          $scope.model.scopeID=undefined;
        };


        /**
         * 补全手机号码
         * */
        $scope.setTel=function (tel) {
          if(tel && tel.length==11) {
            listOfAuthorizationL3.serviceApi.GetUserByTel(tel);
          }
          else {
            $scope.model.tel=undefined;
            $scope.model.scopeID=undefined;
          }
        }


        /**
         * 删除补全手机号码
         * */
        $scope.delTel=function () {
             $scope.model.tel=undefined;
             $scope.model.schoolID=undefined;
        }



        /******
         *  选择规则类型
         * *****/
        $scope.changeScopeType=function () {
            if($scope.model.scopeType== 4) {
                listOfAuthorizationL3.serviceApi.GetSchClasses();
                 listOfAuthorizationL3.serviceApi.GetSchGrades();

            }
            else  if($scope.model.scopeType== 5) {
                listOfAuthorizationL3.serviceApi.GetSchGrades();
                listOfAuthorizationL3.serviceApi.GetSchGrades();
            }
        }

        /***
         * 选择的学校
         * **/
        $scope.changeSchool = function () {

          if ($scope.model.scopeType== 3){
              $scope.model.scopeID=$scope.model.schoolID;
          }


         else  if($scope.model.scopeType== 4) {
              listOfAuthorizationL3.serviceApi.GetSchClasses();
              listOfAuthorizationL3.serviceApi.GetSchGrades();
              $scope.model.gradeID =undefined;
              $scope.model.classID =undefined;
              $scope.model.scopeID= undefined;
          }
          else  if($scope.model.scopeType== 5) {
               listOfAuthorizationL3.serviceApi.GetSchClasses();
              listOfAuthorizationL3.serviceApi.GetSchGrades();
              $scope.model.classID =undefined;
              $scope.model.gradeID =undefined;
              $scope.model.scopeID= undefined;
          }

           // $scope.model.scopeID=$scope.model.schoolID;
        };

        /***
         *  修改参数值
         * **/
        $scope.changeScopeParmas=function (id) {
             $scope.model.scopeID=id;
        }


        /**
         * 改变规则规范类型
         */
        $scope.changeScopeType=function () {

          //学校
          if($scope.model.scopeType== 3) {
            $scope.model.isSchoolShow=true;
            $scope.model.isGradeShow=false;
            $scope.model.isClassShow=false;
            $scope.model.isTelShow=false;
          }
          //年级
          else if($scope.model.scopeType== 4){
            $scope.model.isSchoolShow=true;
            $scope.model.isGradeShow=true;
            $scope.model.isClassShow=false;
            $scope.model.isTelShow=false;
          }
          //班级
          else if($scope.model.scopeType== 5){
            $scope.model.isSchoolShow=true;
            $scope.model.isGradeShow=false;
            $scope.model.isClassShow=true;
            $scope.model.isTelShow=false;
          }
          //个人
          else if($scope.model.scopeType== 6){
            $scope.model.isSchoolShow=false;
            $scope.model.isGradeShow=false;
            $scope.model.isClassShow=false;
            $scope.model.isTelShow=true;
          }
          else {
            $scope.model.isSchoolShow=false;
            $scope.model.isGradeShow=false;
            $scope.model.isClassShow=false;
            $scope.model.isTelShow=false;
          }


            $scope.model.schoolList = undefined;
            $scope.model.schoolID = undefined;

            $scope.model.gradeList=[];
            $scope.model.gradeID=undefined;

            $scope.model.classID=undefined;
            $scope.model.classList=[];

            $scope.model.telNum='';


            $scope.model.scopeID=undefined;
        }





        /*****
         *  add  L2  Config
         * ***********/
        $scope.addOrEdit=function (item,type,scopeType) {

          if(type==2)scopeType = $scope.model.scopeType;

          listOfAuthorizationL3.serviceApi.GetSubAppEditGrantForPartner(item.ID,type,scopeType,function (data) {

            item.operType=type;
            $modal.open({
              templateUrl: 'newAddConfigL3Content.html',
              controller: 'newAddConfigL3ContentCtrl',
              keyboard: false,
              backdrop: false,
              resolve: {
                items: function () {

                  return [item,$scope.model,data];
                },
                service: function () {
                  return listOfAuthorizationL3.serviceApi;
                }
              }

            });


          });
        }

        /********
         *  移除
         * ******/
        $scope.remove=function (item) {
          listOfAuthorizationL3.serviceApi.RemoveSubAppConfigForCloud(item.ID,item);
        }

            setTimeout(function () {
                listOfAuthorizationL3.serviceApi.GetSubAppConfigForCloud3();//服务集合
            },700);


       // $scope.search();//查询
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
            listOfAuthorizationL3.serviceApi.GetCloudList();
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
  listOfAuthorizationL3.init();//函数入口
}]);
/**
 * newAddMyModalContentCtrl
 */
app.controller('newAddConfigL3ContentCtrl', ['$scope', '$modalInstance', 'items', 'service','toastr', 'applicationServiceSet', function ($scope, $modalInstance, items, service,toastr, applicationServiceSet) {
  $scope.newModel = {
    SubAppGrantID:0,
    cloudID:0,
    operType:1, // 1新增  2编辑
    SubAppName:'',
    ID: undefined,
   // ScopeTypeList:[],
      ScopeTypeList:[
          {id:'null',name:'全部'},
          // {id:1,name:'区域云'},
            {id:2,name:'合作伙伴'},
          {id:3,name:'学校'},
          {id:4,name:'年级'},
          {id:5,name:'班级'},
          {id:6,name:'个人'},
      ],
    ScopeType:undefined,
    ScopeTypeEdit:true,
    ScopeTypeShow:true,

    ScopeList:[],
    scopeID:undefined,
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


      schoolList:[], //school list
      schoolID:undefined,
      isSchool:true,
      isSchoolShow:false,

      gradeList:[], //grade list
      gradeID:undefined,
      isGrade:true,
      isGradeShow:false,


      gradeClass:[], //class list
      classID:undefined,
      isClass:true,
      isClassShow:false,

      telList:[],
      tel:'', //手机号
      temNum:'',
      isTel:true,
      isTelShow:false,

      ScopeTypeName:'',
      ScopeTypeMameShow:true,

      defaultScopeID:0,

        noEdit:true,

       isEdit:false,
    cnt:50,



      GTypeIsPub:true,
      RTypeIsPub:true,
      PhaseIsPub:true,
      GrdTypeIsPub:true,
  };

  var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));

  $scope.newModel.cloudID = items[1].cloudID;
    $scope.newModel.ptnID= orgModel.OrgID;
    $scope.newModel.ScopeTypeMame= orgModel.OrgName;


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
         // toastr.error(data.Msg)
        }
      });
    },

      /**
       * get school org pages list
       * @param selectedGid
       */
      getOrgSchoolPage: function (selectedGid) {
          applicationServiceSet.commonService.schoolApi.GetCompanysByKeyWord.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid, $scope.newModel.cloudID, $scope.newModel.ptnID]).then(function (data) {
              if (data.Ret == 0) {
                  $scope.newModel.schoolList = data.Data;
              }
          });
      },


      /**
       * get Grade org pages list
       */
      GetSchGrades:function () {
          applicationServiceSet.commonService.schoolApi.GetSchGrades.send([APPMODEL.Storage.getItem('applicationToken'), $scope.newModel.schoolID, ]).then(function (data) {
              if (data.Ret == 0) {
                  $scope.newModel.gradeList = data.Data;
              }
          });
      },
      /**
       * get Grade org pages list
       */
      GetSchClasses:function () {
          applicationServiceSet.commonService.schoolApi.GetSchClassesByKey.send([APPMODEL.Storage.getItem('applicationToken'), $scope.newModel.schoolID,'',50 ]).then(function (data) {
              if (data.Ret == 0) {
                  $scope.newModel.classList = data.Data;
              }
          });
      },
      /**
       * get Grade org pages list
       */
      GetUserByTel:function (tel) {
          applicationServiceSet.commonService.schoolApi.GetUserByTel.send([APPMODEL.Storage.getItem('applicationToken'),  tel, ]).then(function (data) {
              if (data.Ret == 0) {
                  //$scope.model.telList=[].push({data.Data.});
                  $scope.newModel.telNum=data.Data.Name+'('+data.Data.Tel+')';
                  $scope.newModel.tel=data.Data.UID;
                  $scope.newModel.scopeID=data.Data.UID;
              }
          });
      },
  };


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
     * refresh service get getOrgSchoolPage list
     * @param selectedGid
     */
    $scope.refreshSchoolresses = function (selectedGid) {
        if (selectedGid) {
            // $scope.model.keyWord=selectedGid;
            newModelServiceApi.getOrgSchoolPage(selectedGid);//get getOrgSchoolPage   pages list
        }
    };

    /***
     * 选择的学校
     * **/
    $scope.changeSchool = function () {

        if ($scope.newModel.ScopeType== 3){
            $scope.newModel.scopeID = $scope.newModel.schoolID
        }

        else  if($scope.newModel.ScopeType== 4) {
            newModelServiceApi.GetSchGrades();
            newModelServiceApi.GetSchClasses();
            $scope.newModel.gradeID=undefined;
            $scope.newModel.classID=undefined;
            $scope.newModel.scopeID =undefined;

        }
        else  if($scope.newModel.ScopeType== 5) {
            newModelServiceApi.GetSchGrades();
            newModelServiceApi.GetSchClasses();
            $scope.newModel.classID=undefined;
            $scope.newModel.gradeID=undefined;
            $scope.newModel.scopeID =undefined;
        }

    };


    /***
     * 删除选择的学校
     * **/
    $scope.delChangeSchool = function () {
        $scope.newModel.schoolList = undefined;
        $scope.newModel.schoolID = undefined;

        $scope.newModel.gradeList=[];
        $scope.newModel.gradeID=undefined;

        $scope.newModel.classID=undefined;
        $scope.newModel.classList=[];

        $scope.newModel.scopeID=undefined;
    };

    /**
     * 补全手机号码
     * */
    $scope.setTel=function (tel) {
        if(tel && tel.length==11) {
            newModelServiceApi.GetUserByTel(tel);
        }
        else {
            $scope.newModel.tel=undefined;
            $scope.newModel.scopeID=undefined;
        }
    }


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


    /***
     *  修改参数值
     * **/
    $scope.changeScopeParmas=function (id) {
        $scope.newModel.scopeID=id;
    }

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



    /**
     * 改变规则规范类型
     */
    $scope.changeScopeType=function () {

        //学校
        if($scope.newModel.ScopeType== 3) {
            $scope.newModel.isSchoolShow=true;
            $scope.newModel.isGradeShow=false;
            $scope.newModel.isClassShow=false;
            $scope.newModel.isTelShow=false;
            $scope.newModel.ScopeTypeMameShow = false;
        }
        //年级
        else if($scope.newModel.ScopeType== 4){
            $scope.newModel.isSchoolShow=true;
            $scope.newModel.isGradeShow=true;
            $scope.newModel.isClassShow=false;
            $scope.newModel.isTelShow=false;
            $scope.newModel.ScopeTypeMameShow = false;
        }
        //班级
        else if($scope.newModel.ScopeType== 5){
            $scope.newModel.isSchoolShow=true;
            $scope.newModel.isGradeShow=false;
            $scope.newModel.isClassShow=true;
            $scope.newModel.isTelShow=false;
            $scope.newModel.ScopeTypeMameShow = false;
        }
        //个人
        else if($scope.newModel.ScopeType== 6){
            $scope.newModel.isSchoolShow=false;
            $scope.newModel.isGradeShow=false;
            $scope.newModel.isClassShow=false;
            $scope.newModel.isTelShow=true;
            $scope.newModel.ScopeTypeMameShow = false;


        }
        else {
            $scope.newModel.isSchoolShow=false;
            $scope.newModel.isGradeShow=false;
            $scope.newModel.isClassShow=false;
            $scope.newModel.isTelShow=false;
            $scope.newModel.ScopeTypeMameShow = true;
            $scope.newModel.scopeID=$scope.newModel.ptnID;
        }




        // service.GetSubAppEditGrantForPartner(items[0].ID,items[0].operType,$scope.newModel.ScopeType,function (data) {
        //     items[2] = data;
        //     // loadDialogBody();
        // });



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

      if(!$scope.newModel.scopeID || $scope.newModel.scopeID<=0 ){

          //学校
          if($scope.newModel.ScopeType== 3) {
              toastr.error('请选择学校')
          }
          //年级
          else if($scope.newModel.ScopeType== 4) {
              toastr.error('请选择年级')
          }
          //班级
          else if($scope.newModel.ScopeType== 5){
              toastr.error('请选择班级')
          }
          //个人
          else if($scope.newModel.ScopeType== 6){
              toastr.error('请输入手机号码')
          }

    // toastr.error('请选择规则范围')
        return false;
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

  $scope.newModel.operType =parseInt(items[0].operType);

  if($scope.newModel.operType==1) $scope.newModel.isEdit=false;
  else if($scope.newModel.operType==2) $scope.newModel.isEdit=true;

  if (items[1]) {
    $scope.newModel.scopeTypeList= items[1].scopeTypeList;

    $scope.newModel.disabled = true;
    $scope.newModel.onlyreadInput = true;

  } else {

    $scope.newModel.scopeTypeList= items[1].scopeTypeList;
    $scope.newModel.onlyreadInput = true;
  }

  loadDialogBody();

  function loadDialogBody() {

      if(items[2]){
         // $scope.newModel.scopeType=items[2].ScopeType;
          $scope.newModel.ScopeType=items[2].ScopeType;
          $scope.newModel.scopeID=items[2].ScopeID;
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

          // //规则范围类型
          // for(var stikey in items[2].UICtrl.ScopeTypeItem.DataSource)
          // {
          //     var _sti=items[2].UICtrl.ScopeTypeItem.DataSource[stikey];
          //     $scope.newModel.ScopeTypeList.push({id:parseInt(stikey),name:_sti});
          // }

          //规则范围
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
              $scope.newModel.ScopeList=[{id:$scope.newModel.scopeID,name:$scope.newModel.ScopeName}] ;
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
                  $scope.newModel.GTypeListEdit = false;
                  $scope.newModel.GTypeListShow = false;
                  break;
              case 1:
                  $scope.newModel.GTypeListEdit = true;
                  $scope.newModel.GTypeListShow = true;
                  break;
              case 2:
                  $scope.newModel.GTypeListEdit = false;
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


          if(items[0].operType == 1) $scope.newModel.operIsEdit=false;
          else  if(items[0].operType == 2) $scope.newModel.operIsEdit=true;
          $scope.changeScopeType();

          //学校
          if($scope.newModel.ScopeType== 3) {
              $scope.newModel.schoolID =  items[2].ScopeID;
            $scope.newModel.schoolList.push({GID:items[2].ScopeID,FName:items[2].ScopeName});
          }
          //年级
          else if($scope.newModel.ScopeType== 4){
              $scope.newModel.gradeID =  items[2].ScopeID;
              $scope.newModel.gradeList.push({ID:items[2].ScopeID,Name:items[2].ScopeName});
          }
          //班级
          else if($scope.newModel.ScopeType== 5){
              $scope.newModel.classID =  items[2].ScopeID;
              $scope.newModel.classList=[{GID:items[2].ScopeID,FName:items[2].ScopeName}];
          }
          //个人
          else if($scope.newModel.ScopeType== 6){
              $scope.newModel.tel =  items[2].ScopeID;
              $scope.newModel.telList.push({GID:items[2].ScopeID,FName:items[2].ScopeName});
              $scope.newModel.telNum= items[2].ScopeName;
          }
          else {
              $scope.newModel.isSchoolShow=false;
              $scope.newModel.isGradeShow=false;
              $scope.newModel.isClassShow=false;
              $scope.newModel.isTelShow=false;
              $scope.newModel.ScopeTypeMameShow = true;
              $scope.newModel.scopeID=$scope.newModel.ptnID;
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
