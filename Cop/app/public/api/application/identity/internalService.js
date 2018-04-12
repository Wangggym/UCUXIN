/**
 * Created by fanweihua on 2016/8/22.
 * internalService
 * internal operation service API collection of interface
 */
app.factory('internalService', [function () {
  var service = {};
  /**
   * 应用收费开通
   * @returns {{GetFuncAppList: {method: string, requestUrl: string, requestParams: requestParams}, UpFuncApp: {method: string, requestUrl: string, requestParams: requestParams}}}
   */
  var applicationFeeOpenService = function () {
    var service = {
      //获取所有功能项及对应的业务领域
      GetFuncAppList: {
        method: "get",
        requestUrl: urlConfig + "Charge/v3/Charge/GetFuncAppList",
        requestParams: function (params) {
          return {
            token: params[0]
          };
        }
      },
      //更新
      UpFuncApp: {
        method: "post",
        requestUrl: urlConfig + "Charge/v3/Charge/UpFuncApp?token=" + APPMODEL.Storage.getItem('copPage_token'),
        requestParams: function (params) {
          return {
            ID: params[0],
            Desc: params[1]
          };
        }
      },
      //新增学校配置信息
      AddGoupConfig: {
        method: "post",
        requestUrl: urlConfig + "Charge/v3/Charge/AddOrUpGoupConfig?token=" + APPMODEL.Storage.getItem('copPage_token'),
        requestParams: function (params) {
          return {
            ID: params[0],
            GID: params[1],
            FixEntryDesc: params[2],
            FixEntryPic: params[3],
            FixEntryBgColor: params[4],
            FixEntryTitle: params[5],
            FixEntryTitleColor: params[6],
            FixEntryUrl: params[7],
            FixPreViewUrl: params[8],
            IsShowFixEntry: params[9],
            FixEntryUrlType: params[10]
          };
        }
      },
      //根据GID获取配置信息
      GetConfigByGid: {
        method: "get",
        requestUrl: urlConfig + "Charge/v3/Charge/GetConfigByGid",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1]
          };
        }
      },
      // 获取分页的缴费入口配置
      GetPageGroupConfig: {
        method: "get",
        requestUrl: urlConfig + "Charge/v3/Charge/GetPageGroupConfig",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1],
            orgid: params[2],
            pSize: params[3],
            pIndex: params[4]
          };
        }
      },
      //获取文章ID
      GetLongID: {
        method: "get",
        requestUrl: urlConfig + "COP/v3/Common/GetLongID",
        requestParams: function (params) {
          return {
            token: params[0]
          };
        }
      },
      //根据app_data_id(数据唯一标识)查询文章内容
      QueryContentsArticle: {
        method: "get",
        requestUrl: APPMODEL.PHPConfig.url + "api.php?op=cop&action=app_data_detail",
        requestParams: function (params) {
          return {
            app_id: params[0],
            app_data_id: params[1]
          };
        }
      }
    };
    return service;
  };
  service.applicationFeeOpen = applicationFeeOpenService();
  /**
   * 缴费报表查询
   * @returns {{getOrganization: {method: string, requestUrl: string, requestParams: requestParams}, getSchoolList: {method: string, requestUrl: string, requestParams: requestParams}, getFuzzySchoolList: {method: string, requestUrl: string, requestParams: requestParams}, getClassList: {method: string, requestUrl: string, requestParams: requestParams}, getProductList: {method: string, requestUrl: string, requestParams: requestParams}, getFuncAppList: {method: string, requestUrl: string, requestParams: requestParams}, getAlreadyPaymentStudentList: {method: string, requestUrl: string, requestParams: requestParams}, getNoPaymentStudentList: {method: string, requestUrl: string, requestParams: requestParams}, getNoPaymentStudentDetail: {method: string, requestUrl: string, requestParams: requestParams}, getCostStatisticsList: {method: string, requestUrl: string, requestParams: requestParams}, getPaymentAnomalyList: {method: string, requestUrl: string, requestParams: requestParams}}}
   */
  var paymentTableSearchService = function () {
    var service = {
      // 获取组织列表
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
      // 获取当前用户学校列表( 模糊查询 )
      getFuzzySchoolList: {
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetCompanysByKeyWord",
        requestParams: function (params) {
          return {
            token: params[0],
            keyWord: params[1]
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
      // 根据学校ID获取服务包列表
      getProductList: {
        method: "get",
        requestUrl: urlConfig + "Charge/v3/Charge/GetAllProductListByGid",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1]
          };
        }
      },
      // 获取所有服务项列表
      getFuncAppList: {
        method: "get",
        requestUrl: urlConfig + "Charge/v3/Charge/GetFuncAppList",
        requestParams: function (params) {
          return {
            token: params[0]
          };
        }
      },
      // 获取所有学生列表
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
      /*//  获取已缴费学生名单
       getAlreadyPaymentStudentList: {
       method: "get",
       requestUrl: urlConfig + "Charge/v3/Charge/GetPayItemOperate",
       requestParams: function (params) {
       return {
       token: params[0],
       sDate: params[1],
       eDate: params[2],
       orgid: params[3],
       gid: params[4],
       classID: params[5],
       funcAppID: params[6]
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
      // 获取未缴费学生名单
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
      },
      //缴费数据按学校统计查询(内部运营)
      GetPayStatisticBySchoolInternal: {
        method: "get",
        requestUrl: urlConfig + "Charge/v3/Charge/GetPayStatisticBySchoolInternal",
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
      //缴费未成功明细查询
      GetPayUnSuccessPage: {
        method: "get",
        requestUrl: urlConfig + "Charge/v3/Charge/GetPayUnSuccessPage",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1],
            productID: params[2],
            sDate: params[3],
            eDate: params[4],
            pageSize: params[5],
            pageIndex: params[6]
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
      // 获取当前用户学校列表( 模糊查询 )
      getFuzzySchoolList: {
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetCompanysByKeyWord",
        requestParams: function (params) {
          return {
            token: params[0],
            keyWord: params[1]
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
        requestUrl: urlConfig + "Charge/v3/Charge/GetAllProductListByGid",
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
      // 根据学校ID获取已推送消息列表
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
   * 发卡管理
   * @returns {{getSchClassInfo: {method: string, async: boolean, requestUrl: string, requestParams: requestParams}, getUserCardInfoByUMID: {method: string, requestUrl: string, requestParams: requestParams}, searchSchNameChange: {method: string, requestUrl: string, requestParams: requestParams}, getStuCardInfomation: {method: string, requestUrl: string, requestParams: requestParams}, addSignCardInfo: {method: string, requestUrl: string, requestParams: requestParams}, deleteCardInfo: {method: string, requestUrl: string, requestParams: requestParams}, addStuBatchCardInfo: {method: string, requestUrl: string, requestParams: requestParams}, getStaffCardInfo: {method: string, requestUrl: string, requestParams: requestParams}, checkStaffCardInfo: {method: string, requestUrl: string, requestParams: requestParams}, addStaffBatchCardInfo: {method: string, requestUrl: string, requestParams: requestParams}, getErrorStuCardInfo: {method: string, requestUrl: string, requestParams: requestParams}, getErrorStaffCardInfo: {method: string, requestUrl: string, requestParams: requestParams}, UnBindCardNo: {method: string, requestUrl: string, requestParams: requestParams}, ImportStuCardNo: {method: string, requestUrl: string, requestParams: requestParams}}}
   */
  var cardManagementService = function () {
    var service = {
      //获取老师用户信息
      getSchClassInfo: {
        method: "get",
        async: true,//同步
        requestUrl: urlConfig + "OCS/v3/SafeAttend/GetSchClass",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1]
          };
        }
      },
      //根据gid、umid获取个人的卡号列表
      getUserCardInfoByUMID: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/CardInfo/GetUserCardInfoByUMID",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1],
            umid: params[2],
            isContainedDelete: params[3]
          };
        }
      },
      //校验班级的绑卡数据
      searchSchNameChange: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/CardInfo/CheckClassCardInfo",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1],
            classid: params[2]
          };
        }
      },
      //查询学生绑卡情况
      getStuCardInfomation: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/CardInfo/GetStuCardInfo",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1],
            classid: params[2],
            name: params[3],
            card: params[4],
            onlyNoCard: params[5]
          };
        }
      },
      //新增卡号
      addSignCardInfo: {
        method: "post",
        requestUrl: urlConfig + "OCS/v3/CardInfo/AddSignCardInfo?token=" + APPMODEL.Storage.getItem('copPage_token'),
        requestParams: function (params) {
          return {
            GID: params[0],
            UMID: params[1],
            CardNo: params[2],
            MType: params[3],
            CardHolder: params[4]
          };
        }
      },
      //注销卡号
      deleteCardInfo: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/CardInfo/DeleteCardInfo",
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          };
        }
      },
      //批量发卡
      addStuBatchCardInfo: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/CardInfo/AddStuBatchCardInfo",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1],
            classid: params[2],
            startNo: params[3]
          };
        }
      },
      //获取老师绑卡情况
      getStaffCardInfo: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/CardInfo/GetStaffCardInfo",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1],
            name: params[2],
            card: params[3],
            onlyNoCard: params[4]
          };
        }
      },
      //获取老师数量
      checkStaffCardInfo: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/CardInfo/CheckStaffCardInfo",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1]
          };
        }
      },
      //老师批量发卡
      addStaffBatchCardInfo: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/CardInfo/AddStaffBatchCardInfo",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1],
            startNo: params[2]
          };
        }
      },
      //学生异常数据检查
      getErrorStuCardInfo: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/CardInfo/GetErrorStuCardInfo",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1]
          };
        }
      },
      //老师异常数据检查
      getErrorStaffCardInfo: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/CardInfo/GetErrorStaffCardInfo",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1]
          };
        }
      },
      //解除绑定
      UnBindCardNo: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/CardInfo/UnBindCardNo",
        requestParams: function (params) {
          return {
            token: params[0],
            cardno: params[1]
          };
        }
      },
      //文件上传
      ImportStuCardNo: {
        method: "POST",
        requestUrl: urlConfig + "OCS/v3/CardInfo/ImportStuCardNo?token=" + APPMODEL.Storage.getItem('copPage_token'),
//                requestUrl: urlConfig + 'base/v3/OpenApp/UploadAttachment?attachmentStr={"Path":"ocs","AttachType":1,"ExtName":".png","ResizeMode":1,"SImgResizeMode":2}&token=' + APPMODEL.Storage.getItem('applicationToken'),
        requestParams: function (params) {
          return params;
        }
      },
      //导入木兰卡号
      ImportMagnoliaCardNo: {
        method: "post",
        requestUrl: urlConfig + "OCS/v3/CardInfo/ImportMLStuCard?token=" + APPMODEL.Storage.getItem('copPage_token'),
        requestParams: function (params) {
          return params;
        }
      },
      //导入RFID卡号
      ImportFRIDCardNo: {
        method: "post",
        requestUrl: urlConfig + "OCS/v3/CardInfo/ImportRFIDCard?token=" + APPMODEL.Storage.getItem('copPage_token'),
        requestParams: function (params) {
          return params;
        }
      }
    };
    return service;
  };
  service.cardManagement = cardManagementService();
  /**
   * 应用收费
   */
  var applicationFeeService = function () {
    var service = {
      //财务核销 获取未核销账目列表
      GetWriteOffList: {
        method: "get",
        requestUrl: urlConfig + "Charge/v3/ChargeManage/GetWriteOffList",
        requestParams: function (params) {
          return {
            token: params[0],
            SDate: params[1],
            EDate: params[2],
            writeOff: params[3],
            orgID: params[4],
            pageSize: params[5],
            pageIndex: params[6]
          };
        }
      },
      //财务确认核销
      ConfirmWriteOff: {
        method: "post",
        requestUrl: urlConfig + "Charge/v3/ChargeManage/ConfirmWriteOff?token=" + APPMODEL.Storage.getItem('copPage_token'),
        requestParams: function (params) {
          return {
            accountIDList: params[0]
          }
        }
      },
      //财务确认核销
      ConfirmWriteOffByCondition: {
        method: "get",
        requestUrl: urlConfig + "Charge/v3/ChargeManage/ConfirmWriteOffByCondition",
        requestParams: function (params) {
          return {
            token: params[0],
            SDate: params[1],
            EDate: params[2],
            orgID: params[3]
          };
        }
      },
      //获取支付中心订单页面列表数据
      GetPagesCharge: {
        method: "get",
        requestUrl: urlConfig + "Pay/v3/PayQuery/GetPagesCharge",
        requestParams: function (params) {
          return {
            token: params[0],
            chargeID: params[1],
            orderNo: params[2],
            sDate: params[3],
            eDate: params[4],
            pageSize: params[5],
            pageIndex: params[6],
            payStatus: params[7],
            callbackStatus: params[8]
          };
        }
      },
      // 获取当前用户学校列表( 模糊查询 )
      getFuzzySchoolList: {
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetCompanysByKeyWord",
        requestParams: function (params) {
          return {
            token: params[0],
            keyWord: params[1]
          };
        }
      },
      //获取订单明细列表数据
      GetOrderDetailPage: {
        method: "get",
        requestUrl: urlConfig + "Charge/v3/ChargeManage/GetOrderDetailsPage",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1],
            name: params[2],
            tel: params[3],
            pageSize: params[4],
            pageIndex: params[5],
            orderid: params[6]
          }
        }
      },
      // 退款更新数据库
      refundOderAmount: {
        method: "post",
        requestUrl: urlConfig + "Charge/v3/ChargeManage/RefundStuPartAmount?token=" + APPMODEL.Storage.getItem('copPage_token'),
        requestParams: function (params) {
          return {
            ID: params[0],
            Desc: params[1],
            RefundAmount: params[2]
          }
        }
      },
      // 获取服务包
      GetAllProductList: {
        method: "get",
        requestUrl: urlConfig + "Charge/v3/Charge/GetAllProductListByGid?token=" + APPMODEL.Storage.getItem('copPage_token'),
        requestParams: function (params) {
          return {
            gid: params[0],
            classid: params[1]
          }
        }
      },
      changeProduct: {
        method: "post",
        requestUrl: urlConfig + "Charge/v3/ChargeManage/ChangeOrderProduct?token=" + APPMODEL.Storage.getItem('copPage_token'),
        requestParams: function (params) {
          return {
            ID: params[0],
            FuncServiceProductID: params[1],
            Desc: params[2]
          }
        }
      }
    };
    return service;
  };
  service.applicationFee = applicationFeeService();
  /**
   * 学校设备
   */
  var schoolEquipmentService = function () {
    var service = {
      //获取学校设备列表
      GetEquipmentList: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/Equipment/GetEquipmentList",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1]
          };
        }
      },
      //添加/更新设备
      AddOrUpEquipment: {
        method: "post",
        requestUrl: urlConfig + "OCS/v3/Equipment/AddOrUpEquipment?token=" + APPMODEL.Storage.getItem('copPage_token'),
        requestParams: function (params) {
          return {
            ID: params[0],
            GID: params[1],
            Name: params[2],
            ENO: params[3],
            EquipmentType: params[4],
            AppID: params[5],
            EquipmentSetList: params[6]
          }
        }
      },
      //根据设备ID获取设备信息
      getEquipment: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/Equipment/GetEquipment",
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          };
        }
      },
      //发起App更新升级
      UpgradeApp: {
        method: "post",
        requestUrl: urlConfig + "OCS/v3/Equipment/UpgradeApp",
        requestParams: function (params) {
          return {
            IDList: params[0],
            AppUrl: params[1]
          }
        },
        requestPost: function (params) {
          return {
            token: params[0]
          }
        }
      },
      //根据设备ID删除设备
      DeleteEquipment: {
        method: "post",
        requestUrl: urlConfig + "OCS/v3/Equipment/DeleteEquipment",
        requestPost: function (params) {
          return {
            token: params[0],
            id: params[1]
          }
        }
      },
      //硬件在线率报表,当在线率低于90%的时候红色预警
      GetEquipmentOnlineList: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/BaseSet/GetEquipmentOnlineList",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1]
          }
        }
      }
    };
    return service;
  };
  service.schoolEquipment = schoolEquipmentService();
  /**
   * 短信
   */
  var messageService = function () {
    var service = {
      //获取短信发送规则清单(通用和特殊一个集合返回)
      GetInfoSmsSendRules: {
        method: "get",
        requestUrl: urlConfig + "info/v3/OpenAppSms/GetInfoSmsSendRules",
        requestParams: function (params) {
          return {
            token: params[0],
            partnerID: params[1],
            topGID: params[2],
            pSize: params[3],
            pIndex: params[4]
          };
        }
      },
      //获取短信接收规则清单(通用和特殊一个集合返回)
      GetInfoSmsRvRules: {
        method: "get",
        requestUrl: urlConfig + "info/v3/OpenAppSms/GetInfoSmsRvRules",
        requestParams: function (params) {
          return {
            token: params[0],
            partnerID: params[1],
            topGID: params[2],
            pSize: params[3],
            pIndex: params[4]
          };
        }
      },
      //保存单个学校的短信发送规则
      SaveInfoSmsSendRulesForTopGrp: {
        method: "post",
        requestUrl: urlConfig + "info/v3/OpenAppSms/SaveInfoSmsSendRulesForTopGrp?token=" + APPMODEL.Storage.getItem('applicationToken'),
        requestPost: function (params) {
          return {
            topGID: params[0],
            uID: params[1]
          }
        },
        requestParams: function (params) {
          return {
            CommRules: params[0],
            SpecRules: params[1]
          }
        }
      },
      //保存单个学校的短信接收规则
      SaveInfoSmsRvRulesForTopGrp: {
        method: "post",
        requestUrl: urlConfig + "info/v3/OpenAppSms/SaveInfoSmsRvRulesForTopGrp?token=" + APPMODEL.Storage.getItem('applicationToken'),
        requestPost: function (params) {
          return {
            topGID: params[0],
            uID: params[1]
          }
        },
        requestParams: function (params) {
          return {
            CommRules: params[0],
            SpecRules: params[1]
          }
        }
      },
      //获取机构下员工【学校：老师/企业：职员】集合
      GetMembers: {
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetMembers",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1]
          };
        }
      },
      //根据学校ID获取短信发送规则供编辑的聚合model
      GetInfoSmsSendRulesByTopGrp: {
        method: "get",
        requestUrl: urlConfig + "info/v3/OpenAppSms/GetInfoSmsSendRulesByTopGrp",
        requestParams: function (params) {
          return {
            token: params[0],
            topGID: params[1]
          };
        }
      },
      //根据学校ID获取短信接收规则供编辑的聚合model
      GetInfoSmsRvRulesByTopGrp: {
        method: "get",
        requestUrl: urlConfig + "info/v3/OpenAppSms/GetInfoSmsRvRulesByTopGrp",
        requestParams: function (params) {
          return {
            token: params[0],
            topGID: params[1]
          };
        }
      },
      //获取学校下的班级集合
      getSchClasses: {
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetSchClasses",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1]
          };
        }
      },
      //根据用户设置的模板预览最终短信
      GetPreviewInfoSms: {
        method: "get",
        requestUrl: urlConfig + "info/v3/OpenAppSms/GetPreviewInfoSms",
        requestParams: function (params) {
          return {
            token: params[0],
            suffCont: params[1],
            contSmsCnt: params[2],
            mainCont: params[3],
            grpName: params[4]
          };
        }
      },
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
      // 获取当前用户学校列表( 模糊查询 )
      getFuzzySchoolList: {
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetCompanysByKeyWord",
        requestParams: function (params) {
          return {
            token: params[0],
            keyWord: params[1]
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
   * 用户管理
   */
  var userManagement = function () {
    var service = {
      //获取所有用户菜单分页
      GetUserMenuPage: {
        method: "get",
        requestUrl: urlConfig + "COP/v3/User/GetUserMenuPage",
        requestParams: function (params) {
          return {
            token: params[0],
            orgid: params[1],
            name: params[2],
            menuname: params[3],
            pSize: params[4],
            pIndex: params[5]
          };
        }
      },
        //获取当前合作伙伴是否有学校权限列表
        GetPageAdminAccessGroups: {
            method: "get",
            requestUrl: urlConfig + "sns/v3/Web/GetPageAdminAccessGroups",
            requestParams: function (params) {
                return {
                    token: params[0],
                    pid: params[1],
                    uid: params[2],
                    rid: params[3],
                    keyword:params[4],
                    isHaveAccess:params[5],
                    pageSize: params[6],
                    pageIndex: params[7]
                };
            }
        },
        //获取所有用户菜单 2017/10/13
        GetMenusByOrgUIDNew: {
            method: "get",
            requestUrl: urlConfig + "COP/v3/Web/GetMenusByOrgUID",
            requestParams: function (params) {
                return {
                    token: params[0],
                    orgid: params[1],
                    uid: params[2],
                    orgLevel: params[3],
                };
            }
        },
        //获取省市区 2017/10/13
        GetRegionList: {
            method: "get",
            requestUrl: urlConfig + "base/v3/Web/GetRegionList",
            requestParams: function (params) {
                return {
                    token: params[0],
                    rid: params[1]
                };
            }
        },
        //添加合作伙伴学校权限
        AddGroupAdmins: {
            method: "post",
            requestUrl: urlConfig + "sns/v3/Web/AddGroupAdmins?token=" + APPMODEL.Storage.copPage_token,
            requestPost: function (params) {
                return {
                    pid: params[0],
                    adminUID: params[1],
                };
            },
            requestParams: function (params) {
                return {
                    '': params[0],
                };
            }
        },
        //删除合作伙伴学校权限
        DeleteOrgAdminGroup: {
            method: "post",
            requestUrl: urlConfig + "sns/v3/Web/DeleteOrgAdminGroup?token=" + APPMODEL.Storage.copPage_token,
            requestPost: function (params) {
                return {
                    pid: params[0],
                    adminUID: params[1],
                };
            },
            requestParams: function (params) {
                return {
                    '': params[0],
                };
            }
        },
        //添加用户菜单
        AddUserMenuNew: {
            method: "post",
            requestUrl: urlConfig + "COP/v3/Web/AddUserMenu?token=" + APPMODEL.Storage.copPage_token,
            requestPost: function (params) {
                return params;
            },
            requestParams: function (params) {
                return {
                    MenuID: params[0],
                    OrgID: params[1],
                    UID: params[2],
                    OrgLevel: params[3]
                };
            }
        },
        //删除用户菜单
        DeleteUserMenuNew: {
            method: "post",
            requestUrl: urlConfig + "COP/v3/Web/DeleteUserMenu?token=" + APPMODEL.Storage.copPage_token,
            requestParams: function (params) {
                return {
                    MenuID: params[0],
                    OrgID: params[1],
                    UID: params[2],
                    OrgLevel: params[3]
                };
            }
        },
      //删除用户菜单
      DeleteUserMenu: {
        method: "post",
        requestUrl: urlConfig + "COP/v3/User/DeleteUserMenu?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            uid: params[0],
            orgid: params[1],
            menuid: params[2]
          };
        },
        requestParams: function (params) {
          return params;
        }
      },
      //获取组织下的所有用户
        GetOrgAdmin: {
        method: "get",
        requestUrl: urlConfig + "sns/v3/Web/GetOrgAdmin",
        requestParams: function (params) {
          return {
            token: params[0],
            orgID: params[1],
            level: params[2]
          };
        }
      },
      //获取用户个人的菜单权限
      GetMenusByOrgUID: {
        method: "get",
        requestUrl: urlConfig + "COP/v3/User/GetMenusByOrgUID",
        requestParams: function (params) {
          return {
            token: params[0],
            orgid: params[1],
            uid: params[2]
          };
        }
      },
      //给用户添加菜单
      AddUserMenu: {
        method: "post",
        requestUrl: urlConfig + "COP/v3/Web/AddUserMenu?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
              UID: params[0],
              OrgID: params[1],
              MenuID: params[2],
              OrgLevel:params[3],
          };
        }
      }
    };
    return service;
  };
  service.userManagement = userManagement();
  /**
   * 菜单管理
   */
  var menuManagementService = function () {
    var service = {
      //获取菜单定义分页数据
      GetPageMenuSet: {
        method: "get",
        requestUrl: urlConfig + "COP/v3/Menu/GetPageMenuSet",
        requestParams: function (params) {
          return {
            token: params[0],
            orgType: params[1],
            st: params[2],
            name: params[3],
            pMenuName: params[4],
            pSize: params[5],
            pIndex: params[6]
          };
        }
      },
      //添加或修改菜单定义
      AddOrUpMenu: {
        method: "post",
        requestUrl: urlConfig + "COP/v3/Menu/AddOrUpMenu",
        requestParams: function (params) {
          return {
            ID: params[0],
            Name: params[1],
            ST: params[2],
            Url: params[3],
            Level: params[4],
            PMenuID: params[5],
            OrgType: params[6],
            Seq: params[7]
          };
        },
        requestPost: function (params) {
          return {
            token: params[0]
          };
        }
      }
    };
    return service;
  };
  service.menuManagement = menuManagementService();
  /**
   * 通知作业--报表查询
   */
  var notificationSentQuery = function () {
    var service = {
      //查询信息发送情况
      GetInfoSendRpt: {
        method: "get",
        requestUrl: urlConfig + "info/v3/OpenAppInfoRpt/GetInfoSendRpt",
        requestParams: function (params) {
          return {
            token: params[0],
            topGID: params[1],
            sendName: params[2],
            dtFrm: params[3],
            dtTo: params[4],
            pageSize: params[5],
            pageIndex: params[6]
          };
        }
      },
      //查询信息接收情况
      GetInfoRvRpt: {
        method: "get",
        requestUrl: urlConfig + "info/v3/OpenAppInfoRpt/GetInfoRvRpt",
        requestParams: function (params) {
          return {
            token: params[0],
            topGID: params[1],
            sendName: params[2],
            rvName: params[3],
            dtFrm: params[4],
            dtTo: params[5],
            pageSize: params[6],
            pageIndex: params[7]
          };
        }
      }
    };
    return service;
  };
  service.notification = notificationSentQuery();
    /**
     * 圈子--报表查询
     */
    var friendCircleRptSentQuery = function () {
        var service = {
            //查询学校报表
            GetSchoolRpt: {
                method: "get",
                requestUrl: urlConfig + "fblog/v3/FBlogWeb/GetSchoolTopics",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        dtFrm: params[1],
                        dtTo: params[2],
                        rid: params[3],
                        keyword: params[4]
                    };
                }
            },
            //查询班级报表
            GetClassRpt: {
                method: "get",
                requestUrl: urlConfig + "fblog/v3/FBlogWeb/GetClassTopics",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        dtFrm: params[1],
                        dtTo: params[2],
                        rid: params[3],
                        keyword: params[4]
                    };
                }
            }
        };
        return service;
    };
    service.friendCircle = friendCircleRptSentQuery();
  /**
   * 营养健康
   */
  var nutritionHealth = function () {
    var service = {
      // 获取营养健康量表列表
      getScaleList: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/GetScales?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            PIndex: params[0],
            PSize: params[1],
            name: params[2],
            Origion: params[3],
            ST: params[4]
          }
        }
      },
      // 删除量表
      deletScale: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/Remove?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            id: params[0]
          }
        }
      },
      // 判断是否能够修改量表
      judgeUpdateScale: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/JudgeScaleModify?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            id: params[0]
          }
        }
      },
      // 撤销或者发布量表
      publishScale: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/PublishOrReverseScales?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            scaID: params[0],
            state: params[1]
          }
        }
      },
      // 新增量表基本信息
      addScaleBasicInfo: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/Scale/AddOrModifyScaleDefine?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            Name: params[1],
            Origion: params[2],
            Instro: params[3],
            Notice: params[4],
            Remark: params[5]
          }
        }
      },
      // 获取量表的基本信息
      getScaleBasicInfo: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/GetSingleScale?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            scaID: params[0]
          }
        }
      },
      // 获取用户属性
      getScaleAttribute: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/GetNutriProperties?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            scaID: params[0]
          };
        }
      },
      // 修改用户属性
      addScaleAttribute: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/Scale/AddOrModifyProperties?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ScaleProperties: params[0]
          }
        }
      },
      // 获取量表题库清单
      getScaleQuestions: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/GetQuestions?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            scaID: params[0]
          };
        }
      },
      // 添加量表题库
      addQuestions: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/Scale/AddQuestion?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            Questiones: params[0]
          }
        }
      },
      // 删除单个题
      deletQuestion: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/RemoveQuestion?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            questionID: params[0]
          }
        }
      },
      // 修改单个题
      updateQuestions: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/Scale/ModifyQuestion?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            ScaID: params[1],
            SeqNo: params[2],
            Title: params[3],
            ImgUrl: params[4],
            MinAnswer: params[5],
            MaxAnswer: params[6],
            Options: params[7]
          }
        }
      },
      // 获取量表因子清单
      getScaleFactors: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/GetFactors?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            scaID: params[0]
          }
        }
      },
      // 修改量表因子
      updateFactors: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/Scale/AddOrModifyFactor?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            ScaID: params[1],
            LstSqeNo: params[2],
            Name: params[3],
            Rule: params[4],
            Remark: params[5],
            StandardScore: params[6],
            Type: params[7],
            MinFirst: params[8],
            MaxFirst: params[9],
            MinSecond: params[10],
            MaxSecond: params[11],
            MinThird: params[12],
            MaxThird: params[13],
            Range: params[14]
          }
        }
      },
      // 删除量表因子
      deletFactor: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/RemoveFactor?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            id: params[0]
          }
        }
      },
      // 获取量表因子解释
      getFactorsExplain: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/GetFactorDesc?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            scaID: params[0],
            pIndex: params[1],
            pSize: params[2]
          }
        }
      },
      // 添加因子解释
      addFactorExplain: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/Scale/AddFactorDesc?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            FactorDescs: params[0]
          }
        }
      },
      // 修改因子解释
      updateFactorExplain: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/Scale/ModifyFactorDesc?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            ScaID: params[1],
            FactorID: params[2],
            FactorName: params[3],
            MinScore: params[4],
            MaxScore: params[5],
            Sex: params[6],
            MinAge: params[7],
            MaxAge: params[8],
            Desc: params[9]
          }
        }
      },
      // 删除因子解释
      deletFactorExplain: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/RemoveFactorDesc?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            id: params[0]
          }
        }
      },
      // 检测量表的完整性
      checkScalePerfect: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/CheckScalePerfect?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            id: params[0]
          }
        }
      },
      // 生成量表（量表静态化）
      scaleStatic: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/ScaleStatic?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            id: params[0]
          }
        }
      },
      //获取学校测试任务
      GetTestTask: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Test/GetTestTask",
        requestParams: function (params) {
          return {
            token: params[0],
            topGID: params[1],
            isSchool: params[2],
            name: params[3],
            state: params[4],
            pSize: params[5],
            pIndex: params[6]
          };
        }
      },
      //添加测试任务（订单）
      AddSchoolOrder: {
        method: 'post',
        requestUrl: urlConfig + "Nutri/v3/Test/AddSchoolOrder",
        requestPost: function (params) {
          return {
            token: params[0]
          }
        },
        requestParams: function (params) {
          return {
            Name: params[0],
            TopGID: params[1],
            ScaID: params[2],
            BDate: params[3],
            EDate: params[4],
            Desc: params[5]
          };
        }
      },
      //获取量表清单
      GetScales: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Scale/GetScales",
        requestParams: function (params) {
          return {
            token: params[0]
          };
        }
      },
      //发送消息提醒
      GetNotifications: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Test/GetNotifications",
        requestParams: function (params) {
          return {
            token: params[0],
            orderId: params[1]
          };
        }
      },
      //获取已测试人员清单
      GetTestPeople: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Test/GetTestPeople",
        requestParams: function (params) {
          return {
            token: params[0],
            topGID: params[1],
            orderID: params[2],
            classID: params[3],
            umid: params[4],
            dateFrom: params[5],
            dateTo: params[6],
            pSize: params[7],
            pIndex: params[8]
          };
        }
      },
      // 获取已测试的学生
      getHastestStudentList: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Test/GetTestPeopel',
        requestParams: function (params) {
          return {
            token: params[0],
            orderId: params[1],
            topGID: params[2],
            classId: params[3]
          }
        }
      },
      // 按量表获取因子清单
      GetFactors: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Scale/GetFactors',
        requestParams: function (params) {
          return {
            token: params[0],
            scaID: params[1]
          }
        }
      },
      // 9.	根据学生UMID获取柱状图数据
      GetStuBarGraphDataByUMID: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Chart/GetStuBarGraphDataByUMID',
        requestParams: function (params) {
          return {
            token: params[0],
            orderId: params[1],
            classId: params[2],
            umid: params[3]
          }
        }
      },
      // 根据学校或班级按照性别获取图表统计数据
      GetSexBarGraphBySex: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Chart/GetSexBarGraphBySex',
        requestParams: function (params) {
          return {
            token: params[0],
            orderId: params[1],
            classId: params[2],
            factorStatus: params[3]
          }
        }
      },
      // 根据学校或班级与性别按照因子获取图表统计数据
      GetPieByFactorOrSex: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Chart/GetPieByFactorOrSex',
        requestParams: function (params) {
          return {
            token: params[0],
            orderId: params[1],
            classId: params[2],
            sex: params[3],
            factorId: params[4]
          }
        }
      },
      // 根据学校或班级与性别及年龄端按照因子获取图表统计数据
      GetPieByFactorOrAge: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Chart/GetPieByFactorOrAge',
        requestParams: function (params) {
          return {
            token: params[0],
            orderId: params[1],
            classId: params[2],
            sex: params[3],
            factorId: params[4],
            minAge: params[5],
            maxAge: params[6]
          }
        }
      },
      //根据班级获取学生列表
      GetStudents: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/ClassRollCallH5/GetStuList",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1],
            classID: params[2]
          };
        }
      },
      //删除未开始的任务（订单）
      RemoveSchoolOrder: {
        method: 'post',
        requestUrl: urlConfig + "Nutri/v3/Test/RemoveSchoolOrder",
        requestPost: function (params) {
          return {
            token: params[0],
            orderId: params[1]
          }
        }
      },
      //获取测试人员结果
      GetTestResult: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Test/GetTestResult",
        requestParams: function (params) {
          return {
            token: params[0],
            recordID: params[1]
          };
        }
      },
      //营养健康banner设置
      getBannerPages: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Banner/GetBannerPages?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            pageIndex: params[0],
            pageSize: params[1],
            name: params[2],
            state: params[3],
            type: params[4]
          };
        }
      },
      //新增营养健康全网
      AddBanner: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/Banner/AddBanner?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            Name: params[1],
            Url: params[2],
            ImgUrl: params[3],
            BDate: params[4],
            EDate: params[5],
            CDate: params[6],
            Type: params[7],
            UID: params[8]
          }
        }
      },
      //修改营养健康banner内容
      changeBanner: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/Banner/UpdateBanner?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            Name: params[1],
            Url: params[2],
            ImgUrl: params[3],
            BDate: params[4],
            EDate: params[5],
            CDate: params[6],
            Type: params[7],
            UID: params[8]
          }
        }
      },
      //删除营养健康banner
      deleteBanner: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/Banner/RemoveBanner?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0]
          }
        }
      },
      //获取营养健康所有文章
      getAllNutriArticle: {
        method: "get",
        requestUrl: APPMODEL.PHPConfig.yyjkUrl + "api.php?op=cop&action=data_list&token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            app_id: params[0],
            title: params[1],
            catid: params[2],
            start_time: params[3],
            end_time: params[4],
            page: params[5],
            pl: params[6]
          }
        }
      },
      //删除营养健康文章
      deleteArticle: {
        method: "get",
        requestUrl: APPMODEL.PHPConfig.yyjkUrl + "api.php?op=cop&action=data_delete&token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            app_id: params[0],
            id: params[1]
          }
        }
      },
      //首页展示营养健康文章
      showHome: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/HomeContent/AddHomeContent?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            Title: params[1],
            ImgUrl: params[2],
            Column: params[3],
            Url: params[4],
            CMSID: params[5],
            UID: params[6],
            CDate: params[7],
            Sort: params[8]
          }
        }
      },
      //获取所有主页列表信息
      GetHomeContentPages: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/HomeContent/GetHomeContentPages",
        requestParams: function (params) {
          return {
            token: params[0],
            title: params[1],
            column: params[2],
            pageIndex: params[3],
            pageSize: params[4]
          }
        }
      },
      //获取专家列表
      GetExpertPages: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Expert/GetExpertPages",
        requestParams: function (params) {
          return {
            token: params[0],
            name: params[1],
            tel: params[2],
            pageIndex: params[3],
            pageSize: params[4]
          }
        }
      },
      //通过电话号码关联专家UID
      SetRelationByTel: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Expert/UpdateExpertUIDByTel",
        requestPost: function (params) {
          return {
            token: params[0]
          }
        }
      },
      //设置专家顺序值
      SetExpertSort: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/Expert/SetExpertSort",
        requestPost: function (params) {
          return {
            token: params[0],
            id: params[1],
            sort: params[2]
          }
        }
      },
      //删除专家
      RemoveExpert: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/Expert/RemoveExpert",
        requestPost: function (params) {
          return {
            token: params[0],
            id: params[1]
          }
        }
      },
      //获取营养健康下所有栏目列表
      GetColumnList: {
        method: "get",
        requestUrl: APPMODEL.PHPConfig.yyjkUrl + "api.php?op=cop&action=cate_list",
        requestParams: function (params) {
          return {
            token: params[0],
            app_id: params[1]
          }
        }
      },
      //删除记录
      RemoveHomeContent: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/HomeContent/RemoveHomeContent",
        requestParams: function (params) {
          return {
            token: params[0],
            CMSID: params[1]
          }
        }
      },
      //根据营养专家ID获取详细信息
      GetExpertByID: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Expert/GetExpertByID",
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          }
        }
      },
      //添加或修改专家信息（model.ID为0则为增加）
      AddOrModifyExpert: {
        method: "post",
        requestUrl: urlConfig + "Nutri/v3/Expert/AddOrModifyExpert",
        requestParams: function (params) {
          return {
            ID: params[0],
            Name: params[1],//专家姓名
            Instro: params[2],//简介
            Title: params[3],//认证
            Label: params[4],//标签
            HeadPicUrl: params[5],//头像图片地址
            Cont: params[6],//详细介绍(HTML文本）
            Sort: params[7],//排序值
            PrinviceID: params[8],//省编号
            CityID: params[9],//市编号
            AreaID: params[10],//地区编号
            Addr: params[11],//地址
            Tel: params[12],//手机号
            UID: params[13]
          }
        },
        requestPost: function (params) {
          return {
            token: params[0]
          };
        }
      },
      /* --------- 基础字典 - 身高参考  --------- */
      // 获取身高参考列表
      getDictHeightPages: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Dict/GetDictHeightPages',
        requestParams: function (params) {
          return {
            token: params[0],
            pageIndex: params[1],
            pageSize: params[2],
            monthAge: params[3], //月龄 0所有
            sex: params[4] // 0所有，1男，2女，3未知
          }
        }
      },
      // 新增修改身高参考
      saveDictHeight: {
        method: 'post',
        requestUrl: urlConfig + 'Nutri/v3/Dict/AddOrModifyDictHeight?token=' + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      },
      // 删除身高参考
      delDictHeight: {
        method: 'post',
        requestUrl: urlConfig + 'Nutri/v3/Dict/RemoveDictHeight',
        requestPost: function (params) {
          return {
            token: params[0],
            id: params[1]
          }
        }
      },
      // 根据id获取单个身高参考
      getSingleDictHeight: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Dict/GetDictHeightByID',
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          }
        }
      },
      /* --------- 基础字典 - 体重参考  --------- */
      // 获取体重参考列表
      getDictWeightPages: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Dict/GetDictWeightPages',
        requestParams: function (params) {
          return {
            token: params[0],
            pageIndex: params[1],
            pageSize: params[2],
            monthAge: params[3], //月龄 0所有
            sex: params[4] // 0所有，1男，2女，3未知
          }
        }
      },
      // 新增修改体重参考
      saveDictWeight: {
        method: 'post',
        requestUrl: urlConfig + 'Nutri/v3/Dict/AddOrModifyDictWeight?token=' + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      },
      // 删除体重参考
      delDictWeight: {
        method: 'post',
        requestUrl: urlConfig + 'Nutri/v3/Dict/RemoveDictWeight',
        requestPost: function (params) {
          return {
            token: params[0],
            id: params[1]
          }
        }
      },
      // 根据id获取单个体重参考
      getSingleDictWeight: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Dict/GetDictWeightByID',
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          }
        }
      },
      /* --------- 基础字典 - 服务列表  --------- */
      // 获取服务列表
      getServicePages: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Service/GetServicePages',
        requestParams: function (params) {
          return {
            token: params[0],
            pageIndex: params[1],
            pageSize: params[2],
            st: params[3],
            name: params[4]
          }
        }
      },
      // 删除服务
      delService: {
        method: 'post',
        requestUrl: urlConfig + 'Nutri/v3/Service/RemoveService',
        requestPost: function (params) {
          return {
            token: params[0],
            id: params[1]
          }
        }
      },
      // 新增服务
      saveService: {
        method: 'post',
        requestUrl: urlConfig + 'Nutri/v3/Service/AddOrModifyService?token=' + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      },
      // 根据id获取服务详细
      getSingleService: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Service/GetServiceByID',
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          }
        }
      },
      /* --------- 用户订单 --------- */
      // 获取订单列表
      getUserOrderPages: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Order/GetUserOrderPages',
        requestParams: function (params) {
          return {
            token: params[0],
            pageIndex: params[1],
            pageSize: params[2],
            sDate: params[3],
            eDate: params[4],
            tel: params[5],
            payST: params[6],
            serviceID: params[7]
          }
        }
      },
      // 专家导测 根据用户订单id获取用户提问信息
      getTestQuestion: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Order/GetTestQuestionByUserOrderID',
        requestParams: function (params) {
          return {
            token: params[0],
            userOrderID: params[1]
          }
        }
      },
      // 根据订单获取测试人员结果
      getTestResult: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/Order/GetTestResultByOrderId',
        requestParams: function (params) {
          return {
            token: params[0],
            orderId: params[1]
          }
        }
      },
      /* --------- 家庭成员 --------- */
      // 获取家庭成员
      getFamilyMember: {
        method: 'get',
        requestUrl: urlConfig + 'Nutri/v3/FimalyMember/GetFimalyMemberPages',
        requestParams: function (params) {
          return {
            token: params[0],
            pageIndex: params[1],
            pageSize: params[2],
            tel: params[3],
            name: params[4]
          }
        }
      },
      /* ---------------获取未测试学生清单--------------- */
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
      getUnTestPeople: {
        method: "get",
        requestUrl: urlConfig + "Nutri/v3/Test/GetUnTestPeople",
        requestParams: function (params) {
          return {
            token: params[0],
            pIndex: params[1],
            pSize: params[2],
            topGID: params[3],
            orderID: params[4],
            classID: params[5],
            umid: params[6]
          };
        }
      }
    };
    return service;
  };
  service.nutritionHealth = nutritionHealth();
  /**
   * 心理评测
   */
  var psychologicalEvaluationService = function () {
    var service = {
      /** ----- 心理量表管理 ----------------------------------------*/
      // 发布撤销量表
      releaseScale: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/SetScaleST?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            scaID: params[0],
            st: params[1]
          }
        }
      },
      // 删除量表
      removeScale: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/Remove?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0]
          }
        }
      },
      // 判断量表是否能修改
      judgeScaleModify: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/JudgeScaleModify?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            id: params[0]
          }
        }
      },
      // 获取心理量表列表
      getPsychScale: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/GetScalePage",
        requestParams: function (params) {
          return {
            token: params[0],
            PIndex: params[1],
            PSize: params[2],
            name: params[3],
            Origion: params[4],
            ST: params[5]
          };
        }
      },
      // 获取选中量表基本信息
      getPhySingleScale: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/GetScale",
        requestParams: function (params) {
          return {
            token: params[0],
            scaID: params[1]
          };
        }
      },
      // 获取量表用户属性
      getPhyProperties: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/GetScaleProperties",
        requestParams: function (params) {
          return {
            token: params[0],
            scaID: params[1]
          };
        }
      },
      // 根据量表ID获取题库
      getPhyQuestions: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/GetQuestions",
        requestParams: function (params) {
          return {
            token: params[0],
            scaID: params[1]
          };
        }
      },
      // 提交量表基本信息
      saveScaleDefine: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/AddOrUpScale?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            Name: params[1],
            Origion: params[2],
            Instro: params[3],
            Notice: params[4],
            ImgUrl: params[5],
            MType: params[6],
            Remark: params[7],
            CDate: params[8],
            ST: params[9],
            Url: params[10],
            IsProduct: params[11]
          };
        }
      },
      // 提交量表属性
      saveScaleProperties: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/AddOrModifyProperties?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      },

      // 提交量表题库
      saveScaleQuestions: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/AddQuestion?token=" + APPMODEL.Storage.copPage_token,
        //requestUrl: "http://10.10.12.24/UX.PhySAPI/v3/Scale/AddQuestion?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      },
      // 更新量表题库
      updateScaleSingleQuestion: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/ModifyQuestion?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      },
      // 删除量表题库
      removeScaleQuestion: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/RemoveQuestion?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            questionID: params[0]
          };
        }
      },
      // 根据量表ID获取因子定义
      getPhyFactorDefinition: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/GetFactors",
        requestParams: function (params) {
          return {
            token: params[0],
            scaID: params[1]
          };
        }
      },
      // 提交增加修改因子定义
      saveScaleFactorDefinition: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/AddOrModifyFactor?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      },
      // 删除因子定义
      removeScaleFactorDefinition: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/RemoveFactor?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0]
          };
        }
      },
      // 根据量表ID获取因子异常
      getPhyFactorAnomaly: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/GetFactorExc",
        requestParams: function (params) {
          return {
            token: params[0],
            scaID: params[1]
          };
        }
      },
      // 提交批量增加因子异常
      saveScaleFactorAnomaly: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/AddFactorExc?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      },
      // 修改因子异常
      updateScaleFactorAnomaly: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/ModifyFactorExc?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      },
      // 删除因子异常
      delScaleFactorAnomaly: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/RemoveFactorExc?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0]
          };
        }
      },
      // 根据量表ID获取失效规则
      getScaleInvalid: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/GetScaleInvalidByID",
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          };
        }
      },
      // 提交批量增加失效规则
      saveScaleInvalid: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/AddScaleInvalid?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      },
      // 修改因子异常
      updateScaleInvalid: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/ModifyScaleInvalid?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      },
      // 删除失效规则
      delScaleInvalid: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/RemoveScaleInvalid?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0]
          };
        }
      },
      // 查询因子解释
      getScaleFactorExplain: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/GetFactorDesc",
        requestParams: function (params) {
          return {
            token: params[0],
            scaID: params[1],
            PIndex: params[2],
            PSize: params[3]
          };
        }
      },
      // 提交因子解释
      saveScaleFactorExplain: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/AddFactorDesc?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      },
      // 更新因子解释
      updateScaleFactorExplain: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/ModifyFactorDesc?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      },
      // 更新因子解释
      removeScaleFactorExplain: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/RemoveFactorDesc?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0]
          };
        }
      },
      // 检测量表维护完整性
      checkScalePerfect: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/CheckScalePerfect?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0]
          };
        }
      },
      // 生成量表
      psychologicalScaleStatic: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/ScaleStatic?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0]
          };
        }
      },
      /** ----- 学校测试任务 量表销售 ---------------------------*/
      // 获取组织列表
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
      // 获取当前用户学校列表( 模糊查询 )
      getFuzzySchoolList: {
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetCompanysByKeyWord",
        requestParams: function (params) {
          return {
            token: params[0],
            keyWord: params[1]
          };
        }
      },
      // 根据合作伙伴ID获取学校列表
      getSchoolList: {
        method: "get",
        requestUrl: urlConfig + "COP/v3/Org/GetOrgGroup",
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
      // 获取量表列表
      getScaleList: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/GetScales",
        requestParams: function (params) {
          return {
            token: params[0]
          };
        }
      },
      // 获取测试任务列表
      getTestTask: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Test/GetTestTask",
        requestParams: function (params) {
          return {
            token: params[0],
            pIndex: params[1],
            pSize: params[2],
            topGID: params[3],
            name: params[4],
            state: params[5],
            isSchool: params[6]
          };
        }
      },
      // 添加测试任务订单
      saveSchoolOrder: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Test/AddSchoolOrder?token=" + APPMODEL.Storage.copPage_token,
        //requestUrl: "http://10.10.12.24/PhyS/v3/Test/AddSchoolOrder?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            ScaID: params[1],
            OrgID: params[2],
            TopGID: params[3],
            MType: params[4],
            IsApp: params[5],
            Range: params[6],
            BDate: params[7],
            EDate: params[8],
            Name: params[9],
            Desc: params[10],
            ClsIds: params[11],
            IsSchool: false // 是否为学校添加
          };
        }
      },
      // 删除测试任务
      delTestTask: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Test/RemoveSchoolOrder?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0]
          }
        }
      },
      // 更改显示方式
      changeReportWay: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/SchTest/ChangeReportWay?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0],
            reportWay: params[1]
          };
        }
      },
      // 获取已测试人员清单
      getAlreadyPersonnelTestTask: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Test/GetTestPeople",
        requestParams: function (params) {
          return {
            token: params[0],
            pIndex: params[1],
            pSize: params[2],
            topGID: params[3],
            orderID: params[4],
            classID: params[5],
            umid: params[6],
            dateFrom: params[7],
            dateTo: params[8]
          }
        }
      },
      // 获取测试人员结果
      getPersonnelTestResult: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Test/GetTestResult",
        requestParams: function (params) {
          return {
            token: params[0],
            recordID: params[1]
          };
        }
      },
      // 获取专家列表
      getPsychologicalExperts: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Expert/GetExperts",
        requestParams: function (params) {
          return {
            token: params[0],
            pageIndex: params[1],
            pageSize: params[2],
            name: params[3]
          };
        }
      },
      // 根据心理专家ID获取详细信息
      getSinglePsychologicalExperts: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Expert/GetExpertByID",
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          };
        }
      },
      // 删除专家
      removePsychologicalExperts: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Expert/RemoveExpert?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0]
          };
        }
      },
      // 添加或修改专家信息（model.ID为0则为增加）
      savePsychologicalExpert: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Expert/AddOrModifyExpert?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            Name: params[1],
            Instro: params[2],
            Label: params[3],
            HeadPicUrl: params[4],
            Cont: params[5],
            Sort: params[6]
          }
        }
      },

      /** ----- 心理知识 ----------------------------------------*/
      // 获取心理知识列表
      getKnowledge: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Knowledge/GetKnowledge",
        requestParams: function (params) {
          return {
            token: params[0],
            pageIndex: params[1],
            pageSize: params[2],
            sDate: params[3],
            eDate: params[4],
            title: params[5],
            state: params[6],
            eduStage: params[7]
          };
        }
      },
      // 获取单个心理知识内容
      getSingleKnowledge: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Knowledge/GetByID",
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          };
        }
      },
      // 添加修改心理知识
      savePsychKnowledge: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Knowledge/AddOrModifyKnowledge?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            Type: params[1],
            Title: params[2],
            Instro: params[3],
            ImgUrl: params[4],
            Url: params[5],
            Cont: params[6],
            SDate: params[7],
            EduStage: params[8],
            EDate: params[9]
          };
        }
      },
      // 删除心理知识
      delPsychKnowledge: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Knowledge/RemoveKnowledge?token=" + APPMODEL.Storage.getItem('copPage_token'),
        requestPost: function (params) {
          return {
            id: params[0]
          }
        }
      },
      // 设置专家顺序值
      setPsychKnowledge: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Expert/SetExpertSort?token=" + APPMODEL.Storage.getItem('copPage_token'),
        requestPost: function (params) {
          return {
            id: params[0],
            sort: params[1]
          }
        }
      },
      /** ----- 全网心理资讯 ----------------------------------------*/
      // 获取心理资讯列表
      getPsychInformation: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/News/GetNews",
        requestParams: function (params) {
          return {
            token: params[0],
            pageIndex: params[1],
            pageSize: params[2],
            sDate: params[3],
            eDate: params[4],
            gid: params[5],
            title: params[6],
            state: params[7],
            type: params[8],
            eduStage: params[9]
          };
        }
      },
      // 获取单个心理资讯列表
      getSinglePsychInformation: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/News/GetNewsByID",
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          };
        }
      },
      // 添加修改心理资讯列表
      savePsychInformation: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/News/AddOrModifyNews?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            type: params[1],
            Title: params[2],
            Instro: params[3],
            ImgUrl: params[4],
            Origin: params[5],
            Cont: params[6],
            ST: params[7],
            TopGID: params[8],
            EduStage: params[9]
          };
        }
      },
      // 批量发布/撤销资讯
      releasePsychInformation: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/News/ReleaseNews?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            IDList: params[0],
            ST: params[1]
          };
        }
      },
      // 删除当前选中的心理资讯
      delPsychNews: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/News/RemoveNews?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0]
          }
        }
      },
      // 置顶当前选中的心理资讯
      topPsychNews: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/News/TopNews?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0]
          }
        }
      },
      /* -----获取全网banner信息和学校banner信息------ */
      getAllBanner: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Banner/GetSchlBanners?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            pageIndex: params[0],
            pageSize: params[1],
            topGID: params[2],
            range: params[3],
            name: params[4],
            state: params[5],
            type: params[6]
          }
        }
      },
      /* ----------新增全网banner和学校banner内容-------- */
      AddWholeBanner: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Banner/AddBanner?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            Name: params[1],
            Url: params[2],
            ImgUrl: params[3],
            BDate: params[4],
            EDate: params[5],
            Range: params[6],
            Type: params[7],
            TopGID: params[8],
            Sort: params[9]
          }
        }
      },
      /* ----------修改banner内容-------- */
      changeBanner: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Banner/UpdateBanner?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return {
            ID: params[0],
            Name: params[1],
            Url: params[2],
            ImgUrl: params[3],
            BDate: params[4],
            EDate: params[5],
            Range: params[6],
            Type: params[7],
            TopGID: params[8],
            Sort: params[9]
          }
        }
      },
      /* ----------删除全网banner和学校banner内容-------- */
      deleteBanner: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Banner/RemoveBanner?token=" + APPMODEL.Storage.copPage_token,
        requestPost: function (params) {
          return {
            id: params[0]
          }
        }
      },
      // 获取当前用户学校列表( 模糊查询 )
      getFuzzySchoolList: {
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetCompanysByKeyWord",
        requestParams: function (params) {
          return {
            token: params[0],
            keyWord: params[1]
          };
        }
      },
      //获取量表清单
      GetScales: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/GetScales",
        requestParams: function (params) {
          return {
            token: params[0]
          };
        }
      },
      //获取量表授权清单
      GetScaleAccredit: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/GetScaleAccredit",
        requestParams: function (params) {
          return {
            token: params[0],
            scaId: params[1],
            topGID: params[2],
            pIndex: params[3],
            pSize: params[4]
          };
        }
      },
      //新增量表授权
      AddOrModifyScaleAccredit: {
        method: "post",
        requestUrl: urlConfig + "PhyS/v3/Scale/AddOrModifyScaleAccredit",
        requestParams: function (params) {
          return {
            ID: params[0],
            ScaID: params[1],
            OrgID: params[2],
            TopGID: params[3],
            Desc: params[4],
            ScaName: params[5]
          };
        },
        requestPost: function (params) {
          return {
            token: params[0]
          };
        }
      },
      //删除量表授权
      RemoveScaleAccredit: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/Scale/RemoveScaleAccredit",
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          };
        }
      },
      //根据心理知识ID获取富文本内容
      GetKnowledgeH5ByID: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/BasicInfoH5/GetKnowledgeH5ByID",
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          };
        }
      },
      //根据心理资讯ID获取富文本内容
      GetNewsH5ByID: {
        method: "get",
        requestUrl: urlConfig + "PhyS/v3/BasicInfoH5/GetNewsH5ByID",
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          };
        }
      }
    };
    return service;
  };
  service.psychologicalEvaluation = psychologicalEvaluationService();


  /**
   * 组织机构
   */
  var organizationalInstitutionService = function () {
    var service = {
      //获取组织分页数据
      GetOrgPage: {
        method: "get",
        requestUrl: urlConfig + "COP/v3/Org/GetOrgPage",
        requestParams: function (params) {
          return {
            token: params[0],
            name: params[1],
            type: params[2],
            pSize: params[3],
            pIndex: params[4]
          };
        }
      },
      //根据组织ID获取组织信息
      GetOrg: {
        method: "get",
        requestUrl: urlConfig + "COP/v3/Org/GetOrg",
        requestParams: function (params) {
          return {
            token: params[0],
            orgid: params[1]
          };
        }
      },
      //添加或更新组织信息
      AddOrUpOrg: {
        method: "post",
        requestUrl: urlConfig + "COP/v3/Org/AddOrUpOrg",
        requestPost: function (params) {
          return {
            token: params[0]
          };
        },
        requestParams: function (params) {
          return {
            OrgID: params[0],
            Name: params[1],
            OrgType: params[2],
            ST: params[3],
            Desc: params[4]
          };
        }
      },
      // 获取组织机构列表
      getOrgList: {
        method: 'get',
        requestUrl: urlConfig + "COP/v3/Org/GetOrgList",
        requestParams: function (params) {
          return {
            token: params[0],
            type: params[1]
          }
        }
      },
      // 获取组织机构列表
      getOrgSchoolPage: {
        method: 'get',
        requestUrl: urlConfig + "COP/v3/Org/GetOrgSchoolPage",
        requestParams: function (params) {
          return {
            token: params[0],
            pIndex: params[1],
            pSize: params[2],
            orgid: params[3],
            name: params[4],
            rid: params[5]
          }
        }
      },
      // 删除组织下的学校
      deleteOrgSchool: {
        method: 'post',
        requestUrl: urlConfig + "COP/v3/Org/DeleteOrgSchool",
        requestPost: function (params) {
          return {
            token: params[0],
            orgid: params[1],
            gid: params[2]
          }
        }
      },
      // 根据合作伙伴ID获取学校列表
      getSchoolList: {
        method: "get",
        requestUrl: urlConfig + "COP/v3/Org/GetOrgGroup",
        requestParams: function (params) {
          return {
            token: params[0],
            orgid: params[1]
          };
        }
      },
      // 根据学校名称与市县id获取学校
      getAllGroupByRidOrName: {
        method: 'get',
        requestUrl: urlConfig + "COP/v3/Org/GetAllGroupByRidOrName",
        requestParams: function (params) {
          return {
            token: params[0],
            orgid: params[1],
            gname: params[2],
            rid: params[3]
          }
        }
      },
      // 向组织结构添加学校列表权限
      saveOrgGroup: {
        method: 'post',
        requestUrl: urlConfig + "COP/v3/Org/AddOrgGroup?token=" + APPMODEL.Storage.copPage_token,
        requestParams: function (params) {
          return params;
        }
      }

    };
    return service;
  };
  service.organizationalInstitution = organizationalInstitutionService();
  /**
   * 用户管理
   */
  var userManagementService = function () {
    var service = {
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
        //根据区域云ID和合作伙伴名称查询合作伙伴
        GetPartnersNew: {
            method: "get",
            requestUrl: urlConfig + "sns/v3/Web/GetPartners",
            requestParams: function (params) {
                return {
                    token: params[0],
                    cloudID: params[1],
                };
            }
        },
      //获取组织下的所有用户
      GetSimpleOrgUsers: {
        method: "get",
        requestUrl: urlConfig + "COP/v3/User/GetSimpleOrgUsers",
        requestParams: function (params) {
          return {
            token: params[0],
            orgid: params[1]
          };
        }
      },
      //获取全部组织用户分页
      GetOrgUserPage: {
        method: "get",
        requestUrl: urlConfig + "COP/v3/User/GetOrgUserPage",
        requestParams: function (params) {
          return {
            token: params[0],
            orgid: params[1],
            name: params[2],
            pSize: params[3],
            pIndex: params[4]
          };
        }
      },
      //删除用户组织
      DeleteOrgUser: {
        method: "post",
        requestUrl: urlConfig + "sns/v3/Web/DeleteOrgAdmin",
        requestPost: function (params) {
          return {
            token: params[0],
            ID: params[1],
          };
        }
      },
      //根据手机号获取用户信息
      GetUserByTel: {
        method: "get",
        requestUrl: urlConfig + "base/v3/OpenApp/GetUserByTel",
        requestParams: function (params) {
          return {
            token: params[0],
            tel: params[1]
          };
        }
      },
        //根据手机号获取用户信息
        GetUserByTelNew: {
            method: "get",
            requestUrl: urlConfig + "sns/v3/Web/GetUserByTel",
            requestParams: function (params) {
                return {
                    token: params[0],
                    tel: params[1]
                };
            }
        },
        //给用户添加组织
        AddOrgUserNew: {
            method: "post",
            requestUrl: urlConfig + "sns/v3/Web/AddOrgAdmin",
            requestParams: function (params) {
                return {
                    OrgID: params[0],
                    UID: params[1],
                    Level: params[2],
                };
            },
            requestPost: function (params) {
                return {
                    token: params[0]
                };
            }
        },
      //给用户添加组织
      AddOrgUser: {
        method: "post",
        requestUrl: urlConfig + "COP/v3/User/AddOrgUser",
        requestParams: function (params) {
          return {
            UID: params[0],
            UName: params[1],
            OrgID: params[2],
            OrgName: params[3],
            Tel: params[4]
          };
        },
        requestPost: function (params) {
          return {
            token: params[0]
          };
        }
      },
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
      // 根据关键字模糊查学校列表
      getFuzzyQuerySchool: {
        method: 'get',
        requestUrl: urlConfig + "sns/v3/OpenApp/GetCompanysByKeyWord",
        requestParams: function (params) {
          return {
            token: params[0],
            keyWord: params[1]
          }
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
        //获取电话号码对应的身份
        GetTelMembers:{

            method: 'get',
            requestUrl: urlConfig + "sns/v3/OpenApp/GetTelMembers",
            requestParams: function (params) {
                return {
                    token: params[0],
                    tel: params[1],
                    partnerID: params[2],
                }
            }
        },

        // 取消关联成员身份（不会入队，用于处理老人机问题）
        UnRelateMembers: {
            method: 'post',
            requestUrl: urlConfig + "sns/v3/OpenApp/UnRelateMembers",
            requestPost: function (params) {
                return {
                    token: params[0],
                    partnerID:params[1]
                };
            },
            requestParams: function (params) {
                var arg={
                    '':params[0]
                }
                return arg;
            },
        },
    };
    return service;
  };
  service.userManagementInstitution = userManagementService();
  /**
   * 学校应用管理
   */
  var schoolApplicationManagementService = function () {
    var service = {
      //获取已开通学校列表分页(运营平台设置学校开通功能使用)
      GetGroupSetList: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/BaseSet/GetGroupSetList",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1],
            pSize: params[2],
            pIndex: params[3]
          };
        }
      },
        //合作伙伴学校开通列表
        GetGroup: {
            method: "get",
            requestUrl: urlConfig + "OCS/v3/BaseSet/GetGroupSetListByPartner",
            requestParams: function (params) {
                return {
                    token: params[0],
                    gid: params[1],
                    pSize: params[2],
                    pIndex: params[3],
                    partnerID:params[4]
                };
            }
        },
      //获取业务类型
      GetBusinessType: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/BaseSet/GetBusinessType",
        requestParams: function (params) {
          return {
            token: params[0]
          };
        }
      },
        //获取合作伙伴业务类型
        GetBusinessTypeByPartner: {
            method: "get",
            requestUrl: urlConfig + "OCS/v3/BaseSet/GetBusinessTypeByPartner",
            requestParams: function (params) {
                return {
                    token: params[0],
                    partnerID:params[1]
                };
            }
        },
      //提供给运营平台 1、开通新学校
      AddGroupSet: {
        method: 'post',
        requestUrl: urlConfig + "OCS/v3/BaseSet/UpdateGroupSet",
        requestPost: function (params) {
          return {
            token: params[0]
          }
        },
        requestParams: function (params) {
          return {
            GID: params[0],
            GType: params[1],
            GName: params[2],
            Timeout: params[3],
            OpenBusiness: params[4],
            // GroupBusiness: params[5],
            MorningSupply: params[5],
            IsTel: params[6],
            ClockSmsType: params[7],
            IsOpenExceptionClcok: params[8]
          };
        }
      },
      //获取单个学校数据
      GetGroupSet: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/BaseSet/GetGroupSet",
        requestParams: function (params) {
          return {
            token: params[0],
            companyID: params[1]
          };
        }
      },
      //提供给运营平台 2、修改学校开通业务
      UpdateGroupSet: {
        method: 'post',
        requestUrl: urlConfig + "OCS/v3/BaseSet/UpdateGroupSet",
        requestPost: function (params) {
          return {
            token: params[0]
          }
        },
        requestParams: function (params) {
          return {
            GID: params[0],
            GType: params[1],
            GName: params[2],
            Timeout: params[3],
            OpenBusiness: params[4],
            // GroupBusiness: params[5],
            MorningSupply: params[5],
            IsTel: params[6],
            ClockSmsType: params[7],
            IsOpenExceptionClcok: params[8]
          };
        }
      }
    };
    return service;
  };
  service.schoolApplicationManagement = schoolApplicationManagementService();
  /**
   * 江西禁毒权限设置
   */
  var jiangxiDrugcontrol = function () {
    var service = {
      //获取单个学校list
      GetSchools: {
        method: "get",
        requestUrl: urlConfig + "ADE/v3/OnLineInit/GetSchools",
        requestParams: function (params) {
          return {
            token: params[0],
            name:params[1]
          };
        }
      },
      // 获取教师list
      GetStaff: {
        method: "get",
        requestUrl: urlConfig + "ADE/v3/OnLineInit/GetStaff",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1]
          };
        }
      },
      // 获取禁毒机构list
      GetGroups: {
        method: "get",
        requestUrl: urlConfig + "ADE/v3/OnLineInit/GetGroups",
        requestParams: function (params) {
          return {
            token: params[0]
          };
        }
      },
      // 分配禁毒后台管理权限
      InitManager: {
        method: "post",
        requestUrl: urlConfig + "ADE/v3/OnLineInit/InitManager?token=" + APPMODEL.Storage.getItem("copPage_token"),
        requestParams: function (params) {
          return {
            GID: params[0],
            Name: params[1],
            Tel: params[2],
            IsGroupManager: params[3],
            IsAccountManager: params[4],
            IsADEManager: params[5]
          };
        }
      },
      // 学校报表权限分配
      SetAppAuth: {
        method: "get",
        requestUrl: urlConfig + "ADE/v3/OnLineInit/SetAppAuth",
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1],
            uid: params[2],
            supAppId: params[3],
            isSubscribe: params[4]
          };
        }
      },
      // 分页获取管理员注册列表
      GetRegisterList: {
        method: "get",
        requestUrl: urlConfig + "ADE/v3/OnLineInit/GetRegisterList",
        requestParams: function (params) {
          return {
            token: params[0],
            pageSize: params[1],
            pageIndex: params[2],
            gname: params[3],
            realName: params[4],
            tel: params[5],
            status: params[6]
          };
        }
      },
      // 学校管理员审核
      ManagerJudge: {
        method: "post",
        requestUrl: urlConfig + "ADE/v3/OnLineInit/ManagerJudge?token=" + APPMODEL.Storage.getItem("copPage_token"),
        requestPost: function (params) {
          return {
            id: params[0],
            status: params[1],
            remark: params[2]
          };
        }
      },
      // 分页获取管理员注册列表
      BeforeCheck: {
        method: "get",
        requestUrl: urlConfig + "ADE/v3/OnLineInit/BeforeCheck",
        requestParams: function (params) {
          return {
            token: params[0],
            id:params[1]
          };
        }
      },
      // 获取通用短信发送记录
      GetCommonSmsPage: {
        method: "get",
        requestUrl: urlConfig + "ADE/v3/Sms/GetCommonSmsPage",
        requestParams: function (params) {
          return {
            token: params[0],
            pageSize: params[1],
            pageIndex: params[2],
            tel: params[3]
          };
        }
      },
      // 通用发送短信
      SendCommonSms: {
        method: "post",
        requestUrl: urlConfig + "ADE/v3/Sms/SendCommonSms",
        requestParams: function (params) {
          return params;
        },
        requestPost: function (params) {
          return {token: params[0]}
        }
      },
    };
    return service;
  };
  service.jiangxiDrugcontrol = jiangxiDrugcontrol();
/*
*  基础数据设置管理*/
  var basicDataControl = function () {
    var service = {
      //获取所有刷卡场景
      GetClockTypeList: {
        method: "get",
        requestUrl: urlConfig + "OCS/v3/ClockTime/GetClockTypeList",
        requestParams: function (params) {
          return {
            token: params[0],
          };
        }
      },
    }
    return service;
  };
  service.basicDataControlService = basicDataControl();
  return service;

}]);
