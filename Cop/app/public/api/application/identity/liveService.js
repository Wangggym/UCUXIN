/**
 * Created by Rejoice-min on 2017/7/11.
 */
app.factory('liveService', [function () {
        var liveService = {};

        var liverAfterManage=function () {
            var service={


            }
            return service;
        }
        liveService.afterManage=liverAfterManage();


        /*
         * 优信直播官方后台
         * */
        var liveOfficialBackground = function () {
            var service={
                /********************************************************用户管理Start*****************************************************************************/
                //获取直播员列表
                GetAnchorList:{

                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopUserWeb/GetAnchorList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            Status: params[1],
                            Keyword:params[2],
                            PageIndex:params[3],
                            PageSize:params[4],
                            SortFieldList:params[5],
                            IsMoke:params[6],
                            OrgLevel:params[7],
                            OrgID:params[8],
                            GID:params[9]
                        };
                    }
                },
                //获取发布员列表
                GetPubMbrList:{

                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopUserWeb/GetPubMbrList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            Status: params[1],
                            Keyword:params[2],
                            PageIndex:params[3],
                            PageSize:params[4],
                            SortFieldList:params[5],
                            IsMoke:params[6],
                            OrgLevel:params[7],
                            OrgID:params[8],
                            GID:params[9],
                            PtnID:params[10],
                        };
                    }
                },
                //获取受众用户列表
                GetUserList:{

                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopUserWeb/GetUserList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            PtnID:params[1],
                            GID:params[2],
                            ClassID:params[3],
                            Status:params[4],
                            Keyword:params[5],
                            PageIndex:params[6],
                            PageSize:params[87],
                            SortFieldList:params[8],
                            IsMoke:params[9],
                            OrgLevel:params[10],
                            OrgID:params[11]
                        };
                    }
                },

                //分页获取用户观看记录列表
                GetUserLiveNav:{
                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopUserWeb/GetUserLiveNav",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            UID: params[1],
                            Year:params[2],
                            Month:params[3],
                            PageIndex:params[4],
                            PageSize:params[5],
                            SortFieldList:params[6],
                            IsMoke:params[7],
                            OrgLevel:params[8],
                            OrgID:params[9]
                        };
                    }

                },
                //分页获取直播员直播记录列表
                GetAnchorLiveNav:{

                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopUserWeb/GetAnchorLiveNav",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            AcrUID: params[1],
                            GID:params[2],
                            GTypeID:params[3],
                            Status:params[4],
                            Keyword:params[5],
                            LiveStartDate:params[6],
                            LiveEndDate:params[7],
                            PageIndex:params[8],
                            PageSize:params[9],
                            SortFieldList:params[10],
                            IsMoke:params[11],
                            OrgLevel:params[12],
                            OrgID:params[13]
                        };
                    }
                },
                //分页获取发布员员发布记录列表
                GetPubMbrLiveNav:{

                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopUserWeb/GetPubMbrLiveNav",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            PubUID: params[1],
                            GTypeID:params[2],
                            Status:params[3],
                            Keyword:params[4],
                            PubStartDate:params[5],
                            PubEndDate:params[6],
                            PageIndex:params[7],
                            PageSize:params[8],
                            SortFieldList:params[9],
                            IsMoke:params[10],
                            OrgLevel:params[11],
                            OrgID:params[12]
                        };
                    }
                },

                //禁言或开启(解禁)
                Disabled:{

                    method:"post",
                    requestUrl:urlConfig + "Live/v3/CopUserWeb/Disabled",
                    requestPost: function (params) {
                        return {
                            token: params[0],
                            //-1：禁言 1：开启
                            isDisabled: params[1],
                            IsMoke:params[2],
                            OrgLevel:params[3],
                            OrgID:params[4]
                        };
                    },
                    requestParams: function (params) {
                        return {

                            DisabledUserInfos: params[0],
                            isDisabled: params[1],
                        };
                    },

                },
                //禁言或开启(解禁) 直播弹幕不能禁言，只能禁止评论
                Shutup:{
                    method:"post",
                    requestUrl:urlConfig + "Live/v3/CopUserWeb/Shutup",
                    requestPost: function (params) {

                        return {
                            token: params[0],
                            //-1：封号 1：开启
                            isShutup: params[1],
                            IsMoke:params[2],
                            OrgLevel:params[3],
                            OrgID:params[4]
                        };
                    },
                    requestParams: function (params) {
                        return {

                            ShutupUserInfos: params[0],
                            IsShutup: params[1],
                        };
                    },

                },

                //获取区域
                getUserRegion:{
                    method:"get",
                    requestUrl:urlConfig + "base/v3/Web/GetRegionByKeyword",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            keyword: params[1],
                            cnt :params[2],
                            level:params[3],
                        };
                    }
                },

                //获取根据关键字获取合作伙伴列表
                GetPartnerByKeyword:{
                    method:"get",
                    requestUrl:urlConfig + "sns/v3/Web/GetPartnerByKeyword",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            keyword: params[1],
                            OrgLevel:params[2],
                            OrgID:params[3]
                        };
                    }
                },
               // http://api.dev.ucuxin.com/sns/Help/Api/GET-v3-Web-GetPartnerByKeyword_keyword



                /********************************************************用户管理end*****************************************************************************/
                /********************************************************机构管理start*****************************************************************************/

                //分页获取机构列表
                GetPubGroupList:{

                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopGroupWeb/GetPubGroupList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            GTypeID: params[1],
                            Status:params[2],
                            Keyword:params[3],
                            PageIndex:params[4],
                            PageSize:params[5],
                            SortFieldList:params[6],
                            IsMoke:params[7],
                            OrgLevel:params[8],
                            OrgID:params[9]
                        };
                    }
                },

                //分页获取机构直播记录导航列表
                GetGroupLiveNav_GRP:{

                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopGroupWeb/GetGroupLiveNav",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            GID: params[1],
                            GTypeID:params[2],
                            Status:params[3],
                            LiveStartDate:params[4],
                            LiveEndDate:params[5],
                            Keyword:params[6],
                            PageIndex:params[7],
                            PageSize:params[8],
                            SortFieldList:params[9],
                            IsMoke:params[10],
                            OrgLevel:params[11],
                            OrgID:params[12]
                        };
                    }
                },


                //分页获取机构直播发布记录列表
                GetGroupPubNav_GRP:{

                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopGroupWeb/GetGroupPubNav",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            GID: params[1],
                            GType:params[2],
                            Status:params[3],
                            PubStartDate:params[4],
                            PubEndDate:params[5],
                            Keyword:params[6],
                            PageIndex:params[7],
                            PageSize:params[8],
                            SortFieldList:params[9],
                            IsMoke:params[10],
                            OrgLevel:params[11],
                            OrgID:params[12]
                        };
                    }
                },



                //获取直播机构信息
                GetPubGroup:{

                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopGroupWeb/GetPubGroup",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            ID: params[1],
                            IsMoke:params[2],
                            OrgLevel:params[3],
                            OrgID:params[4]
                        };
                    }
                },

                //禁言或开启(解禁)
                CopGroupWebDisabled:{

                    method:"post",
                    requestUrl:urlConfig + "Live/v3/CopGroupWeb/Disabled",
                    requestPost: function (params) {
                        return {
                            token: params[0],
                            //-1：禁言 1：开启
                            isDisabled: params[1],
                            IsMoke:params[2],
                            OrgLevel:params[3],
                            OrgID:params[4]
                        };
                    },
                    requestParams: function (params) {
                        return {

                            '': params[0],
                        };
                    },

                },



                //添加或修改直播机构
                SavePubGroup:{

                    method:"post",
                    requestUrl:urlConfig + "Live/v3/CopGroupWeb/SavePubGroup",
                    requestPost: function (params) {
                        return {
                            token: params[0],
                            IsMoke:params[1],
                            OrgLevel:params[2],
                            OrgID:params[3],
                        };
                    },
                    requestParams: function (params) {
                        return {
                            ID: params[0],
                            GID: params[1],
                            GrpName:params[2],
                            MasterName:params[3],
                            MasterTel:params[4],
                            FreeCnt:params[5],
                            FreeStartDate:params[6],
                            FreeEndDate:params[7],
                            Channels:params[8],
                            IsSpec:params[9],
                            IsAllowSelf:params[10],
                            IsAllowOther:params[11],
                            RegionList:params[12],
                            PhaseList:params[13],
                            GrpList:params[14],
                        };
                    },

                },

                //按关键字获取区域
                GetRegionByKeyword:{

                    method:"get",
                    requestUrl:urlConfig + "base/v3/Web/GetRegionByKeyword",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            keyword: params[1],
                            cnt:params[2],
                            level:params[3],
                        };
                    }
                },

                //获取教育阶段
                GetPhaseList:{
                    method:"get",
                    requestUrl:urlConfig + "base/v3/Web/GetPhaseList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                        };
                    }
                },

                //获取学校/机构列表
                GetSchoolList:{
                    method:"get",
                    requestUrl:urlConfig + "sns/v3/Web/GetSchoolList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            keyWord:params[1],
                            rid:params[2],
                        };
                    }
                },
                // 获取学校 根据关键字
                GetCompanysByKeyWord: {
                    method: "get",
                    requestUrl: urlConfig + "sns/v3/OpenApp/GetCompanysByKeyWord",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            keyWord: params[1],
                            cloudID: params[2],
                            ptnID: params[3],
                        };
                    }
                },

                /********************************************************机构管理end*****************************************************************************/
                /**********************************************************直播管理Start*********************************************************************/
                //   分页获取直播预告数据列表
                GetLivePreList:{
                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopLiveWeb/GetLivePreList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            GTypeID: params[1],
                            Status:params[2],
                            PubStartDate:params[3],
                            PubEndDate:params[4],
                            LiveStartDate:params[5],
                            LiveEndDate:params[6],
                            Keyword:params[7],
                            PageIndex:params[8],
                            PageSize:params[9],
                            SortFieldList:params[10],
                            IsMoke:params[11],
                            OrgLevel:params[12],
                            OrgID:params[13]
                        };
                    }
                },

                //分页获取直播进行中数据列表
                GetLiveIngList:{
                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopLiveWeb/GetLiveIngList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            GTypeID: params[1],
                            Status:params[2],
                            Keyword:params[3],
                            PubStartDate:params[4],
                            PubEndDate:params[5],
                            LiveStartDate:params[6],
                            LiveEndDate:params[7],
                            PageIndex:params[8],
                            PageSize:params[9],
                            SortFieldList:params[10],
                            IsMoke:params[11],
                            OrgLevel:params[12],
                            OrgID:params[13]

                        };
                    }
                },

                //分页获取往期回顾的直播列表
                CopLiveHisList:{
                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopLiveWeb/CopLiveHisList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            GTypeID: params[1],
                            Status:params[2],
                            Keyword:params[3],
                            PubStartDate:params[4],
                            PubEndDate:params[5],
                            LiveStartDate:params[6],
                            LiveEndDate:params[7],
                            PageIndex:params[8],
                            PageSize:params[9],
                            SortFieldList:params[10],
                            IsMoke:params[11],
                            OrgLevel:params[12],
                            OrgID:params[13]

                        };
                    }
                },

                //分页获取某个发布员的直播数据(可按直播进度查询)
                GetPubLivingList:{
                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopLiveManagerWeb/GetPubLivingList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            PublisherID: params[1],
                            Progress:params[2],
                            Status:params[3],
                            Key:params[4],
                            PubStartTime:params[5],
                            PubEndTime:params[6],
                            PageIndex:params[7],
                            PageSize:params[8],
                            SortFieldList:params[9],
                            IsMoke:params[10],
                            OrgLevel:params[11],
                            OrgID:params[12]

                        };
                    }
                },

                //禁播或解禁
                Forbid:{
                    method:"post",
                    requestUrl:urlConfig + "Live/v3/CopLiveWeb/Forbid",

                    requestPost: function (params) {
                        return {
                            token: params[0],
                            isForbid: params[1],
                            IsMoke:params[2],
                            OrgLevel:params[3],
                            OrgID:params[4]
                        };
                    },
                    requestParams: function (params) {
                        return {
                            '':params[0]
                        };
                    },
                },

                /**********************************************************直播管理End*********************************************************************/
                /**********************************************************数据统计Start*********************************************************************/
                //分页获取各个频道的统计数据列表
                GetDataStatList:{
                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopDataStatWeb/GetDataStatList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            Type: params[1],
                            StartDate:params[2],
                            EndDate:params[3],
                            PageIndex:params[4],
                            PageSize:params[5],
                            SortFieldList:params[6],
                            IsMoke:params[7],
                            OrgLevel:params[8],
                            OrgID:params[9]

                        };
                    }
                },

                //分页获取各个频道的数据明细列表(按机构排行)
                GetGroupDataStatDetlList:{
                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopDataStatWeb/GetGroupDataStatDetlList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            LiveChannel: params[1],
                            Type:params[2],
                            StartDate:params[3],
                            EndDate:params[4],
                            PageIndex:params[5],
                            PageSize:params[6],
                            SortFieldList:params[7],
                            IsMoke:params[8],
                            OrgLevel:params[9],
                            OrgID:params[10],

                        };
                    }
                },

                //分页获取各个频道的数据明细列表(按合作伙伴排行)
                GetPartnerDataStatDetlList:{
                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopDataStatWeb/GetPartnerDataStatDetlList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            LiveChannel: params[1],
                            Type:params[2],
                            StartDate:params[3],
                            EndDate:params[4],
                            PageIndex:params[5],
                            PageSize:params[6],
                            SortFieldList:params[7],
                            IsMoke:params[8],
                            OrgLevel:params[9],
                            OrgID:params[10],

                        };
                    }
                },

                //视频数量、分享量、评论量、点赞量、收藏量统计图表（某年）
                StatDataBarChart:{
                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopDataStatWeb/StatDataBarChart",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            Type: params[1],
                            LiveChannel:params[2],
                            PtnID:params[3],
                            GID:params[4],
                            Year:params[5],
                            IsMoke:params[6],
                            OrgLevel:params[7],
                            OrgID:params[8]
                        };
                    }
                },

                //获取各市统计数据（某年）(暂时不需要)
                GetCityStat:{
                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopDataStatWeb/GetCityStat",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            Type: params[1],
                            LiveChannel:params[2],
                            Year:params[3],
                            IsMoke:params[4],
                            OrgLevel:params[5],
                            OrgID:params[6]
                        };
                    }
                },

                //获取各省统计数据（某年）(暂时不需要)
                GetProvinceStat:{
                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopDataStatWeb/GetProvinceStat",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            Type: params[1],
                            LiveChannel:params[2],
                            Year:params[3],
                            IsMoke:params[4],
                            OrgLevel:params[5],
                            OrgID:params[6]
                        };
                    }
                },

                //获取各版本统计数据（某年）(暂时不需要)
                GetVersionStat:{
                    method:"get",
                    requestUrl:urlConfig + "Live/v3/CopDataStatWeb/GetVersionStat",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            Type: params[1],
                            LiveChannel:params[2],
                            Year:params[3],
                            IsMoke:params[4],
                            OrgLevel:params[5],
                            OrgID:params[6]
                        };
                    }
                },

                /**********************************************************数据统计END*********************************************************************/
                /**********************************************************广告管理Start*********************************************************************/
                //分页获取广告信息列表
                GetADList:{
                    method:'get',
                    requestUrl:urlConfig + "Live/v3/CopADWeb/GetADList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            PageIndex: params[1],
                            PageSize:params[2],
                            SortFieldList:params[3],
                            IsMoke:params[4],
                            OrgLevel:params[5],
                            OrgID:params[6]
                        };
                    }
                },

                //广告上线或下线
                Downline:{
                    method:"post",
                    requestUrl:urlConfig + "Live/v3/CopADWeb/Downline/",
                    requestParams: function (params) {
                        return {


                        };
                    },
                    requestPost:function(params){
                        return {
                            token: params[0],
                            id: params[1],
                            isDownline:params[2],
                            IsMoke:params[3],
                            OrgLevel:params[4],
                            OrgID:params[5]
                        };
                    },
                },
                //获取广告信息
                GetAD:{
                    method:"post",
                    requestUrl:urlConfig + "Live/v3/CopADWeb/GetAD",
                    requestParams: function (params) {
                        return {
                            //token: params[0],
                            //id: params[1],
                            //IsMoke:params[2],
                        };
                    },
                    requestPost:function(params){
                        return {
                            token: params[0],
                            id: params[1],
                            IsMoke:params[2],
                            OrgLevel:params[3],
                            OrgID:params[4]
                        };
                    }
                },
                //发布或修改广告
                SaveAD:{
                    method:"post",
                    requestUrl:urlConfig + "Live/v3/CopADWeb/SaveAD",
                    requestParams: function (params) {
                        return {
                            ID: params[0],
                            Title: params[1],
                            Url: params[2],
                            ValidStartDate: params[3],
                            ValidEndDate: params[4],
                            OrgLevel:params[5],
                            OrgID:params[6]
                        };
                    }
                    ,
                    requestPost:function(params){
                        return {

                            token: params[0],
                            IsMoke:params[1],
                        };
                    }
                },
                /**********************************************************广告管理End*********************************************************************/
                /**********************************************************流量管理Start*********************************************************************/
                //获取总流量数【页面80】
                GetFlowCount:{
                    method:'get',
                    requestUrl:urlConfig + "Live/v3/CopFlowWeb/GetFlowCount",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            LiveChannel: params[1],
                            Year:params[2],
                            Month:params[3],
                            IsMoke:params[4],
                            OrgLevel:params[5],
                            OrgID:params[6]
                        };
                    }
                },

                //获取流量消耗月份趋势图数据【页面80】
                GetFlowBarChart:{
                    method:'get',
                    requestUrl:urlConfig + "Live/v3/CopFlowWeb/GetFlowBarChart",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            LiveChannel: params[1],
                            Year:params[2],
                            Month:params[3],
                            IsMoke:params[4],
                            OrgLevel:params[5],
                            OrgID:params[6]
                        };
                    }
                },

                //获取流量消耗分布图数据【页面80】
                GetFlowPieChart:{
                    method:'get',
                    requestUrl:urlConfig + "Live/v3/CopFlowWeb/GetFlowPieChart",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            LiveChannel: params[1],
                            Year:params[2],
                            Month:params[3],
                            IsMoke:params[4],
                            OrgLevel:params[5],
                            OrgID:params[6]
                        };
                    }
                },
                //分页获取合作伙伴流量明细列表【新加页面】
                GetPartnerFlowDetlList:{
                    method:'get',
                    requestUrl:urlConfig + "Live/v3/CopFlowWeb/GetPartnerFlowDetlList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            LiveChannel: params[1],
                            PtnID: params[2],
                            Year:params[3],
                            Month:params[4],
                            PageIndex:params[5],
                            PageSize:params[6],
                            SortFieldList:params[7],
                            IsMoke:params[8],
                            OrgLevel:params[9],
                            OrgID:params[10]
                        };
                    }
                },

                //分页获取学校流量明细列表
                GetSchoolFlowDetlList:{
                    method:'get',
                    requestUrl:urlConfig + "Live/v3/CopFlowWeb/GetSchoolFlowDetlList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            LiveChannel: params[1],
                            PtnID: params[2],
                            GID: params[3],
                            Year:params[4],
                            Month:params[5],
                            PageIndex:params[6],
                            PageSize:params[7],
                            SortFieldList:params[8],
                            IsMoke:params[9],
                            OrgLevel:params[10],
                            OrgID:params[11]
                        };
                    }
                },
                //分页获取班级流量明细列表
                GetClassFlowDetlList:{
                    method:'get',
                    requestUrl:urlConfig + "Live/v3/CopFlowWeb/GetClassFlowDetlList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            LiveChannel: params[1],
                            PtnID: params[2],
                            SchoolID: params[3],
                            ClassID:params[4],
                            Year:params[5],
                            Month:params[6],
                            PageIndex:params[7],
                            PageSize:params[8],
                            SortFieldList:params[9],
                            IsMoke:params[10],
                            OrgLevel:params[11],
                            OrgID:params[12]
                        };
                    }
                },
                //分页获取用户流量明细列表
                GetUserFlowDetlList:{
                    method:'get',
                    requestUrl:urlConfig + "Live/v3/CopFlowWeb/GetUserFlowDetlList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            LiveChannel: params[1],
                            PtnID: params[2],
                            GID: params[3],
                            ClassID: params[4],
                            Year:params[5],
                            Month:params[6],
                            Keyword:params[7],
                            PageIndex:params[8],
                            PageSize:params[9],
                            SortFieldList:params[10],
                            IsMoke:params[11],
                            OrgLevel:params[12],
                            OrgID:params[13]
                        };
                    }
                },

                /**********************************************************流量管理End*********************************************************************/

            };

            return service;
        }
        liveService.officialBackground = liveOfficialBackground();
        return liveService;
    }]
);
