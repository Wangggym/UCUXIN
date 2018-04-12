/**
 * Created by fanweihua on 8/8/2016.
 * parApplicationService
 * partners application service API collection of interface
 */
app.factory('parApplicationService', [function () {
    var service = {};
    /**
     * 应用收费开通
     * @returns {{GetFuncServiceProductList: {method: string, requestUrl: string, requestParams: requestParams}, AddFuncServiceProduct: {method: string, requestUrl: string, requestParams: requestParams}, GetOrgSchool: {method: string, requestUrl: string, requestParams: requestParams}, getClassList: {method: string, requestUrl: string, requestParams: requestParams}, GetFuncServiceProduct: {method: string, requestUrl: string, requestParams: requestParams}, GetProductGroupPage: {method: string, requestUrl: string, requestParams: requestParams}, UpdateFuncServiceProduct: {method: string, requestUrl: string, requestParams: requestParams}, GetOrgList: {method: string, requestUrl: string, requestParams: requestParams}, GetOrgSchoolPage: {method: string, requestUrl: string, requestParams: requestParams}, GetProductOpenPage: {method: string, requestUrl: string, requestParams: requestParams}, AddStuFuncServiceByGive: {method: string, requestUrl: string, requestParams: requestParams}, GetProductListByGid: {method: string, requestUrl: string, requestParams: requestParams}, GetStudentList: {method: string, requestUrl: string, requestParams: requestParams}, GetGiveList: {method: string, requestUrl: string, requestParams: requestParams}, GetOfflinePayList: {method: string, requestUrl: string, requestParams: requestParams}, ConfirmOfflinePay: {method: string, requestUrl: string, requestParams: requestParams}}}
     */
    var applicationFeeOpenService = function () {
        var service = {
            //根据合作伙伴ID获取服务包列表
            GetFuncServiceProductList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetAllFuncServiceProductList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orgid: params[1]
                    };
                }
            },
            //新增服务产品包
            AddFuncServiceProduct: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/AddFuncServiceProduct?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        ID: params[0],//ID
                        Name: params[1],//产品名称
                        SDate: params[2],//购买开始时间
                        EDate: params[3],//购买结束时间
                        Amount: params[4],//金额
                        FuncServiceProductID: params[5],//依赖的产品包
                        PartnerID: params[6],//合作伙伴
                        Type: params[7],//类型(1,2)
                        FuncServiceProductItemListModel: params[8],//服务项列表
                        FuncServiceProductGroupListModel: params[9],//分配学校列表
                        Desc: params[10]//说明
                    };
                }
            },
            //获取当前用户的学校权限
            GetOrgSchool: {
                method: "get",
                requestUrl: urlConfig + "COP/v3/Org/GetOrgSchoolPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pIndex: params[1],
                        pSize: params[2],
                        orgid: params[3],
                        name: params[4]
                    };
                }
            },
            //根据学校ID获取班级列表
            getClassList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetClassList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1]
                    };
                }
            },
            //根据服务包ID获取明细（服务项列表）
            GetFuncServiceProduct: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetFuncServiceProduct",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        ID: params[1]
                    };
                }
            },
            //根据产品包ID获取分配学校的分页数据
            GetProductGroupPage: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetProductGroupPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        ID: params[1],
                        pageSize: params[2],
                        pageIndex: params[3]
                    };
                }
            },
            //更新服务产品包
            UpdateFuncServiceProduct: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/UpdateFuncServiceProduct?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        ID: params[0],
                        FuncServiceProductGroupListModel: params[1]
                    };
                }
            },
            //获取组织机构列表
            GetOrgList: {
                method: "get",
                requestUrl: urlConfig + "COP/v3/Org/GetOrgList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        type: params[1]
                    };
                }
            },
            //获取合作伙伴的学校权限
            GetOrgSchoolPage: {
                method: "get",
                requestUrl: urlConfig + "COP/v3/Org/GetOrgSchoolPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pIndex: params[1],
                        pSize: params[2],
                        orgid: params[3],
                        name: params[4]
                    };
                }
            },
            //产品包开通情况查询（内部运营/合作伙伴）
            GetProductOpenPage: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetProductOpenPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageSize: params[1],
                        pageIndex: params[2],
                        orgid: params[3],
                        gid: params[4],
                        funcServiceProductID: params[5]
                    };
                }
            },
            //赠送学生服务包
            AddStuFuncServiceByGive: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/AddStuFuncServiceByGive?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        OrgID: params[0],
                        GID: params[1],
                        FName: params[2],
                        ClassID: params[3],
                        ClassName: params[4],
                        FuncServiceProductID: params[5],
                        FuncServiceProductName: params[6],
                        UMIDList: params[7]
                    };
                }
            },
            //根据学校ID获取购买有效的产品包列表（正在热销，将要推出）
            GetProductListByGid: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetProductListByGid",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        classid: params[2]
                    };
                }
            },
            //获取学生列表
            GetStudentList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetStudentList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        classid: params[2],
                        stuName: params[3]
                    };
                }
            },
            //获取学校赠送服务包列表
            GetGiveList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetGiveList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        orgid: params[2],
                        pageSize: params[3],
                        pageIndex: params[4]
                    };
                }
            },
            //获取线下收费学生名单（根据学校ID、服务包、获取学生缴费情况名单）
            GetOfflinePayList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetOfflinePayList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        productID: params[2],
                        payStatus: params[3],
                        classID: params[4],
                        stuName: params[5]
                    };
                }
            },
            //确认线下缴费
            ConfirmOfflinePay: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/ConfirmOfflinePay?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        FuncServiceProductID: params[1],
                        ConfirmOfflinePayStuList: params[2]
                    };
                }
            },
            //生成订单,返回订单ID
            AddOrder: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/ChargeH5User/AddOrder?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        ChargeIDs: params[1],
                        UMIDs: params[2]
                    };
                }
            },
            //获取订单详细信息（包括学生列表，产品包列表）
            GetOrderByID: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeH5User/GetOrderByID",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orderID: params[1]
                    };
                }
            },
            //获取签名
            GetSign: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeH5User/GetSign",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orderID: params[1],
                        timeStamp: params[2]
                    };
                }
            },

            GetBody: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeH5User/GetBody",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orderID: params[1]
                    };
                }
            },
            //支付请求
            PaymentRequest: {
                method: "post",
                requestUrl: urlConfig + "Pay/v3/Pay/BeforeGenerate",
                requestParams: function (params) {
                    return {
                        OrderNo: params[0],
                        AppId: params[1],
                        PayProductId: params[2],
                        UserId: params[3],
                        Amount: params[4],
                        Subject: params[5],
                        Body: params[6],
                        TimeStamp: params[7],
                        TimeExpire: params[8],
                        Sign: params[9],
                        Channel: params[10],
                        Currency: params[11]
                    };
                }
            },
            //点击支付渠道后更新该订单的支付渠道
            UpdateChannel: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeH5User/UpdateChannel",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orderID: params[1],
                        Channel: params[2]
                    };
                }
            },
            //获取所有的学校配置记录
            GetAllGroupConfig: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetAllGroupConfig",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orgid: params[1],
                        gid: params[2]
                    };
                }
            },
            //图片文件上传
            imageFileUpload: {
                method: "post",
                requestUrl: urlConfig + 'base/v3/OpenApp/UploadAttachment?attachmentStr={"Path":"charge","AttachType":1,"ExtName":".jpg","ResizeMode":1,"SImgResizeMode":2,"CreateThumb":true,"Width":100,"Height":100,"SHeight":50,"SWidth":50}&token=' + APPMODEL.Storage.getItem('applicationToken'),
                requestParams: function (params) {
                    return params;
                }
            }
        };
        return service;
    };
    service.applicationFeeOpen = applicationFeeOpenService();
    /**
     * 缴费报表查询
     * @returns {{getSchoolList: {method: string, requestUrl: string, requestParams: requestParams}, getClassList: {method: string, requestUrl: string, requestParams: requestParams}, getProductList: {method: string, requestUrl: string, requestParams: requestParams}, getFuncAppList: {method: string, requestUrl: string, requestParams: requestParams}, getAlreadyPaymentStudentList: {method: string, requestUrl: string, requestParams: requestParams}, getNoPaymentStudentList: {method: string, requestUrl: string, requestParams: requestParams}, getNoPaymentStudentDetail: {method: string, requestUrl: string, requestParams: requestParams}, getCostStatisticsList: {method: string, requestUrl: string, requestParams: requestParams}}}
     */
    var paymentTableSearchService = function () {
        var service = {
            // 获取当前用户学校列表
            getSchoolList: {
                method: "get",
                requestUrl: urlConfig + "COP/v3/Auth/GetCurUserSchool",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orgid: params[1]
                    };
                }
            },
            // 根据学校ID获取班级列表
            getClassList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetClassList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1]
                    };
                }
            },
            // 根据学校ID与班级ID（班级非必需）获取服务包列表
            getProductList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetProductListByGid",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        classid: params[2] ? params[2] : 0
                    };
                }
            },
            // 根据学校ID与班级ID（班级非必需）获取服务包列表(缴费未成功查询)
            getProductListNew: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetChargeByGid",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        classid: params[2] ? params[2] : 0
                    };
                }
            },
            /*            // 根据服务包ID获取服务项列表
             getFuncAppList: {
             method: "get",
             requestUrl: urlConfig + "Charge/v3/ChargeH5User/GetFuncAppListByFuncProductID",
             requestParams: function (params) {
             return {
             token: params[0],
             funcServicesProductID: params[1]
             };
             }
             },*/
            /*//  获取已缴费学生名单
             getAlreadyPaymentStudentList: {
             method: "get",
             requestUrl: urlConfig + "Charge/v3/Charge/GetPayItemPartner",
             requestParams: function (params) {
             return {
             token: params[0],
             sDate: params[1],
             eDate: params[2],
             orgid: params[3],
             gid: params[4],
             classID: params[5],
             funcServiceProductID: params[6],
             funcAppID: params[7]
             };
             }
             },*/
            /*// 获取未缴费学生名单
             getNoPaymentStudentList: {
             method: "get",
             requestUrl: urlConfig + "Charge/v3/Charge/GetUnPayOperate",
             requestParams: function (params) {
             return {
             token: params[0],
             pageSize: params[1],
             pageIndex: params[2],
             gid: params[3],
             stuName: params[4],
             funcServiceProductID: params[5]
             };
             }
             },*/
            // 获取查询缴费明细列表
            getPaymentDetailList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetPayList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageSize: params[1],
                        pageIndex: params[2],
                        gid: params[3],
                        productID: params[4],
                        classID: params[5],
                        stu: params[6],
                        payStatus: params[7],
                        sDate: params[8],
                        eDate: params[9]
                    };
                }
            },
            // 获取未缴费学生明细
            getNoPaymentStudentDetail: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetUnPayItem",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        umid: params[1],
                        funcServiceProductID: params[2]
                    };
                }
            },
            // 缴费情况统计
            getCostStatisticsList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetPayStatisticByClass",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        funcServiceProductID: params[2],
                        sDate: params[3],
                        eDate: params[4]
                    };
                }
            },
            //缴费数据按学校统计查询（合作伙伴）
            GetPayStatisticBySchoolPartner: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetPayStatisticBySchoolPartner",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orgid: params[1],
                        gid: params[2],
                        rpid: params[3],
                        rcid: params[4],
                        rxid: params[5],
                        sDate: params[6],
                        eDate: params[7]
                    };
                }
            },
            // 查找学生信息
            getStudentInfoList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeManage/GetStuListNew",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        classid: params[2],
                        text: params[3]
                    };
                }
            },
            // 缴费异常统计
            getPaymentAnomalyList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeManage/GetExceptionStuPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageSize: params[1],
                        pageIndex: params[2],
                        gid: params[3],
                        st: params[4],
                        orgid: params[5]
                    };
                }
            },
            // 缴费异常统计
            upHandleExceptionStu: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/ChargeManage/HandleExceptionStuNew?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        ID: params[0],
                        GID: params[1],
                        NewUName: params[2],
                        NewMID: params[3],
                        NewTel: params[4],
                        NewClassName: params[5],
                        NewUMID: params[6],
                        NewClassID: params[7],
                        Desc: params[8]
                    };
                }
            }
        };
        return service;
    };
    service.paymentTableSearch = paymentTableSearchService();
    /**
     * 信息推送
     * @returns {{getSchoolList: {method: string, requestUrl: string, requestParams: requestParams}, getClassList: {method: string, requestUrl: string, requestParams: requestParams}, getProductList: {method: string, requestUrl: string, requestParams: requestParams}, getStudentList: {method: string, requestUrl: string, requestParams: requestParams}, getFuncAppList: {method: string, requestUrl: string, requestParams: requestParams}, getPushRecordPage: {method: string, requestUrl: string, requestParams: requestParams}, pushMessageTask: {method: string, requestUrl: string, requestParams: requestParams}, pushFixedEntryTask: {method: string, requestUrl: string, requestParams: requestParams}, pushSubscriptTask: {method: string, requestUrl: string, requestParams: requestParams}, pushSubscriptPic: {method: string, requestUrl: string, requestParams: requestParams}}}
     */
    var paymentMessageService = function () {
        var service = {
            // 获取当前用户学校列表
            getSchoolList: {
                method: "get",
                requestUrl: urlConfig + "COP/v3/Auth/GetCurUserSchool",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orgid: params[1]
                    };
                }
            },
            // 根据学校ID获取班级列表
            getClassList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetClassList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1]
                    };
                }
            },
            // 根据学校ID与班级ID（班级非必需）获取服务包列表
            getProductList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetProductListByGid",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        classid: params[2] ? params[2] : 0
                    };
                }
            },
            // 根据学校ID与班级ID及学生名称获取学生列表
            getStudentList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetStudentList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        classid: params[2],
                        stuName: params[3]
                    };
                }
            },

            // 根据服务包ID获取服务项列表
            getFuncAppList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeH5User/GetFuncAppListByFuncProductID",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        funcServicesProductID: params[1]
                    };
                }
            },
            // 获取已推送消息列表
            getPushRecordPage: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetPushRecordPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageIndex: params[1],
                        pageSize: params[2],
                        pushType: params[3],
                        orgid: params[4],
                        gid: params[5]
                    };
                }
            },
            // 根据GID获取推送消息配置信息
            getPushMessageConfig: {
                method: "get",
                requestUrl: urlConfig + 'Charge/v3/Charge/GetConfigByGid',
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1]
                    };
                }
            },
            // 添加推送短信消息
            pushMessageTask: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/PushMessageTask?token=" + APPMODEL.Storage.copPage_token,
                requestParams: function (params) {
                    return {
                        OrgID: params[0],
                        GID: params[1],
                        CUID: params[2],
                        ProductID: params[3],
                        PayStatus: params[4],
                        ReceiveArea: params[5],
                        Msg: params[6],
                        ReceiveObj: params[7],
                        AppStatus: params[8],
                        PushObjList: params[9]
                    };
                }
            },
            // 添加固定入口推送
            pushFixedEntryTask: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/PushFixEntryTask?token=" + APPMODEL.Storage.copPage_token,
                requestParams: function (params) {
                    return {
                        OrgID: params[0],
                        GID: params[1],
                        CUID: params[2],
                        ReceiveArea: params[3],
                        Msg: params[4],
                        PushUrl: params[5],
                        ReceiveObj: params[6],
                        PushObjList: params[7]
                    };
                }
            },
            // 添加订阅号推送
            pushSubscriptTask: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/PushSubscriptTask?token=" + APPMODEL.Storage.copPage_token,
                requestParams: function (params) {
                    return {
                        OrgID: params[0],
                        GID: params[1],
                        CUID: params[2],
                        ProductID: params[3],
                        PayStatus: params[4],
                        ReceiveArea: params[5],
                        Title: params[6],
                        ImgUrl: params[7],
                        Msg: params[8],
                        PushUrl: params[9],
                        ReceiveObj: params[10],
                        PushObjList: params[11]
                    };
                }
            }


        };
        return service;
    };
    service.paymentMessage = paymentMessageService();
    /**
     * 线下收费
     */
    var lineChargeService = function () {
        var service = {
            //获取银行转账列表（线下缴费列表）
            GetBankTraList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetBankTraList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orgID: params[1],
                        gid: params[2]
                    };
                }
            },
            //银行转账保存
            ConfirmbankTra: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/ConfirmbankTra?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        PartnerID: params[0],
                        GID: params[1],
                        Amount: params[2],
                        Date: params[3],
                        PayCenterOrderNo: params[4],
                        Remark: params[5]
                    };
                }
            }
        };
        return service;
    };
    service.LineCharge = lineChargeService();

    /**
     * 组织权限
     */
        // 组织权限 -- 用户管理
    var userManagementService = function () {
            var service = {
                // 根据组织ID获取所有用户
                getSimpleOrgUsers: {
                    method: 'get',
                    requestUrl: urlConfig + "COP/v3/User/GetSimpleOrgUsers",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            orgid: params[1]
                        };
                    }
                },
                // 获取所有学校开通功能列表
                GetWebSmsControlList: {
                    method: 'get',
                    requestUrl: urlConfig +"public/v3/CopWeb/GetWebSmsControlList",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            orgid: params[1],
                            pageSize: params[2],
                            pageIndex: params[3],
                        };
                    }
                },
                // 获取当前用户学校列表
                getSchoolList: {
                    method: "get",
                    requestUrl: urlConfig + "COP/v3/Auth/GetCurUserSchool",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            orgid: params[1]
                        };
                    }
                },
                // 获取所有用户学校
                getUserGroupPage: {
                    method: 'get',
                    requestUrl: urlConfig + "COP/v3/User/GetUserGroupPage",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            pIndex: params[1],
                            pSize: params[2],
                            orgid: params[3],
                            uid: params[4],
                            gid: params[5]
                        }
                    }
                },
                // 删除用户学校
                deleteUserSchool: {
                    method: 'post',
                    requestUrl: urlConfig + "COP/v3/User/DeleteUserGroup",
                    requestPost: function (params) {
                        return {
                            token: params[0],
                            orgid: params[1],
                            uid: params[2],
                            gid: params[3]
                        }
                    }
                },
                // 根据合作伙伴、用户、省市县、学校获取学校列表
                getSchoolsByOrgUID: {
                    method: 'get',
                    requestUrl: urlConfig + "COP/v3/User/GetGroupsByOrgUID",
                    requestParams: function (params) {
                        return {
                            token: params[0],
                            uid: params[1],
                            orgid: params[2],
                            rid: params[3],
                            gname: params[4]
                        }
                    }
                },
                //保存学校开通功能短信
                AddOrUpdateSmsControl: {
                    method: 'post',
                    requestUrl: urlConfig + "public/v3/CopWeb/AddOrUpdateSmsControl",
                    requestParams: function (params) {
                        return {
                            ID: params[0],
                            OrgID:params[1],
                            GID: params[2],
                            OpenFuncList: params[3],
                        }
                    },
                    requestPost: function (params) {
                        return {
                            token: params[0],
                        }
                    }
                },
                // 向用户下面添加学校
                addUserSchool: {
                    method: 'post',
                    requestUrl: urlConfig + "COP/v3/User/AddUserGroup",
                    requestPost: function (params) {
                        return {
                            token: params[0],
                            uid: params[1],
                            orgid: params[2],
                            gid: params[3]
                        }
                    }
                },
                // 按条件给用户添加组织下的学校列表
                addUserSchoolByCondition: {
                    method: 'post',
                    requestUrl: urlConfig + "COP/v3/User/AddUserGroupByCondition",
                    requestPost: function (params) {
                        return {
                            token: params[0],
                            uid: params[1],
                            orgid: params[2],
                            rid: params[3],
                            gname: params[4]
                        }
                    }
                },
                // 删除组织管理员数据权限
                deleteOrgAdminGroup:{
                    method: 'post',
                    requestUrl: urlConfig + "sns/v3/Web/DeleteOrgAdminGroup",
                    requestParams: function (params) {
                        return {
                          '':params[0],
                        }
                    },
                    requestPost: function (params) {
                        return {
                            token: params[0],
                            pid: params[1],
                            adminUID: params[2],
                        }
                    }
                },
            };
            return service;
        };
    service.userManagementInstitution = userManagementService();

    /**
     * 短信
     */
    var messageService = function () {
        var service = {
            getSmsMassSendList: {
                method: "get",
                requestUrl: urlConfig + "public/v3/SmsWeb/GetSmsMassSendList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        bID: params[1],
                        rvName: params[2],
                        pIndex: params[3],
                        pSize: params[4],
                        sDate: params[5],
                        eDate: params[6],
                    };
                }
            },
            GetSmsFuncList: {
                method: "get",
                requestUrl: urlConfig + "public/v3/CopWeb/GetSmsFuncList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                    };
                }
            },
            // 获取当前用户学校列表
            getSchoolList: {
                method: "get",
                requestUrl: urlConfig + "COP/v3/Auth/GetCurUserSchool",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orgid: params[1]
                    };
                }
            },
            saveSmsMass: {
                method: "post",
                requestUrl: urlConfig + "public/v3/SmsWeb/AddSmsMass?token=" + APPMODEL.Storage.copPage_token,
                requestParams: function (params) {
                    return params
                }
            },
            getSmsMassSend: {
                method: "get",
                requestUrl: urlConfig + "public/v3/SmsWeb/GetSmsMassSend",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        isContainRv: params[1],
                        sendID: params[2]
                    };
                }
            }

        };
        return service;
    };
    service.message = messageService();

    /**
     * 图标维护
     */
    var corporateRegistrationIconService = function () {
        return {
            //图片文件上传
            ImageRegistrationUpload: {
                method: "post",
                requestUrl: urlConfig + 'base/v3/OpenApp/UploadAttachment?attachmentStr={"Path":"ProjIcon","AttachType":1,"ExtName":".jpg","ResizeMode":1,"SImgResizeMode":2,"CreateThumb":true,"Width":100,"Height":100,"SHeight":50,"SWidth":50}&token=' + APPMODEL.Storage.getItem('applicationToken'),
                requestParams: function (params) {
                    return params;
                }
            },
            //图标上传保存
            UploadIcon: {
                method: "post",
                requestUrl: urlConfig + "CSU/v3/Icon/UploadIcon",
                requestParams: function (params) {
                    return {
                        id: params[0],
                        Des: params[1],
                        Path: params[2]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            },
            //获取图标列表
            GetIconList: {
                method: "get",
                requestUrl: urlConfig + "CSU/v3/Icon/GetList",
                requestParams: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            //删除图标
            DeleteByIcon: {
                method: "post",
                requestUrl: urlConfig + "CSU/v3/Icon/DeleteBy",
                requestParams: function (params) {
                    return {
                        id: params[0],
                        Des: params[1],
                        Path: params[2]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            }
        };
    };
    service.corporateRegistrationIcon = corporateRegistrationIconService();
    return service;
}]);
