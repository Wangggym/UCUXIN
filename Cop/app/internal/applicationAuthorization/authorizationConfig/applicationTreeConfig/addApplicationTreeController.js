
/**
 * Created by lqw on 2016/11/28.
 * addOrEditSchoolApplicationOpeningController
 * add or edit school application opening
 */
app.controller('addOrEditSchoolApplicationOpeningController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
  /**
   * 新增后者编辑学校应用开通
   * @type {{init: init, variable: variable, operation: operation, setting, serviceApi}}
   */
  var addOrEditSchoolApplicationOpening = {
    /**
     * 入口
     */
    init: function () {
      this.variable();//变量声明
      this.operation();//操作
     // this.serviceApi.getBusinessType();//获取业务类型
      this.setting.tip();//tip



    },
    /**
     * 变量声明
     */
    variable: function () {
      $scope.model = {
        head: undefined,
        No:'',
        noEdit:true,
        SubAppID:0,
        Name:'',
        Desc:'',
        Provider:'',
        Icon:'',
        IconsetList:[],
        isApplicatioType:false,
        ST:0,
        STList:[
          {id:0,name:'初始的'},
          {id:1,name:'已上架'},
          {id:-1,name:'已下架'},
        ],
        AndroidAppVer:'',
        IosAppVer:'',
        ActTypeList:[
          {  id:1,name:'Cmd'  },
          {  id:2,name:'Url'  }
        ],
        ActType:1,
        Action:'',
        CatgIDList:[],
        CatgID:0,
        ElemType:0,
        ElemTypeList:[
          {  id:0,name:'普通的'  },
          {  id:1,name:'动态模板的'  },
        ],
        isNoContentType:true,
        ContentType:0,
        ContentTypeList:[
          {id:0,name:'未知类型'},
          {id:1,name:'文本（含内置表情）'},
          {id:2,name:'图片'},
          {id:3,name:'语音'},
          {id:4,name:'音乐(未实现)'},
          {id:5,name:'视频(未实现)'},
          {id:6,name:'位置(未实现)'},
          {id:7,name:'网页消息'},
          {id:8,name:'网页消息集合'},
          {id:9,name:'文件(未实现)'},
          {id:10,name:'高级表情(未实现)'},
          {id:11,name:'名片'},
          {id:12,name:'网页消息2'},
          {id:13,name:'广告页'},
          {id:14,name:'The web HTML'},
          {id:15,name:'打卡考勤'},
          {id:16,name:'含有图表的混合类型'},
          {id:17,name:'系统消息模版'},
          {id:20,name:'第三方扩展消息(未实现)'},
          {id:99,name:'事件(未实现)'},
          {id:101,name:'机构通知公告 复杂类型'},
          {id:102,name:'评论 复杂类型'},
          {id:103,name:'会话通知消息'},
        ],
        ElemSize:11,
        ElemSizeList:[
          {  id:11,name:'1*1'  },
          {  id:12,name:'1*2'  },
          {  id:14,name:'1*4'  },
          {  id:24,name:'2*4'  },
        ],
        STypeListAll:[     //会话类型
          {  id:1,name:'机构/学校'  },
          {  id:2,name:'班级'  },
        ],
        STypeList:[],
        BizDomainListAll:[      //业务领域
          {  id:0,name:'基础教育'  },
          {  id:1,name:'师资培训'  },
        ],
        BizDomainList:[],
        GTypeListAll:[],//机构类型
        GTypeList:[],
        RTypeListAll:[], //使用角色
        RTypeList:[],
        PhaseListAll:[],//教育阶段
        PhaseList:[],
        GrdTypeListAll:[],//年级段
        GrdTypeList:[],

          isSType:true,
          isBizDomain:true,
          isGType:true,
          isRType:true,
          isPhaseList:true,
          isGrdType:true,

      };


      if ($stateParams.SubAppID) {
        $scope.model.isEdit = true;
        $scope.model.head = '编辑';
        $scope.model.SubAppID=   $stateParams.SubAppID;

      } else {
        $scope.model.head = '新增';
        $scope.model.isEdit=false;
      }




    },
    /**
     * 操作
     */
    operation: function () {
      /**
       * 保存
       */
      $scope.save = function () {


      addOrEditSchoolApplicationOpening.serviceApi.dataJust();

      if(addOrEditSchoolApplicationOpening.serviceApi.addIsNullOrEmpty()) {

        if ($scope.model.isEdit) {
          addOrEditSchoolApplicationOpening.serviceApi.SaveSubApp();//提供给运营平台 1、开通新学校
        } else {
          addOrEditSchoolApplicationOpening.serviceApi.SaveSubApp();//提供给运营平台 1、开通新学校
        }
      }
      };



        //控制albel显示

        $scope.gTypeStyle=function ($event)  {
            var $lb= $($event.target).closest('td').find('label.lb');
            if($scope.model.isGType){
                $lb.css({color:'#cccccc'});
            }
            else{
                $lb.css({color:'#58666e'});
            }
            $scope.model.isGType=!$scope.model.isGType;
        }
        $scope.rTypeStyle=function ($event)  {
            var $lb= $($event.target).closest('td').find('label.lb');
            if($scope.model.isRType){
                $lb.css({color:'#cccccc'});
            }
            else{
                $lb.css({color:'#58666e'});
            }
            $scope.model.isRType=!$scope.model.isRType;
        }
        $scope.phaseListStyle=function ($event)  {
            var $lb= $($event.target).closest('td').find('label.lb');
            if($scope.model.isPhaseList){
                $lb.css({color:'#cccccc'});
            }
            else{
                $lb.css({color:'#58666e'});
            }
            $scope.model.isPhaseList=!$scope.model.isPhaseList;
        }
        $scope.grdTypeStyle=function ($event)  {
            var $lb= $($event.target).closest('td').find('label.lb');
            if($scope.model.isGrdType){
                $lb.css({color:'#cccccc'});
            }
            else{
                $lb.css({color:'#58666e'});
            }
            $scope.model.isGrdType=!$scope.model.isGrdType;
        }
 
      /**
       * 开启模板显示
       */
      $scope.checkElemType=function (v) {
         if(v==1){
           $scope.model.isNoContentType=false;
         }
         else{
           $scope.model.isNoContentType=true;
         }
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

      //管理图标集
      $scope.ManageIconList=function () {
        $modal.open({
          templateUrl: 'addIconsContent.html',
          controller: 'AddIconsModalContentCtrl',
          keyboard: false,
          backdrop: false,
          resolve: {
            items: function () {
              return [$scope.model];
            },
            service: function () {
              return addOrEditSchoolApplicationOpening.serviceApi;
            }
          }

        });
      };


      //修改类型
$scope.catgChange = function (id) {
    $scope.model.isApplicatioType=false ;
      for(var i = 0 ;i<$scope.model.CatgIDList.length; i++){
        if(id==$scope.model.CatgIDList[i].id){
            if($scope.model.CatgIDList[i].entrType==2){

                $scope.model.isApplicatioType=true;
            }
        }
      }
}


      $scope.init=function () {

        addOrEditSchoolApplicationOpening.serviceApi.getGradeTypeList();
        addOrEditSchoolApplicationOpening.serviceApi.GetGroupTypeList();
        addOrEditSchoolApplicationOpening.serviceApi.getPhaseList();
        addOrEditSchoolApplicationOpening.serviceApi.getRTypeList();
        addOrEditSchoolApplicationOpening.serviceApi.GetSubAppCatgList()

        setTimeout(function () {
          addOrEditSchoolApplicationOpening.serviceApi.GetSubApp();
        },1000);
      }

       $scope.init();
    },
    /**
     * 设置
     */
    setting: (function () {
      return {
        /*
        * 初始化model*/
        initModel:function (data) {

          $scope.model.No=data.No;
          $scope.model.Name=data.Name;
          $scope.model.Desc=data.Desc;
          $scope.model.Icon=data.Icon;
          $scope.model.IconsetList=data.IconsetList;
          $scope.model.ST=data.ST;
          $scope.model.IsShow=data.IsShow;
          $scope.model.AndroidAppVer=data.AndroidAppVer;
          $scope.model.IosAppVer=data.IosAppVer;
          $scope.model.Provider=data.Provider;
          $scope.model.ActType=data.ActType;
          $scope.model.Action=data.Action;
           $scope.model.BizDomainList=data.BizDomainList;
          $scope.model.GTypeList=data.GTypeList;
          $scope.model.RTypeList=data.RTypeList;
          $scope.model.PhaseList=data.PhaseList;
          $scope.model.GrdTypeList=data.GrdTypeList;
          $scope.model.CatgID=data.CatgID;
          $scope.model.SNO=data.SNO;
          $scope.model.RTypeNames=data.RTypeNames;
          $scope.model.PhaseNames=data.PhaseNames;
          $scope.model.ElemSize=data.ElemSize;
          $scope.model.ElemType=data.ElemType;
          $scope.model.ContType=data.ContType;
          $scope.model.STypeList=data.STypeList;
          $scope.model.isGType = data.GTypeIsPub;
            $scope.model.isRType = data.RTypeIsPub;
            $scope.model.isPhaseList = data.PhaseIsPub;
            $scope.model.isGrdType = data.GrdTypeIsPub;


           for(var i = 0 ;i<$scope.model.CatgIDList.length; i++){
                   if ($scope.model.CatgIDList[i]&&$scope.model.CatgIDList[i].id == $scope.model.CatgID) {

                       if ($scope.model.CatgIDList[i].entrType == 2) {
                           $scope.model.isApplicatioType = true;
                       }
                   }

           }


          if($scope.model.ElemType==1){

            $scope.model.isNoContentType=false;
          }
          else{
            $scope.model.isNoContentType=true;
          }


          if(!$scope.model.STypeList)$scope.model.STypeList=[];
          if(!$scope.model.BizDomainList)$scope.model.BizDomainList=[];
          if(!$scope.model.GTypeList)$scope.model.GTypeList=[];
          if(!$scope.model.RTypeList)$scope.model.RTypeList=[];
          if(!$scope.model.PhaseList)$scope.model.PhaseList=[];
          if(!$scope.model.GrdTypeList)$scope.model.GrdTypeList=[];



          for(var i=0; i<$scope.model.STypeListAll.length;i++){
            for(var j=0 ; j<$scope.model.STypeList.length; j++)
            {
              if($scope.model.STypeListAll[i].id==$scope.model.STypeList[j]){
                $scope.model.STypeListAll[i].checked=true;
              }
            }
          }

          for(var i=0; i<$scope.model.BizDomainListAll.length;i++){
            for(var j=0 ; j<$scope.model.BizDomainList.length; j++)
            {
              if($scope.model.BizDomainListAll[i].id==$scope.model.BizDomainList[j]){
                $scope.model.BizDomainListAll[i].checked=true;
              }
            }
          }

          for(var i=0; i<$scope.model.GTypeListAll.length;i++){
            for(var j=0 ; j<$scope.model.GTypeList.length; j++)
            {
              if($scope.model.GTypeListAll[i].id==$scope.model.GTypeList[j]){
                $scope.model.GTypeListAll[i].checked=true;
              }
            }
          }

          for(var i=0; i<$scope.model.RTypeListAll.length;i++){
            for(var j=0 ; j<$scope.model.RTypeList.length; j++)
            {
              if($scope.model.RTypeListAll[i].id==$scope.model.RTypeList[j]){
                $scope.model.RTypeListAll[i].checked=true;
              }
            }
          }



          for(var i=0; i<$scope.model.PhaseListAll.length;i++){
            for(var j=0 ; j<$scope.model.PhaseList.length; j++)
            {
              if($scope.model.PhaseListAll[i].id==$scope.model.PhaseList[j]){
                $scope.model.PhaseListAll[i].checked=true;
              }
            }
          }


          for(var i=0; i<$scope.model.GrdTypeListAll.length;i++){
            for(var j=0 ; j<$scope.model.GrdTypeList.length; j++)
            {
              if(parseInt($scope.model.GrdTypeListAll[i].id) ==parseInt($scope.model.GrdTypeList[j])){
                $scope.model.GrdTypeListAll[i].checked=true;
              }
            }
          }



        },

        /**
         * tip
         */
        tip: function () {
          toastr.toastrConfig.positionClass = 'toast-top-center';
          toastr.toastrConfig.timeOut = 2000;
        }
      };
    })(),
    /**
     * 服务集合
     */
    serviceApi: (function () {
      return {

        /**
         * 获取单个应用
         */
        GetSubApp: function () {
         // $scope.init();
          applicationServiceSet.themeSkinServiceApi.Authorization.GetSubApp.send([APPMODEL.Storage.getItem('applicationToken'),$scope.model.SubAppID  ]).then(function (data) {

            if (data.Ret == 0) {
               addOrEditSchoolApplicationOpening.setting.initModel(data.Data)
            }
          });
        },

        /**
         * 保存应用定义
         */
        SaveSubApp:function () {
          console.log($scope.model.STypeList);
          applicationServiceSet.themeSkinServiceApi.Authorization.SaveSubApp.send([
            $scope.model.SubAppID,
            $scope.model.Name,
            $scope.model.Desc,
            $scope.model.Icon,
            $scope.model.IconsetList,
            $scope.model.ST,
            $scope.model.IsShow,
            $scope.model.AndroidAppVer,
            $scope.model.IosAppVer,
            $scope.model.Provider,
            $scope.model.ActType,
            $scope.model.Action,
            $scope.model.BizDomainList,
            $scope.model.GTypeList,
            $scope.model.RTypeList,
            $scope.model.PhaseList,
            $scope.model.GrdTypeList,
            $scope.model.CatgID,
            $scope.model.STypeList,
            $scope.model.ElemSize,
            $scope.model.ElemType,
            $scope.model.ContType,
            $scope.model.No,
            $scope.model.isGType,
              $scope.model.isRType,
              $scope.model.isPhaseList,
              $scope.model.isGrdType
          ],[APPMODEL.Storage.getItem('applicationToken') ]).then(function (data) {
            if (data.Ret == 0) {

              toastr.success('新增成功');
              //$location.url('access.app.internal.authorizationConfig.applicationTreeConfig');
            $('#btnReturn').click();
            }
            else {
             // toastr.error(data.Msg);
            }
          });
        },
        /**
         * 获取应用分组
         */
        GetSubAppCatgList: function () {

          applicationServiceSet.themeSkinServiceApi.Authorization.GetSubAppCatgList.send([APPMODEL.Storage.getItem('applicationToken'),'null', 'null', 0 ]).then(function (data) {
            if (data.Ret == 0) {
              $scope.model.itemListGroups=data.Data;

              if (data.Ret == 0) {
                var __catlist  = [];
              //  __catlist.push({id: 0, name: '全部分组'});
                for (var i = 0; i < data.Data.length; i++) {
                  var obj = {};
                  obj.id = data.Data[i].ID;
                  obj.name = data.Data[i].Name;
                  obj.entrType= data.Data[i].EntrType;
                  __catlist.push(obj);
                }
                $scope.model.CatgIDList = __catlist;

              }
            }
          });
        },

        /**
         * 获取机构类型
         */
        GetGroupTypeList:function () {
          applicationServiceSet.commonService.schoolApi.GetGroupTypeList.send([APPMODEL.Storage.getItem('applicationToken'),1,0]).then(function (data) {
            if (data.Ret == 0) {
              var __roleTypeTree  = [];
              for (var i = 0; i < data.Data.length; i++) {
                var obj = {};
                obj.id = data.Data[i].ID;
                obj.name = data.Data[i].Name;
                __roleTypeTree.push(obj);
              }
              //  __rTypeList.push({id: 0, name: '全部'});
               $scope.model.GTypeListAll = __roleTypeTree;
            }
          });
        },
        /**
         * 获取教育阶段
         */
        getPhaseList:function () {
          applicationServiceSet.commonService.schoolApi.GetPhaseList.send([APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
            if (data.Ret == 0) {
              var __phaselist = [];
              for (var i = 0; i < data.Data.length; i++) {
                var obj = {};
                obj.id = data.Data[i].ID;
                obj.name = data.Data[i].Name;
                __phaselist.push(obj);
              }
              //  __phaselist.push({id: 0, name: '全部'});
             $scope.model.PhaseListAll = __phaselist;
            }
          });
        },
        /**
         * 获取角色
         */
        getRTypeList:function () {
          applicationServiceSet.commonService.schoolApi.GetRoleTypeTree.send([APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {

            if (data.Ret == 0) {
              var __rTypeList  = [];
              for (var i = 0; i < data.Data.length; i++) {
                var obj = {};
                obj.id = data.Data[i].ID;
                obj.name = data.Data[i].Name;
                __rTypeList.push(obj);

                for(var j = 0 ; j<data.Data[i].Childs.length; j++)
                {
                  var c_obj = {};
                  c_obj.id = data.Data[i].Childs[j].ID;
                  c_obj.name = data.Data[i].Childs[j].Name;
                  __rTypeList.push(c_obj);
                }
              }
              //  __rTypeList.push({id: 0, name: '全部'});
             $scope.model.RTypeListAll = __rTypeList;
            }
          });
        },

        /**
         * 年纪段
         */
        getGradeTypeList:function () {
          applicationServiceSet.commonService.schoolApi.GetGradeTypeList.send([APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
            if (data.Ret == 0) {
              var __grdTypeList  = [];
              for (var i = 0; i < data.Data.length; i++) {
                var obj = {};
                obj.id = data.Data[i].ID;
                obj.name = data.Data[i].Name;
                __grdTypeList.push(obj);
              }

              //  __rTypeList.push({id: 0, name: '全部'});
              $scope.model.GrdTypeListAll = __grdTypeList;
            }
          });
        },

        /**
         * 判断是否为空
         */
        addIsNullOrEmpty:function () {

          if(!$scope.model.Name){
            toastr.error('分组名称不能为空');
            return false;
          }
          if(!$scope.model.Provider){
            toastr.error('服务提供不能为空');
            return false;
          }

          // if(!$scope.model.AndroidAppVer){
          //   toastr.error('安卓最低版本不能为空');
          //   return false;
          // }
          // if(!$scope.model.IosAppVer){
          //   toastr.error('IOS最低版本不能为空');
          //   return false;
          // }
          if(!$scope.model.Action){
            toastr.error('指令不能为空');
            return false;
          }
          if(!$scope.model.CatgID||$scope.model.CatgID<=0){
            toastr.error('所属分组不能为空');
            return false;
          }

          if(!$scope.model.ElemSize ){
            toastr.error('区块大小不能为空');
            return false;
          }


           return true;
        },

        //校验数据
        dataJust:function () {


          $scope.model.STypeList=[];
           for(var i=0; i<$scope.model.STypeListAll.length;i++){
               if($scope.model.STypeListAll[i].checked){
                 $scope.model.STypeList.push($scope.model.STypeListAll[i].id)
               }
           }



          $scope.model.BizDomainList=[];
          for(var i=0; i<$scope.model.BizDomainListAll.length;i++){
            if($scope.model.BizDomainListAll[i].checked){
              $scope.model.BizDomainList.push($scope.model.BizDomainListAll[i].id)
            }
          }

          $scope.model.GTypeList=[];
          for(var i=0; i<$scope.model.GTypeListAll.length;i++){
            if($scope.model.GTypeListAll[i].checked){
              $scope.model.GTypeList.push($scope.model.GTypeListAll[i].id)
            }
          }

          $scope.model.RTypeList=[];
          for(var i=0; i<$scope.model.RTypeListAll.length;i++){
            if($scope.model.RTypeListAll[i].checked){
              $scope.model.RTypeList.push($scope.model.RTypeListAll[i].id)
            }
          }

          $scope.model.PhaseList=[];
          for(var i=0; i<$scope.model.PhaseListAll.length;i++){
            if($scope.model.PhaseListAll[i].checked){
              $scope.model.PhaseList.push($scope.model.PhaseListAll[i].id)
            }
          }

          $scope.model.GrdTypeList=[];
          for(var i=0; i<$scope.model.GrdTypeListAll.length;i++){
            if($scope.model.GrdTypeListAll[i].checked){
              $scope.model.GrdTypeList[$scope.model.GrdTypeList.length]=$scope.model.GrdTypeListAll[i].id;
              //$scope.model.GrdTypeList.push($scope.model.GrdTypeListAll[i].id)
            }
          }

          if(!$scope.model.isApplicatioType){
            $scope.model.STypeList=[];
          }

        },

      /*********上传图片***********/
        uploadIcons:function (file) {
          applicationServiceSet.themeSkinServiceApi.Authorization.uploadIcons.fileUpload(file).then(function (data) {
            if(data.Ret == 0){
              $scope.imgUrl= data.Data.Url;
            }
          });
        },


        /********
         * 保存图标集
         * *********/
        saveIcons:function (icons) {
             $scope.model.IconsetList=icons;
        }
      };
    })()
  };
  addOrEditSchoolApplicationOpening.init();//函数入口




}]);



