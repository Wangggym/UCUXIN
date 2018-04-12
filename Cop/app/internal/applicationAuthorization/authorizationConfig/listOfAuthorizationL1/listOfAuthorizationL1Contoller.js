/**
 * Created by lqw on 2017/7/21.
 * listOfAuthorizationL1Controller
 * list of organizations
 */
app.controller('listOfAuthorizationL1Contoller', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
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
  var listOfAuthorizationL1 = {
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
        cloudList:[],
        grantList:[
            {id:undefined,name:'全部'},
            {id:true,name:'已授权'},
            {id:false,name:'未授权'}
        ],
        grantID:undefined,
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
        selectedCatgID:'null',
        bodyrTypeID:0,

        // isSType:true,
        // isBizDomain:true,
        // isGType:true,
        // isRType:true,
        // isPhaseList:true,
        // isGrdType:true,
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
        GetSubAppInitGrantList1: function () {
          applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppInitGrantList1.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.cloudID, $scope.model.subAppName,$scope.model.grantID, $scope.model.pSize, $scope.model.pIndex]).then(function (data) {
            if (data.Ret == 0) {
              listOfAuthorizationL1.setting.dataChange(data.Data);//类型转换
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
              $scope.model.cloudID=__coludlist[0].id;
              $scope.model.cloudList = __coludlist;

              listOfAuthorizationL1.serviceApi.GetSubAppInitGrantList1();//服务集合
            }
          });
        },
         //推送
          ManualPushForSubApp:function (ids) {
            if(ids.length==0){
              toastr.error('请选择推送记录！');
              return false;
            }
              applicationServiceSet.themeSkinServiceApi.Authorization.ManualPushForSubApp.send([ids], [APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
                  if (data.Ret == 0) {
                      if (data.Ret == 0) toastr.success("推送成功");
                  } else {
                     // toastr.success(data.InfoMsg)
                  }
              });
          },
         /**
          * 保存授权
          * */
        SaveSubAppRelateForCloud:function (subAppIDs) {
          applicationServiceSet.themeSkinServiceApi.Authorization.SaveSubAppRelateForCloud.send(
            [subAppIDs],
            [APPMODEL.Storage.getItem('applicationToken'),  $scope.model.cloudID]
          ).then(function (data) {
            if (data.Ret == 0) {
                toastr.success('授权成功');
               $scope.search();//查询
            }
            else {
              //(data.Msg)
            }
          });
        },
        /**
         * 取消授权
         * */
        RemoveSubAppRelateForCloud:function (subAppIDs) {
          applicationServiceSet.themeSkinServiceApi.Authorization.RemoveSubAppRelateForCloud.send(
            [subAppIDs],
            [APPMODEL.Storage.getItem('applicationToken'),  $scope.model.cloudID]
          ).then(function (data) {
            if (data.Ret == 0) {
                toastr.success('取消授权成功');
              $scope.search();//查询
            }
            else {
             // toastr.error(data.Msg)
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
              applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppInitGrantList1.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.cloudID, $scope.model.subAppName,$scope.model.grantID, $scope.model.pSize, page.pIndex, 223]).then(function (data) {
                if (data.Ret == 0) {
                  listOfAuthorizationL1.setting.dataChange(data.Data);//类型转换
                }
              });
            },
            /**
             * nextPage
             * @param pageNext
             */
            nextPage: function (pageNext) {
              applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppInitGrantList1.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.cloudID, $scope.model.subAppName,$scope.model.grantID, $scope.model.pSize, pageNext, 223]).then(function (data) {
                if (data.Ret == 0) {
                  listOfAuthorizationL1.setting.dataChange(data.Data);//类型转换
                }
              });
            },
            /**
             * previousPage
             * @param pageNext
             */
            previousPage: function (pageNext) {
              applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppInitGrantList1.send([APPMODEL.Storage.getItem('applicationToken'),  $scope.model.cloudID, $scope.model.subAppName,$scope.model.grantID, $scope.model.pSize, pageNext, 223]).then(function (data) {
                if (data.Ret == 0) {
                  listOfAuthorizationL1.setting.dataChange(data.Data);//类型转换
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
        listOfAuthorizationL1.serviceApi.GetSubAppInitGrantList1();//服务集合
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
           listOfAuthorizationL1.serviceApi.ManualPushForSubApp(ids);
      }

      //保存授权
      $scope.SaveGrant=function () {
        var ids=[];
        var subAppIDs = {};
        var len = 0;
        for (var i = 0; i < $scope.model.itemList.length; i++) {
          var ni = $scope.model.itemList[i];

          if (ni.checked) {
            subAppIDs["subAppIDs[" + i + "]"] = ni.SubAppID;
            ids.push( ni.SubAppID);
            len++;
          }
        }
        if (len > 0) {

          listOfAuthorizationL1.serviceApi.SaveSubAppRelateForCloud(ids);
        } else {
          toastr.error('请选择授权记录');
        }
      }
      //取消授权
      $scope.CancelGrant=function () {
        var ids=[];
        var subAppIDs = {};
        var len = 0;
        for (var i = 0; i < $scope.model.itemList.length; i++) {
          var ni = $scope.model.itemList[i];

          if (ni.checked) {
            subAppIDs["subAppIDs[" + i + "]"] = ni.SubAppID;
            ids.push( ni.SubAppID);
            len++;
          }
        }
        if (len > 0) {

          listOfAuthorizationL1.serviceApi.RemoveSubAppRelateForCloud(ids);
        } else {
          toastr.error('请选择取消授权记录');
        }
      }

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
                if (data.ViewModelList[i].GrantStatus == true) {
                  data.ViewModelList[i].GrantStatusName = "已授权";
                } else {
                  data.ViewModelList[i].GrantStatusName = "未授权";
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
          listOfAuthorizationL1.serviceApi.GetCloudList();
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
  listOfAuthorizationL1.init();//函数入口
}]);
/**
 * newAddMyModalContentCtrl
 */
app.controller('newAddMyModalContentCtrl', ['$scope', '$modalInstance', 'items', 'service', 'applicationServiceSet', function ($scope, $modalInstance, items, service, applicationServiceSet) {
  $scope.newModel = {
    ID: undefined,
    No: undefined,
    IconSetID: undefined,
    ColorID: undefined,
    FontID: undefined,
    Name: undefined,
    Desc: undefined,
    PreviewImg: undefined,
    AndroidUrl: undefined,
    IosUrl: undefined,
    AndroidVers: undefined,
    IosVers: undefined,
    IconSet: undefined,
    ColorName: undefined,
    FontName: undefined,
    AndroidPrenct:0,
    IosPrenct:0
  };
  //图标选择
  $scope.fileChange = function (file) {
    if (file) {
      newModelServiceApi.imageUpload(file);//图标上传
    }
  };
  //上传文件 - androidUrl
  $scope.uploadAndroidOssfileChange = function (file) {
    $scope.newModel.AndroidUrl = '';
    if (file) {
      newModelServiceApi.uploadToOss(file, 3, function (androidUrl) {
        $scope.newModel.AndroidUrl = androidUrl;
        $('#andPerBox').hide();
        $('#AndroidPrenct').css({width:'0'});
        $('#AndroidUrl').val(androidUrl);
      },function (p) {
        $('#andPerBox').show();

        $scope.newModel.AndroidPrenct=p+'%';
        $('#AndroidPrenct').css({width:p+'%'});
        $('#andperValue,#AndroidPrenct').html(p+'%');
        $('#AndroidPrenct').parent().attr('data-percent',p);
      });//图标上传
    }
  };
  //上传文件 - IosUrl
  $scope.uploadIosOssfileChange = function (file) {
    $scope.newModel.IosUrl = '';
    if (file) {
      newModelServiceApi.uploadToOss(file, 2, function (IosUrl) {
        $scope.newModel.IosUrl = IosUrl;
        $('#iosPerBox').hide();
        $('#IosPrenct').css({width:'0'});
        $('#IosUrl').val(IosUrl);

      },function (p) {

        $('#iosPerBox').show();
        $scope.newModel.AndroidPrenct=p+'%';
        $('#IosPrenct').css({width:p+'%'});
        $('#iosperValue,#IosPrenct').html(p+'%');

      });//图标上传
    }
  };
  //下拉选择项的值改变事件
  $scope.changeitem = function (name, type, item) {
    if (type == 1) $scope.newModel.IconSet = name;
    else if (type == 2) $scope.newModel.ColorName = name;
    else if (type == 3) $scope.newModel.FontName = name;
    else if (type == 4) {
      $scope.newModel.Explain = name;

      if ($scope.newModel.Explain&&$scope.newModel.Explain.length > 20) {

        $scope.newModel.Explain = $scope.newModel.Explain.substr(0, 20);
      }
    }

    $scope.newModel.Name = '';
    if ($scope.newModel.IconSet && $scope.newModel.IconSet != 'undefined') $scope.newModel.Name = $scope.newModel.IconSet;
    if ($scope.newModel.ColorName) $scope.newModel.Name += '_' + $scope.newModel.ColorName;
    if ($scope.newModel.FontName) $scope.newModel.Name += '_' + $scope.newModel.FontName;
    //if ($scope.newModel.Desc) $scope.newModel.Name += '_' + $scope.newModel.Desc;
    if ($scope.newModel.Explain) $scope.newModel.Name += '_' + $scope.newModel.Explain;
  };

  var newModelServiceApi = {
    //图标上传
    imageUpload: function (file) {
      applicationServiceSet.parAppServiceApi.corporateRegistrationIcon.ImageRegistrationUpload.fileUpload(file).then(function (data) {
        if (data.Ret == 0) {
          $scope.newModel.PreviewImg = data.Data.Url;
          newModelServiceApi.getOssToken();
        }
      });
    },
    getOssToken: function () {
      applicationServiceSet.attendanceService.basicDataControlService.GetOSSAccessIdentity.send([]).then(function (data) {
        if (data.Ret == 0) {
          var creds = data.Data;
          var obj = {};
        }
      });
    },
    uploadToOss: function (file, devType, call,prenctCall) {
      var region = 'oss-cn-shenzhen'; //区域
      var obj = {};
      var type = '';
      var ps = file.name.split('.');
      if (ps.length > 1) type = ps[ps.length - 1];
      obj.name = file.name;
      obj.type = type;
      applicationServiceSet.attendanceService.basicDataControlService.GetSkinPackOSSFileInfo.send([devType, $scope.newModel.No, obj.type]).then(function (data) {
        if (data.Ret == 0) {
          var creds = data.Data.TokenModel;
          var name = data.Data.FullFileName;
          console.log(name);
          //阿里云提供功能的上传类
          var client = new OSS.Wrapper({
            region: region,
            accessKeyId: creds.AccessKeyId,
            accessKeySecret: creds.AccessKeySecret,
            stsToken: creds.SecurityToken,
            bucket: creds.BucketName
          });
          var oliUrl = creds.RootUrl + '/' + data.Data.FullFileName;
          //上传文件 to aliyun   ES6写法
          OSS.co(function*() {

            var result = client.multipartUpload(name, file, {
              progress: function*(p) {
                //设置进度条
                var per = parseInt(p * 100);
                if(prenctCall)prenctCall(per);
                if(per==100) if (call) call(oliUrl);
              }
            });


          });
        }
      });
    }
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
    if (items[1]) {
      items[1].isEdit = true;
      console.log($scope.newModel)
      service.AddSkinPack($scope.newModel, items[1], function () {
        $modalInstance.dismiss('cancel');
      });//添加或更新组织信息
    } else {
      items[0].isEdit = false;

      service.AddSkinPack($scope.newModel, items[0], function () {
        $modalInstance.dismiss('cancel');
      });//添加或更新组织信息
    }
  };
  setTimeout(function () {
    $(".modal-content").draggable({containment: "#app", scroll: false});
  }, 100);
  if (items[1]) {

    // var _spicName=items[0].Name.split('_').length==4?items[0].Name.split('_')[3]:'';
    console.log(items[2].FontList);
    $scope.newModel.Desc = items[0].Desc;
    $scope.newModel.IconsetList = items[2].IconsetList;
    $scope.newModel.ColorList = items[2].ColorList;
    $scope.newModel.FontList = items[2].FontList;
    $scope.newModel.ID = items[0].ID;
    $scope.newModel.No = items[0].No;
    $scope.newModel.IconSetID = items[0].IconSetID;
    $scope.newModel.ColorID = items[0].ColorID;
    $scope.newModel.FontID = items[0].FontID;
    $scope.newModel.Name = items[0].Name;
    $scope.newModel.PreviewImg = items[0].PreviewImg;
    $scope.newModel.AndroidUrl = items[0].AndroidUrl;
    $scope.newModel.IosUrl = items[0].IosUrl;
    $scope.newModel.AndroidVers = items[0].AndroidVers;
    $scope.newModel.IosVers = items[0].IosVers;
    // $scope.newModel.IconSet = items[0].Name.split('_')[0];
    // $scope.newModel.ColorName = items[0].Name.split('_')[1];
    // $scope.newModel.FontName =items[0].Name.split('_')[2];
    //$scope.newModel.Explain=_spicName;
    $scope.newModel.IconSet = items[0].IconSet;
    $scope.newModel.ColorName = items[0].ColorName;
    $scope.newModel.FontName = items[0].FontName;
    $scope.newModel.Explain=items[0].Explain;
    $scope.newModel.disabled = true;
    $scope.newModel.onlyreadInput = true;
  } else {
    $scope.newModel.IconsetList = items[0].IconsetList;
    $scope.newModel.ColorList = items[0].ColorList;
    $scope.newModel.FontList = items[0].FontList;
    $scope.newModel.No = items[0].No;
    $scope.newModel.onlyreadInput = true;
  }
}]);
