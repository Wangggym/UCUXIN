/**
 * Created by ljq on 2017/8/15.
 */

app.factory('shopInternalService', [function () {
        var shopInternal = {};
        /**
         *  积分
         * **/
        var shopInternalService=function(){

            var service={
                // 分页获得积分策略列表
                internalPolicyList:{
                    method:'get',
                    requestUrl: urlConfig + "point/v3/Web/GetStrategies",
                    requestParams: function (params) {
                        return {
                            appID: 207,
                            token: params[0],
                            parterID: params[1],
                            sType:params[2],
                            st:params[3],
                            search:params[4],
                            pageSize:params[5],
                            pageIndex:params[6],

                        };
                    }
                },
                 //add 积分策略
                AddStrategy:{
                    method:'post',
                   // ContentType:'application/x-www-form-urlencoded',
                    requestUrl: urlConfig + "point/v3/Web/AddStrategy",
                    requestPost: function (params) {
                        return {
                            token: params[0]
                        };
                    },
                    requestParams: function (params) {
                        return{
                            Name:params[0],
                            ST:params[1],
                            AppID:207,
                            ParterID:params[2],
                            SType:params[3],
                            Desc:params[4],
                        }
                    },
                },
                //add 积分策略
                UpdateStrategy:{
                    method:'post',
                    requestUrl: urlConfig + "point/v3/Web/UpdateStrategy",
                    requestPost: function (params) {
                        return {
                            token: params[0]
                        };
                    },
                    requestParams: function (params) {
                        return{
                            ID:params[0],
                            Name:params[1],
                            ST:params[2],
                            AppID:207,
                            ParterID:params[3],
                            SType:params[4],
                            Desc:params[5],
                        }
                    },
                },
                //删除策略
                DeleteStrategy: {
                    method:'post',
                    requestUrl: urlConfig + "point/v3/Web/DeleteStrategy",
                    requestPost: function (params) {
                console.log(params[1]);
                        return {
                            token: params[0],
                           // 'ids[0]':params[1][0]
                        };
                    },
                    requestParams: function (params) {
                        return { '':params[0]}
                    },
                },


                //普通---策略规则 -  普通
                GetBaseRules:{
                    method:'get',
                    requestUrl: urlConfig + "point/v3/Web/GetBaseRules",
                    requestParams: function (params) {
                        return {
                            appID: 207,
                            token: params[0],
                            sid: params[1],
                        };
                    }
                },
                //保存--普通策略规则
                SetBaseRule:{
                    method:'post',
                    requestUrl: urlConfig + "point/v3/Web/SetBaseRule",
                    requestPost: function (params) {
                        return {
                            token: params[0]
                        };
                    },
                    requestParams: function (params) {
                        var arg={
                            ID:params[0],
                            SID:params[1],
                            ActionID:params[2],
                            ST:params[3],
                            Point:params[4],
                            LimitType:params[5],
                            LimitPoint:params[6],
                        }
                        return arg;
                    },

                },

                //删除策略下的关爱使功能
                RemoveStrategyRoles:{
                    method:'post',
                    requestUrl: urlConfig + "point/V3/Web/RemoveStrategyRoles",
                    requestPost: function (params) {
                        return {
                            token: params[0],
                            sID:params[1]
                        };
                    },
                    requestParams: function (params) {
                        var arg={
                          '':params[0]
                        }
                        return arg;
                    },

                },

                //行为
                GetActions:{
                    method:'get',
                    requestUrl: urlConfig + "point/v3/Web/GetActions",
                    requestParams: function (params) {
                        return {
                            appID: 207,
                            token: params[0],
                            sID : params[1],
                            actionType  : params[2],
                        };
                    }
                },



                //营销---策略规则 -  营销
                GetMinRules:{
                    method:'get',
                    requestUrl: urlConfig + "point/v3/Web/GetMinRules",
                    requestParams: function (params) {
                        return {
                            appID: 207,
                            token: params[0],
                            sid: params[1],
                        };
                    }
                },
                //保存--营销策略规则
                SetMinRule:{
                    method:'post',
                    requestUrl: urlConfig + "point/v3/Web/SetMinRule",
                    requestPost: function (params) {
                        return {
                            token: params[0]
                        };
                    },
                    requestParams: function (params) {
                        return{
                            ID:params[0],
                            SID:params[1],
                            ActionID:params[2],
                            ST:params[3],
                            MinPer:params[4],
                            MinPoint:params[5],
                            Per:params[6],
                            PerPoint:params[7],
                        }
                    },

                },

                 //人员清单
                GetStrategyRoles:{
                    method:'get',
                    requestUrl: urlConfig + "point/v3/Web/GetStrategyRoles",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            sID: params[1],
                            pgid:params[2],
                            search:params[3],
                        };
                    }
                },

                //人员清单 --- 生效人员清单
                GetPageStrategyRoles:{
                    method:'get',
                    requestUrl: urlConfig + "point/v3/Web/GetPageStrategyRoles",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            sID: params[1],
                            schID:params[2],
                            search:params[3],
                            pageSize:params[4],
                            pageIndex:params[5],
                        };
                    }
                },


                //获取人员清单-学校列表
                GetCurUserSchool:{
                    method:'get',
                    requestUrl: urlConfig + "COP/v3/Auth/GetCurUserSchool",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            orgid:params[1],
                        };
                    }
                },
                //获取合作伙伴下角色的成员信息-关爱使分页
                GetMembersByRole:{
                    method:'get',
                    requestUrl: urlConfig + "sns/v3/OpenUser/GetMembersByRole",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            partnerID:params[1],
                            roleID:params[2],
                            schID:params[3],
                            pageSize:params[4],
                            pageIndex:params[5]
                        };
                    }
                },
                //删除成员的某种身份角色
                RemoveRoleMember: {
                    method: "post",
                    requestUrl: urlConfig + "sns/v3/OpenUser/RemoveRoleMember",
                    requestPost: function (params) {
                        return {
                            token: params[0],
                            roleID: params[1]
                        };
                    }
                },

                //获取学校下待设置的角色人员-获取选择学校可以设置关爱使的人员
                GetMembersForRoleSelect:{
                    method:'get',
                    requestUrl: urlConfig + "sns/v3/OpenUser/GetMembersForRoleSelect",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            schID:params[1],
                            roleID:params[2],
                            pageSize:params[3],
                            pageIndex:params[4]
                        };
                    }
                },

                //设置机构下成员身份
                SetMemberRoles: {
                    method: "post",
                    requestUrl: urlConfig + "sns/v3/OpenUser/SetMemberRoles",
                    requestParams: function (params) {
                        return {
                            GID: params[0],
                            GName: params[1],
                            GFName: params[2],
                            MID: params[3],
                            Name: params[4],
                            Tel: params[5],
                            UMID: params[6]
                        };
                    },
                    requestPost: function (params) {
                        return {
                            token: params[0]
                        };
                    }
                },


                //保存--积分策略-人员清单配置
                SetStrategyRoles:{
                    method:'post',
                    requestUrl: urlConfig + "point/v3/Web/SetStrategyRoles",
                    requestPost: function (params) {
                        return {
                            token: params[0],
                            sID: params[1],
                            pgid:params[2],

                        };
                    },
                    requestParams: function (params) {
                        return{
                           '':params[0]
                        }
                    },

                },

                 //关爱使 积分
                //人员清单
                GetGAiUserPointsBySchool:{
                    method:'get',
                    requestUrl: urlConfig + "point/v3/web/GetGAiUserPointsBySchool",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            appID:207,
                            schId:params[1],
                        };
                    }
                },

                //增加积分
                IncPointAsync:{
                    method:'post',
                    requestUrl: urlConfig + "point/v3/Web/IncPointAsync",
                    requestPost: function (params) {
                        return {
                            token: params[0],
                            appID:207,
                            actionCode:'presentpoint',
                            pointVal:params[1],
                            desc:params[2],
                            uID:params[3],

                        };
                    },
                    requestParams: function (params) {
                        return{
                            // appID:207,
                            // actionCode:'presentpoint',
                            // pointVal:params[0],
                            // desc:params[1],
                        }
                    },

                },
                //扣减积分
                DecPoint:{
                    method:'post',
                    requestUrl: urlConfig + "point/v3/Web/DecPoint",
                    requestPost: function (params) {
                        return {
                            token: params[0],
                            appID:207,
                            actionCode:'deductpoint',
                            pointVal:-params[1],
                            desc:params[2],
                            uID:params[3],
                        };
                    },
                    requestParams: function (params) {
                        return{
                            // appID:207,
                            // actionCode:'deductpoint',
                            // pointVal:params[0],
                            // desc:params[1],
                        }
                    },

                },



                //积分池
                GetParterPoolDetails:{
                    method:'get',
                    requestUrl: urlConfig + "point/v3/web/GetParterPoolDetails",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            appID:207,
                            parterID:params[1],
                            pageSize:params[2],
                            pageIndex:params[3],
                        };
                    }
                },

                //获取应用下的合作伙伴积分池
                GetParterPoint:{
                    method:'get',
                    requestUrl: urlConfig + "point/v3/web/GetParterPoint",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            appID:207,
                            parterID:params[1],
                        };
                    }
                },

                 //支付时创建订单
                CreatePayOrder:{
                    method:'post',
                    requestUrl: urlConfig + "point/v3/Web/CreatePayOrder",
                    requestPost: function (params) {
                        return {
                            token: params[0],
                            appID:207,
                            ts:Math.round(new Date().getTime()/1000),
                        };
                    },
                    requestParams: function (params) {
                        return{
                            ID:params[0],
                            AppID:params[1],
                            ParterID:params[2],
                            BillNo:params[3],
                            ProdID:params[4],
                            ST:params[5],
                            Amount:params[6],
                            Point:params[7],
                            PayDate:params[8],
                            UID:params[9],
                            Desc:params[10],
                            SignCode:params[11],
                        }
                    },
                },
                //获取支付签名
                GetPaySignCode:{
                    method:'get',
                    requestUrl: urlConfig + "point/v3/Web/GetPaySignCode",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            appID:207,
                            billNo:params[1],
                            amount:params[2],
                            ts:Math.round(new Date().getTime()/1000),
                        };
                    }
                },
                //支付中心支付完成后回调接口
                BackPayStatus:{
                    method:'post',
                    requestUrl: urlConfig + "point/v3/Web/BackPayStatus",
                    requestPost: function (params) {
                        return {
                            token: params[0],

                        };
                    },
                    requestParams: function (params) {
                        return{
                            ChargeID:params[0],
                            OrderNo:params[1],
                            PayStatus:params[2],
                            PayTime:params[3],
                            Channel:params[4],
                            Extra:params[5],
                            CallBackStatus:params[6],
                        }
                    },
                },

                //获取合作伙伴联系人电话
                GetPartnerTel:{
                    method:'get',
                    requestUrl: urlConfig + "point/v3/Web/GetPartnerTel",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            appID:207,
                            parterID:params[1],

                        };
                    }
                },

                SetPartnerTel:{
                    method:'post',
                    requestUrl: urlConfig + "point/v3/Web/SetPartnerTel",
                    requestPost: function (params) {
                        return {
                            token: params[0],

                        };
                    },
                    requestParams: function (params) {
                        return{
                            ID:params[0],
                            AppID:params[1],
                            ParterID:params[2],
                            Tel:params[3],

                        }
                    },
                },


                 //方法名:post 或者get的请求参数
            //
            };
            return service;
        };
          shopInternal.shopService=shopInternalService();

          var integralPondManagement= function () {
               var service={
                   //分页数据
                   GetGAiUserPoints: {
                       method: "get",
                       requestUrl: urlConfig + "point/v3/Web/GetGAiUserPoints",
                       requestParams: function (params) {
                           return params;
                       }
                   },
                   //获取合作伙伴的学校列表信息
                   GetCurUserSchool: {
                       method: "get",
                       requestUrl: urlConfig + "COP/v3/Auth/GetCurUserSchool",
                       requestParams: function (params) {
                           return {
                               token: params[0],
                               orgid: params[1]
                           };
                       }
                   },
                   //获取合作伙伴学校下非关爱使身份的教职员工分页数据API
                   GetMembersForRoleSelect: {
                       method: "get",
                       requestUrl: urlConfig + "sns/v3/OpenUser/GetMembersForRoleSelect",
                       requestParams: function (params) {
                           return params;
                       }
                   },
                   //新增关爱使
                   SetMemberRoles: {
                       method: "post",
                       requestUrl: urlConfig + "sns/v3/OpenUser/SetMemberRoles",
                       requestPost: function (params) {
                           return {
                               token: params[0],
                               mid: params[1]
                           };
                       },
                       requestParams: function (params) {
                           return {
                               '': params[0]
                           }
                       }
                   },
                   //获取当前关爱使适用的策略列表集合
                   GetUserStrategies: {
                       method: "get",
                       requestUrl: urlConfig + "point/v3/Web/GetUserStrategies",
                       requestParams: function (params) {
                           return params;
                       }
                   },
                   //删除策略集
                   DeleteUserStrategy: {
                       method: "post",
                       requestUrl: urlConfig + "point/v3/Web/DeleteUserStrategy",
                       requestPost: function (params) {
                           return {
                               token: params[0],
                               uid: params[1],
                               sid: params[2]
                           };
                       }
                   },
                   //获取直接策略的规则清单
                   GetBaseRules: {
                       method: "get",
                       requestUrl: urlConfig + "point/v3/Web/GetBaseRules",
                       requestParams: function (params) {
                           return {
                               token: params[0],
                               appID: params[1],
                               sid: params[2]
                           };
                       }
                   },
                   //获取间接行为策略下的规则清单
                   GetMinRules: {
                       method: "get",
                       requestUrl: urlConfig + "point/v3/Web/GetMinRules",
                       requestParams: function (params) {
                           return {
                               token: params[0],
                               appID: params[1],
                               sid: params[2]
                           };
                       }
                   },
                   //获取未被当前关爱使设置的策略列表
                   GetStrategyBySelect: {
                       method: "get",
                       requestUrl: urlConfig + "point/v3/Web/GetStrategyBySelect",
                       requestParams: function (params) {
                           return {
                               token: params[0],
                               appID: params[1],
                               parterID: params[2],
                               uid: params[3]
                           };
                       }
                   },
                   //新增用户适用的策略集
                   SetUserStrategy: {
                       method: "post",
                       requestUrl: urlConfig + "Point/v3/Web/SetUserStrategy",
                       requestPost: function (params) {
                           return {
                               token: params[0],
                               sid: params[1],
                               pgid: params[2],
                               uid: params[3]
                           };
                       },
                       requestParams: function (params) {
                           return {
                               '': params[0]
                           }
                       }
                   },
                   //删除关爱使
                   RemoveRoleMember: {
                       method: "post",
                       requestUrl: urlConfig + "sns/v3/OpenUser/RemoveRoleMember",
                       requestPost: function (params) {
                           return {
                               token: params[0],
                               roleID: params[1]
                           };
                       },
                       requestParams: function (params) {
                           return {
                               '': params[0]
                           }
                       }
                   },
                   //获取当前用户任教的班级列表清单
                   GetUserTeachClasses: {
                       method: "get",
                       requestUrl: urlConfig + "Point/v3/Web/GetUserTeachClasses",
                       requestParams: function (params) {
                           return {
                               token: params[0],
                               uid: params[1],
                               pgid: params[2]
                           };
                       }
                   },
                   //增加积分
                   IncPointAsync: {
                       method: "post",
                       requestUrl: urlConfig + "point/v3/Web/IncPointAsync",
                       requestPost: function (params) {
                           return params;
                       }
                   },
                   //消耗积分
                   DecPoint: {
                       method: "post",
                       requestUrl: urlConfig + "point/v3/Web/DecPoint",
                       requestPost: function (params) {
                           return params;
                       }
                   }
               }
               return service;
          }
          shopInternal.integralPondManagement= integralPondManagement();


        return shopInternal;
    }]
);
