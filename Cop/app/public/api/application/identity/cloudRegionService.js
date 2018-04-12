/**
 * Created by Rejoice-min on 2017/7/11.
 * 区域云服务
 */
app.factory('cloudRegionService', [function () {
        var clRegionService = {};

    var cloudRegServer=function(){
        var service={
                    // 获取区域云列表
            GetCloudList:{
                        method:'get',
                        requestUrl: urlConfig + "sns/v3/Web/GetAllClouds",
                        requestParams: function (params) {

                            return {
                                token: params[0],
                            };
                        }
                    },
            AddCloud:{
                method:'post',
                requestUrl: urlConfig + "sns/v3/Web/AddCloud",
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                },
                requestParams: function (params) {
                    return{
                        Code:params[0],
                        Name:params[1],
                        Desc:params[2],
                        UXUri:params[3],
                        CopyRight:params[4],
                        iOSPackName:params[5],
                        AndroidPackName:params[6],
                        WebUrl:params[7],
                    }
                },
            },
            UpdateCloud:{
                method:'post',
                requestUrl: urlConfig + "sns/v3/Web/UpdateCloud",
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                },
                requestParams: function (params) {
                    return{
                        ID:params[0],
                        Code:params[1],
                        Name:params[2],
                        Desc:params[3],
                        UXUri:params[4],
                        CopyRight:params[5],
                        iOSPackName:params[6],
                        AndroidPackName:params[7],
                        WebUrl:params[8],
                    }
                },
            },
            DeleteCloud:{
                method:'post',
                requestUrl: urlConfig + "sns/v3/Web/DeleteCloud",
                requestPost: function (params) {

                    return {
                        token: params[0],
                        'id':params[1]
                    };
                },
                requestParams: function (params) {

                },
            },

            //根据手机号码查找用户
            GetUserByTel:{
                method:'get',
                requestUrl: urlConfig + "sns/v3/Web/GetUserByTel",
                requestParams: function (params) {

                    return {
                        token: params[0],
                        tel:params[1],
                    };
                }
            },
            //添加管理员
            AddOrgAdmin:{
                method:'post',
                requestUrl: urlConfig + "sns/v3/Web/AddOrgAdmin",
                requestPost: function (params) {

                    return {
                        token: params[0],

                    };
                },
                requestParams: function (params) {
                   return {
                       Org:params[0],
                       AdminUser:params[1]
                   }
                },
            },

            DeleteOrgAdmin:{
                method:'post',
                requestUrl: urlConfig + "sns/v3/Web/DeleteOrgAdmin",
                requestPost: function (params) {

                    return {
                        token: params[0],
                        'ID': params[1],

                    };
                },
                requestParams: function (params) {
                    return {

                    }
                },
            },

            //管理员列表
            GetOrgAdminByOrgID:{
                method:'get',
                requestUrl: urlConfig + "sns/v3/Web/GetOrgAdminByOrgID",
                requestParams: function (params) {

                    return {
                        token: params[0],
                        orgID:params[1],
                    };
                }
            },


            //业务领域
            //获取业务领域列表
            GetBUs:{
            method:'get',
                requestUrl: urlConfig + "sns/v3/Web/GetBUs",
                requestParams: function (params) {

                return {
                    token: params[0],
                };
            },

        },
            AddBU:{
                method:'post',
                requestUrl: urlConfig + "sns/v3/Web/AddBU",
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                },
                requestParams: function (params) {
                    return{
                        Name:params[0],
                        Desc:params[1],
                    }
                },
            },
            UpdateBU:{
                method:'post',
                requestUrl: urlConfig + "sns/v3/Web/UpdateBU",
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                },
                requestParams: function (params) {
                    return{
                        ID:params[0],
                        Name:params[1],
                        Desc:params[2],
                        ProdLine:params[3],
                    }
                },
            },
            DeleteBU:{
                method:'post',
                requestUrl: urlConfig + "sns/v3/Web/DeleteBU",
                requestPost: function (params) {

                    return {
                        token: params[0],
                        'id':params[1]
                    };
                },
                requestParams: function (params) {

                },
            },

            //产品线
            GetProdLines:{
                method:'get',
                requestUrl: urlConfig + "sns/v3/Web/GetAllProdLines",
                requestParams: function (params) {

                    return {
                        token: params[0],
                    };
                },

            },
            AddProdLine:{
                method:'post',
                requestUrl: urlConfig + "sns/v3/Web/AddProdLine",
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                },
                requestParams: function (params) {
                    return{
                        Name:params[0],
                        Desc:params[1],
                    }
                },
            },
            UpdateProdLine:{
                method:'post',
                requestUrl: urlConfig + "sns/v3/Web/UpdateProdLine",
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                },
                requestParams: function (params) {
                    return{
                        ID:params[0],
                        Name:params[1],
                        Desc:params[2],
                    }
                },
            },
            DeleteProdLine:{
                method:'post',
                requestUrl: urlConfig + "sns/v3/Web/DeleteProdLine",
                requestPost: function (params) {

                    return {
                        token: params[0],
                        'id':params[1]
                    };
                },
                requestParams: function (params) {

                },
            },

            //获取产品线列表
            GetProdLinesByKeyword:{
                method:'get',
                requestUrl: urlConfig + "sns/v3/Web/GetProdLinesByKeyword",
                requestParams: function (params) {

                    return {
                        token: params[0],
                        keyword:params[1],
                    };
                },
            },
            GetBuByID:{
                method:'get',
                requestUrl: urlConfig + "sns/v3/Web/GetBuByID",
                requestParams: function (params) {

                    return {
                        token: params[0],
                        'ID':params[1],
                    };
                },
            },
            GetPageAdminAccessGroups:{
                method:'get',
                requestUrl: urlConfig + "sns/v3/Web/GetPageAdminAccessGroups",
                requestParams: function (params) {

                    return {
                        token: params[0],
                        pageSize:params[1],
                        pageIndex:params[2],
                        cloudID:params[3],
                        pid:params[4],
                        uid:params[5],
                        rid:params[6],
                        keyword:params[7],
                        isHaveAccess:params[8],
                    };
                },
            },
            // 添加合作伙伴管理员数据权限
            AddGroupAdmins:{
                method:'post',
                requestUrl: urlConfig + "sns/v3/Web/AddGroupAdmins",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        pid:params[1],
                        adminUID:params[2],
                    };
                },
                requestParams: function (params) {
                    return {
                        '':params[0],
                    };
                },
            },



            //获取全局table
            GetGlobalTabs:{
                method:'get',
                requestUrl: urlConfig + "public/v3/TabWeb/GetGlobalTabs",
                requestPost: function (params) {

                },
                requestParams: function (params) {
                    return {
                        token: params[0],
                    };
                },

            },
            //获取单个table
            GetGlobalTab:{
                method:'get',
                requestUrl: urlConfig + "public/v3/TabWeb/GetGlobalTab",
                requestPost: function (params) {
                    return {

                    };
                },
                requestParams: function (params) {
                    return {
                        token: params[0],
                        tabID:params[1],
                    };
                },

            },

        //    删除tab
            RemoveGlobalTab:{
                method:'post',
                requestUrl: urlConfig + "public/v3/TabWeb/RemoveGlobalTab",

                requestParams: function (params) {
                    return {

                    };

                },
                requestPost: function (params) {
                    return {

                        token: params[0],
                        TabID:params[1],
                    };
                },
            },
        //    保存tab
            SaveGlobalTab:{
                method:'post',
                requestUrl: urlConfig + "public/v3/TabWeb/SaveGlobalTab",

                requestParams: function (params) {
                    return {
                        TabID:params[0],
                        Name: params[1],
                        Desc: params[2],
                        Icon1: params[3],
                        Icon2: params[4],
                        Icon3: params[5],
                        ActType: params[6],
                        Url: params[7],
                        SNO: params[8],
                        Visible: params[9],
                        ST: params[10],
                        Grants: params[11],
                        GrantsDesc:params[12],
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0],

                    };
                },
            },
            // //    编辑tab
            // EditOrgTabs:{
            //     method:'post',
            //     requestUrl: urlConfig + "public/v3/TabWeb/EditOrgTabs",
            //
            //     requestParams: function (params) {
            //         return {
            //             OrgTabID:params[0],
            //             OrgType:params[1],
            //             OrgID:params[2],
            //             TabID:params[3],
            //             Name: params[4],
            //             Desc: params[5],
            //             Icon1: params[6],
            //             Icon2: params[7],
            //             Icon3: params[8],
            //             ActType: params[9],
            //             Url: params[10],
            //             SNO: params[11],
            //             Visible: params[12],
            //             ST: params[13],
            //             Grants: params[14],
            //             GrantsDesc:params[15],
            //         };
            //     },
            //     requestPost: function (params) {
            //         return {
            //             token: params[0],
            //
            //         };
            //     },
            // },
        //    排序tab
            SortGlobalTabs:{
                method:'post',
                requestUrl: urlConfig + "public/v3/TabWeb/SortGlobalTabs",

                requestParams: function (params) {
                    return {
                        Tabs:params[0]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0],
                    };
                },
            },
        //    可见性
            SetGlobalTabVisibility:{
                method:'post',
                requestUrl: urlConfig + "public/v3/TabWeb/SetGlobalTabVisibility",

                requestParams: function (params) {
                    return {

                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0],
                        tabID: params[1],
                        visible: params[2],
                    };
                },
            },
        //状态
            SetGlobalTabStatus:{
            method:'post',
                requestUrl: urlConfig + "public/v3/TabWeb/SetGlobalTabStatus",

                requestParams: function (params) {
                return {

                };
            },
            requestPost: function (params) {
                return {
                    token: params[0],
                    tabID: params[1],
                    enable: params[2],

                };
            },
        },



                //获取教育阶段
                GetPhaseList:{
                    method: "get",
                    requestUrl: urlConfig + "sns/v3/OpenApp/GetPhaseList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            gID: params[1]
                        };
                    }
                },


                //获取角色
                GetRoleTypeTree:{
                    method: "get",
                    requestUrl: urlConfig + "sns/v3/OpenApp/GetRoleTypeTree",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                        };
                    }
                },
                //获取机构类型
                GetGroupTypeList:{
                    method: "get",
                    requestUrl: urlConfig + "sns/v3/OpenApp/GetGroupTypeList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            level:params[1],
                            pGTypeID:params[2],
                        };
                    }
                },

                //获取年级段
                GetGradeTypeList:{
                    method: "get",
                    requestUrl: urlConfig + "sns/v3/OpenApp/GetGradeTypeList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                        };
                    }
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
    };
    clRegionService.couldRegion=cloudRegServer();


      return clRegionService;
    }]
);