app.controller('AddIconsModalContentCtrl',['$scope', '$modalInstance', 'items', 'service', 'applicationServiceSet', function ($scope, $modalInstance, items, service, applicationServiceSet) {


  $scope.iconModel = {
    itemList:[],
    subAppNo:0,
    iconsetID:0,
  };


    $scope.iconModel.itemList= items[0].IconsetList;
    $scope.iconModel.subAppNo=items[0].No;




  //上传文件 - IosUrl
  $scope.uploadIosOssfileChange = function (file,iconID,item) {

    $scope.iconModel .iconsetID = iconID;
    if (file) {
      iconModelServiceApi.uploadIcons(file,function (thumbUrl) {
        item.IconUrl = thumbUrl;
      })
    }
  };

  /******
   * serviceAPi********/
  var iconModelServiceApi={
    uploadToOss: function (file) {
      var region = 'oss-cn-shenzhen'; //区域
      var obj = {};
      var type = '';
      var ps = file.name.split('.');
      if (ps.length > 1) type = ps[ps.length - 1];
      obj.name = file.name;
      obj.type = type;
      applicationServiceSet.attendanceService.basicDataControlService.GetSubAppOSSFileInfo.send([$scope.iconModel.iconsetID,$scope.iconModel.subAppNo, obj.type]).then(function (data) {
        if (data.Ret == 0) {
          var creds = data.Data.TokenModel;
          var name = data.Data.FullFileName;
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
    },
    /*********上传图片***********/
    uploadIcons:function (file,call) {
      applicationServiceSet.themeSkinServiceApi.Authorization.uploadIcons.fileUpload(file,[$scope.iconModel.subAppNo,$scope.iconModel .iconsetID ,'png']).then(function (data) {
        if(data.Ret == 0){
              var ThumbUrl = data.Data.ThumbUrl;
              call(ThumbUrl);
        }
      });
    }
  };

  setTimeout(function () {
    $(".modal-content").draggable({containment: "#app", scroll: false});
  }, 100);
  /**
   * cancel
   */
  $scope.close = function () {
    $modalInstance.dismiss('cancel');
  };
  /**
   * save
   */
  $scope.iconsSave = function () {
     service.saveIcons($scope.iconModel.itemList);
     $modalInstance.dismiss('cancel');
  };
}]);
