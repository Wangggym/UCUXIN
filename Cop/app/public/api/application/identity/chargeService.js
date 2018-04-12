/**
 * Created by xj on 2017/3/9.
 */
/**
 * 收费服务
 */
app.factory('chargeService', [function () {
    var service = {};
    var chargeService = function () {
        var service = {
            //添加产品
            AddOrUpProduct: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Product/AddOrUpProduct",
                requestParams: function (params) {
                    return {
                        ID: params[0],
                        GID: params[1],
                        Name: params[2],
                        FuncIDs: params[3]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            },
            //添加服务包
            AddOrUpCharge: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/AddOrUpCharge",
                requestParams: function (params) {
                    return {
                        ID: params[0],
                        GID: params[1],
                        ProductID: params[2],
                        Name: params[3],
                        Amount: params[4],
                        BuySDate: params[5],
                        BuyEDate: params[6],
                        SDate: params[7],
                        EDate: params[8]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            },
            //获取产品定义分页数据
            GetPageGroupData: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Product/GetProductPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pIndex: params[1],
                        pSize: params[2],
                        orgid: params[3],
                        gid: params[4]
                    };
                }
            },
            //获取服务包定义分页数据
            GetServicePageGroupData: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetChargePage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pIndex: params[1],
                        pSize: params[2],
                        orgid: params[3],
                        gid: params[4],
                        productid: params[5],
                        buySDate: params[6],
                        buyEDate: params[7]
                    };
                }
            },
            //获取所有功能项及对应的业务领域
            GetFuncAppList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Product/GetFuncBusinessAreaList",
                requestParams: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            //根据ID获取单个产品的信息
            GetSigleProdutInfo: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Product/GetProduct",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        productid: params[1]
                    };
                }
            },
            //根据id删除产品
            RemoveProductById: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Product/DelProductByID",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        productid: params[1]
                    };

                }
            },
            //根据id删除学生优惠信息（by xj）
            RemoveStudentSaleById: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/DelCouponById",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        Id: params[1]
                    };

                }
            },
            //根据chargeid删除服务包
            RemoveServicePackageByChargeid: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/DeleteCharge",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        chargeid: params[1]
                    };
                }
            },
            //根据ID（chargeid）获取单个服务包的信息
            GetSigleServicePackageInfo: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetCharge",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        chargeid: params[1]
                    };
                }
            },
            //根据chargeid下架服务包
            soldOutServicePackageByChargeid: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/CancelCharge",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        chargeid: params[1]
                    };
                }
            },
            // 根据学校ID获取产品包列表
            getProductList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Product/GetProductListByGid",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1]
                    };
                }
            },
            // 更据学校ID获取服务包列表
            GetChargeByGid: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetChargeByGid",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1]
                    };
                }
            },
            //获取学生开通服务包的分页数据
            GetChargeStuPage: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetChargeStuPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        productid: params[2],
                        classid: params[3],
                        name: params[4],
                        isNoCharge: params[5],
                        chargeid: params[6],
                        sdate: params[7],
                        edate: params[8],
                        pIndex: params[9],
                        pSize: params[10]
                    };
                }
            },
            //根据产品Id获取服务包列表
            GetChargeListByProductId: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetChargeListByProductId",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        ProductId: params[1]
                    };
                }
            },
            //根据学校id获取产品列表ss
            GetProductListByGid: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Product/GetProductListByGid",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1]
                    };
                }
            },
            //按班级批量开启服务包之前的的校验
            OpenBatchChargeStuBefore: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/OpenBatchChargeStuBefore",
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        ProductID: params[1],
                        ClassIDs: params[2],
                        ChargeIDs: params[3],
                        SDate: params[4],
                        EDate: params[5]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            },
            //导入线下收费
            importMoney: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Web/ImportOffLineDetail?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return params;
                },
                requestPost: function (params) {
                    return params;
                }
            },
            //按班级批量开启服务包
            OpenBatchChargeStu: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/OpenBatchChargeStu",
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        ProductID: params[1],
                        ClassIDs: params[2],
                        ChargeIDs: params[3],
                        SDate: params[4],
                        EDate: params[5]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            },
            //按班级批量开启试用
            OpenBatchTry: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/OpenBatchTry",
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        ProductID: params[1],
                        ClassIDs: params[2],
                        TrySDate: params[3],
                        TryEDate: params[4]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            },
            //批量取消试用
            CancelBatchTry: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/CancelBatchTry",
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        ProductID: params[1],
                        ClassIDs: params[2]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            },
            //按学生开启试用
            OpenTry: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/OpenTry",
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        ProductID: params[1],
                        UMIDs: params[2],
                        TrySDate: params[3],
                        TryEDate: params[4]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            },
            //根据产品Id和学生id获取服务包
            GetChargeList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetChargeList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        ProductId: params[1],
                        umid: params[2]
                    };
                }
            },
            //按学生开启服务包
            OpenChargeStu: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/OpenChargeStu",
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        ProductID: params[1],
                        UMIDs: params[2],
                        ChargeIDs: params[3]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            },
            //取消开通服务包
            CancelChargeStu: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/CancelChargeStu",
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        ProductID: params[1],
                        UMIDs: params[2],
                        ChargeIDs: params[3]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            },
            //取消试用
            CancelTry: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/CancelTry",
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        ProductID: params[1],
                        UMIDs: params[2],
                        TrySDate: params[3],
                        TryEDate: params[4]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            },
            //获取学校赠送服务包列表
            GetGiveList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetGiveList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageSize: params[1],
                        pageIndex: params[2],
                        orgid: params[3],
                        gid: params[4],
                        productid: params[5],
                        chargeid: params[6]
                    };
                }
            },
            //获取学生优惠列表
            GetStudentSaleList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetCouponList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageSize: params[1],
                        pageIndex: params[2],
                        orgid: params[3],
                        gid: params[4],
                        classId: params[5],
                        name: params[6],
                        productid: params[7],
                        chargeid: params[8]
                    };
                }
            },
            // 删除学生赠送
            DeleteGiveOrder: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/DeleteGiveOrder?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        OrderDetailsIDs: params[1]
                    };
                }
            },
            // 获取异常学生名单
            GetExceptionStuPageNew: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeManage/GetExceptionStuPageNew",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageSize: params[1],
                        pageIndex: params[2],
                        orgid: params[3],
                        gid: params[4],
                        st: params[5]
                    };
                }
            },
            // 缴费异常统计名单处理
            HandleExceptionStuNew: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/ChargeManage/HandleExceptionStuNew?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        ID: params[0],
                        NewGid: params[1],
                        NewUName: params[2],
                        NewMID: params[3],
                        NewTel: params[4],
                        NewClassName: params[5],
                        NewUMID: params[6],
                        NewClassID: params[7],
                        Desc: params[8],
                        NewChargeID: params[9]
                    };
                }
            },
            // 线下缴费生成订单,返回订单ID
            AddNewOrder: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/ChargeH5User/AddNewOrder?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        ChargeIDs: params[1],
                        UMIDs: params[2]
                    };
                }
            },
            //获取线下收费学生名单（根据学校ID、服务包、获取学生缴费情况名单）,获取学生优惠信息列表
            GetStudents: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetStudents",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        chargeid: params[2],
                        classid: params[3],
                        name: params[4]
                    };
                }
            },
            //根据产品ID umid 获取可能开通服务包
            GetCanOpenChargeList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetCanOpenChargeList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        ProductId: params[1],
                        umid: params[2]
                    };
                }
            },
            //赠送学生服务包(by xj)
            AddStuFuncServiceByGive: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/AddStuFuncServiceByGive?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        ProductID: params[0],
                        ChargeID: params[1],
                        UMIDs: params[2],
                        GID: params[3]
                    };
                }
            },
            //添加学生优惠(by xj)
            AddStudentSale: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/AddCoupon?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        ProductID: params[0],
                        ChargeID: params[1],
                        UMIDs: params[2],
                        GID: params[3],
                        Amount: params[4],
                        SDate: params[5],
                        EDate: params[6]
                    };
                }
            },
            //获取分页推送日志记录
            GetPushRecordPage: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetPushRecordPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        pushType: params[2],
                        pageIndex: params[3],
                        pageSize: params[4]
                    };
                }
            },
            //根据班级获取学生列表
            GetStudentList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetStudentList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        classid: params[2]
                    };
                }
            },
            //根据学校GID,服务包ID获取学生列表（by xj）
            GetStudentsList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetStudents",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        chargeid: params[2],
                        classid: params[3],
                        name: params[4]
                    };
                }
            },
            //固定入口推送
            PushFixEntryNewTask: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/PushFixEntryNewTask",
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        ProductID: params[1],
                        ReceiveArea: params[2],
                        ReceiveObj: params[3],
                        PushObjList: params[4],
                        ChargeID: params[5]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            },
            //获取订单详细信息（包括学生列表，产品包列表）
            GetOrderByID: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeH5User/GetOrderInfo",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orderID: params[1]
                    };
                }
            },
            // 获取当前环境的支付方式
            GetPayChannels: {
                method: "get",
                requestUrl: urlConfig + "Pay/v3/OpenPay/GetPayChannels",
                requestParams: function (params) {
                    return {
                        payAppID: params[0],
                        payAccountID: params[1],
                        cloudID: params[2],
                        browserType: params[3],
                        appType: params[4],
                        appVersion: params[5],
                    };
                }
            },
            //获取支付model3.0
            GetCreatePayModel: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Pay/GetCreatePayModel",
                requestParams: function (params) {
                    return {
                        orderID: params[0],
                        payChannelID: params[1],
                        channel: params[2],
                    };
                }
            },
            //获取签名
            GetSign: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeH5User/GetPaySign",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orderID: params[1],
                        timeStamp: params[2]
                    };
                }
            },
            // 获取订单下产品包名称拼接字符串
            GetBody: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeH5User/GetOrderChargeNames",
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
                requestUrl: urlConfig + "Charge/v3/ChargeH5User/UpdatePayChannel",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orderID: params[1],
                        Channel: params[2]
                    };
                }
            },
            //短信推送
            PushMessageNewTask: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/Charge/PushMessageNewTask",
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        ProductID: params[1],
                        ChargeID: params[2],
                        PayStatus: params[3],
                        ReceiveArea: params[4],
                        Msg: params[5],
                        ReceiveObj: params[6],
                        AppStatus: params[7],
                        PushObjList: params[8]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    }
                }
            },
            // 获取合作伙伴组织列表
            getOrganization: {
                method: "get",
                requestUrl: urlConfig + "COP/v3/Org/GetOrgList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        type: params[1]
                    };
                }
            },
            //缴费未成功明细查询
            GetPayUnSuccessPage: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeManage/GetPayUnSuccessPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageSize: params[1],
                        pageIndex: params[2],
                        gid: params[3],
                        productId: params[4],
                        sDate: params[5],
                        eDate: params[6],
                    };
                }
            },
            //缴费按班统计
            GetPayStatisticByClass: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeManage/GetPayStatisticByClassPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageSize: params[1],
                        pageIndex: params[2],
                        OrgId: params[3],
                        gid: params[4],
                        ProvinceId: params[5],
                        CityId: params[6],
                        CountyId: params[7],
                        productId: params[8],
                        chargeId: params[9],
                        sDate: params[10],
                        eDate: params[11],
                    };
                }
            },
            //缴费线下明细查询
            GetPayStatistic: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Web/GetOffLineDetailPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageSize: params[1],
                        pageIndex: params[2],
                        partnerName: params[3],
                        gname: params[4],
                    };
                }
            },
            //缴费按校统计
            GetPayStatisticBySchool: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeManage/GetStatisticBySchoolListPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageSize: params[1],
                        pageIndex: params[2],
                        OrgId: params[3],
                        gid: params[4],
                        ProvinceId: params[5],
                        CityId: params[6],
                        CountyId: params[7],
                        productId: params[8],
                        chargeId: params[9],
                        sDate: params[10],
                        eDate: params[11],
                    };
                }
            },
            // 获取服务包
            GetAllProductList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetChargeList?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        ProductId: params[0],
                        umid: params[1]
                    }
                }
            },
            //更换服务包
            changeProduct: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/ChargeManage/ChangeOrderProductNew?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        ID: params[0],
                        ChargeID: params[1],
                        RefundAmount: params[2],
                        IsCloseService: params[3],
                        Desc: params[4]
                    }
                }
            },
            // 退款登记——退款
            refundOderAmount: {
                method: "post",
                requestUrl: urlConfig + "Charge/v3/ChargeManage/RefundStuPartAmountNew?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        ID: params[0],
                        ChargeID: params[1],
                        RefundAmount: params[2],
                        IsCloseService: params[3],
                        Desc: params[4]
                    }
                }
            },
            // 缴费明细查询
            // 获取查询缴费明细列表
            GetPayListPage: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeManage/GetPayListPage?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        pageSize: params[0],
                        pageIndex: params[1],
                        gid: params[2],
                        productID: params[3],
                        chargeId: params[4],
                        sDate: params[5],
                        eDate: params[6],
                        classID: params[7],
                        stuName: params[8],
                        Status: params[9]

                    };
                }
            },
            // 下单次数明细
            GetOderCountList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeManage/GetOderCountList?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        umid: params[0],
                        chargeId: params[1]
                    };
                }
            },

            // 获取缴费人数统计信息
            GetPaymentStatisticPage: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeManage/GetPaymentStatisticPage?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        pageSize: params[0],
                        pageIndex: params[1],
                        orgid: params[2],
                        ProvinceId: params[3],
                        CityId: params[4],
                        CountyId: params[5],
                        gid: params[6],
                        productId: params[7],
                        chargeId: params[8],
                        sDate: params[9],
                        eDate: params[10],
                        PsDate: params[11],
                        PeDate: params[12]
                    };
                }
            },

            // 缴费按班实时统计
            GetChargeStuGroupByClassList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeWeb/GetChargeStuGroupByClassList?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        gid: params[1],
                        productId: params[2],
                        chargeId: params[3],
                        sDate: params[4],
                        eDate: params[5],
                    };
                }
            },

            // 导出缴费按班统计
            ExportChargeStuGroupByClassList: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/ChargeWeb/ExportChargeStuGroupByClassList?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        gid: params[1],
                        productId: params[2],
                        chargeId: params[3],
                        sDate: params[4],
                        eDate: params[5],
                    };
                }
            },

        };
        return service;
    };
    service.chargeService = chargeService();
    return service;
}]);
