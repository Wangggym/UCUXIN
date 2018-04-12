/**
 * Created by Rejoice-min on 2017/7/11.
 */
app.factory('themeSkinService', [function () {
  var themService = {};


    /**
     * 优信主题
     * **/
    var themeSkinsServer=function(){
      var service={
        // 分页获得主题包列表
        GetSkinPackPageList:{
          method:'get',
          requestUrl: urlConfig + "public/v3/OpenAppSkin/GetSkinPackPageList",
          requestParams: function (params) {

            return {
              token: params[0],
              keyWord: params[1],
              type: params[2],
              pageSize: params[3],
              pageIndex: params[4],
            };
          }
        },
        GetSkinPack:{
          method:'get',
          requestUrl: urlConfig + "public/v3/OpenAppSkin/GetSkinPack",
          requestParams: function (params) {
            return{
              token:params[0],
              skinPackID:params[1],
            }
          },
        },
        GetSkinDataSourseUnion:{
          method:'get',
          requestUrl: urlConfig + "public/v3/OpenAppSkin/GetSkinDataSourseUnion",
          requestParams: function (params) {
            return{
              token:params[0],
            }
          },
        },
        AddSkinPack:{
          method:'post',
          requestUrl: urlConfig + "public/v3/OpenAppSkin/SaveSkinPack",
          requestPost: function (params) {
            return {
              token: params[0]
            };
          },
          requestParams: function (params) {
            return{
              ID:params[0],
              No:params[1],
              IconSetID:params[2],
              ColorID:params[3],
              FontID:params[4],
              Name:params[5],
              Desc:params[6],
              PreviewImg:params[7],
              AndroidUrl:params[8],
              IosUrl:params[9],
              Explain:params[10],
            }
          },
        },
        //主题包定义提交需要推送的主题包
        SubmitPushForSkinPack:{
          method:'post',
          requestUrl: urlConfig + "public/v3/OpenAppSkin/SubmitPushForSkinPack",
          requestPost: function (params) {
            return {
              token: params[0],
              devType:params[1]
            };
          },
          requestParams: function (params) {

            return params[1]
          },
        },

          //主题包上传完成后调用
          CallBackForSkinPackUpload:{
              method:'post',
              requestUrl: urlConfig + "public/v3/OpenAppSkin/CallBackForSkinPackUpload",
              requestPost: function (params) {
                  return {
                      token: params[0],
                      ID:params[1],
                      devType:params[2],
                      url:params[3],
                  };
              },
              requestParams: function (params) {
                  return{
                      ID:params[0],
                      devType:params[1],
                      url:params[2],
                  }
              },
          }
      };
      return service;
    };
    themService.themeSkins=themeSkinsServer();

    /**
     * 优信主题授权
     * **/
    var themeSkinLimitServer=function () {
      var service={
        GetSkinPackRange:  {
          method: "get",
          requestUrl: urlConfig + "public/v3/OpenAppSkin/GetSkinPackRangePageList",
          requestParams: function (params) {
            return {
              token: params[0],
              cloudID: params[1],
              gID: params[2],
              phaseID: params[3],
              pageSize: params[4],
              pageIndex: params[5]
            };
          }
        },
        SaveSkinPack:{
          method: "post",
          requestUrl: urlConfig + "public/v3/OpenAppSkin/SaveSkinPackRange",
          requestPost: function (params) {
            return {
              token: params[0]
            };
          },
          requestParams: function (params) {
            return {
              ID:params[0],
              CloudID: params[1],
              GID: params[2],
              PhaseID: params[3],
              SkinPackID:params[4],
            };
          }
        },
        GetSignSkinPack:{
          method: "get",
          requestUrl: urlConfig + "public/v3/OpenAppSkin/GetSkinPackRange",
          requestParams: function (params) {
            return {
              token: params[0],
              skinPackRangeID: params[1],
            };
          }
        },
        RemoveSkinPackRange:{
          method: "post",
          requestUrl: urlConfig + "public/v3/OpenAppSkin/RemoveSkinPackRange",
          requestPost: function (params) {
            return {
              token: params[0],
              skinPackRangeID:params[1],
            };
          },
          requestParams: function (params) {
            return {
             // token: params[0],
             // skinPackRangeID:params[1],
            };
          },

        },
        //推送
        submitPush:{
          method: "post",
          requestUrl: urlConfig + "public/v3/OpenAppSkin/SubmitPushForSkinPackRange",
          requestPost: function (params) {
            return {
              token: params[0]
            };
          },
          requestParams: function (params) {
            return  params[0];

          }
        }
      };
      return service;
    }
    themService.SkinLimit=themeSkinLimitServer();


    /*****
     *  配置授权
     * *******/
    var AuthorizationServer=function () {
      var service={

        GetSubAppInit1List:  {
          method: "get",
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/GetSubAppInitGrantList",
          requestParams: function (params) {
            return {
              token: params[0],
              cloudID: params[1],
              subAppName: params[2],
              pageSize: params[3],
              pageIndex: params[4]
            };
          }
        },
        //获取应用
        GetSubAppList:  {
          method: "get",
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/GetSubAppList",
          requestParams: function (params) {
            return {
              token: params[0],
              catgID: params[1],
              rTypeID: params[2],
            };
          }
        },
        //获取应用分组
        GetSubAppCatgList: {
          method: "get",
            requestUrl: urlConfig + "public/v3/OpenAppSubApp/GetSubAppCatgList",
            requestParams: function (params) {
            return {
              token: params[0],
              bizDomain: params[1],
              entrType: params[2],
              rTypeID: params[3],
            };
          }
        },

        //获取单个应用分组定义
        GetSubAppCatg:{
          method: "get",
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/GetSubAppCatg",
          requestParams: function (params) {
            return {
              token: params[0],
              catgID: params[1],
            };
          }
        },
        //保存应用分组
        SaveSubAppCatg:{
          method:'post',
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/SaveSubAppCatg",
          requestPost: function (params) {
            return {
              token: params[0]
            };
          },
          requestParams: function (params) {
            return{
              ID:params[0],
              Name:params[1],
              EntrType:params[2],
              SNO:params[3],
              IsShowName:params[4],
            }
          },
        },

        //应用推送


        //保存分组排序
        SaveSubAppCatgSort:{
          method:'post',
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/SaveSubAppCatgSort",
          requestPost: function (params) {
            return {
              token: params[0],
              entrType:params[1],
            };
          },
          requestParams: function (params) {
            return{
                 '':params[0]
            }
          },
        },

        //获取单个应用分组定义
        GetSubApp:{
          method: "get",
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/GetSubApp",
          requestParams: function (params) {
            return {
              token: params[0],
              subAppID: params[1],
            };
          }
        },
        //保存应用
        SaveSubApp:{
          method:'post',
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/SaveSubApp",
          requestPost: function (params) {
            return {
              token: params[0]
            };
          },
          requestParams: function (params) {
            return{
              SubAppID:params[0],
              Name:params[1],
              Desc:params[2],
              Icon:params[3],
              IconsetList:params[4],
              ST:params[5],
              IsShow:params[6],
              AndroidAppVer:params[7],
              IosAppVer:params[8],
              Provider:params[9],
              ActType:params[10],
              Action:params[11],
              BizDomainList:params[12],
              GTypeList:params[13],
              RTypeList:params[14],
              PhaseList:params[15],
              GrdTypeList:params[16],
              CatgID:params[17],
              STypeList:params[18],
              ElemSize:params[19],
              ElemType:params[20],
              ContType:params[21],
              No:params[22],
                GTypeIsPub:params[23],
                RTypeIsPub:params[24],
                PhaseIsPub:params[25],
                GrdTypeIsPub:params[26]

            }
          },
        },
        //保存应用排序
        SaveSubAppSort:{
          method:'post',
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/SaveSubAppSort",
          requestPost: function (params) {
            return {
              token: params[0],
              catgID:params[1],
            };
          },
          requestParams: function (params) {
            return{
              '':params[0]
            }
          },
        },
        //上下架
        SetSubAppOnOffShelf:{
          method:'post',
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/SetSubAppOnOffShelf",
          requestPost: function (params) {
            return {
              token: params[0],
              subAppID:params[1],
              isOnShelf:params[2],
            };
          },
          requestParams: function (params) {
            return {
            }
          },
        },

        //获取L1授权列表
        GetSubAppInitGrantList1:{
          method: "get",
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/GetSubAppInitGrantList",
          requestParams: function (params) {
            return {
              token: params[0],
              cloudID: params[1],
              subAppName: params[2],
              isGrant: params[3],
              pageSize: params[4],
              pageIndex: params[5]
            };
          }
        },
        //L1保存授权
        SaveSubAppRelateForCloud:{
          method:'post',
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/SaveSubAppRelateForCloud",
          requestPost: function (params) {
          return {
            token: params[0],
            cloudID:params[1]
          };
        },
        requestParams: function (params) {
          return {'':params[0]}
        },
      },
        //L1取消授权
        RemoveSubAppRelateForCloud:{
          method:'post',
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/RemoveSubAppRelateForCloud",
          requestPost: function (params) {
            return {
              token: params[0],
              cloudID:params[1]
            };
          },
          requestParams: function (params) {
            return {'':params[0]}
          },
        },

          //L1推送
          ManualPushForSubApp:{
                    method:'post',
              requestUrl: urlConfig + "public/v3/OpenAppSubApp/ManualPushForSubApp",
              requestPost: function (params) {
                return {
                  token: params[0],
                };
              },
              requestParams: function (params) {
                return {'':params[0]}
              },
            },

          //应用定义图片上传确定回调
          CallBackForSubAppUploadConfirmed:function () {

          },


        //获取L2授权列表
        GetSubAppConfigForCloud2:{
          method: "get",
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/GetSubAppConfigForCloud",
          requestParams: function (params) {
            return {
              token: params[0],
              cloudID: params[1],
              scopeType: params[2],
              scopeID:params[3],
              subAppName:params[4],
              pageSize: params[5],
              pageIndex: params[6]
            };
          }
        },

        //获取L2规则范围
        GetPartnersByKeyWord:{
          method: "get",
          requestUrl: urlConfig + "sns/v3/OpenApp/GetPartnersByKeyWord",
          requestParams: function (params) {
            return {
              token: params[0],
              keyword: params[1],
              cnt: params[2],
              cloudID:params[3],
            };
          }
        },
        //获取L2配置应用编辑控制（添加和修改前调用）
        GetSubAppEditGrantForCloud:{
          method: "get",
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/GetSubAppEditGrantForCloud",
          requestParams: function (params) {
            return {
              token: params[0],
              subAppGrantID: params[1],
              operType: params[2],
            };
          }
        },

        //保存L2配置应用编辑控制
        SaveSubAppEditGrantForCloud:{
          method:'post',
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/SaveSubAppEditGrantForCloud",
          requestPost: function (params) {

            return {
              token: params[0],
              cloudID: params[1],
            };
          },
          requestParams: function (params) {
            return{
              SubAppGrantID:params[0],
              SubAppID:params[1],
              AclType:params[2],
              ScopeType:params[3],
              ScopeID:params[4],
              OpenType:params[5],
              GTypeList:params[6],
              RTypeList:params[7],
              PhaseList:params[8],
              GrdTypeList:params[9],
                GTypeIsPub:params[10],
                RTypeIsPub:params[11],
                PhaseIsPub:params[12],
                GrdTypeIsPub:params[13]
            }
          },
        },

        //删除L2配置
        RemoveSubAppConfigForCloud:{
          method:'post',
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/RemoveSubAppConfigForCloud",
          requestPost: function (params) {
            return {
              token: params[0],
              grantID: params[1],
              cloudID: params[2],
            };
          } ,
          requestParams:function (params) {
            return {
              token: params[0],
              grantID: params[1],
              cloudID: params[2],
            };
          },
        },

              //L2推送
              ManualPushSubAppGrantForCloud:{
                  method:'post',
                  requestUrl: urlConfig + "public/v3/OpenAppSubApp/ManualPushSubAppGrantForCloud",
                  requestPost: function (params) {
                      return {
                          token: params[0],
                      };
                  },
                  requestParams: function (params) {
                      return {'':params[0]}
                  },
              },


        //获取L3授权列表
        GetSubAppConfigForPartner:{
          method: "get",
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/GetSubAppConfigForPartner",
          requestParams: function (params) {
            return {
              token: params[0],
              cloudID: params[1],
              partnerID: params[2],
              scopeType: params[3],
              scopeID:params[4],
              subAppName:params[5],
              pageSize: params[6],
              pageIndex: params[7]
            };
          }
        },

        //获取L3配置应用编辑控制（添加和修改前调用）
        GetSubAppEditGrantForPartner:{
          method: "get",
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/GetSubAppEditGrantForPartner",
          requestParams: function (params) {
            return {
              token: params[0],
              subAppGrantID: params[1],
              operType: params[2],
                partnerID: params[3],
                scopeType: params[4],
            };
          }
        },


        //保存L3配置应用编辑控制
        SaveSubAppEditGrantForPartner:{
          method:'post',
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/SaveSubAppEditGrantForPartner",
          requestPost: function (params) {
            return {
              token: params[0],
                cloudID: params[1],
                partnerID:params[2]
            };
          },
          requestParams: function (params) {
            return{
              SubAppGrantID:params[0],
              SubAppID:params[1],
              AclType:params[2],
              ScopeType:params[3],
              ScopeID:params[4],
              OpenType:params[5],
              GTypeList:params[6],
              RTypeList:params[7],
              PhaseList:params[8],
              GrdTypeList:params[9],
                GTypeIsPub:params[10],
                RTypeIsPub:params[11],
                PhaseIsPub:params[12],
                GrdTypeIsPub:params[13]
            }
          },
        },


        //删除L3配置
        RemoveSubAppConfigForPartner:{
          method:'post',
          requestUrl: urlConfig + "public/v3/OpenAppSubApp/RemoveSubAppConfigForPartner",
          requestPost: function (params) {
            return {
              token: params[0],
              grantID: params[1],
              cloudID: params[2],
              partnerID: params[3],
            };
          } ,
          requestParams:function (params) {
            return {
              token: params[0],
              grantID: params[1],
              cloudID: params[2],
              partnerID: params[3],
            };
          },
        },

          //L3推送
          ManualPushSubAppGrantForPartner:{
              method:'post',
              requestUrl: urlConfig + "public/v3/OpenAppSubApp/ManualPushSubAppGrantForPartner",
              requestPost: function (params) {
                  return {
                      token: params[0],
                  };
              },
              requestParams: function (params) {
                  return {'':params[0]}
              },
          },

        //图片文件上传
        uploadIcons: {
          method: "post",
          //requestUrl:'http://10.10.12.71:92/v3/OpenAppSubApp/UploadSubAppIcon?attachmentStr={"Path":"ProjIcon","AttachType":1,"ExtName":".png","ResizeMode":1,"SImgResizeMode":2,"CreateThumb":true,"Width":100,"Height":100,"SHeight":50,"SWidth":50}&token=' + APPMODEL.Storage.getItem('applicationToken'),
          requestUrl: urlConfig + 'public/v3/OpenAppSubApp/UploadSubAppIcon?attachmentStr={"Path":"ProjIcon","AttachType":1,"ExtName":".png","ResizeMode":1,"SImgResizeMode":2,"CreateThumb":true,"Width":100,"Height":100,"SHeight":50,"SWidth":50}&token=' + APPMODEL.Storage.getItem('applicationToken'),
          requestParams: function (params) {
            return params;
          },
          requestPost:function (params) {
            return {
              subAppNo:params[0],
              iconsetID:params[1],
              attachType:params[2]

            }
          }

        },

      };
      return service;
    }
    themService.Authorization=AuthorizationServer();

    /*
    合作伙伴管理
    */
    var partnerManagement = function(){
      var service = {
          //获取合作伙伴
          GetPartners:  {
              method: "get",
              requestUrl: urlConfig + "sns/v3/Web/GetPartners",
              requestParams: function (params) {
                  return {
                      token:params[0],
                      cloudID: params[1],
                      name: params[2],
                      Desc: params[3]
                  };
              }
          },
          //添加合作伙伴
          AddPartnter:  {
              method: "post",
              requestUrl: urlConfig + "sns/v3/Web/AddPartner",
              requestPost:function (params) {
                  return {
                      token: params[0],
                  }
              },
              requestParams: function (params) {
                  return {
                      CloudID: params[0],
                      Name: params[1],
                      Desc: params[2]
                  };
              }
          },
          //更新合作伙伴
          UpdatePartnter:  {
              method: "post",
              requestUrl: urlConfig + "sns/v3/Web/UpdatePartner",
              requestPost:function (params) {
                  return {
                      token: params[0],
                  }
              },
              requestParams: function (params) {
                  return {
                      ID:params[0],
                      CloudID: params[1],
                      Name: params[2],
                      Desc: params[3]
                  };
              }
          },
          //查询合作伙伴
          SelectPartnter:  {
              method: "get",
              requestUrl: urlConfig + "sns/v3/Web/GetPartners",
              requestParams: function (params) {
                  return {
                      token: params[0],
                      name: params[1],
                      cloudID:params[2],
                  };
              }
          },
          //查询合作伙伴
          selectPartnter:  {
              method: "get",
              requestUrl: urlConfig + "sns/v3/Web/GetPartners",
              requestParams: function (params) {
                  return {
                      token: params[0],
                      cloudID:params[1],
                  };
              }
          },
          //查询省市县
          GetArea:  {
              method: "get",
              requestUrl: urlConfig + "base/v3/Web/GetRegionList",
              requestParams: function (params) {
                  return {
                      token: params[0],
                      rid:params[1]
                  };
              }
          },
          //获取未分配合作伙伴的列表
          NoPartnterList:  {
              method: "get",
              requestUrl: urlConfig + "sns/v3/Web/GetNoPartnerSchoolList",
              requestParams: function (params) {
                  return {
                      token: params[0],
                      rid:params[1],
                      keyword:params[2]
                  };
              }
          },
          //获取分页数据
          schoolList:  {
              method: "get",
              requestUrl: urlConfig + "sns/v3/Web/GetPageGroups",
              requestParams: function (params) {
                  return {
                      token: params[0],
                      cloudID:params[1],
                      pid:params[2],
                      rid:params[3],
                      keyword:params[4],
                      pageSize:params[5],
                      pageIndex:params[6]
                  };
              }
          },
          //分配合作伙伴
          AddSchoolPartnter:  {
              method: "post",
              requestUrl: urlConfig + "sns/v3/Web/AddPartnerGroup",
              requestPost:function (params) {
                  return {
                      token: params[0],
                      pid:params[1],
                  }
              },
              requestParams: function (params) {
                  return {
                      "":params[0]
                  };
              }
          },
          //删除合作伙伴分配学校
          DeleteSchool:  {
              method: "post",
              requestUrl: urlConfig + "sns/v3/Web/DeletePartnerGroups",
              requestPost:function (params) {
                  return {
                      token: params[0],
                      pid:params[1]
                  }
              },
              requestParams: function (params) {
                  return {
                      "":params[0]
                  };
              }
          },
      }
      return service;
    }
    themService.partner=partnerManagement();

    return themService;
}]
);
